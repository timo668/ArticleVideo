import { useEffect, useState, Fragment } from 'react';
import { Audio, random, Sequence, Series, staticFile, continueRender, delayRender } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { getAudioData } from "@remotion/media-utils";

import { TitleImg } from "./Style1/titleImg";
import { PinkSquareImg } from './Style1/pinkSquareImg';
import { WhiteRectImg } from './Style1/whiteRectImg';
import { BlueSquareImg } from './Style1/blueSquareImg';


import { fetchData, SegmentData } from '../FetchData';


export const Remotion = () => {
  const [handle] = useState(() => delayRender());
  const [handle2] = useState(() => delayRender());
  const [handle3] = useState(() => delayRender());
  const [handle4] = useState(() => delayRender());

  const [data, setData] = useState(null);
  const [segmentSizes, setSegmentSizes] = useState([]);
  const [durationFrames, setDurationFrames] = useState([]);
  



  useEffect(() => {
    fetchData().then((SegmentData) => {
      setData(SegmentData);
      continueRender(handle4);
    });
  }, []);

  useEffect(() => {
    const fetchImageSizes = async () => {
      if (!data) return;
      const sizesPromises = data.segment.map(item => getImageSize(item.imgUrl));
      const sizes = await Promise.all(sizesPromises);
      setSegmentSizes(sizes);
      continueRender(handle2);
    };
    fetchImageSizes();
  }, [data]);

  useEffect(() => {
    const fetchDurationFrames = async () => {
      if (!data) return;

      const durationPromises = data.segment.map(item =>
        getDurationFrame(staticFile(item.segmentTitle + ".mp3"))
      );
      const durations = await Promise.all(durationPromises);
      setDurationFrames(durations);
      continueRender(handle3);
    };
    fetchDurationFrames();
  }, [data]);

  const renderSegments = () => {
    if (!data) return null;

    const segmentCount = data.segment.length;

    return data.segment.map((item, i) => {
      const size = segmentSizes[i];
      const duration = durationFrames[i];
      if (!size || isNaN(duration)) return null;

      let segmentComponent;
      if (size.width > size.height) {
        segmentComponent = <TitleImg title={item.segmentTitle} url={item.imgUrl} />;
      } else if (size.width < size.height) {
        segmentComponent = <WhiteRectImg title={item.segmentTitle} url={item.imgUrl} />;
      } else if (item.segmentTitle.length < 22) {
        segmentComponent = <PinkSquareImg title={item.segmentTitle} url={item.imgUrl} />;
      } else {
        segmentComponent = <BlueSquareImg title={item.segmentTitle} url={item.imgUrl} />;
      }

      const isLastSegment = i === segmentCount - 1;
      const transitionComponent = !isLastSegment && (
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 10 })}
        />
      );

      return (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={Math.ceil(duration)}>
            {segmentComponent}
          </TransitionSeries.Sequence>
          {transitionComponent}
        </React.Fragment>
      );
    });
  };

  continueRender(handle);
  return (
    <>
      <TransitionSeries>
        {renderSegments()}
      </TransitionSeries>
    </>
  );
};

async function getImageSize(url) {
  try {
    const proxyUrl = 'http://localhost:3001/proxy-image?url=';
    const absoluteImageUrl = proxyUrl + encodeURIComponent(url);
    const response = await fetch(absoluteImageUrl);
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    const img = new Image();
    img.src = objectURL;
    await new Promise(resolve => img.onload = resolve);
    const width = img.width;
    const height = img.height;
    return { width, height };
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

async function getDurationFrame(audioUrl) {
  try {
    const audioData = await getAudioData(audioUrl);
    const durationInSeconds = audioData.durationInSeconds;
    const durationFrames = (durationInSeconds * 30) + 10;
    return durationFrames;
  } catch (error) {
    console.error('Error fetching audio data:' + audioUrl, error);
    return NaN;
  }
}
