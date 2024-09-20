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
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../../navigation/DataContext';
import React, {useState, useEffect} from 'react';
import {getMst} from '../../utils/getMst';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import Header from '../../components/Header';
import {useAppDispatch} from '../../redux/hook';

const Thuedientu = () => {
  const navigation = useNavigation();
  const {userData} = useData();
  const [listMst, setListMst] = useState();
  const [khaithueOption, setKhaithueOption] = useState(false);
  const [nopthueOption, setNopthueOption] = useState(false);
  const [tracuuOption, setTracuuOption] = useState(false);
  const [qltkOption, setQltkOption] = useState(false);

  useEffect(() => {
    getListMst();
  }, []);

  const getListMst = async () => {
    try {
      // Hàm gọi ws lấy listMST
      const listMst = await getMst(userData.userName, userData.pwd, 'tdt');
      setListMst(listMst);
    } catch (error) {
      showAlert('error', 'Lỗi!', error.message);
    }
  };

  const handleNavigate = type => {
    const navigateData = {
      listMst: listMst,
      userName: userData.userName,
      pwd: userData.pwd,
    };
    if (listMst) {
      switch (type) {
        case 'TCTK':
          navigation.navigate(navigationStrings.TCTOKHAI, navigateData);
          break;
        case 'TCTB':
          navigation.navigate(navigationStrings.TCTHONGBAO, navigateData);
          break;
        case 'TCNVKK':
          navigation.navigate(navigationStrings.TCNVKK, navigateData);
          break;
        case 'TCGNT':
          navigation.navigate(navigationStrings.TCGIAYNOPTIEN, navigateData);
          break;
        case 'TCTBCQT':
          navigation.navigate(navigationStrings.TCTBCQT, navigateData);
          break;
        case 'TCTTNV':
          navigation.navigate(navigationStrings.TCTTNV, navigateData);
          break;
        case 'TCDKT':
          navigation.navigate(navigationStrings.DKT, navigateData);
          break;
        case 'TTCKS':
          navigation.navigate(navigationStrings.CKS, navigateData);
          break;
      }
    } else {
      showAlert('error', 'Thông báo', 'Vui lòng thêm MST trong mục DS Công ty');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => navigation.goBack()} title={'Thuế điện tử'} />
      <ScrollView style={styles.info.body}>
        <View style={styles.info.content}>
          <TouchableOpacity onPress={() => setKhaithueOption(!khaithueOption)}>
            <Animated.View
              entering={FadeInLeft.duration(1000)}
              style={styles.tdt.row}>
              <Text style={styles.info.text}>1. Khai thuế</Text>
              <Icon
                name={khaithueOption ? 'chevron-down' : 'chevron-left'}
                size={30}
                color={colors.MAINCOLOR}></Icon>
            </Animated.View>
          </TouchableOpacity>
          {khaithueOption && (
            <Animated.View entering={FadeInUp}>
              <TouchableOpacity onPress={() => handleNavigate('TCTK')}>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>Tra cứu tờ khai</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigate('TCTB')}>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>Tra cứu thông báo</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigate('TCNVKK')}>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>Tra cứu nghĩa vụ kê khai</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          <TouchableOpacity onPress={() => setNopthueOption(!nopthueOption)}>
            <Animated.View
              entering={FadeInRight.duration(1000)}
              style={styles.tdt.row}>
              <Text style={styles.info.text}>2. Nộp thuế</Text>
              <Icon
                name={nopthueOption ? 'chevron-down' : 'chevron-left'}
                size={30}
                color={colors.MAINCOLOR}></Icon>
            </Animated.View>
          </TouchableOpacity>
          {nopthueOption && (
            <Animated.View entering={FadeInUp}>
              <TouchableOpacity onPress={() => handleNavigate('TCGNT')}>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>Tra cứu giấy nộp tiền</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          <TouchableOpacity onPress={() => setTracuuOption(!tracuuOption)}>
            <Animated.View
              entering={FadeInLeft.duration(1000)}
              style={styles.tdt.row}>
              <Text style={styles.info.text}>3. Tra cứu</Text>
              <Icon
                name={tracuuOption ? 'chevron-down' : 'chevron-left'}
                size={30}
                color={colors.MAINCOLOR}></Icon>
            </Animated.View>
          </TouchableOpacity>
          {tracuuOption && (
            <Animated.View entering={FadeInUp}>
              <TouchableOpacity onPress={() => handleNavigate('TCTBCQT')}>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>
                    Tra cứu thông báo cơ quan thuế
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigate('TCTTNV')}>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>
                    Tra cứu thông tin nghĩa vụ
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNavigate('TCDKT')}>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>Tra cứu ĐKT</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          <TouchableOpacity onPress={() => setQltkOption(!qltkOption)}>
            <Animated.View
              entering={FadeInRight.duration(1000)}
              style={styles.tdt.row}>
              <Text style={styles.info.text}>4. Quản lý tài khoản</Text>
              <Icon
                name={qltkOption ? 'chevron-down' : 'chevron-left'}
                size={30}
                color={colors.MAINCOLOR}></Icon>
            </Animated.View>
          </TouchableOpacity>
          {qltkOption && (
            <Animated.View entering={FadeInUp}>
              <TouchableOpacity onPress={() => handleNavigate('TTCKS')}>
                <View style={styles.tdt.subrow}>
                  <Text style={styles.tdt.text}>
                    Thay đổi thông tin dịch vụ
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Thuedientu;
