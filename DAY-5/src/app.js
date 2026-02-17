const express = require("express");

const app = express();

app.use(express.json());

const notes = [];

app.post("/notes", (req, res) => {
  console.log(req.body);
  notes.push(req.body);

  res.send("notes created successfully...");
});

app.get("/notes", (req, res) => {
  res.send(notes);
});

app.patch("/notes/:index", (req, res) => {
    notes[req.params.index].description = req.body.description
    notes[req.params.index].title = req.body.title
});

app.put("/notes/:index", (req, res)=>{
    notes[req.params.index] = req.body
})

app.delete("/notes/:index", (req, res) => {
  delete notes[req.params.index];
  res.send(notes);
});

module.exports = app;
