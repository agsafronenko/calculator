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
      lastOperator: "",
      decimalAlreadyUsed: false,
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
      lastOperator: "",
      decimalAlreadyUsed: false,
    });
  }

  handleOperator(e) {
    if (this.state.lastInput !== e.target.value) {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.concat(e.target.value),
          result: state.lastOperator === "-" ? state.result.concat(-Number(state.displayCur)).concat(e.target.value === "-" ? "+" : e.target.value) : state.result.concat(Number(state.displayCur)).concat(e.target.value === "-" ? "+" : e.target.value),
          displayCur: e.target.value,
          lastInput: e.target.value,
          lastOperator: e.target.value,
          decimalAlreadyUsed: false,
        }),
        () => {
          console.log("Inside handleOperator: this.state.result", this.state.result);
        }
      );
    }
  }

  handleDigit(e) {
    // console.log("handleDigit", Number(this.state.displayCur), this.state.displayCur.length);
    this.setState((state) => ({
      displayOps: Number(state.displayOps.slice(-1)) === 0 && state.displayCur.length === 1 ? state.displayOps.slice(0, state.displayOps.length - 1).concat(e.target.value) : state.displayOps.concat(e.target.value),
      displayCur: (Number(state.displayCur) === 0 && state.displayCur.length === 1) || (!isFinite(state.lastInput) && state.lastInput !== ".") ? e.target.value : state.displayCur.concat(e.target.value),
      lastInput: e.target.value,
    }));
  }

  handleDecimal() {
    if (this.state.decimalAlreadyUsed === false) {
      this.setState((state) => ({
        displayOps: isFinite(state.lastInput) ? state.displayOps.concat(".") : state.displayOps.concat("0."),
        displayCur: isFinite(state.lastInput) ? state.displayCur.concat(".") : state.displayCur.concat("0."),
        lastInput: ".",
        decimalAlreadyUsed: true,
      }));
    }
  }

  handleEquals() {
    this.setState(
      (state) => ({
        result: state.lastOperator === "-" ? state.result.concat(-Number(state.displayCur)) : state.result.concat(Number(state.displayCur)),
        decimalAlreadyUsed: false,
      }),
      () => {
        let result = calculate(this.state.result);
        this.setState((state) => ({
          displayOps: state.displayOps.concat("=").concat(result),
          displayCur: result,
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
