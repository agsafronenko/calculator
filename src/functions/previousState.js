export let stateStorage = {
  prevState: [],
};

export function saveState(state) {
  if (stateStorage.prevState.length >= 30) {
    stateStorage.prevState.pop();
    stateStorage.prevState.unshift(state);
  } else {
    stateStorage.prevState.unshift(state);
  }
  return stateStorage.prevState;
}
