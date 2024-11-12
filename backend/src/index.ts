import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
const { PrismaClient } =  require('@prisma/client');
dotenv.config();


const app = express();
const PORT = 3000;
app.use(express.json());

const prisma = new PrismaClient();

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
  });

//Route handler for initializing data in the database
  app.get('/init', async (req: Request, res: Response) => {
    //Accesing set and flashcard tables 
    const prismaSet = prisma.set;
    const flashCard = prisma.flashcard;

    //Creating new entries in the tables
    await prisma.db.set.create(prismaSet);
    await prisma.db.flashcard.create(flashCard);
  });

// Get all sets
app.get('/sets', async (req: Request, res: Response) => {
    try{
    const sets = await prisma.db.set
    .select(['id', 'name', 'description', 'flashcard'])
    .filter({private:false})
    .getAll();
    return res.json(sets);
    }
    catch{
        res.status(500).json({ error: 'Error fetching sets' });
    }
});

// CREATE a set
app.post('/sets', async (req: Request, res: Response) => {
    const { name, description } = req.body;
  
    try {
      const set = await prisma.set.create({
        data: {
          name,
          description,
        },
      });
      res.status(201).json(set);
    } catch (error) {
      res.status(500).json({ error: 'Error creating set' });
    }
  });

// GET a specific set by ID
app.get('/sets/:id', async (req: Request, res: Response) => {
   const { id } = req.params;
   const sets = await prisma,.db.set.read(id);
   return res.json(sets);

  });


// UPDATE a set by ID
app.put('/sets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const set = await prisma.set.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        description,
      },
    });
    res.status(200).json(set);
  } catch (error) {
    res.status(500).json({ error: 'Error updating set' });
  }
});

// DELETE a set by ID
app.delete('/sets/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.set.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: 'Set deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting set' });
  }
});

 // CREATE a flashcard
 app.get('/init', async (req: Request, res: Response) => {


  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });