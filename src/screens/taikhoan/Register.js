import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert,
  ScrollView,
} from 'react-native';
import navigationStrings from '../../../shared/navigationStrings';
import IconS from 'react-native-vector-icons/SimpleLineIcons';
import {showAlert} from '../../components/notifications/showAlert';
import {useNavigation} from '@react-navigation/native';
import IconF from 'react-native-vector-icons/Feather';
import IconE from 'react-native-vector-icons/Entypo';
import wsStrings from '../../../shared/wsStrings';
import {ehdUrl} from '../../../shared/url';
import {Button, Input} from '@rneui/base';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import React, {useState} from 'react';
import {encode} from 'base-64';
import axios from 'axios';

const Register = () => {
  const navigation = useNavigation();
  const [name, setName] = useState();
  const [pwd, setPwd] = useState();
  const [repwd, setRepwd] = useState();
  const [email, setEmail] = useState();
  const [sdt, setSdt] = useState();
  const [errorMessageName, setErrorMessageName] = useState('');
  const [errorMessagePhone, setErrorMessagePhone] = useState('');
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorMessagePwd, setErrorMessagePwd] = useState('');
  const [pwdVisible, setPwdVisible] = useState(true);

  const checkForm = () => {
    if (!name) {
      setErrorMessageName('Vui lòng điền đầy đủ họ tên');
    } else if (!sdt) {
      setErrorMessagePhone('Vui lòng nhập số điện thoại');
    } else if (!email) {
      setErrorMessageEmail('Vui lòng nhập email');
    } else if (!pwd) {
      setErrorMessagePwd('Vui lòng nhập mật khẩu');
    } else if (!repwd) {
      setErrorMessagePwd('Vui lòng nhập mật khẩu');
    } else if (pwd != repwd) {
      setErrorMessagePwd('Mật khẩu không trùng khớp');
    } else {
      register();
    }
  };

  const onChangeSdt = value => {
    if (/^\d*$/.test(value)) {
      setSdt(value);
    } else {
      setSdt('');
      showAlert('error', 'Lỗi!', 'Vui lòng nhập số nguyên');
    }
  };

  const directNavigate = () => {
    navigation.navigate(navigationStrings.LOGIN, {
      userName: sdt,
      pwd: pwd,
      register: 'C',
    });
  };

  const register = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_REGISTER, {
        tel: sdt,
        hoten: name,
        email: email,
        pwd: encode(pwd),
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          showAlert('success', 'Tạo tài khoản thành công');
          directNavigate();
        } else {
          showAlert('error', 'Lỗi!', res.Status);
        }
      })
      .catch(error => {
        Alert.alert('Lỗi: ', error.message);
      });
  };

  const resetErrorMesName = () => errorMessageName && setErrorMessageName('');

  const resetErrorMesPhone = () =>
    errorMessagePhone && setErrorMessagePhone('');

  const resetErrorMesEmail = () =>
    errorMessageEmail && setErrorMessageEmail('');

  const resetErrorMesPwd = () => errorMessagePwd && setErrorMessagePwd('');

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior="position">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.register.image}>
            <IconS name="user-follow" size={155} color={colors.MAINCOLOR} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.register.body}>
            <Input
              value={name}
              style={{fontSize: 20}}
              onChange={() => resetErrorMesName()}
              onChangeText={value => setName(value)}
              placeholder="Nhập họ và tên"
              autoCorrect={false}
              spellCheck={false}
              errorMessage={errorMessageName}
              leftIcon={
                <IconF name="user" size={25} color={colors.MAINCOLOR} />
              }
            />
            <Input
              value={sdt}
              style={{fontSize: 20}}
              onChange={() => resetErrorMesPhone()}
              onChangeText={value => onChangeSdt(value)}
              placeholder="Nhập số điện thoại"
              autoCorrect={false}
              spellCheck={false}
              errorMessage={errorMessagePhone}
              keyboardType="number-pad"
              maxLength={11}
              leftIcon={
                <IconF name="phone" size={25} color={colors.MAINCOLOR} />
              }
            />
            <Input
              value={email}
              style={{fontSize: 20}}
              onChange={() => resetErrorMesEmail()}
              onChangeText={value => setEmail(value)}
              placeholder="Nhập địa chỉ Email"
              autoCorrect={false}
              spellCheck={false}
              errorMessage={errorMessageEmail}
              leftIcon={
                <IconF name="mail" size={25} color={colors.MAINCOLOR} />
              }
            />
            <Input
              value={pwd}
              style={{fontSize: 20}}
              onChange={() => resetErrorMesPwd()}
              onChangeText={value => setPwd(value)}
              placeholder="Nhập mật khẩu"
              autoCorrect={false}
              spellCheck={false}
              errorMessage={errorMessagePwd}
              secureTextEntry={pwdVisible}
              leftIcon={
                <IconS name="lock" size={25} color={colors.MAINCOLOR} />
              }
              rightIcon={
                <TouchableOpacity onPress={() => setPwdVisible(!pwdVisible)}>
                  <IconE
                    name={pwdVisible ? 'eye' : 'eye-with-line'}
                    size={30}
                    color={colors.MAINCOLOR}
                  />
                </TouchableOpacity>
              }
            />
            <Input
              value={repwd}
              style={{fontSize: 20}}
              onChange={() => resetErrorMesPwd()}
              onChangeText={value => setRepwd(value)}
              placeholder="Xác nhận lại mật khẩu"
              autoCorrect={false}
              spellCheck={false}
              errorMessage={errorMessagePwd}
              secureTextEntry={pwdVisible}
              leftIcon={
                <IconF name="check-square" size={25} color={colors.MAINCOLOR} />
              }
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.register.footer}>
          <View style={styles.register.button}>
            <Button
              onPress={() => checkForm()}
              title={'Đăng ký'}
              color={colors.MAINCOLOR}
              titleStyle={{fontSize: 21, fontWeight: 'bold'}}
              buttonStyle={{borderRadius: 30, height: 45}}
            />
          </View>
          <View style={styles.register.button}>
            <Button
              onPress={() => navigation.navigate(navigationStrings.LOGIN)}
              title={'Đăng nhập'}
              color={colors.WHITE}
              titleStyle={{
                fontSize: 21,
                fontWeight: 'bold',
                color: colors.MAINCOLOR,
              }}
              buttonStyle={{
                borderRadius: 30,
                height: 45,
                borderColor: colors.MAINCOLOR,
                borderWidth: 2,
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default Register;
