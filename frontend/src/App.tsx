import { Routes, Route } from 'react-router-dom';
import { UsersPage } from './pages/users';
import { UserPostsPage } from './pages/user-posts';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/:userId/posts" element={<UserPostsPage />} />
    </Routes>
  );
}

export default App
