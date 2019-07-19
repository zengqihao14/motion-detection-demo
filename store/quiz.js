import { QUESTIONS } from '~/constants/question';

const INIT_QUIZ = 'INIT_QUIZ';
const RESET_QUIZ = 'RESET_QUIZ';
const UPDATE_QUESTION_ID = 'UPDATE_QUESTION_ID';
const UPDATE_SELECTED_OPTION_ID = 'UPDATE_SELECTED_OPTION_ID';
const SET_QUIZ_CREATING = 'SET_QUIZ_CREATING';
const UNSET_QUIZ_CREATING = 'UNSET_QUIZ_CREATING';
const SET_QUIZ_READY = 'SET_QUIZ_READY';
const UNSET_QUIZ_READY = 'UNSET_QUIZ_READY';
const SET_QUIZ_SUBMITTING = 'SET_QUIZ_SUBMITTING';
const UNSET_QUIZ_SUBMITTING = 'UNSET_QUIZ_SUBMITTING';

export const state = () => ({
  questions: QUESTIONS,
  currentQuestionId: -1,
  selectedOptionId: -1,
  isCreating: false,
  isReady: false,
  isSubmitting: false
});

export const actions = {
  initQuiz({commit}) {
    commit(INIT_QUIZ, {
      questions: QUESTIONS,
      currentQuestionId: -1,
      selectedOptionId: -1,
      isCreating: false,
      isReady: false,
      isSubmitting: false,
    });
  },
  resetQuiz({commit}) {
    commit(RESET_QUIZ, {
      selectedOptionId: -1,
      isCreating: false,
      isReady: false,
      isSubmitting: false,
    });
  },
  updateCurrentQuestionId({commit}, id) {
    commit(UPDATE_QUESTION_ID, id);
  },
  updateSelectedOptionId({commit}, id) {
    commit(UPDATE_SELECTED_OPTION_ID, id);
  },
  setQuizCreating({commit}) {
    commit(SET_QUIZ_CREATING);
  },
  unsetQuizCreating({commit}) {
    commit(UNSET_QUIZ_CREATING);
  },
  setQuizReady({commit}) {
    commit(SET_QUIZ_READY);
  },
  unsetQuizReady({commit}) {
    commit(UNSET_QUIZ_READY);
  },
  setQuizSubmitting({commit}) {
    commit(SET_QUIZ_SUBMITTING);
  },
  unsetQuizSubmitting({commit}) {
    commit(UNSET_QUIZ_SUBMITTING);
  }
};

export const mutations = {
  [INIT_QUIZ]: (state, data) => {
    state.questions = data.questions;
    state.currentQuestionId = data.currentQuestionId;
    state.selectedOptionId = data.selectedOptionId;
    state.isCreating = data.isCreating;
    state.isReady = data.isReady;
    state.isSubmitting = data.isSubmitting;
  },
  [RESET_QUIZ]: (state, data) => {
    state.selectedOptionId = data.selectedOptionId;
    state.isCreating = data.isCreating;
    state.isReady = data.isReady;
    state.isSubmitting = data.isSubmitting;
  },
  [UPDATE_QUESTION_ID]: (state, id) => {
    state.currentQuestionId = id;
  },
  [UPDATE_SELECTED_OPTION_ID]: (state, id) => {
    state.selectedOptionId = id;
  },
  [SET_QUIZ_CREATING]: (state) => {
    state.isCreating = true;
  },
  [UNSET_QUIZ_CREATING]: (state) => {
    state.isCreating = false;
  },
  [SET_QUIZ_READY]: (state) => {
    state.isReady = true;
  },
  [UNSET_QUIZ_READY]: (state) => {
    state.isReady = false;
  },
  [SET_QUIZ_SUBMITTING]: (state) => {
    state.isSubmitting = true;
  },
  [UNSET_QUIZ_SUBMITTING]: (state) => {
    state.isSubmitting = false;
  }
};
