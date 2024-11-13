from flask import Flask, request, send_file
from PyPDF2 import PdfMerger
import io
from pdf2docx import Converter
import os
import tempfile
app = Flask(__name__)

@app.route('/merge_pdfs', methods=['POST'])
def merge_pdfs():
    # Check if files are in the request
    if 'pdfs' not in request.files:
        print("No files part in the request")  
        return "No files part in the request", 400

    files = request.files.getlist('pdfs')
    
    # Ensure at least two PDFs are provided
    if len(files) < 2:
        print("Less than two PDF files received")  
        return "Please upload at least two PDF files to merge", 400

    merger = PdfMerger()

    # Add each PDF file to the merger
    for file in files:
        print(f"Processing file: {file.filename}") 
        if file.filename.endswith('.pdf'):
            merger.append(file)
        else:
            print(f"File {file.filename} is not a PDF") 
            return f"File {file.filename} is not a PDF", 400

    # Create a BytesIO object to store the merged PDF in memory
    merged_pdf = io.BytesIO()
    merger.write(merged_pdf)
    merger.close()
    
    # Move the pointer to the start of the BytesIO object
    merged_pdf.seek(0)

    # Send the merged PDF as a response directly from memory
    return send_file(merged_pdf, as_attachment=True, download_name="merged.pdf", mimetype="application/pdf")


# MIME Type: It tells the browser what kind of file is being sent so it knows how to handle it.
# For DOCX files, the MIME type
# is application/vnd.openxmlformats-officedocument.wordprocessingml.document


@app.route('/convert_pdf_to_doc', methods=['POST'])
def convert_pdf_to_doc():
    # Check if file is in the request
    if 'pdf' not in request.files:
        return "No file part", 400

    file = request.files['pdf']

    if file.filename == '':
        return "No selected file", 400

    if file and file.filename.endswith('.pdf'):
        # Read the PDF file into memory
        pdf_bytes = file.read()

        # Use BytesIO to create a file-like object in memory
        
        pdf_io = io.BytesIO(pdf_bytes)

        # Create a temporary file to store the PDF content
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
            temp_pdf.write(pdf_bytes)
            temp_pdf_path = temp_pdf.name  # Path to the temporary PDF file

        # Create a temporary file for the DOCX output
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_docx:
            docx_path = temp_docx.name  # Path to the temporary DOCX file

        # Convert the PDF to DOCX using the temporary file paths
        converter = Converter(temp_pdf_path)
        converter.convert(docx_path, start=0, end=None)

        # Open the generated DOCX file and send it as a response
        return send_file(docx_path, as_attachment=True, download_name="converted.docx", mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document")

    return "Invalid file format", 400



if __name__ == '__main__':
    app.run(debug=True)
