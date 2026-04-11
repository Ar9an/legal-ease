# LegalEase Frontend + Backend Integration

## ✅ What's Connected

Your frontend is now fully integrated with the backend:

✅ **User Authentication** - Login/Register with JWT  
✅ **Document Upload** - PDF & image upload to backend  
✅ **AI Analysis** - Calls backend AI analyzer  
✅ **Document Management** - CRUD operations via API  
✅ **Text-to-Speech** - Sends to backend assistant  

---

## 🚀 How to Start (COPY-PASTE COMMANDS)

### Terminal 1: Start Backend MongoDB
```bash
cd d:\legal-ease
mongod --dbpath "d:\legal-ease\data"
```

### Terminal 2: Start Backend Server
```bash
cd d:\legal-ease
npm run dev
```

### Terminal 3: Start Frontend Dev Server
```bash
cd d:\legal-ease-frontend\frontend
npm install
npm run dev
```

Frontend will be available at: **http://localhost:5173** (Vite default)

---

## 📋 Setup Files Created

| File | Purpose |
|------|---------|
| `src/api.js` | API client for all backend calls |
| `src/AuthContext.jsx` | User authentication state management |
| `src/Auth.jsx` | Login & Register components |
| `src/Auth.css` | Auth styling |
| `src/Dashboard.jsx` | Main document upload & analysis UI |
| `src/Dashboard.css` | Dashboard styling |
| `src/App.jsx` | Main app wrapper |
| `src/App.css` | App header & layout |

---

## 🔧 Environment Setup (Optional)

If you want to change the backend API URL, create `.env.local` in `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

(If not set, defaults to `http://localhost:5000/api`)

---

## 📱 How the Integration Works

### 1. **User Login/Register**
- User enters email/password
- Frontend calls `POST /api/auth/register` or `/api/auth/login`
- Backend returns `token` (JWT)
- Token saved to `localStorage`  
- Token auto-added to all API requests in header

### 2. **Document Upload**
- User selects PDF/image file
- Frontend calls `POST /api/documents/upload` with file
- Backend extracts text (OCR for scanned docs)
- Document stored in MongoDB
- Frontend shows success and reloads document list

### 3. **AI Analysis**
- User clicks "Analyze" button
- Frontend calls `POST /api/documents/:id/analyze`
- Backend calls OpenAI ChatGPT
- Returns: summary, risks, obligations, negotiation tips
- Frontend displays results in modal

### 4. **Text-to-Speech**
- User clicks "Listen" button
- Frontend calls `POST /api/assistant/documents/:id/speak`
- Backend forwards to external assistant API (or fallback)
- Returns audio/response

---

## 🎯 Frontend Features

### Upload Tab
- **Drag & drop** file upload
- **Multi-format support**: PDF, PNG, JPG
- **Real-time feedback** during upload
- Feature cards explaining capabilities

### My Documents Tab
- **Document list** with dates
- **Preview text** (first 150 chars)
- **Analyze button** (if not analyzed yet)
- **View & Listen buttons** (after analysis)
- **Status badge** showing analysis state

###  Analysis Modal
Shows:
- ✅ **Summary** - Plain English explanation
- ⚠️ **Risk Clauses** - Flagged dangerous terms
- ✅ **Obligations** - What you must do
- 💡 **Negotiation Tips** - Strategies for first-signers
- 🎧 **Listen button** - AI reads the analysis

---

## 🔐 Security Notes

- ✅ Tokens stored in `localStorage`
- ✅ Tokens auto-sent in `Authorization` header
- ✅ Backend validates JWT on protected routes
- ✅ Passwords never sent without HTTPS (dev only)
- ✅ Files validated on backend (MIME type, size)

---

## 🐛 Troubleshooting

### Frontend won't connect to backend?
```
Error: Failed to load documents
```
**Solution:**
- Make sure backend is running: `npm run dev` in `d:\legal-ease`
- Check backend is on port 5000: `http://localhost:5000`
- Check CORS is enabled in backend (it is by default)

### Upload files are too large?
```
Error: File exceeds 15MB limit
```
**Backend limits:** 15MB per file  
**Solution:** Compress PDF or split into smaller files

### Analysis taking too long?
- First time: ~2-3 seconds (API calls OpenAI)
- Subsequent: ~1 second (cached in MongoDB)

---

## 📡 API Integration Map

**Frontend `api.js`** → HTTP Calls → **Backend routes**

```
POST   /api/auth/register      → User creation
POST   /api/auth/login          → User login
GET    /api/documents           → List user's documents
POST   /api/documents           → Create text document
POST   /api/documents/upload    → Upload file
PUT    /api/documents/:id       → Update document
DELETE /api/documents/:id       → Delete document
GET    /api/documents/:id       → Get single document
GET    /api/documents/:id/history → Version history
POST   /api/documents/:id/analyze → AI analysis
POST   /api/assistant/speak      → Text to speech
POST   /api/assistant/documents/:id/speak → Doc to speech
```

---

## ✨ Next Steps

1. ✅ Backend running?
2. ✅ Frontend running?
3. ✅ Can you login?
4. ✅ Can you upload a document?
5. ✅ Can you get AI analysis?

**Then you're done!** 🎉

---

## 📝 Sample Test Data

Register with:
- Email: `test@legalease.com`
- Password: `password123`

Upload a sample legal document or paste text directly!

---

## 🚀 Production Deployment

When ready to deploy:

### Backend
- Set `NODE_ENV=production`
- Use MongoDB Atlas
- Deploy to: Heroku, Railway, Render, AWS, etc.
- Update `MONGO_URI` & `JWT_SECRET`

### Frontend
- Run: `npm run build`
- Creates `dist/` folder
- Deploy to: Vercel, Netlify, AWS S3 + CloudFront
- Update API URL to production backend

---

**Need help?** Check the README files in both folders! 🎓
