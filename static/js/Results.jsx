// App.jsx
import React from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import DiversityScores from "./DiversityScores.jsx";
import BusinessCorrelations from "./BusinessCorrelations.jsx";

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

var meanScore = 0;

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
    const numRows = Object.keys(json[firstColumn]).length;
    const numColumns = Object.keys(json).length;

    var finalJSON = [];
    var jsonData = {};
    var totalScore = 0;
    for (var i = 0; i < numRows; i++) {
      totalScore += json["score"][i];
      jsonData = {
        name: json[Object.keys(json)[0]][i],
        score: json[Object.keys(json)[1]][i],
        cusip: json[Object.keys(json)[2]][i]
      };
      finalJSON.push(jsonData);
    }
    meanScore = totalScore / numRows;
    return finalJSON;
  }

  reformattingJSONFinance(json) {
    // get the name of the first column (comp_name in this case) so that we can
    // get the length of how many keys it has
    const firstColumn = Object.keys(json)[0];
    const numRows = Object.keys(json[firstColumn]).length;
    const numColumns = Object.keys(json).length;

    var finalJSON = [];
    var jsonData = {};
    var totalScore = 0;
    for (var i = 0; i < numRows; i++) {
      jsonData = {
        stat: json[Object.keys(json)[0]][i],
        mean: json[Object.keys(json)[1]][i],
        sd: json[Object.keys(json)[2]][i],
        diversityCorrelation: json[Object.keys(json)[3]][i],
        diversityP: json[Object.keys(json)[4]][i],
        hrcCorrelation: json[Object.keys(json)[5]][i],
        hrcP: json[Object.keys(json)[6]][i]
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

    const diversityMean = this.props.diversityMean.replace(/[\[\]']+/g, "");
    const diversitySD = this.props.diversitySD.replace(/[\[\]']+/g, "");

    console.log(this.props.financeResults);

    var financeResults = JSON.parse(this.props.financeResults);
    console.log(financeResults);

    financeResults = this.reformattingJSONFinance(financeResults);

    console.log(financeResults);

    const numDocuments = Object.keys(resultsJSON).length;
    var sd = 0;

    for (var i = 0; i < numDocuments; i++) {
      sd += Math.pow(resultsJSON[i]["score"] - meanScore, 2);
    }
    sd = Math.pow((1 / numDocuments) * sd, 0.5);

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
          value === 0 && (
            <DiversityScores
              results={resultsJSON}
              mean={diversityMean}
              std={diversitySD}
              hrc_correlation={this.props.diversityHRCCorrelation}
              hrc_p_val = {this.props.diversityHRCPVal}
            />
          )}
          {value === 1 && <BusinessCorrelations results={financeResults} />}
        </div>
      </div>
    );
  }
}

Results.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Results);
