export default function calculate(arr) {
  arr = findNegativeValues(arr);
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
      currentOperator === "r"
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
    displayOpsExpression = state.displayOps;
  } else {
    let lastDigitIndex = state.result.reverse().findIndex((elem) => /\d/.test(elem));
    displayOpsExpression = state.displayOps.slice(0, state.displayOps.length - lastDigitIndex);
    resultExpression = state.result.reverse().slice(0, state.result.length - lastDigitIndex);
  }
}

export function saveState(state, stateStorage) {
  console.log("inside saveState");
  if (stateStorage.length >= 30) {
    stateStorage.pop();
    stateStorage.unshift(state);
  } else {
    stateStorage.unshift(state);
  }
  return stateStorage;
}
