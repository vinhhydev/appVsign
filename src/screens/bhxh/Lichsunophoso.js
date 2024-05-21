import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useRoute, useNavigation} from '@react-navigation/native';
import {View, Text, SafeAreaView, Alert} from 'react-native';
import wsStrings from '../../../shared/wsStrings';
import React, {useEffect, useState} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import moment from 'moment-timezone';
import {Divider} from '@rneui/base';
import {decode} from 'base-64';
import axios from 'axios';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import ReloadComponent from '../../components/ReloadComponent';
import {CalendarModal} from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import DropdownList from '../../components/DropdownList';
import PickDate from '../../components/PickDate';
import Header from '../../components/Header';

const Lichsunophoso = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState('');
  const [pickMst, setPickMst] = useState();
  const [listMst, setListMst] = useState(route.params.listMst);
  const [pass_bhxh, setPass_bhxh] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [minDate, setMinDate] = useState();
  const [loading, setLoading] = useState(true);
  const [tracuuLoading, setTracuuLoading] = useState(false);
  const [isPickStartDate, setIsPickStartDate] = useState(true);
  const [calendarModal, setCalendarModal] = useState(false);
  const currentDate = moment().tz('Asia/Ho_Chi_Minh');

  useEffect(() => {
    getStoredForm();
  }, []);

  const onPressTracuu = () => {
    const sd = moment(startDate, 'YYYY-MM-DD');
    const ed = moment(endDate, 'YYYY-MM-DD');
    const isStartDateAfterEndDate = sd.isAfter(ed);
    if (!listMst) {
      showAlert(
        'info',
        'Tài khoản của bạn chưa thêm MST',
        'Thêm trong mục Danh sách cty',
      );
    } else if (!pickMst) {
      showAlert('error', 'Vui lòng chọn MST');
    } else if (!pass_bhxh) {
      showAlert(
        'error',
        'Thiếu mật khẩu BHXH',
        'Khai báo trong mục Danh sách cty',
      );
    } else if (isStartDateAfterEndDate) {
      showAlert('error', 'Ngày không hợp lệ');
    } else {
      showAlert('success', 'Vui lòng đợi trong giây lát....');
      setTracuuLoading(true);
      tracuu();
    }
  };

  const onChangeMst = item => {
    setData('');
    setPickMst(item.value);
    if (item.pass_bhxh) {
      setPass_bhxh(item.pass_bhxh);
    }
  };

  // Lưu form tìm kiếm
  const storeForm = async () => {
    try {
      await AsyncStorage.setItem('bhxh_pickMst', pickMst);
      await AsyncStorage.setItem('bhxh_startDate', startDate);
      await AsyncStorage.setItem('bhxh_endDate', endDate);
      await AsyncStorage.setItem('pass_bhxh', pass_bhxh);
    } catch (error) {
      Alert.alert(
        'Thông báo',
        'Xảy ra lỗi khi lưu trạng thái\n' + 'Lỗi: ' + error.message,
      );
    }
  };

  // Lấy dữ liệu tìm kiếm gần nhất
  const getStoredForm = async () => {
    const storedMst = await AsyncStorage.getItem('bhxh_pickMst');
    if (storedMst) {
      const startD = await AsyncStorage.getItem('bhxh_startDate');
      const endD = await AsyncStorage.getItem('bhxh_endDate');
      const storedPass = await AsyncStorage.getItem('pass_bhxh');
      if (storedMst && startD && endD) {
        setPickMst(storedMst);
        setStartDate(startD);
        setEndDate(endD);
        setPass_bhxh(storedPass);
      }
    } else {
      if (listMst.length == 1) {
        setPickMst(listMst[0].value);
        setPass_bhxh(listMst[0].pass_bhxh);
      }
      setDefaultMonth();
    }
    setLoading(false);
  };

  // Giới hạn minDate của lịch để người dùng không chọn sai
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

  const handleDateChange = date => {
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

  const setDefaultMonth = () => {
    const startD = moment(currentDate).startOf('month').format('YYYY-MM-DD');
    const endD = moment(currentDate).endOf('month').format('YYYY-MM-DD');
    setStartDate(startD);
    setEndDate(endD);
    setCalendarModal(false);
  };

  const tracuu = async () => {
    await axios
      .post(ehdUrl + wsStrings.TRACUUBHXH, {
        token: '@acc2k',
        mst: pickMst,
        pwd: decode(pass_bhxh),
        tu_ngay: startDate,
        den_ngay: endDate,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          setData(res);
          storeForm();
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi tra cứu thông tin\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        setTracuuLoading(false);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.ehd.itemWrapper}>
          <View style={styles.row}>
            <Text style={styles.textH}>{item.ngaynop}</Text>
            <Text style={styles.textH}>Kỳ: {item.kykekhai}</Text>
          </View>
          <Text style={styles.textH}>{item.tenthutuc}</Text>
          <Text style={styles.text}>Số: {item.sohoso}</Text>
          <Text style={styles.text}>Chi tiết: {item.chitiet}</Text>
          <View style={styles.ehd.itemRow}>
            <Text></Text>
            <Text style={styles.highlight}>{item.trangthaixl}</Text>
          </View>
        </View>
        <Divider width={1.5}></Divider>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={'Lịch sử nộp hồ sơ BHXH'}
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
        </View>
        <View style={styles.dmcty.content}>
          <Text style={styles.textH}>2. Chọn thời gian:</Text>
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
            {data.length != 0 ? (
              <Animated.FlatList
                entering={FadeIn.duration(1000)}
                exiting={FadeOut.duration(1000)}
                data={data}
                renderItem={({item}) => renderItem({item})}
                keyExtractor={item => item.index}
                windowSize={10}
              />
            ) : (
              <ReloadComponent
                size={0.5}
                title={'Không có dữ liệu hồ sơ'}
                reload={false}></ReloadComponent>
            )}
          </View>
        </View>
      </View>
      {/* Modal Lịch */}
      <CalendarModal
        visible={calendarModal}
        minDate={minDate}
        secondButton={true}
        onPressOutside={() => setCalendarModal(!calendarModal)}
        onDateChange={date => handleDateChange(date)}
        buttonTitle={'Hôm nay'}
        onSubmit={() => handleDateChange(currentDate)}
        buttonStyle={styles.ehd.calendarButton}
        buttonTitle2={'Tháng này'}
        onSubmit2={() => setDefaultMonth()}
        buttonStyle2={styles.ehd.calendarButtonR}></CalendarModal>
    </SafeAreaView>
  );
};

export default Lichsunophoso;
