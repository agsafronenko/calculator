import { expression, regex, findExpression } from "./findExpression";
import { changeOneIntoAnother } from "./changeOneIntoAnother";

export let displayAllAfterAbs = "";
let displayAll = "";

export function abs(state) {
  displayAll = state.lastResult !== "" ? state.lastResult : state.displayAll;

  findExpression(state);

  let arr = [];
  for (let i = 0; i < changeOneIntoAnother.length; i++) {
    arr.push(displayAll.match(new RegExp(`${changeOneIntoAnother[i]["before"]}${regex}$`)));
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== null) {
      displayAllAfterAbs = displayAll.slice(0, arr[i].index).concat(changeOneIntoAnother[i]["afterAbs"]).concat(expression).concat(")");

      break;
    }
  }
  return displayAllAfterAbs;
}
