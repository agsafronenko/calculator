import React from "react";
import "./styles/styles.css";
import $ from "jquery";
import calculate from "./functions";

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayOps: "",
      result: [],
      displayCur: "0",
      lastInput: "",
      lastInputType: "",
      lastOperator: "",
      decimalAlreadyUsed: false,
      twoConsecutiveOperators: false,
      lastResult: "",
    };
    this.handleClear = this.handleClear.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleDigit = this.handleDigit.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
  }

  handleClear() {
    this.setState({
      displayOps: "",
      result: [],
      displayCur: "0",
      lastInput: "",
      lastInputType: "",
      lastOperator: "",
      decimalAlreadyUsed: false,
      twoConsecutiveOperators: false,
      lastResult: "",
    });
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
          lastOperator: e.target.value,
          twoConsecutiveOperators: e.target.value === "-" ? true : false,
        }),
        () => {
          console.log("1st IF Inside handleOperator: this.state.result", this.state.result);
        }
      );
    } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value !== "-") {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.slice(0, state.displayOps.length - 1).concat(e.target.value),
          result: state.result.slice(0, state.result.length - 1).concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastOperator: e.target.value,
          twoConsecutiveOperators: false,
        }),

        () => {
          console.log("2nd IF Inside handleOperator: this.state.result", this.state.result);
        }
      );
    } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value === "-") {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.concat(e.target.value),
          result: state.result.concat(e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastOperator: e.target.value,
          twoConsecutiveOperators: true,
        }),

        () => {
          console.log("2.5nd IF Inside handleOperator: this.state.result", this.state.result);
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
            lastOperator: e.target.value,
            twoConsecutiveOperators: false,
            decimalAlreadyUsed: false,
          }),
          () => {
            console.log("3rd IF Inside handleOperator: this.state.result", this.state.result);
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
            lastOperator: e.target.value,
            twoConsecutiveOperators: false,
            decimalAlreadyUsed: false,
            lastResult: "",
          }),
          () => {
            console.log("3rd IF Inside handleOperator: this.state.result", this.state.result);
          }
        );
      }
    }
  }

  handleDigit(e) {
    // console.log("handleDigit", Number(this.state.displayCur), this.state.displayCur.length);
    if (this.state.lastResult !== "") this.handleClear();
    this.setState((state) => ({
      displayOps: Number(state.displayOps.slice(-1)) === 0 && state.displayCur.length === 1 ? state.displayOps.slice(0, state.displayOps.length - 1).concat(e.target.value) : state.displayOps.concat(e.target.value),
      displayCur: (Number(state.displayCur) === 0 && state.displayCur.length === 1) || (!isFinite(state.lastInput) && state.lastInput !== ".") ? e.target.value : state.displayCur.concat(e.target.value),
      lastInput: e.target.value,
      lastInputType: "digit",
      twoConsecutiveOperators: false,
    }));
  }

  handleDecimal() {
    if (this.state.decimalAlreadyUsed === false) {
      this.setState((state) => ({
        displayOps: isFinite(state.lastInput) && state.displayOps.length !== 0 ? state.displayOps.concat(".") : state.displayOps.concat("0."),
        displayCur: isFinite(state.lastInput) ? state.displayCur.concat(".") : "0.",
        lastInput: ".",
        lastInputType: "decimal",
        decimalAlreadyUsed: true,
        twoConsecutiveOperators: false,
      }));
    }
  }

  handleEquals() {
    this.setState(
      (state) => ({
        result: state.result.concat(Number(state.displayCur)),
        decimalAlreadyUsed: false,
        twoConsecutiveOperators: false,
      }),
      () => {
        let result = calculate(this.state.result);
        this.setState((state) => ({
          displayOps: state.displayOps.concat("=").concat(result),
          displayCur: result,
          lastResult: result,
        }));
        console.log("Inside handleEquals: final result", result);
      }
    );
  }

  render() {
    return (
      <>
        <Display ops={this.state.displayOps} cur={this.state.displayCur} />
        <Buttons clear={this.handleClear} operator={this.handleOperator} digit={this.handleDigit} equals={this.handleEquals} decimal={this.handleDecimal} />
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
      </>
    );
  }
}

function Footer() {
  return (
    <footer>
      <div id="footer">This project was build using: HTML, CSS, JavaScript, React, Redux, jQuery, Bootstrap and SASS</div>
    </footer>
  );
}
