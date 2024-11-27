import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './components/Layout';
import MergePDFs from './Pages/MergePDFs'
import MergeDocs from './Pages/MergeDocs';
import ConvertImagesToPdf from './Pages/ConvertImagesToPdf';
import PdfToImages from './Pages/PdfToImages';
import ConvertDocToPdf from './Pages/ConvertDocToPdf';
import ConvertPdfToDoc from './Pages/ConvertPdfToDoc';
import ConvertPptToPdf from './Pages/ConvertPptToPdf';
import ConvertPdfToPpt from './Pages/ConvertPdfToPpt';
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
          <Route path="/docs-to-pdf" element={<ConvertDocToPdf/>}/>
          <Route path="/pdf-to-doc" element={<ConvertPdfToDoc/>}/>
          <Route path="/powerpoint-to-pdf" element={<ConvertPptToPdf/>}/>
          <Route path="/pdf-to-powerpoint" element={<ConvertPdfToPpt/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
