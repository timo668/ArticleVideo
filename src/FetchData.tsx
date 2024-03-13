import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OpenAI from "openai";


export type SegmentData = {
  title: string;
  segment: {
    segmentTitle: string;
    text: string;
    imgUrl: string;
  }[];
};




export async function fetchData(): Promise<SegmentData> {

  const websiteUrl = "https://www.wired.com/story/here-come-the-ai-worms/";

  const handleSavePage = async () => {
    try {
      const response = await axios.post('http://localhost:3001/saveWebpage', { websiteUrl });
      if (response.data.success) {
        // setSavedFilename(response.data.filename);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Failed to save webpage:', error);
    }
  };

  const getTextFromArticle = async () => {
    let filename = websiteUrl.replace(/^https?:\/\/(?:www\.)?wired\.com\//, '').replace(/\//g, '-') + ".html";
    const url = 'http://localhost:3001/extractText?filename=';
    const articleeUrl = url + encodeURIComponent(filename);
    const response = await fetch(articleeUrl);
    const data = await response.json();

    const cleanAndNormalizeText = (text) => {
      // Vervang alle nieuwe regeltekens door een lege string
      // en vervang meerdere opeenvolgende spaties door één enkele spatie
      return text.replace(/\n/g, '').replace(/\s+/g, ' ');
    };
    var output = cleanAndNormalizeText(data.title) + "\n" + cleanAndNormalizeText(data.intro) + "\n" + cleanAndNormalizeText(data.articleContent)
    output += "\n Images: \n Image 1: " + data.headerImage[0].alt + " src:" + data.headerImage[0].src;

    data.articleImages.map((item, i) => {
      output += "\n Image " + (i + 2) + ": " + item.alt + " src: " + item.src;
    });
    return output;
  }

  const setScript = async (fullArticle) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    console.log("setting: script")
    var prompt = "follow the following steps: 1. Rewrite the news article with a formal tone without the use of emojis to a short video script. 2. place the script in a Json format: script [ { 'segmentTitle': , 'text': , 'imgUrl': }] 3. give everything a segmentTitle. 4. Place every image once in the segments let the other empty. ";
    console.log(fullArticle)
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You rewrite articles to a script designed to output JSON.",
          },
          { role: "user", content: prompt + " \n" + fullArticle },
        ],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
      });
      // Stuur JSON-gegevens naar de server
      await axios.post('http://localhost:3001/saveJson', JSON.parse(completion.choices[0].message.content));
      console.log('JSON-bestand succesvol opgeslagen op de server.');
    } catch (error) {
      console.error('Fout bij het opslaan van het JSON-bestand:', error);
    }
  };

  const GetGifs = async (list) => {
    const GIPHY_API_KEY = process.env.GIPHY_API_KEY ?? '';
    const listWithGifs = [...list]; // Copy the list to avoid mutating the original array

    const isValidUrl = (value) => {
      // Regular expression to match URL pattern
      const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

      // Test if the value matches the URL pattern
      return urlPattern.test(value);
    };

    const giflink = async (keyword) => {
      try {
        const keywordApi = keyword.replace(" ", "+");
        const response = await fetch(
          'https://api.giphy.com/v1/gifs/search?api_key=' + GIPHY_API_KEY + '&q=' + keywordApi + '&limit=1&offset=0&rating=g&lang=en&bundle=messaging_non_clips'
        );
        const data = await response.json();
        return data.data[0].images.original.url;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error to propagate it further
      }
    };

    for (let i = 0; i < listWithGifs.length; i++) {
      const segment = listWithGifs[i];
      if (!isValidUrl(segment.imgUrl)) {
        listWithGifs[i].imgUrl = await giflink(segment.imgUrl); // Wait for the URL to be resolved
      }
    }
    return listWithGifs;
  };

  const textToSpeech = async (list) => {
    for (const item of list) {
      const fileName = item.segmentTitle + ".mp3";
      const text = item.text;

      try {
        // Stuur een POST-verzoek naar de server met de tekst en bestandsnaam
        const response = await axios.post('http://localhost:3001/saveAudio', { text, fileName });

      } catch (error) {
        console.error('Fout bij het verzenden van het verzoek:', error);
      }
    }
  }

  const getScript = async () => {
    try {
      const response = await axios.get('http://localhost:3001/getJson');
      return response.data; // Return the response data
    } catch (error) {
      console.error("Error fetching script:", error);
      throw error; // Rethrow the error for further handling if needed
    }
  };

  handleSavePage();
  
  //Set True for rewrite script every run.
  if (false) {
    setScript(await getTextFromArticle().then(article => {
      console.log(article)
      return article;
    }).catch(error => {
      // Handle errors if any
      console.error("Error fetching article:", error);
    }));
  }

  const script = await getScript().then(script => {
    return script["script"];
  }).catch(error => {
    // Handle errors if any
    console.error("Error fetching script:", error);
  });

  const segments = await GetGifs(script);
  console.log(segments)
  textToSpeech(segments);


  return {
    title: "Video",
    segment: segments
  };
}

//To Do:
// 1. Zorgen dat er alleen een API request naar open ai wordt gedaan als er een nieuwe link is geplaatst.
// 2. Gihpy automatiseren.
// 3. Server.JS - Check of json valid is.
// 5. Root.tsx - automatische lengte van durationInFrames op basis van geluid.
// 6. Automatische TikTok titel.
// 7. NPM CLEAN maken
