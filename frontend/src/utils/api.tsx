//frontend/src/utils/api.tsx
import axios from 'axios';
import { Flashcard, Sets} from "../Types/type";

//
// SET CALLS
//
//Fetch all the flashcards sets
export const fetchSets = async () => {
  const response = await fetch("http://localhost:3000/set", { method: "GET"});
  console.log(response)
  if (!response.ok) throw new Error("Failed to fetch sets");
  return response.json();
};
//Create a new flashcard set
export const createSet = async (set: { name: string; userId: string }) => {
  const response = await fetch("http://localhost:3000/set", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(set),
  });
  console.log(response)
  if (!response.ok) throw new Error("Failed to create set");
  return response.json();
};

//Fetch a specific set by ID
export const fetchSetById = async (id: number) => {
  const response = await fetch(`http://localhost:3000/set/${id}`, { method: "GET"});
  const json = await response.json();
  return json.data
};

// Update an existing flashcard set by ID
export const updateSet = async (id: number, updates: { name: string;  }) => {
  const response = await fetch(`http://localhost:3000/set/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update set");
  return response.json();
};

// Delete a flashcard set by ID
export const deleteSet = async (id: number) => {
  const response = await fetch(`http://localhost:3000/set/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete set");
};

// Example: Create comments for a specific set
export const createCommentsBySetId = async (id: number) => {
  const response = await fetch(`http://localhost:3000/set/${id}/comments`, { method: "POST"});
  const json = await response.json()
  return json.data;
};

//
// FLASHCARD SET CALLS
//
//Get flashcards by set ID
export const fetchFlashcardSet = async (id: number) => {
  const response = await fetch(`http://localhost:3000/set/${id}/flashcard`, { method: "GET"});
  if (!response.ok) throw new Error("Failed to fetch flashcards");
  return response.json();
};

// Create a new flashcard
export const createFlashcard = async (id: number, flashcard: { 
  question: string; 
  solution: string; 
  difficulty: string; 
}) => {
  const response = await fetch(`http://localhost:3000/set/${id}/flashcard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: flashcard.question,
      solution: flashcard.solution,
      difficulty: flashcard.difficulty,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create flashcard");
  }
  return response.json();
};


// Update flashcard set
export const updateFlashcardSet = async (data: { setId: number; question: string; solution: string; difficulty: string; flashcardId: number; }) => {
  const response = await fetch(`http://localhost:3000/set/${data.setId}/flashcard/${data.flashcardId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
  const json = await response.json()
  return json.data
};

// Delete flashcard set
export const deleteFlashcardSet = async (setId: number, flashcardId: number) => {
  const response = await fetch(`http://localhost:3000/set/${setId}/flashcard/${flashcardId}`, {
    method: "DELETE"
  });
  const json = await response.json()
  return json.data;
};

//
// USER CALLS
//
export const fetchUser = async () => {
  const response = await fetch(`http://localhost:3000/user`, {
    method: "GET"
  });  
  const json = await response.json()
  return json.data;
};


// Example: Fetch user details by user ID
export const fetchUserById = async (id: number) => {
  const response = await fetch(`http://localhost:3000/user/${id}`, {
    method: "GET"
  });
  const json = await response.json()
  return json.data;
};

// Create a new user
export const createUser = async (data: {
  username: string;
  password: string;
  role: string; }) => {
  const response = await fetch(`http://localhost:3000/user`, {
    method: "POST",
    body: JSON.stringify(data)
  });
  const json = await response.json()
  return json.data;
};



// Update user by ID
export const updateUser = async (id: number, data: {
  username?: string;
  password?: string;
  role?: string;
}) => {
  const response = await fetch(`http://localhost:3000/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
  const json = await response.json()
  return json.data;
};

// Delete a user by ID
export const deleteUser = async (id: number) => {
  const response = await fetch(`http://localhost:3000/user/${id}`, {
    method: "DELETE"
  });
  const json = await response.json()
  return json.data;
};

// Get all flashcard sets by user ID
export const fetchSetsByUser = async (userId: number) => {
  const response = await fetch(`http://localhost:3000/user/${userId}/set`, {
    method: "GET"
  });
  const json = await response.json()
  return json.data;
};


//
// COLLECTIONS CALLS
//
// Get all flashcard set collections created by a user
export const getFlashcardCollectionsByUser = async (userId: number, setId: number) => {
    try {
        const response = await axios.get(`http://localhost:3000/user/${userId}/collection`, {
            params: { setId },
        });
        return response.data;  // Return the collection data
    } catch (error) {
        console.error('Error fetching flashcard collections:', error);
        throw error;
    }
};

// Get a flashcard set collection by ID
export const getFlashcardCollectionById = async (userId: number, collectionId: number) => {
    try {
        const response = await axios.get(`http://localhost:3000/user/${userId}/collection/${collectionId}`);
        return response.data;  // Return the collection data
    } catch (error) {
        console.error('Error fetching flashcard collection:', error);
        throw error;
    }
};

// Create a new flashcard set collection
export const createFlashcardCollection = async (comments: string, setId: number,userId: number, title?: string) => {
    try {
        const response = await axios.post(`http://localhost:3000/collections`, {
            comments,
            setID: setId,
            title
        });
        return response.data;  // Return the newly created collection data
    } catch (error) {
        console.error('Error creating flashcard collection:', error);
        throw error;
    }
};

// Update a flashcard set collection by ID
export const updateFlashcardCollection = async (collectionId: number, comments: string, setId: number, userId:number, title:string) => {
    try {
        const response = await axios.put(`http://localhost:3000/collection/${collectionId}`, {
          collectionId,
            comments,
            title,
            setId,
            userId
        });
        return response.data;  // Return the updated collection data
    } catch (error) {
        console.error('Error updating flashcard collection:', error);
        throw error;
    }
};

// Delete a flashcard set collection by ID
export const deleteFlashcardCollection = async (collectionId: number) => {
    try {
        await axios.delete(`http://localhost:3000/collection/${collectionId}`);
        return true;  // Return true if deletion was successful
    } catch (error) {
        console.error('Error deleting flashcard collection:', error);
        throw error;
    }
};

// Get all flashcard collections
export const getAllFlashcardCollections = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/collection`);
        return response.data;  // Return all collections
    } catch (error) {
        console.error('Error fetching all flashcard collections:', error);
        throw error;
    }
};

// Get a random flashcard set collection
export const getRandomFlashcardCollection = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/collection/random`);
        return response.data;  // Return the random collection data
    } catch (error) {
        console.error('Error fetching random flashcard collection:', error);
        throw error;
    }
};

// Create a telemetry entry
export const createTelemetry = async (eventType: string, userId: number, additionalInfo?: string) => {
    try {
        const response = await axios.post(`http://localhost:3000/telemetry`, {
            eventType,
            userId,
            additionalInfo
        });
        return response.data;  // Return the created telemetry entry
    } catch (error) {
        console.error('Error creating telemetry entry:', error);
        throw error;
    }
};
