export let displayAllExpression = "";

export function FixIncompleteInputs(state, expr) {
  if (/\d/.test(expr) === false) {
    displayAllExpression = "0";
  } else {
    let openingParanthesesAfterTheLastDigit = 0;
    if (state.lastInputType !== "digit" && state.lastInput !== ")") {
      let lastDigitIndex = expr
        .split("")
        .reverse()
        .findIndex((elem) => /\d|!|%|\)/.test(elem));
      displayAllExpression = expr.slice(0, expr.length - lastDigitIndex);
      let afterTheLastDigit = expr.slice(expr.length - lastDigitIndex);

      for (let i = 0; i < afterTheLastDigit.length; i++) {
        if (afterTheLastDigit[i] === "(") openingParanthesesAfterTheLastDigit++;
      }
    } else {
      displayAllExpression = expr;
    }
    addMissingParenthesis(state.parenthesesDelta - openingParanthesesAfterTheLastDigit);
  }
}

function addMissingParenthesis(delta) {
  if (delta > 0) {
    displayAllExpression += ")";
    delta -= 1;
    addMissingParenthesis(delta);
  }
}
