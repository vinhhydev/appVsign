import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Animated, {FadeInRight} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../../navigation/DataContext';
import React, {useEffect, useState} from 'react';
import {getMst} from '../../utils/getMst';
import styles from '../../themes/styles';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import Header from '../../components/Header';

const Bhxh = () => {
  const navigation = useNavigation();
  const {userData} = useData();
  const [listMst, setListMst] = useState();

  useEffect(() => {
    getListMst();
  }, []);

  const getListMst = async () => {
    try {
      const listMst = await getMst(userData.userName, userData.pwd, 'bhxh');
      setListMst(listMst);
    } catch (error) {
      showAlert('error', 'Lỗi! ', error.message);
    }
  };

  const lichsunophosoNavigation = () => {
    if (listMst) {
      navigation.navigate('Lichsunophoso', {
        userName: userData.userName,
        pwd: userData.pwd,
        listMst: listMst,
      });
    } else {
      showAlert('error', 'Thông báo', 'Vui lòng thêm MST trong mục DS Công ty');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => navigation.goBack()} title={'Tra cứu'} />
      <ScrollView style={styles.info.body}>
        <View style={styles.info.content}>
          <TouchableOpacity onPress={() => lichsunophosoNavigation()}>
            <Animated.View
              entering={FadeInRight.duration(1000)}
              style={styles.tdt.row}>
              <Text style={styles.info.text}>Lịch sử nộp hồ sơ BHXH</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Bhxh;
