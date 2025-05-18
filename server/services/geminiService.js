

// server/services/geminiService.js
const { getGeminiModel } = require('../config/gemini');
const Resume = require('../models/ResumeModel');
const JobDescription = require('../models/JobDescriptionModel');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * Constructs the prompt for Gemini API.
 * @param {string} resumeText - The extracted text from the resume.
 * @param {string} jobDescriptionText - The text of the job description.
 * @param {string[]} [mustHaveSkills=[]] - Optional array of must-have skills.
 * @param {string[]} [focusAreas=[]] - Optional array of focus areas.
 * @returns {string} The formatted prompt.
 */
const constructPrompt = (resumeText, jobDescriptionText, mustHaveSkills = [], focusAreas = []) => {
    let prompt = `
    Analyze the following resume against the provided job description.
    Your goal is to extract specific information, evaluate the candidate's fit, and provide a score.

    **IMPORTANT INSTRUCTIONS:**
    1.  **RESPOND ONLY IN VALID JSON FORMAT.** Do not include any text outside the JSON structure.
    2.  **EXPLICITLY EXCLUDE ALL PERSONALLY IDENTIFIABLE INFORMATION (PII)**. This includes but is not limited to: name, email address, phone number, physical address, social media links, photos, or any other data that can directly identify an individual. If PII is found in fields like 'skills' or 'education', please omit or generalize it. For example, instead of "John Doe University", use "a university". **If PII cannot be adequately anonymized or generalized within a specific data point (e.g., a skill that is a person's name, or an educational institution that is too specific and unique), use a placeholder like \"[REDACTED FOR PII]\" for that specific data point, or omit the data point if the entire field would be PII.**
    3.  The 'fitScore' should be an integer between 1 (very poor fit) and 10 (excellent fit).
    4.  'yearsExperience' should be an estimated number of years of relevant experience based on the job description. It can be a number (e.g., 5), a range (e.g., '3-5'), a string like '10+', or null if not determinable.
    5.  'skills' should be a list of skills relevant to the job description found in the resume.
    6.  'education' should be a list of educational qualifications.
    7.  'justification' should be a concise explanation for the given 'fitScore', highlighting key strengths or weaknesses relative to the job description.
    8.  **Keyword Evaluation:** Differentiate between a resume that merely lists many keywords and one that demonstrates genuine application of those skills through described experiences and achievements. The depth and context of experience are more important than the sheer number of keyword mentions when determining the score and justification.
    9.  **Warnings Field:** If you identify specific critical skills from the job description that are clearly missing in the resume, or if there are ambiguities that prevent a full assessment, include a brief note in the 'warnings' array within the JSON.

    **JSON OUTPUT STRUCTURE (Strictly Adhere to this format):**
    \`\`\`json
    {
      "skills": ["string"],
      "yearsExperience": "number (e.g., 5) or string (e.g., '0-2', '10+'), or null if not determinable",
      "education": [
        {
          "degree": "string (e.g., 'Bachelor of Science in Computer Science')",
          "institution": "string (e.g., 'a well-known university' - ANONYMIZED)",
          "graduationYear": "string (e.g., '2020' or null)"
        }
      ],
      "fitScore": "number (integer 1-10)",
      "justification": "string",
      "warnings": ["string"]
    }
    \`\`\`

    **JOB DESCRIPTION:**
    ---
    ${jobDescriptionText}
    ---

    **RESUME TEXT:**
    ---
    ${resumeText}
    ---
    `;

    if (mustHaveSkills.length > 0) {
        prompt += `\n\n**MUST-HAVE SKILLS (Pay special attention):** ${mustHaveSkills.join(', ')}. The presence or absence of these skills should significantly impact the fitScore and justification. If any of these must-have skills are missing, please note this in the 'warnings' array.`;
    }
    if (focusAreas.length > 0) {
        prompt += `\n\n**KEY FOCUS AREAS (Evaluate experience related to these more heavily):** ${focusAreas.join(', ')}.`;
    }

    prompt += "\n\n**Now, provide your analysis in the specified JSON format only:**";
    return prompt;
};


/**
 * Analyzes resume and job description using Gemini API.
 * @param {string} resumeText - The extracted text from the resume.
 * @param {string} jobDescriptionText - The text of the job description.
 * @param {string[]} [mustHaveSkills=[]] - Optional array of must-have skills.
 * @param {string[]} [focusAreas=[]] - Optional array of focus areas.
 * @returns {Promise<Object>} The parsed JSON response from Gemini.
 * @throws {Error} If API call fails or response is not valid JSON.
 */
