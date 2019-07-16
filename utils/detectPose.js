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
}
