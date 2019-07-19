const INIT_MOTION_STATE = 'INIT_MOTION_STATE';
const UPDATE_TRAKING_POSES = 'UPDATE_TRAKING_POSES';
const UPDATE_RIGHTWRIST_STATE = 'UPDATE_RIGHTWRIST_STATE';
const UPDATE_LEFTWRIST_STATE = 'UPDATE_LEFTWRIST_STATE';

export const state = () => ({
  trakingPoses: {},
  rightWristState: '',
  leftWristState: ''
});

export const actions = {
  initMotionState({commit}) {
    commit(INIT_MOTION_STATE, {
      trakingPoses: {},
      rightWrist: '',
      leftWrist: ''
    });
  },
  updateTrakingPoses({commit}, trakingPoses) {
    commit(UPDATE_TRAKING_POSES, trakingPoses);
  },
  updateRightWristState({commit}, value) {
    commit(UPDATE_RIGHTWRIST_STATE, value);
  },
  updateLeftWristState({commit}, value) {
    commit(UPDATE_LEFTWRIST_STATE, value);
  }
};

export const mutations = {
  [INIT_MOTION_STATE]: (state, data) => {
    state.trakingPoses = data.trakingPoses;
    state.rightWristState = data.rightWristState;
    state.leftWristState = data.leftWristState;
  },
  [UPDATE_TRAKING_POSES]: (state, trakingPoses) => {
    state.trakingPoses = trakingPoses;
  },
  [UPDATE_RIGHTWRIST_STATE]: (state, value) => {
    state.rightWristState = value;
  },
  [UPDATE_LEFTWRIST_STATE]: (state, value) => {
    state.leftWristState = value;
  }
};
