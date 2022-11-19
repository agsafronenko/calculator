import { expression, expressionNegative, findExpression } from "./findExpression";
import calculate from "./equals";

export function factorial(state) {
  findExpression(state);
  let result = calculate(state, expression);
  console.log("you are in factorial: RESULT", result);
  if (result < 0) {
    // if (alertActive.negative) {
    //   alert("invalid input: factorials are only defined for positive numbers");
    // }
    return "invalid input";
  } else {
    return result;
  }
}

//   } else if (num % 1 !== 0 && num !== ")") {
//     alert(`factorials for nonintegers are defined based on simplified Gamma function:
//       ~~ level of accuracy: low ~~`);
//     return [Math.pow(2 * num * Math.PI, 1 / 2) * Math.pow(num / Math.E, num), false];
//   } else if (num === ")") {
//     return ["!", false];
//   } else {
//     result = Number(num);
//     if (Number.isInteger(result)) {
//       for (let i = result - 1; i > 0; i--) {
//         result *= i;
//       }
//       return [result, false];
//     }
//   }
// }

// export function factorial(num, alertActive) {
//   let result = "";

//   if (num < 0) {
//     if (alertActive.negative) {
//       alert("invalid input: factorials are only defined for positive numbers");
//     }
//     return ["invalid input", false];
//   } else if (num % 1 !== 0 && num !== ")") {
//     alert(`factorials for nonintegers are defined based on simplified Gamma function:
//       ~~ level of accuracy: low ~~`);
//     return [Math.pow(2 * num * Math.PI, 1 / 2) * Math.pow(num / Math.E, num), false];
//   } else if (num === ")") {
//     return ["!", false];
//   } else {
//     result = Number(num);
//     if (Number.isInteger(result)) {
//       for (let i = result - 1; i > 0; i--) {
//         result *= i;
//       }
//       return [result, false];
//     }
//   }
// }
