from flask import Blueprint , request, send_file,jsonify
from PyPDF2 import PdfMerger
import io
from pdf2docx import Converter
import os
import tempfile
import fitz  
from PIL import Image
import pytesseract
from io import BytesIO

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


@pdf_bp.route('/api/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Check if the file is a PDF by checking the extension
    if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() != 'pdf':
        return jsonify({'error': 'Allowed file type is: pdf'}), 400

    try:
        # Read the uploaded PDF file into memory
        pdf_data = file.read()

        # Process the PDF and add OCR results
        pdf_output = add_ocr_to_pdf(BytesIO(pdf_data))

        # Send the PDF back with OCR embedded
        return send_file(pdf_output, as_attachment=True, download_name='ocr_pdf.pdf', mimetype='application/pdf')

    except Exception as e:
        return jsonify({'error': f"Error processing file: {str(e)}"}), 500


# Function to perform OCR and embed results into the original PDF
def add_ocr_to_pdf(pdf_stream):
    # Open the original PDF
    pdf_document = fitz.open(stream=pdf_stream, filetype="pdf")

    # Iterate over each page in the PDF
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)

        # Render the page to an image (pixmap)
        pix = page.get_pixmap()

        # Convert the pixmap to a PIL Image for OCR processing
        img = Image.open(BytesIO(pix.tobytes("png")))  # Specify image format 'png' for PIL
        ocr_text = pytesseract.image_to_string(img)

        # Add the OCR text to the page as hidden annotations (not visible)
        page.insert_text((72, 72), ocr_text, fontsize=8, color=(1, 1, 1), rotate=0, overlay=True)

    # Save the PDF with embedded OCR to a BytesIO object
    pdf_output = BytesIO()
    pdf_document.save(pdf_output)

    # Reset the pointer of the BytesIO object to the beginning before sending it
    pdf_output.seek(0)
    return pdf_output