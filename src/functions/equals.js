// next steps:
// - add press animation
// - whenever memorySlot equals 0 or nothing show text "memory slot in primary color on white background, otherwise the number in white color on primary background"
// - check how it looks on other phone

import { factorial } from "./factorial";
import { FixIncompleteInputs, displayAllExpression } from "./FixIncompleteInputs";
import $ from "jquery";
import { validInputLog, invalidInputLog, validInputDenominator, invalidInputDenominator } from "./alertStatus";

export default function calculate(state, expression) {
  FixIncompleteInputs(state, expression);
  let expr = displayAllExpression;
  expr = expr === "" ? convertDisplayAllIntoArray("0") : convertDisplayAllIntoArray(expr);
  return findParenthesis(expr);
}

function convertDisplayAllIntoArray(string) {
  let parseRegex = new RegExp(/-\d+\.\d+|\d+\.\d+|-\d+\.|\d+\.|sin|cos|tan|cot|sec|csc|abs| yroot | log base | mod |invalid input| \+ | - | \* | \^ | \/ |-\d+|\d+|\D/, "g");
  let displayAllArray = string.match(parseRegex).map((elem) => (isFinite(elem) ? Number(elem) : elem));
  displayAllArray.unshift("(");
  displayAllArray.push(")");
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
  expr = calculateInOrder(expr, ["abs", "abs"]);
  expr = calculateInOrder(expr, ["sin", "cos"]);
  expr = calculateInOrder(expr, ["tan", "cot"]);
  expr = calculateInOrder(expr, ["sec", "csc"]);
  expr = calculateInOrder(expr, ["!", "%"]);
  expr = calculateInOrder(expr, [" mod ", " log base "]);
  expr = calculateInOrder(expr, [" ^ ", " yroot "]);
  expr = calculateInOrder(expr, [" * ", " / "]);
  expr = calculateInOrder(expr, [" + ", " - "]);

  return expr[0];
}

let count = 0;
export function findNegativeValues(arr) {
  let negativeIndex = "";
  if (arr[0] === " - ") {
    let newArr = [-1, " * "].concat(arr.slice(1));
    return findNegativeValues(newArr);
  } else {
    negativeIndex = arr.findIndex((elem, ind) => elem === " - " && typeof arr[ind - 1] === "string" && arr[ind - 1] !== "!" && arr[ind - 1] !== "%" && typeof arr[ind + 1] === "number");
    if (negativeIndex !== -1) {
      let newArr = arr
        .slice(0, negativeIndex)
        .concat(arr[negativeIndex + 1] * -1)
        .concat(arr.slice(negativeIndex + 2));
      return findNegativeValues(newArr);
    }
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
        ? 1 / Math.cos(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "csc"
        ? 1 / Math.sin(currentOperation[currentOperation.length - 1] * (Math.PI / 180))
        : currentOperator === "!"
        ? factorial(currentOperation[0])
        : currentOperator === "%"
        ? currentOperation[0] / 100
        : currentOperator === " log base "
        ? isFinite(Math.log(currentOperation[0]) / Math.log(currentOperation[2])) && currentOperation[2] !== 0
          ? validInputLog(currentOperation)
          : invalidInputLog()
        : currentOperator === " mod "
        ? currentOperation[2] === 0
          ? currentOperation[0]
          : currentOperation[0] % currentOperation[2]
        : currentOperator === " yroot "
        ? Math.pow(currentOperation[0], 1 / currentOperation[2])
        : currentOperator === " ^ "
        ? Math.pow(currentOperation[0], currentOperation[2])
        : currentOperator === " * "
        ? currentOperation[0] * currentOperation[2]
        : currentOperator === " / "
        ? currentOperation[2] === 0
          ? invalidInputDenominator()
          : validInputDenominator(currentOperation)
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

export function lastLegitSymbol(displayAll) {
  let lastLegitSymbol = displayAll
    .split("")
    .reverse()
    .findIndex((elem) => /\d|\(|\)|!|%/.test(elem));
  return (lastLegitSymbol = lastLegitSymbol !== -1 ? lastLegitSymbol : displayAll.length);
}
