export function switchToDenominator(state) {
  let displayOpsExpression = "";
  let displayOps = state.displayOps;
  if (state.lastResult !== "") displayOps = "".concat(state.lastResult);
  if (state.displayOps.match(/\)\)$/) && (state.lastOperator === "trigonometry" || state.lastOperator === "abs")) {
    console.log("abs stage 1");
    let displayOpsLength = state.displayOps.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayOpsLength - 2; i >= 0; i--) {
      if (state.displayOps[i] === ")") closingNum++;
      if (state.displayOps[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i - 3;
        console.log("clos, open, firstOp", closingNum, openingNum, firstOpeningIndex);
        break;
      }
    }
    displayOpsExpression = state.displayOps.slice(0, firstOpeningIndex).concat(`1 / (${state.displayOps.slice(firstOpeningIndex)})`);
    return displayOpsExpression;
  } else if (state.displayOps.match(/\)\)$/) && (state.lastOperator !== "trigonometry" || state.lastOperator !== "abs")) {
    console.log("abs stage 0.7");
    let displayOpsLength = state.displayOps.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayOpsLength - 2; i >= 0; i--) {
      if (state.displayOps[i] === ")") closingNum++;
      if (state.displayOps[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i;
        console.log("clos, open, firstOp", closingNum, openingNum, firstOpeningIndex);
        break;
      }
    }
    displayOpsExpression = state.displayOps.slice(0, firstOpeningIndex).concat(`1 / (${state.displayOps.slice(firstOpeningIndex)})`);
    return displayOpsExpression;
  } else if (state.lastOperator === "trigonometry" || state.lastOperator === "abs") {
    console.log("abs stage 2");
    let matchTrigonometry = state.displayOps.match(/sin|cos|tan|cot|sec|csc|abs/gi);
    let lastTrigonometryIndex = state.displayOps.lastIndexOf(matchTrigonometry[matchTrigonometry.length - 1]);
    displayOpsExpression = state.displayOps.slice(0, lastTrigonometryIndex).concat(`1 / (${state.displayOps.slice(lastTrigonometryIndex)})`);
    return displayOpsExpression;
  } else if (state.lastInput === ")") {
    console.log("abs stage 3");
    let displayOpsLength = displayOps.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayOpsLength - 2; i >= 0; i--) {
      if (displayOps[i] === ")") closingNum++;
      if (displayOps[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i;
        break;
      }
    }
    displayOpsExpression = displayOps.slice(0, firstOpeningIndex).concat(`1 / (${displayOps.slice(firstOpeningIndex)})`);
    console.log("you are here amigo", displayOpsExpression, closingNum, openingNum, firstOpeningIndex);
    return displayOpsExpression;
  } else if (state.lastInputType === "digit") {
    console.log("abs stage 4");
    if (displayOps.match(/[ \* | \/ | \+ | - ] - \d+\.\d+$|[ \* | \/ | \+ | - ] - \d+$/)) {
      console.log("abs stage 4.1");
      let lastNegativeNum = displayOps.match(/ - \d+\.\d+$| - \d+$/);
      displayOpsExpression = displayOps.slice(0, lastNegativeNum.index).concat(`1 / (${lastNegativeNum})`);
      console.log("lastNegativeNumIndex", lastNegativeNum, "displayOpsExpression", displayOpsExpression);
      return displayOpsExpression;
    } else if (displayOps.match(/\( - \d+\.\d+$|\( - \d+$/)) {
      console.log("abs stage 4.15");
      let lastNegativeNum = displayOps.match(/\( - \d+\.\d+$|\( - \d+$/);
      displayOpsExpression = displayOps.slice(0, lastNegativeNum.index + 1).concat(`1 / ${lastNegativeNum})`);
      console.log("lastNegativeNum.index", lastNegativeNum.index, "displayOpsExpression", displayOpsExpression);
      return displayOpsExpression;
    } else if (displayOps.match(/- \d+\.\d+$| - \d+$/)) {
      console.log("denominator stage 4.2");
      let lastNegativeNum = displayOps.match(/ - \d+\.\d+$| - \d+$/);
      displayOpsExpression = lastNegativeNum.index !== 0 ? displayOps.slice(0, lastNegativeNum.index).concat(" + ").concat(`1 / (${lastNegativeNum})`) : displayOps.slice(0, lastNegativeNum.index).concat(`1 / (${lastNegativeNum})`);

      console.log("lastNegativeNum.index", lastNegativeNum.index, "displayOpsExpression", displayOpsExpression);
      return displayOpsExpression;
    } else {
      console.log("denominator stage 4.3");
      let regexNum = new RegExp(`${state.displayCur}$`);
      let lastNumIndex = displayOps.match(regexNum).index;
      displayOpsExpression = displayOps.slice(0, lastNumIndex).concat(`1 / (${state.displayCur})`);
      return displayOpsExpression;
    }
  } else if (state.lastInput === "!" || state.lastInputType === "%") {
    console.log("denominator stage 5");
    let regexNum = new RegExp(/-\d+\.\d+!%$|\d+\.\d+!%$|-\d+!%$|\d+!%$|-\d+\.\d+%!$|\d+\.\d+%!$|-\d+%!$|\d+%!$|-\d+\.\d+!$|\d+\.\d+!$|-\d+!$|\d+!$|-\d+\.\d+%$|\d+\.\d+%$|-\d+%$|\d+%$/);
    let lastNum = displayOps.match(regexNum);
    displayOpsExpression = displayOps.slice(0, lastNum.index).concat(`1 / (${lastNum})`);
    return displayOpsExpression;
  }
}
