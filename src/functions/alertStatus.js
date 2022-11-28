export let alertStatus = {
  negativeFactor: false,
  nonIntegerFactor: false,
  negativeLog: false,
  zeroAsDenominator: false,
};

export function validInputLog(currentOperation) {
  alertStatus.negativeLog = false;
  return Math.log(currentOperation[0]) / Math.log(currentOperation[2]);
}

export function invalidInputLog() {
  if (alertStatus.negativeLog === false) {
    alert("the logarithm of a negative number is undefined");
    alertStatus.negativeLog = true;
    return "invalid input";
  } else {
    return "invalid input";
  }
}

export function validInputDenominator(currentOperation) {
  alertStatus.zeroAsDenominator = false;
  return currentOperation[0] / currentOperation[2];
}

export function invalidInputDenominator() {
  if (alertStatus.zeroAsDenominator === false) {
    alert("you cannot divide by zero");
    alertStatus.zeroAsDenominator = true;
    return "invalid input";
  } else {
    return "invalid input";
  }
}
