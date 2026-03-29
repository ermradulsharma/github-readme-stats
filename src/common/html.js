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

export { encodeHTML };
