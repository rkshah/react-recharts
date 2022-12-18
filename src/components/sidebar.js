import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

function Sidebar({ filterableData, handleApplyFilter, filterParams }) {
  const filterableDataKeys = [];
  for (const [key, value] of Object.entries(filterableData)) {
    if (value.length > 0) {
      filterableDataKeys.push(key);
    }
  }
  const [finalFilterableData, setFinalFilterableData] = useState(filterParams);

  const handleChange = (evt) => {
    const {
      target: { name, value },
    } = evt;

    setFinalFilterableData({ ...finalFilterableData, [name]: value });
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="left"
      justifyContent="center"
      // maxWidth={400}
    >
      <Typography sx={{ m: 3 }}>Filter Parameters</Typography>
      <Box display="flex" flexDirection="column" sx={{ ml: 2 }}>
        {filterableDataKeys.map((columnKey) => (
          <FormControl
            key={columnKey}
            sx={{
              my: 2,
              px: 1,
            }}
          >
            <InputLabel>{columnKey}</InputLabel>

            <Select
              multiple
              name={columnKey}
              value={finalFilterableData[columnKey]}
              onChange={handleChange}
              input={<OutlinedInput label="chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {filterableData[columnKey].map((data) => (
                <MenuItem key={data} value={data} label={data}>
                  {data}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>

      <Button
        sx={{ ml: 10, mt: 5 }}
        variant="outlined"
        onClick={() => {
          handleApplyFilter({
            filterData: finalFilterableData,
          });
        }}
      >
        Update
      </Button>
    </Grid>
  );
}

export default Sidebar;
