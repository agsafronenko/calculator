import calculate, { findNegativeValues } from "./equals";
import { findExpression, expression, regex, expressionNegative } from "./findExpression";
export let finalDisplayAll = "";
let displayAll = "";
export let displayAllAfterTrigonometry = "";

export function trigonometryInDegrees(trigFunc, state) {
  displayAll = state.lastResult !== "" ? state.lastResult : state.displayAll;
  let changeOneIntoAnother = [
    // trigonometry function will be applied for:
    // 1) the expression not preceded by operators (minus here indicates negative value of the following number rather than an operator sign)
    {
      before: "\\(",
      after: `(${trigFunc}(`,
    },
    {
      before: "\\( - ",
      after: `(${trigFunc}( - `,
    },
    {
      before: "^",
      after: `${trigFunc}(`,
    },
    {
      before: "^ - ",
      after: `${trigFunc}( - `,
    },

    // 2) the expression preceded by two consecutive operators:
    {
      before: " -  - ",
      after: ` - ${trigFunc}( - `,
    },
    {
      before: " \\+  - ",
      after: ` + ${trigFunc}( - `,
    },
    {
      before: " \\*  - ",
      after: ` * ${trigFunc}( - `,
    },
    {
      before: " \\/  - ",
      after: ` / ${trigFunc}( - `,
    },
    {
      before: " \\^  - ",
      after: ` ^ ${trigFunc}( - `,
    },
    {
      before: " yroot  - ",
      after: ` yroot ${trigFunc}( - `,
    },

    // 3) the expression preceded by only one operator:
    {
      before: " - ",
      after: ` - ${trigFunc}(`,
    },
    {
      before: " \\+ ",
      after: ` + ${trigFunc}(`,
    },
    {
      before: " \\* ",
      after: ` * ${trigFunc}(`,
    },
    {
      before: " \\/ ",
      after: ` / ${trigFunc}(`,
    },
    {
      before: " \\^ ",
      after: ` ^ ${trigFunc}(`,
    },
    {
      before: " yroot ",
      after: ` yroot ${trigFunc}(`,
    },
    {
      before: " log base ",
      after: ` log base ${trigFunc}(`,
    },
  ];

  findExpression(state);
  console.log("expression in trigonometry", expression, expressionNegative, "regex", regex);

  let arr = [];
  for (let i = 0; i < changeOneIntoAnother.length; i++) {
    arr.push(displayAll.match(new RegExp(`${changeOneIntoAnother[i]["before"]}${regex}$`)));
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== null) {
      displayAllAfterTrigonometry = displayAll.slice(0, arr[i].index).concat(changeOneIntoAnother[i]["after"]).concat(expression).concat(")");

      break;
    }
  }
  console.log("displayAllAfterTrigonometry", displayAllAfterTrigonometry);
  return displayAllAfterTrigonometry;
}

// function trigonometryCalculate(curDegree, trigFunc, state) {
//   let reciprocal = {
//     cot: "tan",
//     sec: "cos",
//     csc: "sin",
//   };
//   let calculateResult = Function(`return ${trigFunc} === cot || ${trigFunc} === sec || ${trigFunc} === csc ? 1/ Math.${reciprocal[trigFunc]}(${curDegree} * (Math.PI / 180)) : Math.${trigFunc}(${curDegree} * (Math.PI / 180))`);
//   return calculateResult().toString();
// }
