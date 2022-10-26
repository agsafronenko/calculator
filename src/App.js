import React from "react";
import "./styles/styles.css";
import $ from "jquery";
import calculate from "./functions";
import { deleteRedundantOperators, displayOpsExpression, resultExpression, saveState } from "./functions";

let stateStorage = [];

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayOps: "",
      result: [],
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
  }

  handleClear() {
    stateStorage = [];
    this.setState({
      displayOps: "",
      result: [],
      displayCur: "0",
      lastInput: "",
      lastInputType: "",
      decimalAlreadyUsed: false,
      twoConsecutiveOperators: false,
      lastResult: "",
    });
  }

  handlePreviousState() {
    if (stateStorage.length !== 1) {
      stateStorage.shift();
      this.setState({
        displayOps: stateStorage[0].displayOps,
        result: stateStorage[0].result,
        displayCur: stateStorage[0].displayCur,
        lastInput: stateStorage[0].lastInput,
        lastInputType: stateStorage[0].lastInputType,
        decimalAlreadyUsed: stateStorage[0].decimalAlreadyUsed,
        twoConsecutiveOperators: stateStorage[0].twoConsecutiveOperators,
        lastResult: stateStorage[0].lastResult,
      });
    }
  }

  handleOperator(e) {
    if (this.state.twoConsecutiveOperators === true) {
      this.setState(
        (state) => ({
          displayOps: e.target.value === "-" ? state.displayOps : state.displayOps.slice(0, state.displayOps.length - 2).concat(e.target.value),
          result: e.target.value === "-" ? state.result : state.result.slice(0, state.result.length - 2).concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastInputType: "operator",
          twoConsecutiveOperators: e.target.value === "-" ? true : false,
        }),
        () => {
          console.log("1st IF Inside handleOperator: this.state.result", this.state.result);
          if (e.target.value !== "-") saveState(this.state, stateStorage);
        }
      );
    } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value !== "-") {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.slice(0, state.displayOps.length - 1).concat(e.target.value),
          result: state.result.slice(0, state.result.length - 1).concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          twoConsecutiveOperators: false,
        }),

        () => {
          console.log("2nd IF Inside handleOperator: this.state.result", this.state.result);
          saveState(this.state, stateStorage);
        }
      );
    } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value === "-") {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.concat(e.target.value),
          result: state.result.concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          twoConsecutiveOperators: true,
        }),

        () => {
          console.log("2.5nd IF Inside handleOperator: this.state.result", this.state.result);
          saveState(this.state, stateStorage);
        }
      );
    }

    if (this.state.lastInputType !== "operator") {
      if (this.state.lastResult === "") {
        this.setState(
          (state) => ({
            displayOps: state.displayOps.concat(e.target.value),
            result: state.result.concat(Number(state.displayCur)).concat(e.target.value),
            displayCur: e.target.value,
            lastInput: e.target.value,
            lastInputType: "operator",
            twoConsecutiveOperators: false,
            decimalAlreadyUsed: false,
          }),
          () => {
            console.log("3rd IF Inside handleOperator: this.state.result", this.state.result);
            saveState(this.state, stateStorage);
          }
        );
      } else {
        this.setState(
          (state) => ({
            displayOps: "".concat(state.lastResult).concat(e.target.value),
            result: [].concat(state.lastResult).concat(e.target.value),
            displayCur: e.target.value,
            lastInput: e.target.value,
            lastInputType: "operator",
            twoConsecutiveOperators: false,
            decimalAlreadyUsed: false,
            lastResult: "",
          }),
          () => {
            console.log("3rd IF Inside handleOperator: this.state.result", this.state.result);
            saveState(this.state, stateStorage);
          }
        );
      }
    }
  }

  handleDigit(e) {
    if (this.state.lastResult !== "") this.handleClear();
    this.setState(
      (state) => ({
        displayOps: Number(state.displayOps.slice(-1)) === 0 && state.displayCur.length === 1 ? state.displayOps.slice(0, state.displayOps.length - 1).concat(e.target.value) : state.displayOps.concat(e.target.value),
        displayCur: (Number(state.displayCur) === 0 && state.displayCur.length === 1) || (!isFinite(state.lastInput) && state.lastInput !== ".") ? e.target.value : state.displayCur.concat(e.target.value),
        lastInput: e.target.value,
        lastInputType: "digit",
        twoConsecutiveOperators: false,
      }),
      () => {
        saveState(this.state, stateStorage);
      }
    );
  }

  handleDecimal() {
    if (this.state.decimalAlreadyUsed === false) {
      this.setState(
        (state) => ({
          displayOps: isFinite(state.lastInput) && state.displayOps.length !== 0 ? state.displayOps.concat(".") : state.displayOps.concat("0."),
          displayCur: isFinite(state.lastInput) ? state.displayCur.concat(".") : "0.",
          lastInput: ".",
          lastInputType: "decimal",
          decimalAlreadyUsed: true,
          twoConsecutiveOperators: false,
        }),
        () => {
          saveState(this.state, stateStorage);
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
    deleteRedundantOperators(this.state);

    this.setState(
      {
        displayOps: displayOpsExpression.concat(e.target.value),
        result: resultExpression.concat(e.target.value),
        displayCur: e.target.value,
        lastInput: e.target.value,
        lastInputType: "operator",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
      },
      () => {
        console.log("after displayOps", this.state.displayOps, "after Result", this.state.result);
        saveState(this.state, stateStorage);
      }
    );
  }

  handleRoot(e) {
    deleteRedundantOperators(this.state);

    this.setState(
      {
        displayOps: displayOpsExpression.concat(e.target.value),
        result: resultExpression.concat(e.target.value),
        displayCur: e.target.value,
        lastInput: e.target.value,
        lastInputType: "operator",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: "",
      },
      () => {
        console.log("after displayOps", this.state.displayOps, "after Result", this.state.result);
        saveState(this.state, stateStorage);
      }
    );
  }

  handleEquals() {
    deleteRedundantOperators(this.state);

    let result = calculate(resultExpression);

    this.setState(
      {
        displayOps: displayOpsExpression.concat("=").concat(result),
        displayCur: result,
        result: [],
        lastInput: "",
        lastInputType: "",
        twoConsecutiveOperators: false,
        decimalAlreadyUsed: false,
        lastResult: result,
      },
      () => {
        saveState(this.state, stateStorage);
      }
    );
    console.log("Inside handleEquals: final result", result);
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
        <button id="add" value="+" onClick={this.props.operator}>
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
        <button id="subtract" value="-" onClick={this.props.operator}>
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
        <button id="multiply" value="*" onClick={this.props.operator}>
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
        <button id="divide" value="/" onClick={this.props.operator}>
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
        <button id="exponentiation" value="^" onClick={this.props.exponentiation}>
          ^
        </button>
        <button id="anyRoot" value="r" onClick={this.props.root}>
          root
        </button>
        <button id="pi" value={Math.PI} onClick={this.props.digit}>
          Pi
        </button>
        <button id="e" value={Math.E} onClick={this.props.digit}>
          e
        </button>
        <button id="delete" onClick={this.props.previousState}>
          del
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
