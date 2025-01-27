import "./components.css";
import { useEffect, useState } from "react";
import { openDatabase, addData, getData } from "../operations/DB";
import {
  Button,
  CardContent,
  Card,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

import { categoryList } from "../constants";

function InsertContainer({ setData }) {
  // Sets the initials of the db
  const [db, setDb] = useState(null);

  // Data from the user
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState("");

  useEffect(() => {
    const initializeDb = async () => {
      try {
        const database = await openDatabase();
        setDb(database);
      } catch (error) {
        console.error("Error initializing db", error);
      }
    };

    initializeDb();
  }, []);

  const handleAddData = async () => {
    if (db) {
      try {
        const id = await addData(db, {
          id: Date.now(),
          cost,
          description,
          category,
          date,
        });
        console.log("Data added with id:", id);

        // Refresh the data after adding
        const updatedData = await getData(db);
        setData(updatedData);

        setCategory("");
        setDescription("");
        setCost("");
        setDate("");
      } catch (error) {
        console.error("Error adding data:", error);
      }
    }
  };

  return (
    <div className="main-container">
      <Card className="card">
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddData();
            }}
            className="form-inputs"
          >
            <div className={"input-group"}>
              <TextField
                required={true}
                type="number"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                variant="outlined"
                label="Cost"
              />
              <TextField
                type="text"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
              />
              <TextField
                required={true}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                variant="outlined"
              />
              <FormControl fullWidth required={true}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categoryList.map((category, index) => (
                    <MenuItem key={index} value={index}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default InsertContainer;
