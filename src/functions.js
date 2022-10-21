export default function calculate(arr) {
  let addInd = arr.findIndex((elem) => elem === "+");
  console.log("arr", arr);
  if (addInd !== -1) {
    let currentOperation = arr.slice(addInd - 1, addInd + 2);
    let currentResult = currentOperation[0] + currentOperation[2];

    let result = arr
      .slice(0, addInd - 1)
      .concat(currentResult)
      .concat(arr.slice(addInd + 2));

    return calculate(result);
  }

  let subInd = arr.findIndex((elem) => elem === "-");

  if (subInd !== -1) {
    let currentOperation = arr.slice(subInd - 1, subInd + 2);
    let currentResult = currentOperation[0] - currentOperation[2];

    let result = arr
      .slice(0, subInd - 1)
      .concat(currentResult)
      .concat(arr.slice(subInd + 2));

    return calculate(result);
  }

  return arr[0];
}
