// next steps:
// continue revison from trigonometry(e) + check how trigonometry works with minus and whether any adjustments needed (maybe not?) -> check trigonometry for lastResult +
// check the error appered when you click "=" without any input at all
// - force all click() inputs to be inside the displayOps and outside of displayCur (like %, S, R, etc), so displayCur will be clean before next operation (not obligatory)
// - consider using paste into displayCur (restrictions to what should be pasted) -> otherwise change "copy" to "copy result"
// - consider adding multiple displays for results with possibility to insert them into displayCur later on
// consider adding math.round (2-0.56) will provide with non accurate result --> round to the number of digits --> consider adding rounding button
// sonsider adding event listeners
// - check every input mixing with others

// - when invalid input appers or any other error, block all keys except for AC and del

export default function calculate(expr) {
  // console.log("diplayOps in calculate(arr)", expr);
  expr = convertDisplayOpsIntoArray(expr);
  return findParenthesis(expr);
}

function convertDisplayOpsIntoArray(string) {
  console.log("string inside convertDisplayIntoArr", string);
  let parseRegex = new RegExp(/-\d+\.\d+|\d+\.\d+|sin|cos|tan|cot| yroot | log base | mod | \+ | - | \* | \^ | \/ |-\d+|\d+|\D/, "g");
  let displayOpsArray = string.match(parseRegex).map((elem) => (isFinite(elem) ? Number(elem) : elem));
  displayOpsArray.unshift("(");
  displayOpsArray.push(")");
  console.log("convertDisplayIntoArr", displayOpsArray);
  return displayOpsArray;
}

function findParenthesis(expr) {
  let firstClosingIndex = expr.findIndex((parentesis) => parentesis === ")");
  if (firstClosingIndex !== -1) {
    let exprInsideParantethes = expr.slice(0, firstClosingIndex);
    let firstOpeningIndex = exprInsideParantethes.reverse().findIndex((parentesis) => parentesis === "(");
    exprInsideParantethes = exprInsideParantethes.slice(0, firstOpeningIndex).reverse();
    let resultInsideParentheses = calculateInsideParentheses(exprInsideParantethes);
    expr = expr
      .slice(0, firstClosingIndex - firstOpeningIndex - 1)
      .concat(resultInsideParentheses)
      .concat(expr.slice(firstClosingIndex + 1));
    return findParenthesis(expr);
  }
  return expr[0];
}

function calculateInsideParentheses(expr) {
  expr = findNegativeValues(expr);
  expr = calculateInOrder(expr, ["sin", "cos"]);
  expr = calculateInOrder(expr, ["tan", "cot"]);
  expr = calculateInOrder(expr, ["sec", "csc"]);
  expr = calculateInOrder(expr, ["!", "%"]);
  expr = calculateInOrder(expr, [" log base ", " mod "]);
  expr = calculateInOrder(expr, [" ^ ", " yroot "]);
  expr = calculateInOrder(expr, [" * ", " / "]);
  expr = calculateInOrder(expr, [" + ", " - "]);

  return expr[0];
}

function findNegativeValues(arr) {
  let negativeIndex = arr.findIndex((elem, ind) => (elem === " - " && ind === 0) || (elem === " - " && typeof arr[ind - 1] === "string" && typeof arr[ind + 1] === "number"));
  if (negativeIndex !== -1) {
    let newArr = arr
      .slice(0, negativeIndex)
      .concat(arr[negativeIndex + 1] * -1)
      .concat(arr.slice(negativeIndex + 2));
    return findNegativeValues(newArr);
  }
  return arr;
}

