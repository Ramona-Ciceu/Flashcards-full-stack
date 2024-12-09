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


// Update flashcard set byt flashcard id
export const updateFlashcardSet = async (data: { setId: number; question: string; solution: string; difficulty: string; flashcardId: number; }) => {
  const response = await fetch(`http://localhost:3000/set/${data.setId}/flashcard/${data.flashcardId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
  const json = await response.json()
  return json.data
};

// Delete flashcard set by flashcard id
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
/* Sign-up user
export const signupUser = async (data: { username: string, password: string, role: string }) => {
  
    const response = await fetch('http://localhost:3000/signup',{
      method: "POST"
  } );
    const json = await response.json()
    return json.data;
};
*/
//Login user
export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`http://localhost:3000/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return await response.json();
};


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
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    });
    console.log(response)
    const json = await response.json()
    return json;
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
//Get the collection by user id
export const getFlashcardCollectionsByUser= async (userId: number) => {
  const response = await fetch(`http://localhost:3000/user/${userId}/collection`, {
    method: "GET"
  });
  const json = await response.json()
  return json.data;
};


// Get a flashcard set collection by ID
export const getFlashcardCollectionById = async(userId: number, collectionId: number) => {
 
  const response = await fetch(`http://localhost:3000/user/${userId}/collection/${collectionId}`, {
    method: "GET"
  });
  const json = await response.json()
  return json.data;
};



export async function addSetToCollection(collectionId: number, setId: number) {
  await fetch(`http://localhost:3000/collections/${collectionId}/sets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ setId }),
  });
};

// Create a new collection
export const createFlashcardCollection = async ( collection:{
  title?: string, setId?: number, userId?: number, comment?: string}
) => {
  const response = await fetch(`http://localhost:3000/collection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(collection),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create collection");
  }
  return response.json();
};

// Update collection
export const updateFlashcardCollection = async (
  collectionId: number, updates:{comment: string, title:string}
) => {
  const response = await fetch(`http://localhost:3000/collection/${collectionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update collection");
  }
  return response.json();
};

// Delete a flashcard collection by ID
export const deleteFlashcardCollection = async (collectionId: number) => {
  const response = await fetch(`http://localhost:3000/collection/${collectionId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete collection");
};

// Get all flashcard collections
export const getAllFlashcardCollections = async () => {
  const response = await fetch("http://localhost:3000/collection", { method: "GET"});
  if (!response.ok) throw new Error("Failed to fetch collection");
  return response.json();
};

// Get random flashcard collections
export const getRandomFlashcardCollection = async () => {
  const response = await fetch("http://localhost:3000/collection/random", { method: "GET"});
  console.log(response)
  if (!response.ok) throw new Error("Failed to fetch collection randomly");
  return response.json();
};


// Create a telemetry entry
export const createTelemetry = async (data:{
  eventType: string, userId: number, additionalInfo?: string}
) => {
  const response = await fetch(`http://localhost:3000/telemetry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create telemetry");
  }
  const json = await response.json()
  return json.data;
};




