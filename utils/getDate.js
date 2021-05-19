const { format } = require("date-fns");
/**
 *
 * @param {object} inputData Option for audioContext
 * @returns Created audioContext
 */
exports.getDate = () => {
  return format(Date.now(), "yyyy-MM-dd HH:mm");
};
