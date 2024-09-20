import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
} from 'react-native';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showAlert} from '../../components/notifications/showAlert';
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation, useRoute} from '@react-navigation/native';
import IconS from 'react-native-vector-icons/SimpleLineIcons';
import {getAccountInfo} from '../../utils/getAccountInfo';
import IconF from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/Feather';
import IconE from 'react-native-vector-icons/Entypo';
import {useData} from '../../navigation/DataContext';
import imagesPath from '../../../shared/imagesPath';
import DeviceInfo from 'react-native-device-info';
import wsStrings from '../../../shared/wsStrings';
import React, {useEffect, useState} from 'react';
import {Button, Image, Input} from '@rneui/base';
import {ehdUrl} from '../../../shared/url';
import colors from '../../themes/colors';
import styles from '../../themes/styles';
import debounce from 'lodash/debounce';
import {encode, decode} from 'base-64';
import axios from 'axios';
import getJSONByAPI from '../../utils/convertXML';

const Login = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userName, setUserName] = useState('');
  const [pwd, setPwd] = useState('');
  const {userData, updateUserData} = useData();
  const [userErrorMessage, setUserErrorMessage] = useState('');
  const [pwdErrorMessage, setPwdErrorMessage] = useState('');
  const [storeAccount, setStoreAccount] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [directLogin, setDirectLogin] = useState(false);
  const version = DeviceInfo.getVersion();

  useEffect(() => {
    getStoredData();
  }, []);

  useEffect(() => {
    if (route.params.register == 'C') {
      setUserName(route.params.userName);
      setPwd(route.params.pwd);
    } else if (route.params.type == 'logout') {
      storeStatus();
    }
  }, [route.params]);

  useEffect(() => {
    if (route.params.type != 'logout' && directLogin == true) {
      onPressLogin();
    }
  }, [directLogin]);

  const registerNavigate = () =>
    navigation.navigate(navigationStrings.REGISTER);

  const homeNavigate = () => {
    navigation.navigate(navigationStrings.HOME);
  };

  const onPressLogin = () => {
    if (!userName && !pwd) {
      setUserErrorMessage('Số điện thoại không được để trống');
      setPwdErrorMessage('Mật khẩu không được để trống');
    } else if (!userName) {
      setUserErrorMessage('Số điện thoại không được để trống');
    } else if (!pwd) {
      setPwdErrorMessage('Mật khẩu không được để trống');
    } else {
      checkLogin();
      setIsLoading(true);
    }
  };

  const resetUserErrorMessage = () =>
    userErrorMessage && setUserErrorMessage('');

  const resetPwdErrorMessage = () => pwdErrorMessage && setPwdErrorMessage('');

  const checkLogin = debounce(async () => {
    await axios
      .post(
        `${ehdUrl}${wsStrings.VSIGN_LOGIN}`,
        {
          username: userName,
          password: encode(pwd),
          version: version,
        },
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .then(response => {
        const res = getJSONByAPI(response.data);

        if (res.Status == 'Ok') {
          handleLogin(res);
        } else if (
          res.Status ==
          'Đăng nhập thất bại.Tên đăng nhập hoặc mật khẩu không đúng.'
        ) {
          showAlert('error', 'Lỗi!', 'Tài khoản, mật khẩu không đúng');
        } else {
          showAlert('error', 'Lỗi', res.Status);
        }
      })
      .catch(error => {
        showAlert('error', 'Lỗi', error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, 800);

  const handleLogin = async () => {
    const userInfo = await getAccountInfo(userName, encode(pwd));
    updateUserData({
      userName: userName,
      pwd: encode(pwd),
      fullName: userInfo[0].companyfullname,
      address: userInfo[0].dia_chi,
      email: userInfo[0].email,
      phone: userInfo[0].tel,
    });
    if (storeAccount == true) {
      storeData();
    } else {
      await AsyncStorage.setItem('store_account', 'false');
      homeNavigate();
    }
  };

  const storeData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('userName');
      if (storedUsername != userName) {
        await AsyncStorage.clear();
      }
      await AsyncStorage.setItem('userName', userName);
      await AsyncStorage.setItem('pwd', encode(pwd));
      await AsyncStorage.setItem('store_account', 'true');
      homeNavigate();
    } catch (e) {
      Alert.alert('Thông báo', 'Không thể lưu password' + e.message);
    }
  };

  const storeStatus = async () => {
    try {
      await AsyncStorage.setItem('store_account', 'false');
    } catch (e) {
      //
    }
  };

  const getStoredData = async () => {
    const sa = await AsyncStorage.getItem('store_account');
    if (sa === 'true') {
      const username = await AsyncStorage.getItem('userName');
      const pwd = await AsyncStorage.getItem('pwd');
      setUserName(username);
      setPwd(decode(pwd));
      setStoreAccount(true);
      setDirectLogin(true);
    } else {
      setStoreAccount(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="position">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            entering={FadeInUp.duration(1000)}
            style={styles.login.imageCon}>
            <Image style={styles.login.image} source={imagesPath.LOGO} />
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            entering={FadeInDown.duration(1000)}
            style={styles.login.body}>
            <View style={{justifyContent: 'space-evenly'}}>
              <Input
                value={userName}
                style={{fontSize: 20}}
                onChangeText={value => setUserName(value)}
                onChange={() => resetUserErrorMessage()}
                autoCorrect={false}
                spellCheck={false}
                label="Số điện thoại"
                labelStyle={{color: 'black'}}
                placeholder="Nhập số điện thoại"
                leftIcon={
                  <Icon name="phone" size={25} color={colors.MAINCOLOR} />
                }
                errorMessage={userErrorMessage}
                keyboardType="number-pad"
              />
            </View>
            <View>
              <Input
                value={pwd}
                style={{fontSize: 20}}
                onChangeText={value => setPwd(value)}
                onChange={() => resetPwdErrorMessage()}
                label="Mật khẩu"
                labelStyle={{color: 'black'}}
                placeholder="Nhập mật khẩu"
                autoCorrect={false}
                spellCheck={false}
                secureTextEntry={pwdVisible}
                errorMessage={pwdErrorMessage}
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
            </View>
            <View style={styles.login.option}>
              <TouchableOpacity onPress={() => setStoreAccount(!storeAccount)}>
                <View style={styles.login.optionLine}>
                  <Text style={styles.text}>Lưu tài khoản & mật khẩu</Text>
                  <IconF
                    name={storeAccount ? 'checkbox-active' : 'checkbox-passive'}
                    size={20}
                    color={colors.MAINCOLOR}
                    style={{paddingLeft: 10}}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => registerNavigate()}>
                <View style={styles.login.optionLine}>
                  <Text style={styles.text}>Đăng ký tài khoản</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View
            entering={FadeInDown.duration(1000)}
            style={styles.login.footer}>
            <View style={styles.login.button}>
              <Button
                onPress={() => onPressLogin()}
                title={'Đăng nhập'}
                color={colors.MAINCOLOR}
                loading={isLoading}
                titleStyle={{fontSize: 21}}
                buttonStyle={{borderRadius: 30, height: 45}}
              />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
