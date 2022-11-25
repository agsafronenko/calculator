import calculate from "./equals";
import { expression, regex, findExpression } from "./findExpression";
import { changeOneIntoAnother } from "./changeOneIntoAnother";

export let displayAllafterChangeSign = "";
let displayAll = "";

export function changeSign(state) {
  displayAll = state.lastResult !== "" ? state.lastResult : state.displayAll;

  findExpression(state); // determines the expression for which changeSign(state) function will be applied to

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
      displayAllafterChangeSign = displayAll.slice(0, arr[i].index).concat(changeOneIntoAnother[i]["afterChangeSign"]).concat(expression);
      break;
    }
  }
  return displayAllafterChangeSign;
}
