//backend/src/index
//Importing the necessary libraries and modules

import express from 'express';
import type { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
//import { request } from 'http';
import { PrismaClient } from  '@prisma/client';
import bcrypt from 'bcryptjs';
import { error } from 'console';
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
// Creating an instance of PrismaClient to interact with the database.
const prisma = new PrismaClient();


const SECRET_KEY = 'your_secret_key';
app.use(cors()); 


app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Middleware executed');
    next(); // Pass control to the next middleware
});

// ===========================
// Middleware
// ===========================
//Custom middleware for validating request bodies

const middleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // If the required field `exampleField` is missing, return a 400 error.
        if (!req.body.exampleField) {
            res.status(400).json({ error: 'exampleField is required' });
            return; // End the response cycle
        }

        //If validation passes, proceed to the next middleware
        next();
    } catch (error) {
        console.error('Middleware error:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
};

 const generateToken = (user: { 
   username: string,  role: string  }): string => { 
    return jwt.sign({  username: user.username, role: user.role}, SECRET_KEY, { expiresIn: '1h' }); }; 
    
    interface AuthenticatedRequest extends Request {
       user?: {  username: string; role: string }; }
       
  const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => { 
  const token = req.headers.authorization?.split(' ')[1];
 if (!token) { 
   res.status(401).json({ error: 'Access denied, token missing!' }); 
   return;
  } 
  try { 
  const decoded = jwt.verify(token, SECRET_KEY) as { 
    username: string, role: string }; req.user = decoded; 
    next(); } 
  catch (error) { 
   res.status(401).json({ error: 'Invalid token' }); 
  return;
  } };
 
// ===========================
// ROUTES
// ===========================

//Checking health enpoints
app.get('/', (req: Request, res: Response) => {
    res.send('The active API version');
  });

// Define the protected route with authMiddleware
app.get('/protected', authMiddleware, async (req: Request & { user?: any }, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({ message: 'Access granted', user: req.user });
  } catch (err) {
    next(err);  // Pass any errors to the next error handler
  }
});



         //Routes for login
 app.get('/login', async (req: Request, res: Response) => {
   const { username, password } = req.body;
        
     try {
            const user = await prisma.user.findFirst({
              where: { username },
            });
        
            if (user && user.password === password) {
              // Create and send a token (e.g., JWT)
              const token = 'some-generated-token';  // Use JWT or another method
              res.status(200).json({ token });
            } else {
              res.status(401).json({ error: 'Invalid credentials' });
            }
          } catch (error) {
            res.status(500).json({ error: 'Error logging in.' });
          }
        });
        
// ===========================
// Flashcard Set Routes
// ===========================
  
// Get all flashcard sets
app.get('/set', async (req: Request, res: Response) => {
    try {
      //Fetches all the sets from the database with specific fields.
        const sets = await prisma.set.findMany({
         
            select: {
                
                name: true,
               
            }
        });
        //Return the flashcard set
        res.status(200).json(sets);
    } catch (error) {
       res.status(500).json({ error: 'Error fetching sets. ' });

    }
});

// CREATE a new set
app.post('/set', async (req: Request, res: Response) => {
  const { name, userId } = req.body;

  try {
    // Retrieve the user by userId to check their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return;
    }

    // If the user is not an admin, check the number of sets created today
    if (user.role !== 'admin') {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      // Check how many sets have been created by the user today
      const setsCreatedToday = await prisma.set.count({
        where: {
          userId: user.id,  // Check sets created by the user
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      // Enforce a limit of 20 sets per day for non-admin users
      if (setsCreatedToday >= 20) {
         res.status(429).json({ error: 'You have reached the maximum number of flashcard sets allowed today' });
         return;
      }
    }

    // Create the new set in the database
    const set = await prisma.set.create({
      data: {
        name,
        userId,
      },
    });

    // Return the created set with a 201 status code
    res.status(201).json(set);

  } catch (error) {
    res.status(500).json({ error: 'Error creating set' });
  }
});



// GET a specific set by ID
  app.get('/set/:id', async (req: Request, res: Response) => {
    const { id } = req.params; 
    try {
      //Retrive the set with the specified ID
        const sets = await prisma.set.findUnique({
         
            where: { id: Number(id), },
     });
     //Response with the set if found
        res.status(200).json(sets); 
    } catch (error) {
       res.status(404).json({ error: 'Error fetching sets. ' });

    }
});
  
// UPDATE a set by ID
app.put('/set/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    //Extract fields to update
    const { name } = req.body;

    if (!id || isNaN(Number(id))) { 
       res.status(400).json({ error: 'Invalid id parameter' }); return; } 
       if (!name ) { 
         res.status(400).json({ error: 'No fields to update' }); 
         return; }
  
    try {
      //Update the ste in the database
      const updatedSet = await prisma.set.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
        },
      });
  
      res.status(200).json(updatedSet);
      console.log("The updated flashcard set");
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'The flashcard set was not found' });
    }
  });
  



