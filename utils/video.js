export const setupCamera = async (videoEl) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
    }
    const deviceId = '35a58b5f0a2fa20dfb6f26c41eb07d0824b31e7f3aab3a7de5ff8f4fb51ebc1d'

    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
          facingMode: 'user',
          // deviceId: deviceId
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
