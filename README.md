# Project: Converting an Article into a TikTok Video using Remotion in React
## Description:
This project aims to convert an article into a TikTok video utilizing Remotion in React. By providing a link to a Wired article, the system generates a TikTok video comprising images and an AI voice-over.

# Process:
Scraping and Extraction:

The Wired article is scraped and stored on the computer.
Text and images are extracted from the article.
Article Rewriting:

The article is rewritten into a TikTok script using OpenAI.
Images from the article are distributed throughout the script.
GIF Integration:

In places where images from the article cannot be used, a keyword search is conducted for a suitable GIF using the GIPHY API.
Audio Script Generation:

An audio script is generated via ELEVENLABS.
Template Creation:

Four templates are created in Remotion. The script is divided into these templates based on image dimensions.
Assembly and Rendering:

All audio is placed under the templates.
The video is rendered using Remotion.


## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm start
```

**Render video**

```console
npm start
npm run build
```

**Upgrade Remotion**

```console
npm run upgrade
```
