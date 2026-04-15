import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const highlightRisks = (text) => {
  const riskTerms = [
    'automatic renewal',
    'late fee',
    'termination',
    'indemnify',
    'liability',
    'non-compete',
    'governing law',
    'arbitration',
    'confidential',
  ];
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const riskLines = lines.filter((line) =>
    riskTerms.some((term) => line.toLowerCase().includes(term))
  );

  return {
    riskClauses: riskLines,
    flagged: riskLines.map((line) => ({ text: line, severity: 'high' })),
  };
};

export const analyzeLegalText = async (content) => {
  if (openai) {
    const prompt = `You are a legal assistant. Convert the following legal text into clear, plain English. Explain what the document really means, call out the riskiest clauses, summarize obligations line by line, and offer negotiation tips that a first-time signer can use. Respond with JSON only in this format:\n{\n  \"summary\": \"...\",\n  \"risks\": [\"...\"],\n  \"obligations\": [\"...\"],\n  \"negotiationTips\": [\"...\"]\n}\nText:\n${content}`;

    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
      max_tokens: 700,
    });

    const text = response.output?.[0]?.content?.[0]?.text || '';

    try {
      return JSON.parse(text);
    } catch (error) {
      return {
        summary: 'Could not parse OpenAI response cleanly.',
        risks: [],
        obligations: [],
        negotiationTips: [],
        rawOutput: text,
      };
    }
  }

  const riskInfo = highlightRisks(content);
  return {
    summary: `This document contains ${riskInfo.riskClauses.length} potentially risky clauses. Review the highlighted terms carefully.`,
    risks: riskInfo.riskClauses,
    obligations: [
      'Follow the terms described in the text',
      'Watch for penalties tied to fees, renewal, and termination',
    ],
    negotiationTips: [
      'Ask for clearer termination rights and fee caps',
      'Request that unclear liability and indemnity terms be simplified',
    ],
  };
};
