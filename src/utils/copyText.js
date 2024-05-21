import Clipboard from '@react-native-clipboard/clipboard';
import {showAlert} from '../components/notifications/showAlert';

export default copyText = value => {
  Clipboard.setString(value);
  const type = 'info';
  const text = 'Đã copy vào Clipboard';
  showAlert(type, text);
};
