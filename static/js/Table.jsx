// App.jsx
import React from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

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
  },
  verticalCenter: {
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)"
  }
});

class Table extends React.Component {
  render() {
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

    console.log(data);

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
      },
      {
        Header: "HRC",
        accessor: "hrc",
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
            <div className="col-2">
              <img
                src="http://cdn.onlinewebfonts.com/svg/img_147474.png"
                height="70"
                width="70"
              />
            </div>
            <div className="col-10 vertical-center">
              <h3> How are scores generated? </h3>
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

Table.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Table);
