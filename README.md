# Flashcards-full-stack
Flashcards full stack(backend Express, frontend React)
Installed backend packages like:
npm install express sqlite3 prisma cors
npm install -D ts-node typescript nodemon @types/node @types/express @prisma/client

npm install bcryptjs
npm install --save-dev @types/bcryptjs

Frontnend packages installed :
npm create vite@latest frontend -- --template react-ts
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom

npm install axios







To run the app,always use: npm run start:dev

To generate database will ne to run : npx prisma generate.

Unable to use Difficulty enum : error: Error validating: You defined the enum `Difficulty`. The current connector does not support enums. Will use difficulty as a string attribute in flashcard table. 
