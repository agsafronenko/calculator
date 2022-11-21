import { expression, findExpression } from "./findExpression";
import calculate from "./equals";

export let alertStatus = {
  negative: false,
  nonInteger: false,
};

export function factorial(num) {
  if (num < 0) {
    if (alertStatus.negative === false) {
      alert("invalid input: factorials are only defined for positive numbers");
      alertStatus.negative = true;
    }
    return "invalid input";
  } else if (num % 1 !== 0) {
    if (alertStatus.nonInteger === false) {
      alert(`factorials for nonintegers are defined based on simplified Gamma function:
      ~~ level of accuracy: low ~~`);
      alertStatus.nonInteger = true;
    }
    return Math.pow(2 * num * Math.PI, 1 / 2) * Math.pow(num / Math.E, num);
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
