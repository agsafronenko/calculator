import calculate from "./equals";
import { expression, regex, findExpression } from "./findExpression";

export let displayAllAfterDenomination = "";
let displayAll = "";

export function switchToDenominator(state) {
  displayAll = state.lastResult !== "" ? state.lastResult : state.displayAll;

  let changeOneIntoAnother = [
    // the sign will be changed from positive to negative or vice versa for:
    // 1) the expression not preceded by operators (minus here indicates negative value of the following number rather than an operator sign)
    {
      before: "\\(",
      after: "((1 / (",
    },
    {
      before: "\\( - ",
      after: "((1 / ( - ",
    },
    {
      before: "^",
      after: "(1 / (",
    },
    {
      before: "^ - ",
      after: "(1 / ( - ",
    },

    // 2) the expression preceded by two consecutive operators:
    {
      before: " -  - ",
      after: " - (1 / ( - ",
    },
    {
      before: " \\+  - ",
      after: " + (1 / ( - ",
    },
    {
      before: " \\*  - ",
      after: " * (1 / ( - ",
    },
    {
      before: " \\/  - ",
      after: " / (1 / ( - ",
    },
    {
      before: " \\^  - ",
      after: " ^ (1 / ( - ",
    },
    {
      before: " yroot  - ",
      after: " yroot (1 / ( - ",
    },
    {
      before: " mod  - ",
      after: " mod (1 / ( - ",
    },
    // 3) the expression preceded by only one operator:
    {
      before: " - ",
      after: " - (1 / (",
    },
    {
      before: " \\+ ",
      after: " + (1 / (",
    },
    {
      before: " \\* ",
      after: " * (1 / (",
    },
    {
      before: " \\/ ",
      after: " / (1 / (",
    },
    {
      before: " \\^ ",
      after: " ^ (1 / (",
    },
    {
      before: " yroot ",
      after: " yroot (1 / (",
    },
    {
      before: " log base ",
      after: " log base (1 / (",
    },
    {
      before: " mod ",
      after: " mod (1 / (",
    },
  ];

  findExpression(state); // determines the expression for which changeSign(state) function will be applied to

  let arr = [];
  for (let i = 0; i < changeOneIntoAnother.length; i++) {
    arr.push(displayAll.match(new RegExp(`${changeOneIntoAnother[i]["before"]}${regex}$`)));
  }
  console.log("displayAll", displayAll);
  console.log("expression", expression);
  console.log("final", RegExp(displayAll.match(`${changeOneIntoAnother[2]["before"]}${expression}$`)));
  console.log("arr", arr);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== null) {
      displayAllAfterDenomination = displayAll.slice(0, arr[i].index).concat(changeOneIntoAnother[i]["after"]).concat(expression).concat("))");
      break;
    }
  }
  console.log("displayAllAfterDeominatin", displayAllAfterDenomination);
  return displayAllAfterDenomination;
}
