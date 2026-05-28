const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let transactions = [];

// ADD
app.post("/add", (req, res) => {
  transactions.push(req.body);
  res.send("Added");
});

// GET
app.get("/all", (req, res) => {
  res.json(transactions);
});

// DELETE
app.post("/delete", (req, res) => {
  const index = req.body.index;
  transactions.splice(index, 1);
  res.send("Deleted");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});