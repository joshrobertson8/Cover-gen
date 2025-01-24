from flask import Flask, render_template, request, jsonify
from PyPDF2 import PdfReader
from gemini_integration import generate_cover_letter
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, template_folder='../templates', static_folder='../static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        # Validate file upload
        if 'resume' not in request.files:
            return jsonify({'success': False, 'error': 'No resume file uploaded'})
            
        # Validate job description
        if 'job_description' not in request.form:
            return jsonify({'success': False, 'error': 'Job description missing'})

        resume_file = request.files['resume']
        job_description = request.form['job_description'].strip()
        
        # Check if a file was selected
        if not resume_file.filename:
            return jsonify({'success': False, 'error': 'No file selected'})
            
        # Validate job description length
        if len(job_description) < 200:
            return jsonify({'success': False, 'error': 'Job description too short (min 200 characters)'})

        # Process resume file
        resume_content = ""
        try:
            if resume_file.filename.lower().endswith('.pdf'):
                pdf_reader = PdfReader(resume_file)
                for page in pdf_reader.pages:
                    resume_content += page.extract_text() or ''
            elif resume_file.filename.lower().endswith('.txt'):
                resume_content = resume_file.read().decode('utf-8')
            else:
                return jsonify({'success': False, 'error': 'Unsupported file type (PDF/TXT only)'})
        except Exception as e:
            return jsonify({'success': False, 'error': f'Error reading file: {str(e)}'})

        # Validate resume content length
        if len(resume_content.split()) < 100:
            return jsonify({'success': False, 'error': 'Resume too short (min 100 words)'})

        # Generate cover letter
        cover_letter = generate_cover_letter(
            resume_content=resume_content,
            job_description=job_description
        )
        
        return jsonify({'success': True, 'cover_letter': cover_letter})
    
    except Exception as e:
        return jsonify({'success': False, 'error': f'Processing error: {str(e)}'})

if __name__ == '__main__':
    # Run the app in debug mode if DEBUG is set in .env
    debug_mode = os.getenv("DEBUG", "False").lower() == "true"
    app.run(debug=debug_mode)