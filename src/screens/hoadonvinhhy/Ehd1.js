import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import navigationStrings from '../../../shared/navigationStrings';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useRoute, useNavigation} from '@react-navigation/native';
import {searchObjects} from '../../utils/searchObject';
import {PinInput} from 'react-native-form-component';
import wsStrings from '../../../shared/wsStrings';
import React, {useEffect, useState} from 'react';
import {ehdMSVUrl, ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import moment from 'moment-timezone';
import {Divider} from '@rneui/base';
import {encode} from 'base-64';
import axios from 'axios';
// Components
import {DeleteButton, ScrollButton} from '../../components/CustomButton';
import {CalendarModal, CustomModal} from '../../components/CustomModal';
import {showAlert} from '../../components/notifications/showAlert';
import LoadingComponent from '../../components/LoadingComponent';
import ReloadComponent from '../../components/ReloadComponent';
import LoadingScreen from '../../components/LoadingScreen';
import SearchInput from '../../components/SearchInput';
import Header from '../../components/Header';

const Ehd1 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [startDate, setStartDate] = useState(
    moment().startOf('month').toDate(),
  );
  const [endDate, setEndDate] = useState(moment().endOf('month').toDate());
  const [data, setData] = useState('');
  const [dataRender, setDataRender] = useState('');
  const [keyword, setKeyword] = useState('');
  const [pin, setPin] = useState('');
  const [pinLength, setPinLength] = useState();
  const [sttHd, setSttHd] = useState('');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [signModalVisible, setSignModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [disableSign, setDisableSign] = useState(false);
  const currentDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');

  useEffect(() => {
    if (loading) {
      getInvoice();
      getUserInfo();
    }
  }, [loading]);

  // Kiểm tra nếu PIN hợp lệ thì gọi ws ký hoá đơn
  useEffect(() => {
    if (pin) {
      if (pin.length == pinLength) {
        signInvoice();
        setModalLoading(true);
      }
    }
  }, [pin]);

  // Refresh list khi có yêu cầu
  useEffect(() => {
    if (route.params.refresh == 'C') {
      setLoading(true);
    }
  }, [route.params]);

  // Xử lý field tìm kiếm
  useEffect(() => {
    if (keyword) {
      searchObject();
    } else {
      setDataRender(data);
    }
  }, [keyword]);

  // Tìm kiếm hoá đơn
  const searchObject = () => {
    const result = searchObjects(data, keyword);
    if (result) {
      setDataRender(result);
    } else {
      setDataRender('');
    }
  };

  const handleDateChange = (date, type) => {
    if (date) {
      if (type == 'START_DATE') {
        setStartDate(moment(date).format('YYYY-MM-DD'));
        setEndDate(moment(date).format('YYYY-MM-DD'));
      } else if (type == 'END_DATE') {
        setEndDate(moment(date).format('YYYY-MM-DD'));
      }
    }
  };

  const handleDelete = item => {
    Alert.alert('Thông báo', 'Bạn có chắc muốn xoá hoá đơn?', [
      {text: 'Có', onPress: () => deleteInvoice(item)},
      {text: 'Không'},
    ]);
  };

  const setDefaultMonth = () => {
    const startD = moment(currentDate).startOf('month').format('YYYY-MM-DD');
    const endD = moment(currentDate).endOf('month').format('YYYY-MM-DD');
    setStartDate(startD);
    setEndDate(endD);
    setDateModalVisible(false);
    setLoading(true);
  };

  const refreshList = () => {
    setStartDate(moment().startOf('month').toDate());
    setEndDate(moment().endOf('month').toDate());
    setKeyword('');
    setLoading(true);
  };

  const navigateXemhd = item => {
    navigation.navigate(navigationStrings.EHD2, {
      action: 'Xemhd',
      mst: route.params.mst,
      pass_ehd: route.params.pass_ehd,
      userName: route.params.userName,
      pwd: route.params.pwd,
      item: item,
    });
  };

  const navigateTaohd = () => {
    navigation.navigate(navigationStrings.EHD2, {
      action: 'Taohd',
      mst: route.params.mst,
      pass_ehd: route.params.pass_ehd,
      userName: route.params.userName,
      pwd: route.params.pwd,
    });
  };

  const topButtonHandler = () => {
    listViewRef.scrollToOffset({offset: 0, animated: true});
  };

  const onPressSign = item => {
    if (disableSign) {
      const type = 'error';
      const title = 'Tài khoản không có mã PIN';
      showAlert(type, title);
    } else {
      setSignModalVisible(true);
      setSttHd(item.Stt);
    }
  };

  const onPressXem = item => {
    setPdfLoading(true);
    openPdf(item);
  };

  const openPdf = async item => {
    await axios
      .post(ehdUrl + wsStrings.VIEWINVOICE, {
        mahoadon: item.mahoadon,
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
        } else {
          Alert.alert('Thông báo' + 'Server không có phản hồi');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Không thể mở file PDF xem trước\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        setPdfLoading(false);
      });
  };

  const getInvoice = async () => {
    await axios
      .post(ehdMSVUrl + wsStrings.GETINVOICE, {
        user: route.params.mst,
        pwd: route.params.pass_ehd,
        tu_ngay: moment(startDate).format('YYYY-MM-DD'),
        den_ngay: moment(endDate).format('YYYY-MM-DD'),
        chuoi_stt: '',
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          const newData = JSON.parse(JSON.stringify(res));
          if (res.Status) {
            const type = 'error';
            const title = 'Không thể tra cứu hoá đơn';
            const text = 'Lỗi: ' + res.Status;
            showAlert(type, title, text);
          } else {
            setData(res);
            setDataRender(newData);
          }
        } else {
          setData('');
          setDataRender('');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi lấy danh sách hoá đơn\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const signInvoice = async () => {
    await axios
      .post(ehdMSVUrl + wsStrings.SIGNINVOICE, {
        user: route.params.mst,
        pwd: route.params.pass_ehd,
        stt: encode(sttHd),
        pin: pin,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          if (res.Status) {
            if (res.Status == 'Ký thành công') {
              const type = 'success';
              const title = 'Đã ký hoá đơn';
              showAlert(type, title);
              setSignModalVisible(false);
            } else {
              Alert.alert('Thông báo', res.Status);
            }
          }
        } else {
          Alert.alert('Thông báo', 'Server không phản hồi');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Không thể ký hoá đơn\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        setModalLoading(false);
        setPin('');
        setSttHd('');
      });
  };

  const deleteInvoice = async item => {
    await axios
      .post(ehdMSVUrl + wsStrings.DELETEINVOICE, {
        user: route.params.mst,
        pwd: route.params.pass_ehd,
        matracuu: item.mahoadon,
        key: item.Stt,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          if (res[0].ma == 'Ok') {
            setLoading(true);
          } else {
            const type = 'error';
            const title = res[0].mota;
            const text = 'Lỗi: ' + res[0].ma;
            showAlert(type, title, text);
          }
        } else {
          Alert.alert('Thông báo', 'Server không phản hồi');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi trong quá trình xoá hoá đơn\n' + 'Lỗi: ' + error.message,
        );
      });
  };

  const getUserInfo = async () => {
    await axios
      .post(ehdMSVUrl + wsStrings.GETUSERINFO, {
        user: route.params.mst,
        pwd: route.params.pass_ehd,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          if (res[0].pin) {
            setPinLength(res[0].pin.length);
          } else {
            const type = 'error';
            const title = 'Tài khoản không có mã PIN';
            showAlert(type, title);
            setDisableSign(true);
          }
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Lỗi khi lấy dữ liệu người dùng\n' + 'Lỗi: ' + error.message,
        );
      });
  };

  const renderSignForm = () => {
    return (
      <View style={styles.ehd.modalSignContent}>
        <Text style={styles.textH}>Nhập mã PIN{'\n'}</Text>
        {modalLoading ? (
          <ActivityIndicator size={'large'}></ActivityIndicator>
        ) : (
          <PinInput
            numOfInput={pinLength}
            placeholder="-"
            placeholderTextColor={'gray'}
            onChangeText={text => setPin(text)}
            autoFocus={true}
            keyboardType="number-pad"
          />
        )}
      </View>
    );
  };

  const renderItem = ({item}) => {
    const renderRightActions = () => {
      return <DeleteButton onPress={() => handleDelete(item)} />;
    };
    return (
      <GestureHandlerRootView>
        <Swipeable renderRightActions={() => renderRightActions()}>
          <TouchableOpacity onPress={() => navigateXemhd(item)}>
            <View style={styles.ehd.itemWrapper}>
              <View style={styles.ehd.itemRow}>
                <Text style={styles.textH}>{item.Ngay_hd}</Text>
                <Text style={styles.textH}>
                  {item.Ky_hieu_mau}
                  {item.So_seri}
                </Text>
                <Text style={styles.textH}>Số: {item.So_hd}</Text>
                <TouchableOpacity
                  onPress={() => onPressXem(item)}
                  style={styles.ehd.button}>
                  <Icon
                    name="eye-outline"
                    size={30}
                    color={colors.MAINCOLOR}></Icon>
                </TouchableOpacity>
              </View>
              <Text style={styles.textH}>
                {item.Don_vi_mua || item.Nguoi_mua}
              </Text>
              {item.Mst_nguoi_mua && (
                <Text style={styles.textH}>MST: {item.Mst_nguoi_mua}</Text>
              )}
              {item.Dia_chi_nguoi_mua && (
                <Text style={styles.text}>{item.Dia_chi_nguoi_mua}</Text>
              )}
              <View style={styles.ehd.itemRow}>
                <Text></Text>
                <Text style={styles.text}>
                  Tiền hàng:{' '}
                  {new Intl.NumberFormat('vi-VN').format(item.Tien_hang)}{' '}
                </Text>
              </View>
              <View style={styles.ehd.itemRow}>
                <Text></Text>
                <Text style={styles.text}>
                  Tiền thuế:{' '}
                  {new Intl.NumberFormat('vi-VN').format(item.Tien_thue)}
                </Text>
              </View>
              <View style={styles.ehd.itemRow}>
                {item.Ten_tinhtrang == 'Chưa ký' ? (
                  <TouchableOpacity onPress={() => onPressSign(item)}>
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 17,
                        fontWeight: 700,
                        fontStyle: 'italic',
                      }}>
                      {item.Ten_tinhtrang}{' '}
                      {item.Ten_tinhtrang == 'Chưa ký' && (
                        <Icon name="file-sign" size={28} color={'red'}></Icon>
                      )}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={{
                      color: colors.MAINCOLOR,
                      fontSize: 17,
                      fontWeight: 700,
                      fontStyle: 'italic',
                    }}>
                    {item.Ten_tinhtrang}{' '}
                  </Text>
                )}
                <Text style={styles.textH}>
                  Tổng: {new Intl.NumberFormat('vi-VN').format(item.Tong_tien)}
                </Text>
              </View>
            </View>
            <Divider width={1.5}></Divider>
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={'Danh mục hoá đơn'}
        disableRight={false}
        rightIcon="plus"
        onPressRight={() => navigateTaohd()}
      />
      <View style={styles.body}>
        <View style={styles.ehd.dateCon}>
          <Text style={styles.textH}>
            Từ {moment(startDate).format('DD/MM/YYYY')} đến{' '}
            {moment(endDate).format('DD/MM/YYYY')}
          </Text>
          <TouchableOpacity onPress={() => setDateModalVisible(true)}>
            <Icon name="calendar" size={35} color={colors.MAINCOLOR}></Icon>
          </TouchableOpacity>
        </View>
        <SearchInput
          keyword={keyword}
          onChangeText={value => setKeyword(value)}></SearchInput>
        <View style={styles.ehd.list}>
          {loading ? (
            <LoadingComponent size={0.8}></LoadingComponent>
          ) : dataRender ? (
            <Animated.FlatList
              entering={FadeIn.duration(1000)}
              exiting={FadeOut.duration(1000)}
              data={dataRender}
              renderItem={({item}) => renderItem({item})}
              keyExtractor={item => item.index}
              refreshing={loading}
              windowSize={20}
              onRefresh={() => refreshList()}
              ref={ref => (listViewRef = ref)}
            />
          ) : !dataRender && !keyword ? (
            <ReloadComponent
              size={0.8}
              title={'Tạo hoá đơn'}
              reload={true}
              onPress={() => navigateTaohd()}
              icon="plus"></ReloadComponent>
          ) : (
            !dataRender &&
            keyword && (
              <ReloadComponent
                size={0.8}
                title={'Không tìm thấy hoá đơn'}></ReloadComponent>
            )
          )}
        </View>
      </View>
      {/* Modal chọn ngày */}
      <CalendarModal
        visible={dateModalVisible}
        rangeSelect={true}
        secondButton={true}
        onPressOutside={() => setDateModalVisible(!dateModalVisible)}
        onDateChange={(date, type) => handleDateChange(date, type)}
        buttonTitle={'OK'}
        onSubmit={() => {
          setDateModalVisible(false);
          setLoading(true);
        }}
        buttonStyle={styles.ehd.calendarButton}
        buttonTitle2={'Tháng này'}
        onSubmit2={() => setDefaultMonth()}
        buttonStyle2={styles.ehd.calendarButtonR}></CalendarModal>
      {/* Modal nhập mã Pin */}
      <CustomModal
        visible={signModalVisible}
        onPressOutSide={() => setSignModalVisible(!signModalVisible)}
        renderContent={() => renderSignForm()}></CustomModal>
      {/* Button */}
      {data && <ScrollButton onPress={() => topButtonHandler()}></ScrollButton>}
      {/* Loading */}
      {pdfLoading && <LoadingScreen></LoadingScreen>}
    </SafeAreaView>
  );
};

export default Ehd1;
