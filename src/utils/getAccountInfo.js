import {showAlert} from '../components/notifications/showAlert';
import wsStrings from '../../shared/wsStrings';
import {ehdUrl} from '../../shared/url';
import axios from 'axios';

export const getAccountInfo = async (username, pwd) => {
  try {
    const response = await axios.post(ehdUrl + wsStrings.VSIGN_THONGTIN, {
      username: username,
      password: pwd,
    });
    if (response.data.d) {
      const res = JSON.parse(response.data.d);
      if (res) {
        return res;
      } else {
        showAlert('error', 'Lỗi!', 'Không có thông tin tài khoản');
      }
      return null;
    }
  } catch (e) {
    showAlert('error', 'Lỗi!', e.message);
  }
};
