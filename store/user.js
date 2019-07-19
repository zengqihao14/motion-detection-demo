const INIT_USER = 'INIT_USER';
const UPDATE_USER_NAME = 'UPDATE_USER_NAME';
const UPDATE_USER_SCORE = 'UPDATE_USER_SCORE';

export const state = () => ({
  name: 'GUEST',
  score: [],
});

export const actions = {
  initUser({commit}) {
    commit(INIT_USER, {
      name: 'GUEST',
      score: [],
    });
  },
  updateUsername({commit}, name) {
    commit(UPDATE_USER_NAME, name);
  },
  updateUserScore({commit}, score) {
    commit(UPDATE_USER_SCORE, score);
  }
};

export const mutations = {
  [INIT_USER]: (state, data) => {
    state.name = data.name;
    state.score = data.score;
  },
  [UPDATE_USER_NAME]: (state, name) => {
    state.name = name;
  },
  [UPDATE_USER_SCORE]: (state, score) => {
    state.score = [...state.score, score];
  }
};
