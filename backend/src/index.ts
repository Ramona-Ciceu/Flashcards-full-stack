//backend/src/index
//Importing the necessary libraries and modules

import express from 'express';
import type { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { PrismaClient } from  '@prisma/client';
import bcrypt from 'bcryptjs';
//Configures the environment variables.
dotenv.config();
import jwt from 'jsonwebtoken';
import cors from 'cors'; 


//Initialising the Express application.
const app = express();

//Defining the listening Port.
const PORT = 3000;
//Middleware to parse Json§
app.use(express.json());
app.use(cors()); 
// Creating an instance of PrismaClient to interact with the database.
const prisma = new PrismaClient();
const SECRET_KEY = 'your_secret_key';

 
// ===========================
// ROUTES
// ===========================

//Checking health enpoints
app.get('/', (req: Request, res: Response) => {
    res.send('The active API version');
  });

  //Server will return a clean JSON response instead of the html error
app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

//Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Received login request: ${username}`);

  try {
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (user && user.password === password) {
      const token = 'some-generated-token'; // Use JWT or another method
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in.' });
  }
});

        
// ===========================
// Flashcard Set Routes
// ===========================
 // Get all flashcard sets
 app.get('/set', async (req: Request, res: Response) => {
  try {
    const sets = await prisma.set.findMany({
      select: { name: true },
    });

    if (sets.length === 0) {
       res.status(404).json({ error: 'No sets found.' });
       return;
    }

    res.status(200).json(sets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching sets.' });
  }
});


// Create a new set with a limit of 20 sets per day for non-admin users
app.post('/set', async (req: Request, res: Response) => {
  const { name, userId } = req.body;

  try {
    if (!name || !userId) {
      res.status(400).json({ error: 'Missing name or userId in request body' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Non-admin users can create a maximum of 20 sets per day
    if (user.role !== 'admin') {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const setsCreatedToday = await prisma.set.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      if (setsCreatedToday >= 20) {
        res.status(429).json({
          error: 'You have reached the maximum number of flashcard sets allowed today.',
        });
        return;
      }
    }

    // Create the new set
    const newSet = await prisma.set.create({
      data: { name, userId },
    });

    res.status(201).json(newSet);
  } catch (error) {
    console.error('Error creating set:', error);
    res.status(500).json({ error: 'Error creating set' });
  }
});

////Testing get request
app.get('/set/test', (req, res) => {
  res.status(200).send('Route is working');
});


// Get a specific set by ID
app.get('/set/:id', async (req: Request, res: Response) => {
 console.log('Route hit');
 
const { id } = req.params;
console.log(`Fetching set with ID: ${id}`);
try {
  const set = await prisma.set.findUnique({
   where: { id: Number(id) }  });

 if (!set) {
   console.log('Set not found');
    res.status(404).json({ error: 'Set not found' });
    return;
    }
  console.log('Set found: ', set);
  res.status(200).json(set);
  } 
catch (error) {
  console.error('Error fetching set:', error);
  res.status(500).json({ error: 'Error fetching set' });
  return;
  }
});

// Update a set by ID
app.put('/set/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
     res.status(400).json({ error: 'No fields to update' });
     return;
  }

  try {
    const updatedSet = await prisma.set.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.status(200).json(updatedSet);
  } catch (error) {
    res.status(404).json({ error: 'Set not found' });
  }
});

// Delete a set by ID
app.delete('/set/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.flashcard.deleteMany({ where: { setId: parseInt(id) } });
    await prisma.set.delete({ where: { id: parseInt(id) } });

    res.status(204).json({ message: 'Flashcard set deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting set' });
  }
});

// Get all flashcards in a specific set
app.get('/set/:id/flashcard', async (req: Request, res: Response) => {
  const { id } = req.params;
 
  console.log('Received id:', id); // Log the received id to check
  if (isNaN(Number(id))) {
     res.status(400).json({ error: 'Invalid set ID' });
     return;
  }


  const { shuffle } = req.query;
  
  try {
    let flashcards = await prisma.flashcard.findMany({
      where: { setId: Number(id) },
      select: { question: true, solution: true, difficulty: true },
    });

    if (shuffle === 'true') {
      flashcards = flashcards.sort(() => Math.random() - 0.5);
    }

    if (flashcards.length === 0) {
       res.status(404).json({ error: 'No flashcards found for the set' });
       return;
      }

    res.status(200).json(flashcards);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching flashcards' });
  }
});

