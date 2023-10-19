import { useRef, useEffect, useState } from 'react';
import { Alert } from '@mui/material';

const Cam = () => {
	const [msg, setMsg] = useState('');
	const videoRef = useRef(null);

	useEffect(() => {
		let stream = null;
		const getStream = async () => {
			try {
				if (navigator.mediaDevices) {
					stream = await navigator.mediaDevices.getUserMedia({
						video: true,
					});
					videoRef.current.srcObject = stream;
					setMsg('connected to camera');
					return;
				}
				setMsg('cannot connect to camera');
			} catch (err) {
				setMsg('cannot connect to camera');
			}
		};

		getStream();

		return () => {
			if (stream) {
				let tracks = stream.getTracks();
				tracks.forEach((track) => track.stop());
			}
		};
	}, []);

	return (
		<>
			<div className='video-canvas-container'>
				<video
					id='video'
					ref={videoRef}
					autoPlay
					playsInline
					width='480px'
					height='360px'
				/>
				<canvas id='canvas' width='480px' height='360px' />
			</div>
			<Alert>{msg}</Alert>
		</>
	);
};

export default Cam;
