import Navbar from "./components/navbar";
import DataController from "./components/dataController";
import { useState } from "react";
import DataViewer from "./components/dataViewer";
import { Grid } from "@mui/material";
import Sidebar from "./components/sidebar";

function App() {
  const [dataViewerState, setDataViewState] = useState({
    data: {},
    xcoord: "",
    ycoord: [],
  });
  const [filterableVal, setFilterableVal] = useState({});
  const [filterParams, setFilterParams] = useState({});
  const [origGraphParams, setOrigGraphParams] = useState([]);
  const [graphParams, setGraphParams] = useState([]);

  const handleShowGraph = ({ data, xcoord, ycoord }) => {
    const finalDataObj = {};
    const tempGraphParams = [];
    for (const eachYval of ycoord) {
      finalDataObj[eachYval] = [];
      // tempGraphParams[eachYval] = [];
      let tempObj = {};
      for (const dataRow of data) {
        if (tempObj[xcoord] !== dataRow[xcoord]) {
          if (tempObj[xcoord]) {
            finalDataObj[eachYval].push(tempObj);
          }
          // delete old data
          tempObj = {};
          // re-initialize with new day
          tempObj[xcoord] = dataRow[xcoord];
        }

        let lineGraphVal = "";
        for (const [key, value] of Object.entries(filterableVal)) {
          if (value.length > 0) {
            for (const param of value) {
              if (dataRow[key] === param) {
                lineGraphVal += "$" + param + "$";
              }
            }
          }
        }
        tempObj[lineGraphVal] = dataRow[eachYval];
        if (tempGraphParams.indexOf(lineGraphVal) === -1) {
          tempGraphParams.push(lineGraphVal);
        }
      }
    }
    setGraphParams(tempGraphParams);
    setOrigGraphParams(tempGraphParams);
    setDataViewState({
      data: finalDataObj,
      xcoord,
      ycoord,
    });
  };

  const handleGetFilterableData = (filterdata) => {
    setFilterableVal(filterdata);
    const tempObj = {};
    for (const [key, value] of Object.entries(filterdata)) {
      if (value.length > 0) {
        tempObj[key] = [];
      }
    }
    setFilterParams(tempObj);
  };

  const handleApplyFilter = ({ filterData }) => {
    console.log("handleApplyFilter app.js", filterData);
    const filterParams = [];
    let finalGraphParams = [];
    let index = 0;
    for (const [key, value] of Object.entries(filterData)) {
      if (value.length > 0) {
        let tempTempGraphParms = [];
        for (const filterVal of value) {
          if (index === 0) {
            console.log("we are in first filter", index);
            // fill the temp graph with first filter from original graph params
            for (const origParam of origGraphParams) {
              if (origParam.includes("$" + filterVal + "$")) {
                finalGraphParams.push(origParam);
              }
            }
          } else {
            // temp graph is not empty. we need to filter the data from temp graph, which has graph params based on first filter.
            for (const modifiedParam of finalGraphParams) {
              console.log(
                "Modilfied param ;",
                modifiedParam,
                "$" + filterVal + "$"
              );
              if (modifiedParam.includes("$" + filterVal + "$")) {
                tempTempGraphParms.push(modifiedParam);
              }
            }
          }
        }

        if (index !== 0) {
          // this is required, when filtering with another set not the first one.
          const anotherTemp = [];
          for (const val of finalGraphParams) {
            if (tempTempGraphParms.includes(val)) {
              anotherTemp.push(val);
            }
          }
          finalGraphParams = anotherTemp;
        }

        index += 1;
      }
    }

    setGraphParams(finalGraphParams);

    setFilterParams({ ...filterParams, filterData });
  };

  const handleResetAll = () => {
    setDataViewState({
      data: [],
      xcoord: "",
      ycoord: [],
    });
    for (const key in filterParams) {
      delete filterParams[key];
    }
    for (const key in filterableVal) {
      delete filterableVal[key];
    }
  };

  return (
    <div className="App">
      <Navbar />
      <Grid container>
        <Grid item xs={2}>
          {Object.keys(filterParams).length > 0 && (
            <Sidebar
              handleApplyFilter={handleApplyFilter}
              filterableData={filterableVal}
              filterParams={filterParams}
            />
          )}
        </Grid>
        <Grid item xs={10}>
          <DataController
            handleShowGraph={handleShowGraph}
            handleGetFilterableData={handleGetFilterableData}
            handleResetAllData={handleResetAll}
          />
          <DataViewer graphData={dataViewerState} graphParams={graphParams} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
