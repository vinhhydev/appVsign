import removeDiacritics from './removeDiacritics';

// keyword: thông tin người dùng nhập vào
export const searchObjects = (data, keyword) => {
  const searchResult = data.filter(obj => {
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'string') {
        const isMatchData = removeDiacritics(obj[key].toLowerCase()).includes(
          removeDiacritics(keyword.toLowerCase()),
        );
        if (isMatchData) {
          return true;
        }
      }
    }
  });
  return searchResult;
};
