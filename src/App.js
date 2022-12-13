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
    this.handleResetMS = this.handleResetMS.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleColorTheme = this.handleColorTheme.bind(this);
    this.handlePreviewColorTheme = this.handlePreviewColorTheme.bind(this);
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
      if (this.state.lastInput !== ")" && this.state.lastInput !== "!" && this.state.lastInput !== "%" && this.state.decimalAlreadyUsed !== true && this.state.lastInputType !== "digit") {
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
        } else if (e.target.value === "0.") {
          document.getElementById("decimal").click();
        } else if (Number(e.target.value) === 0) {
          document.getElementById("zero").click();
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
    if (this.state.lastInputType === "operator" || this.state.lastInput === "(" || this.state.displayAll === "" || this.state.displayAll === " - " || this.state.lastResult !== "") {
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

  handleCopyToClipboard() {
    let copyResult = document.getElementById("display").innerText;
    navigator.clipboard.writeText(copyResult);
  }

  handleCopyToMS(e) {
    this.setState((state) => ({
      [e.target.value]: state.displayCur,
    }));
  }

  handleResetMS(e) {
    this.setState({
      [e.target.value]: "Memory Slot ".concat(e.target.value[10]),
    });
  }

  handleColorTheme() {
    $("#display").animate({ opacity: 0 }, 1000);
    $("#displayAll").animate({ opacity: 0 }, 1000);
    $("#copy").fadeOut(1000);
    $("#colorTheme").fadeOut(1000);

    $(".colorThemes").delay(500).animate(
      {
        width: "toggle",
        height: "toggle",
      },
      500
    );
    // $(".colorThemes").fadeToggle(2000);
    // $(".colorThemes").toggle(1000);
    // $(".colorThemes").slideDown(500);
    // $(".colorThemes").fadeIn(1500);
    // $(".colorThemes").animate(
    //   {
    //     width: "toggle",
    //     height: "toggle",
    //   },
    //   500
    // );
  }

  handleChangeColor(e) {
    const root = document.documentElement;
    root.style.setProperty("--hue-rotate", `hue-rotate(${e.target.value}deg)`);
    root.style.setProperty("--second-color", `${e.target.value < 340 ? "white" : "rgb(59, 68, 75)"}`);
    $(".colorThemes").fadeOut(500);
    $("#colorTheme").fadeIn(2000);
    $("#copy").fadeIn(2000);
    $("#display").animate({ opacity: 1 }, 2000);
    $("#displayAll").animate({ opacity: 1 }, 2000);
  }

  handlePreviewColorTheme(e) {
    const root = document.documentElement;
    root.style.setProperty("--hue-rotate", `hue-rotate(${e.target.value}deg)`);
    root.style.setProperty("--second-color", `${e.target.value < 340 ? "white" : "rgb(59, 68, 75)"}`);
  }

  componentDidMount() {
    $(".colorThemes").hide();
  }

  componentDidUpdate() {
    let displayAll = document.getElementById("displayAll");
    displayAll.scrollTop = displayAll.scrollHeight;
  }

  render() {
    return (
      <>
        <div id="landscape">
          <div id="rotate-msg">Rotate your device!*</div>

          <img src={require("../src/styles/kitty.png")} />
          <div id="rotate-joking">*to use landscape mode - rotate both your device and your head!</div>
        </div>
        <div id="portrait">
          <div id="backgroundForTopButtons">
            <div id="calculatorForTopButtons">
              <TopButtons changeColorTheme={this.handleChangeColor} chooseColorTheme={this.handleColorTheme} copy={this.handleCopyToClipboard} previewColorTheme={this.handlePreviewColorTheme} />
            </div>
          </div>
          <div id="background">
            <div id="calculator" className="container-fluid">
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
                parenthesesDelta={this.state.parenthesesDelta}
              />
              <MemorySlots CopyToMS={this.handleCopyToMS} specialDigit={this.handleSpecialDigit} memorySlot1={this.state.memorySlot1} memorySlot2={this.state.memorySlot2} memorySlot3={this.state.memorySlot3} resetMS={this.handleResetMS} />
            </div>

            <Footer />
          </div>
        </div>
      </>
    );
  }
}

class TopButtons extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let colorThemes = [];
    for (let i = 0; i < 720; i += 40) {
      colorThemes.push(
        <div key={`div-${i}`}>
          <button id={`style${i}`} value={i} className="colorThemes" onClick={this.props.changeColorTheme} onMouseOver={this.props.previewColorTheme}>
            <i className="fa-solid fa-calculator"></i>
          </button>
        </div>
      );
    }
    return (
      <>
        <button id="colorTheme" onClick={this.props.chooseColorTheme}>
          <i className="fa-solid fa-calculator"></i>
        </button>
        <div id="themes-row">{colorThemes}</div>
        <button id="copy" onClick={this.props.copy}>
          <i className="fa-solid fa-copy"></i>
        </button>
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
        <div id="displayBox" className="row">
          <div id="display" className="col-12">
            {this.props.cur}
          </div>
          <div id="displayAll" className="col-12">
            {this.props.ops}
          </div>
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
      <div id="button-pad" className="row">
        <div className="col-12 d-flex justify-content-center">
          <button id="clear" className="main-btn" onClick={() => this.props.clear(true)}>
            AC
          </button>
          <button id="pi" value={Math.PI} className="tertiary-btn" onClick={this.props.specialDigit}>
            π
          </button>
          <button id="e" value={Math.E} className="tertiary-btn" onClick={this.props.specialDigit}>
            e
          </button>
          <button id="random" value={Math.random()} className="tertiary-btn long-text-btn" onClick={this.props.specialDigit}>
            rand
          </button>
          <button id="denominator" className="tertiary-btn" onClick={this.props.switchToDenominator}>
            <sup>1</sup>/<sub>x</sub>
          </button>
          <button id="factorial" className="tertiary-btn" onClick={this.props.factorial}>
            n!
          </button>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button id="sin" value="sin" className="tertiary-btn long-text-btn" onClick={this.props.trigonometry}>
            sin
          </button>
          <button id="log10" className="secondary-btn long-text-btn" onClick={this.props.log10}>
            log<sub>10</sub>
          </button>
          <button id="log" value=" log base " className="secondary-btn long-text-btn" onClick={this.props.log}>
            log<sub>x</sub>
          </button>
          <button id="logE" className="secondary-btn long-text-btn" onClick={this.props.logE}>
            log<sub>e</sub>
          </button>
          <button id="abs" className="secondary-btn long-text-btn" onClick={this.props.abs}>
            | x |
          </button>
          <button id="modulo" value=" mod " className="tertiary-btn long-text-btn" onClick={this.props.modulo}>
            mod
          </button>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button id="cos" value="cos" className="tertiary-btn long-text-btn" onClick={this.props.trigonometry}>
            cos
          </button>
          <button id="leftParenthesis" value="(" className="secondary-btn" parentheses-delta={this.props.parenthesesDelta === 0 ? "" : this.props.parenthesesDelta} onClick={this.props.leftParenthesis}>
            (
          </button>
          <button id="rightParenthesis" value=")" className="secondary-btn" onClick={this.props.rightParenthesis}>
            )
          </button>
          <button id="percentage" className="secondary-btn" onClick={this.props.percentage}>
            %
          </button>
          <button id="square" value="S" className="secondary-btn" onClick={this.props.square}>
            x<sup>2</sup>
          </button>
          <button id="squareRoot" value="R" className="tertiary-btn" onClick={this.props.squareRoot}>
            <sup>2</sup>√
          </button>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button id="tan" value="tan" className="tertiary-btn long-text-btn" onClick={this.props.trigonometry}>
            tan
          </button>
          <button id="seven" value="7" className="digits-btn" onClick={this.props.digit}>
            7
          </button>
          <button id="eight" value="8" className="digits-btn" onClick={this.props.digit}>
            8
          </button>
          <button id="nine" value="9" className="digits-btn" onClick={this.props.digit}>
            9
          </button>
          <button id="exponentiation" value=" ^ " className="secondary-btn" onClick={this.props.operator}>
            x<sup>y</sup>
          </button>
          <button id="anyRoot" value=" yroot " className="tertiary-btn" onClick={this.props.operator}>
            <sup>y</sup>√
          </button>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button id="cot" value="cot" className="tertiary-btn long-text-btn" onClick={this.props.trigonometry}>
            cot
          </button>
          <button id="four" value="4" className="digits-btn" onClick={this.props.digit}>
            4
          </button>
          <button id="five" value="5" className="digits-btn" onClick={this.props.digit}>
            5
          </button>
          <button id="six" value="6" className="digits-btn" onClick={this.props.digit}>
            6
          </button>
          <button id="multiply" value=" * " className="secondary-btn main-operators" onClick={this.props.operator}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button id="divide" value=" / " className="tertiary-btn main-operators" onClick={this.props.operator}>
            <i className="fa-solid fa-divide"></i>
          </button>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button id="sec" value="sec" className="tertiary-btn long-text-btn" onClick={this.props.trigonometry}>
            sec
          </button>
          <button id="one" value="1" className="digits-btn" onClick={this.props.digit}>
            1
          </button>
          <button id="two" value="2" className="digits-btn" onClick={this.props.digit}>
            2
          </button>
          <button id="three" value="3" className="digits-btn" onClick={this.props.digit}>
            3
          </button>
          <button id="add" value=" + " className="secondary-btn main-operators" onClick={this.props.operator}>
            <i className="fa-solid fa-plus"></i>
          </button>
          <button id="subtract" value=" - " className="tertiary-btn main-operators" onClick={this.props.operator}>
            <i className="fa-solid fa-minus"></i>
          </button>
        </div>
        <div className="col-12 d-flex justify-content-center">
          <button id="csc" value="csc" className="tertiary-btn long-text-btn" onClick={this.props.trigonometry}>
            csc
          </button>
          <button id="sign" className="tertiary-btn" onClick={this.props.changeSign}>
            <sup>+</sup>/<sub>−</sub>
          </button>
          <button id="zero" value="0" className="digits-btn" onClick={this.props.digit}>
            0
          </button>
          <button id="decimal" className="tertiary-btn main-operators" onClick={this.props.decimal}>
            .
          </button>
          <button id="equals" className="main-btn main-operators" style={{ fontSize: "9vw" }} onClick={this.props.equals}>
            =
          </button>
          <button id="delete" className="main-btn" onClick={this.props.previousState}>
            <i className="fa-solid fa-delete-left"></i>
          </button>
        </div>
      </div>
    );
  }
}