// Create a flashcard in a specific set
app.post('/set/:id/flashcard', async (req: Request, res: Response) => {
  const {  question, solution, difficulty } = req.body;
  const {id: setId} = req.params;

  try {
    const set = await prisma.set.findUnique({ where: { id: Number(setId) } });

    if (!set) {
       res.status(404).json({ error: 'Set not found' });
       return;
    }

    const newFlashcard = await prisma.flashcard.create({
      data: {
        question,
        solution,
        difficulty,
        set: { connect: { id: Number(setId) } },
      },
    });

    res.status(201).json(newFlashcard);
    console.log('Received set ID:', setId);
  } catch (error) {
    res.status(500).json({ error: 'Error creating flashcard' });
  }
});

// Update a flashcard in a set
app.put('/set/:setId/flashcard/:flashcardId', async (req: Request, res: Response) => {
  const { setId, flashcardId } = req.params;
  const { question, solution, difficulty } = req.body;

  try {
    const flashcard = await prisma.flashcard.findUnique({ where: { id: Number(flashcardId) } });

    if (!flashcard) {
       res.status(404).json({ error: 'Flashcard not found' });
       return;
    }

    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: Number(flashcardId) },
      data: { question, solution, difficulty },
    });

    res.status(200).json(updatedFlashcard);
  } catch (error) {
    res.status(500).json({ error: 'Error updating flashcard' });
  }
});

// Delete a flashcard from a set
app.delete('/set/:setId/flashcard/:flashcardId', async (req: Request, res: Response) => {
  const { setId, flashcardId } = req.params;

  try {
    await prisma.flashcard.delete({ where: { id: Number(flashcardId) } });
    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting flashcard' });
  }
});

// ===========================
// Comment Routes (on Sets)
// ===========================
//POST: Comment on a flashcard set, by the current user
app.post('/set/:id/comments', async (req: Request, res: Response) => {
  const setId = Number(req.params.id);
  const { rating, comments, userId } = req.body; // Extract rating and comments

  //Ensuring that the comments field is not empty before accepting the request
  if (!comments || comments.trim() === '') {
    res.status(400).json({ error: 'Comment text cannot be empty' });
    return;
  }
  
  // Validate input
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    return;
  }
  

  try {
    // Ensure id is a valid number
    if (isNaN(setId)) {
       res.status(400).json({ error: 'Invalid setId' });
      return;
    }

    // Create a comment in the database
    const comment = await prisma.comment.create({
      data: {
        setId,
        userId,
        rating,
        comments,
      },
    });

    res.status(201).json(comment);
    console.log('Comment created');
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes('P2025')) {
       res.status(404).json({ error: 'The flashcard set was not found' });
       return;
      }
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ===========================
// User Routes
// ===========================
//Get all users
app.get('/user', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
         
            select: {
                username: true,
                role: true,

            }
        });
        //Return the flashcard set
        res.status(200).json(users);
    } catch (error) {
       res.status(500).json({ error: 'Error fetching users. ' });

    }
});
/*
validateUserInput checks if required fields (username, password, role) are present in the request body.
It also validates that the role is either 'admin' or 'user'.
If validation fails, it sends a 400 status code with an error message, 
otherwise, it calls next() to proceed to the next middleware or route handler.
*/
// Middleware for validating user input
const validateUserInput = (req: Request, res: Response, next: NextFunction): void => {
    const { username, password, role } = req.body;

    //Check for missing fields
    if (!username || !password ||  !role ) {
         res.status(400).json({ error: 'All fields are required: username, password, email, role, firstName, lastName.' });
         return;
    }

    // Check for valid roles
    if (role !== 'admin' && role !== 'user') {
        res.status(400).json({ error: 'Role must be either "admin" or "user".' });
        return;
    }
//This moves to the next middleware/handler if validation passes
    next(); 
};
/*
hashPassword is a middleware that hashes the user's password 
using bcrypt before saving it to the database.
It takes the password from the request body, hashes it with 10 salt rounds, 
and replaces the plaintext password with the hashed one.
*/
// Middleware for hashing passwords
const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password } = req.body;
        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    // Replace plaintext password with hashed password
        req.body.password = hashedPassword; 
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ error: 'An error occurred while processing the password.' });
    }
};
/*
POST /user creates a new user after validating input and hashing the password.
prisma.user.create() creates a new user record in the database
 with the provided username, password (hashed), and role.
On success, it returns the created user data with a 201 status code.
On failure, it logs the error and returns a 400 status with an error message.
*/
// Route to create a new user
app.post('/user',validateUserInput, hashPassword, async (req: Request, res: Response) => {
    const { username, password,  role, } = req.body;

    try {
        // Create the new user
        const user = await prisma.user.create({
            data: {
                username,
                password, 
                role,
               
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ error: 'The user could not be created.' });
        return;
    }
});
/*
GET /user/:id fetches a user by their ID.
prisma.user.findUnique() is used to find a single user based on the unique id.
If the user is found, it returns the user data, otherwise, it sends a 404 error.
*/
//Get a user by ID
app.get('/user/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const users = await prisma.user.findUnique({
         
            where: {
                id: Number(id),
                },
      
        });
        res.status(200).json(users);
        console.log("User found.");
    } catch (error) {
       res.status(404).json({ error: 'The user was not found' });

    }
});
/*
PUT /user/:id updates a user's details by their ID.
First, it checks if the user exists. Then, it hashes the password if it's provided.
The user is updated using prisma.user.update(). It returns the updated user data.
*/
app.put('/user/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  // Checking the admin status manually or via a header/authorization mechanism
  const isAdmin = req.headers['x-role'] === 'admin';

  // Log the role being sent and the current admin status
  console.log(`Role from request: ${role}, isAdmin: ${isAdmin}`);

  // Check if the user is allowed to change the role (only admin can assign roles)
  if (role !== undefined && !isAdmin) {
      res.status(403).json({
          error: 'Not authorized to change user role.',
      });
      return;
  }

  try {
      const numericId = Number(id);
      if (isNaN(numericId)) {
          res.status(400).json({ error: 'Invalid user ID' });
          return;
      }

      // Find user by ID
      const user = await prisma.user.findUnique({
          where: { id: numericId },
      });

      if (!user) {
          res.status(404).json({ error: 'User not found.' });
          return;
      }

      // Hash the password if provided
      const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

      // Update user with the provided data
      const updatedUser = await prisma.user.update({
          where: { id: numericId },
          data: {
              username: username || user.username, // Keep the existing username if not provided
              password: hashedPassword || user.password, // Keep the existing password if not provided
              role: role || user.role, // Keep the existing role if not provided
          },
      });

      // Return the updated user
      res.status(200).json(updatedUser);
      console.log('The updated user:', updatedUser);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
});
/*
DELETE /user/:id deletes a user by their ID.
prisma.user.delete() is used to remove the user from the database.
If the user is deleted successfully, it sends a 204 status code (no content). If the user doesn't exist, it sends a 404 error.
*/
app.delete('/user/:id', async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      await prisma.user.delete({
        where: {
          id: parseInt(userId),
        },
      });
      res.status(204).json({ message: 'The user  was deleted' });
    } catch (error) {
      res.status(404).json({ error: 'The user was not found' });
    }
  });
