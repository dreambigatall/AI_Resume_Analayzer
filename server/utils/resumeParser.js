// server/utils/resumeParser.js
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const extractTextFromBuffer = async (fileBuffer, mimeType) => {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdf(fileBuffer);
      return data.text;
    } else if (
      mimeType === 'application/msword' || // .doc
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ) {
      const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
      return value;
    } else {
      throw new Error('Unsupported file type for text extraction.');
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error; // Re-throw the error to be caught by the controller
  }
};

module.exports = { extractTextFromBuffer };