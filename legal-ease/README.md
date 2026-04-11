# LegalEase AI - Legal Document Simplifier

LegalEase AI helps students and first-jobbers understand legal documents by breaking them down into plain English, flagging risky clauses, and providing negotiation suggestions.

## Features

- **Document Analysis**: Paste any legal document (rent agreements, internship offers, terms & conditions)
- **Plain English Summary**: Gemini AI breaks down complex legal language
- **Risk Identification**: Flags risky clauses in red
- **Clear Explanations**: Explains what you're actually agreeing to
- **Negotiation Tips**: Suggests what to negotiate or be aware of

## Project Structure

```
legal-ease/
├── backend/          # Node.js Express server
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── .env          # Environment variables
├── frontend/         # React application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── LegalEaseAnalyzer.jsx
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Open the `.env` file in the backend directory
   - Add your Gemini API key: `GEMINI_API_KEY=your_actual_api_key_here`
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Start the backend server:
   ```
   npm start
   ```
   or for development:
   ```
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The backend runs on port 5000 and the frontend on port 3000.

## API Endpoints

- `POST /api/analyze` - Analyze a legal document
- `GET /api/health` - Health check

## Technologies Used

- **Frontend**: React, Vite, Axios
- **Backend**: Node.js, Express, Google Gemini AI
- **AI**: Google Generative AI (Gemini)

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

This project is licensed under the MIT License.