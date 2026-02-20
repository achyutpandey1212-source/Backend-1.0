import { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDesc, setEditDesc] = useState("");

  function fetchNotes() {
    axios.get("/notes").then((res) => {
      setNotes(res.data.note);
    });
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  function submitHandler(e) {
    e.preventDefault();

    axios
      .post("/notes", {
        title: title,
        description: description,
      })
      .then((res) => {
        console.log(res.data);
        fetchNotes();
        setTitle("");
        setDescription("");
      });
  }

  function deletePost(_id) {
    axios.delete(`/notes/${_id}`).then((res) => {
      fetchNotes();
      console.log(res.data);
    });
  }

  function editThisNote(id) {
    setEditingId(id);
  }

  function saveNote(id) {
    axios
      .patch(`/notes/${id}`, { description: editDesc })
      .then(() => {
        fetchNotes();
        setEditingId(null);
      });
  }

  return (
    <>
      <form className="form" onSubmit={submitHandler}>
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="Enter Title..."
        />
        <input
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          placeholder="Enter Description..."
        />
        <button>Create Note</button>
      </form>

      <div className="notes">
        {notes.map((note) => {
          return (
            <div className="note">
              <h1>{note.title}</h1>
              {note._id === editingId ? (
                <input
                  value={editDesc}
                  onChange={(e) => {
                    setEditDesc(e.target.value);
                  }}
                />
              ) : (
                <p>{note.description}</p>
              )}

              {note._id === editingId && (
                <>
                  <button
                    onClick={() => {
                      saveNote(note._id);
                    }}
                  >
                    SAVE
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                    }}
                  >
                    CANCEL
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  editThisNote(note._id);
                }}
              >
                EDIT
              </button>
              <button
                onClick={() => {
                  deletePost(note._id);
                }}
              >
                DELETE
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
