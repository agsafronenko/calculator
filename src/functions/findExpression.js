export let expression = "";
export let expressionNegative = "";
export let regex = "";

export function findExpression(state) {
  let displayAll = state.displayAll;
  if (state.lastResult !== "") displayAll = state.lastResult;

  if (displayAll.match(/\)\)$/) && (state.lastOperator === "trigonometry" || state.lastOperator === "abs")) {
    console.log("stage 1 start");
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
    console.log("stage 2 start");
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
    console.log("stage 3 start");
    let matchTrigOrAbs = displayAll.match(/sin|cos|tan|cot|sec|csc|abs/gi);
    let lastTrigOrAbsIndex = displayAll.lastIndexOf(matchTrigOrAbs[matchTrigOrAbs.length - 1]);
    regex = displayAll.slice(lastTrigOrAbsIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(lastTrigOrAbsIndex);
  } else if (state.lastInput === ")") {
    console.log("stage 4 start");
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
    console.log("stage 5 start");
    regex = displayAll.match(/\d+(?:\.\d*)?$/)[0];
    expression = regex;
  } else if (state.lastInputType === "!" || state.lastInputType === "%") {
    console.log("stage 6 start");
    regex = displayAll.match(/\d+(?:\.\d*)?(!%|%!|!|%)$/)[0];
    expression = regex;
  }
  expressionNegative = displayAll.endsWith(` - ${expression}`);
}
