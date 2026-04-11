# LegalEase Backend API Testing Guide

## Prerequisites
- MongoDB running on `localhost:27017`
- Node.js backend running on `http://localhost:5000`
- Environment variables set (see `.env.example`)

## Authentication Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "_id": "user_id_here",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:** Same token structure as register

## Document Endpoints (Require JWT Token)

Add this header to all requests: `Authorization: Bearer <jwt_token>`

### 1. Create Document
```bash
curl -X POST http://localhost:5000/api/documents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Lease Agreement",
    "content": "Lorem ipsum legal text..."
  }'
```

### 2. Get All Documents
```bash
curl -X GET http://localhost:5000/api/documents \
  -H "Authorization: Bearer <token>"
```

### 3. Get Single Document
```bash
curl -X GET http://localhost:5000/api/documents/<document_id> \
  -H "Authorization: Bearer <token>"
```

### 4. Get Document History
```bash
curl -X GET http://localhost:5000/api/documents/<document_id>/history \
  -H "Authorization: Bearer <token>"
```

### 5. Update Document
```bash
curl -X PUT http://localhost:5000/api/documents/<document_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content..."
  }'
```

### 6. Delete Document
```bash
curl -X DELETE http://localhost:5000/api/documents/<document_id> \
  -H "Authorization: Bearer <token>"
```

### 7. Analyze Document
```bash
curl -X POST http://localhost:5000/api/documents/<document_id>/analyze \
  -H "Authorization: Bearer <token>"
```

**Response includes:**
- `summary` - Plain English explanation
- `risks` - Risky clauses found
- `obligations` - What you must do
- `negotiationTips` - Suggested negotiation points

### 8. Upload PDF/Image
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/document.pdf" \
  -F "title=My Document"
```

Supports: PDF, PNG, JPG, JPEG

## Assistant Endpoints

### 1. Send Text to Assistant
```bash
curl -X POST http://localhost:5000/api/assistant/speak \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "text": "This lease can be terminated by either party with 30 days notice.",
    "title": "Lease Explanation"
  }'
```

### 2. Send Document to Assistant
```bash
curl -X POST http://localhost:5000/api/assistant/documents/<document_id>/speak \
  -H "Authorization: Bearer <token>"
```

## Rate Limits
- **Auth routes**: 5 requests per 15 minutes
- **Upload routes**: 10 requests per minute
- **All API routes**: 100 requests per minute

## Error Responses
All errors return JSON with:
```json
{
  "success": false,
  "message": "Error description",
  "status": 400
}
```

## Testing with Postman
1. Import cURL commands above into Postman
2. Set environment variable `token` = JWT response value
3. Use `{{token}}` in Authorization header
