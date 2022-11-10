export let finalDisplayOpsChangeSign = "";
let expression = "";
let regex = "";

export function changeSign(state) {
  console.clear();
  let displayOps = state.displayOps;
  if (state.lastResult !== "") displayOps = "".concat(state.lastResult);

  let changeOneIntoAnother = [
    {
      before: " \\-  - ",
      after: " - ",
    },
    {
      before: " \\+  - ",
      after: " + ",
    },
    {
      before: ` \\* `,
      after: ` *  - `,
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
      before: " ^ - ",
      after: " ^ ",
    },
    {
      before: " yroot - ",
      after: " yroot ",
    },
    {
      before: " - ",
      after: " + ",
    },
    {
      before: " \\+ ",
      after: " - ",
    },
    {
      before: "",
      after: " - ",
    },
  ];

  findExpression(state);

  let arr = [];
  for (let i = 0; i < changeOneIntoAnother.length; i++) {
    arr.push(displayOps.match(new RegExp(`${changeOneIntoAnother[i]["before"]}${regex}$`)));
  }
  console.log("displayOps", displayOps);
  console.log("expression", expression);
  console.log("final", RegExp(displayOps.match(`${changeOneIntoAnother[2]["before"]}${expression}$`)));
  console.log("arr", arr);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== null) {
      finalDisplayOpsChangeSign = displayOps.slice(0, arr[i].index).concat(changeOneIntoAnother[i]["after"]).concat(expression);
      break;
    }
  }
  return finalDisplayOpsChangeSign;
}

function findExpression(state) {
  let displayOps = state.displayOps;
  if (displayOps.match(/\)\)$/) && (state.lastOperator === "trigonometry" || state.lastOperator === "abs")) {
    console.log("stage 1 start");
    let displayOpsLength = displayOps.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayOpsLength - 2; i >= 0; i--) {
      if (displayOps[i] === ")") closingNum++;
      if (displayOps[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i - 3;
        break;
      }
    }

    regex = displayOps.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayOps.slice(firstOpeningIndex);
  } else if (displayOps.match(/\)\)$/ && state.lastOperator !== "trigonometry" && state.lastOperator !== "abs")) {
    console.log("stage 2 start");
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
    regex = displayOps.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayOps.slice(firstOpeningIndex);
  } else if (state.lastOperator === "trigonometry" || state.lastOperator === "abs") {
    console.log("stage 3 start");
    let matchTrigOrAbs = displayOps.match(/sin|cos|tan|cot|sec|csc|abs/gi);
    let lastTrigOrAbsIndex = displayOps.lastIndexOf(matchTrigOrAbs[matchTrigOrAbs.length - 1]);
    regex = displayOps.slice(lastTrigOrAbsIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayOps.slice(lastTrigOrAbsIndex);
  } else if (state.lastInput === ")") {
    console.log("stage 4 start");
    let displayOpsLength = state.displayOps.length;
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
    regex = displayOps.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    expression = displayOps.slice(firstOpeningIndex);
    // return state.displayOps.slice(firstOpeningIndex).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  } else if (state.lastInputType === "digit" || state.lastInputType === "decimal") {
    console.log("stage 5 start");
    regex = displayOps.match(/\d+(?:\.\d*)?$/);
    expression = regex;
  } else if (state.lastInputType === "!" || state.lastInputType === "%") {
    console.log("stage 6 start");
    regex = displayOps.match(/\d+(?:\.\d*)?(!%|%!|!|%)$/)[0];
    expression = regex;
  }
}
