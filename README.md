# Cover Letter Generator

A generative AI-powered tool to create personalized and professional cover letters leveraging Google's Gemini 2.0 Flash generative AI model. This web application allows users to upload their resume, paste a job description, and generate a tailored cover letter in seconds.

---

## Features

- **AI-Powered Generation:** Create custom cover letters using Google's Gemini AI model.
- **Dynamic Inputs:** Upload your resume (PDF or TXT) and paste the job description.
- **Interactive UI:** Modern, Apple-inspired design with smooth animations.
- **Download Options:** Save the generated cover letter as a `.txt` file.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.

---

## Installation

### Prerequisites

- Python 3.8+
- Flask
- Google Gemini API Key

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/joshrobertson8/Cover-gen.git
   cd Cover-gen
   ```

2. **Install dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Obtain a Google Gemini API key:**
   - Visit the Google AI Studio to get your API key.

4. **Set up the API key:**
   - Open `backend/gemini_integration.py` and replace `"your_google_gemini_api_key"` with your actual API key:
     ```python
     API_KEY = "your_google_gemini_api_key"
     ```

5. **Run the Flask application:**
   ```bash
   python backend/app.py
   ```

6. **Access the application:**
   - Open your browser and navigate to [http://localhost:5000](http://localhost:5000).

---

## Usage

### Upload Your Resume
Drag and drop your resume (PDF or TXT) into the upload zone, or click to select a file.

### Paste the Job Description
Copy and paste the job description into the provided text box.

### Generate the Cover Letter
Click the **"Generate Cover Letter"** button. The AI will analyze your resume and job description to create a tailored cover letter.

### Download the Cover Letter
Once generated, click the **"Download"** button to save the cover letter as a `.txt` file.

---

## Example

**Input:**
- **Resume:** Upload a PDF or TXT file containing your resume.
- **Job Description:** Paste the job description for the role you're applying for.

**Output:**
- A professionally written cover letter tailored to your resume and the job description.

---

## Configuration

### Templates
- Edit the prompt in `backend/gemini_integration.py` to customize the cover letter format or tone.

### Styling
- Modify the CSS files in `static/css/` to change the visual design.

### AI Model
- Adjust the parameters in `gemini_integration.py` to use a different Gemini model or modify the generation settings.

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

---

## License

This project is open-source and available for use, modification, and distribution. Feel free to adapt it to your needs.
