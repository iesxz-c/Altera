from flask import Flask

app = Flask(__name__)

from .pdf_routes import pdf_bp
from .doc_routes import doc_bp
from .image_routes import image_bp
from .ppt_routes import ppt_bp


app.register_blueprint(pdf_bp)
app.register_blueprint(doc_bp)
app.register_blueprint(image_bp)
app.register_blueprint(ppt_bp)



if __name__ == '__main__':
    app.run(debug=True)