const analyzeWithGemini = async (resumeText, jobDescriptionText, mustHaveSkills = [], focusAreas = []) => {
  const model = getGeminiModel();
  if (!model) {
    throw new Error('Gemini model not initialized.');
  }

  const prompt = constructPrompt(resumeText, jobDescriptionText, mustHaveSkills, focusAreas);

  const generationConfig = {
    maxOutputTokens: 2048,
    temperature: 0.3,
    // responseMimeType: "application/json", // If supported by the specific Gemini model version and SDK
  };

  console.log("Sending prompt to Gemini. Prompt length:", prompt.length);
  // console.log("Prompt content (first 500 chars):", prompt.substring(0,500));

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
      try {
          const result = await model.generateContent(prompt, generationConfig);
          const response = await result.response;
          
          // Check for safety ratings or blocks if the API provides them
          if (response.promptFeedback && response.promptFeedback.blockReason) {
              const blockReason = response.promptFeedback.blockReason;
              const safetyRatings = response.promptFeedback.safetyRatings || [];
              console.error(`Gemini prompt blocked. Reason: ${blockReason}. Safety ratings: ${JSON.stringify(safetyRatings)}`);
              throw new Error(`Content generation blocked by API due to: ${blockReason}. Please review prompt and content policy.`);
          }
          
          const responseText = response.text();
          // console.log("Gemini raw response text:", responseText);

          let cleanedJsonText = responseText.trim();
          if (cleanedJsonText.startsWith("```json")) {
              cleanedJsonText = cleanedJsonText.substring(7);
          }
          if (cleanedJsonText.endsWith("```")) {
              cleanedJsonText = cleanedJsonText.substring(0, cleanedJsonText.length - 3);
          }
          cleanedJsonText = cleanedJsonText.trim();

          const jsonStartMarker = '{';
          const jsonEndMarker = '}';
          const startIndex = cleanedJsonText.indexOf(jsonStartMarker);
          const endIndex = cleanedJsonText.lastIndexOf(jsonEndMarker);

          if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
              console.error("Gemini response does not appear to contain valid JSON object markers:", cleanedJsonText.substring(0, 200));
              throw new Error("Gemini response does not contain valid JSON object markers. Response: " + cleanedJsonText.substring(0, 200));
          }

          const potentialJson = cleanedJsonText.substring(startIndex, endIndex + 1);
          const parsedResponse = JSON.parse(potentialJson);
          return parsedResponse;

      } catch (error) {
          console.error(`Gemini API call attempt ${attempt + 1} failed:`, error.message);
          attempt++;
          if (attempt >= MAX_RETRIES) {
              if (error instanceof SyntaxError) {
                  throw new Error(`Failed to parse Gemini response as JSON after ${MAX_RETRIES} attempts. Last response fragment: ${error.message}`);
              }
              throw new Error(`Gemini API call failed after ${MAX_RETRIES} attempts: ${error.message}`);
          }
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (attempt +1))); // Slightly increasing delay
      }
  }
  // Should not be reached if MAX_RETRIES is effective
  throw new Error("Gemini analysis failed after all retries.");
};


/**
 * Triggers the Gemini analysis for a given resume ID.
 * This function is designed to be called asynchronously.
 * @param {string} resumeId - The MongoDB ObjectId of the resume to process.
 */
