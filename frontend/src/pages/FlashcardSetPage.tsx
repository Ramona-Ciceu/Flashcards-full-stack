//src/pages/FlashcardSetPage
import React, { useState, useEffect } from "react";
import { fetchFlashcardSet } from "../utils/api";

const FlashcardSetPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<any[]>([]); // To hold the flashcards
  const [newFlashcard, setNewFlashcard] = useState({
    setId: "", // Add setId in the form state
    question: "",
    solution: "",
    difficulty: "",
  });

  const [flashcardCount, setFlashcardCount] = useState<number>(0);

  // Fetching existing flashcards (replace with API calls in real-world usage)
  useEffect(() => {
    // Assuming you fetch flashcards from a backend and count them
    const existingFlashcards = [
      { setId: "1", question: "What is the capital of France?", solution: "Paris", difficulty: "easy" },
      { setId: "1", question: "What is the capital of Italy?", solution: "Rome", difficulty: "easy" },
    ];
    setFlashcards(existingFlashcards);
    setFlashcardCount(existingFlashcards.length);
  }, []);

  // Handle adding new flashcards
  const handleAddFlashcard = () => {
    if (flashcardCount >= 20) {
      alert("You cannot add more than 20 flashcards today.");
      return;
    }

    if (!newFlashcard.setId || !newFlashcard.question || !newFlashcard.solution || !newFlashcard.difficulty) {
      alert("Please provide setId, question, solution and difficulty.");
      return;
    }

    const newCard = {
      setId: newFlashcard.setId,
      question: newFlashcard.question,
      solution: newFlashcard.solution,
      difficulty: newFlashcard.difficulty,
    };
    setFlashcards([...flashcards, newCard]);
    setFlashcardCount(flashcardCount + 1); // Increase the count
    // Resetting the form
    setNewFlashcard({ setId: "", question: "", solution: "", difficulty: "" });
  };

  // Flip flashcard state management
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const handleFlip = (index: number) => {
    const newFlipped = new Set(flipped);
    if (newFlipped.has(index)) {
      newFlipped.delete(index);
    } else {
      newFlipped.add(index);
    }
    setFlipped(newFlipped);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Flashcard Set</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter set ID"
          value={newFlashcard.setId}
          onChange={(e) => setNewFlashcard({ ...newFlashcard, setId: e.target.value })}
          className="p-2 border mb-4 w-full"
        />
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
          placeholder="Enter difficulty: easy, medium or hard."
          value={newFlashcard.difficulty}
          onChange={(e) => setNewFlashcard({ ...newFlashcard, difficulty: e.target.value })}
          className="p-2 border mb-4 w-full"
        />
        <button
          onClick={handleAddFlashcard}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Flashcard
        </button>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Flashcards</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcards.map((card, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
              <div>
                <strong className="block text-gray-800">Q:</strong>
                <span
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleFlip(index)}
                >
                  {flipped.has(index) ? card.solution : card.question}
                </span>
              </div>
              <div className="mt-2">
                {flipped.has(index) }
              </div>
              <div className="mt-2 text-gray-600">
                <strong>Set ID:</strong> {card.setId}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <strong>Difficulty:</strong> {card.difficulty}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardSetPage;
