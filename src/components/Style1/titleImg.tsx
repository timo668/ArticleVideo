import { Gif } from "@remotion/gif";
import {AbsoluteFill, continueRender, delayRender, Img, spring, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile, Audio } from 'remotion';


import {fetchData, SegmentData} from '../../FetchData';


import grid from '../../img/Grid2.png';

type Props = {
  title: string;
  url: string;
}


export const TitleImg: React.FC<Props> = ({title, url}) => {
  
  const {fps, width, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

  const animations = {
    element:{
      float: `translateY(${ 1  * Math.sin(frame / 25 )}%)`,
      spring: spring({fps, frame, delay: 1})
    }
	};

  const gifOrDiv = () => {
    if (url.endsWith('.gif')) {
      return (
        <Gif
          src={url}
          width='916px'
          height='724px'
          fit="cover"
          playbackRate={1}
          style={{
            position: 'absolute',
            zIndex: '1',
            borderWidth: '10px',
            borderColor: 'rgb(0, 0, 255)',
            borderStyle: 'solid',
            left: '90px',
            top: '257px',
          }}
        />
      );
    } else {
      return (
        <div style={{
          position: 'absolute',
          backgroundColor: '#ebebeb',
          zIndex: '1',
          borderWidth: '10px',
          borderColor: 'rgb(0, 0, 255)',
          borderStyle: 'solid',
          left: '90px',
          top: '257px',
          height: '724px',
          width: '916px',
          transform: `${animations.element.float} `,
          backgroundImage: `url("${url}")`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}></div>
      );
    }
  }

  return(
    <AbsoluteFill style={{
      background: 'white'
    }}>
            <Audio src={staticFile(title + ".mp3")}/>


      <Img  src={grid} style={{
        position: 'absolute',
        top: '95px',
        zIndex: 0
      }}></Img>
      

      {gifOrDiv()}


      <div style={{
                  transform: `scale(${animations.element.spring})`
      }}>
      <div style={{
        
            borderWidth: '10px',
            borderColor: 'rgb(0, 0, 255)',
            borderStyle: 'solid',
            position: 'absolute',
            left: '163px',
            top: '1318px',
            width: '641px',
            height: '397px',
            
        }}
        ></div>
        <div style={{
          backgroundColor: 'rgb(0, 0, 255)',
          position: 'absolute',
          left: '107px',
          top: '1265px',
          width: '676px',
          height: '427px',
          
        }}></div>

        <div style={{
            backgroundColor: 'rgb(255, 160, 203)',
            position: 'absolute',
            left: '70px',
            top: '1233px',
            width: '676px',
            height: '427px',
            padding: '15px',
            display: 'flex',
            alignItems: 'center'

        }}><p style={{
          fontSize: '90px',
          fontFamily: 'Poppins',
          color: 'rgb(0, 0, 255)',
          lineHeight: '1.1',
          fontWeight: '600',
          margin: 0,
        }}>{title}</p></div>

      </div>
    </AbsoluteFill>
  )
};