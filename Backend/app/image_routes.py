from flask import Flask, request, send_file,Blueprint
from PyPDF2 import PdfMerger
import io
from pdf2docx import Converter
import os
import tempfile
import subprocess
from docx import Document
from PIL import Image
from fpdf import FPDF
from pdf2image import convert_from_path
import zipfile

image_bp = Blueprint('image', __name__)

@image_bp.route('/convert_images_to_pdf', methods=['POST'])
def convert_images_to_pdf():
    print("Request files:", request.files)  # Log all incoming files
    if 'images' not in request.files:
        return "No 'images' field in the request", 400

    files = request.files.getlist('images')
    
    if not files:
        return "Please upload at least one image", 400

    image_list = []
    for file in files:
        image = Image.open(file)
        image_list.append(image)

    pdf_output = io.BytesIO()
    image_list[0].save(pdf_output, "PDF", save_all=True, append_images=image_list[1:])
    
    pdf_output.seek(0)
    return send_file(pdf_output, as_attachment=True,
                     download_name="converted_images.pdf", 
                     mimetype="application/pdf")

@image_bp.route('/convert_pdf_to_images', methods=['POST'])
def convert_pdf_to_images():
    if 'pdf' not in request.files:
        return "No PDF file part", 400

    file = request.files['pdf']
    
    if file.filename == '':
        return "No selected file", 400

    if file and file.filename.endswith('.pdf'):
        # Read the uploaded PDF file into a BytesIO object
        pdf_data = file.read()
        
        # Create a temporary file to save the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False,
                                         suffix='.pdf') as tmp_pdf:
            tmp_pdf.write(pdf_data)
            tmp_pdf_path = tmp_pdf.name  # Store the path of the temporary file

        # Convert PDF to images (one image per page)
        try:
            images = convert_from_path(tmp_pdf_path)
            
            # Prepare a zip file to store the images
            zip_filename = "pdf_images.zip"
            zip_buffer = io.BytesIO()


            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for i, image in enumerate(images):
                    img_byte_arr = io.BytesIO()
                    image.save(img_byte_arr, format='PNG')
                    img_byte_arr.seek(0)
                    zipf.writestr(f"page_{i + 1}.png", img_byte_arr.read())

            zip_buffer.seek(0)
            return send_file(zip_buffer, as_attachment=True, 
                             download_name=zip_filename,
                             mimetype="application/zip")
        
        except Exception as e:
            return f"Error converting PDF: {str(e)}", 500
        
        finally:
            # Clean up the temporary PDF file after conversion
            if os.path.exists(tmp_pdf_path):
                os.remove(tmp_pdf_path)

    return "Invalid file format", 400