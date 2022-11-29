import React from "react";
import "./styles/styles.css";
import $ from "jquery";
import { abs } from "./functions/abs";
import { saveState, stateStorage } from "./functions/previousState";
import { trigonometryInDegrees } from "./functions/trigonometry";
import { changeSign } from "./functions/changeSign";
import { switchToDenominator } from "./functions/switchToDenominator";
import calculate, { lastLegitSymbol } from "./functions/equals";
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
      memorySlot1: "Memory Slot 1",
      memorySlot2: "Memory Slot 2",
      memorySlot3: "Memory Slot 3",
    };

    //
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
    this.handleCopyToMS = this.handleCopyToMS.bind(this);
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
    alertStatus.negativeFactor = false;
    alertStatus.nonIntegerFactor = false;
    alertStatus.negativeLog = false;
    alertStatus.zeroAsDenominator = false;
  }

  handlePreviousState() {
    $("button").css("pointerEvents", "auto");
    $("button").css("opacity", "1");
    if (stateStorage.prevState.length <= 1) {
      this.handleClear(true);
    } else {
      stateStorage.prevState.shift();
      this.setState(
        {
          displayAll: stateStorage.prevState[0].displayAll,
          displayCur: stateStorage.prevState[0].displayCur,
          lastInput: stateStorage.prevState[0].lastInput,
          lastInputType: stateStorage.prevState[0].lastInputType,
          decimalAlreadyUsed: stateStorage.prevState[0].decimalAlreadyUsed,
          twoConsecutiveOperators: stateStorage.prevState[0].twoConsecutiveOperators,
          lastResult: stateStorage.prevState[0].lastResult,
          parenthesesDelta: stateStorage.prevState[0].parenthesesDelta,
          lastOperator: stateStorage.prevState[0].lastOperator,
        },
        () => {
          alertStatus.negativeFactor = false;
          if (/\d+\.\d+!/.test(this.state.displayAll) === false) {
            alertStatus.nonIntegerFactor = false;
          }
        }
      );
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
              lastInput: e.target.value,
              lastInputType: "operator",
              twoConsecutiveOperators: false,
              lastOperator: e.target.value,
            }),
            () => {
              if (e.target.value === " - " || e.target.value !== penultimateInput) saveState(this.state);
            }
          );
        } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value !== " - ") {
          if (this.state.displayAll.slice(this.state.displayAll.length - 4) !== "( - ") {
            this.setState(
              (state) => ({
                displayAll: state.displayAll.slice(0, state.displayAll.length - lastLegitSymbol(state.displayAll)).concat(e.target.value),
                lastInput: e.target.value,
                lastInputType: "operator",
                twoConsecutiveOperators: false,
                lastOperator: e.target.value,
              }),
              () => {
                if (e.target.value !== penultimateInput) saveState(this.state);
              }
            );
          }
        } else if (this.state.twoConsecutiveOperators === false && this.state.lastInput === " log base " && e.target.value === " - ") {
        } else if (this.state.twoConsecutiveOperators === false && this.state.lastInputType === "operator" && e.target.value === " - " && this.state.displayAll.slice(this.state.displayAll.length - 4) !== "( - ") {
          this.setState(
            (state) => ({
              displayAll: state.displayAll.concat(e.target.value),
              lastInput: e.target.value,
              lastInputType: "operator",
              twoConsecutiveOperators: true,
              lastOperator: e.target.value,
            }),
            () => {
              saveState(this.state);
            }
          );
        }
        // handle input of the first operator
        if (this.state.lastInput === "(") {
          this.setState(
            (state) => ({
              displayAll: e.target.value === " - " ? state.displayAll.concat(e.target.value) : state.displayAll,
              lastInput: e.target.value === " - " ? e.target.value : state.lastInput,
              lastInputType: e.target.value === " - " ? "operator" : state.lastInputType,
              lastOperator: e.target.value === " - " ? e.target.value : state.lastOperator,
            }),
            () => {
              if (e.target.value === " - ") saveState(this.state);
            }
          );
        } else if (this.state.lastInput === ")") {
          this.setState(
            (state) => ({
              displayAll: state.displayAll.concat(e.target.value),
              lastInput: e.target.value,
              lastInputType: "operator",
              lastOperator: e.target.value,
            }),
            () => {
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
              console.log("sasa");
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
          displayCur: (Number(state.displayCur) === 0 && state.displayCur.toString().length === 1) || (!isFinite(state.lastInput) && state.lastInput !== ".") ? e.target.value : state.displayCur.concat(e.target.value),
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
    if (isFinite(e.target.value)) {
      if (this.state.lastResult !== "") this.handleClear(false);
      if (this.state.lastInput !== ")" && this.state.lastInput !== "!" && this.state.lastInput !== "%" && this.state.displayCur !== "0" && this.state.decimalAlreadyUsed !== true) {
        if (Number(e.target.value) < 0) {
          document.getElementById("subtract").click();
          let val = {
            target: {
              value: Math.abs(Number(e.target.value)),
            },
          };
          setTimeout(() => {
            this.handleSpecialDigit(val);
          }, 0);
        } else {
          this.setState(
            (state) => ({
              displayAll: Number(state.displayAll) === 0 ? e.target.value : state.displayAll.concat(e.target.value),
              displayCur: state.lastInput === " - " ? -e.target.value : e.target.value,
              lastInput: e.target.value[e.target.value.length - 1],
              lastInputType: "digit",
              decimalAlreadyUsed: /\./.test(e.target.value),
              twoConsecutiveOperators: false,
            }),
            () => {
              console.log("sasasa");
              saveState(this.state);
            }
          );
        }
      }
    }
  }

  handleDecimal() {
    if ((this.state.lastInputType === "digit" || this.state.lastInputType === "operator" || this.state.lastInput === "" || this.state.lastInput === "(") && this.state.decimalAlreadyUsed === false) {
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? state.displayAll.concat(isFinite(state.lastInput) && this.state.displayAll !== "" ? "." : "0.") : /\./.test(state.lastResult) ? "".concat("0.") : "".concat(state.lastResult).concat("."),
          displayCur: state.lastResult === "" ? (isFinite(state.lastInput) ? state.displayCur.concat(".") : "0.") : /\./.test(state.lastResult) ? "".concat("0.") : "".concat(state.lastResult).concat("."),
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

  handleLog(e) {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")") {
      this.setState(
        (state) => ({
          displayAll: state.lastResult === "" ? state.displayAll.concat(e.target.value) : "".concat(state.lastResult).concat(e.target.value),
          lastInput: e.target.value,
          lastInputType: "operator",
          decimalAlreadyUsed: false,
          twoConsecutiveOperators: false,
          lastResult: "",
          lastOperator: e.target.value,
        }),
        () => {
          this.setState((state) => ({
            displayCur: calculate(state, state.displayAll),
          }));
          saveState(this.state);
        }
      );
    }
  }

  handleLog10() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")") {
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
          saveState(this.state);
        }
      );
    }
  }

  handleLogE() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")") {
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
          saveState(this.state);
        }
      );
    }
  }

  handleFactorial() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")" || (this.state.lastInput === "%" && !this.state.displayAll.match(/!%$/))) {
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
          saveState(this.state);
        }
      );
    }
  }

  handleTrigonometry(e) {
    if (this.state.lastInputType === "digit" || this.state.lastInput === "!" || this.state.lastInput === "%" || this.state.lastInput === ")" || this.state.lastInput === ".") {
      let result = trigonometryInDegrees(e.target.value, this.state);
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
          saveState(this.state);
        }
      );
    }
  }

  handlePercentage() {
    if (this.state.lastInputType === "digit" || this.state.lastInput === ")" || (this.state.lastInput === "!" && !this.state.displayAll.match(/%!$/))) {
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
          saveState(this.state);
        }
      );
    }
  }

  handleChangeSign() {
    if (this.state.lastOperator !== " log base " && this.state.lastOperator !== " mod ") {
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
          saveState(this.state);
        }
      );
    }
  }

  handleLeftParenthesis(e) {
    console.log(this.state.displayAll);
    if (this.state.lastInputType === "operator" || this.state.lastInput === "(" || this.state.displayAll === "" || this.state.displayAll === " - " || this.state.lastResult !== "") {
      console.log("here");
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
          saveState(this.state);
        }
      );
    }
  }
  handleRightParenthesis(e) {
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
            saveState(this.state);
          }
        );
      }
    }
  }

  handleEquals() {
    if (this.state.lastResult === "") {
      let result = calculate(this.state, this.state.displayAll);
      this.setState(
        {
          displayAll: displayAllExpression.concat(" = ").concat(result < 0 ? ` - ${Math.abs(result)}` : `${result}`),
          displayCur: result,
          lastInput: "",
          lastInputType: "digit",
          decimalAlreadyUsed: false,
          twoConsecutiveOperators: false,
          lastResult: result < 0 ? ` - ${Math.abs(result)}` : `${result}`,
          parenthesesDelta: 0,
          lastOperator: "equal",
        },
        () => {
          saveState(this.state);
          alertStatus.negativeFactor = false;
          alertStatus.nonIntegerFactor = false;
          alertStatus.negativeLog = false;
          alertStatus.zeroAsDenominator = false;
        }
      );
    }
  }

  handleCopyToClipboard(e) {
    let copyResult = document.getElementById(e.target.value).innerText;
    navigator.clipboard.writeText(copyResult);
  }

  handleCopyToMS(e) {
    this.setState((state) => ({
      [e.target.value]: state.displayCur,
    }));
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
          changeSign={this.handleChangeSign}
          abs={this.handleAbs}
          switchToDenominator={this.handleSwitchToDenominator}
          modulo={this.handleModulo}
          leftParenthesis={this.handleLeftParenthesis}
          rightParenthesis={this.handleRightParenthesis}
        />
        <MemorySlots CopyToMS={this.handleCopyToMS} specialDigit={this.handleSpecialDigit} memorySlot1={this.state.memorySlot1} memorySlot2={this.state.memorySlot2} memorySlot3={this.state.memorySlot3} />
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

class MemorySlots extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <hr />

        <button id="CopyToMS1" value="memorySlot1" onClick={this.props.CopyToMS}>
          Copy to MS1
        </button>
        <div id="memorySlot1">{this.props.memorySlot1}</div>
        <button id="copyFromMS1" value={this.props.memorySlot1} onClick={this.props.specialDigit}>
          Copy from MS1
        </button>
        <button id="CopyToMS2" value="memorySlot2" onClick={this.props.CopyToMS}>
          Copy to MS2
        </button>
        <div id="memorySlot2">{this.props.memorySlot2}</div>
        <button id="copyFromMS2" value={this.props.memorySlot2} onClick={this.props.specialDigit}>
          Copy from MS2
        </button>
        <button id="CopyToMS3" value="memorySlot3" onClick={this.props.CopyToMS}>
          Copy to MS3
        </button>
        <div id="memorySlot3">{this.props.memorySlot3}</div>
        <button id="copyFromMS3" value={this.props.memorySlot3} onClick={this.props.specialDigit}>
          Copy from MS3
        </button>
      </>
    );
  }
}

function Footer() {
  return (
    <footer>
      <div id="footer">This project was build using: HTML, CSS, JavaScript, React, jQuery, Bootstrap and SASS without using eval() function</div>
    </footer>
  );
}
