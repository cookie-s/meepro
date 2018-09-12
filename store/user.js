import { init, auth } from "~/utils/firebase/auth.js";
import { db } from "~/utils/firebase/db.js";

import { deepCopy } from "~/utils/utils.js";

const defaultState = () =>
  deepCopy({
    auth: null,
    uid: "",
    displayName: "",
    photoURL: "",
    occupation: ""
  });

export const state = () => defaultState();

export const mutations = {
  setAuth(state, auth) {
    const { uid, displayName, photoURL } = Object.assign(
      {},
      defaultState(),
      auth
    );
    Object.assign(state, { auth: !!auth, uid, displayName, photoURL });
  },
  setProfile(state, { occupation }) {
    Object.assign(state, { occupation });
  },
  reset(state) {
    Object.assign(state, defaultState());
  }
};

export const actions = {
  async INIT_AUTH({ dispatch }) {
    await init;
    await dispatch("CHANGE_USER");
  },
  async FETCH_PROFILE({ state, commit, getters }) {
    if (!getters.isLogin) return;

    const doc = await db
      .collection("users")
      .doc(state.uid)
      .get();
    let profile = { occupation: "" };
    if (doc.exists) {
      Object.assign(profile, doc.data());
    }
    commit("setProfile", profile);
  },
  async CHANGE_USER({ commit }) {
    commit("reset");
    commit("setAuth", auth.currentUser);
  },
  async UPDATE_PROFILE({ state, commit }, { occupation, name, photoURL }) {
    await db
      .collection("users")
      .doc(state.uid)
      .set({
        occupation,
        name,
        photoURL
      });
    commit("setProfile", { occupation });
  }
};

export const getters = {
  isLogin(state) {
    return !!state.auth;
  }
};
