Here’s a clean and professional **README.md** for your **Legal Ease** project (you can copy-paste directly into GitHub):

---

<<<<<<< HEAD
# ⚖️ Legal Ease

**Legal Ease** is a web-based platform designed to simplify legal processes and make legal assistance more accessible. It helps users understand legal concepts, manage documents, and connect with relevant resources efficiently.

---

## 🚀 Features

* 📄 **Legal Document Management** – Upload, store, and organize legal documents
* 🤖 **AI-Based Assistance** – Get simplified explanations of legal terms
* 🔍 **Search & Filter** – Easily find legal resources and documents
* 👨‍⚖️ **User-Friendly Interface** – Clean and intuitive UI for all users
* 🌐 **Responsive Design** – Works seamlessly on desktop and mobile

---

## 🛠️ Tech Stack

**Frontend:**

* React.js
* HTML5, CSS3
* JavaScript

**Backend (if MERN):**

* Node.js
* Express.js

**Database:**

* MongoDB

**Other Tools:**

* Git & GitHub
* VS Code

---

## 📦 Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/legal-ease.git
=======
# 📚 LegalEase Frontend

**React + Vite frontend for LegalEase AI - Legal document simplification platform**

---

## 🎯 Features

✅ **User Authentication** - Secure login/registration with JWT  
✅ **Document Upload** - Upload PDF & image files  
✅ **AI Analysis** - Get legal document analysis in plain English  
✅ **Document Management** - View, analyze, and organize documents  
✅ **Text-to-Speech** - Listen to analysis with AI voice  
✅ **Responsive Design** - Works on desktop, tablet, mobile  

**Tech Stack:** React 19 + Vite + CSS3

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend running on `http://localhost:5000` 

### Installation

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

## 🔗 Backend Integration

This frontend is **fully integrated** with the LegalEase backend.

**Make sure backend is running:**
```bash
# In separate terminal, from d:\legal-ease
npm run dev
# Backend will be on http://localhost:5000
```

For detailed integration guide, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api.js                  # Backend API client
│   ├── AuthContext.jsx         # Auth state management
│   ├── Auth.jsx                # Login/Register components
│   ├── Auth.css                # Auth styling
│   ├── App.jsx                 # Main app wrapper
│   ├── App.css                 # App header styling
│   ├── Dashboard.jsx           # Document management UI
│   ├── Dashboard.css           # Dashboard styling
│   ├── LegalEaseAnalyzer.jsx  # Local analyzer (reference)
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── index.html                  # HTML entry point
```

---

## 🎯 How to Use

### 1. Register / Login
- Click "Register" to create account
- Or use existing credentials to login
- JWT token saved automatically

### 2. Upload Document
- Go to "Upload Document" tab
- Select PDF, PNG, or JPG file
- Backend extracts text automatically

### 3. Get AI Analysis
- Go to "My Documents"
- Click "🔍 Analyze" button
- Wait for AI analysis (~1-3 seconds)

### 4. View Results
- Click "👁️ View" to see analysis
- See summary, risks, obligations, tips
- Click "🎧 Speak" to listen

---

## 🔄  Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 🔐 Authentication

**Login Details:**
- Email: `test@legalease.com`  
- Password: `password123`

Or create your own account with the Register button.

**Token Management:**
- Token stored in `localStorage`
- Auto-added to all API requests
- 30-day expiration

---

## 🐛 Troubleshooting

### Can't connect to backend?
```
Error: Failed to load documents
```
**Fix:**
1. Check backend is running: `npm run dev` in `d:\legal-ease`
2. Verify port 5000 is available
3. Check CORS settings in backend

### File upload fails?
```
Error: Upload failed
```
**Causes:**
- File > 15MB (max size)
- Invalid file type (only PDF, PNG, JPG)
- Backend not running

### Analysis taking too long?
- First run: 2-3 seconds (OpenAI API call)
- Subsequent: ~1 second (cached)

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `react-dom` | React rendering |

**Dev Dependencies:**
- `vite` - Build tool
- `@vitejs/plugin-react` - React support
- `eslint` - Code linting

---

## 🌐 Environment Variables

Create `.env.local` to customize API endpoint:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

(Optional - defaults to `http://localhost:5000/api`)

---

## 🚀 Production Build

```bash
# Create production build
npm run build

# Preview build locally
npm run preview

# Output: dist/ folder (ready to deploy)
```

Deploy `dist/` to:
- **Vercel** (recommended for React)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

---

## 📝 Development Tips

### Add new page/component
1. Create in `src/ComponentName.jsx`
2. Add to `App.jsx`
3. Import API functions from `src/api.js`
4. Style with CSS or CSS modules

### Working with API
```javascript
import { auth, documents, assistant } from './api';

// Register
const user = await auth.register(name, email, password);

// Login
const user = await auth.login(email, password);

// Get documents
const docs = await documents.getAll();

// Upload document
const uploadedDoc = await documents.upload(file, title);

// Analyze
const analysis = await documents.analyze(docId);
```

---

## 📞 Support

See detailed integration guide: [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
>>>>>>> 87e4da6 (initial commit)
```

2. **Navigate to the project folder**

```bash
cd legal-ease
```

3. **Install dependencies**

```bash
npm install
```

4. **Run the application**

```bash
npm run dev
```

---

## 📁 Project Structure

```
legal-ease/
│── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
│── public/
│── package.json
│── README.md
```

---

## 🎯 Future Enhancements

* 🔐 User authentication & authorization
* 📊 Dashboard for case tracking
* 💬 Chatbot for legal queries
* 📱 Mobile app version

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Arpan Mishra**

* GitHub: (https://github.com/ar9an)

---




* <img width="1016" height="524" alt="{7917FF73-6755-465E-A2C5-6C563C04CB2F}" src="https://github.com/user-attachments/assets/96f59b7f-731e-4b0d-a32a-fc7b5cd89934" />

* live link https://legal-ease-by-arpann.netlify.app/
