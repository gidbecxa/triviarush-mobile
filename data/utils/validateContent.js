// src/utils/validateContent.js

/* const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const contentBlockSchema = require('../schemas/contentBlockSchema.json');

const ajv = new Ajv();
addFormats(ajv);

const validate = ajv.compile(contentBlockSchema); */

/**
 * Validates the given data against the content block schema.
 * @param {Object} data - The data to validate.
 * @returns {boolean} - True if data is valid, false otherwise.
 */
/* function validateContent(data) {
  const valid = validate(data);
  if (!valid) {
    console.error('Validation errors:', validate.errors);
  }
  return valid;
}

module.exports = validateContent; */
