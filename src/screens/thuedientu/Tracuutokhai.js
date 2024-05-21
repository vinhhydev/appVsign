import {View, Text, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import navigationStrings from '../../../shared/navigationStrings';
import {useRoute, useNavigation} from '@react-navigation/native';
import {startOfMonth, endOfMonth, addMonths} from 'date-fns';
import {convertTime} from '../../utils/convertTime';
import wsStrings from '../../../shared/wsStrings';
import React, {useState, useEffect} from 'react';
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
import LoadingScreen from '../../components/LoadingScreen';
import CustomButton from '../../components/CustomButton';
import DropdownList from '../../components/DropdownList';
import CustomSwitch from '../../components/CustomSwitch';
import PickDate from '../../components/PickDate';
import Header from '../../components/Header';
//

const Tracuutokhai = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [pass_tdt, setPass_tdt] = useState();
  const [data, setData] = useState([]);
  const [listMst, setListMst] = useState(route.params.listMst);
  const [pickMst, setPickMst] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [minDate, setMinDate] = useState();
  const [tg, setTg] = useState(false);
  const [quy, setQuy] = useState();
  const [nam, setNam] = useState();
  const [isPickStartDate, setIsPickStartDate] = useState(true);
  const [tracuuLoading, setTracuuLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const currentDate = moment().tz('Asia/Ho_Chi_Minh');

  useEffect(() => {
    getStoredData();
  }, []);

  useEffect(() => {
    if (data) {
      if (tg) {
        setQuy('1');
        setNam(moment().tz('Asia/Ho_Chi_Minh').format('YYYY'));
      } else {
        setStartDate(moment(currentDate).format('YYYY-MM-DD'));
        setEndDate(moment(currentDate).format('YYYY-MM-DD'));
      }
    }
  }, [tg]);

  // Nếu quý hoặc năm thay đổi thì tự set ngày tháng theo quý, năm đó
  useEffect(() => {
    if (tg) {
      onChangeTime();
    }
  }, [quy, nam, pickMst]);

  useEffect(() => {
    checkStoredDataExist();
  }, [pickMst, startDate, endDate]);

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
    } else if (!pass_tdt) {
      const type = 'error';
      const title = 'Thiếu mật khẩu Thuế điện tử';
      const text = 'Khai báo trong mục Danh sách cty';
      showAlert(type, title, text);
    } else if (isStartDateAfterEndDate) {
      const type = 'error';
      const title = 'Ngày không hợp lệ';
      showAlert(type, title);
    } else {
      const type = 'success';
      const title = 'Vui lòng đợi trong giây lát....';
      showAlert(type, title);
      setTracuuLoading(true);
      tracuu();
    }
  };

  const onPressView = item => {
    setViewLoading(true);
    getUrl(item);
  };

  const onPressThongbao = item => {
    // Kiểm tra filethongbao nếu có lỗi thì hiện lên
    if (item.fileThongbao.some(item => item.includes('Error'))) {
      showAlert('error', item.fileThongbao[0]);
    } else {
      navigation.navigate(navigationStrings.TCTOKHAI0, {
        data: item.fileThongbao,
        mst: pickMst,
        tg: tg,
      });
    }
  };

  const onChangeTime = () => {
    if (nam && quy) {
      const startQuarterMonth = (quy - 1) * 3;
      const startD = startOfMonth(
        addMonths(new Date(nam, startQuarterMonth), 0),
      );
      const endD = endOfMonth(
        addMonths(new Date(nam, startQuarterMonth + 2), 0),
      );
      setStartDate(convertTime(startD));
      setEndDate(convertTime(endD));
    }
  };

  const onChangeMst = item => {
    setData([]);
    setPickMst(item.value);
    setPass_tdt(item.pass_tdt);
    if (!item.pass_tdt) {
      showAlert(
        'error',
        'MST này thiếu mật khẩu Thuế điện tử',
        'Khai báo trong mục Danh sách cty',
      );
    }
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

  const openPdf = url => {
    navigation.navigate(navigationStrings.WEBSCREEN, {
      tg: tg,
      url: url,
      title: 'Thông tin tờ khai',
    });
  };

  const storeData = async data => {
    try {
      const dataSize = await AsyncStorage.getItem('dataSize');
      var sizeof = require('sizeof');
      const newDataSize = sizeof.sizeof(data) + Number(dataSize);
      if (tg) {
        const key = 'tdt' + pickMst + quy + nam;
        await AsyncStorage.setItem(key, data);
        await AsyncStorage.setItem('tdt_quy', quy);
        await AsyncStorage.setItem('tdt_nam', nam);
      } else {
        const key = 'tdt' + pickMst + startDate + endDate;
        await AsyncStorage.setItem(key, data);
        await AsyncStorage.setItem('tdt_startDate', startDate);
        await AsyncStorage.setItem('tdt_endDate', endDate);
      }
      await AsyncStorage.setItem('tdt_pickMst', pickMst);
      await AsyncStorage.setItem('pass_tdt', pass_tdt);
      await AsyncStorage.setItem('tdt_tg', tg.toString());
      await AsyncStorage.setItem('dataSize', newDataSize.toString());
    } catch (error) {
      Alert.alert(
        'Thông báo',
        'Xảy ra lỗi khi lưu trạng thái\n' + 'Lỗi: ' + error.message,
      );
    }
  };

  const getStoredData = async () => {
    const tg = await AsyncStorage.getItem('tdt_tg');
    // Có dữ liệu được lưu
    if (tg) {
      const pickMst = await AsyncStorage.getItem('tdt_pickMst');
      const pass_tdt = await AsyncStorage.getItem('pass_tdt');
      const startDate = await AsyncStorage.getItem('tdt_startDate');
      const endDate = await AsyncStorage.getItem('tdt_endDate');
      if (tg == 'true') {
        const quy = await AsyncStorage.getItem('tdt_quy');
        const nam = await AsyncStorage.getItem('tdt_nam');
        const key = 'tdt' + pickMst + quy + nam;
        const data = await AsyncStorage.getItem(key);
        setTg(true);
        setQuy(quy);
        setNam(nam);
        setPickMst(pickMst);
        setPass_tdt(pass_tdt);
        setData(JSON.parse(data));
      } else if (tg == 'false') {
        const key = 'tdt' + pickMst + startDate + endDate;
        const data = await AsyncStorage.getItem(key);
        setStartDate(startDate);
        setEndDate(endDate);
        setPickMst(pickMst);
        setPass_tdt(pass_tdt);
        if (data) {
          setData(JSON.parse(data));
        }
      } else {
        if (pickMst && startDate && endDate) {
          setPickMst(pickMst);
          setPass_tdt(pass_tdt);
          setStartDate(startDate);
          setEndDate(endDate);
        }
      }
    } else {
      // Nếu không có dữ liệu
      if (listMst.length == 1) {
        setPickMst(listMst[0].value);
        setPass_tdt(listMst[0].pass_tdt);
      }
      setDefaultMonth();
    }
  };

  const checkStoredDataExist = async () => {
    if (pickMst) {
      if (tg) {
        const key = 'tdt' + pickMst + quy + nam;
        const data = await AsyncStorage.getItem(key);
        if (data) {
          setData(JSON.parse(data));
        } else {
          setData([]);
        }
      } else {
        const key = 'tdt' + pickMst + startDate + endDate;
        const data = await AsyncStorage.getItem(key);
        if (data) {
          setData(JSON.parse(data));
        } else {
          setData([]);
        }
      }
    }
  };

  const tracuu = async () => {
    await axios
      .post(ehdUrl + wsStrings.TRACUUTOKHAI, {
        token: '@acc2k',
        mst: pickMst,
        pwd: decode(pass_tdt),
        ql: 'true',
        tu_ngay: moment(startDate).format('YYYY-MM-DD'),
        den_ngay: moment(endDate).format('YYYY-MM-DD'),
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          setData(res);
          storeData(response.data.d);
        } else {
          Alert.alert('Thông báo', 'Không có dữ liệu');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi tra cứu thông tin\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => setTracuuLoading(false));
  };

  const getUrl = async item => {
    await axios
      .post(ehdUrl + wsStrings.ITAXVIEWER, {
        mst: pickMst,
        ma: item.magiaodich,
        loai: 'TK',
      })
      .then(response => {
        if (response.data.d) {
          const url = response.data.d;
          const newUrl = 'https://' + url;
          openPdf(newUrl);
        } else {
          Alert.alert('Thông báo' + 'Server không có phản hồi');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi lấy thông tin tờ khai\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => setViewLoading(false));
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.ehd.itemWrapper}>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.textH}>{item.ngaynop}</Text>
            <TouchableOpacity
              onPress={() => onPressView(item)}
              disabled={viewLoading}
              style={styles.ehd.button}>
              <Icon
                name="eye-outline"
                size={35}
                color={tg ? colors.MAINCOLOR : colors.SECONDCOLOR}></Icon>
            </TouchableOpacity>
          </View>
          <Text style={styles.textH}>{item.tokhaiphuluc}</Text>
          <Text style={styles.text}>Nơi nộp: {item.noinop}</Text>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Loại: {item.loaitokhai}</Text>
            <Text style={styles.text}>Kỳ tính: {item.kytinhthue}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Lần nộp: {item.lannop}</Text>
            <Text style={styles.text}>Lần bổ sung: {item.lanbosung}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>
              Trạng thái:{' '}
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: '700',
                  color: tg ? colors.MAINCOLOR : colors.SECONDCOLOR,
                }}>
                {item.trangthai}
              </Text>
            </Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text></Text>
            <TouchableOpacity onPress={() => onPressThongbao(item)}>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: '700',
                  textDecorationLine: 'underline',
                  color: tg ? colors.MAINCOLOR : colors.SECONDCOLOR,
                }}>
                Thông báo
              </Text>
            </TouchableOpacity>
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
        title={'Tra cứu tờ khai'}
        colorLeft={tg ? colors.MAINCOLOR : colors.SECONDCOLOR}
      />
      <View style={styles.dmcty.body}>
        <View style={styles.dmcty.content}>
          <View style={styles.tuvan.row}>
            <Text style={styles.textH}>1. Chọn MST:</Text>
            <DropdownList
              tg={tg}
              data={listMst}
              value={pickMst}
              placeholder={'Mã số thuế'}
              onChange={item => onChangeMst(item)}
              style={styles.tdt.dropdown}
              containerStyle={styles.tdt.containerMst}></DropdownList>
          </View>
        </View>
        <View style={styles.dmcty.content}>
          <View style={styles.tuvan.row}>
            <Text style={styles.textH}>2. Chọn thời gian:</Text>
            {/* Switch thời gian */}
            <View style={{marginLeft: 20}}>
              <CustomSwitch
                value={tg}
                onValueChange={value => setTg(value)}></CustomSwitch>
            </View>
          </View>
          {tg ? (
            // Chọn theo quý
            <View style={styles.dmcty.row}>
              <Text style={styles.text}>Quý: </Text>
              <DropdownList
                type="quy"
                value={quy}
                onChange={item => setQuy(item.value)}></DropdownList>
              <Text> Năm: </Text>
              <DropdownList
                type="nam"
                value={nam}
                onChange={item => setNam(item.value)}></DropdownList>
            </View>
          ) : (
            // Chọn theo ngày
            <PickDate
              type="2"
              startDate={startDate}
              onPressStartDate={() => pickDate('startDate')}
              endDate={endDate}
              onPressEndDate={() => pickDate('endDate')}></PickDate>
          )}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <CustomButton
              tg={tg}
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
                title={'Không có dữ liệu tờ khai'}
                reload={false}></ReloadComponent>
            )}
          </View>
        </View>
      </View>
      {/* Modal lịch */}
      <CalendarModal
        visible={calendarModal}
        onPressOutside={() => setCalendarModal(!calendarModal)}
        color={colors.SECONDCOLOR}
        minDate={minDate}
        onDateChange={date => handleDateChange(date)}
        secondButton={true}
        buttonTitle={'Hôm nay'}
        onSubmit={() => handleDateChange(currentDate)}
        buttonStyle={styles.dmcty.calendarButton}
        buttonTitle2={'Tháng này'}
        onSubmit2={() => setDefaultMonth()}
        titleStyle2={{fontWeight: 'bold', color: colors.SECONDCOLOR}}
        buttonStyle2={styles.dmcty.calendarButtonR}></CalendarModal>
      {/* LoadingScreen */}
      {viewLoading && <LoadingScreen></LoadingScreen>}
    </SafeAreaView>
  );
};

export default Tracuutokhai;
