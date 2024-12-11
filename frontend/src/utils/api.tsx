//frontend/src/utils/api.tsx
import axios from 'axios';
import { Flashcard, Sets} from "../Types/type";


//
// SET CALLS
//
//Fetch all the flashcards sets
export const fetchSets = async () => {
  try{
  const response = await fetch("http://localhost:3000/set", { method: "GET"});
  console.log(response)
  if (!response.ok) {
    const errorData = await response.json();
   throw new Error(errorData.error || "Failed to fetch set");
  }
  return response.json();
  } catch (error){
    console.error("fetchSets Error:", error);
    throw error;
  }
};
// Create a new flashcard set
export const createSet = async (set: { name: string; userId: string }) => {
  try {
    const response = await fetch("http://localhost:3000/set", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(set), // Include the set data in the request body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create set");
    }

    return response.json();
  } catch (error) {
    console.error("createSet Error", error);
    throw error;
  }
};


//Fetch a specific set by ID
export const fetchSetById = async (id: number) => {
  try{
  const response = await fetch(`http://localhost:3000/set/${id}`,
     { method: "GET"});
     if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to fetch set with ID ${id}`);
    }
  const json = await response.json();
  return json.data
  } catch (error){
    console.error("fetchSetById error", error);
    throw error;
  }
};

// Update an existing flashcard set by ID
export const updateSet = async (id: number, updates: { name: string;  }) => {
  try{
  const response = await fetch(`http://localhost:3000/set/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),});
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update set")
  }
  return response.json();
} catch (error){
  console.error("updateSet error", error)
  throw error;
}
};

// Delete a flashcard set by ID
export const deleteSet = async (id: number) => {
  try{
  const response = await fetch(`http://localhost:3000/set/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete set");}
  } catch(error){
    console.error("deleteSet error", error)
    throw error;
  }
  };

export const createCommentsBySetId = async (id: number, rating: number, comments: string, userId: number) => {
  try{
  const response = await fetch(`http://localhost:3000/set/${id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating,
      comments,
      userId,
    }),
  });

  if (!response.ok) {
    // Handle error cases (e.g., invalid input, server issues)
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create comment");
  }

  const json = await response.json();
  return json; // Return the entire response to access all fields
} catch (error){
  console.error("createCommentsbySetId error", error)
}
};


//
// FLASHCARD SET CALLS
//
//Get flashcards by set ID
export const fetchFlashcardSet = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:3000/set/${id}/flashcard`, {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error("Failed to fetch flashcards");
    }

    const data = await response.json();
    console.log(data)
    return data; 
  } catch (error) {
    console.error("fetchFlashcardSet error", error);
  }
};

// Create a new flashcard
export const createFlashcard = async (id: number, flashcard: { 
  question: string; 
  solution: string; 
  difficulty: string; 
}) => {
  try{
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
} catch(error){
  console.error("createFlashcard error", error)
}
};


// Update flashcard set byt flashcard id
export const updateFlashcardSet = async (data: { setId: number; question: string; solution: string; difficulty: string; flashcardId: number; }) => {
  try{
  const response = await fetch(`http://localhost:3000/set/${data.setId}/flashcard/${data.flashcardId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
  const json = await response.json()
  return json.data
} catch(error){
  console.error("updateFlashcardSet error", error)
}
};

// Delete flashcard set by flashcard id
export const deleteFlashcardSet = async (setId: number, flashcardId: number) => {
 try{
  const response = await fetch(`http://localhost:3000/set/${setId}/flashcard/${flashcardId}`, {
    method: "DELETE"
  });
  const json = await response.json()
  return json.data;
} catch (error){
  console.error("deleteFlashcardSet error", error)
}
};

//
// USER CALLS
//

//Login user
export const loginUser = async (username: string, password: string) => {
  try{
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
} catch (error){
  console.error("loginUser error", error)
  throw error;
}
};


export const fetchUser = async () => {
  try{
  const response = await fetch(`http://localhost:3000/user`, {
    method: "GET"
  });  
  const json = await response.json()
  return json.data;
} catch (error){
  console.error("fetchUser error", error)
}
};


