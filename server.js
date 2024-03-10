const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const base64 = require('base64-js');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS voor alle routes
app.use(express.json());

app.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;

  try {
    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer(); // Afbeeldingsgegevens ophalen als een buffer
    res.set('Content-Type', response.headers.get('content-type'));
    res.send(imageBuffer);
  } catch (error) {
    console.error('Fout bij het ophalen van de afbeelding:', error);
    res.status(500).send('Fout bij het ophalen van de afbeelding');
  }
});

app.post('/saveWebpage', async (req, res) => {
  const {
    url
  } = req.body;
  try {
    const response = await axios.get(url);
    // Vervang alleen "https://www.wired.com/" en "/" door "-"
    const filename = url.replace(/^https?:\/\/(?:www\.)?wired\.com\//, '').replace(/\//g, '-') + ".html";
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
    console.error(error);
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
    console.error('Fout bij het ophalen van de HTML:', error);
  }
});

// Endpoint voor het opslaan van audiobestanden
app.post('/saveAudio', async (req, res) => {
  var key   = process.env.ELEVENLABS_API_KEY;
  const {
    text,
    fileName
  } = req.body;

  try {
    const options = {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text
      })
    };

    // Verzoek naar de text-to-speech API om audiobestand te genereren
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/TX3LPaxmHKxFdv7VOQHJ', options);
    console.log(response)
    const base64AudioData =  await response.json(); // Audio gegevens als buffer
    console.log(base64AudioData)
    
    // Base64-decodering
    const binaryAudioData = base64.toByteArray(base64AudioData);
    // Pad naar de public-map en bestandsnaam
    const filePath = path.join(__dirname, 'public', fileName);

    // Schrijf de audiogegevens naar het bestand
    fs.writeFile(filePath, binaryAudioData, (err) => {
      if (err) {
        console.error('Fout bij het opslaan van het bestand:', err);
        res.status(500).send('Er is een fout opgetreden bij het opslaan van het bestand.');
      } else {
        console.log('Bestand succesvol opgeslagen op:', filePath);
        res.status(200).send('Bestand succesvol opgeslagen.');
      }
    });
  } catch (error) {
    console.error('Fout bij het ophalen van het audiobestand:', error);
    res.status(500).send('Er is een fout opgetreden bij het ophalen van het audiobestand.');
  }
});

app.listen(port, () => {
  console.log(`Proxy-server luistert op http://localhost:${port}`);
});