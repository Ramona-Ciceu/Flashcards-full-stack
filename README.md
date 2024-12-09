# Flashcards-full-stack
Flashcards full stack(backend Express, frontend React)
Installed backend packages like:
npm install express sqlite3 prisma cors
npm install -D ts-node typescript nodemon @types/node @types/express @prisma/client

npm install bcryptjs 
npm i --save-dev @types/jsonwebtoken
npm install --save-dev @types/bcryptjs
npm install express jsonwebtoken bcryptjs @types/express @types/jsonwebtoken @types/bcryptjs
npm install cors
npm i --save-dev @types/cors

npm i --save-dev @types/mocha

Frontnend packages installed :
For vite, to set it up first time i ran 
npm create vite@latest frontend -- --template react-ts
but after that i've only ran "npm install vite"
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom
npm install axios
npm install --save-dev @types/jest



To run the app,always use: npm run dev

To generate database will ne to run : npx prisma generate.

Unable to use Difficulty enum : error: Error validating: You defined the enum `Difficulty`. The current connector does not support enums. Will use difficulty as a string attribute in flashcard table. 

I had axios but because of it my frontend  wasnt connecting properly with the backend, so ive decided to remove it. 
