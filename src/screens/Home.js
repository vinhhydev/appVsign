import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {showAlert} from '../components/notifications/showAlert';
import navigationStrings from '../../shared/navigationStrings';
import IconUser from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../navigation/DataContext';
import imagesPath from '../../shared/imagesPath';
import Banner from '../components/Banner';
import React, {useEffect} from 'react';
import styles from '../themes/styles';
import colors from '../themes/colors';
import {Image} from '@rneui/base';

const Home = () => {
  const navigation = useNavigation();
  const {userData} = useData();

  const images = [imagesPath.EBH_BN, imagesPath.EHD_BN, imagesPath.LOGO_VH];

  useEffect(() => {
    showAlert(
      'info',
      'Xin chào ' + userData.fullName + ' !',
      'Tài khoản: ' + userData.userName,
    );
    checkStorageSize();
  });

  const checkStorageSize = async () => {
    try {
      const dataSize = await AsyncStorage.getItem('dataSize');
      if (dataSize > 6000000) {
        await AsyncStorage.clear();
        navigation.push(navigationStrings.LOGIN);
      }
    } catch (error) {
      //
    }
  };

  return (
    <ImageBackground
      style={styles.home.container}
      imageStyle={{resizeMode: 'stretch'}}
      blurRadius={10}
      source={imagesPath.BG}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationStrings.ACCOUNT)}>
            <IconUser name="user-circle" size={35} color={colors.MAINCOLOR} />
          </TouchableOpacity>
          <Text style={styles.home.logo}>Vsign</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationStrings.INFO)}>
            <Icon
              name={'information-variant'}
              size={35}
              color={colors.MAINCOLOR}></Icon>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {/* <View style={styles.home.bannerCon}>
            <Banner data={images} />
          </View> */}
          <Animated.View
            entering={FadeInUp.duration(1000)}
            style={styles.home.titleField}>
            <View style={styles.home.titleCon}>
              <Text style={styles.home.title}>Dịch vụ</Text>
            </View>
            <View style={styles.home.content}>
              <View style={styles.home.itemCon}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(navigationStrings.DMCTY)}>
                  <View style={styles.home.item}>
                    <Image style={styles.home.image} source={imagesPath.VAT} />
                    <Text style={styles.home.text}>Tính thuế VAT</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.home.itemCon}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(navigationStrings.DSCTY)}>
                  <View style={styles.home.item}>
                    <Image
                      style={styles.home.image}
                      source={imagesPath.DSCTY}
                    />
                    <Text style={styles.home.text}>Danh sách Cty</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.home.itemCon}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationStrings.KTRUIRO)
                  }>
                  <View style={styles.home.item}>
                    <Image
                      style={styles.home.image}
                      source={imagesPath.KTRUIRO}
                    />
                    <Text style={styles.home.text}>Kiểm tra rủi ro</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.home.itemCon}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(navigationStrings.TVT)}>
                  <View style={styles.home.item}>
                    <Image style={styles.home.image} source={imagesPath.TVT} />
                    <Text style={styles.home.text}>Tư vấn thuế</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.home.itemCon}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(navigationStrings.EHD)}>
                  <View style={styles.home.item}>
                    <Image style={styles.home.image} source={imagesPath.EHD} />
                    <Text style={styles.home.text}>
                      Hoá đơn điện tử Vĩnh Hy
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.home.itemCon}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(navigationStrings.EKS)}>
                  <View style={styles.home.item}>
                    <Image style={styles.home.image} source={imagesPath.EKS} />
                    <Text style={styles.home.text}>
                      Hợp đồng điện tử Vĩnh Hy
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000)}
            style={styles.home.titleField}>
            <View style={styles.home.titleCon}>
              <Text style={styles.home.title}>Dịch vụ công</Text>
            </View>
            <View style={styles.home.content}>
              <View style={styles.home.itemCon}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(navigationStrings.TDT)}>
                  <View style={styles.home.item}>
                    <Image style={styles.home.image} source={imagesPath.TDT} />
                    <Text style={styles.home.text}>Thuế điện tử</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.home.itemCon}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(navigationStrings.DKKD)}>
                  <View style={styles.home.item}>
                    <Image style={styles.home.image} source={imagesPath.DKKD} />
                    <Text style={styles.home.text}>Đăng ký kinh doanh</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.home.itemCon}>
                <TouchableOpacity
                  onPress={() => navigation.navigate(navigationStrings.BHXH)}>
                  <View style={styles.home.item}>
                    <Image style={styles.home.image} source={imagesPath.BHXH} />
                    <Text style={styles.home.text}>Bảo hiểm xã hội</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Home;
