import { findExpression, expression, regex } from "./findExpression";
import { changeOneIntoAnother } from "./changeOneIntoAnother";

export let finalDisplayAll = "";
let displayAll = "";
export let displayAllAfterTrigonometry = "";

export function trigonometryInDegrees(trigFunction, state) {
  displayAll = state.lastResult !== "" ? state.lastResult : state.displayAll;

  findExpression(state);

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
  return displayAllAfterTrigonometry;
}
