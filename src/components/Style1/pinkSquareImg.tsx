import { AbsoluteFill, continueRender, delayRender, Img, spring, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile, Audio } from 'remotion';
import grid from '../../img/Grid1.png';
import { Gif } from "@remotion/gif";  
import { preloadGif } from "@remotion/gif";

type Props = {
  title: string;
  url: string;
}
export const PinkSquareImg: React.FC<Props> = ({ title, url }) => {
  const { fps, width, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const animations = {
    element: {
      float: `translateX(${1 * Math.sin(frame / 25)}%)`,
      spring: spring({ fps, frame, delay: 1 }),
      spring2: spring({ fps, frame, delay: 9 }),
      spring3: spring({ fps, frame, delay: 17 })
    }
  };

  const gifOrDiv = () => {
    if (url.endsWith('.gif&ct=g')) {
      return (
        <Gif
          src={url}
          width='570.64px'
          height='602.64px'
          fit="cover"
          playbackRate={1}
          style={{
            border: '4.68px solid rgb(0, 0, 255)',
            backgroundColor: 'rgb(235, 235, 235)',
            position: 'absolute',
            left: '366px',
            top: '252px',
          }}
        />
      );
    } else {
      return (
        <div style={{
          border: '4.68px solid rgb(0, 0, 255)',
          backgroundColor: 'rgb(235, 235, 235)',
          position: 'absolute',
          left: '366px',
          top: '252px',
          width: '570.64px',
          height: '602.64px',
          backgroundImage: `url("${url}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          
        }}></div>
      );
    }
  }
  return (
    <AbsoluteFill style={{
      backgroundColor: '#0000ff',
    }}>
      <Audio src={staticFile(title + ".mp3")} />

      <div style={{
        backgroundColor: 'rgb(255, 160, 203)',
        position: 'absolute',
        left: '42px',
        top: '30px',
        width: '1004px',
        height: '1858px',
      }}>
        <img src={grid} style={{
          position: 'absolute',
          left: '141px',
          top: '639px',
          width: '434px',
          height: '434px',
        }}></img>

        <div>
          <div style={{
            borderWidth: '4.68px',
            borderColor: 'rgb(0, 0, 255)',
            borderStyle: 'solid',
            backgroundColor: 'rgb(255, 255, 255)',
            position: 'absolute',
            left: '278px',
            top: '327px',
            width: '570.64px',
            height: '602.64px',
          }}></div>

          <div style={{
            borderWidth: '4.68px',
            borderColor: 'rgb(0, 0, 255)',
            borderStyle: 'solid',
            backgroundColor: 'rgb(255, 255, 255)',
            position: 'absolute',
            left: '322px',
            top: '288px',
            width: '570.64px',
            height: '602.64px',

          }}></div>
          {gifOrDiv()}
        </div>
        <div>
          <div style={{
            backgroundColor: 'rgb(0, 0, 255)',
            position: 'absolute',
            left: '185px',
            top: '1132px',
            width: '402px',
            height: '364px',
            transform: `scale(${animations.element.spring})`

          }}></div>
          <div style={{
            borderWidth: '4.68px',
            borderColor: 'rgb(0, 0, 255)',
            borderStyle: 'solid',
            backgroundColor: 'rgb(255, 255, 255)',
            position: 'absolute',
            left: '115px',
            top: '1189px',
            width: '392.64px',
            height: '354.64px',
            padding: '15px',
            display: 'flex',
            alignItems: 'center',
            transform: `scale(${animations.element.spring2})`

          }}><p style={{
            fontSize: '85px',
            fontFamily: '"Poppins"',
            color: 'rgb(0, 0, 255)',
            lineHeight: '0.967',
            MozTransform: 'matrix( 1.0109184235253,0,0,0.97558566815949,0,0)',
            fontWeight: '600',
            margin: '0',
            wordBreak: 'break-word',
            
          }}>{title}</p></div>
        </div>
      </div>
    </AbsoluteFill>
  )
};