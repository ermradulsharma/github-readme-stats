// @ts-check

/**
 * Encode string as HTML.
 *
 * @param {string} str String to encode.
 * @returns {string} Encoded string.
 */
const encodeHTML = (str) => {
  return str
    .replace(/&/g, "&#38;")
    .replace(/</g, "&#60;")
    .replace(/>/g, "&#62;")
    .replace(/"/g, "&#34;")
    .replace(/'/g, "&#39;")
    .replace(/\u0008/gim, "");
};

/**
 * Sanitize a string or an array of strings.
 *
 * @param {any} value Value to sanitize.
 * @returns {any} Sanitized value.
 */
const sanitizeQueryParam = (value) => {
  if (typeof value === "string") {
    return encodeHTML(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "string" ? encodeHTML(item) : item,
    );
  }
  return value;
};

export { encodeHTML, sanitizeQueryParam };
