const getVector = (point1, point2) => {
	return {
		x: point2.x - point1.x,
		y: point2.y - point1.y,
		z: point2.z - point1.z,
	};
};

const getDotProduct = (vectorA, vectorB) => {
	return vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z;
};

const getMagnitude = (vector) => {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
};

const getAngle = (vectorA, vectorB) => {
	const dotProduct = getDotProduct(vectorA, vectorB);
	const magA = getMagnitude(vectorA);
	const magB = getMagnitude(vectorB);

	const cosineTheta = dotProduct / (magA * magB);

	return Math.acos(cosineTheta) * (180 / Math.PI);
};

const checkSquatting = (points) => {
	const leftLegAngle = getAngle(
		getVector(points[25], points[23]),
		getVector(points[25], points[27])
	);
	const rightLegAngle = getAngle(
		getVector(points[26], points[24]),
		getVector(points[26], points[28])
	);
	const threshold = 70;
	return leftLegAngle < threshold && rightLegAngle < threshold;
};

export const countSquats = (points, isSquatting, count) => {
	if (checkSquatting(points)) {
		if (!isSquatting) {
			isSquatting = true;
		}
	} else if (isSquatting) {
		isSquatting = false;
		count += 1;
	}

	return [count, isSquatting];
};
