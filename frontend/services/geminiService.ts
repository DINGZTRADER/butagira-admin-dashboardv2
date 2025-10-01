import { GoogleGenAI, Type } from "@google/genai";
import type { Document, AnalysisReport } from '../types';

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
    You are a highly skilled legal assistant at Butagira and Co. Advocates, a prestigious law firm in Uganda established in 1980.
    Your task is to create a professional, comprehensive summary of the following legal document for quick review by senior partners.
    
    SUMMARY REQUIREMENTS:
    - Create a structured summary with clear sections
    - Focus on the document's main purpose and legal significance
    - Highlight key parties and their roles
    - Identify critical dates, deadlines, and obligations
    - Note any unusual terms, conditions, or potential concerns
    - Consider Ugandan legal context and jurisdiction where relevant
    - Keep the summary concise but comprehensive (3-5 paragraphs)
    
    STRUCTURE YOUR SUMMARY AS:
    **Document Purpose:** [Main objective and type of document]
    
    **Key Parties:** [Who is involved and their roles]
    
    **Critical Information:** [Important dates, amounts, obligations, terms]
    
    **Notable Provisions:** [Any significant clauses, conditions, or concerns]

    Document Content:
    ---
    ${documentContent}
    ---

    Professional Summary:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3, // Balanced temperature for structured but natural summaries
                topP: 0.9,
                topK: 40,
            },
        });

        if (!response || !response.text) {
            throw new Error("Empty response from AI service");
        }

        return response.text.trim();
    } catch (error) {
        console.error("Error summarizing document:", error);
        return "Unable to generate document summary due to a technical error. Please try again or contact system support if the issue persists.";
    }
};

