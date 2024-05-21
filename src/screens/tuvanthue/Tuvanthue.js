import {
  SafeAreaView,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../../navigation/DataContext';
import React, {useState, useEffect} from 'react';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import {Icon, Input} from '@rneui/base';
import axios from 'axios';
// Shared
import navigationStrings from '../../../shared/navigationStrings';
import {listDanhxung} from '../../../shared/dropdownData';
import {ehdUrl, hotroUrl} from '../../../shared/url';
import wsStrings from '../../../shared/wsStrings';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import LoadingComponent from '../../components/LoadingComponent';
import DropdownList from '../../components/DropdownList';
import {ButtonIcon} from '../../components/CustomButton';
import Header from '../../components/Header';

const Tuvanthue = () => {
  const navigation = useNavigation();
  const {userData} = useData();
  const [pickDanhxung, setPickDanhxung] = useState('');
  const [name, setName] = useState(userData.fullName);
  const [phoneNumber, setPhoneNumber] = useState(userData.userName);
  const [email, setEmail] = useState(userData.email);
  const [listDmnhsp, setListDmnhsp] = useState([]);
  const [pickDmnhsp, setPickDmnhsp] = useState();
  const [dmnhspLabel, setDmnhspLabel] = useState('');
  const [listSp, setListSp] = useState([]);
  const [pickSp, setPickSp] = useState();
  const [spLabel, setSpLabel] = useState('');
  const [nameErrorMess, setNameErrorMess] = useState('');
  const [phoneNumberErrorMess, setPhoneNumberErrorMess] = useState('');
  const [emailErrorMess, setEmailErrorMess] = useState('');
  const [loading, setLoading] = useState(true);
  const [emailLoading, setEmailLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [pickLoading, setPickLoading] = useState(false);

  useEffect(() => {
    getDmnhsp();
  }, []);

  const checkForm = type => {
    const isEmpty = !name && !phoneNumber && !pickDmnhsp && !pickSp;
    if (isEmpty) {
      Alert.alert('Lưu ý', 'Không thể gửi form trống');
    } else if (!name) {
      setNameErrorMess('Vui lòng nhập tên');
    } else if (!phoneNumber) {
      setPhoneNumberErrorMess('Vui lòng nhập số điện thoại');
    } else if (!pickDmnhsp) {
      showAlert('error', 'Vui lòng chọn sản phẩm cần hỗ trợ');
    } else if (!pickSp) {
      showAlert('error', 'Vui lòng chọn nội dung');
    } else {
      handleUserRequest(type);
    }
  };

  const handleUserRequest = type => {
    if (type == 'email') {
      setEmailLoading(true);
      const message =
        pickDanhxung +
        ' ' +
        name +
        ' cần hỗ trợ ' +
        spLabel +
        ' trong ' +
        dmnhspLabel +
        '\n' +
        'SĐT: ' +
        phoneNumber +
        '\n' +
        'Email: ' +
        email;
      sendEmail(message);
    } else if (type == 'chat') {
      // setIsLoading(true);
      // createMessage();
      showAlert('success', ' Thông báo', 'Tính năng đang phát triển');
    }
  };

  const onPickDmnhsp = item => {
    setPickLoading(true);
    setPickDmnhsp(item.value);
    setDmnhspLabel(item.label);
    getSp(item.value);
  };

  const navigateChat = data => {
    navigation.navigate(navigationStrings.MESSAGE, {
      data: data,
      userInfo: {
        phoneNumber: phoneNumber,
        pickDanhxung: pickDanhxung,
        email: email,
        name: name,
        pickDmnhsp: pickDmnhsp,
        pickSp: pickSp,
      },
    });
  };

  // Lấy thông tin tài khoản nhập vào form
  const getDmnhsp = async () => {
    await axios.get(hotroUrl + wsStrings.GET_DMNHSP).then(response => {
      const data = response.data;
      // Loại bỏ xml
      var startIndex = data.indexOf('[');
      var endIndex = data.lastIndexOf(']');
      var jsonString = data.substring(startIndex, endIndex + 1);
      const newData = JSON.parse(jsonString);
      const formatedData = newData.map(item => ({
        label: item.ten_loai_sp,
        value: item.ma_loai_sp,
        trang: item.trang,
      }));
      setListDmnhsp(formatedData);
      setLoading(false);
    });
  };

  const getSp = async item => {
    await axios
      .post(hotroUrl + wsStrings.GET_SP, {
        ma_loai_sp: item,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          const newData = res.map(item => ({
            label: item.ten_sp,
            value: item.ma_sp,
          }));
          setListSp(newData);
          if (newData.length == 1) {
            setPickSp(newData[0].value);
          }
        }
      })
      .finally(() => {
        setPickLoading(false);
      });
  };

  const createMessage = async () => {
    await axios
      .post(hotroUrl + wsStrings.SEND_MESSAGE, {
        id: '0',
        username: phoneNumber,
        danhxung: pickDanhxung,
        hoten: name,
        email: email,
        ma_loai_sp: pickDmnhsp,
        ma_sp: pickSp,
        ben: 'B',
        noidung: 'Tôi cần hỗ trợ trợ ' + dmnhspLabel + ' - ' + spLabel,
        tenfile: '',
        hotena: name,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          navigateChat(res);
        }
      })
      .finally(() => setChatLoading(false));
  };

  const sendEmail = async message => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_LIENHE, {
        username: phoneNumber,
        noidung: message,
      })
      .then(response => {
        const res = response.data.d;
        if (res == 'Ok') {
          Alert.alert(
            'Thông báo',
            'Yêu cầu hỗ trợ của bạn đã được gửi đi bộ phận hỗ trợ của chúng tôi sẽ liên lạc với bạn trong thời gian sớm nhất.\nXin cảm ơn',
            [{text: 'OK', onPress: () => navigation.goBack()}],
          );
        } else {
          Alert.alert(
            'Thông báo',
            'Không thể gửi yêu cầu vui lòng thử lại sau\n' + 'Chi tiết: ' + res,
          );
        }
      })
      .catch(error => {
        Alert.alert(
          'Lỗi',
          'Xảy ra lỗi trong quá trình gửi yêu cầu\n' + error.message,
        );
      })
      .finally(() => setEmailLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => navigation.goBack()} title={'Tư vấn thuế'} />
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        {loading ? (
          <LoadingComponent size={0.8}></LoadingComponent>
        ) : (
          <Animated.ScrollView
            style={styles.body}
            entering={FadeInUp.duration(1000)}
            exiting={FadeOutUp.duration(1000)}>
            <View style={{padding: 20}}>
              <View style={styles.tuvan.row}>
                <Text style={styles.textH}>1. Nhập thông tin liên hệ</Text>
              </View>
              <View style={{alignItems: 'center', marginBottom: 10}}>
                <DropdownList
                  data={listDanhxung}
                  placeholder="Danh xưng"
                  value={pickDanhxung}
                  onChange={item => setPickDanhxung(item.value)}
                  style={styles.tuvan.dropdownDanhxung}
                  containerStyle={
                    styles.tuvan.dropdownConDanhxung
                  }></DropdownList>
              </View>
              <View style={styles.tuvan.row}>
                <Input
                  placeholder="Họ và tên"
                  value={name}
                  leftIconContainerStyle={{marginRight: 5}}
                  errorMessage={nameErrorMess}
                  onChange={() => nameErrorMess && setNameErrorMess('')}
                  onChangeText={value => setName(value)}
                  leftIcon={
                    <Icon name="person" size={25} color={colors.MAINCOLOR} />
                  }
                />
              </View>
              <Input
                placeholder={'Số điện thoại'}
                keyboardType="number-pad"
                value={phoneNumber}
                leftIconContainerStyle={{marginRight: 5}}
                errorMessage={phoneNumberErrorMess}
                onChange={() =>
                  phoneNumberErrorMess && setPhoneNumberErrorMess('')
                }
                onChangeText={value => setPhoneNumber(value)}
                leftIcon={
                  <Icon name="phone" size={25} color={colors.MAINCOLOR} />
                }
              />
              <Input
                placeholder={'Email'}
                value={email}
                leftIconContainerStyle={{marginRight: 5}}
                errorMessage={emailErrorMess}
                onChange={() => emailErrorMess && setEmailErrorMess('')}
                onChangeText={value => setEmail(value)}
                leftIcon={
                  <Icon name="email" size={25} color={colors.MAINCOLOR} />
                }
              />
              <View style={styles.tuvan.row}>
                <Text style={styles.textH}>2. Nội dung hỗ trợ</Text>
              </View>
              <View style={{alignItems: 'center', marginBottom: 10}}>
                <DropdownList
                  data={listDmnhsp}
                  placeholder="Sản phẩm cần hỗ trợ"
                  value={pickDmnhsp}
                  onChange={item => onPickDmnhsp(item)}
                  style={styles.tuvan.dropdown}
                  containerStyle={styles.tuvan.dropdownCon}></DropdownList>
              </View>
              <View style={{alignItems: 'center', marginBottom: 10}}>
                <DropdownList
                  data={listSp}
                  placeholder="Chọn nội dung"
                  value={pickSp}
                  onChange={item => {
                    setPickSp(item.value);
                    setSpLabel(item.label);
                  }}
                  loading={pickLoading}
                  disable={listDmnhsp ? false : true}
                  style={styles.tuvan.dropdown}
                  loadingStyle={styles.tuvan.dropdown}
                  containerStyle={styles.tuvan.dropdownCon}></DropdownList>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <ButtonIcon
                onPress={() => checkForm('email')}
                loading={emailLoading}
                title={'Yêu cầu hỗ trợ'}
                icon="email"
                iconSize={25}></ButtonIcon>
            </View>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <ButtonIcon
                onPress={() => checkForm('chat')}
                loading={chatLoading}
                title={'Chat trực tiếp'}
                icon="chat"
                iconSize={25}></ButtonIcon>
            </View>
          </Animated.ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Tuvanthue;
