// next steps:
// continue revison from handleLog(e)
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
  let parseRegex = new RegExp(/-\d+\.\d+|\d+\.\d+| yroot | log base | mod | \+ | - | \* | \^ | \/ |-\d+|\d+|\D/, "g");
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

    let currentResult =
      currentOperator === "!"
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
      currentOperator === "!" || currentOperator === "%"
        ? arr
            .slice(0, operatorIndex - 1)
            .concat(currentResult)
            .concat(arr.slice(operatorIndex + 1))
        : arr
            .slice(0, operatorIndex - 1)
            .concat(currentResult)
            .concat(arr.slice(operatorIndex + 2));

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
  console.log("deleteRedundant", state.displayCur);
  if (/\)|!|%|\d/.test(state.displayCur)) {
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

export function trigonometryInDegrees(curDegree, trigFunc) {
  console.log("inside trigonom, args:", curDegree, trigFunc);
  let reciprocal = {
    cot: "tan",
    sec: "cos",
    csc: "sin",
  };

  let calculateResult = Function(`return ${trigFunc} === cot || ${trigFunc} === sec || ${trigFunc} === csc ? 1/ Math.${reciprocal[trigFunc]}(${curDegree} * (Math.PI / 180)) : Math.${trigFunc}(${curDegree} * (Math.PI / 180))`);
  return calculateResult().toString();
}
