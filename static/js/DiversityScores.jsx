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

class DiversityScores extends React.Component {
  render() {
    const columns = [
      {
        Header: "Company Name",
        accessor: "name",
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
        Header: "Cusip",
        accessor: "cusip",
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
        Header: "Score",
        accessor: "score",
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
              <a href="/methods">
                <img
                  src="http://cdn.onlinewebfonts.com/svg/img_147474.png"
                  height="70"
                  width="70"
                  class="horizontal-centered"
                  style={{ marginLeft: 8 }}
                />
              </a>
            </div>
            <div className="col-6">
              <h3 className="col-9 horizontal-centered">
                <a href="/methods">How are scores generated?</a>
              </h3>
            </div>
            <div className="col-5">
              <div className="row">
                <div className="col-3" style={{ textAlign: "center" }}>
                  <h3> {this.props.mean} </h3>
                  <h6> Mean μ </h6>
                </div>
                <div className="col-3" style={{ textAlign: "center" }}>
                  <h3> {this.props.std} </h3>
                  <h6> STD σ </h6>
                </div>
                <div className="col-3" style={{ textAlign: "center" }}>
                  <h3> {this.props.hrc_correlation}</h3>
                  <h6> HRC correlation</h6>
                </div>
                <div className="col-3" style={{ textAlign: "center" }}>
                  <h3> {this.props.hrc_p_val}</h3>
                  <h6> P-Value </h6>
                </div>
              </div>
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

DiversityScores.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DiversityScores);
