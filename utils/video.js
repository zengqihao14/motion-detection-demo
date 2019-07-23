const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

const isiOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const isMobile = () => {
  return isAndroid() || isiOS();
};

export const setupCamera = async (videoEl) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
  }

  let deviceList = [];
  await navigator.mediaDevices.enumerateDevices().then(devices => {
    deviceList = devices.filter(device => {
      return device.kind === 'videoinput'
    })
  }).catch(err => {
    throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
  });

  // const deviceId = '35a58b5f0a2fa20dfb6f26c41eb07d0824b31e7f3aab3a7de5ff8f4fb51ebc1d'

  const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
      deviceId: deviceList[0].deviceId,
      width: 640
    },
  });
  const {width, height} = stream.getTracks()[0].getSettings();
  console.log(`video size: ${width}x${height}`);
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