// Example: Fetch user details by user ID
export const fetchUserById = async (id: number) => {
  try{
  const response = await fetch(`http://localhost:3000/user/${id}`, {
    method: "GET"
  });
  const json = await response.json()
  return json.data;
} catch (error) {
console.error("fetchUserById error", error)
}
};

// Create a new user
export const createUser = async (data: {
  username: string;
  password: string;
  role: string; }) => {
    try{
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
  } catch(error){
    console.error("createUser error", error)
  }
};



// Update user by ID
export const updateUser = async (id: number, data: {
  username?: string;
  password?: string;
  role?: string;
}) => {
  try{
  const response = await fetch(`http://localhost:3000/user/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
  const json = await response.json()
  return json.data;
} catch (error){
  console.error("updateUser error", error)
}
};

// Delete a user by ID
export const deleteUser = async (id: number) => {
  try{
  const response = await fetch(`http://localhost:3000/user/${id}`, {
    method: "DELETE"
  });
  const json = await response.json()
  return json.data;
} catch(error){
  console.error("deleteUser error", error)
}
};

// Get all flashcard sets by user ID
export const fetchSetsByUser = async (userId: number) => {
  try{
  const response = await fetch(`http://localhost:3000/user/${userId}/set`, {
    method: "GET"
  });
  const json = await response.json()
  return json.data;}
  catch(error){
    console.error("fetchSetsByUser error", error)
  }
};


//
// COLLECTIONS CALLS
//
//Get the collection by user id
export const getFlashcardCollectionsByUser= async (userId: number) => {
  try{
  const response = await fetch(`http://localhost:3000/user/${userId}/collection`, {
    method: "GET"
  });
  const json = await response.json()
  return json.data;
} catch(error){
  console.error("getFlashcardCollectionsByUser error", error)
}
};


// Get a flashcard set collection by ID
export const getFlashcardCollectionById = async(userId: number, collectionId: number) => {
 try{
  const response = await fetch(`http://localhost:3000/user/${userId}/collection/${collectionId}`, {
    method: "GET"
  });
  const json = await response.json()
  return json.data;
} catch(error){
  console.error("getFlashcardCollectionById error", error)
}
};



export async function addSetToCollection(collectionId: number, setId: number) {
  try{
  await fetch(`http://localhost:3000/collections/${collectionId}/sets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ setId }),
  });
}catch(error){
  console.error("addSetToCollection error", error)
}
};

// Create a new collection
export const createFlashcardCollection = async ( collection:{
  title?: string, setId?: number, userId?: number, comment?: string}
) => {
  try{
  const response = await fetch(`http://localhost:3000/collection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(collection),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create collection");
  }
  return response.json();
} catch(error){
  console.error("createFlashcardCollection error", error)
}
};

// Update collection
export const updateFlashcardCollection = async (
  collectionId: number, updates:{comment: string, title:string}
) => {
  try{
  const response = await fetch(`http://localhost:3000/collection/${collectionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update collection");
  }
  return response.json();
} catch(error){
  console.error("updateFlashcardCollection error", error)
}
};

// Delete a flashcard collection by ID
export const deleteFlashcardCollection = async (collectionId: number) => {
  try{
  const response = await fetch(`http://localhost:3000/collection/${collectionId}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete collection");
  } catch(error){
    console.error("deleteFlashcardCollection error");
  }
};

// Get all flashcard collections
export const getAllFlashcardCollections = async () => {
  try{
  const response = await fetch("http://localhost:3000/collection", { method: "GET"});
  if (!response.ok) throw new Error("Failed to fetch collection");
  return response.json();
  } catch(error){
    console.error("getAllFlashcardCollections error", error)
  }
};

// Get random flashcard collections
export const getRandomFlashcardCollection = async () => {
  try{
  const response = await fetch("http://localhost:3000/collection/random", { method: "GET"});
  console.log(response)
  if (!response.ok) throw new Error("Failed to fetch collection randomly");
  return response.json();
  } catch(error){
    console.error("getRandomFlashcardCollection error", error)
  }
};


// Create a telemetry entry
export const createTelemetry = async (data:{
  eventType: string, userId: number, additionalInfo?: string}
) => {
  try{
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
} catch(error){
  console.error("createTelemetry error", error)
}``
};




