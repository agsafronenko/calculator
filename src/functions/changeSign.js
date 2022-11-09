export let finalDisplayOpsChangeSign = "";

export function changeSign(state) {
  console.log("you are in changeSign function");
  let displayOps = state.displayOps;
  if (state.lastResult !== "") displayOps = "".concat(state.lastResult);
  if (state.displayOps.match(/\)\)$/ && state.lastInputType === "trigonometry")) {
    // console.log("trigonometry stage 0.5");
    // let displayOpsLength = state.displayOps.length;
    // let closingNum = 1;
    // let openingNum = 0;
    // let firstOpeningIndex = 0;
    // for (let i = displayOpsLength - 2; i >= 0; i--) {
    //   if (state.displayOps[i] === ")") closingNum++;
    //   if (state.displayOps[i] === "(") openingNum++;
    //   if (closingNum === openingNum) {
    //     firstOpeningIndex = i - 3;
    //     console.log("clos, open, firstOp", closingNum, openingNum, firstOpeningIndex);
    //     break;
    //   }
    // }
    // finalDisplayOpsChangeSign = state.displayOps.slice(0, firstOpeningIndex).concat(`${trigFunc}(${state.displayOps.slice(firstOpeningIndex)})`);
    // return "";
  } else if (state.displayOps.match(/\)\)$/ && state.lastInputType !== "trigonometry")) {
    // console.log("trigonometry stage 0.7");
    // let displayOpsLength = state.displayOps.length;
    // let closingNum = 1;
    // let openingNum = 0;
    // let firstOpeningIndex = 0;
    // for (let i = displayOpsLength - 2; i >= 0; i--) {
    //   if (state.displayOps[i] === ")") closingNum++;
    //   if (state.displayOps[i] === "(") openingNum++;
    //   if (closingNum === openingNum) {
    //     firstOpeningIndex = i;
    //     console.log("clos, open, firstOp", closingNum, openingNum, firstOpeningIndex);
    //     break;
    //   }
    // }
    // finalDisplayOpsChangeSign = state.displayOps.slice(0, firstOpeningIndex).concat(`${trigFunc}(${state.displayOps.slice(firstOpeningIndex)})`);
    // return "";
  } else if (state.lastOperator === "trigonometry") {
    //   console.log("trigonometry stage 1");
    //   let matchTrigonometry = state.displayOps.match(/sin|cos|tan|cot|sec|csc/gi);
    //   let lastTrigonometryIndex = state.displayOps.lastIndexOf(matchTrigonometry[matchTrigonometry.length - 1]);
    //   finalDisplayOpsChangeSign = state.displayOps.slice(0, lastTrigonometryIndex).concat(`${trigFunc}(${state.displayOps.slice(lastTrigonometryIndex)})`);
    //   return "";
    // } else if (state.lastInput === ")") {
    //   console.log("trigonometry stage 2");
    //   let displayOpsLength = state.displayOps.length;
    //   let closingNum = 1;
    //   let openingNum = 0;
    //   let firstOpeningIndex = 0;
    //   for (let i = displayOpsLength - 2; i >= 0; i--) {
    //     if (state.displayOps[i] === ")") closingNum++;
    //     if (state.displayOps[i] === "(") openingNum++;
    //     if (closingNum === openingNum) {
    //       firstOpeningIndex = i;
    //       break;
    //     }
    //   }
    //   finalDisplayOpsChangeSign = state.displayOps.slice(0, firstOpeningIndex).concat(`${trigFunc}${state.displayOps.slice(firstOpeningIndex)}`);
    //   return "";
  } else if (state.lastInputType === "digit") {
    // console.log("trigonometry stage 3");
    // if (displayOps.match(/[ \* | \/ | \+ | - ] - \d+\.\d+$|[ \* | \/ | \+ | - ] - \d+$/)) {
    //   console.log("trigonometry stage 3.1");
    //   let lastNegativeNumIndex = displayOps.match(/ - \d+\.\d+$| - \d+$/).index;
    //   let lastPositiveNum = displayOps.match(/\d+\.\d+$|\d+$/);
    //   finalDisplayOpsChangeSign = displayOps.slice(0, lastNegativeNumIndex).concat(`${trigFunc}(${lastPositiveNum * -1})`);
    //   console.log("lastNegativeNumIndex", lastNegativeNumIndex, "lastPositiveNumIndex", lastPositiveNum, "finalDisplayOpsChangeSign", finalDisplayOpsChangeSign);
    //   let calculateResult = trigonometryCalculate(curDegree * -1, trigFunc, state);
    //   return calculateResult;
    // } else if (displayOps.match(/- \d+\.\d+$| - \d+$/)) {
    //   console.log("trigonometry stage 3.2");
    //   let lastNegativeNumIndex = displayOps.match(/ - \d+\.\d+$| - \d+$/).index;
    //   let lastPositiveNum = displayOps.match(/\d+\.\d+$|\d+$/);
    //   finalDisplayOpsChangeSign =
    //     lastNegativeNumIndex !== 0
    //       ? displayOps
    //           .slice(0, lastNegativeNumIndex)
    //           .concat(" + ")
    //           .concat(`${trigFunc}(${lastPositiveNum * -1})`)
    //       : displayOps.slice(0, lastNegativeNumIndex).concat(`${trigFunc}(${lastPositiveNum * -1})`);
    //   console.log("lastNegativeNumIndex", lastNegativeNumIndex, "lastPositiveNumIndex", lastPositiveNum, "finalDisplayOpsChangeSign", finalDisplayOpsChangeSign);
    //   let calculateResult = trigonometryCalculate(curDegree * -1, trigFunc, state);
    //   return calculateResult;
    // } else {
    //   console.log("trigonometry stage 3.3");
    //   let regexNum = new RegExp(`${state.displayCur}$`);
    //   let lastNumIndex = displayOps.match(regexNum).index;
    //   finalDisplayOpsChangeSign = displayOps.slice(0, lastNumIndex).concat(`${trigFunc}(${state.displayCur})`);
    //   let calculateResult = trigonometryCalculate(curDegree, trigFunc, state);
    //   return calculateResult;
    // }
  } else if (state.lastInput === "!" || state.lastInputType === "%") {
    // -\d+\.\d+|\d+\.\d+|sin|cos|tan|cot| yroot | log base | mod | \+ | - | \* | \^ | \/ |-\d+|\d+|\D
    // let regexNum = new RegExp(/-\d+\.\d+!%$|\d+\.\d+!%$|-\d+!%$|\d+!%$|-\d+\.\d+%!$|\d+\.\d+%!$|-\d+%!$|\d+%!$|-\d+\.\d+!$|\d+\.\d+!$|-\d+!$|\d+!$|-\d+\.\d+%$|\d+\.\d+%$|-\d+%$|\d+%$/);
    // let lastNumIndex = state.displayOps.match(regexNum).index;
    // finalDisplayOpsChangeSign = state.displayOps.slice(0, lastNumIndex).concat(`(${state.displayOps.match(regexNum)})`);
    // return "";
  }
}
