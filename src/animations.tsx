import {AbsoluteFill, continueRender, delayRender, Img, spring, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
const {fps, width, durationInFrames} = useVideoConfig();
const frame = useCurrentFrame();
const animations = {
  avatar: {
    scale: spring({fps, frame, delay: 90}),
  },
  fadeout:{
    opacity: interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0]),
  },
  image:{
    float: `translateY(${ 10 * Math.sin(frame / 25 )}px)`,
    load: interpolate(frame, [0, 70],[ +100, 0], {
      easing: Easing.in(Easing.ease),
      extrapolateRight: "clamp",})
  },
  title:{
    fadein: interpolate(frame, [0, 40], [0, 1]),
    movein: interpolate(frame, [0, 30], [45, 0], {
      easing: Easing.in(Easing.ease),
      extrapolateRight: "clamp",})
  }
};