import firebase from '~/utils/firebase.js';

export default async function ({store, redirect}) {
  if(process.server) {
    return;
  }
  await store.dispatch('INIT_AUTH');
};
