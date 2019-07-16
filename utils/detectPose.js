import { drawKeypoints } from '~/utils/canvas'
import { INPUT_OPTIONS, SINGLE_POSE_OPTIONS, OUTPUT_OPTIONS } from '~/constants';

export const detectPoseInRealTime = (video, canvas, net) => {
    const ctx = canvas.getContext('2d');
    const flipPoseHorizontal = true;
    const poseDetectionFrame = async () => {
        let poses = [];

        ctx.clearRect(0, 0, video.width, video.height);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-video.width, 0);
        ctx.drawImage(video, 0, 0, video.width, video.height);
        ctx.restore();

        const pose = await net.estimatePoses(video, {
            flipHorizontal: flipPoseHorizontal,
            decodingMethod: 'single-person'
        });
        if (pose && pose.length) {
            poses = poses.concat(pose);
            const score = pose[0].score;
            const keypoints = pose[0].keypoints;
            const trakingPoses = {}

            Object.keys(keypoints).forEach(key => {
                const keypoint = keypoints[key];
                if (keypoint.part === 'rightWrist') {
                    if (score > 0.55) {
                      trakingPoses['rightWrist'] = pose[0]
                    }
                } else if (keypoint.part === 'leftWrist') {
                    if (score > 0.55) {
                      trakingPoses['leftWrist'] = pose[0]
                    }
                } else if (keypoint.part === 'rightElbow') {
                    if (score > 0.55) {
                      trakingPoses['rightElbow'] = pose[0]
                    }
                } else if (keypoint.part === 'leftElbow') {
                  if (score > 0.55) {
                    trakingPoses['leftElbow'] = pose[0]
                  }
                }
            });
            // poses.forEach(({score, keypoints}) => {
            //   drawKeypoints(keypoints, ctx);
            // });
        }
        requestAnimationFrame(poseDetectionFrame);
    }
    poseDetectionFrame();
};

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
