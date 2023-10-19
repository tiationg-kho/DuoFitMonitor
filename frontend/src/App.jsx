import { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';

import './App.css';
import Cam from './components/Cam';
import { vision, poseLandmarker, detect } from './utils/detect';

function App() {
	const [play, setPlay] = useState(false);

	const playHandler = () => {
		setPlay(true);
		setTimeout(() => detect(vision, poseLandmarker, -1, false, 0), 5000);
	};

	const stopHandler = async () => {
		setPlay(false);
	};

	return (
		<>
			<Container fixed>
				{!play && (
					<Button variant='contained' onClick={playHandler}>
						Play
					</Button>
				)}
				{play && (
					<Button variant='contained' onClick={stopHandler}>
						Stop
					</Button>
				)}
				{<Typography>{}</Typography>}
			</Container>
			<Container fixed style={{ border: '1px solid black' }}>
				{play && <Cam />}
			</Container>
		</>
	);
}

export default App;
