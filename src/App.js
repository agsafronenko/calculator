import React from "react";
import "./styles/styles.css";
import $ from "jquery";
import calculate, { deleteRedundantOperators, displayOpsExpression, saveState, stateStorage, factorial, trigonometryInDegrees } from "./functions";

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
    this.handleLeftBraces = this.handleLeftBraces.bind(this);
    this.handleRightBraces = this.handleRightBraces.bind(this);
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
    });
  }

  handlePreviousState() {
    if (stateStorage.prevState.length !== 1) {
      stateStorage.prevState.shift();
      this.setState({
        displayOps: stateStorage.prevState[0].displayOps,
        displayCur: stateStorage.prevState[0].displayCur,
        lastInput: stateStorage.prevState[0].lastInput,
        lastInputType: stateStorage.prevState[0].lastInputType,
        decimalAlreadyUsed: stateStorage.prevState[0].decimalAlreadyUsed,
        twoConsecutiveOperators: stateStorage.prevState[0].twoConsecutiveOperators,
        lastResult: stateStorage.prevState[0].lastResult,
      });
    }
  }

  handleOperator(e) {
    if (this.state.twoConsecutiveOperators === true) {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.slice(0, state.displayOps.length - 6).concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastInputType: "operator",
          twoConsecutiveOperators: false,
        }),
        () => {
          console.log("1st IF Inside handleOperator: this.state.displayOps", this.state.displayOps);
          if (e.target.value !== " - ") saveState(this.state);
        }
      );
    } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value !== " - ") {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.slice(0, state.displayOps.length - 3).concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          twoConsecutiveOperators: false,
        }),

        () => {
          console.log("2nd IF Inside handleOperator: this.state.displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value === " - ") {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          twoConsecutiveOperators: true,
        }),

        () => {
          console.log("2.5nd IF Inside handleOperator: this.state.displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }

    if (this.state.lastInputType === "braces") {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastInputType: "operator",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: false,
          lastResult: "",
        }),
        () => {
          console.log("2.9th braces IF Inside handleOperator: this.state.displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }

    if (this.state.lastInput !== ")" && this.state.lastInputType !== "operator") {
      this.setState(
        (state) => ({
          displayOps: state.lastResult === "" ? state.displayOps.concat(Number(state.displayCur)).concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastInputType: "operator",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: false,
          lastResult: "",
        }),
        () => {
          console.log("3rd IF Inside handleOperator: this.state.displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handleDigit(e) {
    console.log("lastInout", this.state.lastInput, "!isFinite(state.lastInput) && state.lastInput !== ", !isFinite(this.state.lastInput));
    if (this.state.lastResult !== "") this.handleClear();
    this.setState(
      (state) => ({
        // displayOps: Number(state.displayOps.slice(-1)) === 0 && state.displayCur.length === 1 ? state.displayOps.slice(0, state.displayOps.length - 1).concat(e.target.value) : state.displayOps.concat(e.target.value),
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

  handleSpecialDigit(e) {
    if (this.state.lastResult !== "") this.handleClear();

    // deleteRedundantDigits(this.state);

    this.setState(
      {
        // displayOps: displayOpsExpression.concat(e.target.value),
        displayCur: e.target.value,
        lastInput: e.target.value,
        lastInputType: "digit",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: true,
      },
      () => {
        saveState(this.state);
      }
    );
  }

  handleDecimal() {
    if (this.state.decimalAlreadyUsed === false) {
      this.setState(
        (state) => ({
          // displayOps: state.lastResult === "" ? (isFinite(state.lastInput) && state.displayOps.length !== 0 ? state.displayOps.concat(".") : state.displayOps.concat("0.")) : state.lastResult.toString().concat("."),
          displayCur: state.lastResult === "" ? (isFinite(state.lastInput) ? state.displayCur.concat(".") : "0.") : /\./.test(state.lastResult) ? "".concat("0.") : state.lastResult.toString().concat("."),
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
    setTimeout(() => document.getElementById("two").click(), 50);
  }

  handleSquareRoot() {
    document.getElementById("anyRoot").click();
    setTimeout(() => document.getElementById("two").click(), 50);
  }

  handleExponentiation(e) {
    //   deleteRedundantOperators(this.state);
    this.setState(
      (state) => ({
        displayOps: state.lastResult === "" ? state.displayOps.concat(Number(state.displayCur)).concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
        displayCur: e.target.value,
        lastInput: e.target.value,
        lastInputType: "operator",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
      }),
      () => {
        console.log("inside handle ^ after setState:  displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleRoot(e) {
    // deleteRedundantOperators(this.state);

    this.setState(
      (state) => ({
        displayOps: state.lastResult === "" ? state.displayOps.concat(Number(state.displayCur)).concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
        displayCur: e.target.value,
        lastInput: e.target.value,
        lastInputType: "operator",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
      }),
      () => {
        console.log("after displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleLog(e) {
    // deleteRedundantOperators(this.state);
    console.log("inside handle log10: displayOps", this.state.displayOps);
    this.setState(
      (state) => ({
        displayOps: state.lastResult === "" ? state.displayOps.concat(Number(state.displayCur)).concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
        displayCur: e.target.value,
        lastInput: e.target.value,
        lastInputType: "operator",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
      }),
      () => {
        console.log("inside handle log10 after setState:  displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleLog10() {
    document.getElementById("log").click();
    setTimeout(() => document.getElementById("one").click(), 50);
    setTimeout(() => document.getElementById("zero").click(), 70);
  }

  handleLogE() {
    document.getElementById("log").click();
    setTimeout(() => document.getElementById("e").click(), 50);
  }

  handleFactorial() {
    if (Number.isInteger(Number(this.state.displayCur))) {
      let factor = factorial(this.state.displayCur).toString();
      console.log("factorial", factor);
      // deleteRedundantDigits(this.state);
      this.setState(
        (state) => ({
          // displayOps: state.lastResult === "" ? displayOpsExpression.concat(factor) : "".concat(factor),
          displayCur: factor,
          lastInput: factor,
          lastInputType: "digit",
          twoConsecutiveOperators: false,
          // lastResult: "",
        }),
        () => {
          console.log("inside handle log10 after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handleTrigonometry(e) {
    if (typeof Number(this.state.displayCur) === "number") {
      let result = trigonometryInDegrees(this.state.displayCur, e.target.value);
      console.log("triginometry", result);
      // deleteRedundantDigits(this.state);
      this.setState(
        (state) => ({
          // displayOps: state.lastResult === "" ? displayOpsExpression.concat(result) : "".concat(result),
          displayCur: result,
          lastInput: result,
          lastInputType: "digit",
          twoConsecutiveOperators: false,
          // lastResult: "",
        }),
        () => {
          console.log("inside trigonometry after setState:  displayOps", this.state.displayOps);
          saveState(this.state);
        }
      );
    }
  }

  handlePercentage() {
    document.getElementById("divide").click();
    setTimeout(() => document.getElementById("one").click(), 20);
    setTimeout(() => document.getElementById("zero").click(), 40);
    setTimeout(() => document.getElementById("zero").click(), 60);
  }

  handleChangeSign() {
    this.setState((state) => ({
      displayCur: state.displayCur * -1,
    }));
  }

  handleAbs() {
    this.setState((state) => ({
      displayCur: Math.abs(state.displayCur),
    }));
  }

  handleSwitchToDenominator() {
    this.setState((state) => ({
      displayCur: 1 / state.displayCur,
    }));
  }

  handleModulo(e) {
    this.setState(
      (state) => ({
        displayOps: state.lastResult === "" ? state.displayOps.concat(Number(state.displayCur)).concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
        displayCur: e.target.value,
        lastInput: e.target.value,
        lastInputType: "operator",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
      }),
      () => {
        console.log("inside modulo after setState:  displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleLeftBraces(e) {
    this.setState(
      (state) => ({
        displayOps: state.lastResult === "" ? state.displayOps.concat(e.target.value) : "".concat(e.target.value),
        displayCur: e.target.value,
        lastInput: "(",
        lastInputType: "braces",
      }),
      () => {
        console.log("inside leftBrace after setState:  displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }
  handleRightBraces(e) {
    this.setState(
      (state) => ({
        displayOps: state.lastInput === ")" ? state.displayOps.concat(e.target.value) : state.lastResult === "" ? state.displayOps.concat(Number(state.displayCur)).concat(e.target.value) : "".concat(e.target.value),
        displayCur: e.target.value,
        lastInput: ")",
        lastInputType: "braces",
      }),
      () => {
        console.log("inside rightBrace after setState:  displayOps", this.state.displayOps);
        saveState(this.state);
      }
    );
  }

  handleEquals() {
    if (this.state.lastResult === "") {
      deleteRedundantOperators(this.state);

      let result = calculate(this.state.displayOps.concat(this.state.displayCur));

      this.setState(
        {
          displayOps: displayOpsExpression.concat(" = ").concat(result),
          displayCur: result,
          lastInput: "",
          lastInputType: "",
          twoConsecutiveOperators: false,
          decimalAlreadyUsed: false,
          lastResult: result,
        },
        () => {
          saveState(this.state);
        }
      );
      console.log("Inside handleEquals: final result", result);
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
          leftBraces={this.handleLeftBraces}
          rightBraces={this.handleRightBraces}
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
        <button id="cos" value="cos" onClick={this.props.trigonometry}>
          cos
        </button>
        <button id="sin" value="sin" onClick={this.props.trigonometry}>
          sin
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
        <button id="leftBraces" value="(" onClick={this.props.leftBraces}>
          (
        </button>
        <button id="rightBraces" value=")" onClick={this.props.rightBraces}>
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
