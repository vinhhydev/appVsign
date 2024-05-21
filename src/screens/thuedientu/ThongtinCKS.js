import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Text, SafeAreaView, Alert} from 'react-native';
import wsStrings from '../../../shared/wsStrings';
import React, {useState, useEffect} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import moment from 'moment-timezone';
import {Divider} from '@rneui/base';
import {decode} from 'base-64';
import axios from 'axios';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import ReloadComponent from '../../components/ReloadComponent';
import DropdownList from '../../components/DropdownList';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';
//

const ThongtinCKS = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState([]);
  const [pickMst, setPickMst] = useState();
  const [listMst, setListMst] = useState(route.params.listMst);
  const [pass_tdt, setPass_tdt] = useState();
  const [tracuuLoading, setTracuuLoading] = useState(false);

  useEffect(() => {
    getStoredData();
  }, []);

  // Kiểm tra dữ liệu đã lưu khi người dùng thay đổi giá trị tìm kiếm nếu có thì render
  useEffect(() => {
    checkStoredDataExist();
  }, [pickMst]);

  const onPressTracuu = () => {
    if (!listMst) {
      showAlert(
        'info',
        'Tài khoản của bạn chưa thêm MST',
        'Thêm trong mục Danh sách cty',
      );
    } else if (!pickMst) {
      showAlert('error', 'Vui lòng chọn MST');
    } else if (!pass_tdt) {
      showAlert(
        'error',
        'Thiếu mật khẩu Thuế điện tử',
        'Khai báo trong mục Danh sách cty',
      );
    } else {
      setTracuuLoading(true);
      tracuu();
      showAlert('success', 'Vui lòng đợi trong giây lát...');
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

  const storeData = async data => {
    try {
      const dataSize = await AsyncStorage.getItem('dataSize');
      var sizeof = require('sizeof');
      const newDataSize = sizeof.sizeof(data) + Number(dataSize);
      const key = 'tdt_ttcks' + pickMst;
      await AsyncStorage.setItem(key, data);
      await AsyncStorage.setItem('tdt_ttcks_pickMst', pickMst);
      await AsyncStorage.setItem('pass_tdt_ttcks', pass_tdt);
      await AsyncStorage.setItem('dataSize', newDataSize.toString());
    } catch (error) {
      Alert.alert(
        'Thông báo',
        'Xảy ra lỗi khi lưu trạng thái\n' + 'Lỗi: ' + error.message,
      );
    }
  };

  const getStoredData = async () => {
    const pickMst = await AsyncStorage.getItem('tdt_ttcks_pickMst');
    if (pickMst) {
      const pass_tdt = await AsyncStorage.getItem('pass_tdt_ttcks');
      const key = 'tdt_ttcks' + pickMst;
      const data = await AsyncStorage.getItem(key);
      setPickMst(pickMst);
      setPass_tdt(pass_tdt);
      setData(JSON.parse(data));
    } else {
      if (listMst.length == 1) {
        setPickMst(listMst[0].value);
        setPass_tdt(listMst[0].pass_tdt);
      }
    }
  };

  const checkStoredDataExist = async () => {
    if (pickMst) {
      const key = 'tdt_ttcks' + pickMst;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        setData(JSON.parse(data));
      } else {
        setData([]);
      }
    }
  };

  const tracuu = async () => {
    await axios
      .post(ehdUrl + wsStrings.CKS, {
        token: '@acc2k',
        mst: pickMst,
        pwd: decode(pass_tdt),
        ql: 'true',
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          setData(res);
          storeData(response.data.d);
        } else {
          Alert.alert('Thông báo', 'Không có thông tin');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi tra cứu\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => setTracuuLoading(false));
  };

  const renderItem = ({item}) => {
    const currentDate = moment().tz('Asia/Ho_Chi_Minh');
    const newDate = moment(currentDate).add(7, 'days');
    const endDate = moment(item.denngay, 'DD/MM/YYYY');
    // So sánh ngày cộng thêm 7 ngày với ngày kết thúc
    const isCurrentDateAfterEndDate = newDate.isAfter(endDate);
    return (
      <View>
        <View style={styles.ehd.itemWrapper}>
          <Text style={styles.textH}>Chủ thẻ: {item.chuthects}</Text>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>
              Từ: <Text style={styles.textH}>{item.tungay}</Text>
            </Text>
            <Text style={styles.text}>
              Đến:{' '}
              <Text
                style={
                  isCurrentDateAfterEndDate ? styles.textWarn : styles.textH
                }>
                {item.denngay}
              </Text>
            </Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>SĐT: {item.sdt || 'Không có'}</Text>
            <Text style={styles.text}>Loại: {item.loai}</Text>
          </View>
          <Text style={styles.text}>
            SERI: <Text style={styles.highlight}>{item.serial}</Text>
          </Text>
          <Text style={styles.text}>{item.tcccts}</Text>
          <View style={styles.ehd.itemRow}>
            <Text></Text>
            <Text style={styles.textH}>{item.thutucthue}</Text>
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
        title={'Thông tin dịch vụ'}
      />
      <View style={styles.dmcty.body}>
        <View style={styles.dmcty.content}>
          <View style={styles.tuvan.row}>
            <Text style={styles.textH}>Chọn MST:</Text>
            <DropdownList
              placeholder="Mã số thuế"
              value={pickMst}
              data={listMst}
              onChange={item => onChangeMst(item)}
              style={styles.tdt.dropdownL}
              containerStyle={styles.tdt.containerMst}></DropdownList>
            <CustomButton
              onPress={() => onPressTracuu()}
              loading={tracuuLoading}
              title={'Tra cứu'}
              buttonStyle={styles.tdt.buttonR}></CustomButton>
          </View>
        </View>
        <View style={styles.dmcty.content}>
          <View style={styles.tdt.listnghiavu}>
            <Text style={styles.textH}>Dữ liệu tra cứu:</Text>
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
                size={0.75}
                title={'Không có dữ liệu'}></ReloadComponent>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ThongtinCKS;
