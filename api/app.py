from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import uuid
import time
import random
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Simple in-memory storage for demo purposes
analysis_results = {}

@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    job_description = request.form.get('jobDescription', '')
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        # Save file to temp directory
        temp_dir = tempfile.gettempdir()
        file_path = os.path.join(temp_dir, filename)
        file.save(file_path)
        
        # Process the resume (simulated)
        result = process_resume(file_path, job_description)
        
        # Remove temp file
        os.remove(file_path)
        
        # Store result in memory
        analysis_id = result['id']
        analysis_results[analysis_id] = result
        
        return jsonify(result)
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/results/<analysis_id>', methods=['GET'])
def get_analysis_result(analysis_id):
    if analysis_id in analysis_results:
        return jsonify(analysis_results[analysis_id])
    return jsonify({'error': 'Analysis not found'}), 404

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'pdf', 'docx'}

def process_resume(file_path, job_description):
    """
    Process the resume and compare with the job description.
    This is a simplified mock implementation for demonstration purposes.
    In a real application, this would use NLP and ML techniques to analyze the resume.
    """
    # Simulate processing time
    time.sleep(2)
    
    # Generate a random ID
    analysis_id = str(uuid.uuid4())[:8]
    
    # Mock data for demonstration
    keywords = ['leadership', 'project management', 'React', 'TypeScript', 'UI/UX']
    missing_keywords = ['Python', 'Flask', 'data analysis']
    
    present_skills = ['JavaScript', 'React', 'HTML/CSS', 'Git', 'Responsive Design']
    missing_skills = ['Python', 'Flask', 'SQL', 'Data Visualization']
    
    improvements = [
        'Add more quantifiable achievements',
        'Include Python and Flask experience if applicable',
        'Tailor your professional summary to highlight relevant experience',
        'Add SQL and database management skills'
    ]
    
    # Calculate mock scores
    score = random.randint(70, 95)
    ats_compatibility = random.randint(75, 95)
    
    return {
        'id': analysis_id,
        'score': score,
        'keywords': keywords,
        'missingKeywords': missing_keywords,
        'skills': {
            'present': present_skills,
            'missing': missing_skills
        },
        'improvements': improvements,
        'atsCompatibility': ats_compatibility
    }

if __name__ == '__main__':
    app.run(debug=True)