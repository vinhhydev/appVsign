import {showAlert} from '../components/notifications/showAlert';

export const formatTaxcode = value => {
  if (/^\d+(-\d+)?$/.test(value)) {
    if (value.length == 11) {
      const formattedValue = value.slice(0, 10) + '-' + value.slice(10);
      return formattedValue;
    } else if (value.length > 14) {
      showAlert('error', 'Mã số thuế vượt quá giới hạn');
      return null;
    } else {
      return value;
    }
  } else {
    showAlert('error', 'Mã số thuế không hợp lệ');
    return '';
  }
};
