import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionCategory, TransactionStatus } from "../types";
import { v4 as uuidv4 } from 'uuid';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

// Prompt engineering to guide Gemini
const SYSTEM_INSTRUCTION = `
You are an expert financial accountant AI. Your role is to parse raw unstructured text, CSV lines, or bank statement snippets into structured financial data.
Focus ONLY on CREDIT or DEPOSIT transactions (incomes). Ignore debits or withdrawals unless explicitly marked as a refund (positive flow).
Infer the 'payer' from the description if possible. 
Categorize each transaction into one of the following: 'Sales', 'Service Revenue', 'Investment', 'Refund', 'Grant', 'Other'.
Ensure the date is in ISO 8601 format (YYYY-MM-DD).
`;

export const parseBankStatement = async (rawText: string): Promise<Transaction[]> => {
  try {
    const ai = getAiClient();
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract income transactions from the following bank statement text:\n\n${rawText}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING, description: "Transaction date in YYYY-MM-DD format" },
              amount: { type: Type.NUMBER, description: "Amount of the income. Must be positive." },
              description: { type: Type.STRING, description: "Original description line from the bank statement" },
              payer: { type: Type.STRING, description: "The entity paying the money, inferred from description" },
              category: { 
                type: Type.STRING, 
                enum: [
                  "Sales",
                  "Service Revenue",
                  "Investment",
                  "Refund",
                  "Grant",
                  "Other"
                ] 
              }
            },
            required: ["date", "amount", "description", "payer", "category"]
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    const parsedData = JSON.parse(jsonStr);

    // Map AI result to our internal Transaction type
    return parsedData.map((item: any) => ({
      id: uuidv4(), // Generate a temp ID
      date: item.date,
      amount: item.amount,
      description: item.description,
      payer: item.payer || "Unknown Payer",
      category: item.category as TransactionCategory,
      status: TransactionStatus.PENDING, // Default to pending for user review
      rawText: item.description
    }));

  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw new Error("Failed to process bank statement with AI.");
  }
};