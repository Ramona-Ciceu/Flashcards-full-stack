const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const allSets = await prisma.set.findMany(); // Ensure you have data in the 'set' table
    console.log('Data:', allSets); // Check what data is returned
    if (allSets.length === 0) {
      console.log('No data found in the "set" table');
    }
  } catch (error) {
    console.error('Error connecting to database:', error); // Catch and log errors
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database');
  }
}

checkDatabase();
