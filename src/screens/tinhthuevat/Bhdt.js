import {View, Text, SafeAreaView, FlatList, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import wsStrings from '../../../shared/wsStrings';
import React, {useEffect, useState} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import axios from 'axios';
// Components
import LoadingComponent from '../../components/LoadingComponent';
import ReloadComponent from '../../components/ReloadComponent';
import Header from '../../components/Header';

const Bhdt = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const handleRefreshList = () => {
    setIsLoading(true);
    getData();
  };

  const getData = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_BHDT0, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        tu_ngay: route.params.startDate,
        den_ngay: route.params.endDate,
        ma_dt: route.params.ma_dt,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res && res.length > 0) {
          setData(res);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi lấy dữ liệu\n' + error.message,
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.dshoadon.itemWrapper}>
        <Text style={styles.text}>{item.thhdvu}</Text>
        <Text style={{fontSize: 16}}>Người mua: {item.ten_nguoi_mua}</Text>
        <View style={styles.row}>
          <Text style={{fontSize: 16}}>
            Giá: {new Intl.NumberFormat('vi-VN').format(item.dgia)} /{' '}
            {item.dvtinh}
          </Text>
          <Text style={{fontSize: 16}}>
            SL: {new Intl.NumberFormat('vi-VN').format(item.sluong)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            Tổng: {new Intl.NumberFormat('vi-VN').format(item.thtien)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        tg={route.params.tg}
        onPressLeft={() => navigation.goBack()}
        title={'Chi tiết'}
      />
      <View style={styles.dshoadon.body}>
        {isLoading ? (
          <LoadingComponent size={0.9}></LoadingComponent>
        ) : !data ? (
          <ReloadComponent
            size={0.85}
            title={'Không có dữ liệu'}></ReloadComponent>
        ) : (
          <FlatList
            data={data}
            renderItem={({item}) => renderItem({item})}
            keyExtractor={item => item.index}
            refreshing={isLoading}
            onRefresh={() => handleRefreshList()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Bhdt;
