import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import imagesPath from '../../../shared/imagesPath';
import colors from '../../themes/colors';
import {Image, Input} from '@rneui/base';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {showAlert} from '../../components/notifications/showAlert';
import {useAppDispatch, useAppSelector} from '../../redux/hook';
import {
  getDataCty,
  loginAcc2k,
  selectData,
} from '../../redux/slices/acc2kSlice';
import {RootState} from '../../redux/store';
import navigationStrings from '../../../shared/navigationStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CustomModal} from '../../components/CustomModal';
import DropdownList from '../../components/DropdownList';
import {IDropdownList} from '../../type/IAcc2k';

const {width, height} = Dimensions.get('screen');
const LoginAcc2k = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorData, setErrorData] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [pickData, setPickData] = useState('');
  const [listDataCty, setListDataCty] = useState<IDropdownList[]>([
    {label: '', value: ''},
  ]);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const acc2kState = useAppSelector((state: RootState) => state.acc2kSlice);

  useEffect(() => {
    getAccount();
    getData();
    if (acc2kState.dataCty.length <= 0) {
      const type = 'info';
      const text = 'Vui lòng đăng nhập tài khoản Acc2k';
      showAlert(type, text);
    }
  }, []);

  const getData = async () => {
    // lấy userName để gọi hàm getData
    const userName = await AsyncStorage.getItem('userName');
    if (userName !== null) {
      dispatch(getDataCty({userName})).then(async res => {
        const data = res.payload as [];
        if (data !== null && data.length > 0) {
          const listTemp: IDropdownList[] = [];
          data.forEach((x: any) => {
            listTemp.push({
              label: x.data.substring(8),
              value: x.data,
            });
          });
          setListDataCty(listTemp);
        } else {
          showAlert('error', 'Thông tin đăng nhập không đúng');
        }
      });
    }
  };

  const getAccount = async () => {
    const getAccount = await AsyncStorage.getItem('ACC2K');
    if (getAccount !== null) {
      const parseJson = JSON.parse(getAccount);
      setPhoneNumber(parseJson.phoneNumber);
      setPassword(parseJson.password);
    }
  };

  const handleLogin = async () => {
    if (phoneNumber === '' && phoneNumber.length <= 0) {
      setErrorPhone('Vui lòng nhập số điện thoại');
    } else if (password === '' && password.length <= 0) {
      setErrorPassword('Vui lòng nhập mật khẩu');
    } else if (pickData === '' && pickData.length <= 0) {
      setErrorData('Vui lòng chọn data');
    } else {
      setErrorPhone('');
      setErrorPassword('');
      setErrorData('');
      const data = acc2kState.selectData.data as string;
      dispatch(loginAcc2k({phoneNumber, password, data}));
      const accountAcc2k = {
        phoneNumber,
        password,
      };
      await AsyncStorage.setItem('ACC2K', JSON.stringify(accountAcc2k));
      navigation.navigate({name: navigationStrings.ACC2k} as never);
    }
  };

  const onChangeDropdown = (x: any) => {
    setErrorData('');
    setPickData(x.value);
    dispatch(selectData(acc2kState.dataCty[x._index]));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
      <Header
        title={'Acc2k'}
        onPressLeft={() => navigation.goBack()}
        onPressRight={undefined}
        keyword={undefined}
        onChangeText={undefined}
        style={styles.header}
      />
      <KeyboardAvoidingView style={{paddingTop: 30}}>
        <Image
          source={imagesPath.FAVORITES}
          style={styles.logoAcc2k}
          resizeMode="contain"
        />
        <View>
          <Input
            value={phoneNumber}
            style={{fontSize: 20}}
            onChangeText={value => setPhoneNumber(value)}
            onChange={e =>
              e.nativeEvent.text.length > 0
                ? setErrorPhone('')
                : setErrorPhone('Vui lòng nhập số điện thoại')
            }
            autoCorrect={false}
            spellCheck={false}
            label="Số điện thoại"
            labelStyle={{color: 'black'}}
            placeholder="Nhập số điện thoại"
            leftIcon={<Icon2 name="phone" size={25} color={colors.MAINCOLOR} />}
            errorMessage={errorPhone}
            keyboardType="number-pad"
          />
        </View>
        <View>
          <Input
            value={password}
            style={{fontSize: 20}}
            onChangeText={value => setPassword(value)}
            onChange={e =>
              e.nativeEvent.text.length > 0
                ? setErrorPassword('')
                : setErrorPassword('Vui lòng nhập mật khẩu')
            }
            label="Mật khẩu"
            labelStyle={{color: 'black'}}
            placeholder="Nhập mật khẩu"
            autoCorrect={false}
            spellCheck={false}
            secureTextEntry={hidePassword}
            errorMessage={errorPassword}
            leftIcon={<Icon2 name="lock" size={25} color={colors.MAINCOLOR} />}
            rightIcon={
              <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                <Icon
                  name={!hidePassword ? 'eye' : 'eye-off'}
                  size={30}
                  color={colors.MAINCOLOR}
                />
              </TouchableOpacity>
            }
          />
        </View>
        <View style={styles.selectView}>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
            Data
          </Text>
          <DropdownList
            data={listDataCty}
            value={pickData}
            placeholder={'Chọn data'}
            onChange={(x: any) => {
              onChangeDropdown(x);
            }}
            style={styles.dropdownList}
          />
          <Text style={{color: colors.RED}}>{errorData}</Text>
        </View>
        <TouchableOpacity
          style={styles.touchLogin}
          disabled={acc2kState.isLoading}
          onPress={() => handleLogin()}>
          {acc2kState.isLoadingLogin ? (
            <ActivityIndicator size={20} color={colors.WHITE} />
          ) : (
            <Text style={styles.textLogin}>Đăng nhập</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginAcc2k;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  logoAcc2k: {
    width: width,
    height: height * 0.16,
  },
  nameAcc2k: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.Acc2k,
    alignSelf: 'center',
    textAlign: 'center',
  },
  touchLogin: {
    backgroundColor: colors.MAINCOLOR,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 10,
    width: 120,
    borderRadius: 8,
  },
  textLogin: {
    fontWeight: '700',
    color: colors.WHITE,
    fontSize: 16,
  },
  selectView: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dropdownList: {
    borderWidth: 0.5,
    borderRadius: 8,
  },
});
