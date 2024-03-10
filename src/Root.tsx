import {Composition} from 'remotion';
import {TitleImg} from './components/Style1/titleImg';
import {PinkSquareImg} from './components/Style1/pinkSquareImg';
import {WhiteRectImg} from './components/Style1/whiteRectImg';
import {BlueSquareImg} from './components/Style1/blueSquareImg';

import { Remotion } from "./components/main";

const fps = 30;
const durationInFrames = fps * 60;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Main"
				component={Remotion}
				durationInFrames={durationInFrames}
				fps={30}
				width={1080}
				height={1920}
			/>

			<Composition
				id="TitleImg"
				component={TitleImg}
				durationInFrames={durationInFrames}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
          title: "Hi",
					url: ''
        }}
			/>
				<Composition
				id="PinkSquareImg"
				component={PinkSquareImg}
				durationInFrames={durationInFrames}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
          title: "Hi",
					url: ''
        }}
			/>
				<Composition
				id="WhiteRectImg"
				component={WhiteRectImg}
				durationInFrames={durationInFrames}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
          title: "Hi",
					url: ''
        }}
			/>
				<Composition
				id="BlueSquareImg"
				component={BlueSquareImg}
				durationInFrames={durationInFrames}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
          title: "Hi",
					url: ''
        }}
			/>
		</>
	);
};
