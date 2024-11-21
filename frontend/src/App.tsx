import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FlashcardPage from './pages/FlashcardPage';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import UserSetsPage from './pages/UserSetsPage';
import CreateFlashcardSetPage from './pages/CreateFlashcardSetPage';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/set/:setId/flashcards" component={FlashcardPage} />
        <Route path="/user/:userId" component={UserProfilePage} />
        <Route path="/user/:userId/sets" component={UserSetsPage} />
        <Route path="/create-flashcard-set" component={CreateFlashcardSetPage} />
      </Switch>
    </Router>
  );
};

export default App;