function calculateInOrder(arr, operators) {
  let operatorIndex = arr.findIndex((elem) => elem === operators[0] || elem === operators[1]);
  let currentOperator = arr[operatorIndex];

  if (operatorIndex !== -1) {
    let currentOperation = arr.slice(operatorIndex - 1, operatorIndex + 2);
    console.log("currentOpertation", currentOperation);

    let currentResult =
      currentOperator === "sin"
        ? Math.sin(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "cos"
        ? Math.cos(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "tan"
        ? Math.tan(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "cot"
        ? 1 / Math.tan(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "sec"
        ? 1 / Math.tan(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "scs"
        ? 1 / Math.tan(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "!"
        ? factorial(currentOperation[0])
        : currentOperator === "%"
        ? currentOperation[0] / 100
        : currentOperator === " log base "
        ? Math.log(currentOperation[0]) / Math.log(currentOperation[2])
        : currentOperator === " mod "
        ? currentOperation[0] % currentOperation[2]
        : currentOperator === " yroot "
        ? Math.pow(currentOperation[0], 1 / currentOperation[2])
        : currentOperator === " ^ "
        ? Math.pow(currentOperation[0], currentOperation[2])
        : currentOperator === " * "
        ? currentOperation[0] * currentOperation[2]
        : currentOperator === " / "
        ? currentOperation[0] / currentOperation[2]
        : currentOperator === " + "
        ? currentOperation[0] + currentOperation[2]
        : currentOperation[0] - currentOperation[2];
    console.log("im here", arr);

    let result =
      currentOperator === "sin" || currentOperator === "cos" || currentOperator === "tan" || currentOperator === "cot" || currentOperator === "sec" || currentOperator === "csc"
        ? arr
            .slice(0, operatorIndex)
            .concat(currentResult)
            .concat(arr.slice(operatorIndex + 2))
        : currentOperator === "!" || currentOperator === "%"
        ? arr
            .slice(0, operatorIndex - 1)
            .concat(currentResult)
            .concat(arr.slice(operatorIndex + 1))
        : arr
            .slice(0, operatorIndex - 1)
            .concat(currentResult)
            .concat(arr.slice(operatorIndex + 2));
    console.log("result", result);
    return calculateInOrder(result, operators);
  }
  return arr;
}

export let displayOpsExpression = "";

export function lastLegitSymbol(displayOps) {
  console.log("you actually here", displayOps);
  let lastLegitSymbol = displayOps
    .split("")
    .reverse()
    .findIndex((elem) => /\d|\(|!/.test(elem));
  return (lastLegitSymbol = lastLegitSymbol !== -1 ? lastLegitSymbol : displayOps.length);
}

export function deleteRedundantOperators(state) {
  console.log("deleteRedundant", state.displayOps);
  console.log("state.displayCur", state.displayCur);
  if (state.displayCur === "" || /\)|!|%|\d/.test(state.displayCur)) {
    displayOpsExpression = state.displayOps;
    // } else if (/\d/.test(state.displayCur)) {
    //   displayOpsExpression = state.displayOps;
  } else {
    let lastDigitIndex = state.displayOps
      .split("")
      .reverse()
      .findIndex((elem) => /\d/.test(elem));
    displayOpsExpression = state.displayOps.slice(0, state.displayOps.length - lastDigitIndex);
  }
  addMissingParenthesis(state.parenthesesDelta);
  console.log("deleteRedundant after", displayOpsExpression);
}

// export function deleteRedundantDigits(state) {
//   if (/\./.test(state.displayCur)) {
//     let decimalIndex = state.displayOps
//       .split("")
//       .reverse()
//       .findIndex((elem) => /\./.test(elem));
//     displayOpsExpression = state.displayOps.slice(0, state.displayOps.length - decimalIndex - 2);
//   } else if (/\D/.test(state.displayCur)) {
//     displayOpsExpression = state.displayOps;
//   } else {
//     let lastNonDigitIndex = state.displayOps
//       .split("")
//       .reverse()
//       .findIndex((elem) => /\D/.test(elem));
//     displayOpsExpression = lastNonDigitIndex === -1 ? "" : state.displayOps.slice(0, state.displayOps.length - lastNonDigitIndex);
//   }
// }

export function addMissingParenthesis(delta) {
  if (delta > 0) {
    displayOpsExpression += ")";
    delta -= 1;
    addMissingParenthesis(delta);
  }
}

export let stateStorage = {
  prevState: [],
};

export function saveState(state) {
  if (stateStorage.prevState.length >= 30) {
    stateStorage.prevState.pop();
    stateStorage.prevState.unshift(state);
  } else {
    stateStorage.prevState.unshift(state);
  }
  return stateStorage.prevState;
}

export function factorial(num) {
  if (num < 0) {
    alert("invalid input: factorials are only defined for positive numbers");
    return "invalid input";
  } else if (num % 1 !== 0 && num !== ")") {
    alert(`factorials for nonintegers are defined based on simplified Gamma function:
    ~~ level of accuracy: low ~~`);
    return Math.pow(2 * num * Math.PI, 1 / 2) * Math.pow(num / Math.E, num);
  } else if (num === ")") {
    return "!";
  } else {
    let result = Number(num);
    if (Number.isInteger(result)) {
      for (let i = result - 1; i > 0; i--) {
        result *= i;
      }
      return result;
    }
  }
}

export function trigonometryInDegrees(curDegree, trigFunc, state) {
  console.log("inside trigonom, args:", curDegree, trigFunc);
  if (state.lastOperator === "trigonometry") {
    let matchTrigonometry = state.displayOps.match(/sin|cos|tan|cot|sec|csc/gi);
    let lastTrigonometryIndex = state.displayOps.lastIndexOf(matchTrigonometry[matchTrigonometry.length - 1]);
    console.log("lastTrigonometryIndex", lastTrigonometryIndex);
    displayOpsExpression = state.displayOps.slice(0, lastTrigonometryIndex).concat(`${trigFunc}(${state.displayOps.slice(lastTrigonometryIndex)})`);
    console.log("you are here in sin sin sin --> displayOpsExpression", displayOpsExpression);
    return "";
  } else if (state.lastInput === ")") {
    let displayOpsLength = state.displayOps.length;
    let closingNum = 1;
    let openingNum = 0;
    let firstOpeningIndex = 0;
    for (let i = displayOpsLength - 2; i >= 0; i--) {
      if (state.displayOps[i] === ")") closingNum++;
      if (state.displayOps[i] === "(") openingNum++;
      if (closingNum === openingNum) {
        firstOpeningIndex = i;
        console.log("you are here", closingNum, openingNum, firstOpeningIndex);
        break;
      }
    }
    displayOpsExpression = state.displayOps.slice(0, firstOpeningIndex).concat(`${trigFunc}${state.displayOps.slice(firstOpeningIndex)}`);
    console.log("you are here --> displayOpsExpression", displayOpsExpression);
    return "";
  } else if (state.lastInputType === "digit") {
    let regexNum = new RegExp(`${state.displayCur}$`);
    let lastNumIndex = state.displayOps.match(regexNum).index;
    console.log("lastNumIndex", lastNumIndex);
    displayOpsExpression = state.displayOps.slice(0, lastNumIndex).concat(`${trigFunc}(${state.displayCur})`);
    console.log("displayOpsExpression", displayOpsExpression);
    let calculateResult = trigonometryCalculate(curDegree, trigFunc, state);
    return calculateResult;
  } else if (state.lastInput === "!" || state.lastInputType === "%") {
    // -\d+\.\d+|\d+\.\d+|sin|cos|tan|cot| yroot | log base | mod | \+ | - | \* | \^ | \/ |-\d+|\d+|\D
    let regexNum = new RegExp(/-\d+\.\d+!$|\d+\.\d+!$|-\d+!$|\d+!$|-\d+\.\d+%$|\d+\.\d+%$|-\d+%$|\d+%$/);
    let lastNumIndex = state.displayOps.match(regexNum).index;
    console.log("bam lastNumIndex", lastNumIndex);
    displayOpsExpression = state.displayOps.slice(0, lastNumIndex).concat(`${trigFunc}(${state.displayOps.match(regexNum)})`);
    console.log("bam displayOpsExpression", displayOpsExpression);
    return "";
  }
  // let calculateResult = trigonometryCalculate(curDegree, trigFunc, state);
  // return calculateResult;
}

function trigonometryCalculate(curDegree, trigFunc, state) {
  let reciprocal = {
    cot: "tan",
    sec: "cos",
    csc: "sin",
  };
  let calculateResult = Function(`return ${trigFunc} === cot || ${trigFunc} === sec || ${trigFunc} === csc ? 1/ Math.${reciprocal[trigFunc]}(${curDegree} * (Math.PI / 180)) : Math.${trigFunc}(${curDegree} * (Math.PI / 180))`);
  return calculateResult().toString();
}
