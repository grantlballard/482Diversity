// index.jsx
import React from "react";
import ReactDOM from "react-dom";
import Results from "./Results";

import "react-table/react-table.css";

ReactDOM.render(
  <Results
    results={document.getElementById("table-content").getAttribute("results")}
    resultsLength={document
      .getElementById("table-content")
      .getAttribute("resultsLength")}
  />,
  document.getElementById("table-content")
);
