export let expression = "";
export let regex = "";

export function findExpression(state) {
  let displayAll = state.displayAll;
  if (state.lastResult !== "") displayAll = state.lastResult;

  if (displayAll.match(/\)\)$/) && (state.lastOperator === "trigonometry" || state.lastOperator === "abs")) {
    let displayAllLength = displayAll.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayAllLength - 2; i >= 0; i--) {
      if (displayAll[i] === ")") closingNum++;
      if (displayAll[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i - 3;
        break;
      }
    }

    regex = displayAll.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(firstOpeningIndex);
  } else if (displayAll.match(/\)\)$/ && state.lastOperator !== "trigonometry" && state.lastOperator !== "abs")) {
    let displayAllLength = displayAll.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayAllLength - 2; i >= 0; i--) {
      if (displayAll[i] === ")") closingNum++;
      if (displayAll[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i;
        break;
      }
    }
    regex = displayAll.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(firstOpeningIndex);
  } else if (state.lastOperator === "trigonometry" || state.lastOperator === "abs") {
    let matchTrigOrAbs = displayAll.match(/sin|cos|tan|cot|sec|csc|abs/gi);
    let lastTrigOrAbsIndex = displayAll.lastIndexOf(matchTrigOrAbs[matchTrigOrAbs.length - 1]);
    regex = displayAll.slice(lastTrigOrAbsIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(lastTrigOrAbsIndex);
  } else if (state.lastInput === ")") {
    let displayAllLength = displayAll.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayAllLength - 2; i >= 0; i--) {
      if (displayAll[i] === ")") closingNum++;
      if (displayAll[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i;
        break;
      }
    }
    regex = displayAll.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(firstOpeningIndex);
  } else if (state.lastInputType === "digit" || state.lastInputType === "decimal") {
    regex = displayAll.match(/\d+(?:\.\d*)?$/)[0];
    expression = regex;
  } else if (displayAll.match(/\(.*\)(!%|%!|!|%)$/)) {
    let displayAllLength = displayAll.length;
    let closingNum = 0;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayAllLength - 1; i >= 0; i--) {
      if (displayAll[i] === ")") closingNum++;
      if (displayAll[i] === "(") openingNum++;
      if (closingNum > 0 && closingNum === openingNum) {
        firstOpeningIndex = i - 3;
        break;
      }
    }
    regex = displayAll.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(firstOpeningIndex);
  } else if (displayAll.match(/\)(!%|%!|!|%)$/)) {
    let displayAllLength = displayAll.length;
    let closingNum = 0;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayAllLength - 1; i >= 0; i--) {
      if (displayAll[i] === ")") closingNum++;
      if (displayAll[i] === "(") openingNum++;
      if (closingNum > 0 && closingNum === openingNum) {
        firstOpeningIndex = i;
        break;
      }
    }
    regex = displayAll.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(firstOpeningIndex);
  } else if (state.lastInputType === "!" || state.lastInputType === "%") {
    regex = displayAll.match(/\d+(?:\.\d*)?(!%|%!|!|%)$/)[0];
    expression = regex;
  }
}
