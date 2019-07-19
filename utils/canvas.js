const color = 'aqua';
const colorMap = {
  nose: 'rgba(255, 252, 89, 1)',
  leftEye: 'rgba(255, 252, 89, 1)',
  rightEye: 'rgba(255, 252, 89, 1)',
  leftEar: 'rgba(255, 252, 89, 1)',
  rightEar: 'rgba(255, 252, 89, 1)',
  leftShoulder: 'rgba(132, 255, 128, 1)',
  rightShoulder: 'rgba(227, 255, 143, 1)',
  leftElbow: 'rgba(161, 211, 255, 1)',
  rightElbow: 'rgba(225, 161, 255, 1)',
  leftWrist: 'rgba(182, 140, 255, 1)',
  rightWrist: 'rgba(140, 194, 255, 1)',
  leftHip: 'color',
  rightHip: 'color',
  leftKnee: 'rgba(227, 255, 143, 1)',
  rightKnee: 'rgba(132, 255, 128, 1)',
  leftAnkle: 'rgba(140, 194, 255, 1)',
  rightAnkle: 'rgba(182, 140, 255, 1)',
};
const skeletonColor = {
  leftForeArm: 'rgba(255, 252, 89, 1)',
  rightForeArm: 'rgba(0, 255, 225, 1)',
  leftArm: 'rgba(182, 140, 255, 1)',
  rightArm: 'rgba(255, 174, 0, 1)',
};
const boundingBoxColor = 'red';
const lineWidth = 5;

const toTuple = ({y, x}) => {
  return [y, x];
};

const drawPoint = (ctx, y, x, r, color) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};

export const drawSegment = ([ay, ax], [by, bx], color, scale, ctx) => {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
};

export const drawSkeleton = (keypoints, minConfidence, ctx, scale = 1, posenet) => {
  const adjacentKeyPoints =
    posenet.getAdjacentKeyPoints(keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    let _color = color;
    if ((keypoints[0].part === 'leftWrist' && keypoints[1].part === 'leftElbow') ||
      (keypoints[1].part === 'leftWrist' && keypoints[0].part === 'leftElbow')
    ) {
      _color = skeletonColor.leftForeArm
    } else if ((keypoints[0].part === 'rightWrist' && keypoints[1].part === 'rightElbow') ||
      (keypoints[1].part === 'rightWrist' && keypoints[0].part === 'rightElbow')
    ) {
      _color = skeletonColor.rightForeArm
    } else if ((keypoints[0].part === 'leftElbow' && keypoints[1].part === 'leftShoulder') ||
      (keypoints[1].part === 'leftElbow' && keypoints[0].part === 'leftShoulder')
    ) {
      _color = skeletonColor.leftArm
    } else if ((keypoints[0].part === 'rightElbow' && keypoints[1].part === 'rightShoulder') ||
      (keypoints[1].part === 'rightElbow' && keypoints[0].part === 'rightShoulder')
    ) {
      _color = skeletonColor.rightArm
    }
    drawSegment(
      toTuple(keypoints[0].position), toTuple(keypoints[1].position), _color,
      scale, ctx);
  });
};

export const drawKeypoints = (keypoints, minConfidence, ctx, scale = 1) => {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const {y, x} = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 10, colorMap[keypoint.part] || color);
  }
};

export const drawBoundingBox = (keypoints, ctx, posenet) => {
  const boundingBox = posenet.getBoundingBox(keypoints);

  ctx.rect(
    boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
    boundingBox.maxY - boundingBox.minY);

  ctx.strokeStyle = boundingBoxColor;
  ctx.stroke();
};

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
