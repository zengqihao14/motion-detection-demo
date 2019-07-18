const defaultQuantBytes = 2;

const defaultMobileNetMultiplier = 1; // 越小越快 1.01, 1.0, 0.75, or 0.50
const defaultMobileNetStride = 32; // 越大越快 8, 16, 32
const defaultMobileNetInputResolution = 321; // 分析的图像大小，越小越快 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513

const defaultResNetMultiplier = 1.0;
const defaultResNetStride = 32;
const defaultResNetInputResolution = 257;

export const SCORE_THRESHOLDS = {
  main: 0.7,
  rightWrist: 0.56,
  leftWrist: 0.56,
  rightElbow: 0.6,
  leftElbow: 0.6,
  rightShoulder: 0.6,
  leftShoulder: 0.6
};

export const INPUT_OPTIONS = {
  architecture: 'ResNet50', // MobileNetV1, ResNet50
  outputStride: defaultMobileNetStride,
  inputResolution: defaultMobileNetInputResolution,
  multiplier: defaultMobileNetMultiplier,
  quantBytes: defaultQuantBytes
};
export const SINGLE_POSE_OPTIONS = {
  minPoseConfidence: 0.1,
  minPartConfidence: 0.5,
};
export const OUTPUT_OPTIONS = {
  showVideo: true,
  showSkeleton: true,
  showPoints: true,
  showBoundingBox: false,
};
