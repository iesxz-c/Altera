# Altera

Altera provides various features for manipulating PDF documents. It allows you to merge PDFs, convert documents to PDF, extract text from PDFs using OCR, and more. Built with React, Vite, Chakra UI for the frontend, and Flask for the backend.

## Features

- **Merge PDF**: Combine multiple PDFs in the order you want.
- **Docs to PDF**: Convert documents into PDF format.
- **PDF to Doc**: Convert PDFs into editable Word documents.
- **Merge Docs**: Combine multiple Word documents into one.
- **PDF to PowerPoint**: Convert PDFs into editable PowerPoint slides.
- **PDF to Images**: Convert PDFs into images.
- **Images to PDF**: Convert images into PDF format.
- **PowerPoint to PDF**: Convert PowerPoint presentations into PDF format.
- **OCR PDF**: Extract text from PDFs using OCR (Optical Character Recognition).

## Technologies Used

- **Frontend**: React, Vite, Chakra UI
- **Backend**: Flask
- **Libraries**:
  - `Axios` for making HTTP requests
  - `react-icons` for icons
  - `fitz` (PyMuPDF) and `pytesseract` for OCR functionality

## Installation

### Prerequisites

- Node.js
- Python 3.x
- Flask
- Python libraries (`fitz`, `pytesseract`, etc.)

### CORS Handling

If your frontend and backend are on different ports, ensure that CORS is enabled in your Flask backend. You can add this to your backend setup:

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```