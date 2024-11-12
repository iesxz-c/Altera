from flask import Flask, request, send_file, jsonify
from PyPDF2 import PdfMerger
from pdf2docx import Converter as PdfToDocxConverter
from docx2pdf import convert as DocxToPdfConverter
from pdf2image import convert_from_path
from fpdf import FPDF
from PIL import Image
import os
import comtypes.client
import tempfile
import pythoncom
import docx

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

# Ensure upload and output folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Utility function for saving files
def save_file(file):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    return file_path

@app.route('/')
def home():
    return "ash"

# Merging PDFs
@app.route('/merge-pdfs', methods=['POST'])
def merge_pdfs():
    files = request.files.getlist('files')
    merger = PdfMerger()

    for file in files:
        file_path = save_file(file)
        merger.append(file_path)

    output_path = os.path.join(OUTPUT_FOLDER, "merged_output.pdf")
    merger.write(output_path)
    merger.close()
    return send_file(output_path, as_attachment=True)

# Converting PPT to PDF
@app.route('/ppt-to-pdf', methods=['POST'])
def ppt_to_pdf():
    file = request.files['file']
    file_path = save_file(file)
    output_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(file.filename)[0]}.pdf")

    pythoncom.CoInitialize()
    powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
    presentation = powerpoint.Presentations.Open(file_path)
    presentation.SaveAs(output_path, 32)
    presentation.Close()
    powerpoint.Quit()
    
    return send_file(output_path, as_attachment=True)

# Converting Excel to PDF
@app.route('/excel-to-pdf', methods=['POST'])
def excel_to_pdf():
    file = request.files['file']
    file_path = save_file(file)
    output_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(file.filename)[0]}.pdf")

    pythoncom.CoInitialize()
    excel = comtypes.client.CreateObject("Excel.Application")
    workbook = excel.Workbooks.Open(file_path)
    workbook.ExportAsFixedFormat(0, output_path)
    workbook.Close()
    excel.Quit()
    
    return send_file(output_path, as_attachment=True)

# Converting JPEG images to PDF
@app.route('/images-to-pdf', methods=['POST'])
def images_to_pdf():
    files = request.files.getlist('files')
    pdf = FPDF()

    for file in files:
        image = Image.open(file.stream)
        pdf.add_page()
        pdf.image(file, x=0, y=0, w=pdf.w, h=pdf.h)
    
    output_path = os.path.join(OUTPUT_FOLDER, "images_output.pdf")
    pdf.output(output_path)
    return send_file(output_path, as_attachment=True)

# Merging Word documents
@app.route('/merge-docs', methods=['POST'])
def merge_docs():
    files = request.files.getlist('files')
    merged_doc = docx.Document()

    for file in files:
        file_path = save_file(file)
        doc = docx.Document(file_path)
        for element in doc.element.body:
            merged_doc.element.body.append(element)

    output_path = os.path.join(OUTPUT_FOLDER, "merged_output.docx")
    merged_doc.save(output_path)
    return send_file(output_path, as_attachment=True)

# Converting PDF to Word
@app.route('/pdf-to-doc', methods=['POST'])
def pdf_to_doc():
    file = request.files['file']
    file_path = save_file(file)
    output_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(file.filename)[0]}.docx")

    cv = PdfToDocxConverter(file_path)
    cv.convert(output_path)
    cv.close()
    return send_file(output_path, as_attachment=True)

# Converting Word to PDF
@app.route('/doc-to-pdf', methods=['POST'])
def doc_to_pdf():
    file = request.files['file']
    file_path = save_file(file)
    output_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(file.filename)[0]}.pdf")

    DocxToPdfConverter(file_path, output_path)
    return send_file(output_path, as_attachment=True)

# Converting PDF to PPT (images of each page as slides)
@app.route('/pdf-to-ppt', methods=['POST'])
def pdf_to_ppt():
    file = request.files['file']
    file_path = save_file(file)
    output_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(file.filename)[0]}.pptx")

    images = convert_from_path(file_path)
    presentation = comtypes.client.CreateObject("Powerpoint.Application").Presentations.Add()

    for image in images:
        slide = presentation.Slides.Add(1, 1)
        image_path = os.path.join(UPLOAD_FOLDER, "temp_image.png")
        image.save(image_path)
        slide.Shapes.AddPicture(image_path, 0, 1, 0, 0)

    presentation.SaveAs(output_path)
    presentation.Close()
    return send_file(output_path, as_attachment=True)

# Converting PDF to Excel
@app.route('/pdf-to-excel', methods=['POST'])
def pdf_to_excel():
    return jsonify({"message": "PDF to Excel conversion requires a third-party API or OCR libraries."})

# Converting PDF to images
@app.route('/pdf-to-images', methods=['POST'])
def pdf_to_images():
    file = request.files['file']
    file_path = save_file(file)
    images = convert_from_path(file_path)
    image_paths = []

    for i, image in enumerate(images):
        image_path = os.path.join(OUTPUT_FOLDER, f"page_{i + 1}.png")
        image.save(image_path, "PNG")
        image_paths.append(image_path)
    
    return jsonify({"images": image_paths})

if __name__ == "__main__":
    app.run(debug=True)
