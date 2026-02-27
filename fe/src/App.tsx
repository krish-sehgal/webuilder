import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home.jsx';
import { Builder } from './pages/Builder.jsx';
import Login from './pages/Login.js';
// import { Loader } from './components/Loader.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;