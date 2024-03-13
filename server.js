const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const base64 = require('base64-js');
require('dotenv').config();
const ElevenLabs = require("elevenlabs-node");
const app = express();
const port = 3001;

app.use(cors()); // Enable CORS voor alle routes
app.use(express.json());

const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
const voice = new ElevenLabs({
  apiKey: elevenLabsApiKey, // Your API key from Elevenlabs
  voiceId: "TX3LPaxmHKxFdv7VOQHJ", // A Voice ID from Elevenlabs
});

app.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;

  try {
    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer(); // Afbeeldingsgegevens ophalen als een buffer
    res.set('Content-Type', response.headers.get('content-type'));
    res.send(imageBuffer);
  } catch (error) {
    // console.error('Fout bij het ophalen van de afbeelding:', error);
    res.status(500).send('Fout bij het ophalen van de afbeelding');
  }
});

app.post('/saveWebpage', async (req, res) => {
  const {
    websiteUrl
  } = req.body;
  console.log(websiteUrl)
  try {
    const response = await axios.get(websiteUrl);
    // Vervang alleen "https://www.wired.com/" en "/" door "-"
    const filename = websiteUrl.replace(/^https?:\/\/(?:www\.)?wired\.com\//, '').replace(/\//g, '-') + ".html";
    const filePath = path.join(__dirname, 'savedPages', filename);
    
    // Controleer of het bestand al bestaat
    if (fs.existsSync(filePath)) {
      return res.status(400).json({
        success: false,
        message: 'File already exists.'
      });
    }
    fs.writeFileSync(filePath, response.data);
    res.status(200).json({
      success: true,
      filename
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to save webpage.'
    });
  }
});

app.get('/extractText', (req, res) => {
  try {
    const filename = req.query.filename;
    // Lees het opgeslagen HTML-bestand
    const filePath = path.join(__dirname, 'savedPages', filename);
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    // Gebruik Cheerio om HTML te parseren
    const $ = cheerio.load(htmlContent);

    // Verwijder het noscript-element en behoud de inhoud ervan
    $('noscript').each((_, noscript) => {
      const noscriptContent = $(noscript).html();
      $(noscript).replaceWith(noscriptContent);
    });

    // Selecteer de titel
    const title = $('[data-testid="ContentHeaderHed"]').text();

    // Selecteer de introductie
    const intro = $('[data-testid="ContentHeaderAccreditation"]').text();

    // Selecteer de headerafbeelding
    const headerImage = $('.ContentHeaderResponsiveAsset-bREgIb > img').map((_, el) => ({
      src: $(el).attr('src'),
      alt: $(el).attr('alt')
    })).get();

    // Selecteer de inhoud van het artikel
    const articleContent = $('.article__body div p').text();

    // Selecteer de afbeeldingen in de inhoud van het artikel
    const articleImages = $('.article__body div img').map((_, el) => ({
      src: $(el).attr('src'),
      alt: $(el).attr('alt')
    })).get();

    // Stuur de geëxtraheerde tekst terug naar de client
    res.json({
      success: true,
      title,
      intro,
      articleContent,
      headerImage,
      articleImages
    });
  } catch (error) {
    // console.error('Fout bij het ophalen van de HTML:', error);
  }
});

app.post('/saveJson', (req, res) => {
  const jsonData = req.body; // Ontvang JSON-gegevens van het verzoek
  console.log('Ontvangen JSON-gegevens:', jsonData); // Log de ontvangen gegevens

  // Voer hier de logica uit om de JSON-gegevens op te slaan
  const filePath = path.join(__dirname, 'public', 'output.json');
  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Fout bij het schrijven van JSON-bestand:', err);
      res.status(500).send('Fout bij het schrijven van JSON-bestand');
    } else {
      console.log('JSON-bestand succesvol opgeslagen:', filePath);
      res.sendStatus(200); // Stuur een succesreactie terug naar de client
    }
  });
});

app.get('/getJson', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'output.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Fout bij het lezen van JSON-bestand:', err);
      return res.status(500).send('Fout bij het lezen van JSON-bestand');
    } else {
      const jsonData = JSON.parse(data);
      return res.json(jsonData);
    }
  });
});


// Endpoint voor het opslaan van audiobestanden
app.post('/saveAudio', async (req, res) => {

  const {
    text,
    fileName
  } = req.body;
  
  if (fs.existsSync('public/' + fileName)) {
    return res.status(400).json({
      success: false,
      message: 'File already exists.'
    });
  }

  try {
    await voice.textToSpeech({
      // Required Parameters
      fileName: 'public/' + fileName, // The name of your audio file
      textInput: text, // The text you wish to convert to speech

      // Optional Parameters
      // voiceId: "pNInz6obpgDQGcFmaJgB", // A different Voice ID from the default
      stability: 0.5, // The stability for the converted speech
      similarityBoost: 0.5, // The similarity boost for the converted speech
      modelId: "eleven_multilingual_v2", // The ElevenLabs Model ID
      // style: 1, // The style exaggeration for the converted speech
      speakerBoost: true // The speaker boost for the converted speech
    }).then((res) => {
      console.log(res); 
      res.status(200).json({
        success: true,
        filename
      });
    });
  } catch (error) {
    // console.error('Fout bij het ophalen van het audiobestand:', error);
    res.status(500).send('Er is een fout opgetreden bij het ophalen van het audiobestand.');
  }
});

app.listen(port, () => {
  console.log(`Proxy-server luistert op http://localhost:${port}`);
});

