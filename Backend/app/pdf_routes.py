from flask import Blueprint , request, send_file
from PyPDF2 import PdfMerger
import io
from pdf2docx import Converter
import os
import tempfile


pdf_bp = Blueprint("pdf",__name__)

@pdf_bp.route('/merge_pdfs', methods=['POST'])
def merge_pdfs():
    if 'pdfs' not in request.files:
        return "No files part in the request", 400

    files = request.files.getlist('pdfs')
    
    if len(files) < 2:
        return "Please upload at least two PDF files to merge", 400

    merger = PdfMerger()

    for file in files:
        if file.filename.endswith('.pdf'):
            merger.append(file)
        else:
            return f"File {file.filename} is not a PDF", 400

    merged_pdf = io.BytesIO()
    merger.write(merged_pdf)
    merger.close()
    
    merged_pdf.seek(0)

    return send_file(merged_pdf, as_attachment=True, 
                     download_name="merged.pdf", mimetype="application/pdf")

@pdf_bp.route('/convert_pdf_to_doc', methods=['POST'])
def convert_pdf_to_doc():
    if 'pdf' not in request.files:
        return "No file part", 400

    file = request.files['pdf']

    if file.filename == '':
        return "No selected file", 400

    if file and file.filename.endswith('.pdf'):
        pdf_bytes = file.read()
        
        pdf_io = io.BytesIO(pdf_bytes)

        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
            temp_pdf.write(pdf_bytes)
            temp_pdf_path = temp_pdf.name

        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_docx:
            docx_path = temp_docx.name

        converter = Converter(temp_pdf_path)
        converter.convert(docx_path, start=0, end=None)
# MIME Type: It tells the browser what kind of file is being sent so it knows how to handle it.
# For DOCX files, the MIME type
# is application/vnd.openxmlformats-officedocument.wordprocessingml.document
        return send_file(docx_path, as_attachment=True,
                         download_name="converted.docx",
                         mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document")

    return "Invalid file format", 400
