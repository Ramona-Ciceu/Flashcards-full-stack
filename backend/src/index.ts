import express from 'express';
import dotenv from 'dotenv';
const { PrismaClient } =  require('@prisma/client');
dotenv.config();

const  PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const client = new PrismaClient();

app.get('/', (_req,res) => {
    return res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});