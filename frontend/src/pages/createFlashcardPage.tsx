import React, { useState, useEffect } from "react";
import { updateSet, deleteSet, fetchSets, createSet, fetchFlashcardSet, createFlashcard } from "../utils/api";

// Define interfaces
interface Flashcard {
  setId: number;
  question: string;
  solution: string;
  difficulty: string;
}

interface Sets {
  id: number;
  name: string;
}

const FlashcardSetPage: React.FC = () => {
  const [sets, setSets] = useState<Sets[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newSetName, setNewSetName] = useState("");
  const [newFlashcard, setNewFlashcard] = useState<Flashcard>({
    setId: 0,
    question: "",
    solution: "",
    difficulty: "",
  });
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  // Fetch sets and flashcards when component mounts
  useEffect(() => {
    const getSets = async () => {
      try {
        const setsFromDb = await fetchSets();
        setSets(setsFromDb);
      } catch (error) {
        console.error("Error fetching sets:", error);
      }
    };

    getSets();
  }, []);

  const handleAddSet = async () => {
    if (!newSetName) {
      alert("Please provide a set name.");
      return;
    }
    try {
      const newSet = await createSet({ name: newSetName });
      setSets([...sets, newSet]);
      setNewSetName(""); // Reset the input
    } catch (error) {
      alert("Error adding set.");
    }
  };

  const handleAddFlashcard = async () => {
    if (!selectedSetId || !newFlashcard.question || !newFlashcard.solution || !newFlashcard.difficulty) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const newCard = await createFlashcard(newFlashcard);
      setFlashcards([...flashcards, newCard]);
      setNewFlashcard({ setId: 0, question: "", solution: "", difficulty: "" });
    } catch (error) {
      alert("Error adding flashcard.");
    }
  };

  const handleSelectSet = (setId: number) => {
    setSelectedSetId(setId);
    const fetchCards = async () => {
      try {
        const cardsFromDb = await fetchFlashcardSet(setId);
        setFlashcards(cardsFromDb);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };
    fetchCards();
  };

  const handleEditSet = async (setId: number, newName: string) => {
    try {
      const updatedSet = await updateSet(setId, { name: newName, description: "Updated description" });
      setSets(sets.map((set) => (set.id === setId ? updatedSet : set)));
      setNewSetName(""); // Clear the input after editing
    } catch (error) {
      alert("Error updating set.");
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

  // Function to handle card flip
  const handleFlipCard = (index: number) => {
    setFlippedCards((prev) => {
      const updatedFlippedCards = new Set(prev);
      if (updatedFlippedCards.has(index)) {
        updatedFlippedCards.delete(index); // Remove card from flipped set
      } else {
        updatedFlippedCards.add(index); // Add card to flipped set
      }
      return updatedFlippedCards;
    });
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

      {/* Flashcard Set Selection */}
      <div>
        <h3>Select a Set to Add Flashcards:</h3>
        <select
  value={selectedSetId || ""}
  onChange={(e) => handleSelectSet(Number(e.target.value))}
  className="p-2 border mb-4 w-full"
>
  <option value="">-- Select a Set --</option>
  {sets.map((set) => (
    <option key={set.id} value={set.id}>
      {set.name}
    </option>
  ))}
</select>

      </div>

      {/* Create Flashcard Section */}
      <div>
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
              placeholder="Enter difficulty"
              value={newFlashcard.difficulty}
              onChange={(e) => setNewFlashcard({ ...newFlashcard, difficulty: e.target.value })}
              className="p-2 border mb-4 w-full"
            />
            <button
              onClick={handleAddFlashcard}
              className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-green-500"
            >
              Add Flashcard
            </button>
          </div>
        )}
      </div>

      {/* Display Flashcards for the Selected Set */}
      <div>
        {sets.map((set) => (
          <div key={set.id}>
            {set.id === selectedSetId && (
              <div>
                <h3>{set.name} Flashcards:</h3>
                {flashcards
                  .filter((card) => card.setId === set.id)
                  .map((card, index) => (
                    <div
                      key={index}
                      className={`p-4 mb-4 rounded-lg shadow-lg cursor-pointer transform transition-transform ${flippedCards.has(index) ? "rotate-y-180" : "rotate-y-0"}`}
                      onClick={() => handleFlipCard(index)}
                    >
                      <div className="flex justify-between">
                        <div><strong>Question:</strong> {card.question}</div>
                        <div><strong>Difficulty:</strong> {card.difficulty}</div>
                      </div>
                      {flippedCards.has(index) && (
                        <div className="mt-4">
                          <strong>Solution:</strong> {card.solution}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardSetPage;