/*
GET /user/:userID/set fetches all flashcard sets associated with a user.
It first checks if the user exists and then retrieves 
all the flashcard sets associated with that user.
*/

app.get('/user/:userId/set', async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  console.log("Received userId:", userId); // Log the raw userId

  try {
    const numericUserId = Number(userId);
    console.log("Converted userId to number:", numericUserId); // Log the converted userId
    
    if (isNaN(numericUserId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: {
        id: numericUserId,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Retrieve all flashcard sets created by this user
    const flashcardSets = await prisma.set.findMany({
      where: {
        userId: numericUserId,
      },
    });

    res.status(200).json(flashcardSets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the flashcard sets' });
  }
});


/*
GET /user/:userId/collection fetches all collections created by a user.
This route queries the collection table in the database for collections linked to the given userId.
*/
app.get('/user/:userId/collection', async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { setId} = req.query;
  
    try {
      const numericUserId = Number(userId);
       if (isNaN(numericUserId)){
        res.status(400).json({error: 'Invalid user ID'});
        return;
       }
      // check if user exists
      const user = await prisma.user.findUnique({
        where: {
          id: numericUserId,
        
        },
      })
   
     
  
      // If user or set is not found, return a 404 error
      if (!user ) {
         res.status(404).json({ error: 'User or set not found' });
      }
      
  
      // Retrieve all flashcard collection created by this user
      const flashcardCollection = await prisma.collection.findMany({
        where: {
            // 'userId' is a foreign key in the collection model
            userId: numericUserId,
            setId: Number (setId)
        },
        include:{
            set: true,
        }
      });
  
      // Return the list of flashcard colleciton
      res.status(200).json(flashcardCollection);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the flashcard collection.' })
      return;
    }
  });

//Fetches a specific flashcard collection by its userId and collectionId. 
//The route ensures the userId and collectionId are valid numbers.
app.get('/user/:userId/collection/:collectionId', async (req: Request, res: Response) => {
    const { userId, collectionId } = req.params;

    try {
        // Convert userId and collectionId to numbers, handle NaN cases
        const parsedUserId = parseInt(userId, 10);
        const parsedCollectionId = parseInt(collectionId, 10);

        if (isNaN(parsedUserId) || isNaN(parsedCollectionId)) {
             res.status(400).json({ error: 'Invalid userId or collectionId. They must be numbers.' });
             return;
        }

        // Find the collection by ID and user ID
        const collection = await prisma.collection.findFirst({
            where: {
                id: parsedCollectionId,
                userId: parsedUserId,
            },
            include: {
                set: true,
                user: true,
            },
        });

        // If collection is not found, return a 404 error
        if (!collection) {
             res.status(404).json({ error: 'Collection not found' });
             return;
        }

        // Return the collection data
        res.status(200).json(collection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the flashcard collection.' });
       return;
    }
});

// Updates an existing collection by its id.
//It allows updating the comments and setId.
app.put('/collection/:id', async (req: Request, res: Response) => {
  const collectionId = parseInt(req.params.id, 10);
  const { title, userId, setId, comment } = req.body;

  if (isNaN(collectionId)) {
     res.status(400).json({ message: 'Invalid collection ID' });
     return;
    }

  try {
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
       res.status(404).json({ message: 'Collection not found' });
       return;
      }

    const updatedCollection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        title: title, // Update title
        userId: userId ? Number(userId) : undefined,
        setId: setId ? Number(setId) : undefined,
        comment: comment, 
      },
      include: {
        set: true,
        user: true,
      },
    });

     res.status(200).json(updatedCollection);
     return;
  } catch (error) {
    console.error(error);
     res.status(500).json({ message: 'Internal Server Error' });
     return;
    }
});

   
// DELETE endpoint to delete a flashcard set collection by ID
app.delete('/collection/:id', async (req: Request, res: Response) => {
    const collectionId = parseInt(req.params.id, 10);
  
    try {
      // Ensure collectionId is a valid number
       if (isNaN(collectionId)) { 
         res.status(400).json({ message: 'Invalid collection ID' }); 
         return; }
      // Check if the collection exists
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
      });
  
      if (!collection) {
         res.status(404).json({ message: 'Collection not found' });
         return;
      }
  
      // Delete the collection
      await prisma.collection.delete({
        where: { id: collectionId },
      });
  
      // Respond with 204 No Content (successfully deleted)
       res.status(204).send();
       return;
  
    } catch (error) {
      console.error(error);
       res.status(500).json({ message: 'Internal Server Error' });
       console.log(error);
    }
  });

