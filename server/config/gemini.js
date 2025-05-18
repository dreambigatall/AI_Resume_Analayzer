// server/config/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
let generativeModel; // Store the model instance

const initGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('GEMINI_API_KEY missing in .env file');
    // Depending on whether Gemini is critical at startup, you might:
    // throw new Error('GEMINI_API_KEY is required');
    // or just log the error and let parts of the app fail later.
    return null;
  }

  if (!genAI) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        // Initialize a specific model instance (e.g., gemini-pro)
        // You might adjust the model name as needed
        generativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log('Google Gemini client and model initialized (gemini-2.0-flash).');
    } catch (error) {
        console.error("Failed to initialize Google Gemini client:", error);
        genAI = null; // Ensure it's null if initialization fails
        generativeModel = null;
    }
  }
  // Return the main client instance or the model instance as needed
  // Returning the model instance might be more convenient for direct use
  return { genAI, generativeModel };
};

// Function to get the initialized client/model instance
const getGeminiModel = () => {
    if (!generativeModel) {
        console.warn('Gemini model requested before initialization or initialization failed.');
        // Attempt initialization again or handle error
        const initialized = initGemini();
        return initialized ? initialized.generativeModel : null;
    }
    return generativeModel;
}

 const getGeminiClient = () => {
     if (!genAI) {
        console.warn('Gemini client requested before initialization or initialization failed.');
        const initialized = initGemini();
        return initialized ? initialized.genAI : null;
     }
     return genAI;
 }

module.exports = { initGemini, getGeminiModel, getGeminiClient };