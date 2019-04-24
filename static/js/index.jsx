// index.jsx
import React from "react";
import ReactDOM from "react-dom";
import Results from "./Results";

import "react-table/react-table.css";

ReactDOM.render(
  <Results
    results={document.getElementById("table-content").getAttribute("results")}
    diversitySD={document
      .getElementById("table-content")
      .getAttribute("diversitySD")}
    diversityMean={document
      .getElementById("table-content")
      .getAttribute("diversityMean")}
    diversityHRCCorrelation={document
      .getElementById("table-content")
      .getAttribute("diversityHRCCorrelation")}
    diversityHRCPVal={document
      .getElementById("table-content")
      .getAttribute("diversityHRCPVal")}
    financeResults={document
      .getElementById("table-content")
      .getAttribute("financeResults")}
  />,
  document.getElementById("table-content")
);
