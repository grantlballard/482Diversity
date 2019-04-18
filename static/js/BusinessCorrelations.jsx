// App.jsx
import React from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import "../css/results.css";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tableDiv: {
    backgroundColor: "whitesmoke"
  },
  tableContainer: {
    backgroundColor: "dodgerblue",
    padding: 12
  },
  scoresGeneratedContainer: {
    backgroundColor: "whitesmoke",
    padding: 10,
    margin: "10px 0px"
  }
});

class BusinessCorrelations extends React.Component {
  render() {
    const columns = [
      {
        Header: "Statistic",
        accessor: "stat",
        Cell: props => (
          <div
            style={{
              textAlign: "center"
            }}
          >
            {props.value}
          </div>
        )
      },
      {
        Header: "Mean",
        accessor: "mean",
        Cell: props => (
          <div
            style={{
              textAlign: "center"
            }}
          >
            {props.value}
          </div>
        )
      },
      {
        Header: "Standard Deviation",
        accessor: "sd",
        Cell: props => (
          <div
            className="number"
            style={{
              textAlign: "center"
            }}
          >
            {props.value}
          </div>
        )
      },
      {
        Header: "Diversity Correlation",
        accessor: "diversityCorrelation",
        Cell: props => (
          <div
            className="number"
            style={{
              textAlign: "center"
            }}
          >
            {props.value}
          </div>
        )
      },
      {
        Header: "Diversity P Value",
        accessor: "diversityP",
        Cell: props => (
          <div
            className="number"
            style={{
              textAlign: "center"
            }}
          >
            {props.value}
          </div>
        )
      },
      {
        Header: "HRC Correlation",
        accessor: "hrcCorrelation",
        Cell: props => (
          <div
            className="number"
            style={{
              textAlign: "center"
            }}
          >
            {props.value}
          </div>
        )
      },
      {
        Header: "HRC P Value",
        accessor: "hrcP",
        Cell: props => (
          <div
            className="number"
            style={{
              textAlign: "center"
            }}
          >
            {props.value}
          </div>
        )
      }
    ];

    const { classes } = this.props;

    return (
      <div className={classes.tableContainer}>
        <div className={classes.scoresGeneratedContainer}>
          <div className="row">
            <div className="col-1">
              <img
                src="http://cdn.onlinewebfonts.com/svg/img_147474.png"
                height="70"
                width="70"
              />
            </div>
            <div className="col-8">
              <h3 className="col-9 horizontal-centered">
                How are scores generated?
              </h3>
            </div>
          </div>
        </div>
        <div className={classes.tableDiv}>
          <ReactTable data={this.props.results} columns={columns} />
        </div>
      </div>
    );
  }
}

BusinessCorrelations.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BusinessCorrelations);
