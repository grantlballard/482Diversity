// App.jsx
import React from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Table from "./Table.jsx";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class Results extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

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
    // function that converts a python string into JSON
    var resultsJSON = this.stringToJSON(
      this.props.results,
      this.props.resultsLength
    );
    console.log(resultsJSON);

    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        <div className={classes.root}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Table" />
              <Tab label="Graphs" />
            </Tabs>
          </AppBar>

          {// Tab 1 -> the table of results
          value === 0 && <Table results={resultsJSON} />}
          {value === 1 && <TabContainer>Item Two</TabContainer>}
          {value === 2 && <TabContainer>Item Three</TabContainer>}
        </div>
      </div>
    );
  }
}

Results.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Results);
