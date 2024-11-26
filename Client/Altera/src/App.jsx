import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import MergePDFs from './Pages/MergePDFs'
import MergeDocs from './Pages/MergeDocs';
import ConvertImagesToPdf from './Pages/ConvertImagesToPdf';
const App = () => {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/merge-pdf" element={<MergePDFs/>}/>
          <Route path="/merge-docs" element={<MergeDocs/>}/>
          <Route path="/images-to-pdf" element={<ConvertImagesToPdf/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
