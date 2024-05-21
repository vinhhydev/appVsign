import {View, Text, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import navigationStrings from '../../../shared/navigationStrings';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useNavigation, useRoute} from '@react-navigation/native';
import wsStrings from '../../../shared/wsStrings';
import React, {useState, useEffect} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import moment from 'moment-timezone';
import {Divider} from '@rneui/base';
import axios from 'axios';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import ReloadComponent from '../../components/ReloadComponent';
import LoadingScreen from '../../components/LoadingScreen';
import {CalendarModal} from '../../components/CustomModal';
import DropdownList from '../../components/DropdownList';
import CustomButton from '../../components/CustomButton';
import PickDate from '../../components/PickDate';
import Header from '../../components/Header';

const Ekyso0 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [dataTracuu, setDataTracuu] = useState();
  const [pickMst, setPickMst] = useState();
  const [listMst, setListMst] = useState(route.params.listMst);
  const [startDate, setStartDate] = useState();
  const [minDate, setMinDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loading, setLoading] = useState(true);
  const [tracuuLoading, setTracuuLoading] = useState(false);
  const [isPickStartDate, setIsPickStartDate] = useState(true);
  const [calendarModal, setCalendarModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const currentDate = moment().tz('Asia/Ho_Chi_Minh');

  useEffect(() => {
    getStoredForm();
  }, []);

  const onChangeMst = item => {
    if (dataTracuu) {
      setDataTracuu('');
    }
    setPickMst(item.value);
  };

  const onPressView = item => {
    setPdfLoading(true);
    getPdfUrl(item);
  };

  const onPressTracuu = () => {
    const sd = moment(startDate, 'YYYY-MM-DD');
    const ed = moment(endDate, 'YYYY-MM-DD');
    const isStartDateAfterEndDate = sd.isAfter(ed);
    if (!listMst) {
      const type = 'info';
      const title = 'Tài khoản của bạn chưa thêm MST';
      const text = 'Thêm trong mục Danh sách cty';
      showAlert(type, title, text);
    } else if (!pickMst) {
      const type = 'error';
      const title = 'Vui lòng chọn MST';
      showAlert(type, title);
    } else if (isStartDateAfterEndDate) {
      const type = 'error';
      const title = 'Ngày không hợp lệ';
      showAlert(type, title);
    } else {
      setTracuuLoading(true);
      tracuu();
    }
  };

  const openPdf = url => {
    navigation.navigate(navigationStrings.WEBSCREEN, {
      tg: true,
      url: url,
      title: 'Thông tin hợp đồng',
    });
  };

  const onDateChange = date => {
    if (date) {
      if (isPickStartDate) {
        const ed = moment(endDate, 'YYYY-MM-DD');
        // Kiểm tra ngày bắt đầu nằm sau ngày kết thúc nếu có thì thay đổi ngày kết thúc
        const isStartDateAfterEndDate = date.isAfter(ed);
        if (isStartDateAfterEndDate) {
          setStartDate(moment(date).format('YYYY-MM-DD'));
          setEndDate(moment(date).format('YYYY-MM-DD'));
        } else {
          setStartDate(moment(date).format('YYYY-MM-DD'));
        }
      } else if (!isPickStartDate) {
        setEndDate(moment(date).format('YYYY-MM-DD'));
      }
      setCalendarModal(false);
    }
  };

  const pickDate = type => {
    if (type == 'startDate') {
      if (!isPickStartDate) {
        setIsPickStartDate(true);
        setMinDate('2021-11-01');
      }
    } else if (type == 'endDate') {
      if (isPickStartDate) {
        setIsPickStartDate(false);
        setMinDate(startDate);
      }
    }
    setCalendarModal(true);
  };

  const setDefaultMonth = () => {
    const startD = moment(currentDate).startOf('month').format('YYYY-MM-DD');
    const endD = moment(currentDate).endOf('month').format('YYYY-MM-DD');
    setStartDate(startD);
    setEndDate(endD);
    setCalendarModal(false);
  };

  const storeForm = async () => {
    try {
      await AsyncStorage.setItem('ekyso_pickMst', pickMst);
      await AsyncStorage.setItem('ekyso_startDate', startDate);
      await AsyncStorage.setItem('ekyso_endDate', endDate);
    } catch (error) {
      Alert.alert(
        'Thông báo',
        'Xảy ra lỗi khi lưu trạng thái\n' + 'Lỗi: ' + error.message,
      );
    }
  };

  const getStoredForm = async () => {
    const mst = await AsyncStorage.getItem('ekyso_pickMst');
    if (mst) {
      const sd = await AsyncStorage.getItem('ekyso_startDate');
      const ed = await AsyncStorage.getItem('ekyso_endDate');
      if (mst && sd && ed) {
        setPickMst(mst);
        setStartDate(sd);
        setEndDate(ed);
      }
    } else {
      if (listMst.length == 1) {
        setPickMst(listMst[0].value);
      }
      setDefaultMonth();
    }
    setLoading(false);
  };

  const tracuu = async () => {
    await axios
      .post(ehdUrl + wsStrings.EKS, {
        token: '@acc2k',
        username: route.params.userName,
        password: route.params.pwd,
        mst: pickMst,
        loai: route.params.loaihd,
        tinhtrang: route.params.tinhtrang,
        tu_ngay: startDate,
        den_ngay: endDate,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          setDataTracuu(res);
        }
        storeForm();
      })
      .catch(error =>
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi trong quá trình tra cứu thông tin\n' + error.message,
        ),
      )
      .finally(() => setTracuuLoading(false));
  };

  const getPdfUrl = async item => {
    await axios
      .post(ehdUrl + wsStrings.EKS_XEM, {
        token: '@acc2k',
        username: route.params.userName,
        password: route.params.pwd,
        mst: pickMst,
        stt: item.stt,
      })
      .then(response => {
        if (response.data.d) {
          openPdf(response.data.d);
        }
      })
      .catch(error => {
        const type = 'error';
        const title = 'Lỗi';
        const text = error.message;
        showAlert(type, title, text);
      })
      .finally(() => setPdfLoading(false));
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.ehd.itemWrapper}>
          <View style={styles.row}>
            <Text style={styles.textH}>
              {moment(item.ngay_ct).format('DD/MM/YYYY')}
            </Text>
            <TouchableOpacity
              onPress={() => onPressView(item)}
              disabled={pdfLoading}
              style={styles.ehd.button}>
              <Icon
                name="eye-outline"
                size={35}
                color={colors.MAINCOLOR}></Icon>
            </TouchableOpacity>
          </View>
          <Text style={styles.textH}>{item.docname}</Text>
          <View style={styles.row}>
            <Text style={styles.text}>Số: {item.so_ct}</Text>
            <Text style={styles.text}>Stt: {item.stt}</Text>
          </View>
          {item.ong_ba && <Text style={styles.text}>{item.ong_ba}</Text>}
          <View style={styles.row}>
            <Text style={styles.highlight}>
              Tiền: {new Intl.NumberFormat('vi-VN').format(item.ttien)}
            </Text>
            <Text style={styles.highlight}>
              {item.tinhtrang == 'M' ? 'Chưa ký' : 'Đã ký'}
            </Text>
          </View>
        </View>
        <Divider width={1.5} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={route.params.title}
      />
      <View style={styles.dmcty.body}>
        <View style={styles.dmcty.content}>
          <View style={styles.tuvan.row}>
            <Text style={styles.textH}>1. Chọn MST:</Text>
            <DropdownList
              data={listMst}
              value={pickMst}
              loading={loading}
              placeholder={'Mã số thuế'}
              onChange={item => onChangeMst(item)}
              style={styles.tdt.dropdown}
              containerStyle={styles.tdt.containerMst}></DropdownList>
          </View>
          <View style={styles.dmcty.content}>
            <View style={styles.tuvan.row}>
              <Text style={styles.textH}>2. Chọn thời gian:</Text>
            </View>
            <PickDate
              type="2"
              color={colors.MAINCOLOR}
              startDate={startDate}
              onPressStartDate={() => pickDate('startDate')}
              endDate={endDate}
              onPressEndDate={() => pickDate('endDate')}></PickDate>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <CustomButton
                title="Tra cứu"
                onPress={() => onPressTracuu()}
                loading={tracuuLoading}></CustomButton>
            </View>
          </View>
          <View style={styles.dmcty.content}>
            <View style={styles.tdt.list}>
              <Text style={styles.textH}>3. Tra cứu dữ liệu:</Text>
              {!dataTracuu ? (
                <ReloadComponent
                  size={0.5}
                  title={'Nhập thông tin tra cứu'}
                  reload={false}></ReloadComponent>
              ) : dataTracuu.length != 0 ? (
                <Animated.FlatList
                  entering={FadeIn.duration(1000)}
                  exiting={FadeOut.duration(1000)}
                  data={dataTracuu}
                  renderItem={({item}) => renderItem({item})}
                  keyExtractor={item => item.index}
                  windowSize={20}
                />
              ) : (
                <ReloadComponent
                  size={0.5}
                  title={'Không có hợp đồng'}
                  reload={false}></ReloadComponent>
              )}
            </View>
          </View>
        </View>
      </View>
      <CalendarModal
        visible={calendarModal}
        onPressOutside={() => setCalendarModal(!calendarModal)}
        minDate={minDate}
        onDateChange={date => onDateChange(date)}
        secondButton={true}
        buttonTitle={'Hôm nay'}
        onSubmit={() => onDateChange(currentDate)}
        buttonStyle={styles.ehd.calendarButton}
        buttonTitle2={'Tháng này'}
        onSubmit2={() => setDefaultMonth()}
        buttonStyle2={styles.ehd.calendarButtonR}></CalendarModal>
      {pdfLoading && <LoadingScreen></LoadingScreen>}
    </SafeAreaView>
  );
};

export default Ekyso0;
