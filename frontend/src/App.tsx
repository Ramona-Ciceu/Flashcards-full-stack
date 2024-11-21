import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/HomePage';
import Sets from './pages/SetsPage';
import CreateSet from './pages/createSetPage';

const App = () => (
  <Router>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/set" element={<Sets />} />
      <Route path="/create-set" element={<CreateSet />} />
    </Routes>
  </Router>
);

export default App;
