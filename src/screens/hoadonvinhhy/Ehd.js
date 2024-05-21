import Animated, {FadeInDown, FadeOutDown} from 'react-native-reanimated';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../../navigation/DataContext';
import wsStrings from '../../../shared/wsStrings';
import React, {useEffect, useState} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import {Divider} from '@rneui/base';
import axios from 'axios';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import LoadingComponent from '../../components/LoadingComponent';
import ReloadComponent from '../../components/ReloadComponent';
import Header from '../../components/Header';

const Ehd = () => {
  const navigation = useNavigation();
  const {userData} = useData();
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMst();
  }, []);

  const ehd1Navigate = item => {
    navigation.navigate(navigationStrings.EHD1, {
      userName: userData.userName,
      pwd: userData.pwd,
      item: item,
      mst: item.mst,
      pass_ehd: item.pass_ehd,
    });
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
          const newData = res.filter(item => item.pass_ehd != '');
          setData(newData);
        }
      })
      .catch(error => {
        const type = 'error';
        const title = 'Không thể lấy thông tin MST';
        const text = error.message;
        showAlert(type, title, text);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => ehd1Navigate(item)}>
        <View style={styles.ehd.itemWrapper}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.textH}>MST: </Text>
            <Text style={styles.highlight}>{item.mst}</Text>
          </View>
          {item.ten_cty && <Text style={styles.textH}>{item.ten_cty}</Text>}
        </View>
        <Divider width={1.5}></Divider>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => navigation.goBack()} title={'Chọn công ty'} />
      <View style={styles.body}>
        {loading ? (
          <LoadingComponent size={0.8}></LoadingComponent>
        ) : (
          <View>
            {!data ? (
              <ReloadComponent
                size={0.8}
                title={
                  'Bạn không có công ty sử dụng dịch vụ'
                }></ReloadComponent>
            ) : (
              <Animated.FlatList
                entering={FadeInDown.duration(1000)}
                exiting={FadeOutDown.duration(1000)}
                data={data}
                renderItem={({item}) => renderItem({item})}
                keyExtractor={item => item.mst}
                refreshing={loading}
                windowSize={20}
                onRefresh={() => {
                  setLoading(true);
                  getMst();
                }}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Ehd;
