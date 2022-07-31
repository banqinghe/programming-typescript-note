import { Routes, Route } from 'react-router-dom';
import {
  Intro,
  Chapter3AllTypes as Chapter3,
  Chapter4Function as Chapter4,
  Chapter5ClassInterface as Chapter5,
  Chapter6TypeAdvanced as Chapter6,
} from './pages/post';

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
            <Route path="/chapter5" element={<Chapter5 />} />
            <Route path="/chapter6" element={<Chapter6 />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
