import React from "react";
import "./styles/styles.css";
import $ from "jquery";

export default class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayRes: "",
      displayOps: "",
    };
  }

  render() {
    return (
      <>
        <Footer />
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