app.get('/collection', async (req: Request, res: Response) => {
    try {
      // Retrieve all collections with associated set, user, and comment
      const collections = await prisma.collection.findMany({
        include: {
          set: true,     
          user: true,    
         
        },
      });
  
      // Respond with the list of collections
       res.status(200).json(collections);
       return;
  
    } catch (error) {
      console.error(error);
       res.status(500).json({ message: 'Internal Server Error' });
       return;
    }
  });
/*
POST /collection creates a new collection.
It stores a title, userId, and description in the collection table.
*/
app.post('/collection', async (req: Request, res: Response) => {
  const { setId, userId, title, comment } = req.body;

  // Ensure the necessary fields are provided
  if (!setId || !userId || !title || comment) {
     res.status(400).json({ message: 'setId, userId,comment and title are required' });
     return;
  }

  try {
    // Check if the flashcard set exists
    const flashcardSet = await prisma.set.findUnique({
      where: { id: setId },
    });

    if (!flashcardSet) {
       res.status(404).json({ message: 'The flashcard set was not found' });
       return;
    }

    // Create the new collection
    const newCollection = await prisma.collection.create({
      data: {
        title: title,    
        comment: comment, 
        setId: setId,
        userId: userId,
      },
      include: {
        set: true,
        user: true,
      },
    });

    // Return the created collection
    res.status(201).json(newCollection);
    return;

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
});

 // GET /collections/random: Redirect to a random flashcard set collection.
app.get('/collections/random', async (req: Request, res: Response) => {
  try {
    const collections = await prisma.collection.findMany();
    const randomCollection = collections[Math.floor(Math.random() * collections.length)];
    res.redirect(`/collections/${randomCollection.id}`);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching random collection' });
    return;
  }
});


// POST /telemetry: creates a new telemetry entry that records user activity, 
//storing the userId, activity, and timestamp in the telemetry table.
app.post('/telemetry', async (req: Request, res: Response) => {
  const { eventType, userId, additionalInfo } = req.body;

  // Validate required fields
  if (!eventType || !userId) {
     res.status(400).json({ error: 'eventType and userId are required' });
     return;
  }

  try {
    const telemetry = await prisma.telemetry.create({
      data: {
        eventType,
        userId: Number(userId),
        additionalInfo: additionalInfo || null, 
      },
    });
    res.status(201).json(telemetry);
  } catch (error) {
    res.status(500).json({ error: 'Error creating telemetry entry' });
    return;
  }
});


// ===========================
// Start the Server
// ===========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
 export default app;