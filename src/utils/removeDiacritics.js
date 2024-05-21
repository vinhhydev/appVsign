import unidecode from 'unidecode';

export default removeDiacritics = inputString => {
  if (inputString) {
    return unidecode(inputString);
  }
  return '';
};
