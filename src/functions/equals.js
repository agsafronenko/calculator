// next steps:
// continue changSign from 86 row "displayCurAfterChangeSign", finish FixIncompleteInputs for both handleEqual and changeSign
// continue filling pivot table for all handlers (consider inserting it as a comment to the project)

// show in displayCur result for current trigonometry, factorial, etc
// - consider using paste into displayCur (restrictions to what should be pasted) -> otherwise change "copy" to "copy result"
// - consider adding multiple displays for results with possibility to insert them into displayCur later on
// consider adding math.round (2-0.56) will provide with non accurate result --> round to the number of digits --> consider adding rounding button
// consider adding event listeners
// - check every input mixing with others

// - when invalid input appers or any other error, block all keys except for AC and del
import { factorial } from "./factorial";

export default function calculate(expr) {
  deleteRedundantOperators(expr);
  expr = displayAllExpression;
  expr = expr === "" ? convertDisplayAllIntoArray("0") : convertDisplayAllIntoArray(expr);
  return findParenthesis(expr);
}

function convertDisplayAllIntoArray(string) {
  console.log("string inside convertDisplayIntoArr", string);
  let parseRegex = new RegExp(/-\d+\.\d+|\d+\.\d+|sin|cos|tan|cot|sec|csc|abs| yroot | log base | mod |invalid input| \+ | - | \* | \^ | \/ |-\d+|\d+|\D/, "g");
  let displayAllArray = string.match(parseRegex).map((elem) => (isFinite(elem) ? Number(elem) : elem));
  displayAllArray.unshift("(");
  displayAllArray.push(")");
  console.log("convertDisplayIntoArr", displayAllArray);
  return displayAllArray;
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
  expr = calculateInOrder(expr, ["abs", " log base "]);
  expr = calculateInOrder(expr, ["sin", "cos"]);
  expr = calculateInOrder(expr, ["tan", "cot"]);
  expr = calculateInOrder(expr, ["sec", "csc"]);
  expr = calculateInOrder(expr, ["!", "%"]);
  expr = calculateInOrder(expr, [" ^ ", " yroot "]);
  expr = calculateInOrder(expr, [" * ", " / "]);
  expr = calculateInOrder(expr, [" mod ", " mod "]);
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
  if (arr.some((elem) => elem === "invalid input")) {
    arr = ["invalid input"];
  }

  let operatorIndex = arr.findIndex((elem) => elem === operators[0] || elem === operators[1]);
  let currentOperator = arr[operatorIndex];

  if (operatorIndex !== -1) {
    let currentOperation = operatorIndex === 0 ? arr.slice(0, operatorIndex + 2) : arr.slice(operatorIndex - 1, operatorIndex + 2);
    console.log("currentOpertation", currentOperation, "operatorIndex", operatorIndex, "arr", arr);

    let currentResult =
      currentOperator === "abs"
        ? Math.abs(currentOperation[currentOperation.length - 1])
        : currentOperator === "sin"
        ? Math.sin(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "cos"
        ? Math.cos(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "tan"
        ? Math.tan(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "cot"
        ? 1 / Math.tan(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "sec"
        ? 1 / Math.tan(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "csc"
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
    console.log("im here", arr, "currentOperator", currentOperator, "currentOperation", currentOperation, "currentResult", currentResult);

    let result =
      currentOperator === "abs" || currentOperator === "sin" || currentOperator === "cos" || currentOperator === "tan" || currentOperator === "cot" || currentOperator === "sec" || currentOperator === "csc"
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

export let displayAllExpression = "";

export function lastLegitSymbol(displayAll) {
  console.log("you actually here", displayAll);
  let lastLegitSymbol = displayAll
    .split("")
    .reverse()
    .findIndex((elem) => /\d|\(|!/.test(elem));
  return (lastLegitSymbol = lastLegitSymbol !== -1 ? lastLegitSymbol : displayAll.length);
}

export function deleteRedundantOperators(state) {
  console.log("deleteRedundant", state.displayAll);
  console.log("state.displayCur", state.displayCur);
  if (state.lastOperator === "trigonometry" || state.displayCur === "" || /\)|!|%|\d/.test(state.displayCur)) {
    displayAllExpression = state.displayAll;
    // } else if (/\d/.test(state.displayCur)) {
    //   displayAllExpression = state.displayAll;
  } else {
    let lastDigitIndex = state.displayAll
      .split("")
      .reverse()
      .findIndex((elem) => /\d/.test(elem));
    displayAllExpression = state.displayAll.slice(0, state.displayAll.length - lastDigitIndex);
  }
  addMissingParenthesis(state.parenthesesDelta);
  console.log("deleteRedundant after", displayAllExpression);
}

export function addMissingParenthesis(delta) {
  if (delta > 0) {
    displayAllExpression += ")";
    delta -= 1;
    addMissingParenthesis(delta);
  }
}
