import {View, Text, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRoute, useNavigation} from '@react-navigation/native';
import {addOrUpdateObject} from '../../utils/addOrUpdateObject';
import {formatTaxcode} from '../../utils/formatTaxcode';
import React, {useEffect, useState} from 'react';
import copyText from '../../utils/copyText';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import moment from 'moment-timezone';
import {Input} from '@rneui/themed';
import {Divider} from '@rneui/base';
import {decode} from 'base-64';
import axios from 'axios';
// Shared
import {listDoiTuong, listHTTT} from '../../../shared/dropdownData';
import navigationStrings from '../../../shared/navigationStrings';
import wsStrings from '../../../shared/wsStrings';
import {ehdUrl} from '../../../shared/url';
// Components
import CustomButton, {DeleteButton} from '../../components/CustomButton';
import {CalendarModal, CustomModal} from '../../components/CustomModal';
import {showAlert} from '../../components/notifications/showAlert';
import LoadingComponent from '../../components/LoadingComponent';
import DropdownList from '../../components/DropdownList';
import Header from '../../components/Header';

const Ehd2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState('');
  const [ten, setTen] = useState('');
  const [diachi, setDiachi] = useState('');
  const [sdt, setSdt] = useState('');
  const [email, setEmail] = useState('');
  const [mst, setMst] = useState('');
  const [donvimua, setDonvimua] = useState('Công Ty');
  const [tongtien, setTongtien] = useState(0);
  const [tienthue, setTienthue] = useState(0);
  const [tbph, setTbph] = useState('');
  const [httt, setHttt] = useState('TM/CK');
  const [listTbph, setListTbph] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [tracuuLoading, setTracuuLoading] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [mstErrorMessage, setMstErrorMessage] = useState('');
  const [tenErrorMessage, setTenErrorMessage] = useState('');
  const [ngayHd, setNgayHd] = useState(moment().tz('Asia/Ho_Chi_Minh'));
  const actionType = route.params.action;
  const isEditable =
    (actionType == 'Xemhd' && route.params.item.Ten_tinhtrang === 'Chưa ký') ||
    actionType == 'Taohd';

  useEffect(() => {
    if (actionType == 'Xemhd') {
      setupInfo();
      getEhoadon0();
    } else {
      getTbph();
    }
  }, []);

  // Tính tổng tiền hàng
  useEffect(() => {
    if (data) {
      if (actionType == 'Taohd') {
        sumTotalPrice();
      } else {
        if (route.params.item.Ten_tinhtrang == 'Chưa ký') {
          getHsmInfo();
          sumTotalPrice();
        }
      }
    }
  }, [data]);

  // Cập nhật danh mục hàng hoá
  useEffect(() => {
    const newData = route.params.data;
    const sl = Number(route.params.soluong);
    if (newData) {
      const transformData = newData.map(item => {
        const {ten_vt, dvt, ma_vt, ts} = item;
        return {
          Ma_hang: ma_vt,
          Ten_hang: ten_vt,
          Dvt: dvt,
          So_luong: sl,
          Gia: route.params.giaban,
          Tien: route.params.tongtien,
          Thue_suat: ts,
          Thue: (route.params.giaban * sl * ts) / 100,
          Ty_le_chiet_khau: '0',
          chiet_khau: '0',
          km: '',
          so_lo: '',
          han_dung: '',
          Dien_giai: route.params.dien_giai,
        };
      });
      if (data) {
        const newData = addOrUpdateObject([...data], transformData[0]);
        setData(newData);
      } else {
        setData(transformData);
      }
    }
  }, [route.params.data]);

  // Hàm tính tổng tiền
  const sumTotalPrice = () => {
    const total = data.reduce((total, item) => (total += item.Tien), 0);
    setTongtien(total);
    const tax = data.reduce((total, item) => (total += item.Thue), 0);
    setTienthue(tax);
  };

  const setupInfo = () => {
    if (route.params.item.Don_vi_mua) {
      const data = route.params.item.Don_vi_mua;
      const keyword = 'CÔNG TY';
      const matches = data.includes(keyword);
      if (matches) {
        setDonvimua('Công Ty');
      } else {
        setDonvimua('Khách Lẻ');
      }
    } else {
      setDonvimua('Khách Lẻ');
    }
    route.params.item.Nguoi_mua && setTen(route.params.item.Nguoi_mua);
    route.params.item.Mst_nguoi_mua && setMst(route.params.item.Mst_nguoi_mua);
    route.params.item.Dia_chi_nguoi_mua &&
      setDiachi(route.params.item.Dia_chi_nguoi_mua);
    route.params.item.Dien_thoai_nguoi_mua &&
      setSdt(route.params.item.Dien_thoai_nguoi_mua);
    route.params.item.Email_nguoi_mua &&
      setEmail(route.params.item.Email_nguoi_mua);
    route.params.item.Httt && setHttt(route.params.item.Httt);
  };

  const checkForm = () => {
    if (!tbph && actionType == 'Taohd') {
      const type = 'error';
      const title = 'Vui lòng chọn số Seri';
      showAlert(type, title);
    } else if (ten == '') {
      const type = 'error';
      const title = 'Tên bên mua không được để trống';
      showAlert(type, title);
    } else if (data == '') {
      const type = 'error';
      const title = 'Chưa có mặt hàng';
      showAlert(type, title);
    } else {
      setIsLoading(true);
      formatData();
    }
  };

  // Format dữ liệu gửi lên WS
  const formatData = () => {
    const formatedData = {
      Ngay_hd: moment(ngayHd).format('YYYY-MM-DD'),
      Ky_hieu_mau:
        actionType == 'Taohd' ? tbph.mau : route.params.item.Ky_hieu_mau,
      So_seri: actionType == 'Taohd' ? tbph.value : route.params.item.So_seri,
      So_hd: '',
      Mst: mst,
      Ten_cty: donvimua == 'Công Ty' ? ten : '',
      Dia_chi: diachi,
      Email: email,
      Tel: sdt,
      so_tk: '',
      Nguoi_mua_hang: ten,
      Bien_so_xe: '',
      hinh_thuc_thanh_toan: httt,
      Ma_tte: 'VND',
      Ty_gia: 1,
      fkey: '',
      Chitiet: data,
    };
    const newData = JSON.stringify(formatedData);
    const finalData = newData.replaceAll('"', "'");
    if (actionType == 'Taohd') {
      importInvoice(finalData);
    } else {
      updateInvoice(finalData);
    }
  };

  const onPressTracuu = () => {
    if (mst) {
      setTracuuLoading(true);
      getThongtincty();
    } else {
      setMstErrorMessage('Mã số thuế không được để trống');
    }
  };

  const navigateHanghoa = () => {
    navigation.navigate(navigationStrings.PRODUCTS, {
      action: actionType,
      userName: route.params.userName,
      pwd: route.params.pwd,
      mst: route.params.mst,
      pass_ehd: route.params.pass_ehd,
      item: route.params.item,
      tg: true,
      type: 'ehd',
    });
  };

  const navigateEhd1 = () => {
    navigation.navigate(navigationStrings.EHD1, {
      mst: route.params.mst,
      pass_ehd: route.params.pass_ehd,
      userName: route.params.userName,
      pwd: route.params.pwd,
      refresh: 'C',
    });
  };

  const handleDateChange = date => {
    setNgayHd(date);
    setDateModalVisible(false);
  };

  const handleDelete = item => {
    const newData = data.filter(i => i.Ma_hang != item.Ma_hang);
    setData(newData);
  };

  const setDefaultDate = () => {
    setNgayHd(moment().tz('Asia/Ho_Chi_Minh'));
    setDateModalVisible(false);
  };

  const openPdf = async () => {
    await axios
      .post(ehdUrl + wsStrings.VIEWINVOICE, {
        mahoadon: route.params.item.mahoadon,
      })
      .then(response => {
        if (response.data.d) {
          const res = response.data.d;
          const url = res.replace(/\\/g, '/');
          const newUrl = 'https://' + url;
          navigation.navigate(navigationStrings.WEBSCREEN, {
            tg: true,
            url: newUrl,
            title: 'Chi tiết hoá đơn',
          });
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Không thể mở file PDF xem trước\n' + 'Lỗi: ' + error.message,
        );
      });
  };

  const getEhoadon0 = async () => {
    await axios
      .post(ehdUrl + wsStrings.GETINVOICE0, {
        user: route.params.mst,
        pwd: route.params.pass_ehd,
        stt: route.params.item.Stt,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          const transformData = res.map(item => {
            const {
              chiet_khau,
              dien_giai,
              dvt,
              gia2,
              km,
              ma_vt,
              so_luong,
              tien2,
              tien3,
              thue_gtgt,
            } = item;
            return {
              Ma_hang: ma_vt,
              Ten_hang: dien_giai,
              Dvt: dvt,
              So_luong: so_luong,
              Gia: gia2,
              Tien: tien2,
              Thue_suat: thue_gtgt,
              Thue: tien3,
              Ty_le_chiet_khau: '0',
              chiet_khau: chiet_khau,
              km: km,
              so_lo: '',
              han_dung: '',
            };
          });
          setData(transformData);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi lấy thông tin chi tiết hoá đơn\n' +
            'Lỗi: ' +
            error.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getHsmInfo = async () => {
    await axios
      .post(ehdUrl + wsStrings.GETUSERINFO, {
        user: route.params.mst,
        pwd: route.params.pass_ehd,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res) {
          setEnableButton(true);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Lỗi khi lấy thông tin chữ kí\n' + 'Lỗi: ' + error.message,
        );
      });
  };

  const getTbph = async () => {
    await axios
      .post(ehdUrl + wsStrings.GETTBPH, {
        user: route.params.mst,
        pwd: route.params.pass_ehd,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          const data = res.map(item => ({
            label: item.ky_hieu,
            value: item.ky_hieu,
            id: item.id,
            mau: item.mau,
          }));
          setListTbph(data);
        }
      })
      .catch(error => {
        Alert.alert('Lỗi', 'Không thể lấy thông tin TBPH\n' + error.message);
      })
      .finally(() => {
        setLoading(false);
        setEnableButton(true);
      });
  };

  const importInvoice = async data => {
    await axios
      .post(ehdUrl + wsStrings.IMPORTINVOICE, {
        user: route.params.mst,
        pwd: decode(route.params.pass_ehd),
        data: data,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          if (res[0].ma == 'Ok') {
            navigateEhd1();
          } else {
            const type = 'error';
            const title = res[0].mota;
            const text = 'Lỗi: ' + res[0].ma;
            showAlert(type, title, text);
          }
        }
      })
      .catch(error => {
        Alert.alert('Lỗi', 'Không thể tạo hoá đơn\n' + error.message);
      });
  };

  const updateInvoice = async data => {
    await axios
      .post(ehdUrl + wsStrings.UPDATEINVOICE, {
        user: route.params.mst,
        pwd: decode(route.params.pass_ehd),
        data: data,
        matracuu: route.params.item.mahoadon,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          if (res[0].ma == 'Ok') {
            const type = 'success';
            const title = 'Đã cập nhật hoá đơn';
            showAlert(type, title);
            navigateEhd1();
          } else {
            const type = 'error';
            const title = res[0].mota;
            const text = 'Lỗi: ' + res[0].ma;
            showAlert(type, title, text);
          }
        }
      })
      .catch(error => {
        Alert.alert('Lỗi', 'Không thể cập nhật hoá đơn\n' + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getThongtincty = async () => {
    await axios
      .post(ehdUrl + wsStrings.GETCOMPANYINFO, {
        mst: mst,
        token: 'acc2k',
      })
      .then(response => {
        if (response.data.d) {
          const res = response.data.d;
          setTen(res[0]);
          setDiachi(res[1]);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Không thể tra cứu thông tin\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        setTracuuLoading(false);
      });
  };

  const renderFormEdit = () => {
    return (
      <View style={[styles.dmcty.calendar, {padding: 15}]}>
        <Text style={styles.textH}>Nhập thông tin hoá đơn</Text>
        <View style={[styles.dmcty.input, {marginTop: 5}]}>
          {actionType == 'Taohd' && (
            <View style={{alignItems: 'center'}}>
              <DropdownList
                data={listDoiTuong}
                value={donvimua}
                onChange={i => setDonvimua(i.value)}
                style={styles.ehd.dropdown}
                containerStyle={styles.ehd.containerStyle}></DropdownList>
            </View>
          )}
          <View style={styles.ehd.itemRow}>
            <View style={{width: '65%'}}>
              <Input
                label={'MST'}
                placeholder="Vd: 0314743623"
                value={mst}
                errorMessage={mstErrorMessage}
                onChange={() => mstErrorMessage && setMstErrorMessage('')}
                onChangeText={value => setMst(formatTaxcode(value))}
                keyboardType="number-pad"
              />
            </View>
            <View style={{width: '35%'}}>
              <CustomButton
                onPress={() => onPressTracuu()}
                title="Tra cứu"
                loading={tracuuLoading}></CustomButton>
            </View>
          </View>
          {actionType == 'Taohd' ? (
            <Input
              label={donvimua != 'Khách Lẻ' ? 'Đơn vị mua' : 'Người mua'}
              placeholder="Vd: Công ty TNHH Công nghệ Vĩnh Hy"
              value={ten}
              multiline={true}
              errorMessage={tenErrorMessage}
              onChange={() => tenErrorMessage && setTenErrorMessage('')}
              onChangeText={value => setTen(value)}
            />
          ) : (
            <Input
              label={
                route.params.item.Don_vi_mua != 'Khách Lẻ'
                  ? 'Đơn vị mua'
                  : 'Người mua'
              }
              placeholder="Vd: Công ty TNHH Công nghệ Vĩnh Hy"
              value={ten}
              multiline={true}
              onChangeText={value => setTen(value)}
            />
          )}
          <Input
            label={'Địa chỉ'}
            placeholder="Vd: Số 82 đường 76, P10, Q6, TPHCM."
            value={diachi}
            multiline={true}
            onChangeText={value => setDiachi(value)}
          />
          <View style={styles.ehd.itemRow}>
            <View style={{width: '50%'}}>
              <Input
                label={'SĐT'}
                placeholder="Vd: 1900 7105"
                value={sdt}
                onChangeText={value => setSdt(value)}
                keyboardType="number-pad"
              />
            </View>
            <View style={{width: '50%'}}>
              <DropdownList
                data={listHTTT}
                value={httt}
                onChange={i => setHttt(i.value)}
                style={styles.ehd.dropdown}
                containerStyle={styles.ehd.containerStyle}></DropdownList>
            </View>
          </View>
          <Input
            label={'Email'}
            placeholder="Vd: info@ehoadondientu.com"
            value={email}
            onChangeText={value => setEmail(value)}
          />
        </View>
        <View style={[styles.dmcty.buttonCon, {paddingTop: 0}]}>
          <CustomButton
            onPress={() => setInfoModalVisible(false)}
            title={'OK'}
            loading={loading}></CustomButton>
        </View>
      </View>
    );
  };

  const RenderSum = () => {
    const condition =
      actionType == 'Xemhd' && route.params.item.Ten_tinhtrang == 'Đã cấp mã';

    if (condition) {
      return (
        <View style={{alignItems: 'flex-end', marginTop: 10, height: 150}}>
          <Text style={styles.text}>
            Tiền hàng:{' '}
            {new Intl.NumberFormat('vi-VN').format(
              route.params.item.Tien_hang || 0,
            )}
          </Text>
          <Text style={styles.text}>
            Tiền thuế:{' '}
            {new Intl.NumberFormat('vi-VN').format(
              route.params.item.Tien_thue || 0,
            )}
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: colors.MAINCOLOR,
            }}>
            Tổng tiền:{' '}
            {new Intl.NumberFormat('vi-VN').format(
              route.params.item.Tong_tien || 0,
            )}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{alignItems: 'flex-end', marginTop: 10, height: 150}}>
          <Text style={styles.text}>
            Tiền hàng: {new Intl.NumberFormat('vi-VN').format(tongtien)}
          </Text>
          <Text style={styles.text}>
            Tiền thuế: {new Intl.NumberFormat('vi-VN').format(tienthue)}
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: colors.MAINCOLOR,
            }}>
            Tổng tiền:{' '}
            {new Intl.NumberFormat('vi-VN').format(tongtien + tienthue)}
          </Text>
        </View>
      );
    }
  };

  const RenderAddInvoice = () => (
    <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
      <View style={styles.ehd.info}>
        <View
          style={[
            styles.ehd.infoRow,
            {justifyContent: 'space-evenly', width: '100%'},
          ]}>
          <DropdownList
            placeholder="TBPH"
            data={listTbph}
            value={tbph}
            onChange={i => setTbph(i)}
            style={styles.ehd.dropdown}
            containerStyle={styles.ehd.containerStyle}></DropdownList>
          <TouchableOpacity
            onPress={() => setDateModalVisible(true)}
            style={styles.row}>
            <Text style={styles.textH}>{ngayHd.format('DD/MM/YYYY')} </Text>
            <Icon name="calendar" size={35} color={colors.MAINCOLOR}></Icon>
          </TouchableOpacity>
        </View>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            <Text style={styles.text}>
              {donvimua != 'Khách Lẻ' ? 'Đơn vị mua:' : 'Người mua:'}
            </Text>
          </View>
          <View style={styles.ehd.infoR}>
            {donvimua != 'Khách Lẻ' ? (
              <Text style={styles.textH}>
                {ten || 'Không có thông tin'} {'-' + mst || ''}
              </Text>
            ) : (
              <Text style={styles.textH}>{ten}</Text>
            )}
          </View>
        </View>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            <Text style={styles.text}>Địa chỉ:</Text>
          </View>
          <View style={styles.ehd.infoR}>
            <Text style={styles.textH}>{diachi || 'Không có thông tin'}</Text>
          </View>
        </View>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            <Text style={styles.text}> SĐT:</Text>
          </View>
          <View style={styles.ehd.infoR}>
            <Text style={styles.text}>{sdt || 'Không có thông tin'}</Text>
          </View>
        </View>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            <Text style={styles.text}> Email:</Text>
          </View>
          <View style={styles.ehd.infoR}>
            <Text style={styles.text}>{email || 'Không có thông tin'}</Text>
          </View>
        </View>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            <Text style={styles.text}> HTTT:</Text>
          </View>
          <View style={styles.ehd.infoR}>
            <Text style={styles.textH}>{httt}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RenderViewInvoice = () => (
    <TouchableOpacity
      onPress={() => setInfoModalVisible(true)}
      disabled={isEditable ? false : true}>
      <View style={styles.ehd.info}>
        <Text style={styles.textH}>Ngày: {route.params.item.Ngay_hd}</Text>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            {route.params.item.Don_vi_mua != 'Khách Lẻ' ? (
              <Text style={styles.text}>Đơn vị mua:</Text>
            ) : (
              <Text style={styles.text}>Người mua:</Text>
            )}
          </View>
          <View style={styles.ehd.infoR}>
            {route.params.item.Don_vi_mua != 'Khách Lẻ' ? (
              <Text style={styles.textH}>
                {ten ||
                  route.params.item.Don_vi_mua ||
                  route.params.item.Nguoi_mua}
                {' - ' + mst || route.params.item.Mst_nguoi_mua || ''}
              </Text>
            ) : (
              <Text style={styles.textH}>
                {ten || route.params.item.Nguoi_mua}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            <Text style={styles.text}>Địa chỉ:</Text>
          </View>
          <View style={styles.ehd.infoR}>
            <Text style={styles.textH}>
              {diachi ||
                route.params.item.Dia_chi_nguoi_mua ||
                'Không có thông tin'}
            </Text>
          </View>
        </View>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            <Text style={styles.text}> SĐT:</Text>
          </View>
          <View style={styles.ehd.infoR}>
            {sdt || route.params.item.Dien_thoai_nguoi_mua ? (
              <TouchableOpacity
                onPress={() =>
                  copyText(sdt || route.params.item.Dien_thoai_nguoi_mua)
                }>
                <Text style={styles.textU}>
                  {sdt || route.params.item.Dien_thoai_nguoi_mua}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.textH}>Không có thông tin</Text>
            )}
          </View>
        </View>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            <Text style={styles.text}> Email:</Text>
          </View>
          <View style={styles.ehd.infoR}>
            {email || route.params.item.Email_nguoi_mua ? (
              <TouchableOpacity
                onPress={() =>
                  copyText(email || route.params.item.Email_nguoi_mua)
                }>
                <Text style={styles.textU}>
                  {email || route.params.item.Email_nguoi_mua}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.textH}>{'Không có thông tin'}</Text>
            )}
          </View>
        </View>
        <View style={styles.ehd.infoRow}>
          <View style={styles.ehd.infoL}>
            <Text style={styles.text}> HTTT:</Text>
          </View>
          <View style={styles.ehd.infoR}>
            <Text style={styles.textH}>{httt}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RenderList = ({item}) => {
    const renderRightActions = () => {
      return <DeleteButton onPress={() => handleDelete(item)} />;
    };
    return (
      <GestureHandlerRootView>
        <Swipeable
          enabled={isEditable ? true : false}
          renderRightActions={() => renderRightActions()}>
          <Divider width={1.5}></Divider>
          <View style={styles.ehd.itemWrapper}>
            <Text style={styles.textH}>{item.Ten_hang}</Text>
            <View style={styles.ehd.itemRow}>
              <Text style={styles.text}>
                Đơn giá: {new Intl.NumberFormat('vi-VN').format(item.Gia)}/{' '}
                {item.Dvt}
              </Text>
              <Text style={styles.text}>
                SL: {new Intl.NumberFormat('vi-VN').format(item.So_luong)}
              </Text>
            </View>
            <View style={styles.ehd.itemRow}>
              <Text style={styles.text}>
                Tiền hàng: {new Intl.NumberFormat('vi-VN').format(item.Tien)}
              </Text>
              {item.Thue_suat == '-1' ? (
                <Text style={styles.text}>Thuế: KCT</Text>
              ) : (
                <Text style={styles.text}>
                  Thuế({item.Thue_suat + '%'}):{' '}
                  {new Intl.NumberFormat('vi-VN').format(item.Thue)}
                </Text>
              )}
            </View>
            <View style={styles.ehd.itemRow}>
              <Text></Text>
              <Text style={styles.textH}>
                Tổng:{' '}
                {new Intl.NumberFormat('vi-VN').format(item.Tien + item.Thue)}
              </Text>
            </View>
          </View>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={
          actionType == 'Taohd' ? 'Tạo hoá đơn' : route.params.item.Ten_loaihd
        }
        disableRight={actionType == 'Taohd' ? true : false}
        onPressRight={() => openPdf()}
        rightIcon="file-pdf-box"
      />
      {loading ? (
        <LoadingComponent size={0.9}></LoadingComponent>
      ) : (
        <View style={{flex: 1}}>
          <Animated.ScrollView
            entering={FadeInDown.duration(1000)}
            scrollEventThrottle={16}
            style={styles.body}>
            {/* Giao diện tạo thông tin hoá đơn */}
            {actionType == 'Taohd' ? (
              <RenderAddInvoice></RenderAddInvoice>
            ) : (
              // Giao diện xem thông tin hoá đơn
              <RenderViewInvoice></RenderViewInvoice>
            )}
            {/* List vật tư */}
            <View style={styles.ehd.product}>
              {data &&
                data.map(item => <RenderList key={item.Ma_hang} item={item} />)}
              {/* Nút thêm mặt hàng */}
              {isEditable && (
                <TouchableOpacity
                  onPress={() => navigateHanghoa()}
                  style={{
                    height: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="plus" size={40} color={colors.MAINCOLOR}></Icon>
                  <Text style={styles.textH}>Thêm mặt hàng</Text>
                </TouchableOpacity>
              )}
              <Divider width={1.5}></Divider>
              {/* Tổng tiền */}
              <RenderSum></RenderSum>
            </View>
          </Animated.ScrollView>
        </View>
      )}
      {/* Nút xác nhận */}
      {enableButton && (
        <Animated.View
          entering={FadeInDown}
          exiting={FadeOutDown}
          style={{position: 'absolute', bottom: 30, alignSelf: 'center'}}>
          <CustomButton
            onPress={() => checkForm()}
            loading={isLoading}
            buttonStyle={{borderRadius: 30, width: 180}}
            title={
              actionType == 'Xemhd' ? 'Lưu hoá đơn' : 'Tạo hoá đơn'
            }></CustomButton>
        </Animated.View>
      )}
      {/* Modal chỉnh sửa thông tin hoá đơn */}
      <CustomModal
        visible={infoModalVisible}
        onPressOutSide={() => setInfoModalVisible(!infoModalVisible)}
        renderContent={() => renderFormEdit()}></CustomModal>
      {/* Modal chọn ngày hoá đơn */}
      <CalendarModal
        visible={dateModalVisible}
        onPressOutside={() => setDateModalVisible(!dateModalVisible)}
        onDateChange={(date, type) => handleDateChange(date, type)}
        buttonTitle={'OK'}
        buttonStyle={styles.ehd.button}
        onSubmit={() => setDefaultDate()}></CalendarModal>
    </SafeAreaView>
  );
};

export default Ehd2;