class MemorySlots extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="memorySlot" className="row">
        <div className="singleMemorySlot col-12 d-flex justify-content-center">
          <button id="CopyToMS1" value="memorySlot1" className="ms-btn" onClick={this.props.CopyToMS}>
            <i className="fa-solid fa-file-export"></i>
          </button>
          <div id="memorySlot1" className={this.props.memorySlot1 === "Memory Slot 1" ? "ms-text" : "saved-result"}>
            {this.props.memorySlot1}
          </div>
          <button id="copyFromMS1" value={this.props.memorySlot1} className="ms-btn" onClick={this.props.specialDigit}>
            <i className="fa-solid fa-file-arrow-up"></i>
          </button>
          <button id="resetMS1" value="memorySlot1" className="ms-btn" onClick={this.props.resetMS}>
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div className="singleMemorySlot col-12 d-flex justify-content-center">
          <button id="CopyToMS2" value="memorySlot2" className="ms-btn" onClick={this.props.CopyToMS}>
            <i className="fa-solid fa-file-export"></i>
          </button>
          <div id="memorySlot2" className={this.props.memorySlot2 === "Memory Slot 2" ? "ms-text" : "saved-result"}>
            {this.props.memorySlot2}
          </div>
          <button id="copyFromMS2" value={this.props.memorySlot2} className="ms-btn" onClick={this.props.specialDigit}>
            <i className="fa-solid fa-file-arrow-up"></i>
          </button>
          <button id="resetMS2" value="memorySlot2" className="ms-btn" onClick={this.props.resetMS}>
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div className="singleMemorySlot col-12 d-flex justify-content-center">
          <button id="CopyToMS3" value="memorySlot3" className="ms-btn" onClick={this.props.CopyToMS}>
            <i className="fa-solid fa-file-export"></i>
          </button>
          <div id="memorySlot3" className={this.props.memorySlot3 === "Memory Slot 3" ? "ms-text" : "saved-result"}>
            {this.props.memorySlot3}
          </div>
          <button id="copyFromMS3" value={this.props.memorySlot3} className="ms-btn" onClick={this.props.specialDigit}>
            <i className="fa-solid fa-file-arrow-up"></i>
          </button>
          <button id="resetMS3" value="memorySlot3" className="ms-btn" onClick={this.props.resetMS}>
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    );
  }
}

function Footer() {
  return (
    <footer>
      <div id="footer">This project was built using: HTML, CSS, JavaScript, React, jQuery, Bootstrap and SASS without using eval() function</div>
    </footer>
  );
}
