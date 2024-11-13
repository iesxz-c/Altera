from flask import Flask, request, send_file
from pdf2docx import Converter
import io

app = Flask(__name__)



if __name__ == '__main__':
    app.run(debug=True)
