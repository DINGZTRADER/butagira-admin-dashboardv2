import { GoogleGenAI, Type } from "@google/genai";
import type { Document } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the key is missing.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateEmailReply = async (originalEmailBody: string, subject: string): Promise<string> => {
  const prompt = `
    You are a highly efficient and professional legal administrative assistant for Butagira and Co. Advocates, a premier law firm in Uganda founded in 1980 with a long-standing tradition of excellence and integrity. The firm operates under the jurisdiction of the Republic of Uganda.
    Your task is to draft a response to the following client email.
    
    Key Instructions:
    - Be polite, professional, and empathetic.
    - Acknowledge the client's message.
    - If they are asking for a meeting, suggest a follow-up call to schedule.
    - Do not provide any legal advice. Defer to the attorneys for legal matters.
    - Keep the response concise and clear.
    - Sign off as "The Administrative Team, Butagira & Co. Advocates".
    
    Original Email Subject: "${subject}"
    Original Email Body:
    ---
    ${originalEmailBody}
    ---
    
    Drafted Reply:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating email reply:", error);
    return "Could not generate a reply at this time. Please try again later.";
  }
};

export const summarizeDocument = async (documentContent: string): Promise<string> => {
    const prompt = `
    You are a legal assistant tasked with summarizing legal documents for quick review by a senior partner at a Ugandan law firm. Your summary should be contextualized within the Ugandan legal framework.
    Summarize the following document into 3-4 key bullet points. Focus on the main purpose, parties involved, and any critical dates or actions mentioned.

    Document Content:
    ---
    ${documentContent}
    ---

    Summary:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error summarizing document:", error);
        return "Could not generate a summary at this time.";
    }
};

export const analyzeDocument = async (documentContent: string): Promise<string> => {
    const prompt = `
        You are a senior legal analyst at Butagira and Co. Advocates, a top Ugandan law firm. Your task is to analyze the following legal document and provide a structured report for a senior partner, keeping the Ugandan legal context in mind.
        
        Extract the following information from the document:
        - A concise summary of the document's purpose.
        - All parties involved (e.g., individuals, companies).
        - Any critical dates or deadlines mentioned.
        - Potential risks or points of concern for our client.
        
        Document Content:
        ---
        ${documentContent}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "A concise summary of the document's purpose." },
                        keyParties: { type: Type.ARRAY, items: { type: Type.STRING }, description: "All parties involved (e.g., individuals, companies)." },
                        criticalDates: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Any critical dates or deadlines mentioned." },
                        potentialRisks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential risks or points of concern for our client." },
                    },
                    required: ["summary", "keyParties", "criticalDates", "potentialRisks"],
                },
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error analyzing document:", error);
        return JSON.stringify({ error: "Could not generate an analysis at this time." });
    }
};

export const analyzeEmail = async (emailBody: string, subject: string): Promise<string> => {
    const prompt = `
        You are a highly intelligent legal administrative assistant. Your task is to analyze the following email and extract key information for a busy lawyer.

        Email Subject: "${subject}"
        Email Body:
        ---
        ${emailBody}
        ---

        Analyze the email for the following:
        1.  **Sentiment**: Is the tone Positive, Negative, Neutral, or Urgent?
        2.  **Action Items**: List any specific tasks or actions requested.
        3.  **Meeting Requests**: Identify any requests to schedule a meeting or call.
        4.  **Key Dates**: Extract any mentioned dates or deadlines.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentiment: { type: Type.STRING, description: "The overall sentiment of the email (Positive, Negative, Neutral, or Urgent)." },
                        actionItems: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of specific action items or tasks requested in the email." },
                        meetingRequests: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Any phrases or sentences that constitute a request for a meeting or call." },
                        keyDates: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Any specific dates or deadlines mentioned in the email." },
                    },
                    required: ["sentiment", "actionItems", "meetingRequests", "keyDates"],
                },
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error analyzing email:", error);
        return JSON.stringify({ error: "Could not generate an analysis for this email." });
    }
};


export const queryDocuments = async (userQuery: string, documentContent: string): Promise<string> => {
  const prompt = `
    You are a legal assistant for Butagira & Co. Advocates in Uganda. Your task is to answer a partner's question based *only* on the content of the provided legal document.

    - **Strictly adhere to the provided document.** Do not use any external knowledge or make assumptions. Your interpretation should be consistent with Ugandan legal practice where relevant.
    - If the answer cannot be found in the document, you must state: "The answer to your question cannot be found in the provided document."
    
    DOCUMENT CONTENT:
    ---
    ${documentContent}
    ---
    
    PARTNER'S QUESTION: "${userQuery}"
    
    ANSWER:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error querying document:", error);
    return "I am sorry, but I encountered an error trying to answer your question.";
  }
};

export const performRAGQuery = async (query: string, documents: Document[]): Promise<{ answer: string; sources: Document[] }> => {
    // 1. Retrieval: Find relevant documents using a simple keyword-based scoring.
    const queryWords = query.toLowerCase().split(/\s+/);
    const relevantDocs = documents
        .map(doc => {
            let score = 0;
            const contentLower = doc.content.toLowerCase();
            const nameLower = doc.name.toLowerCase();
            
            for (const word of queryWords) {
                if (contentLower.includes(word)) score++;
                if (nameLower.includes(word)) score += 2; // Weight name matches higher
            }
            return { doc, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3) // Take top 3 most relevant documents
        .map(item => item.doc);

    if (relevantDocs.length === 0) {
        return {
            answer: "I couldn't find any relevant documents to answer your question. Please try rephrasing or check if the necessary documents have been uploaded.",
            sources: [],
        };
    }

    // 2. Augmentation: Construct the prompt with retrieved context.
    const context = relevantDocs.map(doc => 
        `---
        Document Name: "${doc.name}"
        Content:
        ${doc.content.substring(0, 2000)}... 
        ---`
    ).join('\n\n');

    const prompt = `
        You are an AI Legal Assistant for Butagira & Co. Advocates, a law firm in Uganda.
        Your task is to answer the user's question based *only* on the content of the provided documents below.
        Be concise, professional, and directly answer the question.
        At the end of your answer, you MUST cite the source document names you used. For example: "(Source: Supply_Agreement_v2.pdf)". If you use multiple sources, list them all. Do not make up information. If the answer is not in the documents, state that clearly.

        CONTEXT DOCUMENTS:
        ${context}

        USER'S QUESTION: "${query}"

        ANSWER:
    `;

    // 3. Generation: Call Gemini API.
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return {
            answer: response.text.trim(),
            sources: relevantDocs,
        };
    } catch (error) {
        console.error("Error performing RAG query with Gemini:", error);
        return {
            answer: "I am sorry, but I encountered an error while generating the response.",
            sources: relevantDocs,
        };
    }
};