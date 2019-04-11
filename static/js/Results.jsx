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

  // function that converts a python string into JSON
  stringToJSON(results, resultsLength) {
    //original string has single quotes and double quotes are needed for correct JSON.parse format
    for (var i = 0; i < resultsLength; i++) {
      results = results.replace("'", '"');
      results = results.replace("'", '"');
    }
    results = JSON.parse(results);
    return results;
  }

  // converting the json to the approriate formate that is needed for React Table data
  reformattingJSON(json) {
    // get the name of the first column (comp_name in this case) so that we can
    // get the length of how many keys it has
    const firstColumn = Object.keys(json)[0];
    const numDocuments = Object.keys(json[firstColumn]).length;
    const numColumns = Object.keys(json).length;

    var finalJSON = [];
    var jsonData = {};
    for (var i = 0; i < numDocuments; i++) {
      jsonData = {
        name: json[Object.keys(json)[0]][i],
        score: json[Object.keys(json)[1]][i],
        cuspi: json[Object.keys(json)[2]][i]
      };
      finalJSON.push(jsonData);
    }
    return finalJSON;
  }

  render() {
    var resultsJSON = this.stringToJSON(
      this.props.results,
      this.props.resultsLength
    );
    console.log(resultsJSON);

    resultsJSON = this.reformattingJSON(resultsJSON);
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
              <Tab label="Diversity Scores" />
              <Tab label="Business Correlations" />
            </Tabs>
          </AppBar>

          {// Tab 1 -> the table of results
          value === 0 && <Table results={resultsJSON} />}
          {value === 1 && <TabContainer>Item Two</TabContainer>}
        </div>
      </div>
    );
  }
}

Results.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Results);
