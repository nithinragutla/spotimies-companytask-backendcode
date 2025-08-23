const natural = require("natural"); // npm install natural

exports.similarity = (s1, s2) => {
  if (!s1 || !s2) return 0;
  return natural.JaroWinklerDistance(s1.toLowerCase(), s2.toLowerCase());
};
