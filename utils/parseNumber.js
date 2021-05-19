const NANRegex = /[^0-9.]/g;
/**
 *
 * @param {object} inputData Option for audioContext
 * @returns Created audioContext
 */
exports.parseNumber = (input) => {
  if (!input) {
    return null;
  }

  let result = input.replace(NANRegex, "");

  if (input.includes("B")) {
    result *= 1000000000;
  }

  return parseFloat(result);
};
