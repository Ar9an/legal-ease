# 🚀 START HERE - LegalEase Full Setup

## 📋 What You Have

- ✅ **Backend** (Node.js + Express + MongoDB) at `d:\legal-ease`
- ✅ **Frontend** (React + Vite) at `d:\legal-ease-frontend\frontend`
- ✅ **Both fully integrated** and ready to run

---

## 🎯 3-Step Startup (COPY-PASTE)

### Step 1: Open Terminal 1
```bash
cd d:\legal-ease
mongod --dbpath "d:\legal-ease\data"
```
✅ MongoDB running on default port 27017

### Step 2: Open Terminal 2
```bash
cd d:\legal-ease
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 3: Open Terminal 3
```bash
cd d:\legal-ease-frontend\frontend
npm run dev
```
✅ Frontend running on http://localhost:5173

---

## ✨ Access the App

🌐 **Open your browser:** http://localhost:5173

You'll see a login screen!

---

## 🔐 Test Login

Use these credentials or create a new account:

**Email:** `test@legalease.com`  
**Password:** `password123`

(Create new account if this one doesn't exist)

---

## ✅ Test the Full Flow

1. **Login** → See welcome message
2. **Upload Document** → Select any PDF or image
3. **Analyze** → Click analyze button
4. **View Results** → See AI analysis
5. **Listen** → Play text-to-speech

---

## 📡 Verify Everything is Connected

### Backend Status
```
Try: http://localhost:5000/
Should see: {"message":"LegalEase AI backend is running"}
```

### Frontend Status
```
Open: http://localhost:5173/
Should see: Login page
```

### Check Logs

**Backend terminal:** Should show:
```
Server running on port 5000
MongoDB connected: localhost
```

**Frontend terminal:** Should show:
```
VITE v8.0.1 ready in ... ms
Local: http://localhost:5173/
```

---

## 🎓 Features to Try

### 1️⃣ Upload a Document
- Go to "Upload Document" tab
- Select a PDF or image
- Wait for upload

### 2️⃣ Get AI Analysis
- Click "Analyze" button
- Wait 1-3 seconds for AI response
- See:
  - ✅ Summary in plain English
  - ⚠️ Risk clauses identified
  - ✅ Your obligations
  - 💡 Negotiation tips

### 3️⃣ Listen to Analysis
- Click "Listen" button
- Audio plays (if assistant configured)

### 4️⃣ View Document History
- Each update creates a version snapshot
- Access via API or expanded UI

### 5️⃣ Manage Multiple Documents
- Upload multiple documents
- Each tied to your account
- Full version history tracking

---

## 🛠️ Configuration Files

### Backend `.env`
Located: `d:\legal-ease\.env`

```env
MONGO_URI=mongodb://localhost:27017/legal-ease
JWT_SECRET=your_strong_secret_key_here_min_32_chars
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_key_here (optional)
ASSISTANT_ENDPOINT=https://your-assistant.com/api/speak (optional)
```

### Frontend (Optional)
Create: `d:\legal-ease-frontend\frontend\.env.local`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

(Not required - defaults are already set)

---

## 📞 Troubleshooting

### Frontend says "Cannot connect to backend"?
```
Error: Failed to load documents
```
**Fix:**
1. Check Terminal 2: Is backend running?
2. Check port 5000: `http://localhost:5000/`
3. Check Terminal 1: Is MongoDB running?

### Upload fails?
```
Error: Upload failed: Invalid file type
```
**Causes:**
- File > 15MB (max)
- Wrong file type (only PDF, PNG, JPG allowed)

### Analysis too slow?
- First time: 2-3 seconds (API call to OpenAI)
- After that: ~1 second (cached in DB)

### Login not working?
```
Error: Invalid email or password
```
**Fix:**
- Register new account
- Check email format
- Case-sensitive password

---

## 🚀 Next: Production Deployment

When ready to deploy to live server:

### Backend
- Set `NODE_ENV=production`
- Use MongoDB Atlas (not local)
- Deploy to: Heroku, Railway, AWS, etc.

### Frontend  
- Run: `npm run build`
- Creates `dist/` folder
- Deploy to: Vercel, Netlify, AWS S3

See deployment docs in each README!

---

## 📁 File Structure

```
d:\
├── legal-ease/                 ← BACKEND
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── data/                  ← MongoDB files
│
└── legal-ease-frontend/       ← FRONTEND
    └── frontend/
        ├── src/
        ├── public/
        ├── package.json
        ├── vite.config.js
        └── index.html
```

---

## ✅ You're All Set!

1. ✅ Backend code complete
2. ✅ Frontend code complete  
3. ✅ Integration complete
4. ✅ Both can communicate
5. ✅ Ready to test!

### Final Checklist
- [ ] MongoDB running (Terminal 1)
- [ ] Backend running (Terminal 2)
- [ ] Frontend running (Terminal 3)
- [ ] Can access http://localhost:5173
- [ ] Can login with test credentials
- [ ] Can upload a document
- [ ] Can get AI analysis

---

## 💡 Quick Commands Reference

```bash
# Backend
cd d:\legal-ease
npm run dev                    # Start backend
npm run test                   # Run tests
node tests/basic.test.js      # Unit tests

# Frontend
cd d:\legal-ease-frontend\frontend
npm run dev                    # Start dev server
npm run build                  # Production build
npm run preview                # Preview build
npm run lint                   # Check code

# Database
mongod --dbpath "d:\legal-ease\data"  # Start MongoDB
```

---

## 🎉 Congratulations!

Your full-stack LegalEase application is ready!

**Backend:** Node.js + Express + MongoDB  
**Frontend:** React + Vite  
**Integration:** Fully connected and working  

Enjoy simplifying legal documents! ⚖️
