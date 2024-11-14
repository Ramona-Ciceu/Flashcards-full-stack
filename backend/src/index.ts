import express from 'express';
import type { Request, Response } from 'express'
import dotenv from 'dotenv';
import { request } from 'http';
import { PrismaClient } from  '@prisma/client';
import bcrypt from 'bcryptjs';
import { error } from 'console';

dotenv.config();



const app = express();
const PORT = 3000;
//Middleware to parse Json
app.use(express.json());



const prisma = new PrismaClient();

// Health check route
//app.get('/', (req: Request, res: Response) => {
    //res.send('Hello, World!');
  //});


// Get all sets
app.get('/set', async (req: Request, res: Response) => {
    try {
        const sets = await prisma.set.findMany({
          //  where: { private: false },
            select: {
                id: true,
                name: true,
                description: true,
                flashcards: true
            }
        });
        //Return the flashcard set
        res.status(200).json(sets);
    } catch (error) {
       res.status(500).json({ error: 'Error fetching sets. ' });

    }
});

// CREATE a set
app.post('/set', async (req: Request, res: Response) => {
    const { name, description , userId} = req.body;
  
    try {
        //Check how many sets have been created today
        const today =  new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); 

        const setsCreatedToday = await prisma.set.count({
            where: {
              createdAt: {
                // Start of the day
                gte: startOfDay ,
                // end of the day
                lt: endOfDay,  
              },
            },
          });
           // If more than 20 sets have been created today, return a 429 status
    if (setsCreatedToday >= 20) {
        res.status(429).json({ error: 'You have reached the maximum number of flashcard sets allowed today' });
      }
      // Create the new set
      const set = await prisma.set.create({
        data: {
          name,
          description,
          userId
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
        const sets = await prisma.set.findUnique({
         
            where: {
                id: Number(id),
                },
      
        });
        res.status(200).json(sets);
        
    } catch (error) {
       res.status(404).json({ error: 'Error fetching sets. ' });

    }
});
  
// UPDATE a set by ID
app.put('/set/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    try {
      const set = await prisma.set.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          description,
        },
      });
  
      res.status(200).json(set);
      console.log("The updated flashcard set");
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'The flashcard set was not found' });
    }
  });
  



// DELETE a set by ID
app.delete('/set/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
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

//POST: Comment on a flashcard set, by the current user
app.post('/set/:id/comment', async (req: Request, res: Response) => {
    const { id } = req.params; // ID of the flashcard set
    const { userId, rating, comment } = req.body; // Assumes userId, rating, and optional comment are in the body
  
    try {
      // Validate that rating is between 1 and 5
      if (!rating || rating < 1 || rating > 5) {
         res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      const comm = await prisma.comment.create({
        data: {
          setId: Number(id),
          userId,
          rating,
          //comment
        
        },
      });
  
      res.status(201).json(comment);
      console.log('Comment created');
    } catch (error) {
      console.error(error);
      
      res.status(404).json({ error: 'The flashcard set was not found' });
    }
  });
  
  
// GET all flashcards in a specific set, with an optional shuffle
app.get('/set/:id/flashcard', async (req: Request, res: Response) => {
    const { id } = req.params; // ID of the flashcard set
    const { shuffle } = req.query; // Whether to shuffle the flashcards (optional)
  
    try {
      // Retrieve flashcards for the given set ID
      let flashcards = await prisma.flashcard.findMany({
        where: {
          setId: Number(id),
        },
      });
  
      // If shuffle is true, randomize the order of flashcards
      if (shuffle === 'true') {
        flashcards = flashcards.sort(() => Math.random() - 0.5);
      }
  
      // If no flashcards are found, return a 404 error
      if (flashcards.length === 0) {
        res.status(404).json({ error: 'Flashcard set not found' });
      }
  
      res.status(200).json(flashcards);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving flashcards' });
    }
  });

//Get all users
app.get('/user', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
         
            select: {
                id: true,
                username: true,
                password: true,
                email: true
            }
        });
        //Return the flashcard set
        res.status(200).json(users);
    } catch (error) {
       res.status(500).json({ error: 'Error fetching users. ' });

    }
});

// POST: Create a new user
app.post('/user', async (req: Request, res: Response) => {
    const { username, password, email, role, firstName, lastName} = req.body;

    // Validate required fields
    if (!username || !password || !email || !role || !firstName || !lastName) {
         res.status(400).json({ error: 'Username, password, email, and role are required.' });
    }

    // Check for valid roles (you can customize this list as needed)
    if (role !== 'admin' && role !== 'user') {
         res.status(400).json({ error: 'Role must be either "admin" or "user".' });
    }

    try {
        // Log the password to check for undefined values
        console.log("Password received:", password);
        
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email,
                role, 
                firstName,
                lastName,
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'The user could not be created' });
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
    const { username, password, firstName, lastName, email, role } = req.body;

    // Checking the admin status manually or via a header/authorization mechanism
    // Check for admin via headers
    const isAdmin = req.headers['x-role'] === 'admin'; 

    // Check if the user is allowed to change the role (only admin can assign roles)
    if (role !== undefined && !isAdmin) {
         res.status(403).json({
            error: 'Not authorized to change user role.',
        });
    }

    try {
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
            where: { id: Number(id) },
            data: {
                username: username || user?.username, // Keep existing username if not provided
                firstName: firstName || user?.firstName, // Keep existing firstName if not provided
                lastName: lastName || user?.lastName, // Keep existing lastName if not provided
                email: email || user?.email, // Keep existing email if not provided
                password: hashedPassword || user?.password, // Keep existing password if not provided
                role: role || user?.role, // Keep existing role if not provided
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
app.get('/users/:userID/sets', async (req: Request, res: Response) => {
    const { userID } = req.params;
  
    try {
      // Find the user by ID
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userID), // Ensure userID is a number
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
          userId: user?.id, 
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
     //?When getting the collection will we need to get the setId alongside userId???

app.get('/users/:userID/collections', async (req: Request, res: Response) => {
    const { userID } = req.params;
    const { setId } = req.params;
  
    try {
      // Find the user by ID
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userID),
        },
      })
        const set =  await prisma.set.findUnique({
            where:{
                id: Number(setId)
            },
      })
     
  
      // If user is not found, return a 404 error
      if (!user && set) {
         res.status(404).json({ error: 'User or set not found' });
      }
  
      // Retrieve all flashcard collection created by this user
      const flashcardCollection = await prisma.collection.findMany({
        where: {
            // 'userId' is a foreign key in the flashcard set model
          userId: user?.id, 
          setId: set?.id,
        },
      });
  
      // Return the list of flashcard colleciton
      res.status(200).json(flashcardCollection);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the flashcard collection.' });
    }
  });

///Get a flachcard set collection by ID




  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

 });