import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {startOfMonth, endOfMonth, addMonths} from 'date-fns';
import CurrencyInput from 'react-native-currency-input';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../../navigation/DataContext';
import {convertTime} from '../../utils/convertTime';
import React, {useEffect, useState} from 'react';
import {getMst} from '../../utils/getMst';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import moment from 'moment-timezone';
import {Input} from '@rneui/themed';
import {encode} from 'base-64';
import axios from 'axios';
// Shared
import navigationStrings from '../../../shared/navigationStrings';
import {ehdUrl, hddtHdUrl} from '../../../shared/url';
import wsStrings from '../../../shared/wsStrings';
// Components
import {
  CalendarModal,
  CustomModal,
  EmailModal,
} from '../../components/CustomModal';
import {showAlert} from '../../components/notifications/showAlert';
import ReloadComponent from '../../components/ReloadComponent';
import DropdownList from '../../components/DropdownList';
import CustomButton from '../../components/CustomButton';
import CustomSwitch from '../../components/CustomSwitch';
import PickDate from '../../components/PickDate';
import Header from '../../components/Header';

const Dmcty = () => {
  const navigation = useNavigation();
  const {userData} = useData();
  const [listMst, setListMst] = useState('');
  const [tg, setTg] = useState(true);
  const [inputMst, setInputMst] = useState('');
  const [pass_hddt, setPass_hddt] = useState();
  const [input_hddt, setInput_hddt] = useState('');
  const [pickMst, setPickMst] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [isPickStartDate, setIsPickStartDate] = useState(true);
  const [minDate, setMinDate] = useState();
  const [quy, setQuy] = useState();
  const [nam, setNam] = useState();
  const [data, setData] = useState();
  const [thue, setThue] = useState();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [mstErrorMessage, setMstErrorMessage] = useState('');
  const [hddtErrorMessage, setHddtErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [mkEmailErrorMessage, setMkEmailErrorMessage] = useState('');
  const [c22ErrorMessage, setC22ErrorMessage] = useState('');
  const [pwdVisible, setPwdVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [thueModalVisible, setThueModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [khaiBaoModal, setKhaiBaoModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const currentDate = moment().tz('Asia/Ho_Chi_Minh');

  useEffect(() => {
    if (!listMst) {
      getListMst();
    }
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

  // Chọn ngày đến ngày theo quý, năm
  useEffect(() => {
    onChangeTime();
  }, [quy, nam]);

  const onPressThem = () => {
    setInputMst('');
    setInput_hddt('');
    setKhaiBaoModal(true);
  };

  const onPressEmail = () => {
    setEmail('');
    setPwd('');
    setEmailModal(true);
  };

  const onPressC22 = item => {
    setThue(item.C22);
    setThueModalVisible(true);
  };

  const onChangeMst = item => {
    setData('');
    setPickMst(item.value);
    setPass_hddt(item.pass_hddt);
    if (!item.pass_hddt) {
      showAlert(
        'error',
        'MST này thiếu mật khẩu Hoá đơn điện tử',
        'Khai báo trong mục Danh sách cty',
      );
    }
  };

  const formatMst = value => {
    if (/^\d+(-\d+)?$/.test(value)) {
      if (value.length == 11) {
        const formattedValue = value.slice(0, 10) + '-' + value.slice(10);
        setInputMst(formattedValue);
      } else if (value.length > 14) {
        setMstErrorMessage('Mã số thuế vượt quá giới hạn');
      } else {
        setInputMst(value);
      }
    } else {
      setInputMst('');
      setMstErrorMessage('Sai mã số thuế');
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

  const onChangeQuy = item => {
    setQuy(item.value);
    getStoreData(pickMst, startDate, endDate, item.value, nam);
  };

  const onChangeNam = item => {
    setNam(item.value);
    getStoreData(pickMst, startDate, endDate, quy, item.value);
  };

  const storeForm = async res => {
    const dataSize = await AsyncStorage.getItem('dataSize');
    const key = 'tax' + pickMst + tg.toString() + quy + nam;
    const key2 = 'tax' + pickMst + tg.toString() + startDate + endDate;
    const data = JSON.stringify(res);
    var sizeof = require('sizeof');
    const newDataSize =
      Number(dataSize) +
      sizeof.sizeof(data) +
      sizeof.sizeof(pickMst) +
      2 +
      2 +
      8;
    const newDataSize2 =
      Number(dataSize) +
      sizeof.sizeof(data) +
      sizeof.sizeof(pickMst) +
      sizeof.sizeof(startDate) +
      sizeof.sizeof(endDate);
    await AsyncStorage.setItem('account', userData.userName);
    await AsyncStorage.setItem('tax_pickMst', pickMst);
    await AsyncStorage.setItem('tax_tg', tg.toString());
    await AsyncStorage.setItem('pass_hddt', pass_hddt);
    if (tg) {
      await AsyncStorage.setItem(key, data);
      await AsyncStorage.setItem('quy', quy);
      await AsyncStorage.setItem('nam', nam);
      await AsyncStorage.setItem('dataSize', newDataSize.toString());
    } else {
      await AsyncStorage.setItem(key2, data);
      await AsyncStorage.setItem('startDate', startDate);
      await AsyncStorage.setItem('endDate', endDate);
      await AsyncStorage.setItem('dataSize', newDataSize2.toString());
    }
  };

  const getListMst = async () => {
    try {
      const listMst = await getMst(userData.userName, userData.pwd, 'hddt');
      setListMst(listMst);
      getStoreInfo(listMst);
    } catch (error) {
      showAlert('error', 'Lỗi', error.message);
    }
  };

  const getStoreInfo = async listMst => {
    try {
      const tg = await AsyncStorage.getItem('tax_tg');
      if (tg) {
        const mst = await AsyncStorage.getItem('tax_pickMst');
        const st = await AsyncStorage.getItem('startDate');
        const ed = await AsyncStorage.getItem('endDate');
        const quy = await AsyncStorage.getItem('quy');
        const nam = await AsyncStorage.getItem('nam');
        setPass_hddt(await AsyncStorage.getItem('pass_hddt'));
        setPickMst(mst);
        if (tg == 'true') {
          setQuy(quy);
          setNam(nam);
        } else {
          setTg(false);
          setStartDate(st);
          setEndDate(ed);
        }
        getStoreData(tg, mst, st, ed, quy, nam);
      } else {
        if (listMst.length == 1) {
          setPickMst(listMst[0].value);
          setPass_hddt(listMst[0].pass_hddt);
        }
        setQuy('1');
        setNam(moment().tz('Asia/Ho_Chi_Minh').format('YYYY'));
      }
      setLoading(false);
    } catch (error) {
      //
    }
  };

  const getStoreData = async (tg, mst, st, ed, quy, nam) => {
    if (tg == 'false') {
      const key = 'tax' + mst + tg + st + ed;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        setData(JSON.parse(data));
      } else {
        setData([]);
      }
    } else if (tg == 'true') {
      const key = 'tax' + mst + tg + quy + nam;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        setData(JSON.parse(data));
      } else {
        setData([]);
      }
    }
  };

  const onSubmitTracuu = async () => {
    const key = 'tax' + pickMst + tg.toString() + quy + nam;
    const key2 = 'tax' + pickMst + tg.toString() + startDate + endDate;
    if (!pickMst) {
      showAlert('error', 'Lỗi', 'Bạn chưa chọn mã số thuế');
    } else if (!startDate) {
      showAlert('error', 'Lỗi', 'Thời gian không hợp lệ');
    } else if (!endDate) {
      showAlert('error', 'Lỗi', 'Thời gian không hợp lệ');
    } else if (!data) {
      if (tg) {
        const storedData = await AsyncStorage.getItem(key);
        if (storedData) {
          setData(JSON.parse(storedData));
        } else {
          checkServer();
        }
      } else {
        const storedData = await AsyncStorage.getItem(key2);
        if (storedData) {
          setData(JSON.parse(storedData));
        } else {
          checkServer();
        }
      }
    } else {
      showAlert('success', 'Vui lòng đợi trong giây lát....');
      getTokhai();
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
    setIsModalVisible(true);
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
      setIsModalVisible(false);
    }
  };

  const setDefaultMonth = () => {
    const startD = moment(currentDate).startOf('month').format('YYYY-MM-DD');
    const endD = moment(currentDate).endOf('month').format('YYYY-MM-DD');
    setStartDate(startD);
    setEndDate(endD);
    setIsModalVisible(false);
  };

  const onSubmitMst = () => {
    if (!inputMst && !input_hddt) {
      setMstErrorMessage('Bạn chưa nhập mã số thuế');
      setHddtErrorMessage('Bạn chưa nhập mật khẩu hoá đơn điện tử');
    } else if (!inputMst) {
      setMstErrorMessage('Bạn chưa nhập mã số thuế');
    } else if (!input_hddt) {
      setHddtErrorMessage('Bạn chưa nhập mật khẩu hoá đơn điện tử');
    } else if (inputMst.length != 10 || inputMst.length != 14) {
      setMstErrorMessage('Mã số thuế không hợp lệ');
    } else {
      setIsLoading(true);
      themMst();
    }
  };

  const onSubmitEmail = () => {
    if (!pickMst) {
      Alert.alert('Thông báo', 'Bạn chưa chọn mã số thuế');
    } else if (!email && !pwd) {
      setEmailErrorMessage('Vui lòng điền địa chỉ Email');
      setMkEmailErrorMessage('Vui lòng điền mật khẩu');
    } else if (!email) {
      setEmailErrorMessage('Vui lòng điền địa chỉ Email');
    } else if (!pwd) {
      setMkEmailErrorMessage('Vui lòng điền mật khẩu');
    } else {
      setIsLoading(true);
      thememail();
    }
  };

  const handleSubmit = item => {
    if (thue || thue == 0) {
      setIsLoading(true);
      capnhatC22(item);
    } else {
      setC22ErrorMessage('Vui lòng nhập tiền thuế khấu trừ');
    }
  };

  const dshdNavigation = type => {
    if (pass_hddt) {
      const navigateData = {
        userName: userData.userName,
        pwd: userData.pwd,
        mst: pickMst,
        pass_hddt: pass_hddt,
        startDate: startDate,
        endDate: endDate,
        tg: tg,
        title: type == 'MV' ? 'Hoá đơn mua vào' : 'Hoá đơn bán ra',
        type: type,
        url: type == 'MV' ? 'vsign_muavao' : 'vsign_banra',
        syncUrl: type == 'MV' ? 'vsign_ssmuavao' : 'vsign_ssbanra',
      };
      navigation.navigate(navigationStrings.DSHD, navigateData);
    } else {
      const type = 'error';
      const title = 'Thiếu mật khẩu HĐĐT';
      const text = 'Khai báo trong mục Danh sách cty';
      showAlert(type, title, text);
    }
  };

  const openLink = (url, title) => {
    navigation.navigate(navigationStrings.WEBSCREEN, {
      tg: tg,
      url: url,
      title: title,
    });
  };

  const checkServer = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_CHECKSERVER, {
        username: userData.userName,
        password: userData.pwd,
        mst: pickMst,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res == '0') {
          showAlert('success', 'Vui lòng đợi trong giây lát....');
          setIsLoading(true);
          getTokhai();
          // activateKeepAwake();
        } else if (res == '1') {
          showAlert('success', 'Server đang phản hồi');
        }
      })
      .catch(error => {
        Alert.alert('Thông báo', 'Không thể cập nhật tình trạng server');
      });
  };

  const themMst = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_ADDMST, {
        username: userData.userName,
        password: userData.pwd,
        mst: inputMst,
        pass_hddt: encode(input_hddt),
        pass_tdt: '',
        pmkt: 'acc2k',
        server_pmkt: '',
        username_pmkt: '',
        pass_pmkt: '',
        data_pmkt: '',
        loaihinh: 'TM',
        thongtu: '133',
        tinhtrang: 'C',
        thu_tu: 1,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          showAlert('success', 'Đã thêm mã số thuế');
          setKhaiBaoModal(false);
          setLoading(true);
          getMst();
        } else {
          Alert.alert('Thông báo', 'Lỗi khi thêm mã số thuế\n' + res.Status);
        }
      })
      .catch(error => {
        Alert.alert('Thông báo', 'Lỗi khi thêm mã số thuế\n' + error.message);
      })
      .finally(() => {
        getMst();
        setIsLoading(false);
      });
  };

  const getTokhai = async type => {
    setIsLoading(true);
    await AsyncStorage.setItem('process', '1');
    await axios
      .post(ehdUrl + wsStrings.VSIGN_GETTOKHAI, {
        username: userData.userName,
        password: userData.pwd,
        mst: pickMst,
        tu_ngay: startDate,
        den_ngay: endDate,
        loaiky: tg ? 'Q' : 'T',
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          if (res.Status) {
            showAlert('error', 'Lỗi', res.Status);
          } else {
            setData(res);
            storeForm(res);
          }
        }
      })
      .catch(error => {
        if (error.message == 'Network Error') {
          getTokhai();
        } else {
          Alert.alert(
            'Thông báo',
            'Xảy ra lỗi trong quá trình tra cứu\n' + error.message,
          );
        }
      })
      .finally(async () => {
        await AsyncStorage.setItem('process', '0');
        type == 'C22' && setThueModalVisible(false);
        setIsLoading(false);
        // deactivateKeepAwake();
      });
  };

  const capnhatC22 = async item => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_UPDATEC22, {
        username: userData.userName,
        password: userData.pwd,
        mst: pickMst,
        tu_ngay: startDate,
        den_ngay: endDate,
        ky: item.ky,
        loaiky: item.loaiky,
        lan: item.lan,
        c22: thue,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Cập nhật thành công') {
          getTokhai('C22');
        } else {
          setIsLoading(false);
          setThueModalVisible(false);
          Alert.alert('Thông báo', res.Status);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Lỗi khi cập nhật thuế khấu trừ: ' + error.message,
        );
      });
  };

  const thememail = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_ADDEMAIL, {
        username: userData.userName,
        password: userData.pwd,
        mst: pickMst,
        email: email,
        pwd: encode(pwd),
        server: 'Gmail.com',
        port: 995,
        ssl: 1,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          setEmailModal(false);
          showAlert('success', 'Thêm email thành công');
        } else {
          Alert.alert('Thông báo', 'Lỗi: ' + res.Status);
        }
      })
      .catch(error => {
        Alert.alert('Thông báo', 'Xảy ra lỗi khi thêm Email\n' + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderFormThemMst = () => {
    return (
      <View style={styles.dmcty.calendar}>
        <Text style={styles.textH}>Khai báo mã số thuế</Text>
        <View style={styles.dmcty.input}>
          <Input
            label={'Mã số thuế'}
            placeholder="Gồm có 10 hoặc 14 số"
            value={inputMst}
            maxLength={14}
            errorMessage={mstErrorMessage}
            onChange={() => mstErrorMessage && setMstErrorMessage('')}
            onChangeText={value => formatMst(value)}
            keyboardType="number-pad"
          />
          <Input
            label={'Mật khẩu HĐĐT'}
            placeholder="Nhập ở đây"
            secureTextEntry={pwdVisible}
            value={input_hddt}
            errorMessage={hddtErrorMessage}
            onChange={() => hddtErrorMessage && setHddtErrorMessage('')}
            onChangeText={value => setInput_hddt(value)}
            rightIcon={
              <TouchableOpacity onPress={() => setPwdVisible(!pwdVisible)}>
                <Icon
                  name={pwdVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={30}
                />
              </TouchableOpacity>
            }
          />
          <TouchableOpacity
            onPress={() => {
              openLink(hddtHdUrl, 'Youtube');
              setKhaiBaoModal(!khaiBaoModal);
            }}>
            <Text style={styles.dmcty.hyperlink}>
              Hướng dẫn lấy mật khẩu HĐĐT
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dmcty.buttonCon}>
          <CustomButton
            onPress={() => onSubmitMst()}
            title={'OK'}
            loading={isLoading}
            tg={tg}></CustomButton>
        </View>
      </View>
    );
  };

  const renderFormEditC22 = () => {
    return (
      <View style={styles.dmcty.calendar}>
        <Text style={styles.textH}>Khai báo thuế khấu trừ</Text>
        <View style={styles.dmcty.input}>
          <CurrencyInput
            delimiter="."
            minValue={0}
            precision={0}
            value={thue}
            onChangeValue={value => setThue(value)}
            onChange={() => c22ErrorMessage && setC22ErrorMessage('')}
            renderTextInput={textInputProps => (
              <Input
                {...textInputProps}
                variant="filled"
                label={'Thuế khấu trừ'}
                errorMessage={c22ErrorMessage}
                inputStyle={{paddingHorizontal: 10}}
                keyboardType="number-pad"
              />
            )}
          />
        </View>
        <View style={styles.dmcty.buttonCon}>
          <CustomButton
            onPress={() => handleSubmit(data[0])}
            title={'OK'}
            loading={isLoading}
            tg={tg}></CustomButton>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        tg={tg}
        title={'Thuế VAT'}
        onPressLeft={() => navigation.goBack()}
      />
      <ScrollView style={styles.dmcty.body}>
        {/* 1 Chọn MST */}
        <View style={styles.dmcty.content}>
          <View style={styles.dmcty.row}>
            <Text style={styles.textH}>1. Chọn MST:</Text>
            <DropdownList
              loading={loading}
              data={listMst}
              placeholder="Mã số thuế"
              value={pickMst}
              onChange={item => onChangeMst(item)}
              style={styles.dmcty.dropdown}
              containerStyle={styles.dmcty.containerMst}
              tg={tg}></DropdownList>
            <CustomButton
              onPress={() => onPressThem()}
              title={'Thêm'}
              tg={tg}
              buttonStyle={{
                borderBottomRightRadius: 30,
                borderTopRightRadius: 30,
                width: 70,
              }}></CustomButton>
          </View>
          <View style={{alignItems: 'center'}}>
            <CustomButton
              onPress={() => onPressEmail()}
              title={'Email'}
              tg={tg}></CustomButton>
          </View>
        </View>
        {/* 2 Chọn thời gian */}
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
            <View style={styles.dmcty.row}>
              <Text style={styles.text}>Quý: </Text>
              <DropdownList
                type="quy"
                value={quy}
                onChange={item => onChangeQuy(item)}></DropdownList>
              <Text> Năm: </Text>
              <DropdownList
                type="nam"
                value={nam}
                onChange={item => onChangeNam(item)}></DropdownList>
            </View>
          ) : (
            <PickDate
              type="2"
              startDate={startDate}
              onPressStartDate={() => pickDate('startDate')}
              endDate={endDate}
              onPressEndDate={() => pickDate('endDate')}></PickDate>
          )}
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <CustomButton
              onPress={() => onSubmitTracuu()}
              title="Tra cứu"
              loading={isLoading}
              tg={tg}></CustomButton>
          </View>
        </View>
        {/* 3 Tra cứu dữ liệu */}
        <View style={styles.dmcty.content}>
          <View style={{marginLeft: 5}}>
            <Text style={styles.textH}>3. Tra cứu dữ liệu</Text>
          </View>
          {!data ? (
            <ReloadComponent
              title={'Không có thông tin'}
              size={0.55}></ReloadComponent>
          ) : (
            <Animated.View
              entering={FadeIn.duration(1000)}
              exiting={FadeOut.duration(1000)}
              style={{paddingTop: 30}}>
              {data.map(item => (
                <View>
                  <View style={styles.dmcty.row}>
                    <View style={styles.dmcty.leftCol}>
                      <Text style={styles.text}>
                        Thuế GTGT còn được khấu trừ kỳ trước chuyển sang
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.dmcty.rightCol}
                      onPress={() => onPressC22(item)}>
                      <Text
                        style={[
                          styles.textU,
                          {
                            color: tg ? colors.MAINCOLOR : colors.SECONDCOLOR,
                          },
                        ]}>
                        {new Intl.NumberFormat('vi-VN').format(item.C22)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.dmcty.row}>
                    {item.C23 == '0' ? (
                      <View style={styles.dmcty.leftCol}>
                        <Text style={styles.textH}>Doanh số mua vào</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => dshdNavigation((type = 'MV'))}
                        disabled={item.C23 == '0' ? true : false}>
                        <View style={styles.dmcty.leftCol}>
                          <Text
                            style={[
                              styles.textU,
                              {
                                color: tg
                                  ? colors.MAINCOLOR
                                  : colors.SECONDCOLOR,
                              },
                            ]}>
                            Doanh số mua vào
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    <View style={styles.dmcty.rightCol}>
                      <Text style={styles.textH}>
                        {new Intl.NumberFormat('vi-VN').format(item.C23)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dmcty.row}>
                    <View style={styles.dmcty.leftCol}>
                      <Text style={styles.text}>Thuế mua vào</Text>
                    </View>
                    <View style={styles.dmcty.rightCol}>
                      <Text style={styles.textH}>
                        {new Intl.NumberFormat('vi-VN').format(item.C24)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dmcty.row}>
                    {item.c34 == '0' ? (
                      <View style={styles.dmcty.leftCol}>
                        <Text style={styles.textH}>Doanh số bán ra</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => dshdNavigation((type = 'BR'))}>
                        <View style={styles.dmcty.leftCol}>
                          <Text
                            style={[
                              styles.textU,
                              {
                                color: tg
                                  ? colors.MAINCOLOR
                                  : colors.SECONDCOLOR,
                              },
                            ]}>
                            Doanh số bán ra
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    <View style={styles.dmcty.rightCol}>
                      <Text style={styles.textH}>
                        {new Intl.NumberFormat('vi-VN').format(item.c34)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dmcty.row}>
                    <View style={styles.dmcty.leftCol}>
                      <Text style={styles.text}>Thuế bán ra</Text>
                    </View>
                    <View style={styles.dmcty.rightCol}>
                      <Text style={styles.textH}>
                        {new Intl.NumberFormat('vi-VN').format(item.c35)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dmcty.row}>
                    <View style={styles.dmcty.leftCol}>
                      <Text style={styles.text}>
                        Thuế GTGT còn phải nộp trong kỳ
                      </Text>
                    </View>
                    <View style={styles.dmcty.rightCol}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: colors.RED,
                        }}>
                        {new Intl.NumberFormat('vi-VN').format(item.c40)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.dmcty.row}>
                    <View style={styles.dmcty.leftCol}>
                      <Text style={styles.text}>
                        Thuế GTGT chưa khấu trừ hết trong kỳ này
                      </Text>
                    </View>
                    <View style={styles.dmcty.rightCol}>
                      <Text style={styles.textH}>
                        {new Intl.NumberFormat('vi-VN').format(item.c41)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </Animated.View>
          )}
        </View>
      </ScrollView>
      {/* Thêm MST Modal */}
      <CustomModal
        visible={khaiBaoModal}
        onPressOutSide={() => setKhaiBaoModal(!khaiBaoModal)}
        renderContent={() => renderFormThemMst()}></CustomModal>
      {/* Email Modal */}
      <EmailModal
        tg={tg}
        visible={emailModal}
        onPressOutSide={() => setEmailModal(!emailModal)}
        tk={email}
        errorMessageTK={emailErrorMessage}
        onChangeTextTK={value => setEmail(value)}
        onChangeTK={() => emailErrorMessage && setEmailErrorMessage('')}
        secureTextEntry={pwdVisible}
        mk={pwd}
        errorMessageMK={mkEmailErrorMessage}
        onChangeTextMK={value => setPwd(value)}
        onChangeMK={() => mkEmailErrorMessage && setMkEmailErrorMessage('')}
        onPressHyperlink={() => setEmailModal(!emailModal)}
        onPressSubmit={() => onSubmitEmail()}
        buttonLoading={isLoading}></EmailModal>
      {/* Modal lịch */}
      <CalendarModal
        visible={isModalVisible}
        secondButton={true}
        onPressOutside={() => setIsModalVisible(!isModalVisible)}
        color={colors.SECONDCOLOR}
        minDate={minDate}
        onDateChange={date => handleDateChange(date)}
        buttonTitle={'Hôm nay'}
        onSubmit={() => handleDateChange(currentDate)}
        buttonStyle={styles.dmcty.calendarButton}
        buttonTitle2={'Tháng này'}
        titleStyle2={{fontWeight: 'bold', color: colors.SECONDCOLOR}}
        buttonStyle2={styles.dmcty.calendarButtonR}
        onSubmit2={() => setDefaultMonth()}></CalendarModal>
      {/* Modal khai báo thuế khấu trừ */}
      <CustomModal
        visible={thueModalVisible}
        onPressOutSide={() => setThueModalVisible(!thueModalVisible)}
        renderContent={() => renderFormEditC22()}></CustomModal>
    </SafeAreaView>
  );
};

export default Dmcty;
