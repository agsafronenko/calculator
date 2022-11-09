export function factorial(num) {
  let result = "";
  if (num < 0) {
    alert("invalid input: factorials are only defined for positive numbers");

    result = "invalid input";
    return result;
  } else if (num % 1 !== 0 && num !== ")") {
    alert(`factorials for nonintegers are defined based on simplified Gamma function:
      ~~ level of accuracy: low ~~`);
    return Math.pow(2 * num * Math.PI, 1 / 2) * Math.pow(num / Math.E, num);
  } else if (num === ")") {
    return "!";
  } else {
    result = Number(num);
    if (Number.isInteger(result)) {
      for (let i = result - 1; i > 0; i--) {
        result *= i;
      }
      return result;
    }
  }
}
