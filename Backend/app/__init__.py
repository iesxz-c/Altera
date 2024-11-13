from flask import Flask, request, send_file
from PyPDF2 import PdfMerger
import io

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

if __name__ == '__main__':
    app.run(debug=True)
