import {View, Text, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation, useRoute} from '@react-navigation/native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import wsStrings from '../../../shared/wsStrings';
import React, {useState, useEffect} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import {Divider} from '@rneui/base';
import axios from 'axios';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import LoadingComponent from '../../components/LoadingComponent';
import Header from '../../components/Header';
import colors from '../../themes/colors';

const Hoadon0 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getChitiethoadon();
  }, [route.params]);

  // const HanghoaNavigation = () => {
  //   navigation.navigate(navigationStrings.PRODUCTS, {
  //     userName: route.params.userName,
  //     pwd: route.params.pwd,
  //     mst: route.params.mst,
  //     id: route.params.id,
  //     tg: route.params.tg,
  //     them: 'C',
  //   });
  // };

  const onPressMh = item => {
    navigation.navigate(navigationStrings.PRODUCTS, {
      userName: route.params.userName,
      pwd: route.params.pwd,
      mst: route.params.mst,
      id: route.params.id,
      tg: route.params.tg,
      id0: item.Id0,
    });
  };

  const onRefreshList = () => {
    setIsLoading(true);
    getChitiethoadon();
  };

  const getChitiethoadon = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_DETAILINVOICE, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        id: route.params.id,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res) {
          setData(res);
        } else {
          const type = 'error';
          const title = 'Không thể lấy dữ liệu ' + res.Status;
          showAlert(type, title);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi trong quá trình lấy dữ liệu\n' + error.message,
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.hoadon0.itemWrapper}>
          <Text style={styles.textH}>{item.THHDVu}</Text>
          <View style={styles.hoadon0.row}>
            <Text style={styles.text}>ĐVT: {item.DVTinh || 'Không có'}</Text>
            <TouchableOpacity onPress={() => onPressMh(item)}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                  color:
                    route.params.tg == true
                      ? colors.MAINCOLOR
                      : colors.SECONDCOLOR,
                }}>
                {item.Mhhdvu || 'Chọn'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.hoadon0.row}>
            <Text style={styles.text}>TS: {item.TSuat}</Text>
            <Text style={styles.text}>SL: {item.SLuong}</Text>
          </View>
          <View style={styles.hoadon0.row}>
            <Text style={styles.text}>
              Thuế: {new Intl.NumberFormat('vi-VN').format(item.Thue)}
            </Text>
            <Text style={styles.text}>
              Đơn giá: {new Intl.NumberFormat('vi-VN').format(item.DGia)}
            </Text>
          </View>
          <View style={styles.hoadon0.row}>
            <Text>{''}</Text>
            <Text style={styles.textH}>
              Thành tiền: {new Intl.NumberFormat('vi-VN').format(item.ThTien)}
            </Text>
          </View>
        </View>
        <Divider width={1.5}></Divider>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        tg={route.params.tg}
        onPressLeft={() => navigation.goBack()}
        title={'Chi tiết hàng hoá'}
      />
      <View style={styles.body}>
        {isLoading ? (
          <LoadingComponent size={0.85}></LoadingComponent>
        ) : (
          <Animated.FlatList
            entering={FadeInDown.duration(1000)}
            data={data}
            renderItem={({item}) => renderItem({item})}
            keyExtractor={item => item.id}
            refreshing={isLoading}
            onRefresh={() => onRefreshList()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Hoadon0;
