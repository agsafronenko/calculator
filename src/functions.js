export default function calculate(arr) {
  arr = calculateInOrder(arr, "*/");
  arr = calculateInOrder(arr, "+-");

  return arr[0];
}

function calculateInOrder(arr, operators) {
  // console.log("inside SameOperations", arr, operators);
  let operatorIndex = arr.findIndex((elem) => elem === operators[0] || elem === operators[1]);
  let currentOperator = arr[operatorIndex];

  if (operatorIndex !== -1) {
    let currentOperation = arr.slice(operatorIndex - 1, operatorIndex + 2);

    let currentResult = currentOperator === "*" ? currentOperation[0] * currentOperation[2] : currentOperator === "/" ? currentOperation[0] / currentOperation[2] : currentOperator === "+" ? currentOperation[0] + currentOperation[2] : currentOperation[0] - currentOperation[2];

    let result = arr
      .slice(0, operatorIndex - 1)
      .concat(currentResult)
      .concat(arr.slice(operatorIndex + 2));

    return calculateInOrder(result, operators);
  }
  // console.log("inside SameOperations before return", arr, operator);
  return arr;
}
