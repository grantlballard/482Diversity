// App.jsx
import React from "react";
import ReactTable from "react-table";

export default class Table extends React.Component {
  stringToJSON(results, resultsLength) {
    //original string has single quotes and double quotes are needed for correct JSON.parse format
    for (var i = 0; i < resultsLength; i++) {
      results = results.replace("'", '"');
      results = results.replace("'", '"');
    }
    results = JSON.parse(results);
    return results;
  }

  render() {
    var resultsJSON = this.stringToJSON(
      this.props.results,
      this.props.resultsLength
    );

    const data = [
      {
        name: "Tanner Linsley",
        score: 34
      },
      {
        name: "Jake Bell",
        score: 25
      }
    ];

    const columns = [
      {
        Header: "Company Name",
        accessor: "name" // String-based value accessors!
      },
      {
        Header: "Score",
        accessor: "score",
        Cell: props => <span className="number">{props.value}</span> // Custom cell components!
      }
    ];
    //console.log(resultsJSON);
    //var res = {{ resultsJSON }};
    //  console.log(res);

    return <ReactTable data={resultsJSON} columns={columns} />;
  }
}
