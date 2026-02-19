const express =  require("express")
const noteModel = require("./models/notes.model")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("./public"))

// POST METHOD

app.post("/notes", async (req, res)=>{
    const {title, description} = req.body

    const note = await noteModel.create({
        title,
        description
    })

    res.status(201).json({
        message: "note created successfully...",
        note
    })
})

// GET METHOD

app.get("/notes", async (req, res)=>{
    const note = await noteModel.find()

    res.status(200).json({
        message: "notes fecthed successfully",
        note
    })
})

// DELETE METHOD

app.delete("/notes/:id", async (req, res)=>{
    const id = req.params.id

    await noteModel.findByIdAndDelete(id)
    
    res.status(200).json({
        message: "note deleted successfully..."
    })
})

// PATCH METHOD

app.patch("/notes/:id", async (req, res)=>{
    const id = req.params.id
    const {description} = req.body

    await noteModel.findByIdAndUpdate(id, {description})

    res.status(200).json({
        message: "desc updated successfully"
    })
})

app.use("*name", (req, res)=>{
    res.sendFile(path.join(__dirname, ".." , "/public/index.html"))
})

module.exports = app