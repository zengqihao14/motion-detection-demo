const color = 'aqua';
const boundingBoxColor = 'red';
const lineWidth = 2;

const drawPoints = (ctx, points, radius, color) => {
    const data = points.buffer().values;

    for (let i = 0; i < data.length; i += 2) {
        const pointY = data[i];
        const pointX = data[i + 1];

        if (pointX !== 0 && pointY !== 0) {
            ctx.beginPath();
            ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }
};

const drawPoint = (ctx, y, x, r, color) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
};

export const drawKeypoints = (keypoints, ctx, scale = 1) => {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        const {y, x} = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 3, color);
    }
};