const triggerGeminiAnalysis = async (resumeId) => {
  console.log(`[GeminiService] Starting analysis for resumeId: ${resumeId}`);
  let resumeDoc;
  try {
    resumeDoc = await Resume.findById(resumeId);
    if (!resumeDoc) {
      console.error(`[GeminiService] Resume not found for ID: ${resumeId}`);
      return;
    }

    if (resumeDoc.processingStatus === 'completed' || resumeDoc.processingStatus === 'processing') {
        console.log(`[GeminiService] Resume ${resumeId} is already ${resumeDoc.processingStatus}. Skipping re-analysis unless explicitly requested.`);
        return;
    }

    const jobDoc = await JobDescription.findById(resumeDoc.jobId);
    if (!jobDoc) {
      console.error(`[GeminiService] JobDescription not found for jobId: ${resumeDoc.jobId} (resume ${resumeId})`);
      await resumeDoc.updateOne({
        processingStatus: 'error',
        errorDetails: 'Associated job description not found.',
      });
      return;
    }

    await resumeDoc.updateOne({ processingStatus: 'processing', errorDetails: null }); // Clear previous errors
    console.log(`[GeminiService] Resume ${resumeId} status updated to 'processing'.`);

    const analysisResult = await analyzeWithGemini(
        resumeDoc.extractedText,
        jobDoc.descriptionText,
        jobDoc.mustHaveSkills || [],
        jobDoc.focusAreas || []
    );

    if (!analysisResult || typeof analysisResult.fitScore === 'undefined' || !analysisResult.justification) {
        throw new Error('Gemini response is missing required fields (fitScore, justification) or is not in the expected structure.');
    }

    // --- PII Scanning and Redaction ---
    let updatedAnalysisResult = JSON.parse(JSON.stringify(analysisResult)); // Deep clone
    let systemWarnings = updatedAnalysisResult.warnings || []; // Keep Gemini's warnings

    const piiPatterns = [
        { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/gi, type: "Email" }, // Added 'i' for case-insensitive
        { pattern: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, type: "Phone" },
        // Add more critical PII patterns here if necessary, but be cautious with regex for names/addresses
    ];

    // Scan and redact skills
    if (updatedAnalysisResult.skills && Array.isArray(updatedAnalysisResult.skills)) {
        updatedAnalysisResult.skills = updatedAnalysisResult.skills.map(skill => {
            let cleanedSkill = skill;
            let skillRedacted = false;
            piiPatterns.forEach(p => {
                if (p.pattern.test(skill)) { // Test before replacing
                    const warningMsg = `System: Potential PII (${p.type}) detected and redacted from skill: '${skill.substring(0,20)}...'.`;
                    if (!systemWarnings.includes(warningMsg)) systemWarnings.push(warningMsg);
                    cleanedSkill = cleanedSkill.replace(p.pattern, `[REDACTED ${p.type}]`);
                    skillRedacted = true;
                }
                p.pattern.lastIndex = 0; // Reset regex lastIndex if using 'g' flag
            });
            if(skillRedacted) console.warn(`[GeminiService PII Scan] Redacted skill for resume ${resumeId}. Original was: ${skill}`);
            return cleanedSkill;
        });
    }

    // Scan education institutions (warn only, for now)
    if (updatedAnalysisResult.education && Array.isArray(updatedAnalysisResult.education)) {
        updatedAnalysisResult.education.forEach(edu => { // No need to map if not changing structure
            if (edu.institution && typeof edu.institution === 'string') {
                piiPatterns.forEach(p => {
                    if (p.pattern.test(edu.institution)) {
                        const warningMsg = `System: Potential PII (${p.type}) detected in education institution: '${edu.institution}'. Manual review advised.`;
                        if (!systemWarnings.includes(warningMsg)) systemWarnings.push(warningMsg);
                        console.warn(`[GeminiService PII Scan] ${warningMsg} for resume ${resumeId}`);
                    }
                    p.pattern.lastIndex = 0; // Reset regex lastIndex
                });
            }
        });
    }

    // Scan justification (warn only, for now, as redaction can make it unreadable)
    if (updatedAnalysisResult.justification && typeof updatedAnalysisResult.justification === 'string') {
        piiPatterns.forEach(p => {
            if (p.pattern.test(updatedAnalysisResult.justification)) {
                const warningMsg = `System: Potential PII (${p.type}) detected in 'justification'. Manual review advised.`;
                if (!systemWarnings.includes(warningMsg)) systemWarnings.push(warningMsg);
                console.warn(`[GeminiService PII Scan] ${warningMsg} for resume ${resumeId}`);
                // To redact: updatedAnalysisResult.justification = updatedAnalysisResult.justification.replace(p.pattern, `[REDACTED ${p.type}]`);
            }
            p.pattern.lastIndex = 0; // Reset regex lastIndex
        });
    }
    updatedAnalysisResult.warnings = Array.from(new Set(systemWarnings)); // Ensure unique warnings

    // --- End PII Scanning ---

    await resumeDoc.updateOne({
      geminiAnalysis: updatedAnalysisResult,
      score: Number(updatedAnalysisResult.fitScore) || 0,
      processingStatus: 'completed',
      errorDetails: null,
    });
    console.log(`[GeminiService] Analysis completed successfully for resumeId: ${resumeId}. Score: ${updatedAnalysisResult.fitScore}. Warnings: ${updatedAnalysisResult.warnings.length}`);

  } catch (error) {
    console.error(`[GeminiService] Error during Gemini analysis for resumeId ${resumeId}:`, error);
    // Log the full error object if it's not a simple string
    if (typeof error === 'object' && error !== null) console.error(error);

    if (resumeDoc) {
      await resumeDoc.updateOne({
        processingStatus: 'error',
        errorDetails: error.message ? error.message.substring(0, 1000) : "Unknown processing error",
      }).catch(updateErr => console.error(`[GeminiService] Failed to update resume ${resumeId} to error state:`, updateErr));
    }
  }
};

module.exports = {
  analyzeWithGemini,
  triggerGeminiAnalysis,
  constructPrompt,
};