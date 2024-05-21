import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import navigationStrings from '../../../shared/navigationStrings';
import {formatTaxcode} from '../../utils/formatTaxcode';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../../navigation/DataContext';
import wsStrings from '../../../shared/wsStrings';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import React, {useState} from 'react';
import axios from 'axios';
// Components
import CustomButton, {ButtonIcon} from '../../components/CustomButton';
import {showAlert} from '../../components/notifications/showAlert';
import Header from '../../components/Header';

const Ktruiro = () => {
  const navigation = useNavigation();
  const {userData} = useData();
  const [mst, setMst] = useState('');
  const [data, setData] = useState('');
  const [dataNganh, setDataNganh] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [xemLoading, setXemLoading] = useState(false);

  const onPressSearch = () => {
    if (mst.length == 10 || mst.length == 14) {
      Keyboard.dismiss();
      setIsLoading(true);
      getThongtin();
    } else if (mst.length > 10 || mst.length < 14) {
      showAlert('error', 'MST không hợp lệ');
    } else if (!mst) {
      showAlert('error', 'Vui lòng điền MST vào ô tra cứu');
    }
  };

  const onPressXemthem = () => {
    navigation.navigate(navigationStrings.BUSINESS, {
      userName: userData.userName,
      pwd: userData.pwd,
      mst: mst,
    });
  };

  const openPdf = url => {
    navigation.navigate(navigationStrings.WEBSCREEN, {
      tg: true,
      url: url,
      title: 'Giấy rủ ro',
    });
  };

  const getThongtin = async () => {
    await axios
      .post(ehdUrl + wsStrings.GETCOMPANYINFO, {
        mst: mst,
        token: 'acc2k',
      })
      .then(response => {
        const res = response.data.d;
        const isNull = res.includes(null);
        if (isNull) {
          showAlert('error', 'Không có dữ liệu');
          setIsLoading(false);
        } else {
          getNganh();
          setData(res);
          if (res[4] == '06') {
            showAlert('error', 'Tình trạng 06');
          }
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi tra cứu dữ liệu\n' + 'Lỗi: ' + error.message,
        );
      });
  };

  const getNganh = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_NGANHDKKD, {
        token: '@acc2k',
        username: userData.userName,
        password: userData.pwd,
        mst: mst,
      })
      .then(response => {
        if (response.data.d.length > 2) {
          const res = JSON.parse(response.data.d);
          const newData = res.filter(i => i.loai == 'C');
          setDataNganh(newData);
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
      .finally(() => {
        setIsLoading(false);
      });
  };

  const xemPdf = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_XEMDKKD, {
        token: '@acc2k',
        username: userData.userName,
        password: userData.pwd,
        mst: mst,
      })
      .then(response => {
        if (response.data.d) {
          const parts = response.data.d.split('\\');
          const index = parts.indexOf('ehoadondientu.com');
          const url = 'https://' + parts.slice(index).join('/');
          const newUrl = url.replace('httpdocs/', '');
          openPdf(newUrl);
        } else {
          Alert.alert('Thông báo', 'Không có thông tin từ server');
        }
      })
      .catch(e => {
        Alert.alert('Thông báo', 'Không thể xem file');
      })
      .finally(() => {
        setXemLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={'Kiểm tra rủi ro'}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.body}>
          <View style={styles.ktruiro.inputCon}>
            <TextInput
              style={styles.ktruiro.input}
              value={mst}
              maxLength={14}
              placeholder="Nhập mã số thuế"
              placeholderTextColor={'black'}
              onChangeText={value => setMst(formatTaxcode(value))}
              keyboardType="number-pad"
              onPressIn={() => mst && setMst('')}
            />
            <CustomButton
              onPress={() => onPressSearch()}
              loading={isLoading}
              title={'Xem'}
              buttonStyle={styles.tdt.buttonR}></CustomButton>
          </View>
          {!data ? (
            <View style={styles.ktruiro.content}>
              <Text
                style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
                Không có dữ liệu
              </Text>
            </View>
          ) : (
            <Animated.View
              entering={FadeInDown.duration(1000)}
              exiting={FadeOutDown.duration(1000)}
              style={styles.ktruiro.content}>
              <Text
                style={{
                  color: 'gray',
                  position: 'absolute',
                  alignSelf: 'flex-end',
                  right: 20,
                  fontWeight: 'bold',
                  fontSize: 13,
                }}>
                CQT(*): Cơ quan thuế
              </Text>
              <View style={styles.ktruiro.contentRow}>
                <View style={styles.ktruiro.leftCol}>
                  <Text style={styles.textH}>Tên: </Text>
                </View>
                <View style={styles.ktruiro.rightCol}>
                  <Text style={styles.textH}>{data[0]}</Text>
                </View>
              </View>
              <View style={styles.ktruiro.contentRow}>
                <View style={styles.ktruiro.leftCol}>
                  <Text style={styles.textH}>Địa chỉ: </Text>
                </View>
                <View style={styles.ktruiro.rightCol}>
                  <Text style={styles.textH}>{data[1]}</Text>
                </View>
              </View>
              <View style={styles.ktruiro.contentRow}>
                <View style={styles.ktruiro.leftCol}>
                  <Text style={styles.textH}>CQT: </Text>
                </View>
                <View style={styles.ktruiro.rightCol}>
                  <Text style={styles.textH}>
                    {data[3]} - {data[2]}
                  </Text>
                </View>
              </View>
              {dataNganh.map(item => (
                <View style={styles.ktruiro.contentRow}>
                  <View style={styles.ktruiro.leftCol}>
                    <Text style={styles.textH}>Ngành: </Text>
                  </View>
                  <View style={styles.ktruiro.rightCol}>
                    <Text style={styles.textH}>
                      {item.ten_nganh} - {item.ma_nganh}
                    </Text>
                    <TouchableOpacity onPress={() => onPressXemthem()}>
                      <Text style={styles.textU}>Xem thêm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={styles.ktruiro.contentRow}>
                <View style={styles.ktruiro.leftCol}>
                  <Text style={styles.textH}>Tình trạng: </Text>
                </View>
                <View style={styles.ktruiro.rightCol}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: data[4] == '00' ? 'black' : 'red',
                    }}>
                    {data[4]}
                    {'\n'}
                    {data[4] == '06' &&
                      'NNT không hoạt động tại địa chỉ đã đăng ký'}
                  </Text>
                </View>
              </View>
              {data[4] == '06' && (
                <ButtonIcon
                  onPress={() => {
                    xemPdf();
                    setXemLoading(true);
                  }}
                  title={'Xem file rủi ro'}
                  color="red"
                  loading={xemLoading}
                  buttonStyle={styles.ktruiro.button}></ButtonIcon>
              )}
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Ktruiro;