// DELETE a set by ID
app.delete('/set/:id', async (req: Request, res: Response) => {
 
  try {
    const { id } = req.params;
// Optionally, delete all flashcards in the set first
  await prisma.flashcard.deleteMany({
    where: { setId: parseInt(id) },
});
    //Delete the set from the database
    await prisma.set.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).json({ message: 'The flashcard set was deleted' });
  } catch (error) {
    res.status(404).json({ error: 'The flashcard set was not found' });
  }
});

// ===========================
// Comment Routes (on Sets)
// ===========================
//POST: Comment on a flashcard set, by the current user
app.post('/set/:id/comments', async (req: Request, res: Response) => {
    const { id } = req.params; 
    //Extract comment details
    const { userId, rating, comments } = req.body; 
  
    // Validate that rating is between 1 and 5
     if (rating === undefined || rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Rating must be between 1 and 5' });
      return; }
    try {
    
      //Create a comment in the database
      const comm = await prisma.comment.create({
        data: {
          setId: Number(id),
          userId,
          rating,
          comments
        
        },
      });
  
      res.status(201).json(comm);
      console.log('Comment created');
    } catch (error) {
      console.error(error);
      if(error instanceof Error && error.message.includes('P2025')){ res.status(404).json({ error: 'The flashcard set was not found' });
    }
    res.status(500).json({error: 'Internal server error'});
    return;
  }
  });
 
  
// GET all flashcards in a specific set, with an optional shuffle
app.get('/set/:id/flashcard', async (req: Request, res: Response) => {
  const { id } = req.params;  // ID of the flashcard set
  const numericId = Number(id);

  if (isNaN(numericId)) {
    res.status(400).json({
      error: 'Invalid set ID',
    });
    return;  // Ensure the function exits if the ID is invalid
  }

  // Whether to shuffle the flashcards
  const { shuffle } = req.query;

  try {
    // Retrieve flashcards for the given set ID
    let flashcards = await prisma.flashcard.findMany({
      where: {
        setId: numericId,
      },
      select: {
        question: true,
        solution: true,
        difficulty: true,
      },
    });

    // If shuffle is true, randomize the order of flashcards
    if (shuffle === 'true') {
      flashcards = flashcards.sort(() => Math.random() - 0.5);
    }

    // If no flashcards are found, return a 404 error
    if (flashcards.length === 0) {
      res.status(404).json({ error: 'No flashcards found for the set' });
      return;
    }

    res.status(200).json(flashcards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving flashcards' });
  return;
  }
});


app.post('/set/:id/flashcard', async (req: Request, res: Response) => {
  const { setId, question, solution, difficulty} = req.body;

  try {
    // Validate difficulty value
    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty)) {
       res.status(400).json({ error: 'Invalid difficulty. Valid values are "easy", "medium", "hard".' });
    return;
      }

    // Check if the set exists
    const set = await prisma.set.findUnique({
      where: { id: parseInt(setId) },
    });

    if (!set) {
      res.status(404).json({ error: 'Set not found' });
      return;
    }

    // Create the flashcard and associate it with the set
    const newflashcard = await prisma.flashcard.create({
      data: {
        question,
        solution,
        difficulty,  
        set: {
          connect: { id: parseInt(setId) },
        },
      },
    });

    res.status(201).json(newflashcard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the flashcard' });
  return;
  }
});

// PUT update a flashcard
app.put('set/:id/flashcard/:id', async (req: Request, res: Response) => {
  const { id } = req.params; // ID of the flashcard to be updated
  const { question, solution, difficulty } = req.body;

  const numericId = Number(id);

  if (isNaN(numericId)) {
    res.status(400).json({
      error: 'Invalid flashcard ID',
    });
    return;
  }

  try {
    // Validate difficulty value
    const validDifficulties = ["easy", "medium", "hard"];
    if (difficulty && !validDifficulties.includes(difficulty)) {
      res.status(400).json({
        error: 'Invalid difficulty. Valid values are "easy", "medium", "hard".',
      });
      return;
    }

    // Find the flashcard to update
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: numericId },
    });

    if (!flashcard) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }

    // Update the flashcard
    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: numericId },
      data: {
        question: question || flashcard.question,  
        solution: solution || flashcard.solution, 
        difficulty: difficulty || flashcard.difficulty, 
      },
    });

    res.status(200).json(updatedFlashcard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the flashcard' });
  }
});

// DELETE a flashcard byt set id
app.delete('set/:id/flashcard/:id', async (req: Request, res: Response) => {
  const { id } = req.params; 
  const numericId = Number(id);

  if (isNaN(numericId)) {
    res.status(400).json({
      error: 'Invalid flashcard ID',
    });
    return;
  }

  try {
    // Find the flashcard to delete
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: numericId },
    });

    if (!flashcard) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }

    // Delete the flashcard
    await prisma.flashcard.delete({
      where: { id: numericId },
    });

    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the flashcard' });
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
                id: true,
                username: true,
                password: true,

            }
        });
        //Return the flashcard set
        res.status(200).json(users);
    } catch (error) {
       res.status(500).json({ error: 'Error fetching users. ' });

    }
});

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

