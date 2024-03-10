import { AbsoluteFill, continueRender, delayRender, Img, spring, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile, Audio } from 'remotion';
import { Gif } from "@remotion/gif";
import brush from '../../img/Brush.png';

type Props = {
  title: string;
  url: string;
}

export const BlueSquareImg: React.FC<Props> = ({ title, url }) => {
  const { fps, width, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();


  const gifOrDiv = () => {
    if (url.endsWith('.gif')) {
      return (
        <Gif
          src={url}
          width='722.64px'
          height='710.64px'
          fit="cover"
          playbackRate={1}
          style={{
            borderWidth: '4.68px',
            borderColor: 'rgb(0, 0, 255)',
            borderStyle: 'solid',
            backgroundColor: 'rgb(225, 225, 225)',
            position: 'absolute',
            left: '73px',
            top: '1134px',
          }}
        />
      );
    } else {
      return (
        <div style={{
          borderWidth: '4.68px',
          borderColor: 'rgb(0, 0, 255)',
          borderStyle: 'solid',
          backgroundColor: 'rgb(225, 225, 225)',
          position: 'absolute',
          left: '73px',
          top: '1134px',
          width: '722.64px',
          height: '710.64px',
          backgroundImage: `url("${url}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}></div>
      );
    }
  }

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0000ff'
    }}>
      <Audio src={staticFile(title + ".mp3")} />
      <img src={brush} style={{
        position: 'absolute',
        left: '-2px',
        top: '287px',
        width: '1080px',
        height: '1631px',
      }}></img>

      <div>
        <div style={{
          border: '10px solid rgb(255, 255, 255)',
          position: 'absolute',
          left: '112px',
          top: '193px',
          width: '718px',
          height: '554px'
        }}></div>
        <div style={{
          backgroundColor: 'rgb(255, 160, 203)',
          position: 'absolute',
          left: '67px',
          top: '152px',
          width: '738px',
          height: '574px',
          padding: '25px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <p style={{
            fontSize: '100px',
            fontFamily: 'Poppins',
            color: 'rgb(0, 0, 255)',
            lineHeight: '0.967',
            MozTransform: 'matrix(1.0109184235253, 0, 0, 0.97558566815949, 0, 0)',
            fontWeight: '600',
            margin: '0',
          }}>{title}</p>
        </div>

        <div>
          <div style={{
            backgroundColor: 'rgb(255, 160, 203)',
            position: 'absolute',
            left: '179px',
            top: '1046px',
            width: '732px',
            height: '720px',
          }}></div>

          <div style={{
            backgroundColor: 'rgb(255, 255, 255)',
            position: 'absolute',
            left: '127px',
            top: '1094px',
            width: '732px',
            height: '720px'
          }}></div>
          {gifOrDiv()}
        </div>

      </div>

    </AbsoluteFill>

  )
};