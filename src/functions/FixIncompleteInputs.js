export let displayAllExpression = "";

export function deleteRedundantOperators(state, expr) {
  console.log("deleteRedundant expr", expr);
  if (state.lastInputType === "operator") {
    let lastDigitIndex = state.displayAll
      .split("")
      .reverse()
      .findIndex((elem) => /\d|\)/.test(elem));
    displayAllExpression = state.displayAll.slice(0, state.displayAll.length - lastDigitIndex);
  }
  addMissingParenthesis(state.parenthesesDelta);
  console.log("deleteRedundant after", displayAllExpression);
}

export function addMissingParenthesis(delta) {
  if (delta > 0) {
    displayAllExpression += ")";
    delta -= 1;
    addMissingParenthesis(delta);
  }
}
