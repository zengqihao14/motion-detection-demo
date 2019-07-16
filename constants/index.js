const defaultQuantBytes = 2;

const defaultMobileNetMultiplier = 0.5; // 越小越快 1.01, 1.0, 0.75, or 0.50
const defaultMobileNetStride = 16; // 越大越快 8, 16, 32
const defaultMobileNetInputResolution = 193; // 分析的图像大小，越小越快 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513

const defaultResNetMultiplier = 1.0;
const defaultResNetStride = 32;
const defaultResNetInputResolution = 257;

export const INPUT_OPTIONS = {
  architecture: 'MobileNetV1',
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
