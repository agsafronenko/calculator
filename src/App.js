import React from "react";
import "./styles/styles.css";
import $ from "jquery";
import { abs } from "./functions/abs";
import { saveState, stateStorage } from "./functions/previousState";
import { validInput } from "./functions/factorial";
import { trigonometryInDegrees, finalDisplayAll } from "./functions/trigonometry";
import { changeSign, finalDisplayAllChangeSign } from "./functions/changeSign";
import { switchToDenominator } from "./functions/switchToDenominator";
import calculate, { FixIncompleteInputs, lastLegitSymbol } from "./functions/equals";
import { displayAllExpression } from "./functions/FixIncompleteInputs";
import { alertStatus } from "./functions/alertStatus";

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayAll: "",
      displayCur: "0",
      lastInput: "",
      lastInputType: "",
      decimalAlreadyUsed: false,
      twoConsecutiveOperators: false,
      lastResult: "",
      parenthesesDelta: 0,
      lastOperator: "",
    };
    this.handleClear = this.handleClear.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleDigit = this.handleDigit.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleSquareRoot = this.handleSquareRoot.bind(this);
    this.handleSquare = this.handleSquare.bind(this);
    this.handlePreviousState = this.handlePreviousState.bind(this);
    this.handleSpecialDigit = this.handleSpecialDigit.bind(this);
    this.handleLog10 = this.handleLog10.bind(this);
    this.handleLog = this.handleLog.bind(this);
    this.handleLogE = this.handleLogE.bind(this);
    this.handleFactorial = this.handleFactorial.bind(this);
    this.handleTrigonometry = this.handleTrigonometry.bind(this);
    this.handlePercentage = this.handlePercentage.bind(this);
    this.handleCopyToClipboard = this.handleCopyToClipboard.bind(this);
    this.handleChangeSign = this.handleChangeSign.bind(this);
    this.handleAbs = this.handleAbs.bind(this);
    this.handleSwitchToDenominator = this.handleSwitchToDenominator.bind(this);
    this.handleModulo = this.handleModulo.bind(this);
    this.handleLeftParenthesis = this.handleLeftParenthesis.bind(this);
    this.handleRightParenthesis = this.handleRightParenthesis.bind(this);
  }

  handleClear(clearStorage) {
    $("button").css("pointerEvents", "auto");
    $("button").css("opacity", "1");
    if (clearStorage === true) stateStorage.prevState = [];
    this.setState({
      displayAll: "",
      displayCur: "0",
      lastInput: "",
      lastInputType: "",
      decimalAlreadyUsed: false,
      twoConsecutiveOperators: false,
      lastResult: "",
      parenthesesDelta: 0,
      lastOperator: "",
    });
  }

  handlePreviousState() {
    $("button").css("pointerEvents", "auto");
    $("button").css("opacity", "1");
    if (stateStorage.prevState.length <= 1) {
      this.handleClear(true);
    } else {
      stateStorage.prevState.shift();
      this.setState({
        displayAll: stateStorage.prevState[0].displayAll,
        displayCur: stateStorage.prevState[0].displayCur,
        lastInput: stateStorage.prevState[0].lastInput,
        lastInputType: stateStorage.prevState[0].lastInputType,
        decimalAlreadyUsed: stateStorage.prevState[0].decimalAlreadyUsed,
        twoConsecutiveOperators: stateStorage.prevState[0].twoConsecutiveOperators,
        lastResult: stateStorage.prevState[0].lastResult,
        parenthesesDelta: stateStorage.prevState[0].parenthesesDelta,
        lastOperator: stateStorage.prevState[0].lastOperator,
      });
    }
  }

  handleOperator(e) {
    // only solo " - " is allowed as the first input among all operators
    if (this.state.displayAll !== "" || e.target.value === " - ") {
      if (this.state.displayAll !== " - ") {
        // used to compare last two states and, in case of their equality, the stateStorage will not be updated
        let penultimateInput = this.state.lastInput;

        // handle consecutive input of multiple operators
        if (this.state.twoConsecutiveOperators === true) {
          this.setState(
            (state) => ({
              displayAll: state.displayAll.slice(0, state.displayAll.length - lastLegitSymbol(state.displayAll)).concat(e.target.value),
              displayCur: calculate(state, state.displayAll),
              lastInput: e.target.value,
              lastInputType: "operator",
              twoConsecutiveOperators: false,
              lastOperator: e.target.value,
            }),
            () => {
              console.log("handleOperator stage 1 : this.state.displayAll", this.state.displayAll);
              if (e.target.value === " - " || e.target.value !== penultimateInput) saveState(this.state);
            }
          );
        } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value !== " - ") {
          if (this.state.displayAll.slice(this.state.displayAll.length - 4) !== "( - ") {
            this.setState(
              (state) => ({
                displayAll: state.displayAll.slice(0, state.displayAll.length - lastLegitSymbol(state.displayAll)).concat(e.target.value),
                displayCur: calculate(state, state.displayAll),
                lastInput: e.target.value,
                lastInputType: "operator",
                twoConsecutiveOperators: false,
                lastOperator: e.target.value,
              }),

              () => {
                console.log("handleOperator stage 2 : this.state.displayAll", this.state.displayAll);
                console.log("heyyyyy", e.target.value, this.state.lastInput);
                if (e.target.value !== penultimateInput) saveState(this.state);
              }
            );
          }
        } else if (this.state.twoConsecutiveOperators === false && this.state.lastInput === " log base " && e.target.value === " - ") {
          this.setState(
            {},

            () => {
              console.log("handleOperator stage 2.5 : this.state.displayAll", this.state.displayAll);
              console.log("heyyyyy", e.target.value, this.state.lastInput);
            }
          );
        } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value === " - ") {
          console.log("hola", this.state.displayAll.slice(this.state.displayAll.length - 4));
          if (this.state.displayAll.slice(this.state.displayAll.length - 4) !== "( - ") {
            this.setState(
              (state) => ({
                displayAll: state.displayAll.concat(e.target.value),
                displayCur: calculate(state, state.displayAll),
                lastInput: e.target.value,
                lastInputType: "operator",
                twoConsecutiveOperators: true,
                lastOperator: e.target.value,
              }),
              () => {
                console.log("handleOperator stage 3: this.state.displayAll", this.state.displayAll);
                saveState(this.state);
              }
            );
          }
        }

        if (this.state.lastInput === "(") {
          this.setState(
            (state) => ({
              displayAll: e.target.value === " - " ? state.displayAll.concat(e.target.value) : state.displayAll,
              // displayCur: state.displayCur,
              lastInput: e.target.value === " - " ? e.target.value : state.lastInput,
              lastInputType: e.target.value === " - " ? "operator" : state.lastInputType,
              lastOperator: e.target.value === " - " ? e.target.value : state.lastOperator,
            }),
            () => {
              console.log("handleOperator stage 4: this.state.displayAll", this.state.displayAll);
            }
          );
        } else if (this.state.lastInput === ")") {
          this.setState(
            (state) => ({
              displayAll: state.displayAll.concat(e.target.value),
              // displayCur: calculate(state, state.displayAll),
              lastInput: e.target.value,
              lastInputType: "operator",
              lastOperator: e.target.value,
            }),
            () => {
              console.log("handleOperator stage 5: this.state.displayAll", this.state.displayAll);
              saveState(this.state);
            }
          );
        }

        if (this.state.lastInputType !== "parenthesis" && this.state.lastInputType !== "operator") {
          this.setState(
            (state) => ({
              displayAll: state.lastResult === "" ? state.displayAll.concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
              displayCur: calculate(state, this.state.displayAll),
              lastInput: e.target.value,
              lastInputType: "operator",
              decimalAlreadyUsed: false,
              lastResult: "",
              lastOperator: e.target.value,
            }),
            () => {
              console.log("handleOperator stage 6: this.state.displayAll", this.state.displayAll);
              saveState(this.state);
            }
          );
        }
      }
    }
  }

  handleDigit(e) {
    if (this.state.lastResult !== "") this.handleClear(false);
    if (this.state.lastInput !== ")" && this.state.lastInput !== "!" && this.state.lastInput !== "%") {
      this.setState(
        (state) => ({
          displayAll:
            state.lastInputType === "operator" || state.lastInput === "("
              ? state.displayAll.concat(e.target.value)
              : (Number(state.displayCur) === 0 && state.displayCur.length === 1) || (!isFinite(state.lastInput) && state.lastInput !== ".")
              ? state.displayAll.slice(0, state.displayAll.length - 1).concat(e.target.value)
              : state.displayAll.concat(e.target.value),
          displayCur: (Number(state.displayCur) === 0 && state.displayCur.length === 1) || (!isFinite(state.lastInput) && state.lastInput !== ".") ? e.target.value : state.displayCur.concat(e.target.value),
          lastInput: e.target.value,
          lastInputType: "digit",
          twoConsecutiveOperators: false,
        }),
        () => {
          saveState(this.state);
        }
      );
    }
  }

  handleSpecialDigit(e) {
    if (this.state.lastResult !== "") this.handleClear(false);
    if (this.state.lastInput !== ")" && this.state.lastInput !== "!" && this.state.lastInput !== "%" && this.state.decimalAlreadyUsed !== true) {
      this.setState(
        (state) => ({
          displayAll:
            state.lastInputType === "operator" || state.lastInput === "("
              ? state.displayAll.concat(e.target.value)
              : (Number(state.displayCur) === 0 && state.displayCur.length === 1) || (!isFinite(state.lastInput) && state.lastInput !== ".")
              ? state.displayAll.slice(0, state.displayAll.length - 1).concat(e.target.value)
              : state.displayAll.concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value[e.target.value.length - 1],
          lastInputType: "digit",
          decimalAlreadyUsed: true,
          twoConsecutiveOperators: false,
        }),
        () => {
          saveState(this.state);
        }
      );
    }
  }

  handleDecimal() {
    if ((this.state.lastInputType === "digit" || this.state.lastInputType === "operator" || this.state.lastInput === "" || this.state.lastInput === "(") && this.state.decimalAlreadyUsed === false) {
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? state.displayAll.concat(isFinite(state.lastInput) && this.state.displayAll !== "" ? "." : "0.") : /\./.test(state.lastResult) ? "".concat("0.") : "".state.lastResult.concat("."),
          displayCur: state.lastResult === "" ? (isFinite(state.lastInput) ? state.displayCur.concat(".") : "0.") : /\./.test(state.lastResult) ? "".concat("0.") : "".state.lastResult.concat("."),
          lastInput: ".",
          lastInputType: "decimal",
          decimalAlreadyUsed: true,
          twoConsecutiveOperators: false,
          lastResult: "",
        }),
        () => {
          saveState(this.state);
        }
      );
    }
  }

  handleSquare() {
    document.getElementById("exponentiation").click();
    setTimeout(() => {
      if (this.state.lastInput === " ^ ") {
        document.getElementById("two").click();
        setTimeout(
          () =>
            this.setState((state) => ({
              displayCur: calculate(state, state.displayAll),
            })),
          0
        );
      }
    }, 0);
  }

  handleSquareRoot() {
    document.getElementById("anyRoot").click();
    setTimeout(() => {
      if (this.state.lastInput === " yroot ") {
        document.getElementById("two").click();
        setTimeout(
          () =>
            this.setState((state) => ({
              displayCur: calculate(state, state.displayAll),
            })),
          0
        );
      }
    }, 0);
  }

  // handleExponentiation(e) {
  //   this.setState(
  //     (state) => ({
  //       displayAll: state.lastResult === "" ? state.displayAll.concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
  //       displayCur: e.target.value,
  //       lastInput: e.target.value,
  //       lastInputType: "operator",
  //       twoConsecutiveOperators: false,
  //       decimalAlreadyUsed: false,
  //       lastResult: "",
  //       lastOperator: " ^ ",
  //     }),
  //     () => {
  //       console.log("inside handle ^ after setState:  displayAll", this.state.displayAll);
  //       saveState(this.state);
  //     }
  //   );
  // }

  // handleRoot(e) {
  //   this.setState(
  //     (state) => ({
  //       displayAll: state.lastResult === "" ? state.displayAll.concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
  //       displayCur: e.target.value,
  //       lastInput: e.target.value,
  //       lastInputType: "operator",
  //       twoConsecutiveOperators: false,
  //       decimalAlreadyUsed: false,
  //       lastResult: "",
  //       lastOperator: " yroot ",
  //     }),
  //     () => {
  //       console.log("after displayAll", this.state.displayAll);
  //       saveState(this.state);
  //     }
  //   );
  // }

  handleLog(e) {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")") {
      console.log("inside handle log: displayAll", this.state.displayAll);
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? state.displayAll.concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
          displayCur: "",
          lastInput: e.target.value,
          lastInputType: "operator",
          decimalAlreadyUsed: false,
          twoConsecutiveOperators: false,
          lastResult: "",
          lastOperator: e.target.value,
        }),
        () => {
          console.log("inside handle log after setState: displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handleLog10() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")") {
      console.log("inside handle log10: displayAll", this.state.displayAll);
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? state.displayAll.concat(" log base 10") : "".concat(state.lastResult).concat(" log base 10"),
          lastInput: "10",
          lastInputType: "digit",
          decimalAlreadyUsed: false,
          twoConsecutiveOperators: false,
          lastResult: "",
          lastOperator: " log base ",
        }),
        () => {
          this.setState((state) => ({
            displayCur: calculate(state, state.displayAll),
          }));
          console.log("inside handle log10 after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handleLogE() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")") {
      console.log("inside handle logE: displayAll", this.state.displayAll);
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? state.displayAll.concat(` log base ${Math.E}`) : "".concat(state.lastResult).concat(` log base ${Math.E}`),
          lastInput: `${Math.E}`,
          lastInputType: "digit",
          decimalAlreadyUsed: true,
          twoConsecutiveOperators: false,
          lastResult: "",
          lastOperator: " log base ",
        }),
        () => {
          this.setState((state) => ({
            displayCur: calculate(state, state.displayAll),
          }));
          console.log("inside handle logE after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handleFactorial() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")" || (this.state.lastInput === "%" && !this.state.displayAll.match(/!%/))) {
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? state.displayAll.concat("!") : "".concat(state.lastResult).concat("!"),
          lastInput: "!",
          lastInputType: "!",
          decimalAlreadyUsed: false,
          lastResult: "",
          lastOperator: "!",
        }),
        () => {
          let result = calculate(this.state, this.state.displayAll);
          this.setState({
            displayCur: result,
          });
          console.log("inside handle factorial after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handleTrigonometry(e) {
    console.log("you are in handleTrigonometry", this.state.lastInputType);

    if (this.state.lastInputType === "digit" || this.state.lastInput === "!" || this.state.lastInput === "%" || this.state.lastInput === ")" || this.state.lastInput === ".") {
      let result = trigonometryInDegrees(e.target.value, this.state);
      console.log("trigonometry", result);
      this.setState(
        {
          displayAll: result,
          lastInput: ")",
          lastInputType: "parenthesis",
          decimalAlreadyUsed: false,
          lastResult: "",
          lastOperator: "trigonometry",
        },
        () => {
          this.setState((state) => ({
            displayCur: calculate(state, state.displayAll),
          }));
          console.log("inside trigonometry after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handlePercentage() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")" || (this.state.lastInput === "!" && !this.state.displayAll.match(/%!/))) {
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? state.displayAll.concat("%") : "".concat(state.lastResult).concat("%"),
          lastInput: "%",
          lastInputType: "%",
          decimalAlreadyUsed: false,
          lastResult: "",
          lastOperator: "%",
        }),
        () => {
          this.setState((state) => ({
            displayCur: calculate(state, state.displayAll),
          }));
          console.log("inside handle log10 after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handleChangeSign() {
    if (this.state.lastOperator !== " log base ") {
      let result = changeSign(this.state);

      this.setState(
        {
          displayAll: result,
          lastResult: "",
        },
        () => {
          this.setState((state) => ({
            displayCur: calculate(state, state.displayAll),
          }));
          console.log("inside handle changeSign after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handleAbs() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === "!" || this.state.lastInput === "%" || this.state.lastInput === ")" || this.state.lastInput === ".") {
      let result = abs(this.state);

      this.setState(
        {
          displayAll: result,
          lastInput: ")",
          lastInputType: "parenthesis",
          decimalAlreadyUsed: false,
          lastOperator: "abs",
          lastResult: "",
        },
        () => {
          this.setState((state) => ({
            displayCur: calculate(state, state.displayAll),
          }));
          console.log("inside abs after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handleSwitchToDenominator() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === "!" || this.state.lastInput === "%" || this.state.lastInput === ")" || this.state.lastInput === ".") {
      let result = switchToDenominator(this.state);

      this.setState(
        {
          displayAll: result,
          lastInput: ")",
          lastInputType: "parenthesis",
          decimalAlreadyUsed: false,
          lastOperator: "denominator",
          lastResult: "",
        },
        () => {
          this.setState((state) => ({
            displayCur: calculate(state, state.displayAll),
          }));
          console.log("inside denominator after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handleModulo(e) {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")" || this.state.lastInput === "!" || this.state.lastInput === "%" || this.state.lastInput === ".") {
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? (state.lastInput === "." ? state.displayAll.concat("0").concat(e.target.value) : state.displayAll.concat(e.target.value)) : "".concat(state.lastResult).concat(e.target.value),
          lastInput: e.target.value,
          lastInputType: "operator",
          decimalAlreadyUsed: false,
          lastResult: "",
          lastOperator: e.target.value,
        }),
        () => {
          this.setState((state) => ({
            displayCur: calculate(state, state.displayAll),
          }));
          console.log("inside modulo after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }

  handleLeftParenthesis(e) {
    if (this.state.lastInputType === "operator" || this.state.lastInput === "(" || this.state.displayAll === "" || this.state.lastResult !== "") {
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? state.displayAll.concat(e.target.value) : "".concat(e.target.value),
          displayCur: state.lastResult === "" ? state.displayCur : "",
          lastInput: "(",
          lastInputType: "parenthesis",
          decimalAlreadyUsed: false,
          twoConsecutiveOperators: false,
          lastResult: "",
          parenthesesDelta: state.parenthesesDelta + 1,
          lastOperator: e.target.value,
        }),
        () => {
          console.log("inside leftParenthesis after setState:  displayAll", this.state.displayAll);
          saveState(this.state);
        }
      );
    }
  }
  handleRightParenthesis(e) {
    console.log("this.state.parthersesDelta", this.state.parenthesesDelta);
    if (this.state.parenthesesDelta > 0) {
      if (this.state.lastInputType === "digit" || this.state.lastInput === "!" || this.state.lastInput === "%" || this.state.lastInput === ")" || this.state.lastInput === ".") {
        this.setState(
          (state) => ({
            displayAll: state.lastResult === "" ? state.displayAll.concat(e.target.value) : "".concat(e.target.value),
            displayCur: calculate(state, state.displayAll),
            lastInput: ")",
            lastInputType: "parenthesis",
            decimalAlreadyUsed: false,
            parenthesesDelta: state.parenthesesDelta - 1,
            lastOperator: e.target.value,
          }),
          () => {
            console.log("inside rightParenthesis after setState:  displayAll", this.state.displayAll);
            saveState(this.state);
          }
        );
      }
    }
  }

  handleEquals() {
    if (this.state.lastResult === "") {
      console.log("check parenthesis after adding missing", this.state.displayAll);

      let result = calculate(this.state, this.state.displayAll);
      this.setState(
        {
          displayAll: displayAllExpression.concat(" = ").concat(result < 0 ? ` - ${Math.abs(result)}` : `${result}`),
          displayCur: result,
          lastInput: "",
          lastInputType: "digit",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: false,
          lastResult: result < 0 ? ` - ${Math.abs(result)}` : `${result}`,
          parenthesesDelta: 0,
          lastOperator: "equal",
        },
        () => {
          saveState(this.state);
          alertStatus.negative = false; // is it required to have it here?
          alertStatus.nonInteger = false;
          alertStatus.negativeLog = false;
          console.log("Inside handleEquals: final result", result);
        }
      );
    }
  }

  handleCopyToClipboard() {
    let copyResult = document.getElementById("display").innerText;
    navigator.clipboard.writeText(copyResult);
  }

  render() {
    return (
      <>
        <Display ops={this.state.displayAll} cur={this.state.displayCur} />
        <Buttons
          clear={this.handleClear}
          operator={this.handleOperator}
          digit={this.handleDigit}
          equals={this.handleEquals}
          decimal={this.handleDecimal}
          // exponentiation={this.handleExponentiation}
          // root={this.handleRoot}
          square={this.handleSquare}
          squareRoot={this.handleSquareRoot}
          previousState={this.handlePreviousState}
          specialDigit={this.handleSpecialDigit}
          log10={this.handleLog10}
          log={this.handleLog}
          logE={this.handleLogE}
          factorial={this.handleFactorial}
          trigonometry={this.handleTrigonometry}
          percentage={this.handlePercentage}
          copyToClipboard={this.handleCopyToClipboard}
          changeSign={this.handleChangeSign}
          abs={this.handleAbs}
          switchToDenominator={this.handleSwitchToDenominator}
          modulo={this.handleModulo}
          leftParenthesis={this.handleLeftParenthesis}
          rightParenthesis={this.handleRightParenthesis}
        />
        <Footer />
      </>
    );
  }
}

class Display extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div id="displayBox">
          <div id="displayAll">{this.props.ops}</div>
          <div id="display">{this.props.cur}</div>
        </div>
      </>
    );
  }
}

class Buttons extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <button id="clear" onClick={() => this.props.clear(true)}>
          AC
        </button>
        <button id="add" value=" + " onClick={this.props.operator}>
          +
        </button>
        <button id="seven" value="7" onClick={this.props.digit}>
          7
        </button>
        <button id="eight" value="8" onClick={this.props.digit}>
          8
        </button>
        <button id="nine" value="9" onClick={this.props.digit}>
          9
        </button>
        <button id="subtract" value=" - " onClick={this.props.operator}>
          -
        </button>
        <button id="four" value="4" onClick={this.props.digit}>
          4
        </button>
        <button id="five" value="5" onClick={this.props.digit}>
          5
        </button>
        <button id="six" value="6" onClick={this.props.digit}>
          6
        </button>
        <button id="multiply" value=" * " onClick={this.props.operator}>
          x
        </button>
        <button id="one" value="1" onClick={this.props.digit}>
          1
        </button>
        <button id="two" value="2" onClick={this.props.digit}>
          2
        </button>
        <button id="three" value="3" onClick={this.props.digit}>
          3
        </button>
        <button id="divide" value=" / " onClick={this.props.operator}>
          /
        </button>
        <button id="zero" value="0" onClick={this.props.digit}>
          0
        </button>
        <button id="decimal" onClick={this.props.decimal}>
          .
        </button>
        <button id="equals" onClick={this.props.equals}>
          =
        </button>
        <button id="square" value="S" onClick={this.props.square}>
          S
        </button>
        <button id="squareRoot" value="R" onClick={this.props.squareRoot}>
          R
        </button>
        <button id="exponentiation" value=" ^ " onClick={this.props.operator}>
          ^
        </button>
        <button id="anyRoot" value=" yroot " onClick={this.props.operator}>
          root
        </button>
        <button id="pi" value={Math.PI} onClick={this.props.specialDigit}>
          Pi
        </button>
        <button id="e" value={Math.E} onClick={this.props.specialDigit}>
          e
        </button>
        <button id="random" value={Math.random()} onClick={this.props.specialDigit}>
          rand
        </button>
        <button id="delete" onClick={this.props.previousState}>
          del
        </button>
        <button id="log10" onClick={this.props.log10}>
          log10
        </button>
        <button id="log" value=" log base " onClick={this.props.log}>
          log
        </button>
        <button id="logE" onClick={this.props.logE}>
          logE
        </button>
        <button id="factorial" onClick={this.props.factorial}>
          !
        </button>
        <button id="sin" value="sin" onClick={this.props.trigonometry}>
          sin
        </button>
        <button id="cos" value="cos" onClick={this.props.trigonometry}>
          cos
        </button>
        <button id="tan" value="tan" onClick={this.props.trigonometry}>
          tan
        </button>
        <button id="cot" value="cot" onClick={this.props.trigonometry}>
          cot
        </button>
        <button id="sec" value="sec" onClick={this.props.trigonometry}>
          sec
        </button>
        <button id="csc" value="csc" onClick={this.props.trigonometry}>
          csc
        </button>
        <button id="percentage" onClick={this.props.percentage}>
          %
        </button>
        <button id="copy" onClick={this.props.copyToClipboard}>
          Copy
        </button>
        <button id="sign" onClick={this.props.changeSign}>
          +/-
        </button>
        <button id="abs" onClick={this.props.abs}>
          abs
        </button>
        <button id="denominator" onClick={this.props.switchToDenominator}>
          1/x
        </button>
        <button id="modulo" value=" mod " onClick={this.props.modulo}>
          mod
        </button>
        <button id="leftParenthesis" value="(" onClick={this.props.leftParenthesis}>
          (
        </button>
        <button id="rightParenthesis" value=")" onClick={this.props.rightParenthesis}>
          )
        </button>
      </>
    );
  }
}

function Footer() {
  return (
    <footer>
      <div id="footer">This project was build using: HTML, CSS, JavaScript, React, Redux, jQuery, Bootstrap and SASS without using eval() function</div>
    </footer>
  );
}
