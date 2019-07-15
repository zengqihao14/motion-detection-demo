import { drawKeypoints } from '~/utils/canvas'

export const detectPoseInRealTime = (video, canvas, net) => {
    const ctx = canvas.getContext('2d');
    const flipPoseHorizontal = true;
    const poseDetectionFrame = async() => {
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
            const keypoints = pose[0].keypoints;
            const trakingPoses = {}

            Object.keys(keypoints).forEach(key => {
                const keypoint = keypoints[key];
                if (keypoint.part === 'rightWrist') {
                    trakingPoses['rightWrist'] = keypoint.position
                } else if (keypoint.part === 'leftWrist') {
                    trakingPoses['leftWrist'] = keypoint.position
                } else if (keypoint.part === 'rightElbow') {
                    trakingPoses['rightElbow'] = keypoint.position
                } else if (keypoint.part === 'leftElbow') {
                    trakingPoses['leftElbow'] = keypoint.position
                }
            });
            poses.forEach(({score, keypoints}) => {
                drawKeypoints(keypoints, ctx);
            });
        }

        requestAnimationFrame(poseDetectionFrame);
    }
    poseDetectionFrame();
}