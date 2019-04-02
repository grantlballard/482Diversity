// index.jsx
import React from "react";
import ReactDOM from "react-dom";
import Table from "./Table";

import "react-table/react-table.css";

ReactDOM.render(
  <Table
    results={document.getElementById("table-content").getAttribute("results")}
    resultsLength={document
      .getElementById("table-content")
      .getAttribute("resultsLength")}
  />,
  document.getElementById("table-content")
);
