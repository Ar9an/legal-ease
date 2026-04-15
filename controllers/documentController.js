import pdfParse from 'pdf-parse';
import Document from '../models/Document.js';
import { analyzeLegalText } from '../utils/aiAnalyzer.js';
import { extractTextFromFile } from '../utils/ocrParser.js';

export const createDocument = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const document = await Document.create({
    user: req.user._id,
    title,
    content,
  });

  res.status(201).json(document);
};

export const getDocuments = async (req, res) => {
  const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(documents);
};

export const getDocumentById = async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  res.json(document);
};

export const updateDocument = async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  document.versions.push({
    title: document.title,
    content: document.content,
    analysis: document.analysis,
    updatedAt: document.updatedAt,
  });

  document.title = req.body.title || document.title;
  document.content = req.body.content || document.content;
  
  if (req.body.analysis) {
    document.analysis = req.body.analysis;
  }

  const updatedDocument = await document.save();
  res.json(updatedDocument);
};

export const getDocumentHistory = async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id }).select('versions');

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  res.json({ versions: document.versions });
};

export const deleteDocument = async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  await document.remove();
  res.json({ message: 'Document removed' });
};

export const analyzeDocument = async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  const analysis = await analyzeLegalText(document.content);
  document.analysis = analysis;
  await document.save();

  res.json({ document, analysis });
};

export const uploadDocument = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('A PDF or image file is required');
  }

  const text = await extractTextFromFile(req.file.buffer, req.file.mimetype);

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error('Unable to extract readable text from the uploaded file');
  }

  const title = req.body.title || req.file.originalname.replace(/\.[^/.]+$/, '');
  const analysis = await analyzeLegalText(text);

  const document = await Document.create({
    user: req.user._id,
    title,
    content: text,
    analysis,
  });

  res.status(201).json({ document, analysis });
};