export const analyzeDocument = async (documentContent: string): Promise<string> => {
    const prompt = `
        You are a senior legal analyst at Butagira and Co. Advocates, a prestigious law firm in Uganda established in 1980. 
        Your task is to analyze the following legal document and provide a comprehensive structured report for a senior partner.
        
        ANALYSIS REQUIREMENTS:
        - Provide a clear, concise summary of the document's main purpose and significance
        - Identify ALL parties involved (individuals, companies, government entities, etc.)
        - Extract ALL critical dates, deadlines, and time-sensitive information
        - Identify potential legal risks, compliance issues, or areas requiring attention
        - Consider Ugandan legal framework and jurisdiction where applicable
        - Be thorough but maintain professional brevity
        
        Document Content:
        ---
        ${documentContent}
        ---
        
        Provide your analysis in the exact JSON format specified below:
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
                        summary: {
                            type: Type.STRING,
                            description: "A comprehensive summary of the document's purpose, key provisions, and legal significance (2-3 sentences)"
                        },
                        keyParties: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "All parties mentioned in the document including their roles (e.g., 'ABC Corporation (Contractor)', 'John Doe (Witness)')"
                        },
                        criticalDates: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "All important dates, deadlines, and time-sensitive information with context (e.g., 'Contract expiry: December 31, 2024', 'Filing deadline: 30 days from service')"
                        },
                        potentialRisks: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Legal risks, compliance concerns, ambiguous terms, or areas requiring careful attention"
                        },
                    },
                    required: ["summary", "keyParties", "criticalDates", "potentialRisks"],
                },
                temperature: 0.2, // Lower temperature for more consistent, factual analysis
                topP: 0.8,
            },
        });

        // Validate the response
        const result = JSON.parse(response.text.trim());

        // Ensure arrays are properly formatted
        if (!Array.isArray(result.keyParties)) result.keyParties = [];
        if (!Array.isArray(result.criticalDates)) result.criticalDates = [];
        if (!Array.isArray(result.potentialRisks)) result.potentialRisks = [];

        return JSON.stringify(result);
    } catch (error) {
        console.error("Error analyzing document:", error);
        return JSON.stringify({
            summary: "Document analysis failed due to a technical error. Please try again or contact system support if the issue persists.",
            keyParties: [],
            criticalDates: [],
            potentialRisks: ["Unable to complete analysis - technical error occurred"],
            error: "Analysis failed due to technical error"
        });
    }
};

// FIX: Added missing analyzeEmail function.
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
    You are an expert legal assistant for Butagira & Co. Advocates, a prestigious law firm in Uganda established in 1980.
    
    TASK: Answer the partner's question based EXCLUSIVELY on the content of the provided legal document.
    
    INSTRUCTIONS:
    - Read the document thoroughly and answer only what can be found within it
    - Provide specific, accurate information with exact quotes when relevant
    - If the document contains partial information, acknowledge what is and isn't covered
    - Structure your response clearly and professionally
    - Consider Ugandan legal context where applicable
    - If the answer absolutely cannot be found in the document, state this clearly and suggest what information would be needed
    
    DOCUMENT CONTENT:
    ---
    ${documentContent}
    ---
    
    PARTNER'S QUESTION: "${userQuery}"
    
    DETAILED RESPONSE:
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2, // Lower temperature for more precise, factual responses
                topP: 0.8,
                topK: 40,
            },
        });

        if (!response || !response.text) {
            throw new Error("Empty response from AI service");
        }

        return response.text.trim();
    } catch (error) {
        console.error("Error querying document:", error);
        return "I apologize, but I encountered a technical error while analyzing the document to answer your question. Please try again, and if the problem persists, contact system support.";
    }
};

export const performRAGQuery = async (query: string, documents: Document[]): Promise<{ answer: string; sources: Document[] }> => {
    // 1. Retrieval: Enhanced document relevance scoring with better semantic matching
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2); // Filter out short words
    const relevantDocs = documents
        .map(doc => {
            let score = 0;
            const contentLower = doc.content.toLowerCase();
            const nameLower = doc.name.toLowerCase();
            const typeLower = doc.type.toLowerCase();

            // Enhanced scoring algorithm
            for (const word of queryWords) {
                // Exact word matches in content
                if (contentLower.includes(word)) {
                    score += 1;
                    // Bonus for multiple occurrences
                    const occurrences = (contentLower.match(new RegExp(word, 'g')) || []).length;
                    score += Math.min(occurrences - 1, 3) * 0.5; // Cap bonus at 1.5 points
                }

                // Higher weight for document name matches
                if (nameLower.includes(word)) score += 3;

                // Document type relevance
                if (typeLower.includes(word)) score += 2;

                // Partial word matching for better recall
                const partialMatches = contentLower.split(' ').filter(contentWord =>
                    contentWord.includes(word) || word.includes(contentWord)
                ).length;
                score += partialMatches * 0.3;
            }

            // Boost score for longer documents (more likely to contain relevant info)
            score += Math.min(doc.content.length / 1000, 2);

            return { doc, score };
        })
        .filter(item => item.score > 0.5) // Higher threshold for relevance
        .sort((a, b) => b.score - a.score)
        .slice(0, 5) // Increase to top 5 most relevant documents
        .map(item => item.doc);

    if (relevantDocs.length === 0) {
        return {
            answer: "I couldn't find any relevant documents to answer your question. Please try rephrasing your query with different keywords or check if the necessary documents have been uploaded to the system.",
            sources: [],
        };
    }

    // 2. Augmentation: Construct enhanced prompt with better context
    const context = relevantDocs.map((doc, index) =>
        `---
        Document ${index + 1}: "${doc.name}" (Type: ${doc.type})
        Content:
        ${doc.content.substring(0, 3000)}${doc.content.length > 3000 ? '...' : ''}
        ---`
    ).join('\n\n');

    const prompt = `
        You are an expert AI Legal Assistant for Butagira & Co. Advocates, a prestigious law firm in Uganda established in 1980.
        
        INSTRUCTIONS:
        - Answer the user's question based EXCLUSIVELY on the provided document content
        - Be precise, professional, and comprehensive in your response
        - If information spans multiple documents, synthesize it coherently
        - Always cite specific document names when referencing information
        - If the answer cannot be found in the documents, clearly state this limitation
        - Consider Ugandan legal context where relevant
        - Structure your response with clear sections if answering complex questions

        AVAILABLE DOCUMENTS:
        ${context}

        USER'S QUESTION: "${query}"

        RESPONSE:
    `;

    // 3. Generation: Call Gemini API with enhanced error handling
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3, // Lower temperature for more focused, factual responses
                topP: 0.8,
                topK: 40,
            },
        });

        if (!response || !response.text) {
            throw new Error("Empty response from AI service");
        }

        return {
            answer: response.text.trim(),
            sources: relevantDocs,
        };
    } catch (error) {
        console.error("Error performing RAG query with Gemini:", error);
        return {
            answer: "I apologize, but I encountered a technical error while processing your request. Please try again, and if the problem persists, contact system support.",
            sources: relevantDocs,
        };
    }
};

// Enhanced batch processing function for multiple documents
export const batchSummarizeDocuments = async (documents: Document[]): Promise<{ [key: string]: string }> => {
    const summaries: { [key: string]: string } = {};

    for (const doc of documents) {
        try {
            summaries[doc.id] = await summarizeDocument(doc.content);
            // Add a small delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`Error summarizing document ${doc.name}:`, error);
            summaries[doc.id] = `Failed to summarize ${doc.name}. Please try again later.`;
        }
    }

    return summaries;
};

// Enhanced batch analysis function for multiple documents
export const batchAnalyzeDocuments = async (documents: Document[]): Promise<{ [key: string]: AnalysisReport }> => {
    const analyses: { [key: string]: AnalysisReport } = {};

    for (const doc of documents) {
        try {
            const resultString = await analyzeDocument(doc.content);
            const resultJson = JSON.parse(resultString);

            if (resultJson.error) {
                analyses[doc.id] = {
                    summary: "Analysis could not be completed due to an error.",
                    keyParties: [],
                    criticalDates: [],
                    potentialRisks: [resultJson.error],
                    error: resultJson.error
                };
            } else {
                analyses[doc.id] = resultJson as AnalysisReport;
            }

            // Add a small delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error(`Error analyzing document ${doc.name}:`, error);
            analyses[doc.id] = {
                summary: "Failed to analyze document due to technical error.",
                keyParties: [],
                criticalDates: [],
                potentialRisks: ["Analysis failed - technical error"],
                error: "Technical error occurred during analysis"
            };
        }
    }

    return analyses;
};

// Document validation and preprocessing function
export const validateDocumentContent = (content: string): { isValid: boolean; issues: string[]; suggestions: string[] } => {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check document length
    if (content.length < 100) {
        issues.push("Document content is very short (less than 100 characters)");
        suggestions.push("Ensure the complete document content has been uploaded");
    }

    if (content.length > 50000) {
        issues.push("Document content is very long (over 50,000 characters)");
        suggestions.push("Consider breaking large documents into smaller sections for better analysis");
    }

    // Check for common OCR or formatting issues
    if (content.includes('�') || content.includes('\ufffd')) {
        issues.push("Document contains invalid characters, possibly from OCR errors");
        suggestions.push("Review the document for scanning or encoding issues");
    }

    // Check for excessive whitespace or formatting issues
    const excessiveWhitespace = content.split(/\s+/).length < content.length / 10;
    if (excessiveWhitespace) {
        issues.push("Document appears to have formatting issues or excessive whitespace");
        suggestions.push("Clean up document formatting for better analysis results");
    }

    // Check for minimum meaningful content
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 20) {
        issues.push(`Document has very few words (${wordCount})`);
        suggestions.push("Ensure complete document content is provided for meaningful analysis");
    }

    return {
        isValid: issues.length === 0,
        issues,
        suggestions
    };
};

// Enhanced cross-document analysis for finding relationships
export const performCrossDocumentAnalysis = async (documents: Document[], focusArea: string): Promise<string> => {
    if (documents.length < 2) {
        return "Cross-document analysis requires at least 2 documents.";
    }

    const documentSummaries = documents.map(doc =>
        `Document: "${doc.name}" (${doc.type})\nContent Summary: ${doc.content.substring(0, 1000)}...\n---`
    ).join('\n\n');

    const prompt = `
        You are a senior legal analyst at Butagira & Co. Advocates. Perform a cross-document analysis to identify relationships, 
        patterns, and insights across the provided documents with a focus on: ${focusArea}
        
        ANALYSIS FOCUS: ${focusArea}
        
        INSTRUCTIONS:
        - Identify connections and relationships between documents
        - Look for consistent terms, parties, dates, or obligations across documents
        - Highlight any contradictions or inconsistencies
        - Identify patterns that might indicate risks or opportunities
        - Provide actionable insights for legal strategy
        
        DOCUMENTS TO ANALYZE:
        ${documentSummaries}
        
        CROSS-DOCUMENT ANALYSIS REPORT:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.4,
                topP: 0.9,
            },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error performing cross-document analysis:", error);
        return "Failed to perform cross-document analysis due to technical error.";
    }
};