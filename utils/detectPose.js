import { drawKeypoints } from '~/utils/canvas'
import { INPUT_OPTIONS, SINGLE_POSE_OPTIONS, OUTPUT_OPTIONS } from '~/constants';

export const angleBetween = (vector1, vector2) => {
  if (vector1 && vector2) {
    const sin = (vector1.x * vector2.y) - (vector2.x * vector1.y);
    const cos = (vector1.x * vector2.x) + (vector1.y * vector2.y);
    return Math.abs(Math.atan2(sin, cos) * (180 / Math.PI));
  }
  return 0;
};

export const calcArmAngle = (wristPos, elbowPos, shoulderPos) => {
  if (wristPos && elbowPos && shoulderPos) {
    const forearm = {
      x: elbowPos.x - wristPos.x,
      y: elbowPos.y - wristPos.y
    };
    const arm = {
      x: elbowPos.x - shoulderPos.x,
      y: elbowPos.y - shoulderPos.y
    };

    return angleBetween(forearm, arm);
  }
  return 0;
};

export const detectHandState = (wristPos, elbowPos, shoulderPos) => {
  if (wristPos && elbowPos) {
    return wristPos.y > elbowPos.y ? 'down' : 'up';
  }
  return 'down';
};

export const detectOverSholder = (wristPos, elbowPos, shoulderPos) => {
  if (wristPos && elbowPos && shoulderPos) {
    if (shoulderPos.y > elbowPos.y) {
      return elbowPos.y > wristPos.y ? true : false;
    }
  }
  return false;
};

export const detectWaving = (wristPos, prevWristPos, hand) => {
  if (wristPos && prevWristPos) {
    const offset = wristPos.x - prevWristPos.x;
    if (offset < -130) {
      return 'left';
    }
    if (offset > 130) {
      return 'right';
    }
    return false;
  }
  return false;
};
