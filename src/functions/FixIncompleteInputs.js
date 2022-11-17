export let displayAllExpression = "";

export function FixIncompleteInputs(state, expr) {
  if (state.lastInputType === "operator") {
    let lastDigitIndex = expr
      .split("")
      .reverse()
      .findIndex((elem) => /\d|\)/.test(elem));
    displayAllExpression = expr.slice(0, expr.length - lastDigitIndex);
  } else {
    displayAllExpression = expr;
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

// export function deleteRedundantOperators(state) {
//   console.log("deleteRedundant", state.displayAll);
//   console.log("state.displayCur", state.displayCur);
//   if (state.lastOperator === "trigonometry" || state.displayCur === "" || /\)|!|%|\d/.test(state.displayCur)) {
//     displayAllExpression = state.displayAll;
//   } else {
//     let lastDigitIndex = state.displayAll
//       .split("")
//       .reverse()
//       .findIndex((elem) => /\d/.test(elem));
//     displayAllExpression = state.displayAll.slice(0, state.displayAll.length - lastDigitIndex);
//   }
//   addMissingParenthesis(state.parenthesesDelta);
//   console.log("deleteRedundant after", displayAllExpression);
// }

// export function addMissingParenthesis(delta) {
//   if (delta > 0) {
//     displayAllExpression += ")";
//     delta -= 1;
//     addMissingParenthesis(delta);
//   }
// }
