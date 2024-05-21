import {Text, View, TouchableOpacity, SafeAreaView} from 'react-native';
import Animated, {FadeInLeft, FadeInRight} from 'react-native-reanimated';
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import Header from '../../components/Header';
import styles from '../../themes/styles';
import React from 'react';

const Info = () => {
  const navigation = useNavigation();
  const version = DeviceInfo.getVersion();

  const handleNavigateGT = () => {
    navigation.navigate(navigationStrings.INFO0, {
      title: 'Giới thiệu',
      giatri: 'GT',
    });
  };

  const handleNavigateLH = () => {
    navigation.navigate(navigationStrings.INFO0, {
      title: 'Thông tin liên hệ',
      giatri: 'LH',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => navigation.goBack()} title={'Thông tin'} />
      <View style={styles.info.body}>
        <View style={styles.info.content}>
          <TouchableOpacity onPress={() => handleNavigateGT()}>
            <Animated.View
              entering={FadeInRight.duration(1000)}
              style={styles.info.row}>
              <Text style={styles.info.text}>Giới thiệu về Vsign</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigateLH()}>
            <Animated.View
              entering={FadeInLeft.duration(1000)}
              style={styles.info.row}>
              <Text style={styles.info.text}>Thông tin liên hệ</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{position: 'absolute', bottom: 30, right: 25}}>
        <Text>v{version}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Info;
