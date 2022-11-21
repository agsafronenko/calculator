import calculate, { findNegativeValues } from "./equals";
import { findExpression, expression, regex, expressionNegative } from "./findExpression";
export let finalDisplayAll = "";
let displayAll = "";
export let displayAllAfterTrigonometry = "";

export function trigonometryInDegrees(curDegree, trigFunc, state) {
  console.clear();
  // findExpression(state);
  // let exprRes = calculate(state, expression);
  // let afterFindingNegatives = findNegativeValues(expression);
  // console.log("expression in trigonometry", expression, expressionNegative, "expressionResult", exprRes, "afterFindingNegatives", afterFindingNegatives);

  displayAll = state.lastResult !== "" ? state.lastResult : state.displayAll;

  let changeOneIntoAnother = [
    // trigonometry function will be applied for:
    // 1) the expression not preceded by operators (minus here indicates negative value of the following number rather than an operator sign)
    {
      before: "\\(",
      after: "( - ",
    },
    {
      before: "\\( - ",
      after: "(",
    },
    {
      before: "^",
      after: " - ",
    },
    {
      before: "^ - ",
      after: "",
    },

    // 2) the expression preceded by two consecutive operators:
    {
      before: " -  - ",
      after: " - ",
    },
    {
      before: " \\+  - ",
      after: " + ",
    },
    {
      before: " \\*  - ",
      after: " * ",
    },
    {
      before: " \\/  - ",
      after: " / ",
    },
    {
      before: " \\^  - ",
      after: " ^ ",
    },
    {
      before: " yroot  - ",
      after: " yroot ",
    },
  ];

  findExpression(state);
  // let displayCurAfterChangeSign = expressionNegative ? calculate(state, expression) : ` - ${calculate(state, expression)}`;

  let arr = [];
  for (let i = 0; i < changeOneIntoAnother.length; i++) {
    arr.push(displayAll.match(new RegExp(`${changeOneIntoAnother[i]["before"]}${regex}$`)));
  }
  // console.log("displayAll", displayAll);
  // console.log("expression", expression);
  // console.log("final", RegExp(displayAll.match(`${changeOneIntoAnother[2]["before"]}${expression}$`)));
  // console.log("arr", arr);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== null) {
      displayAllAfterTrigonometry = displayAll.slice(0, arr[i].index).concat(changeOneIntoAnother[i]["after"]).concat(expression);
      break;
    }
  }
  return displayAllAfterTrigonometry;

  console.log("STOP HERE");
}

// export function trigonometryInDegrees(curDegree, trigFunc, state) {
//   console.log(state.lastOperator === "trigonometry", "inside trigonom, args:", curDegree, trigFunc);
//   let displayAll = state.displayAll;
//   if (state.lastResult !== "") displayAll = "".concat(state.lastResult);
//   if (state.displayAll.match(/\)\)$/) && (state.lastOperator === "trigonometry" || state.lastOperator === "abs")) {
//     console.log("trigonometry stage 0.5");
//     let displayAllLength = state.displayAll.length;
//     let closingNum = 1;
//     let openingNum = 0;
//     let firstOpeningIndex = 0;
//     for (let i = displayAllLength - 2; i >= 0; i--) {
//       if (state.displayAll[i] === ")") closingNum++;
//       if (state.displayAll[i] === "(") openingNum++;
//       if (closingNum === openingNum) {
//         firstOpeningIndex = i - 3;
//         console.log("clos, open, firstOp", closingNum, openingNum, firstOpeningIndex);
//         break;
//       }
//     }
//     finalDisplayAll = state.displayAll.slice(0, firstOpeningIndex).concat(`${trigFunc}(${state.displayAll.slice(firstOpeningIndex)})`);
//     return "";
//   } else if (state.displayAll.match(/\)\)$/ && state.lastOperator !== "trigonometry")) {
//     console.log("trigonometry stage 0.7");
//     let displayAllLength = state.displayAll.length;
//     let closingNum = 1;
//     let openingNum = 0;
//     let firstOpeningIndex = 0;
//     for (let i = displayAllLength - 2; i >= 0; i--) {
//       if (state.displayAll[i] === ")") closingNum++;
//       if (state.displayAll[i] === "(") openingNum++;
//       if (closingNum === openingNum) {
//         firstOpeningIndex = i;
//         console.log("clos, open, firstOp", closingNum, openingNum, firstOpeningIndex);
//         break;
//       }
//     }
//     finalDisplayAll = state.displayAll.slice(0, firstOpeningIndex).concat(`${trigFunc}(${state.displayAll.slice(firstOpeningIndex)})`);
//     return "";
//   } else if (state.lastOperator === "trigonometry" || state.lastOperator === "abs") {
//     console.log("trigonometry stage 1");
//     let matchTrigonometry = state.displayAll.match(/sin|cos|tan|cot|sec|csc|abs/gi);
//     let lastTrigonometryIndex = state.displayAll.lastIndexOf(matchTrigonometry[matchTrigonometry.length - 1]);
//     finalDisplayAll = state.displayAll.slice(0, lastTrigonometryIndex).concat(`${trigFunc}(${state.displayAll.slice(lastTrigonometryIndex)})`);
//     return "";
//   } else if (state.lastInput === ")") {
//     console.log("trigonometry stage 2");
//     let displayAllLength = state.displayAll.length;
//     let closingNum = 1;
//     let openingNum = 0;
//     let firstOpeningIndex = 0;
//     for (let i = displayAllLength - 2; i >= 0; i--) {
//       if (state.displayAll[i] === ")") closingNum++;
//       if (state.displayAll[i] === "(") openingNum++;
//       if (closingNum === openingNum) {
//         firstOpeningIndex = i;
//         break;
//       }
//     }
//     finalDisplayAll = state.displayAll.slice(0, firstOpeningIndex).concat(`${trigFunc}${state.displayAll.slice(firstOpeningIndex)}`);
//     return "";
//   } else if (state.lastInputType === "digit") {
//     console.log("trigonometry stage 3");
//     if (displayAll.match(/[ \* | \/ | \+ | - ] - \d+\.\d+$|[ \* | \/ | \+ | - ] - \d+$/)) {
//       console.log("trigonometry stage 3.1");
//       let lastNegativeNumIndex = displayAll.match(/ - \d+\.\d+$| - \d+$/).index;
//       let lastPositiveNum = displayAll.match(/\d+\.\d+$|\d+$/);
//       finalDisplayAll = displayAll.slice(0, lastNegativeNumIndex).concat(`${trigFunc}(${lastPositiveNum * -1})`);
//       console.log("lastNegativeNumIndex", lastNegativeNumIndex, "lastPositiveNumIndex", lastPositiveNum, "finalDisplayAll", finalDisplayAll);
//       let calculateResult = trigonometryCalculate(curDegree * -1, trigFunc, state);
//       return calculateResult;
//     } else if (displayAll.match(/\( - \d+\.\d+$|\( - \d+$/)) {
//       console.log("abs stage 4.15");
//       let lastNegativeNum = displayAll.match(/\( - \d+\.\d+$|\( - \d+$/);
//       finalDisplayAll = displayAll.slice(0, lastNegativeNum.index + 1).concat(`${trigFunc}${lastNegativeNum})`);

