import calculate, { findNegativeValues } from "./equals";
import { findExpression, expression, regex } from "./findExpression";
import { changeOneIntoAnother } from "./changeOneIntoAnother";

export let finalDisplayAll = "";
let displayAll = "";
export let displayAllAfterTrigonometry = "";

export function trigonometryInDegrees(trigFunction, state) {
  displayAll = state.lastResult !== "" ? state.lastResult : state.displayAll;

  findExpression(state);
  console.log("expression in trigonometry", expression, "regex", regex);

  let arr = [];
  for (let i = 0; i < changeOneIntoAnother.length; i++) {
    arr.push(displayAll.match(new RegExp(`${changeOneIntoAnother[i]["before"]}${regex}$`)));
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== null) {
      displayAllAfterTrigonometry = displayAll.slice(0, arr[i].index).concat(changeOneIntoAnother[i]["afterTrigonometry"]).replace("trigFunc", trigFunction).concat(expression).concat(")");

      break;
    }
  }
  console.log("displayAllAfterTrigonometry", displayAllAfterTrigonometry);
  return displayAllAfterTrigonometry;
}

// function trigonometryCalculate(curDegree, trigFunc, state) {
//   let reciprocal = {
//     cot: "tan",
//     sec: "cos",
//     csc: "sin",
//   };
//   let calculateResult = Function(`return ${trigFunc} === cot || ${trigFunc} === sec || ${trigFunc} === csc ? 1/ Math.${reciprocal[trigFunc]}(${curDegree} * (Math.PI / 180)) : Math.${trigFunc}(${curDegree} * (Math.PI / 180))`);
//   return calculateResult().toString();
// }
