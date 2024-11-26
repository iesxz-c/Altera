import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import MergePDFs from './Pages/MergePDFs'
import MergeDocs from './Pages/MergeDocs';
import ConvertImagesToPdf from './Pages/ConvertImagesToPdf';
import PdfToImages from './Pages/PdfToImages';
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
          <Route path="/pdf-to-images" element={<PdfToImages/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
