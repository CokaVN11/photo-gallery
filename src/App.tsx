import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import PhotoGallery from './components/PhotoList';
import PhotoDetails from './components/PhotoDetails';

function App() {
  return (
    <Router>
      <div className="mx-auto px-4 container">
        <h1 className="my-2 font-bold text-3xl">Unsplash Clone</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/photos" replace />} />
          <Route path="/photos" index element={<PhotoGallery />} />
          <Route path="/photos/:id" element={<PhotoDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
