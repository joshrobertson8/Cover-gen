import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Get the API key from the environment
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Configure the Gemini API
genai.configure(api_key=api_key)

# Initialize the model
model = genai.GenerativeModel('gemini-pro')

def generate_cover_letter(resume_content, job_description):
    prompt = f"""
    ACT AS: Professional career coach with 15+ years experience at Fortune 500 companies.
    
    TASK: Create a high-impact cover letter that:
    - Matches 3-5 key resume strengths to job requirements
    - Demonstrates measurable achievements
    - Shows cultural fit
    - Uses industry-specific keywords
    
    RESUME CONTENT:
    {resume_content}
    
    JOB DESCRIPTION:
    {job_description}
    
    STRATEGY:
    1. Analyze both documents for:
       - Technical skills overlap
       - Leadership qualities match
       - Cultural alignment indicators
    2. Structure:
       - Opening: Value proposition hook
       - Body 1: Core competency match
       - Body 2: Key achievement showcase
       - Body 3: Cultural alignment
       - Closing: Call to action
    3. Writing Style:
       - Active voice
       - Power verbs (orchestrated, spearheaded, optimized)
       - 65-75% keyword match
       - Zero clichés
       - Concise (300-400 words)
    
    FORMAT:
    [Your Name]
    [Your Address]
    [City, State ZIP Code]
    [Email Address]
    [Today's Date]
    
    [Hiring Manager Name]
    [Company Name]
    [Company Address]
    
    Dear [Hiring Manager Name],
    
    [Opening paragraph: 2-3 sentences highlighting your strongest relevant qualification]
    
    [Middle paragraphs: Specific examples of achievements using PAR (Problem-Action-Result) format]
    
    [Closing paragraph: Enthusiasm + call to action]
    
    Sincerely,
    [Your Name]
    """
    
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            top_p=0.9,
            top_k=40,
            max_output_tokens=2048
        )
    )
    return response.text