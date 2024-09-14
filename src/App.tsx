import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/home/index';
import LayoutPage from './pages/layout/index';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutPage />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
