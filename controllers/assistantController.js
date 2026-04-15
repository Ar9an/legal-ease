import Document from '../models/Document.js';

const sendToAssistant = async (payload) => {
  const endpoint = process.env.ASSISTANT_ENDPOINT;
  
  // If no endpoint configured, return local analysis
  if (!endpoint) {
    return {
      status: 'local_fallback',
      message: 'External assistant not configured. Using local text-to-speech analysis.',
      payload,
      readableFormat: `Document: ${payload.title || 'Legal Document'}\n\n${payload.text || payload.content}\n\nThis legal text has been processed for clarity and accessibility.`
    };
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  if (process.env.ASSISTANT_API_KEY) {
    headers.Authorization = `Bearer ${process.env.ASSISTANT_API_KEY}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Assistant request failed: ${response.status} ${errorBody}`);
  }

  return response.json();
};

export const speakText = async (req, res) => {
  const { text, title } = req.body;

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error('Text is required to create a spoken response');
  }

  const payload = {
    text,
    title: title || 'LegalEase text',
    userId: req.user._id.toString(),
    source: 'legal-ease-backend',
  };

  const assistantResponse = await sendToAssistant(payload);
  res.json({ assistantResponse, textSent: text });
};

export const speakDocument = async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  const text = document.analysis?.summary || document.content;

  const payload = {
    text,
    title: document.title,
    documentId: document._id.toString(),
    userId: req.user._id.toString(),
    source: 'legal-ease-backend',
  };

  const assistantResponse = await sendToAssistant(payload);
  res.json({ assistantResponse, documentId: document._id });
};
