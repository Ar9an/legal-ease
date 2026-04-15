import { createWorker } from 'tesseract.js';
import pdfParse from 'pdf-parse';
import { createCanvas } from 'canvas';
import pkg from 'pdfjs-dist/legacy/build/pdf.js';
const { getDocument } = pkg;

const createTesseractWorker = async () => {
  const worker = createWorker({
    logger: () => {},
  });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  return worker;
};

const ocrImage = async (buffer) => {
  const worker = await createTesseractWorker();

  try {
    const { data } = await worker.recognize(buffer);
    return data.text || '';
  } finally {
    await worker.terminate();
  }
};

const renderPdfPagesToImages = async (buffer) => {
  const loadingTask = getDocument({ data: new Uint8Array(buffer) });
  const pdfDocument = await loadingTask.promise;
  const pageCount = pdfDocument.numPages;
  const images = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum += 1) {
    const page = await pdfDocument.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    await page.render({ canvasContext: context, viewport }).promise;
    images.push(canvas.toBuffer('image/png'));
  }

  return images;
};

export const extractTextFromFile = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const parsed = await pdfParse(buffer);
    const text = parsed.text?.trim();

    if (text && text.length > 20) {
      return text;
    }

    const pageImages = await renderPdfPagesToImages(buffer);
    let ocrText = '';

    for (const imageBuffer of pageImages) {
      const pageText = await ocrImage(imageBuffer);
      if (pageText && pageText.trim().length > 0) {
        ocrText += `${pageText.trim()}\n\n`;
      }
    }

    return ocrText.trim();
  }

  return await ocrImage(buffer);
};
