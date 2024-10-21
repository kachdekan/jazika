const { customAlphabet } = require('nanoid');
export const generateId = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export const generateSpaceId = () => {
  const idPart = customAlphabet('1234567890', 6);
  return `SP${idPart()}`;
};
export const generateLoanId = () => {
  const idPart = customAlphabet('1234567890', 6);
  return `LN${idPart()}`;
};
