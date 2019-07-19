import { STAGE } from '~/constants/stage';
import { QUESTIONS } from '~/constants/question';

const INIT_GLOBAL_STATE = 'INIT_GLOBAL_STATE';
const RESET_GLOBAL_STATE = 'RESET_GLOBAL_STATE';
const UPDATE_GLOBAL_STAGE = 'UPDATE_GLOBAL_STAGE';
const SET_GLOBAL_BUSY = 'SET_GLOBAL_BUSY';
const UNSET_GLOBAL_BUSY = 'UNSET_GLOBAL_BUSY';
const SET_GLOBAL_DEBUG = 'SET_GLOBAL_DEBUG';
const UNSET_GLOBAL_DEBUG = 'UNSET_GLOBAL_DEBUG';

export const state = () => ({
  stage: STAGE.START,
  questions: QUESTIONS,
  currentQuestionId: -1,
  selectedOptionId: -1,
  isBusy: false,
  isDebug: false
});

export const actions = {
  initGlobalState({commit}) {
    commit(INIT_GLOBAL_STATE, {
      stage: STAGE.START,
      isBusy: false,
      isDebug: false
    });
  },
  resetGlobalState({commit}) {
    commit(RESET_GLOBAL_STATE, {
      selectedOptionId: -1,
      isBusy: false,
    });
  },
  updateGlobalStage({commit}, stage) {
    commit(UPDATE_GLOBAL_STAGE, stage);
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
    state.stage = data.stage;
    state.isBusy = data.isBusy;
    state.isDebug = data.isDebug;
  },
  [RESET_GLOBAL_STATE]: (state, data) => {
    state.isBusy = data.isBusy;
  },
  [UPDATE_GLOBAL_STAGE]: (state, stage) => {
    state.stage = stage;
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
