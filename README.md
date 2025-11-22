# MedSum

An AI-powered web application that helps patients and doctors better understand and analyze medical records using Claude AI.

## Features

### For Patients
- **Simple Summary**: Get a layman's terms explanation of your medical conditions
- **Medication Tracking**: Understand what each medication does and track renewal dates
- **Appointment Reminders**: View upcoming appointments and procedures
- **Interactive Chat**: Ask questions about your health records in simple language
- **Medical Term Explanations**: Click on any medication or term to learn more

### For Doctors
- **Comprehensive Dashboard**: Quick overview of patient's medical status
- **Current Medications**: Doses, frequencies, and renewal dates
- **Lab Results**: Recent labs with threshold indicators (high/low/normal)
- **Appointment History**: Last visit and upcoming appointments
- **Major Surgeries**: Previous and scheduled procedures
- **Conditions Overview**: Major and minor conditions at a glance
- **Recent Imaging**: Relevant imaging studies based on patient conditions
- **Clinical Trial Screening**: Notes for clinical trial eligibility

### Common Features
- **File Upload**: Upload multiple medical record files (.txt, .pdf, .doc, .docx)
- **Data Editing**: Edit and modify medical information directly
- **Conversational AI**: Chat interface to ask questions about the records
- **Local Storage**: Data persists in your browser
- **View Switching**: Toggle between patient and doctor views

## Tech Stack

- **Frontend**: React.js
- **Backend**: Python Flask
- **AI**: Claude API (Anthropic)
- **Storage**: Browser Local Storage

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- Claude API key from Anthropic

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Medical-Summarizer.git
cd Medical-Summarizer
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file and add your Claude API key
# Copy .env.example to .env
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Edit .env and add your API key:
# ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## Getting a Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `backend/.env` file

## Running the Application

You need to run both the backend and frontend simultaneously.

### Terminal 1 - Backend

```bash
cd backend
python app.py
```

The Flask server will start on `http://localhost:5000`

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

The React app will start on `http://localhost:3000` and automatically open in your browser.

## Usage Guide

### 1. Upload Medical Records

1. Click on the "Upload & Edit" tab
2. Drag and drop medical record files or click to browse
3. Supported formats: .txt, .pdf, .doc, .docx
4. You can upload multiple files at once

### 2. Edit Information (Optional)

- Click the "Edit" button to modify the medical records
- Make any necessary changes
- Click "Save" to update

### 3. Generate Summary

- Click the "Generate AI Summary" button
- Wait for Claude AI to analyze the records (this may take a few seconds)
- The app automatically generates both doctor and patient views

### 4. View Summary

- Switch between "Patient View" and "Doctor View" using the toggle at the top
- Navigate to the "Summary" tab to see the AI-generated summary
- **Patient View**: Simple, layman's terms explanation
- **Doctor View**: Comprehensive medical information with technical details

### 5. Ask Questions

- Navigate to the "Chat" tab
- Type questions about the medical records
- The AI will answer based on the uploaded documents
- Responses are tailored to the selected view (patient or doctor)

### 6. Learn More (Patient View)

- In Patient View, click "Learn More" on any medication
- Get detailed explanations in simple terms
- Understand what the medication does and why you're taking it

## Features in Detail

### Lab Results Threshold Indicators

The doctor dashboard displays lab results with color-coded status indicators:
- 🟢 **Normal**: Values within normal range
- 🔴 **High**: Values above normal range
- 🟡 **Low**: Values below normal range

### Medication Renewal Tracking

Both views show medication renewal dates. In patient view:
- Medications needing renewal within 30 days show a "Renewal Soon" badge
- Helps patients stay on top of prescription renewals

### Data Persistence

All data is stored in your browser's local storage:
- Medical records are saved automatically
- Summaries are cached for quick access
- Chat history is preserved
- Data persists across browser sessions

To clear all data:
1. Go to "Upload & Edit" tab
2. Click "Clear All Data" button

## Project Structure

```
Medical-Summarizer/
├── backend/
│   ├── app.py              # Flask application with API routes
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables (API key)
├── frontend/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── FileUpload.js
│   │   │   ├── DataEditor.js
│   │   │   ├── DoctorDashboard.js
│   │   │   ├── PatientDashboard.js
│   │   │   └── ChatInterface.js
│   │   ├── services/      # API integration
│   │   │   └── api.js
│   │   ├── utils/         # Utility functions
│   │   │   └── localStorage.js
│   │   ├── App.js         # Main application
│   │   └── index.js       # Entry point
│   └── package.json       # Node dependencies
└── README.md
```

## API Endpoints

### Backend API

- `GET /api/health` - Health check
- `POST /api/summarize` - Generate medical summary
  - Body: `{ medical_text, view_type }`
- `POST /api/chat` - Chat with medical records
  - Body: `{ medical_text, question, chat_history, view_type }`
- `POST /api/explain-term` - Explain medical term
  - Body: `{ term, context }`

## Security & Privacy

- All data is processed locally in your browser and on your local server
- Medical records are NOT sent to any external servers except Claude API for processing
- Data is stored in browser local storage (not on any server)
- Clear data anytime using the "Clear All Data" button
- Always follow HIPAA and data protection regulations when handling real medical data

## Limitations

- This is a proof-of-concept application
- Not intended for production use with real patient data without proper security measures
- Claude API has rate limits and costs
- Local storage has size limitations (typically 5-10MB)
- Should not replace professional medical advice

## Troubleshooting

### Backend Issues

**Error: Module not found**
```bash
pip install -r requirements.txt
```

**Error: ANTHROPIC_API_KEY not found**
- Make sure you created a `.env` file in the backend directory
- Verify your API key is correctly formatted

### Frontend Issues

**Port 3000 already in use**
```bash
# Kill the process using port 3000 or use a different port
# React will prompt you to use a different port
```

**Module not found errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues

If you see CORS errors:
- Make sure the Flask backend is running on port 5000
- The Flask app has CORS enabled by default
- Check that the API URL in `frontend/src/services/api.js` matches your backend URL

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Multiple patient profiles
- [ ] Data export features (PDF reports)
- [ ] Drug interaction checking
- [ ] Appointment scheduling integration
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Voice input for easier data entry
- [ ] Integration with EHR systems

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with Claude AI by Anthropic
- React.js and Flask communities

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Disclaimer**: This application is for educational and demonstration purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers regarding medical conditions and treatment.
