const { format } = require("date-fns");

exports.getTime = () => {
  return format(Date.now(), "HH:mm");
};
