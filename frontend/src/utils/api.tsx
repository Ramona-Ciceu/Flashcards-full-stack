//frontend/src/utils/api.tsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Backend URL
});

//Fetch all the flashcards sets
export const fetchSets = async () => {
  const response = await api.get(`/set`);
  return response.data;
};
//Create a new flashcard set
export const createSet = async (data: { name: string; }) => {
  const response = await api.post('/set', data);
  return response.data;
};
// /axiosobject/set/2
//Fetch a specific set by ID
export const fetchSetById = async (id: number) => {
  const response = await api.get(`/set/${id}`);
  return response.data;
};

// Update an existing flashcard set by ID
export const updateSet = async (id: number, data: { name: string; description: string }) => {
  const response = await api.put(`/set/${id}`, data);
  return response.data;
};

// Delete a flashcard set by ID
export const deleteSet = async (id: number) => {
  const response = await api.delete(`/set/${id}`);
  return response.data;
};

// Example: Create comments for a specific set
export const createCommentsBySetId = async (setId: number) => {
  const response = await api.post(`/set/${setId}/comments`);
  return response.data;
};
//Get flashcards by set ID
export const fetchFlashcardSet = async(id: number)=>{
  const response = await api.get('/set/:id/flashcard');
  return response.data;
}

// Create a new flashcard
export const createFlashcard = async (data: { setId: number; question: string; solution: string; difficulty: string; }) => {
  const response = await api.post('set/:id/flashcard', data);
  return response.data;
};
// Update flashcard set
export const updateFlashcardSet = async (data: { setId: number; question: string; solution: string; difficulty: string; }) => {
  const response = await api.put('/set/:setId/flashcard/:flashcardId', data);
  return response.data;
};

// Delete flashcard set
export const deleteFlashcardSet = async (id: number) => {
  const response = await api.delete(`/set/:setId/flashcard/:flashcardId`);
  return response.data;
};


export const fetchUser = async () => {
  const response = await api.get(`/user`);  
  return response.data;
};


// Example: Fetch user details by user ID
export const fetchUserById = async (id: number) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

// Create a new user
export const createUser = async (data: {
  username: string;
  password: string;
  role: string; }) => {
  const response = await api.post(`/user`, data);
  return response.data;
};



// Update user by ID
export const updateUser = async (id: number, data: {
  username?: string;
  password?: string;
  role?: string;
}) => {
  const response = await api.put(`/user/${id}`, data);
  return response.data;
};

// Delete a user by ID
export const deleteUser = async (id: number) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};

// Get all flashcard sets by user ID
export const fetchSetsByUser = async (userId: number) => {
  const response = await api.get(`/user/${userId}/set`);
  return response.data;
};



// Get all flashcard set collections created by a user
export const getFlashcardCollectionsByUser = async (userId: number, setId: number) => {
    try {
        const response = await axios.get(`/users/${userId}/collection`, {
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
        const response = await axios.get(`/user/${userId}/collection/${collectionId}`);
        return response.data;  // Return the collection data
    } catch (error) {
        console.error('Error fetching flashcard collection:', error);
        throw error;
    }
};

// Create a new flashcard set collection
export const createFlashcardCollection = async (comment: string, setId: number, name?: string) => {
    try {
        const response = await axios.post(`/collections`, {
            comment,
            setID: setId,
            name
        });
        return response.data;  // Return the newly created collection data
    } catch (error) {
        console.error('Error creating flashcard collection:', error);
        throw error;
    }
};

// Update a flashcard set collection by ID
export const updateFlashcardCollection = async (collectionId: number, comments: string, setId: number) => {
    try {
        const response = await axios.put(`/collection/${collectionId}`, {
            comments,
            setId
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
        await axios.delete(`/collection/${collectionId}`);
        return true;  // Return true if deletion was successful
    } catch (error) {
        console.error('Error deleting flashcard collection:', error);
        throw error;
    }
};

// Get all flashcard collections
export const getAllFlashcardCollections = async () => {
    try {
        const response = await axios.get(`/collections`);
        return response.data;  // Return all collections
    } catch (error) {
        console.error('Error fetching all flashcard collections:', error);
        throw error;
    }
};

// Get a random flashcard set collection
export const getRandomFlashcardCollection = async () => {
    try {
        const response = await axios.get(`/collections/random`);
        return response.data;  // Return the random collection data
    } catch (error) {
        console.error('Error fetching random flashcard collection:', error);
        throw error;
    }
};

// Create a telemetry entry
export const createTelemetry = async (eventType: string, userId: number, additionalInfo?: string) => {
    try {
        const response = await axios.post(`/telemetry`, {
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




export default api;



