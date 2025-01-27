import "./components.css";
import React, { useEffect, useState } from "react";
import { categoryList, monthsName } from "../constants";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

function ChartView({ data }) {
  const [categoryTotal, setCategoryTotal] = useState([]);
  const [categoryTotalSelected, setCategoryTotalSelected] = useState([]);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);

  useEffect(() => {
    if (data.length > 0) {
      const totals = categoryList.map((_, index) => {
        return data
          .filter((item) => Number(item.category) === index)
          .reduce((total, item) => total + Number(item.cost), 0);
      });
      setCategoryTotal(totals);
    }

    if (data.length > 0 && year && month) {
      const filteredData = data.filter((item) => {
        const itemYear = new Date(item.date).getFullYear();
        const itemMonth = new Date(item.date).getMonth() + 1; // months are 0-indexed
        return itemYear === year && itemMonth === month;
      });

      const totalsSelect = categoryList.map((_, index) => {
        return filteredData
          .filter((item) => Number(item.category) === index)
          .reduce((totalsSelect, item) => totalsSelect + Number(item.cost), 0);
      });
      console.log(totalsSelect);

      setCategoryTotalSelected(totalsSelect);
    }
  }, [data]);

  const pieData = categoryList.map((category, index) => ({
    id: index,
    value: categoryTotal[index],
    label: category,
  }));

  const monthlyData = data.reduce((acc, item) => {
    const month = new Date(item.date).getMonth();
    if (!acc[month]) {
      acc[month] = { month: month + 1, cost: 0 };
    }
    acc[month].cost += Number(item.cost);
    return acc;
  }, []);

  const availableMonths = year
    ? [
        ...new Set(
          data
            .filter((item) => new Date(item.date).getFullYear() === year)
            .map((item) => new Date(item.date).getMonth() + 1)
        ),
      ]
    : [];

  const pieDataSelect = categoryList.map((category, index) => ({
    id: index,
    value: categoryTotalSelected[index],
    label: category,
  }));

  const monthlyCostList = Object.values(monthlyData);

  return (
    <div className="chart-view">
      <div>
        <FormControl fullWidth required={true}>
          <InputLabel>Year</InputLabel>
          <Select
            value={year}
            label="Year"
            onChange={(e) => {
              setYear(e.target.value);
              setMonth(null); // Reset the month when the year changes
            }}
          >
            {[
              ...new Set(data.map((item) => new Date(item.date).getFullYear())),
            ].map((uniqueYear) => (
              <MenuItem key={uniqueYear} value={uniqueYear}>
                {uniqueYear}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required={true}>
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            label="Month"
            onChange={(e) => setMonth(e.target.value)}
            disabled={!year}
          >
            {availableMonths.map((uniqueMonth) => (
              <MenuItem key={uniqueMonth} value={uniqueMonth}>
                {monthsName[uniqueMonth - 1]}{" "}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <PieChart series={[{ data: pieDataSelect }]} width={600} height={300} />
      </div>
      <div className="chart-container">
        <PieChart series={[{ data: pieData }]} width={600} height={300} />
        <BarChart
          series={[{ data: monthlyCostList.map((item) => item.cost) }]}
          height={300}
          xAxis={[
            {
              data: monthlyCostList.map((item) => monthsName[item.month - 1]),
              scaleType: "band",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default ChartView;
