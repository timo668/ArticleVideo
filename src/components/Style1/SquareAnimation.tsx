import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

const square: React.CSSProperties = {
	height: 250,
	width: 250,
	backgroundColor: '#0b84f3',
	borderRadius: 14,
	color: 'white',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

export const Square: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, height} = useVideoConfig();
	const spr = spring({
		fps,
		frame,
		config: {
			damping: 200,
		},
		durationInFrames: 60,
	});

	const rotate = interpolate(spr, [0, 1], [Math.PI, 0]);
	const y = interpolate(spr, [0, 1], [height, 0]);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				transform: `translateY(${y}px) rotate(${rotate}rad)`,
			}}
		>
			<div style={square} ><p style={{
				fontSize: '5rem'
			}}>Hallo</p></div>
		</AbsoluteFill>
	);
};
