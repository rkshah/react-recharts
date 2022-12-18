import { Paper } from "@mui/material";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const colorVal = [
  "#8884d8",
  "#128f77",
  "#3444d8",
  "#ff66d8",
  "#0084d8",
  "#111",
  "#663324",
  "#7714d8",
  "#ff0000",
  "#00ddd8",
];

function DataViewer({ graphData, graphParams }) {
  return (
    <div>
      {graphData.ycoord.map((y_var) => (
        <Paper key={y_var} elevation={1} sx={{ m: 2, p: 2 }}>
          <LineChart
            width={1400}
            height={300}
            data={graphData.data[y_var]}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey={graphData.xcoord} />
            <YAxis
              label={{ value: y_var, angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            {/* <Legend
              verticalAlign="bottom"
              height={36}
              iconSize={7}
              fontSize={"10px"}
            /> */}
            {graphParams.length > 0 &&
              graphParams.map((params, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={params}
                  stroke={colorVal[index]}
                  activeDot={{ r: 8 }}
                />
              ))}
          </LineChart>
        </Paper>
      ))}
    </div>
  );
}

export default DataViewer;
