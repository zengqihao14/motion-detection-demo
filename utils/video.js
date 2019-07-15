export const setupCamera = async (videoEl) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            'Browser API navigator.mediaDevices.getUserMedia not available');
    }
    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
            facingMode: 'user',
        },
    });
    videoEl.srcObject = stream;

    return new Promise((resolve) => {
        videoEl.onloadedmetadata = () => {
            resolve(videoEl);
        };
    });
};

export const loadVideo = async (videoEl) => {
    const video = await setupCamera(videoEl);
    video.play();
    return video;
};