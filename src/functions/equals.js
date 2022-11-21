// next steps:

// continue filling pivot table for all handlers (consider inserting it as a comment to the project)

// - consider using paste into displayCur (restrictions to what should be pasted) -> otherwise change "copy" to "copy result"
// clicking trigonometry after decimal
// - consider adding multiple displays for results with possibility to insert them into displayCur later on

// consider adding event listeners
// - check every input mixing with others
// check the following input 8 + ( - =
// check the following input 8 + ( =
// check the following input - ( 8  => NaN
// check the the wrong operator cut at the end : 7 + 4! - 4! +    =
// denominator doesn't work with log (it should put log in lower part)

// - when invalid input appers or any other error, block all keys except for AC and del
import { factorial } from "./factorial";
import { FixIncompleteInputs, displayAllExpression, addMissingParenthesis } from "./FixIncompleteInputs";
import $ from "jquery";

export default function calculate(state, expression) {
  console.log("you are in equals => calculate");
  FixIncompleteInputs(state, expression);
  let expr = displayAllExpression;
  expr = expr === "" ? convertDisplayAllIntoArray("0") : convertDisplayAllIntoArray(expr);
  return findParenthesis(expr);
}

function convertDisplayAllIntoArray(string) {
  // console.log("string inside convertDisplayIntoArr", string);
  let parseRegex = new RegExp(/-\d+\.\d+|\d+\.\d+|sin|cos|tan|cot|sec|csc|abs| yroot | log base | mod |invalid input| \+ | - | \* | \^ | \/ |-\d+|\d+|\D/, "g");
  let displayAllArray = string.match(parseRegex).map((elem) => (isFinite(elem) ? Number(elem) : elem));
  displayAllArray.unshift("(");
  displayAllArray.push(")");
  // console.log("convertDisplayIntoArr", displayAllArray);
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
  console.log("you are in findParenthesis", expr[0]);
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

export function findNegativeValues(arr) {
  console.log("findNegativeValues arr", arr);
  let negativeIndex = arr.findIndex((elem, ind) => (elem === " - " && ind === 0) || (elem === " - " && typeof arr[ind - 1] === "string" && arr[ind - 1] !== "!" && arr[ind - 1] !== "%" && typeof arr[ind + 1] === "number"));
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

export function lastLegitSymbol(displayAll) {
  console.log("you actually here", displayAll);
  let lastLegitSymbol = displayAll
    .split("")
    .reverse()
    .findIndex((elem) => /\d|\(|!/.test(elem));
  return (lastLegitSymbol = lastLegitSymbol !== -1 ? lastLegitSymbol : displayAll.length);
}
