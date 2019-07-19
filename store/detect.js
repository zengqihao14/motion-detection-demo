const INIT_DETECT = 'INIT_DETECT';
const RESET_DETECT = 'RESET_DETECT';
const SET_DETECT = 'SET_DETECT';
const SET_DETECT_LOADING = 'SET_DETECT_LOADING';
const UNSET_DETECT_LOADING = 'UNSET_DETECT_LOADING';
const SET_DETECT_STOP = 'SET_DETECT_STOP';
const UNSET_DETECT_STOP = 'UNSET_DETECT_STOP';

export const state = () => ({
  isLoading: true,
  video: null,
  canvas: null,
  net: null,
  bodyNet: null,
  isStopTrading: true
});

export const actions = {
  initDetect({commit}) {
    commit(INIT_DETECT, {
      isLoading: true,
      video: null,
      canvas: null,
      net: null,
      bodyNet: null,
      isStopTrading: true
    });
  },
  resetDetect({commit}) {
    commit(RESET_DETECT, {
      isStopTrading: false
    });
  },
  setDetect({commit}, { video, canvas, net, bodyNet }) {
    commit(SET_DETECT, { video, canvas, net, bodyNet });
  },
  startDetect({commit}) {
    commit(UNSET_DETECT_STOP);
  },
  stopDetect({commit}) {
    commit(SET_DETECT_STOP);
  },
  setDetectLoading({commit}) {
    commit(SET_DETECT_LOADING);
  },
  unsetDetectLoading({commit}) {
    commit(UNSET_DETECT_LOADING);
  }
};

export const mutations = {
  [INIT_DETECT]: (state, data) => {
    state = data;
  },
  [RESET_DETECT]: (state, data) => {
    state.isStopTrading = data.isStopTrading;
  },
  [SET_DETECT]: (state, data) => {
    state.video = data.video;
    state.canvas = data.canvas;
    state.net = data.net;
    state.bodyNet = data.bodyNet;
  },
  [SET_DETECT_STOP]: (state) => {
    state.isStopTrading = true;
  },
  [UNSET_DETECT_STOP]: (state) => {
    state.isStopTrading = false;
  },
  [SET_DETECT_LOADING]: (state) => {
    state.isLoading = true;
  },
  [UNSET_DETECT_LOADING]: (state) => {
    state.isLoading = false;
  }
};
