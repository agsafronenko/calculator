import calculate from "./equals";
import { displayAllExpression } from "./FixIncompleteInputs";

export let displayAllAfterChangeSign = "";
let expression = "";
let regex = "";
let displayAll = "";

export function changeSign(state) {
  displayAll = state.lastResult !== "" ? state.lastResult : state.displayAll;

  let changeOneIntoAnother = [
    // the sign will be changed from positive to negative or vice versa for:
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
    // 3) the expression preceded by only one operator:
    {
      before: " - ",
      after: " + ",
    },
    {
      before: " \\+ ",
      after: " - ",
    },
    {
      before: " \\* ",
      after: " *  - ",
    },
    {
      before: " \\/ ",
      after: " /  - ",
    },
    {
      before: " \\^ ",
      after: " ^  - ",
    },
    {
      before: " yroot ",
      after: " yroot  - ",
    },
  ];

  findExpression(state); // determines the expression for which changeSign(state) function will be applied to
  console.log("expression", expression);
  let displayCurAfterChangeSign = calculate(state, expression);
  // let displayCurAfterChangeSign = 777;

  console.log("displayCur", displayCurAfterChangeSign);

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
      displayAllAfterChangeSign = displayAll.slice(0, arr[i].index).concat(changeOneIntoAnother[i]["after"]).concat(expression);
      break;
    }
  }
  return [displayAllAfterChangeSign, displayCurAfterChangeSign];
  // return [displayAllAfterChangeSign, calculate(expression)];
}

// findExpression(state) determines the expression for which the sign will be changed from positive to negative or vice versa:
function findExpression(state) {
  let displayAll = state.displayAll;
  if (state.lastResult !== "") displayAll = state.lastResult;
  if (displayAll.match(/\)\)$/) && (state.lastOperator === "trigonometry" || state.lastOperator === "abs")) {
    console.log("stage 1 start");
    let displayAllLength = displayAll.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayAllLength - 2; i >= 0; i--) {
      if (displayAll[i] === ")") closingNum++;
      if (displayAll[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i - 3;
        break;
      }
    }

    regex = displayAll.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(firstOpeningIndex);
  } else if (displayAll.match(/\)\)$/ && state.lastOperator !== "trigonometry" && state.lastOperator !== "abs")) {
    console.log("stage 2 start");
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
    regex = displayAll.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(firstOpeningIndex);
  } else if (state.lastOperator === "trigonometry" || state.lastOperator === "abs") {
    console.log("stage 3 start");
    let matchTrigOrAbs = displayAll.match(/sin|cos|tan|cot|sec|csc|abs/gi);
    let lastTrigOrAbsIndex = displayAll.lastIndexOf(matchTrigOrAbs[matchTrigOrAbs.length - 1]);
    regex = displayAll.slice(lastTrigOrAbsIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(lastTrigOrAbsIndex);
  } else if (state.lastInput === ")") {
    console.log("stage 4 start");
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
    regex = displayAll.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayAll.slice(firstOpeningIndex);
  } else if (state.lastInputType === "digit" || state.lastInputType === "decimal") {
    console.log("stage 5 start");
    regex = displayAll.match(/\d+(?:\.\d*)?$/);
    expression = regex;
  } else if (state.lastInputType === "!" || state.lastInputType === "%") {
    console.log("stage 6 start");
    regex = displayAll.match(/\d+(?:\.\d*)?(!%|%!|!|%)$/)[0];
    expression = regex;
  }
}
