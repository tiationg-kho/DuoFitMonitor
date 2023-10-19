// ref from https://developers.google.com/mediapipe/solutions/vision/pose_landmarker

import {
	FilesetResolver,
	DrawingUtils,
	PoseLandmarker,
} from '@mediapipe/tasks-vision';

import { countSquats } from './math';

const wait = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const vision = await FilesetResolver.forVisionTasks(
	'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
);

export const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
	baseOptions: {
		modelAssetPath:
			'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
	},
	runningMode: 'VIDEO',
});

export const detect = async (
	vision,
	poseLandmarker,
	lastVideoTime,
	isSquatting,
	count
) => {
	const video = document.getElementById('video');
	const canvas = document.getElementById('canvas');

	if (!video || !canvas) {
		return;
	}

	const canvasCtx = canvas.getContext('2d');
	const drawingUtils = new DrawingUtils(canvasCtx);
	const videoHeight = '360px';
	const videoWidth = '480px';
	canvas.style.height = videoHeight;
	video.style.height = videoHeight;
	canvas.style.width = videoWidth;
	video.style.width = videoWidth;

	let startTimeMs = performance.now();

	if (lastVideoTime !== video.currentTime) {
		lastVideoTime = video.currentTime;

		poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
			canvasCtx.save();
			canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

			for (const landmark of result.landmarks) {
				drawingUtils.drawLandmarks(landmark, {
					radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
				});
				drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
			}
			canvasCtx.restore();

			const points = result.landmarks[0];
			if (points) {
				[count, isSquatting] = countSquats(points, isSquatting, count);
				console.log(count);
			}
		});

		await wait(300);
		window.requestAnimationFrame(() =>
			detect(vision, poseLandmarker, lastVideoTime, isSquatting, count)
		);
	}
};
