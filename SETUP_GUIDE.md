# Quick Setup Guide

Follow these steps to get the Medical Note Summarizer running on your machine.

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js installed (v14+): Run `node --version`
- [ ] Python installed (3.8+): Run `python --version` or `python3 --version`
- [ ] Claude API key from Anthropic Console
- [ ] Text editor (VS Code, Sublime, etc.)
- [ ] Git installed (optional)

## Step-by-Step Setup

### 1. Get the Code

Option A: Clone with Git
```bash
git clone https://github.com/yourusername/Medical-Summarizer.git
cd Medical-Summarizer
```

Option B: Download ZIP
1. Download the project as ZIP
2. Extract to your desired location
3. Open terminal/command prompt in that folder

### 2. Set Up Backend (5 minutes)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Create environment file
copy .env.example .env    # Windows
# OR
cp .env.example .env      # macOS/Linux
```

Now open the `.env` file in a text editor and add your Claude API key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

Save and close the file.

### 3. Set Up Frontend (5 minutes)

Open a NEW terminal window (keep the backend one for later).

```bash
# Navigate to frontend folder
cd frontend

# Install npm packages (this may take a few minutes)
npm install
```

Wait for all packages to install. You'll see a progress bar.

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
# Activate venv if not already active
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
* Restarting with stat
* Debugger is active!
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## Test the Application

1. Use the sample file: `sample-medical-record.txt` in the root directory
2. Drag and drop it into the upload area
3. Click "Generate AI Summary"
4. Switch between Patient and Doctor views
5. Try the chat interface

## Common Issues & Fixes

### "Module not found" Error (Backend)
```bash
cd backend
pip install -r requirements.txt
```

### "Module not found" Error (Frontend)
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
- Backend (5000): Change port in `backend/app.py` (last line)
- Frontend (3000): React will ask if you want to use a different port

### API Key Not Working
1. Check you copied the entire key (starts with `sk-ant-`)
2. Ensure no extra spaces in the `.env` file
3. Restart the backend server after changing the key

### CORS Errors
- Make sure backend is running on port 5000
- Check `frontend/src/services/api.js` has correct backend URL
- Try restarting both servers

## Stopping the Application

Press `Ctrl + C` in both terminal windows to stop the servers.

## Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Explore all features (Upload, Summary, Chat)
3. Try different medical records
4. Customize the application for your needs

## Getting Help

- Check the [README.md](README.md) troubleshooting section
- Review the error messages carefully
- Make sure all prerequisites are installed
- Ensure your Claude API key is valid and has credits

## Project Structure Quick Reference

```
Medical-Summarizer/
├── backend/           ← Python/Flask API
│   ├── app.py        ← Main server file
│   ├── .env          ← API key goes here (create this!)
│   └── requirements.txt
├── frontend/         ← React application
│   ├── src/          ← React components
│   └── package.json
└── README.md         ← Full documentation
```

## Development Tips

- Keep both terminals visible to see errors
- Backend changes require restart (Ctrl+C, then run again)
- Frontend hot-reloads automatically (just save files)
- Check browser console (F12) for frontend errors
- Check terminal for backend errors