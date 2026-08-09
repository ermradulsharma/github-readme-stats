// @ts-check

/**
 * Encode string as HTML.
 *
 * @param {string} str String to encode.
 * @returns {string} Encoded string.
 */
const encodeHTML = (str) => {
  return str
    .replace(/[<>&"']/g, (i) => {
      switch (i) {
        case "<":
          return "&#60;";
        case ">":
          return "&#62;";
        case "&":
          return "&#38;";
        case '"':
          return "&#34;";
        case "'":
          return "&#39;";
        default:
          return i;
      }
    })
    .replace(/\u0008/gim, "");
};

/**
 * Sanitize a string or an array of strings.
 *
 * @param {string | string[]} value Value to sanitize.
 * @returns {string | string[]} Sanitized value.
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
