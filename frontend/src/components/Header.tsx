//NAvigation bar for the app

import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-blue-500 text-white p-4">
    <nav className="flex justify-between">
      <h1 className="text-lg font-bold">TestVar</h1>
      <div>
        <Link to="/" className="px-4">Home</Link>
        <Link to="/sets" className="px-4">Flashcard Sets</Link>
        <Link to="/create-set" className="px-4">Create Set</Link>
      </div>
    </nav>
  </header>
);

export default Header;