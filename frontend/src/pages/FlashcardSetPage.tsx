import React, { useEffect, useState } from "react";
import { fetchUser, updateSet, deleteSet, createSet, createFlashcard, fetchSets, fetchFlashcardSet, deleteFlashcardSet ,updateFlashcardSet} from "../utils/api";
import { Sets, Flashcard } from "../Types/type";



const FlashcardSetPage: React.FC = () => {
  const [sets, setSets] = useState<Sets[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newSetName, setNewSetName] = useState("");
  const [newFlashcard, setNewFlashcard] = useState<Flashcard>({
    id: 0,
    setId: 0,
    question: "",
    solution: "",
    difficulty: "",
  });
  const [editingSetId, setEditingSetId] = useState<number | null>(null);
  const [editingFlashcardId, setEditingFlashcardId] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [userName, setUserName] = useState<string | null>(null);
  
  

  useEffect(() => {
    
    async function LoadFlashcardSets() {
      if (!loaded) {
        const data = await fetchSets();
        setSets(data);
        setLoaded(true);
        console.log(data)
      }
    }

    LoadFlashcardSets();
  }, []);

  const handleAddSet = async () => {
    if (!newSetName) {
      alert("Please provide a set name.");
      return;
    }
    try {
      const user_id = localStorage.getItem("token") || "";
      const newSet = await createSet({ name: newSetName, userId: user_id });
      setSets([...sets, newSet]);
      setNewSetName("");
    } catch (error) {
      alert("Error creating set.");
    }
  };

  const handleAddFlashcard = async () => {
    if (!selectedSetId || !newFlashcard.question || !newFlashcard.solution || !newFlashcard.difficulty) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const createdFlashcard = await createFlashcard(selectedSetId, {
        question: newFlashcard.question,
        solution: newFlashcard.solution,
        difficulty: newFlashcard.difficulty,
      });
      setFlashcards([...flashcards, createdFlashcard]);
      setNewFlashcard({ setId: 0, id: 0, question: "", solution: "", difficulty: "" });
    } catch (error) {
      alert("Error adding flashcard.");
    }
  };

  const handleSelectSet = async (setId: number) => {
    setSelectedSetId(setId);
    const flashcards = await fetchFlashcardSet(setId);
    setFlashcards(flashcards);
  };

  const handleFlipCard = (cardId: number) => {
    setFlippedCards((prevFlipped) => {
      const newFlipped = new Set(prevFlipped);
      if (newFlipped.has(cardId)) {
        newFlipped.delete(cardId); // Hide the answer
      } else {
        newFlipped.add(cardId); // Reveal the answer
      }
      return newFlipped;
    });
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setEditingFlashcardId(flashcard.id);
    setNewFlashcard({ ...flashcard });
  };

  const handleSaveFlashcard = async () => {
    if (editingFlashcardId === null) return;

    try {
      const updatedFlashcard = await updateFlashcardSet({
        setId: selectedSetId!,
        flashcardId: editingFlashcardId,
        question: newFlashcard.question,
        solution: newFlashcard.solution,
        difficulty: newFlashcard.difficulty,
      });
      setFlashcards(flashcards.map((card) => (card.id === editingFlashcardId ? updatedFlashcard : card)));
      setEditingFlashcardId(null);
      setNewFlashcard({ setId: 0, id: 0, question: "", solution: "", difficulty: "" });
    } catch (error) {
      alert("Error saving flashcard.");
    }
  };

  const handleCancelEdit = () => {
    setEditingFlashcardId(null);
    setNewFlashcard({ setId: 0, id: 0, question: "", solution: "", difficulty: "" });
  };

  const handleDeleteFlashcard = async (flashcardId: number) => {
    try {
      await deleteFlashcardSet(selectedSetId!, flashcardId);
      setFlashcards(flashcards.filter((card) => card.id !== flashcardId));
    } catch (error) {
      alert("Error deleting flashcard.");
    }
  };

  const handleDeleteSet = async (setId: number) => {
    try {
      await deleteSet(setId);
      setSets(sets.filter((set) => set.id !== setId));
      setFlashcards(flashcards.filter((card) => card.setId !== setId));
    } catch (error) {
      alert("Error deleting set.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Create Set Section */}
      <div>
        <input
          type="text"
          placeholder="Enter set name"
          value={newSetName}
          onChange={(e) => setNewSetName(e.target.value)}
          className="p-2 border mb-4 w-full"
        />
        <button onClick={handleAddSet} className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-green-500">
          Create Set
        </button>
      </div>
{/* Manage Sets */}
<div className="mt-6">
  <h3 className="font-bold text-lg mb-4">Manage Sets:</h3>
  <table className="table-auto w-full bg-white rounded-lg shadow-lg">
    <thead>
      <tr className="bg-gray-200">
        <th className="text-left p-2 border">Set Name</th>
        <th className="p-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {sets.map((set) => (
        <tr key={set.id} className="hover:bg-gray-100">
          <td className="p-2 border">
            {editingSetId === set.id ? (
              <input
                type="text"
                value={newSetName}
                onChange={(e) => setNewSetName(e.target.value)}
                className="p-1 border rounded w-full"
              />
            ) : (
              set.name
            )}
          </td>
          <td className="p-2 border text-center">
            {editingSetId === set.id ? (
              <div className="flex justify-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      const updatedSet = await updateSet(set.id, { name: newSetName });
                      setSets(sets.map((s) => (s.id === set.id ? updatedSet : s)));
                      setEditingSetId(null);
                      setNewSetName("");
                    } catch (error) {
                      alert("Error updating set.");
                    }
                  }}
                  className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSetId(null)}
                  className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    setEditingSetId(set.id);
                    setNewSetName(set.name);
                  }}
                  className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSet(set.id)}
                  className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      {/* Flashcard Set Selection */}
      <div className="mt-6">
        <h3>Select a Set to Add Flashcards or to display Sets:</h3>
        <select
          value={selectedSetId || ""}
          onChange={(e) => handleSelectSet(Number(e.target.value))}
          className="p-2 border mb-4 w-full"
        >
          <option key={-2} value="">
            -- Select a Set --
          </option>
          {sets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.name}
            </option>
          ))}
        </select>
      </div>



      {/* Create Flashcard Section */}
      <div className="mt-8">
        {selectedSetId && (
          <div>
            <input
              type="text"
              placeholder="Enter question"
              value={newFlashcard.question}
              onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
              className="p-2 border mb-4 w-full"
            />
            <input
              type="text"
              placeholder="Enter solution"
              value={newFlashcard.solution}
              onChange={(e) => setNewFlashcard({ ...newFlashcard, solution: e.target.value })}
              className="p-2 border mb-4 w-full"
            />
            <input
              type="text"
              placeholder="Enter difficulty: easy, medium or hard"
              value={newFlashcard.difficulty}
              onChange={(e) => setNewFlashcard({ ...newFlashcard, difficulty: e.target.value })}
              className="p-2 border mb-4 w-full"
            />
            <button onClick={handleAddFlashcard} className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-green-500">
              Add Flashcard
            </button>
          </div>
        )}
      </div>

      {/* Display Flashcards for the Selected Set */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards
          .filter((card) => card.setId === selectedSetId)
          .map((card) => 
            (
            <div key={card.id} className="p-4 mb-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              {editingFlashcardId === card.id ? (
                <div>
                  <input
                    type="text"
                    value={newFlashcard.question}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
                    className="p-2 mb-2 border w-full"
                  />
                  <input
                    type="text"
                    value={newFlashcard.solution}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, solution: e.target.value })}
                    className="p-2 mb-2 border w-full"
                  />
                  <input
                    type="text"
                    value={newFlashcard.difficulty}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, difficulty: e.target.value })}
                    className="p-2 mb-2 border w-full"
                  />
                  <div className="mt-2">
                    <button onClick={handleSaveFlashcard} className="p-2 bg-cyan-500 text-white rounded-lg mr-2">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>Question: {card.question}</p>
                  {flippedCards.has(card.id) && <p>Solution: {card.solution}</p>}
                  <p>Difficulty: {card.difficulty}</p>
                  <button onClick={() => handleFlipCard(card.id)} className="p-2 bg-cyan-500 text-white rounded-lg mt-2 hover:bg-green-600">
                    Answer
                  </button>
                  <div className="mt-2">
                    <button
                      onClick={() => handleEditFlashcard(card)}
                      className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFlashcard(card.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default FlashcardSetPage;
