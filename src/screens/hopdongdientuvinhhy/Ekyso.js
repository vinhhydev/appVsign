import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../../navigation/DataContext';
import React, {useEffect, useState} from 'react';
import {getMst} from '../../utils/getMst';
import styles from '../../themes/styles';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import Header from '../../components/Header';
import navigationStrings from '../../../shared/navigationStrings';
import colors from '../../themes/colors';

const Ekyso = () => {
  const navigation = useNavigation();
  const {userData} = useData();
  const [listMst, setListMst] = useState();
  const [banOption, setBanOption] = useState(false);
  const [muaOption, setMuaOption] = useState(false);

  useEffect(() => {
    getListMst();
  }, []);

  const getListMst = async () => {
    const listMst = await getMst(userData.userName, userData.pwd);
    setListMst(listMst);
  };

  const Ekyso0Navigation = (loaihd, tinhtrang, title) => {
    if (listMst) {
      navigation.navigate(navigationStrings.EKYSO, {
        userName: userData.userName,
        pwd: userData.pwd,
        listMst: listMst,
        title: title,
        loaihd: loaihd,
        tinhtrang: tinhtrang,
      });
    } else {
      const type = 'error';
      const title = 'Thông báo';
      const text = 'Vui lòng thêm MST trong mục DS Công ty';
      showAlert(type, title, text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={'Hợp đồng điện tử'}
      />
      <ScrollView>
        <View style={styles.info.content}>
          <TouchableOpacity onPress={() => setBanOption(!banOption)}>
            <Animated.View
              entering={FadeInLeft.duration(1000)}
              style={styles.tdt.row}>
              <Text style={styles.info.text}>1. Hợp đồng bán</Text>
              <Icon
                name={banOption ? 'chevron-down' : 'chevron-left'}
                size={30}
                color={colors.MAINCOLOR}></Icon>
            </Animated.View>
          </TouchableOpacity>
          {banOption && (
            <Animated.View entering={FadeInUp}>
              <TouchableOpacity
                onPress={() =>
                  Ekyso0Navigation(
                    'hopdongbanchuakychinh',
                    'M',
                    'Hợp đồng bán chưa ký',
                  )
                }>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>Chưa ký chính</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Ekyso0Navigation(
                    'hopdongbandakychinh',
                    'X',
                    'Hợp đồng bán đã ký',
                  )
                }>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>Đã ký chính</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          <TouchableOpacity onPress={() => setMuaOption(!muaOption)}>
            <Animated.View
              entering={FadeInRight.duration(1000)}
              style={styles.tdt.row}>
              <Text style={styles.info.text}>2. Hợp đồng mua</Text>
              <Icon
                name={muaOption ? 'chevron-down' : 'chevron-left'}
                size={30}
                color={colors.MAINCOLOR}></Icon>
            </Animated.View>
          </TouchableOpacity>
          {muaOption && (
            <Animated.View entering={FadeInUp}>
              <TouchableOpacity
                onPress={() =>
                  Ekyso0Navigation(
                    'hopdongmuadakychinh',
                    'X',
                    'Hợp đồng mua đã ký',
                  )
                }>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>Đã ký chính</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Ekyso;
