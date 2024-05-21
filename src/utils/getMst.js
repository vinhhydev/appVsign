import {showAlert} from '../components/notifications/showAlert';
import {ehdUrl} from '../../shared/url';
import {Alert} from 'react-native';
import axios from 'axios';

export const getMst = async (username, password, type) => {
  try {
    const response = await axios.post(ehdUrl + 'vsign_getMst', {
      username: username,
      password: password,
    });
    if (response.data.d) {
      const res = JSON.parse(response.data.d);
      if (res == '') {
        const type = 'info';
        const title = 'Tài khoản của bạn chưa thêm MST';
        const text = 'Thêm trong mục Danh sách cty';
        showAlert(type, title, text);
        return null;
      } else {
        switch (type) {
          case 'tdt':
            const dataTdt = res.map(item => ({
              label: item.mst,
              value: item.mst,
              pass_tdt: item.pass_tdt,
            }));
            return dataTdt;
          case 'ehd':
            const dataEhd = res.map(item => ({
              label: item.mst,
              value: item.mst,
              pass_ehd: item.pass_ehd,
            }));
            return dataEhd;
          case 'bhxh':
            const dataBhxh = res.map(item => ({
              label: item.mst,
              value: item.mst,
              pass_bhxh: item.pass_bhxh,
            }));
            return dataBhxh;
          case 'hddt':
            const dataHddt = res.map(item => ({
              label: item.mst,
              value: item.mst,
              pass_hddt: item.pass_hddt,
            }));
            return dataHddt;
          default:
            const data = res.map(item => ({
              label: item.mst,
              value: item.mst,
            }));
            return data;
        }
      }
    } else {
      Alert.alert('Thông báo', 'Server không phản hồi');
      return null;
    }
  } catch (error) {
    const type = 'error';
    const title = 'Lỗi';
    const text = error.message;
    showAlert(type, title, text);
  }
};
