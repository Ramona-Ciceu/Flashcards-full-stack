import React, { useState, useEffect } from "react";
import { fetchFlashcardSet } from "../utils/api";

// Define an interface for the flashcard
interface Flashcard {
  setId: number;
  question: string;
  solution: string;
  difficulty: string;
}

const FlashcardSetPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newFlashcard, setNewFlashcard] = useState<Flashcard>({
    setId: 0,
    question: "",
    solution: "",
    difficulty: "",
  });
  const [flashcardCount, setFlashcardCount] = useState<number>(0);
  const [expandedSets, setExpandedSets] = useState<Set<number>>(new Set());
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  useEffect(() => {
    const existingFlashcards: Flashcard[] = [
      { setId: 1, question: "What is the capital of France?", solution: "Paris", difficulty: "easy" },
      { setId: 1, question: "What is the capital of Italy?", solution: "Rome", difficulty: "easy" },
      { setId: 2, question: "What is 2 + 2?", solution: "4", difficulty: "easy" },
    ];
    setFlashcards(existingFlashcards);
    setFlashcardCount(existingFlashcards.length);
  }, []);

  const handleAddFlashcard = () => {
    if (flashcardCount >= 20) {
      alert("You cannot add more than 20 flashcards today.");
      return;
    }

    if (newFlashcard.setId === 0 || !newFlashcard.question || !newFlashcard.solution || !newFlashcard.difficulty) {
      alert("Please provide setId, question, solution, and difficulty.");
      return;
    }

    const newCard: Flashcard = {
      setId: newFlashcard.setId,
      question: newFlashcard.question,
      solution: newFlashcard.solution,
      difficulty: newFlashcard.difficulty,
    };
    setFlashcards([...flashcards, newCard]);
    setFlashcardCount(flashcardCount + 1);
    setNewFlashcard({ setId: 0, question: "", solution: "", difficulty: "" });
  };

  const handleFlip = (index: number) => {
    setFlipped((prevFlipped) => {
      const newFlipped = new Set(prevFlipped);
      if (newFlipped.has(index)) {
        newFlipped.delete(index);
      } else {
        newFlipped.add(index);
      }
      return newFlipped;
    });
  };

  const handleToggleSet = (setId: number) => {
    const newExpandedSets = new Set(expandedSets);
    if (newExpandedSets.has(setId)) {
      newExpandedSets.delete(setId);
    } else {
      newExpandedSets.add(setId);
    }
    setExpandedSets(newExpandedSets);
  };

  const groupFlashcardsBySetId = () => {
    return flashcards.reduce((groups, card: Flashcard) => {
      const { setId } = card;
      if (!groups[setId]) {
        groups[setId] = [];
      }
      groups[setId].push(card);
      return groups;
    }, {} as Record<number, Flashcard[]>);
  };

  const groupedFlashcards = groupFlashcardsBySetId();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Create Flashcard</h2>
      <div className="mb-6">
        <input
          type="number"
          placeholder="Enter set ID"
          value={newFlashcard.setId}
          onChange={(e) => setNewFlashcard({ ...newFlashcard, setId: parseInt(e.target.value, 10) })}
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
          className="p-2 bg-cyan-500 text-white rounded-lg hover:bg-green-600"
        >
          Add Flashcard
        </button>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Flashcards</h3>
      <h4>Click on the flahscard to reveal the solution. </h4>
      {Object.keys(groupedFlashcards).map((setId) => (
        <div key={setId}>
          <h4 className="text-xl font-bold mb-2">Set ID: {setId}</h4>
          <button
            onClick={() => handleToggleSet(Number(setId))}
            className="mb-4 p-2 bg-cyan-500 text-white rounded-lg hover:bg-green-600"
          >
            {expandedSets.has(Number(setId)) ? "Hide Flashcards" : "Show Flashcards"}
          </button>
          {expandedSets.has(Number(setId)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedFlashcards[Number(setId)].map((card, index) => (
                <div key={index} className="bg-cyan-100 shadow-lg rounded-lg overflow-hidden">
                  <div className="p-4 flex flex-col items-start h-40">
                    <div className="text-sm text-gray-500 mb-2">
                      <strong>Difficulty:</strong> {card.difficulty}
                    </div>
                    <div className="flex-grow flex items-center justify-center w-full">
                      <div>
                        <strong className="block text-gray-800">
                          {flipped.has(index) ? "Solution:" : "Question:"}
                        </strong>
                        <span
                          className="font-bold cursor-pointer text-blue-500"
                          onClick={() => handleFlip(index)}
                        >
                          {flipped.has(index) ? card.solution : card.question}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FlashcardSetPage;
