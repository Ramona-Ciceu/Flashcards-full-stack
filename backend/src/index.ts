import express from 'express';
import type { Request, Response } from 'express'
import dotenv from 'dotenv';
import { request } from 'http';
import { PrismaClient } from  '@prisma/client';

dotenv.config();


const app = express();
const PORT = 3000;
app.use(express.json());

const prisma = new PrismaClient();

// Health check route
//app.get('/', (req: Request, res: Response) => {
    //res.send('Hello, World!');
  //});

//Route handler for initializing data in the database
  app.get('/init', async (req: Request, res: Response) => {
    //Accesing set and flashcard tables 
    //const prismaSet = prisma.set;
   // const flashCard = prisma.flashcard;

    //Creating new entries in the tables
    await prisma.set.create({
        data: {
            name: "first",
            
        }
    });
    /*
    await prisma.flashcard.create({
        data: {
            
            question: "Whats the capital of France?",
            solution: "Paris"

        }
    });*/
  });

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
    const { name, description } = req.body;
  
    try {
        //Check how many sets have been created today
        //Get today's date YYYY-MM-DD
        const today =  new Date();
        // Start of the day
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 


    // End of the day
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); 

        const setsCreatedToday = await prisma.set.count({
            where: {
              createdAt: {
                // Start of the day
                // Greater than or equal to the start of the day
                gte:startOfDay ,
                //Less than the end of the day
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
        res.json(sets);
    } catch (error) {
       res.status(500).json({ error: 'Error fetching sets. ' });

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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating set' });
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
    res.status(500).json({ error: 'Error deleting set' });
  }
});

//POST: Comment on a flashcard set, by the current user
app.post('/set/:id/review', async (req: Request, res: Response) => {
    const { id } = req.params; // ID of the flashcard set
    const { userId, rating, comment } = req.body; // Assumes userId, rating, and optional comment are in the body
  
    try {
      // Validate that rating is between 1 and 5
      if (!rating || rating < 1 || rating > 5) {
         res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      const review = await prisma.review.create({
        data: {
          setId: Number(id),
          userId,
          rating,
          comment,
        },
      });
  
      res.status(201).json(review);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating review' });
      //res.status(404).json({ error: 'The flashcard set was not found' });
    }
  });
  
  
// GET: Retrieve all flashcards in a specific set, with an optional shuffle
app.get('/set/:id/flashcards', async (req: Request, res: Response) => {
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
  








  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

 });