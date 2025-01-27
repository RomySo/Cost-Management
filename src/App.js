import "./App.css";
import { useEffect, useState } from "react";
import { openDatabase, getData } from "./operations/DB";
import InsertContainer from "./components/InsertContainer";
import TableData from "./components/tableData";
import { Button } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChartView from "./components/chartView";

function App() {
  // Sets the initials of the db
  const [db, setDb] = useState(null);
  const [data, setData] = useState([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        const database = await openDatabase();
        setDb(database);
        const result = await getData(database);
        setData(result);
      } catch (error) {
        console.error("Error initializing db", error);
      }
    };

    initializeDb();
  }, []);

  return (
    <div className="main-container">
      <Button
        className="button"
        variant="contained"
        onClick={() => setAdding(!adding)}
      >
        Add Data {adding ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </Button>
      <div hidden={!adding}>
        <InsertContainer setData={setData} />
      </div>
      <TableData data={data} setData={setData} />
      <ChartView data={data} />
    </div>
  );
}

export default App;
