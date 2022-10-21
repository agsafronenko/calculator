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
      displayCur: "",
      lastInput: "",
      lastOperator: "",
    };
    this.handleClear = this.handleClear.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleDigit = this.handleDigit.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
  }

  handleClear() {
    this.setState({
      displayOps: "",
      result: [],
      displayCur: 0,
      lastInput: "",
      lastOperator: "",
    });
  }

  handleOperator(e) {
    if (this.state.lastInput !== e.target.value) {
      this.setState(
        (state) => ({
          displayOps: state.displayOps.concat(e.target.value),
          result: state.lastOperator === "-" ? state.result.concat(-Number(state.displayCur)).concat(e.target.value === "-" ? "+" : e.target.value) : state.result.concat(Number(state.displayCur)).concat(e.target.value === "-" ? "+" : e.target.value),
          displayCur: "",
          lastInput: e.target.value,
          lastOperator: e.target.value,
        }),
        () => {
          console.log("res", this.state.result, "curOper", e.target.value);
        }
      );
    }
  }

  handleDigit(e) {
    // console.log("e.target.value", e.target.value);
    this.setState((state) => ({
      displayOps: state.displayOps.concat(e.target.value),
      displayCur: state.displayCur === 0 ? e.target.value : state.displayCur.concat(e.target.value),
      lastInput: e.target.value,
    }));
  }

  handleEquals() {
    this.setState(
      (state) => ({
        result: state.lastOperator === "-" ? state.result.concat(-Number(state.displayCur)) : state.result.concat(Number(state.displayCur)),
      }),
      () => {
        let result = calculate(this.state.result);
        this.setState((state) => ({
          displayOps: state.displayOps.concat("=").concat(result),
          displayCur: result,
        }));
        console.log("result inside handleEquals", result);
      }
    );
  }

  render() {
    return (
      <>
        <Display ops={this.state.displayOps} cur={this.state.displayCur} />
        <Buttons clear={this.handleClear} operator={this.handleOperator} digit={this.handleDigit} equals={this.handleEquals} />
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
        <div id="display">
          <div id="displayRes">{this.props.ops}</div>
          <div id="displayOps">{this.props.cur}</div>
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
        <button id="multiply" value="x" onClick={this.props.operator}>
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
        <button id="divide">/</button>
        <button id="zero" value="0" onClick={this.props.digit}>
          0
        </button>
        <button id="decimal">.</button>
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