//       let calculateResult = trigonometryCalculate(curDegree * -1, trigFunc, state);
//       return calculateResult;
//     } else if (displayAll.match(/- \d+\.\d+$| - \d+$/)) {
//       console.log("trigonometry stage 3.2");
//       let lastNegativeNumIndex = displayAll.match(/ - \d+\.\d+$| - \d+$/).index;
//       let lastPositiveNum = displayAll.match(/\d+\.\d+$|\d+$/);
//       finalDisplayAll =
//         lastNegativeNumIndex !== 0
//           ? displayAll
//               .slice(0, lastNegativeNumIndex)
//               .concat(" + ")
//               .concat(`${trigFunc}(${lastPositiveNum * -1})`)
//           : displayAll.slice(0, lastNegativeNumIndex).concat(`${trigFunc}(${lastPositiveNum * -1})`);
//       console.log("lastNegativeNumIndex", lastNegativeNumIndex, "lastPositiveNumIndex", lastPositiveNum, "finalDisplayAll", finalDisplayAll);
//       let calculateResult = trigonometryCalculate(curDegree * -1, trigFunc, state);
//       return calculateResult;
//     } else {
//       console.log("trigonometry stage 3.3");
//       let regexNum = new RegExp(`${state.displayCur}$`);
//       let lastNumIndex = displayAll.match(regexNum).index;
//       finalDisplayAll = displayAll.slice(0, lastNumIndex).concat(`${trigFunc}(${state.displayCur})`);
//       let calculateResult = trigonometryCalculate(curDegree, trigFunc, state);
//       return calculateResult;
//     }
//   } else if (state.lastInput === "!" || state.lastInputType === "%") {
//     // -\d+\.\d+|\d+\.\d+|sin|cos|tan|cot| yroot | log base | mod | \+ | - | \* | \^ | \/ |-\d+|\d+|\D
//     let regexNum = new RegExp(/-\d+\.\d+!%$|\d+\.\d+!%$|-\d+!%$|\d+!%$|-\d+\.\d+%!$|\d+\.\d+%!$|-\d+%!$|\d+%!$|-\d+\.\d+!$|\d+\.\d+!$|-\d+!$|\d+!$|-\d+\.\d+%$|\d+\.\d+%$|-\d+%$|\d+%$/);
//     let lastNumIndex = state.displayAll.match(regexNum).index;
//     finalDisplayAll = state.displayAll.slice(0, lastNumIndex).concat(`${trigFunc}(${state.displayAll.match(regexNum)})`);
//     return "";
//   }
// }

// function trigonometryCalculate(curDegree, trigFunc, state) {
//   let reciprocal = {
//     cot: "tan",
//     sec: "cos",
//     csc: "sin",
//   };
//   let calculateResult = Function(`return ${trigFunc} === cot || ${trigFunc} === sec || ${trigFunc} === csc ? 1/ Math.${reciprocal[trigFunc]}(${curDegree} * (Math.PI / 180)) : Math.${trigFunc}(${curDegree} * (Math.PI / 180))`);
//   return calculateResult().toString();
// }
