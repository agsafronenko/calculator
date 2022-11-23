import { alertStatus } from "./alertStatus";

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
