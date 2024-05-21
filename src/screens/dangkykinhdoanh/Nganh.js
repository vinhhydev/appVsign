import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Text, SafeAreaView, Alert} from 'react-native';
import wsStrings from '../../../shared/wsStrings';
import React, {useEffect, useState} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import {Divider} from '@rneui/base';
import axios from 'axios';
// Components
import LoadingComponent from '../../components/LoadingComponent';
import ReloadComponent from '../../components/ReloadComponent';
import Header from '../../components/Header';

const Nganh = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNganh();
  }, []);

  const getNganh = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_NGANHDKKD, {
        token: '@acc2k',
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
      })
      .then(response => {
        if (response.data.d.length > 2) {
          const res = JSON.parse(response.data.d);
          setData(res);
        } else {
          Alert.alert('Thông báo', 'Không có dữ liệu từ server');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi tra cứu thông tin\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.ehd.itemWrapper}>
          <Text style={item.loai == 'C' ? styles.highlight : styles.textH}>
            {item.ten_nganh}
          </Text>
          <Text style={styles.text}>Mã ngành: {item.ma_nganh}</Text>
        </View>
        <Divider width={1.5}></Divider>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={'Ngành nghề kinh doanh'}
      />
      {loading ? (
        <LoadingComponent size={0.8}></LoadingComponent>
      ) : (
        <Animated.View entering={FadeIn.duration(1000)} style={styles.body}>
          {data ? (
            <Animated.FlatList
              entering={FadeIn.duration(1000)}
              exiting={FadeOut.duration(1000)}
              data={data}
              renderItem={({item}) => renderItem({item})}
              keyExtractor={item => item.ma_nganh}
              windowSize={10}
            />
          ) : (
            <ReloadComponent
              size={0.9}
              title={'Không có dữ liệu'}></ReloadComponent>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default Nganh;
