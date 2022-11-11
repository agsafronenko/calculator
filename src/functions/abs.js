export function abs(state) {
  let displayAllExpression = "";
  let displayAll = state.displayAll;
  if (state.lastResult !== "") displayAll = "".concat(state.lastResult);
  if (state.displayAll.match(/\)\)$/) && (state.lastOperator === "trigonometry" || state.lastOperator === "abs")) {
    console.log("abs stage 0.5");
    let displayAllLength = state.displayAll.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayAllLength - 2; i >= 0; i--) {
      if (state.displayAll[i] === ")") closingNum++;
      if (state.displayAll[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i - 3;
        console.log("clos, open, firstOp", closingNum, openingNum, firstOpeningIndex);
        break;
      }
    }
    displayAllExpression = state.displayAll.slice(0, firstOpeningIndex).concat(`abs(${state.displayAll.slice(firstOpeningIndex)})`);
    return displayAllExpression;
  } else if (state.displayAll.match(/\)\)$/) && (state.lastOperator !== "trigonometry" || state.lastOperator !== "abs")) {
    console.log("abs stage 0.7");
    let displayAllLength = state.displayAll.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayAllLength - 2; i >= 0; i--) {
      if (state.displayAll[i] === ")") closingNum++;
      if (state.displayAll[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i;
        console.log("clos, open, firstOp", closingNum, openingNum, firstOpeningIndex);
        break;
      }
    }
    displayAllExpression = state.displayAll.slice(0, firstOpeningIndex).concat(`abs(${state.displayAll.slice(firstOpeningIndex)})`);
    return displayAllExpression;
  } else if (state.lastOperator === "trigonometry" || state.lastOperator === "abs") {
    console.log("abs stage 2");
    let matchTrigonometry = state.displayAll.match(/sin|cos|tan|cot|sec|csc|abs/gi);
    let lastTrigonometryIndex = state.displayAll.lastIndexOf(matchTrigonometry[matchTrigonometry.length - 1]);
    displayAllExpression = state.displayAll.slice(0, lastTrigonometryIndex).concat(`abs(${state.displayAll.slice(lastTrigonometryIndex)})`);
    return displayAllExpression;
  } else if (state.lastInput === ")") {
    console.log("abs stage 3");
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
    displayAllExpression = displayAll.slice(0, firstOpeningIndex).concat(`abs(${displayAll.slice(firstOpeningIndex)})`);
    console.log("you are here amigo", displayAllExpression, closingNum, openingNum, firstOpeningIndex);
    return displayAllExpression;
  } else if (state.lastInputType === "digit") {
    console.log("abs stage 4");
    if (displayAll.match(/[ \* | \/ | \+ | - ] - \d+\.\d+$|[ \* | \/ | \+ | - ] - \d+$/)) {
      console.log("abs stage 4.1");
      let lastNegativeNum = displayAll.match(/ - \d+\.\d+$| - \d+$/);
      displayAllExpression = displayAll.slice(0, lastNegativeNum.index).concat(`abs(${lastNegativeNum})`);
      console.log("lastNegativeNumIndex", lastNegativeNum, "displayAllExpression", displayAllExpression);
      return displayAllExpression;
    } else if (displayAll.match(/\( - \d+\.\d+$|\( - \d+$/)) {
      console.log("abs stage 4.15");
      let lastNegativeNum = displayAll.match(/\( - \d+\.\d+$|\( - \d+$/);
      displayAllExpression = displayAll.slice(0, lastNegativeNum.index + 1).concat(`abs${lastNegativeNum})`);
      console.log("lastNegativeNum.index", lastNegativeNum.index, "displayAllExpression", displayAllExpression);
      return displayAllExpression;
    } else if (displayAll.match(/- \d+\.\d+$| - \d+$/)) {
      console.log("abs stage 4.2");
      let lastNegativeNum = displayAll.match(/ - \d+\.\d+$| - \d+$/);
      displayAllExpression = lastNegativeNum.index !== 0 ? displayAll.slice(0, lastNegativeNum.index).concat(" + ").concat(`abs(${lastNegativeNum})`) : displayAll.slice(0, lastNegativeNum.index).concat(`abs(${lastNegativeNum})`);
      console.log("lastNegativeNum.index", lastNegativeNum.index, "displayAllExpression", displayAllExpression);
      return displayAllExpression;
    } else {
      console.log("abs stage 4.3");
      let regexNum = new RegExp(`${state.displayCur}$`);
      let lastNumIndex = displayAll.match(regexNum).index;
      displayAllExpression = displayAll.slice(0, lastNumIndex).concat(`abs(${state.displayCur})`);
      return displayAllExpression;
    }
  } else if (state.lastInput === "!" || state.lastInputType === "%") {
    console.log("abs stage 5");
    let regexNum = new RegExp(/-\d+\.\d+!%$|\d+\.\d+!%$|-\d+!%$|\d+!%$|-\d+\.\d+%!$|\d+\.\d+%!$|-\d+%!$|\d+%!$|-\d+\.\d+!$|\d+\.\d+!$|-\d+!$|\d+!$|-\d+\.\d+%$|\d+\.\d+%$|-\d+%$|\d+%$/);
    let lastNum = displayAll.match(regexNum);
    displayAllExpression = displayAll.slice(0, lastNum.index).concat(`abs(${lastNum})`);
    return displayAllExpression;
  }
}
