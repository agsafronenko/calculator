import React from "react";
import "./styles/styles.css";
import $ from "jquery";
import { abs } from "./functions/abs";
import { saveState, stateStorage } from "./functions/previousState";
import { factorial } from "./functions/factorial";
import { trigonometryInDegrees, finalDisplayOps } from "./functions/trigonometry";
import { changeSign, finalDisplayOpsChangeSign } from "./functions/changeSign";
import { switchToDenominator } from "./functions/switchToDenominator";
import calculate, { deleteRedundantOperators, displayOpsExpression, lastLegitSymbol } from "./functions/equals";

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayOps: "",
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
    this.handleExponentiation = this.handleExponentiation.bind(this);
    this.handleSquareRoot = this.handleSquareRoot.bind(this);
    this.handleSquare = this.handleSquare.bind(this);
    this.handleRoot = this.handleRoot.bind(this);
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

  handleClear() {
    stateStorage.prevState = [];
    this.setState({
      displayOps: "",
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
    if (stateStorage.prevState.length <= 1) {
      this.handleClear();
    } else {
      stateStorage.prevState.shift();
      this.setState({
        displayOps: stateStorage.prevState[0].displayOps,
        displayCur: stateStorage.prevState[0].displayCur,
        lastInput: stateStorage.prevState[0].lastInput,
        lastInputType: stateStorage.prevState[0].lastInputType,
        decimalAlreadyUsed: stateStorage.prevState[0].decimalAlreadyUsed,
        twoConsecutiveOperators: stateStorage.prevState[0].twoConsecutiveOperators,
        lastResult: stateStorage.prevState[0].lastResult,
        lastOperator: stateStorage.prevState[0].lastOperator,
      });
    }
  }

  handleOperator(e) {
    // only solo " - " is allowed as the first input among all operators
    if (this.state.displayOps !== "" || e.target.value === " - ") {
      if (this.state.displayOps !== " - ") {
        // used to compare last two states and, in case of their equality, the stateStorage will not be updated
        let penultimateInput = this.state.lastInput;

        // handle consecutive input of multiple operators
        if (this.state.twoConsecutiveOperators === true) {
          this.setState(
            (state) => ({
              displayOps: state.displayOps.slice(0, state.displayOps.length - lastLegitSymbol(state.displayOps)).concat(e.target.value),
              displayCur: e.target.value,
              lastInput: e.target.value,
              lastInputType: "operator",
              twoConsecutiveOperators: false,
              lastOperator: e.target.value,
            }),
            () => {
              console.log("handleOperator stage 1 : this.state.displayOps", this.state.displayOps);
              if (e.target.value === " - " || e.target.value !== penultimateInput) saveState(this.state);
            }
          );
        } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value !== " - ") {
          if (this.state.displayOps.slice(this.state.displayOps.length - 4) !== "( - ") {
            this.setState(
              (state) => ({
                displayOps: state.displayOps.slice(0, state.displayOps.length - lastLegitSymbol(state.displayOps)).concat(e.target.value),
                displayCur: e.target.value,
                lastInput: e.target.value,
                lastInputType: "operator",
                twoConsecutiveOperators: false,
                lastOperator: e.target.value,
              }),

              () => {
                console.log("handleOperator stage 2 : this.state.displayOps", this.state.displayOps);
                console.log("heyyyyy", e.target.value, this.state.lastInput);
                if (e.target.value !== penultimateInput) saveState(this.state);
              }
            );
          }
        } else if (this.state.twoConsecutiveOperators === false && this.state.lastInput === " log base " && e.target.value === " - ") {
          this.setState(
            (state) => ({
              // displayOps: state.displayOps.slice(0, state.displayOps.length - lastLegitSymbol(state.displayOps)).concat(e.target.value),
              // displayCur: e.target.value,
              // lastInput: e.target.value,
              // lastInputType: "operator",
              // twoConsecutiveOperators: false,
            }),

            () => {
              console.log("handleOperator stage 2.5 : this.state.displayOps", this.state.displayOps);
              console.log("heyyyyy", e.target.value, this.state.lastInput);
              // if (e.target.value !== penultimateInput) saveState(this.state);
            }
          );
        } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value === " - ") {
          console.log("hola", this.state.displayOps.slice(this.state.displayOps.length - 4));
          if (this.state.displayOps.slice(this.state.displayOps.length - 4) !== "( - ") {
            this.setState(
              (state) => ({
                displayOps: state.displayOps.concat(e.target.value),
                displayCur: e.target.value,
                lastInput: e.target.value,
                lastInputType: "operator",
                twoConsecutiveOperators: true,
                lastOperator: e.target.value,
              }),
              () => {
                console.log("handleOperator stage 3: this.state.displayOps", this.state.displayOps);
                saveState(this.state);
              }
            );
          }
        }

        if (this.state.lastInput === "(") {
          this.setState(
            (state) => ({
              displayOps: e.target.value === " - " ? state.displayOps.concat(e.target.value) : state.displayOps,
              displayCur: e.target.value === " - " ? e.target.value : state.displayCur,
              lastInput: e.target.value === " - " ? e.target.value : state.lastInput,
              lastInputType: e.target.value === " - " ? "operator" : state.lastInputType,
              lastOperator: e.target.value === " - " ? e.target.value : state.lastOperator,
            }),
            () => {
              console.log("handleOperator stage 4: this.state.displayOps", this.state.displayOps);
            }
          );
        } else if (this.state.lastInput === ")") {
          this.setState(
            (state) => ({
              displayOps: state.displayOps.concat(e.target.value),
              displayCur: e.target.value,
              lastInput: e.target.value,
              lastInputType: "operator",
              twoConsecutiveOperators: false,
              decimalAlreadyUsed: false,
              lastResult: "",
              lastOperator: e.target.value,
            }),
            () => {
              console.log("handleOperator stage 5: this.state.displayOps", this.state.displayOps);
              saveState(this.state);
            }
          );
        }

        if (this.state.lastInputType !== "parenthesis" && this.state.lastInputType !== "operator") {
          this.setState(
            (state) => ({
              displayOps: state.lastResult === "" ? state.displayOps.concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
              displayCur: e.target.value,
              lastInput: e.target.value,
              lastInputType: "operator",
              twoConsecutiveOperators: false,
              decimalAlreadyUsed: false,
              lastResult: "",
              lastOperator: e.target.value,
            }),
            () => {
              console.log("handleOperator stage 6: this.state.displayOps", this.state.displayOps);
              saveState(this.state);
            }
          );
        }
      }
    }
  }

  handleDigit(e) {
    if (this.state.lastResult !== "") this.handleClear();
    if (this.state.lastInput !== ")" && this.state.lastInput !== "!" && this.state.lastInput !== "%") {
      this.setState(
        (state) => ({
          displayOps:
            state.lastInputType === "operator" || state.lastInput === "("
              ? state.displayOps.concat(e.target.value)
              : (Number(state.displayCur) === 0 && state.displayCur.length === 1) || (!isFinite(state.lastInput) && state.lastInput !== ".")
              ? state.displayOps.slice(0, state.displayOps.length - 1).concat(e.target.value)
              : state.displayOps.concat(e.target.value),
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
    if (this.state.lastResult !== "") this.handleClear();
    if (this.state.lastInput !== ")" && this.state.lastInput !== "!" && this.state.lastInput !== "%" && this.state.decimalAlreadyUsed !== true) {
      this.setState(
        (state) => ({
          displayOps:
            state.lastInputType === "operator" || state.lastInput === "("
              ? state.displayOps.concat(e.target.value)
              : (Number(state.displayCur) === 0 && state.displayCur.length === 1) || (!isFinite(state.lastInput) && state.lastInput !== ".")
              ? state.displayOps.slice(0, state.displayOps.length - 1).concat(e.target.value)
              : state.displayOps.concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastInputType: "digit",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: true,
        }),
        () => {
          saveState(this.state);
        }
      );
    }
  }

  handleDecimal() {
    if (this.state.lastInput !== ")" && this.state.lastInput !== "!" && this.state.lastInput !== "%" && this.state.decimalAlreadyUsed !== true) {
      this.setState(
        (state) => ({
          displayOps: state.lastResult === "" ? state.displayOps.concat(isFinite(state.lastInput) && this.state.displayOps !== "" ? "." : "0.") : /\./.test(state.lastResult) ? "".concat("0.") : "".state.lastResult.concat("."),
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
    this.setState(
      (state) => ({
        displayOps: state.lastResult === "" ? state.displayOps.concat(" ^ 2") : "".concat(state.lastResult).concat(" ^ 2"),
        displayCur: "",
        lastInput: "2",
        lastInputType: "digit",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
        lastOperator: " ^ ",
      }),
      () => {
        console.log("inside handle ^2 after setState:  displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleSquareRoot() {
    this.setState(
      (state) => ({
        displayOps: state.lastResult === "" ? state.displayOps.concat(" yroot 2") : "".concat(state.lastResult).concat(" yroot 2"),
        displayCur: "",
        lastInput: "2",
        lastInputType: "digit",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
        lastOperator: " yroot ",
      }),
      () => {
        console.log("after displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleExponentiation(e) {
    this.setState(
      (state) => ({
        displayOps: state.lastResult === "" ? state.displayOps.concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
        displayCur: e.target.value,
        lastInput: e.target.value,
        lastInputType: "operator",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
        lastOperator: " ^ ",
      }),
      () => {
        console.log("inside handle ^ after setState:  displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleRoot(e) {
    this.setState(
      (state) => ({
        displayOps: state.lastResult === "" ? state.displayOps.concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
        displayCur: e.target.value,
        lastInput: e.target.value,
        lastInputType: "operator",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
        lastOperator: " yroot ",
      }),
      () => {
        console.log("after displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleLog(e) {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")") {
      console.log("inside handle log: displayOps", this.state.displayOps);
      this.setState(
        (state) => ({
          displayOps: state.lastResult === "" ? state.displayOps.concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastInputType: "operator",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: false,
          lastResult: "",
          lastOperator: " log base ",
        }),
        () => {
          console.log("inside handle log after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handleLog10() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")") {
      console.log("inside handle log10: displayOps", this.state.displayOps);
      this.setState(
        (state) => ({
          displayOps: state.lastResult === "" ? state.displayOps.concat(" log base 10") : "".concat(state.lastResult).concat(" log base 10"),
          displayCur: "",
          lastInput: "10",
          lastInputType: "digit",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: false,
          lastResult: "",
          lastOperator: " log base ",
        }),
        () => {
          console.log("inside handle log10 after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handleLogE() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")") {
      console.log("inside handle log10: displayOps", this.state.displayOps);
      this.setState(
        (state) => ({
          displayOps: state.lastResult === "" ? state.displayOps.concat(` log base ${Math.E}`) : "".concat(state.lastResult).concat(` log base ${Math.E}`),
          displayCur: "",
          lastInput: `${Math.E}`,
          lastInputType: "digit",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: false,
          lastResult: "",
          lastOperator: " log base ",
        }),
        () => {
          console.log("inside handle log10 after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handleFactorial() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")" || (this.state.lastInput === "%" && !this.state.displayOps.match(/!%/))) {
      let factor = factorial(this.state.displayCur).toString();
      console.log("factorial", factor);

      this.setState(
        (state) => ({
          displayOps: factor === "invalid input" ? "invalid input" : state.lastResult === "" ? state.displayOps.concat("!") : "".concat(state.lastResult).concat("!"),
          displayCur: factor,
          lastInput: "!",
          lastInputType: "!",
          twoConsecutiveOperators: false,
          lastResult: factor === "invalid input" ? "invalid input" : "",
          lastOperator: " ! ",
        }),
        () => {
          console.log("inside handle factorial after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handleTrigonometry(e) {
    console.log("inside trigonometry", isFinite(this.state.displayCur));
    if ((this.state.displayOps !== "" && isFinite(this.state.displayCur)) || this.state.lastInput === ")") {
      let result = trigonometryInDegrees(this.state.displayCur, e.target.value, this.state);
      console.log("trigonometry", result);
      // deleteRedundantDigits(this.state);
      this.setState(
        (state) => ({
          displayOps: state.lastResult === "" ? finalDisplayOps : "".concat(result),
          displayOps: finalDisplayOps,
          displayCur: result,
          lastInput: ")",
          lastInputType: "parenthesis",
          twoConsecutiveOperators: false,
          lastOperator: "trigonometry",
          lastResult: "",
        }),
        () => {
          console.log("inside trigonometry after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handlePercentage() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")" || (this.state.lastInput === "!" && !this.state.displayOps.match(/%!/))) {
      this.setState(
        (state) => ({
          displayOps: state.lastResult === "" ? state.displayOps.concat("%") : "".concat(state.lastResult).concat("%"),
          displayCur: state.lastInputType === "digit" ? state.displayCur / 100 : "%",
          lastInput: "%",
          lastInputType: "%",
          twoConsecutiveOperators: false,
          lastResult: "",
          lastOperator: " % ",
        }),
        () => {
          console.log("inside handle log10 after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handleChangeSign() {
    if (this.state.lastResult === "") {
      if (this.state.lastOperator !== " log base ") {
        let result = changeSign(this.state);

        this.setState((state) => ({
          displayOps: state.lastResult === "" ? result : "".concat(state.displayCur * -1),
          displayCur: state.displayCur.toString(),
          lastResult: "",
        }));
      }
    } else {
      this.setState(
        (state) => ({
          displayOps: "".concat(state.lastResult),
          lastResult: "",
        }),
        () => this.handleChangeSign()
      );
    }
  }

  handleAbs() {
    let result = abs(this.state);

    this.setState(
      (state) => ({
        displayOps: result,
        displayCur: /\d/.test(state.displayCur) ? Math.abs(state.displayCur) : "",
        lastInput: /\d/.test(state.displayCur) ? state.displayCur[state.displayCur.length - 1] : ")",
        lastInputType: /\d/.test(state.displayCur) ? "digit" : "parenthesis",
        twoConsecutiveOperators: false,
        lastOperator: "abs",
        lastResult: "",
      }),
      () => {
        console.log("inside abs after setState:  displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleSwitchToDenominator() {
    let result = switchToDenominator(this.state);

    this.setState(
      (state) => ({
        displayOps: result,
        displayCur: /\d/.test(state.displayCur) ? 1 / state.displayCur : "",
        lastInput: /\d/.test(state.displayCur) ? 1 / state.displayCur : ")",
        lastInputType: /\d/.test(state.displayCur) ? "digit" : "parenthesis",
        twoConsecutiveOperators: false,
        lastOperator: "denominator",
        lastResult: "",
      }),
      () => {
        console.log("inside denominator after setState:  displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleModulo(e) {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")" || this.state.lastInput === "!" || this.state.lastInput === "%") {
      this.setState(
        (state) => ({
          displayOps: state.lastResult === "" ? (state.lastInput === ")" ? state.displayOps.concat(e.target.value) : state.displayOps.concat(e.target.value)) : "".concat(state.lastResult).concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastInputType: "operator",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: false,
          lastResult: "",
          lastOperator: " mod ",
        }),
        () => {
          console.log("inside modulo after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handleLeftParenthesis(e) {
    if (this.state.lastInputType !== "digit" && this.state.lastInput !== ")") {
      this.setState(
        (state) => ({
          displayOps: state.lastResult === "" ? state.displayOps.concat(e.target.value) : "".concat(e.target.value),
          displayCur: e.target.value,
          lastInput: "(",
          lastInputType: "parenthesis",
          parenthesesDelta: state.parenthesesDelta + 1,
          twoConsecutiveOperators: false,
          lastOperator: "(",
        }),
        () => {
          console.log("inside leftParenthesis after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }
  handleRightParenthesis(e) {
    console.log("this.state.parthersesDelta", this.state.parenthesesDelta);
    if (this.state.parenthesesDelta > 0) {
      if (this.state.lastInputType === "digit" || this.state.lastInput === "!" || this.state.lastInput === "%" || this.state.lastInput === ")") {
        this.setState(
          (state) => ({
            displayOps: state.lastInput === ")" ? state.displayOps.concat(e.target.value) : state.lastResult === "" ? state.displayOps.concat(e.target.value) : "".concat(e.target.value),
            displayCur: e.target.value,
            lastInput: ")",
            lastInputType: "parenthesis",
            parenthesesDelta: state.parenthesesDelta - 1,
            twoConsecutiveOperators: false,
            lastOperator: ")",
          }),
          () => {
            console.log("inside rightParenthesis after setState:  displayOps", this.state.displayOps);
            saveState(this.state);
          }
        );
      }
    }
  }

  handleEquals() {
    if (this.state.lastResult === "") {
      console.log("check parenthesis after adding missing", this.state.displayOps);

      deleteRedundantOperators(this.state);
      let result = calculate(displayOpsExpression);
      // let result = calculate("3 * (25 - 21) + 8");
      this.setState(
        {
          displayOps: displayOpsExpression.concat(" = ").concat(result),
          displayCur: result,
          lastInput: "",
          lastInputType: "digit",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: false,
          lastResult: result,
          parenthesesDelta: 0,
          lastOperator: "equal",
        },
        () => {
          saveState(this.state);
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
        <Display ops={this.state.displayOps} cur={this.state.displayCur} />
        <Buttons
          clear={this.handleClear}
          operator={this.handleOperator}
          digit={this.handleDigit}
          equals={this.handleEquals}
          decimal={this.handleDecimal}
          exponentiation={this.handleExponentiation}
          root={this.handleRoot}
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
          <div id="displayOps">{this.props.ops}</div>
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
        <button id="clear" onClick={this.props.clear}>
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
