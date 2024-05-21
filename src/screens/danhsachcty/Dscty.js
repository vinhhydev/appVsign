import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Text, SafeAreaView, Alert} from 'react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useData} from '../../navigation/DataContext';
import wsStrings from '../../../shared/wsStrings';
import React, {useState, useEffect} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import {Divider} from '@rneui/base';
import {encode} from 'base-64';
import axios from 'axios';
// Components
import {ButtonIcon, DeleteButton} from '../../components/CustomButton';
import {showAlert} from '../../components/notifications/showAlert';
import LoadingComponent from '../../components/LoadingComponent';
import ReloadComponent from '../../components/ReloadComponent';
import {EmailModal} from '../../components/CustomModal';
import Header from '../../components/Header';

const Dscty = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {userData} = useData();
  const [data, setData] = useState([]);
  const [email, setEmail] = useState();
  const [pwd, setPwd] = useState();
  const [mst, setMst] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(true);

  useEffect(() => {
    getMst();
  }, [route]);

  const themNavigation = () => {
    navigation.navigate(navigationStrings.DSCTY0, {
      title: 'Thêm mã số thuế',
      userName: userData.userName,
      pwd: userData.pwd,
    });
  };

  const editNavigation = item => {
    navigation.navigate(navigationStrings.DSCTY0, {
      title: 'Cập nhật thông tin',
      userName: userData.userName,
      pwd: userData.pwd,
      item: item,
    });
  };

  const onPressThem = item => {
    setEmailModal(true);
    setMst(item.mst);
  };

  const handleDeleteLocal = item => {
    const newData = data.filter(i => i.mst !== item.mst);
    setData(newData);
    deleteStoredData(item);
  };

  const deleteStoredData = async item => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const keysToDelete = allKeys.filter(key => key.startsWith(item.mst));
      await AsyncStorage.multiRemove(keysToDelete);
    } catch (error) {
      //
    }
  };

  const getMst = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_GETMST, {
        username: userData.userName,
        password: userData.pwd,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res) {
          setData(res);
        }
      })
      .catch(error => {
        showAlert('error', 'Lỗi trong quá trình lấy MST', error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const xoamst = async item => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_DELETEMST, {
        username: userData.userName,
        password: userData.pwd,
        mst: item.mst,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          handleDeleteLocal(item);
        } else {
          showAlert('error', res.Status);
        }
      })
      .catch(error => {
        Alert.alert('Thông báo', 'Xảy ra lỗi khi xoá mst\n' + error.message);
      });
  };

  const thememail = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_ADDEMAIL, {
        username: userData.userName,
        password: userData.pwd,
        mst: mst,
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
        Alert.alert('Thông báo', 'Lỗi: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}) => {
    const renderRightActions = () => {
      return <DeleteButton onPress={() => xoamst(item)} />;
    };
    return (
      <GestureHandlerRootView>
        <Swipeable renderRightActions={() => renderRightActions()}>
          <View style={styles.dscty.itemWrapper}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.textH}>{item.mst}</Text>
              {item.tinhtrang == 'C' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.textH}>Đang hoạt động </Text>
                  <Icon
                    name="checkbox-blank-circle"
                    size={25}
                    color={colors.GREEN}
                  />
                </View>
              ) : item.tinhtrang == 'K' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.textH}>Không hoạt động </Text>
                  <Icon
                    name="checkbox-blank-circle"
                    size={25}
                    color={colors.OFF}
                  />
                </View>
              ) : item.tinhtrang == 'N' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.textH}>Ngưng </Text>
                  <Icon
                    name="checkbox-blank-circle"
                    size={25}
                    color={colors.WARN}
                  />
                </View>
              ) : item.tinhtrang == 'S' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.textH}>Sai password </Text>
                  <Icon name="alert-circle" size={25} color={colors.RED} />
                </View>
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.textH}>Cần đổi password </Text>
                  <Icon name="alert-circle" size={25} color={colors.WARN} />
                </View>
              )}
            </View>
            {item.ten_cty && <Text style={styles.textH}>{item.ten_cty}</Text>}
            <View style={styles.dscty.lhCon}>
              {item.loaihinh == 'TM' ? (
                <Text style={styles.textH}>Thương Mại</Text>
              ) : item.loaihinh == 'DV' ? (
                <Text style={styles.textH}>Dịch vụ</Text>
              ) : item.loaihinh == 'SX' ? (
                <Text style={styles.textH}>Sản xuất</Text>
              ) : (
                <Text style={styles.textH}>Xây dựng</Text>
              )}
              <View style={styles.dscty.buttonCon}>
                <ButtonIcon
                  onPress={() => editNavigation(item)}
                  icon="circle-edit-outline"
                  iconSize={25}
                  buttonStyle={styles.dscty.button}></ButtonIcon>
                <ButtonIcon
                  onPress={() => onPressThem(item)}
                  icon="email"
                  iconSize={25}
                  buttonStyle={styles.dscty.button}></ButtonIcon>
              </View>
            </View>
          </View>
          <Divider width={1.5}></Divider>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={'Danh sách công ty'}
        disableRight={false}
        rightIcon="plus"
        onPressRight={() => themNavigation()}></Header>
      <View style={styles.body}>
        {isLoading ? (
          <LoadingComponent size={0.8}></LoadingComponent>
        ) : (
          <View>
            {data.length == 0 ? (
              <ReloadComponent
                size={0.8}
                title={
                  'Không có công ty liên kết với tài khoản'
                }></ReloadComponent>
            ) : (
              <Animated.FlatList
                entering={FadeInDown.duration(1000)}
                data={data}
                extraData={data}
                renderItem={({item}) => renderItem({item})}
                keyExtractor={item => item.index}
                refreshing={isLoading}
                onRefresh={() => {
                  setIsLoading(true);
                  getMst();
                }}
              />
            )}
          </View>
        )}
        {/* Modal thêm email */}
        <EmailModal
          visible={emailModal}
          onPressOutSide={() => setEmailModal(!emailModal)}
          tk={email}
          onChangeTextTK={value => setEmail(value)}
          mk={pwd}
          secureTextEntry={pwdVisible}
          onPressIcon={() => setPwdVisible(!pwdVisible)}
          onChangeTextMK={value => setPwd(value)}
          onPressSubmit={() => {
            setLoading(true);
            thememail();
          }}
          onPressHyperlink={() => setEmailModal(false)}
          buttonLoading={loading}></EmailModal>
      </View>
    </SafeAreaView>
  );
};

export default Dscty;
