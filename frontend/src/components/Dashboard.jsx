import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const Navigate = useNavigate();
  const user = location.state?.user;

  const [notes, setNotes] = useState(["Note 1", "Note 2"]);
  const [newNote, setNewNote] = useState(""); // for input field

  const handleAddNote = () => {
    if (newNote.trim() === "") return;
    setNotes([...notes, newNote]);
    setNewNote(""); // clear input after adding
  };

  const handleDelete = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-white flex flex-col items-center  mt-10 md:justify-center px-4 py-6 w-full max-w-sm mx-auto">
        {/* Top Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              toast.success("logget out");
              Navigate("/login");
            }}
            className="text-blue-500 font-medium text-sm"
          >
            Sign Out
          </button>
        </div>

        {/* Welcome Card */}
        <div className="w-full bg-gray-100 p-4 rounded-lg shadow mb-4">
          <h2 className="text-lg font-bold">Welcome, {user.name}!</h2>
          <p className="text-sm text-gray-600 mt-1">Email: {user.email}</p>
        </div>

        {/* Note Input Field */}
        <div className="w-full flex flex-col space-y-2 mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter note"
            className="flex-1 border border-gray-300 rounded px-2 py-2  text-sm focus:outline-none"
          />
          <button
            onClick={handleAddNote}
            className="bg-blue-500 text-white px-3 h-10.5 py-1 rounded text-sm"
          >
            Create One
          </button>
        </div>

        {/* Notes Section */}
        <div className="w-full">
          <h3 className="text-md font-semibold mb-2">Notes</h3>
          {notes.map((note, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2 shadow-sm"
            >
              <span className="text-gray-800 text-sm">{note}</span>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
