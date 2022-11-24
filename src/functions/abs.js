import calculate from "./equals";
import { expression, regex, findExpression } from "./findExpression";

export let displayAllAfterAbs = "";
let displayAll = "";

export function abs(state) {
  displayAll = state.lastResult !== "" ? state.lastResult : state.displayAll;

  let changeOneIntoAnother = [
    // the sign will be changed from positive to negative or vice versa for:
    // 1) the expression not preceded by operators (minus here indicates negative value of the following number rather than an operator sign)
    {
      before: "\\(",
      after: "(abs(",
    },
    {
      before: "\\( - ",
      after: "(abs( - ",
    },
    {
      before: "^",
      after: "abs(",
    },
    {
      before: "^ - ",
      after: "abs( - ",
    },

    // 2) the expression preceded by two consecutive operators:
    {
      before: " -  - ",
      after: " - abs( - ",
    },
    {
      before: " \\+  - ",
      after: " + abs( - ",
    },
    {
      before: " \\*  - ",
      after: " * abs( - ",
    },
    {
      before: " \\/  - ",
      after: " / abs( - ",
    },
    {
      before: " \\^  - ",
      after: " ^ abs( - ",
    },
    {
      before: " yroot  - ",
      after: " yroot abs( - ",
    },
    // 3) the expression preceded by only one operator:
    {
      before: " - ",
      after: " - abs(",
    },
    {
      before: " \\+ ",
      after: " + abs(",
    },
    {
      before: " \\* ",
      after: " * abs(",
    },
    {
      before: " \\/ ",
      after: " / abs(",
    },
    {
      before: " \\^ ",
      after: " ^ abs(",
    },
    {
      before: " yroot ",
      after: " yroot abs(",
    },
    {
      before: " log base ",
      after: " log base abs(",
    },
  ];

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
      displayAllAfterAbs = displayAll.slice(0, arr[i].index).concat(changeOneIntoAnother[i]["after"]).concat(expression).concat(")");

      break;
    }
  }
  return displayAllAfterAbs;
}
