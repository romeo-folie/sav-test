import { Routes, Route } from 'react-router-dom';
import { UsersPage } from './pages/users';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
      <Route path="/users" element={<UsersPage />} />
    </Routes>
  );
}

export default App
