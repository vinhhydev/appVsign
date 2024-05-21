import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Text, SafeAreaView, Alert} from 'react-native';
import wsStrings from '../../../shared/wsStrings';
import React, {useState, useEffect} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
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

const Tracuuthongtinnghiavu = () => {
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
    } else {
      setTracuuLoading(true);
      tracuu();
      const type = 'success';
      const title = 'Vui lòng đợi trong giây lát...';
      showAlert(type, title);
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
      const key = 'tdt_tcttnv' + pickMst;
      await AsyncStorage.setItem(key, data);
      await AsyncStorage.setItem('tdt_tcttnv_pickMst', pickMst);
      await AsyncStorage.setItem('pass_tdt_tcttnv', pass_tdt);
      await AsyncStorage.setItem('dataSize', newDataSize.toString());
    } catch (error) {
      Alert.alert(
        'Thông báo',
        'Xảy ra lỗi khi lưu trạng thái\n' + 'Lỗi: ' + error.message,
      );
    }
  };

  const getStoredData = async () => {
    const pickMst = await AsyncStorage.getItem('tdt_tcttnv_pickMst');
    if (pickMst) {
      const pass_tdt = await AsyncStorage.getItem('pass_tdt_tcttnv');
      const key = 'tdt_tcttnv' + pickMst;
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
      const key = 'tdt_tcttnv' + pickMst;
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
      .post(ehdUrl + wsStrings.TRACUUTTNV, {
        token: '@acc2k',
        mst: pickMst,
        pwd: decode(pass_tdt),
        ql: 'true',
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          const isError = res[0].coquanthu.includes('Error');
          if (isError) {
            Alert.alert('Lỗi', res[0].coquanthu);
          } else {
            setData(res);
            storeData(response.data.d);
          }
        } else {
          Alert.alert('Thông báo', 'Không có dữ liệu');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi tra cứu\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        setTracuuLoading(false);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.ehd.itemWrapper}>
          <Text style={styles.textH}>{item.tieumuc}</Text>
          <Text style={styles.text}>
            Cơ quan thu: <Text style={styles.textH}>{item.coquanthu}</Text>
          </Text>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>
              Chương: <Text style={styles.textH}>{item.chuong}</Text>
            </Text>
            <Text style={styles.text}>
              Loại tiền: <Text style={styles.textH}>{item.loaitien}</Text>
            </Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Phải nộp: </Text>
            <Text style={styles.highlight}>{item.phainop}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Truy thu/Xử phạt:</Text>
            <Text style={styles.textWarn}>{item.noittxp}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Đã nộp:</Text>
            <Text style={styles.textH}>{item.danop}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Còn phải nộp:</Text>
            <Text style={styles.textH}>{item.conphainop}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Nộp thừa/Tạm nộp:</Text>
            <Text style={styles.textH}>{item.nopthuatamnop}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Miễn giảm:</Text>
            <Text style={styles.textH}>{item.miengiam}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Hoàn nộp thừa:</Text>
            <Text style={styles.textH}>{item.hoannopthua}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Hoàn khấu trừ:</Text>
            <Text style={styles.textH}>{item.hoankhautru}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Đã hoàn:</Text>
            <Text style={styles.textH}>{item.dahoan}</Text>
          </View>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.text}>Còn được hoàn:</Text>
            <Text style={styles.textH}>{item.conduochoan}</Text>
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
        title={'Tra cứu thông tin nghĩa vụ'}
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

export default Tracuuthongtinnghiavu;
