import { SCORE_THRESHOLDS } from '~/constants';

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

export const poseFilter = (pose, updateTrakingPoses = () => {}) => {
  if (pose && pose.length) {
    const keypoints = pose[0].keypoints;
    const trakingPoses = {};

    Object.keys(keypoints).forEach(key => {
      const keypoint = keypoints[key];
      if (keypoint.part === 'rightWrist') {
        if (keypoint.score > SCORE_THRESHOLDS.rightWrist) {
          trakingPoses['rightWrist'] = keypoint;
        }
      } else if (keypoint.part === 'leftWrist') {
        if (keypoint.score > SCORE_THRESHOLDS.leftWrist) {
          trakingPoses['leftWrist'] = keypoint;
        }
      } else if (keypoint.part === 'rightElbow') {
        if (keypoint.score > SCORE_THRESHOLDS.rightElbow) {
          trakingPoses['rightElbow'] = keypoint;
        }
      } else if (keypoint.part === 'leftElbow') {
        if (keypoint.score > SCORE_THRESHOLDS.leftElbow) {
          trakingPoses['leftElbow'] = keypoint;
        }
      } else if (keypoint.part === 'rightShoulder') {
        if (keypoint.score > SCORE_THRESHOLDS.rightShoulder) {
          trakingPoses['rightShoulder'] = keypoint;
        }
      } else if (keypoint.part === 'leftShoulder') {
        if (keypoint.score > SCORE_THRESHOLDS.leftShoulder) {
          trakingPoses['leftShoulder'] = keypoint;
        }
      }
    });

    // updateTrakingPoses in stroe
    if (updateTrakingPoses) {
      updateTrakingPoses(trakingPoses);
    }
  }
};

export const detectHandState = (wristPos, elbowPos, shoulderPos) => {
  if (wristPos && elbowPos) {
    return wristPos.y > elbowPos.y ? 'down' : 'up';
  }
  return 'down';
};

export const detectOverSholder = (wristPos, elbowPos, shoulderPos) => {
  return shoulderPos.y > elbowPos.y;
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

export const detectArea = (wrist, trakingPoses, canvas, updateSelectedOptionId = () => {}) => {
  let idx = -1;
  // const rightShoulder = trakingPoses.rightShoulder || null;
  // const leftShoulder = trakingPoses.leftShoulder || null;
  //
  // if (wrist && rightShoulder && leftShoulder) {
  //   const center = rightShoulder.position.x + Math.abs((rightShoulder.position.x - leftShoulder.position.x) / 2)
  //   if (wrist.position.x < rightShoulder.position.x) {
  //     idx = 0;
  //   } else if (wrist.position.x > leftShoulder.position.x) {
  //     idx = 3;
  //   } else if (wrist.position.x >= rightShoulder.position.x && wrist.position.x <= center) {
  //     idx = 1;
  //   } else if (wrist.position.x > center && wrist.position.x <= leftShoulder.position.x) {
  //     idx = 2 ;
  //   }
  //   updateSelectedOptionId(idx);
  // }
  if (wrist && canvas) {
    const wristPosition = wrist.position;
    const center = canvas.width / 2;
    const alpha = 0.7;

    const areaA = [
      center - alpha * center,
      center - (alpha * center / 2)
    ];
    const areaB = [
      center - (alpha * center / 2),
      center
    ];
    const areaC = [
      center,
      center + (alpha * center / 2)
    ];
    const areaD = [
      center + (alpha * center / 2),
      center + alpha * center
    ];

    if (wristPosition.x < areaA[1]) {
      idx = 0;
    } else if (wristPosition.x > areaD[0]) {
      idx = 3;
    } else if (wristPosition.x >= areaB[0] && wristPosition.x <= areaB[1]) {
      idx = 1;
    } else if (wristPosition.x > areaC[0] && wristPosition.x <= areaC[1]) {
      idx = 2 ;
    }
    updateSelectedOptionId(idx);
  }
};

export const detectPose = (trakingPoses, hand, canvas, updateWristState = () => {}) => {
  if (trakingPoses && hand) {

    let state = '';
    const rightWrist = trakingPoses.rightWrist || null;
    const rightElbow = trakingPoses.rightElbow || null;
    const rightShoulder = trakingPoses.rightShoulder || null;
    const leftWrist = trakingPoses.leftWrist || null;
    const leftElbow = trakingPoses.leftElbow || null;
    const leftShoulder = trakingPoses.leftShoulder || null;
    if (hand === 'right' && rightWrist && rightElbow && rightShoulder) {
      state = detectHandState(rightWrist.position, rightElbow.position, rightShoulder.position);
      if (detectOverSholder(rightWrist.position, rightElbow.position, rightShoulder.position)) {
        state = 'overSholder';
      }
      updateWristState(state);
    } else if (hand === 'left' && leftWrist && leftElbow && leftShoulder) {
      state = detectHandState(leftWrist.position, leftElbow.position, leftShoulder.position);
      if (detectOverSholder(leftWrist.position, leftElbow.position, leftShoulder.position)) {
        state = 'overSholder';
      }
      updateWristState(state);
    }
  }
};
