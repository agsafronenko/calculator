// logic for braces:
// 1) when clicking "=" => create external braces for the whole "result" are via unshift and push (this will be handy in step 4 "recursion");
// 2) create main (outer) function "calculate(arr)" for calculating final result which will use existing "calculate(arr)" (rename it to "calculateInsideBraces(arr)") for internal calculations inside the braces, make sure main (outer) function is executed when clicking "=" sign in App.js;
// 3) inside new function:
// - use findIndex to find the first closing brace ")"
// - slice arr until this index
// - reverse sliced arr and find the first opening brace "("
// - reverse arr and slice it (arr.length - index of "(", index of ")") => this will give us the depeest level inside the braces after THE FIRST OPENING brace;
// - remove braces of the deepest level (better do this in previous step -> just count properly indeces before the last slice);
// execute "calculateInsideBraces(arr)" for the expression inside the deepest level,
// - return result back inside the "result" arr;
// 4) use recursion for step 3 until all expressions are evaluated
// 5) return result on calc's display

// apply the following restrictions:
// - do not allow to input opening brace "(" after the digit;
// - allow to input closing brace ")" only after the digit;
// - if number of opening braces is more that the number of closing -> add closing braces automatically in the end of the expression (both in "result" and in "displayOps")
// - check what happens when the operator is put after the opening brace;
// - check what happens when the digit is put after the closing brace;

export default function calculate(arr) {
  arr = findNegativeValues(arr);
  arr = calculateInOrder(arr, "lm");
  arr = calculateInOrder(arr, "^r");
  arr = calculateInOrder(arr, "*/");
  arr = calculateInOrder(arr, "+-");

  return arr[0];
}

function findNegativeValues(arr) {
  // console.log("arr inside calculate", arr);
  let negativeIndex = arr.findIndex((elem, ind) => elem === "-" && typeof arr[ind - 1] === "string" && typeof arr[ind + 1] === "number");
  // console.log("negativeIndex", negativeIndex);
  if (negativeIndex !== -1) {
    let newArr = arr
      .slice(0, negativeIndex)
      .concat(arr[negativeIndex + 1] * -1)
      .concat(arr.slice(negativeIndex + 2));
    return findNegativeValues(newArr);
  }
  // console.log("arr", arr);
  return arr;
}

function calculateInOrder(arr, operators) {
  // console.log("inside SameOperations", arr, operators);
  let operatorIndex = arr.findIndex((elem) => elem === operators[0] || elem === operators[1]);
  let currentOperator = arr[operatorIndex];

  if (operatorIndex !== -1) {
    let currentOperation = arr.slice(operatorIndex - 1, operatorIndex + 2);

    let currentResult =
      currentOperator === "l"
        ? Math.log(currentOperation[0]) / Math.log(currentOperation[2])
        : currentOperator === "m"
        ? currentOperation[0] % currentOperation[2]
        : currentOperator === "r"
        ? Math.pow(currentOperation[0], 1 / currentOperation[2])
        : currentOperator === "^"
        ? Math.pow(currentOperation[0], currentOperation[2])
        : currentOperator === "*"
        ? currentOperation[0] * currentOperation[2]
        : currentOperator === "/"
        ? currentOperation[0] / currentOperation[2]
        : currentOperator === "+"
        ? currentOperation[0] + currentOperation[2]
        : currentOperation[0] - currentOperation[2];

    let result = arr
      .slice(0, operatorIndex - 1)
      .concat(currentResult)
      .concat(arr.slice(operatorIndex + 2));

    return calculateInOrder(result, operators);
  }
  // console.log("inside SameOperations before return", arr, operator);
  return arr;
}

export let displayOpsExpression = "";
export let resultExpression = [];

export function deleteRedundantOperators(state) {
  if (/\d/.test(state.displayCur)) {
    resultExpression = state.result.concat(Number(state.displayCur));
    displayOpsExpression = state.displayOps.concat(Number(state.displayCur));
  } else {
    let lastDigitIndex = state.result.reverse().findIndex((elem) => /\d/.test(elem));
    displayOpsExpression = state.displayOps.slice(0, state.displayOps.length - lastDigitIndex);
    resultExpression = state.result.reverse().slice(0, state.result.length - lastDigitIndex);
  }
}

export function deleteRedundantDigits(state) {
  if (/\./.test(state.displayCur)) {
    let decimalIndex = state.displayOps
      .split("")
      .reverse()
      .findIndex((elem) => /\./.test(elem));
    // console.log("decimal", state.displayOps.split("").reverse());
    displayOpsExpression = state.displayOps.slice(0, state.displayOps.length - decimalIndex - 2);
    // console.log("decimalIndex", decimalIndex);
  } else if (/\D/.test(state.displayCur)) {
    displayOpsExpression = state.displayOps;
    // console.log("hey last input is not a digit");
  } else {
    let lastNonDigitIndex = state.displayOps
      .split("")
      .reverse()
      .findIndex((elem) => /\D/.test(elem));
    // console.log("lastNon", lastNonDigitIndex);
    displayOpsExpression = lastNonDigitIndex === -1 ? "" : state.displayOps.slice(0, state.displayOps.length - lastNonDigitIndex);
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
  let result = Number(num);
  if (Number.isInteger(result)) {
    for (let i = result - 1; i > 0; i--) {
      result *= i;
    }
  }
  return Number.isInteger(result) ? result : num;
}

export function trigonometryInDegrees(curDegree, trigFunc) {
  let reciprocal = {
    cot: "tan",
    sec: "cos",
    csc: "sin",
  };

  let calculateResult = Function(`return ${trigFunc} === cot || sec || csc ? 1/ Math.${reciprocal[trigFunc]}(${curDegree} * (Math.PI / 180)) : Math.${trigFunc}(${curDegree} * (Math.PI / 180))`);
  return calculateResult().toString();
}
