import { Routes, Route } from 'react-router-dom';
import Intro from './pages/posts/intro';
import Chapter3 from './pages/posts/chapter3';
import Chapter4 from './pages/posts/chapter4';
import Header from './pages/Header';
import Sidebar from './pages/Sidebar';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="py-6 px-3 md:px-0 w-12/12 md:w-9/12 xl:w-6/12 mx-0 md:mx-auto">
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/chapter3" element={<Chapter3 />} />
            <Route path="/chapter4" element={<Chapter4 />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
