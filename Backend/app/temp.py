import subprocess
import os
import io
from flask import Flask, request, send_file

app = Flask(__name__)


if __name__ == '__main__':
    app.run(debug=True)
