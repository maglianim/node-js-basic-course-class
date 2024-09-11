function isAllDigits(str) {
    return /^\d+$/.test(str);
  }

  module.exports = { isAllDigits }