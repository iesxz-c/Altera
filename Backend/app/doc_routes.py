from flask import Blueprint , request, send_file
import io
import os
import tempfile
import subprocess
from docx import Document

doc_bp = Blueprint("doc",__name__)

@doc_bp.route('/convert_doc_to_pdf', methods=['POST'])
def convert_doc_to_pdf():
    if 'doc' not in request.files:
        return "No file part", 400

    file = request.files['doc']

    if file.filename == '':
        return "No selected file", 400

    if file and file.filename.endswith('.docx'):
        doc = file.read()
        docx_data = io.BytesIO(doc)

        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_docx:
            temp_docx.write(doc)
            temp_docx_path = temp_docx.name

        temp_pdf_path = temp_docx_path.replace('.docx', '.pdf')

        try:
            subprocess.run([r'C:\Program Files\LibreOffice\program\soffice.exe', 
                            '--headless', '--convert-to', 'pdf', temp_docx_path, '--outdir',
                            os.path.dirname(temp_pdf_path)], check=True)

            with open(temp_pdf_path, 'rb') as pdf_file:
                pdf_data = io.BytesIO(pdf_file.read())

            pdf_data.seek(0)
            return send_file(pdf_data, as_attachment=True, download_name=
                             "converted.pdf", mimetype="application/pdf")

        finally:
            os.remove(temp_docx_path)
            if os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)

    return "Invalid file format", 400

@doc_bp.route('/merge_docs', methods=['POST'])
def merge_docs():
    if 'docs' not in request.files:
        return "No files part in the request", 400

    files = request.files.getlist('docs')

    if len(files) < 2:
        return "Please upload at least two DOCX files to merge", 400

    merged_doc = Document()

    for file in files:
        if file.filename.endswith('.docx'):
            doc = Document(file)
            
            for element in doc.element.body:
                merged_doc.element.body.append(element)
        else:
            return f"File {file.filename} is not a DOCX", 400

    merged_doc_io = io.BytesIO()
    merged_doc.save(merged_doc_io)
    merged_doc_io.seek(0)

    return send_file(merged_doc_io, as_attachment=True, download_name=
                     "merged_document.docx", mimetype=
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document")