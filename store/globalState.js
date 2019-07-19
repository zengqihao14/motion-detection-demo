const INIT_GLOBAL_STATE = 'INIT_GLOBAL_STATE';
const UPDATE_QUESTION_ID = 'UPDATE_QUESTION_ID';
const UPDATE_SELECTED_OPTION_ID = 'UPDATE_SELECTED_OPTION_ID';
const SET_GLOBAL_BUSY = 'SET_GLOBAL_BUSY';
const UNSET_GLOBAL_BUSY = 'UNSET_GLOBAL_BUSY';
const SET_GLOBAL_DEBUG = 'SET_GLOBAL_DEBUG';
const UNSET_GLOBAL_DEBUG = 'UNSET_GLOBAL_DEBUG';

export const state = () => ({
  isStarting: false,
  currentQuestionId: null,
  selectedOptionId: null,
  isBusy: false,
  isDebug: false
});

export const actions = {
  initGlobalState({commit}) {
    commit(INIT_GLOBAL_STATE, {
      isStarting: false,
      currentQuestionId: null,
      selectedOptionId: null,
      isBusy: false,
      isDebug: false
    });
  },
  updateCurrentQuestionId({commit}, id) {
    commit(UPDATE_QUESTION_ID, id);
  },
  updateSelectedOptionId({commit}, id) {
    commit(UPDATE_SELECTED_OPTION_ID, id);
  },
  setGlobalBusy({commit}) {
    commit(SET_GLOBAL_BUSY);
  },
  unsetGlobalBusy({commit}) {
    commit(UNSET_GLOBAL_BUSY);
  },
  setGlobalDebug({commit}) {
    commit(SET_GLOBAL_DEBUG);
  },
  unsetGlobalDebug({commit}) {
    commit(UNSET_GLOBAL_DEBUG);
  }
};

export const mutations = {
  [INIT_GLOBAL_STATE]: (state, data) => {
    state = data;
  },
  [UPDATE_QUESTION_ID]: (state, id) => {
    state.currentQuestionId = id;
  },
  [UPDATE_SELECTED_OPTION_ID]: (state, id) => {
    state.selectedOptionId = id;
  },
  [SET_GLOBAL_BUSY]: (state) => {
    state.isBusy = true;
  },
  [UNSET_GLOBAL_BUSY]: (state) => {
    state.isBusy = false;
  },
  [SET_GLOBAL_DEBUG]: (state) => {
    state.isDebug = true;
  },
  [UNSET_GLOBAL_DEBUG]: (state) => {
    state.isDebug = false;
  }
};
