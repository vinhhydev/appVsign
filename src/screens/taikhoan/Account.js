import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import navigationStrings from '../../../shared/navigationStrings';
import IconUser from 'react-native-vector-icons/FontAwesome';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../../navigation/DataContext';
import wsStrings from '../../../shared/wsStrings';
import React, {useEffect, useState} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import {Input} from '@rneui/themed';
import {encode} from 'base-64';
import axios from 'axios';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import LoadingComponent from '../../components/LoadingComponent';
import {CustomModal} from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';

const Taikhoan = () => {
  const navigation = useNavigation();
  const {userData} = useData();
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [dataSize, setDataSize] = useState('');
  const [inputConfirm, setInputConfirm] = useState('');
  const [pwdModal, setPwdModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pwdErrorMessage1, setPwdErrorMessage1] = useState();
  const [pwdErrorMessage2, setPwdErrorMessage2] = useState();
  const [pwdErrorMessage3, setPwdErrorMessage3] = useState();
  const [confirmErrorMessage, setConfirmErrorMessage] = useState();
  const [pwdVisible, setPwdVisible] = useState(true);

  useEffect(() => {
    getDataSize();
  }, []);

  const onPressDoiMk = () => {
    oldPwd && setOldPwd('');
    newPwd && setNewPwd('');
    newPwd2 && setNewPwd2('');
    setPwdModal(true);
  };

  const onPressXoaTk = () => {
    inputConfirm && setInputConfirm('');
    setDeleteModal(true);
  };

  const onPressDangxuat = () => {
    Alert.alert('Thông báo', 'Bạn có thật sự muốn đăng xuất?', [
      {text: 'Có', onPress: () => navigateLogin()},
      {text: 'Không'},
    ]);
  };

  const submitChangePwd = () => {
    if (oldPwd == '' && newPwd == '' && newPwd2 == '') {
      setPwdErrorMessage1('Vui lòng điền đầy đủ thông tin');
      setPwdErrorMessage2('Vui lòng điền đầy đủ thông tin');
    } else if (oldPwd == '') {
      setPwdErrorMessage1('Vui lòng điền đầy đủ thông tin');
    } else if (newPwd == '') {
      setPwdErrorMessage2('Vui lòng điền đầy đủ thông tin');
    } else if (newPwd2 == '') {
      setPwdErrorMessage3('Vui lòng điền đầy đủ thông tin');
    } else if (newPwd != newPwd2) {
      setPwdErrorMessage2('Mật khẩu không trùng khớp');
      setPwdErrorMessage3('Mật khẩu không trùng khớp');
    } else {
      setLoading(true);
      changePwd();
    }
  };

  const submitDelete = () => {
    if (inputConfirm === 'OK') {
      setLoading(true);
      deleteAccount();
    } else {
      setConfirmErrorMessage('Sai từ khoá');
      setInputConfirm('');
    }
  };

  const handleResetErrorOldPwd = () =>
    pwdErrorMessage1 && setPwdErrorMessage1('');

  const handleResetErrorNewPwd = () =>
    pwdErrorMessage2 && setPwdErrorMessage2('');

  const handleResetErrorReNewPwd = () =>
    pwdErrorMessage3 && setPwdErrorMessage3('');

  const handlResetErrorInputConfirm = () =>
    confirmErrorMessage && setConfirmErrorMessage('');

  const handleWipeData = () => {
    Alert.alert(
      'Lưu ý',
      'Bạn có chắc muốn xoá dữ liệu trên thiết bị? \n Lưu ý khi xoá thì mọi thông tin bao gồm tài khoản, mật khẩu đã lưu, thông tin tra cứu sẽ bị mất buộc phải tra cứu lại.',
      [
        {text: 'Xoá', style: 'destructive', onPress: () => wipeData()},
        {text: 'Không'},
      ],
    );
  };

  const getDataSize = async () => {
    const data = await AsyncStorage.getItem('dataSize');
    const transferData = data / (1024 * 1024);
    const roundedData = Math.round(transferData * 1000) / 1000;
    setDataSize(roundedData);
    setIsLoading(false);
  };

  const wipeData = async () => {
    try {
      await AsyncStorage.clear();
      navigateLogin();
    } catch (error) {
      //
    }
  };

  const deleteAccount = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_DELETEACCOUNT, {
        username: userData.userName,
        password: userData.pwd,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          navigateLogin();
        } else {
          showAlert('error', 'Lỗi!', res.Status);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi xoá tài khoản!\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        setLoading(false);
        setDeleteModal(false);
      });
  };

  const changePwd = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_CHANGEPWD, {
        username: userData.userName,
        oldpass: encode(oldPwd),
        newpass: encode(newPwd),
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          showAlert('info', 'Vui lòng đăng nhập lại để tiếp tục');
          navigateLogin();
        } else {
          showAlert('error', 'Lỗi!', res.Status);
          handleResetErrorOldPwd();
          handleResetErrorNewPwd();
          handleResetErrorReNewPwd();
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi trong quá trình đổi mật khẩu!\n' + error.message,
        );
      })
      .finally(() => {
        setLoading(false);
        setPwdModal(false);
      });
  };

  const navigateLogin = () => {
    navigation.push(navigationStrings.LOGIN, {type: 'logout'});
  };

  const renderFormChangePwd = () => {
    return (
      <View style={styles.dmcty.calendar}>
        <Text style={styles.textH}>Thay đổi mật khẩu</Text>
        <View style={styles.dmcty.input}>
          <Input
            label={'Mật khẩu cũ'}
            placeholder="Mật khẩu hiện tại của bạn"
            secureTextEntry={pwdVisible}
            value={oldPwd}
            errorMessage={pwdErrorMessage1}
            onChange={() => handleResetErrorOldPwd()}
            onChangeText={value => setOldPwd(value)}
            rightIcon={
              <TouchableOpacity onPress={() => setPwdVisible(!pwdVisible)}>
                <Icon
                  name={pwdVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={30}
                />
              </TouchableOpacity>
            }
          />
          <Input
            label={'Mật khẩu mới'}
            placeholder="Nhập mật khẩu mà bạn muốn đổi"
            secureTextEntry={pwdVisible}
            value={newPwd}
            errorMessage={pwdErrorMessage2}
            onChange={() => handleResetErrorNewPwd()}
            onChangeText={value => setNewPwd(value)}
          />
          <Input
            label={'Xác nhận mật khẩu'}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry={pwdVisible}
            value={newPwd2}
            errorMessage={pwdErrorMessage3}
            onChange={() => handleResetErrorReNewPwd()}
            onChangeText={value => setNewPwd2(value)}
          />
        </View>
        <View style={styles.dmcty.buttonCon}>
          <CustomButton
            title={'OK'}
            onPress={() => submitChangePwd()}
            loading={loading}></CustomButton>
        </View>
      </View>
    );
  };

  const renderFormDeleteAccount = () => {
    return (
      <View style={styles.dmcty.calendar}>
        <Text style={styles.textH}>Xác nhận xoá tài khoản</Text>
        <View style={styles.dmcty.input}>
          <Input
            label={"Bấm 'OK' để xác nhận xoá tài khoản"}
            placeholder="Xác nhận xoá tài khoản"
            value={inputConfirm}
            errorMessage={confirmErrorMessage}
            onChange={() => handlResetErrorInputConfirm()}
            onChangeText={value => setInputConfirm(value)}
          />
        </View>
        <View style={styles.dmcty.buttonCon}>
          <CustomButton
            title={'Xoá'}
            onPress={() => submitDelete()}
            loading={loading}
            color={colors.RED}></CustomButton>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={'Thông tin tài khoản'}
        disableRight={false}
        onPressRight={() => handleWipeData()}
        rightIcon="archive-remove-outline"></Header>
      {isLoading ? (
        <LoadingComponent size={0.93}></LoadingComponent>
      ) : (
        <ScrollView style={styles.body}>
          <Animated.View
            entering={FadeIn.duration(1000)}
            style={{alignItems: 'center'}}>
            <IconUser name="user-circle" size={245} color={colors.MAINCOLOR} />
            <View style={{padding: 30}}>
              <View style={styles.taikhoan.infoRow}>
                <View style={styles.taikhoan.leftCol}>
                  <Text style={styles.taikhoan.text}>Tên tài khoản: </Text>
                </View>
                <View style={styles.taikhoan.rightCol}>
                  <Text style={styles.taikhoan.text}>{userData.userName}</Text>
                </View>
              </View>
              <View style={styles.taikhoan.infoRow}>
                <View style={styles.taikhoan.leftCol}>
                  <Text style={styles.taikhoan.text}>Mật khẩu: </Text>
                </View>
                <View style={styles.taikhoan.rightCol}>
                  <TouchableOpacity onPress={() => onPressDoiMk()}>
                    <Text style={styles.taikhoan.hyperlink}>Đổi mật khẩu</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.taikhoan.infoRow}>
                <View style={styles.taikhoan.leftCol}>
                  <Text style={styles.taikhoan.text}>Người dùng: </Text>
                </View>
                <View style={styles.taikhoan.rightCol}>
                  <Text style={styles.taikhoan.text}>{userData.fullName}</Text>
                </View>
              </View>
              <View style={styles.taikhoan.infoRow}>
                <View style={styles.taikhoan.leftCol}>
                  <Text style={styles.taikhoan.text}>Địa chỉ: </Text>
                </View>
                <View style={styles.taikhoan.rightCol}>
                  <Text style={styles.taikhoan.text}>
                    {userData.address || 'Không có thông tin'}
                  </Text>
                </View>
              </View>
              <View style={styles.taikhoan.infoRow}>
                <View style={styles.taikhoan.leftCol}>
                  <Text style={styles.taikhoan.text}>Email: </Text>
                </View>
                <View style={styles.taikhoan.rightCol}>
                  <Text style={styles.taikhoan.text}>
                    {userData.email || 'Không có thông tin'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.taikhoan.buttonCon}>
              <CustomButton
                onPress={() => onPressXoaTk()}
                title={'Xoá tài khoản'}
                color={colors.RED}
                buttonStyle={{
                  borderRadius: 30,
                  width: 160,
                }}></CustomButton>
              <CustomButton
                onPress={() => onPressDangxuat()}
                title={'Đăng xuất'}
                color={colors.WHITE}
                titleStyle={{fontWeight: 'bold', color: 'red'}}
                buttonStyle={{
                  borderRadius: 30,
                  borderColor: 'red',
                  borderWidth: 2,
                  width: 160,
                }}></CustomButton>
            </View>
            <Text>{'\n'}</Text>
            <View style={styles.taikhoan.buttonCon}>
              <CustomButton
                onPress={() => handleWipeData()}
                title={'Xoá dữ liệu lưu trên máy'}
                buttonStyle={{borderRadius: 30, width: 280}}></CustomButton>
            </View>
          </Animated.View>
        </ScrollView>
      )}
      {/* Modal đổi mk */}
      <CustomModal
        visible={pwdModal}
        onPressOutSide={() => setPwdModal(!pwdModal)}
        renderContent={() => renderFormChangePwd()}
      />
      {/* Modal xoá tk */}
      <CustomModal
        visible={deleteModal}
        onPressOutSide={() => setDeleteModal(!deleteModal)}
        renderContent={() => renderFormDeleteAccount()}
      />
      <View style={{position: 'absolute', bottom: 30, right: 25}}>
        <Text>{dataSize} MB / 6 MB</Text>
      </View>
    </SafeAreaView>
  );
};

export default Taikhoan;
