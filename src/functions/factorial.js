import { alertStatus } from "./alertStatus";
import $ from "jquery";

export function factorial(num) {
  if (num < 0) {
    if (alertStatus.negativeFactor === false) {
      alert("invalid input: factorials are only defined for positive numbers");
      alertStatus.negativeFactor = true;
    }
    $("button").css("pointerEvents", "none");
    $("button").css("opacity", "0.8");
    $("#clear").css("pointerEvents", "auto");
    $("#clear").css("opacity", "1");
    $("#delete").css("pointerEvents", "auto");
    $("#delete").css("opacity", "1");

    return "invalid input";
  } else if (num % 1 !== 0) {
    if (alertStatus.nonIntegerFactor === false) {
      alert(`factorials for nonintegers are defined based on simplified Gamma function:
      ~~ level of accuracy: low ~~`);
      alertStatus.nonIntegerFactor = true;
    }
    return Math.pow(2 * num * Math.PI, 1 / 2) * Math.pow(num / Math.E, num);
  } else if (num === 0) {
    return 1;
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
