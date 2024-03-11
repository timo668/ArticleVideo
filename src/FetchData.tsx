import React, { useState } from 'react';
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

  const TestOutputOpenAi = [
    {
      segmentTitle: "Introduction",
      text: "Welcome to our review of Samsung’s innovative Galaxy Ring, the latest entry in the smart ring market.",
      imgUrl: "https://media.wired.com/photos/65dca2b60b13d6820a792b91/master/w_2240,c_limit/Gear-Samsung-Galaxy-Ring-SOURCE-Julian-Chokkattu.jpg"
    },
    {
      segmentTitle: "Background Information",
      text: "Last month, Samsung announced the Galaxy Ring alongside its Galaxy S24 smartphone series.",
      imgUrl: "Information"
    },
    {
      segmentTitle: "Product Details",
      text: "Samsung positions the Galaxy Ring as a smart ring focusing on health tracking rather than overwhelming users with data.",
      imgUrl: "Product icarly"
    },
    {
      segmentTitle: "Compatibility and Features",
      text: "According to Samsung's Hon Pak, the Galaxy Ring can be used alongside the Galaxy Watch for richer health insights.",
      imgUrl: "https://media.wired.com/photos/65dbdef77919bfe534e811be/master/w_1600,c_limit/Gear-Samsung-Galaxy-Ring-(5)_low.jpg"
    },
    {
      segmentTitle: "Innovative Technologies",
      text: "The Galaxy Ring boasts advanced sensor technology and promises extended battery life for comprehensive sleep insights and heart health monitoring.",
      imgUrl: "Innovative"
    },
    {
      segmentTitle: "Design and Comfort",
      text: "Samsung highlights the lightweight and comfortable design of the Galaxy Ring, offering various sizes and color options.",
      imgUrl: "https://media.wired.com/photos/65dbdef723c08f2f40d93a81/master/w_1600,c_limit/Gear-Samsung-Galaxy-Ring-(1)_low.jpg"
    },
    {
      segmentTitle: "Battery Life",
      text: "While exact battery life details remain undisclosed, Samsung reassures users of extended usage and ongoing efforts to optimize battery performance.",
      imgUrl: "Battery"
    },
    {
      segmentTitle: "Compatibility",
      text: "The Galaxy Ring is exclusively compatible with Android phones, with potential future integration with other Samsung devices.",
      imgUrl: "Compatibility"
    }
  ]

  const handleSavePage = async () => {

    var url = "https://www.wired.com/story/samsung-galaxy-ring-mwc-2024/";

    try {
      const response = await axios.post('http://localhost:3001/saveWebpage', { url });
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
    var filename = "story-samsung-galaxy-ring-mwc-2024-.html";
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

  const getscript = async (fullArticle) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    var prompt = "Rewrite the following news article with a formal tone without the use of emojis. Maximum of 3 sentences in a segment Give each a title segment. Divide the images below in the right place. Only place the SRC When there is No specific image mentioned give 1 keyword for a giphy prompt Create a script for TikTok in JSON format. return only the json. Json formaat: { 'Segment': , 'Script': , 'Image': }"

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: prompt + " \n" + fullArticle },
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });
    console.log(completion.choices[0].message.content);
  }

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
        const response = await fetch(
          'https://api.giphy.com/v1/gifs/search?api_key=' + GIPHY_API_KEY + '&q=' + keyword + '&limit=1&offset=0&rating=g&lang=en&bundle=messaging_non_clips'
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
      
      console.log(fileName + ":  " + text)
  
      try {
        // Stuur een POST-verzoek naar de server met de tekst en bestandsnaam
        const response = await axios.post('http://localhost:3001/saveAudio', { text, fileName });

      } catch (error) {
        console.error('Fout bij het verzenden van het verzoek:', error);
      }
    }
  }
  

  handleSavePage();
  const article = getTextFromArticle()
  // getscript(article)
  const segments = await GetGifs(TestOutputOpenAi);
  // textToSpeech(segments);

  return {
    title: "Video",
    segment: segments
  };
}