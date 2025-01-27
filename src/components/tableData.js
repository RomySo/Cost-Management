import React, { useEffect, useState } from "react";
import { Button, Paper, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { openDatabase, getData, removeData } from "../operations/DB";
import { categoryList } from "../constants";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function TableData({ data, setData }) {
  const [db, setDb] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

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

  const handleRemoveData = async (key) => {
    if (db) {
      try {
        const id = await removeData(db, key);
        console.log("Data removed with id:", id);

        // Refresh the data after removing
        const updatedData = await getData(db);
        setData(updatedData);
      } catch (error) {
        console.error("Error removing data:", error);
      }
    }
  };

  const handleDelete = () => {
    selectedRows.forEach((key) => {
      handleRemoveData(key);
    });
  };

  return (
    <div className="table-container">
      <Paper sx={{ height: 375, width: "100%" }}>
        <DataGrid
          rows={data.map((row) => ({
            ...row,
            category: categoryList[row.category],
          }))}
          columns={["cost", "description", "category", "date"].map((field) => ({
            field,
            headerName: field.charAt(0).toUpperCase() + field.slice(1),
            width: 150,
          }))}
          pageSizeOptions={[5]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          checkboxSelection
          sx={{ border: 0 }}
        />
        <Box>
          {selectedRows.length !== 0 ? (
            <Button
              variant="contained"
              color="danger"
              onClick={handleDelete}
              disabled={selectedRows.length === 0}
              style={{ marginTop: "10px" }}
            >
              <DeleteOutlineOutlinedIcon />
            </Button>
          ) : null}
        </Box>
      </Paper>
    </div>
  );
}

export default TableData;
