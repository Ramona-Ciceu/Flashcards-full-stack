# Flashcards-full-stack
Flashcards full stack(backend Express, frontend React)
Installed backend packages like:
npm install express sqlite3 prisma cors
npm install -D ts-node typescript nodemon @types/node @types/express @prisma/client

npm install bcryptjs
npm install --save-dev @types/bcryptjs

Frontnend packages installed :

npm install react react-dom react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D typescript @types/react @types/react-dom @types/react-router-dom
npm install axios
npm install -D @types/axios
npx tailwindcss init



To run the app,always use: npm run start:dev

To generate database will ne to run : npx prisma generate.

Unable to use Difficulty enum : error: Error validating: You defined the enum `Difficulty`. But the current connector does not support enums. Will use difficulty as a string attribute in flashcard table. 
