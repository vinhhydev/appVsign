import {showAlert} from '../components/notifications/showAlert';
import wsStrings from '../../shared/wsStrings';
import {ehdUrl} from '../../shared/url';
import axios from 'axios';
import getJSONByAPI from './convertXML';

export const getAccountInfo = async (username, pwd) => {
  try {
    const response = await axios.post(
      ehdUrl + wsStrings.VSIGN_THONGTIN,
      {
        username: username,
        password: pwd,
      },
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    if (response.data) {
      const res = getJSONByAPI(response.data);
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
