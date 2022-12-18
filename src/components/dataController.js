import { UploadFile } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
// import { parse } from "csv-parse/browser/esm/sync";

function DataController({
  handleShowGraph,
  handleGetFilterableData,
  handleResetAllData,
}) {
  const [csvData, setCsvData] = useState([]);
  const [filename, setFilename] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  // const [filterableVal, setFilterableVal] = useState({});
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState([]);

  const handleFileUpload = (e) => {
    handleReset();
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    setFilename(name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt?.target?.result) {
        return;
      }
      const { result } = evt.target;
      const lineData = result.split("\n");
      const columns = lineData[0].split(",");
      // Get Filterable Values
      const finalFilterableObj = {};
      const arrayOfsets = [];
      for (let ii = 0; ii < columns.length; ii++) {
        finalFilterableObj[columns[ii]] = [];
        arrayOfsets.push(new Set());
      }

      // Read line by line and push the data as object in records - csv parser couldn't help
      const records = [];
      for (let index = 1; index < lineData.length; index++) {
        // First row is header - skipping
        const columnValArr = lineData[index].split(
          /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
        );
        const recordObj = {};
        if (columnValArr.length === columns.length) {
          for (let jj = 0; jj < columnValArr.length; jj++) {
            const str = columnValArr[jj].replace(/^"(.*)"$/, "$1"); // remove double quotes, if any
            if (isNaN(str)) {
              recordObj[columns[jj]] = str;
              if (isNaN(Date.parse(str))) {
                arrayOfsets[jj].add(str);
              }
            } else {
              recordObj[columns[jj]] = Number(str);
            }
          }
        }
        records.push(recordObj);
      }

      for (let ii = 0; ii < arrayOfsets.length; ii++) {
        finalFilterableObj[columns[ii]] = [...arrayOfsets[ii]];
      }
      setCsvData(records);
      setMenuItems(columns);
      handleGetFilterableData(finalFilterableObj);
    };
    reader.readAsBinaryString(file);
  };

  const handleXChange = (event) => {
    setXAxis(event.target.value);
  };
  const handleYChange = (event) => {
    const {
      target: { value },
    } = event;

    setYAxis(typeof value === "string" ? value.split(",") : value);
  };

  const handleReset = () => {
    setXAxis("");
    setYAxis([]);
  };

  return (
    <Container>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          mt: 1,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-evenly"
          sx={{ alignItems: "flex-end" }}
        >
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFile />}
            sx={{ marginRight: "1rem", height: 40, mx: 1, my: 2 }}
          >
            Upload CSV File
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(evt) => {
                handleFileUpload(evt);
                handleResetAllData();
              }}
            />
          </Button>
          {menuItems.length > 0 && (
            <Box
              display="flex"
              justifyContent="space-evenly"
              sx={{ alignItems: "flex-end" }}
            >
              <FormControl sx={{ width: 200, m: 1 }}>
                <InputLabel id="xlabel">X-axis</InputLabel>
                <Select labelId="xlabel" value={xAxis} onChange={handleXChange}>
                  {menuItems.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 400, m: 1 }}>
                <InputLabel>Y-axis</InputLabel>
                <Select multiple value={yAxis} onChange={handleYChange}>
                  {menuItems.map((column, idx) => (
                    <MenuItem key={idx} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                sx={{ height: 40, mx: 1, my: 2 }}
                onClick={() => {
                  handleShowGraph({
                    data: csvData,
                    xcoord: xAxis,
                    ycoord: yAxis,
                  });
                }}
              >
                Show Graph
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default DataController;