// Update user by ID

app.put('/user/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    // Checking the admin status manually or via a header/authorization mechanism
    // Check for admin via headers
    const isAdmin = req.headers['x-role'] === 'admin'; 

    // Check if the user is allowed to change the role (only admin can assign roles)
    if (role !== undefined && !isAdmin) {
         res.status(403).json({
            error: 'Not authorized to change user role.',
        }); return;
    }

    try {
      const numericId = Number(id);
      if(isNaN(numericId)){
        res.status(400).json({error : 'Invalid user ID'});
        return;
      }
        // Find user by ID
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!user) {
             res.status(404).json({ error: 'User not found.' });
        }

        // Hash the password if provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        // Update user with the provided data
        const updatedUser = await prisma.user.update({
            where: { id: numericId },
            data: {
              //Keep the existing user if exists
                username: username || user?.username, 
                // Keep the existing password if not provided
                password: hashedPassword || user?.password, 
                // Keep the existing role if not provided
                role: role || user?.role, 
            },
        });

        // Return the updated user
        res.status(200).json(updatedUser);
        console.log("The updated user:", updatedUser);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'The user wa snot found.' });
    }
});
  // DELETE an user by ID
app.delete('/user/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      await prisma.user.delete({
        where: {
          id: parseInt(id),
        },
      });
      res.status(204).json({ message: 'The user  was deleted' });
    } catch (error) {
      res.status(404).json({ error: 'The user was not found' });
    }
  });

// Get all flashcard sets created by a user
app.get('/user/:userID/set', async (req: Request, res: Response) => {
    const { userId } = req.params;
  
    try {
      const numericUserId = Number(userId);
      if(isNaN(numericUserId)){
        res.status(400).json({error: 'Invalid user ID'});
        return;
      }
      // Find the user by ID
      const user = await prisma.user.findUnique({
        where: {
          id: numericUserId, // Ensure userID is a number
        },
      });
  
      // If user is not found, return a 404 error
      if (!user) {
         res.status(404).json({ error: 'User not found' });
      }
  
      // Retrieve all flashcard sets created by this user
      const flashcardSets = await prisma.set.findMany({
        where: {
            // 'userId' is a foreign key in the flashcard set model
          userId: numericUserId , 
        },
      });
  
      // Return the list of flashcard sets
      res.status(200).json(flashcardSets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the flashcard sets' });
    }
  });

//Get all flashcards set collections created by a user
app.get('/users/:userId/collection', async (req: Request, res: Response) => {
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

///Get a flachcard set collection by ID
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

// UPDATE a flashcard set collection by id
app.put('/collection/:id', async (req: Request, res: Response) => {
    const collectionId = parseInt(req.params.id, 10);
  const { comments, setId } = req.body;
  
  try {
    // Ensure collectionId is a valid number 
    if (isNaN(collectionId)) { 
       res.status(400).json({ message: 'Invalid collection ID' }); return; }
    // Check if the collection exists
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
       res.status(404).json({ message: 'Collection not found' });
    }

    // Update the collection with the new comment and setId
    const updatedCollection = await prisma.collection.update({
        where: { id: collectionId },
        data: {
          commentId: comments ? Number(comments) : undefined, 
          setId: setId ? Number(setId) : undefined,
        },
        include: {
          set: true,
          user: true,
        comments: true,
        },
      });
 // Respond with the updated collection details
  res.status(200).json(updatedCollection);

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

  // GET endpoint to retrieve all flashcard set collections
app.get('/collections', async (req: Request, res: Response) => {
    try {
      // Retrieve all collections with associated set, user, and comment
      const collections = await prisma.collection.findMany({
        include: {
          set: true,     
          user: true,    
          comments: true, 
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

// POST endpoint to create a new flashcard set collection
app.post('/collections', middleware, async (req: Request, res: Response) => {
    const { comment, setID } = req.body;
  
    // Ensure the necessary fields are provided
    if (!comment || !setID) {
       res.status(400).json({ message: 'Comment and setID are required' });
       return;
    }
  
    try {
      // Check if the set exists
      const flashcardSet = await prisma.set.findUnique({
        where: { id: setID },
      });
  
      if (!flashcardSet) {
         res.status(404).json({ message: 'The flashcard set was not found' });
         console.log(error);
      }

      let name :string | undefined = req.body?.name;
      if(typeof name !== "string" || name.trim() === "")
{
    name = "";
}  
      // Create the new collection
      const newCollection = await prisma.collection.create({
        data: {
          commentId: comment ,
           name: name,
            setId: setID,
            userId: 1, 
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

// POST /telemetry: Creates a new telemetry entry.
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
// Helper Functions
// ===========================

// Centralized Error Handler
function handleError(res: Response, error: any, message: string) {
  console.error(message, error);
  res.status(500).json({ error: message });
}



// ===========================
// Start the Server
// ===========================
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); 

 });
      
 export default app;