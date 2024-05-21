import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation, useRoute} from '@react-navigation/native';
import wsStrings from '../../../shared/wsStrings';
import React, {useState, useEffect} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import {Divider} from '@rneui/base';
import axios from 'axios';
// Components
import ReloadComponent from '../../components/ReloadComponent';
import LoadingScreen from '../../components/LoadingScreen';
import Header from '../../components/Header';
//

const Tracuutokhai0 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    formatData();
  }, []);

  // Chuyển dữ liệu về dạng array object
  const formatData = () => {
    const data = route.params.data;
    const newData = [];
    data.forEach(item => {
      const object = JSON.parse(item);
      newData.push(object);
    });
    setData(newData);
    setLoading(false);
  };

  const onPressView = item => {
    setViewLoading(true);
    getUrl(item);
  };

  const openPdf = url => {
    navigation.navigate(navigationStrings.WEBSCREEN, {
      tg: route.params.tg,
      url: url,
      title: 'Chi tiết thông báo',
    });
  };

  const getUrl = async item => {
    await axios
      .post(ehdUrl + wsStrings.ITAXVIEWER, {
        mst: route.params.mst,
        ma: item.Matb,
        loai: 'TKTB',
      })
      .then(response => {
        if (response.data.d) {
          const url = response.data.d;
          const newUrl = 'https://' + url;
          openPdf(newUrl);
        } else {
          Alert.alert('Thông báo', 'Server không có phản hồi');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi lấy thông tin tờ khai\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        setViewLoading(false);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.ehd.itemWrapper}>
          <View style={styles.ehd.itemRow}>
            <Text style={styles.textH}>{item.Ngaytb}</Text>
            <TouchableOpacity
              onPress={() => onPressView(item)}
              style={styles.ehd.button}>
              <Icon
                name="eye-outline"
                size={35}
                color={
                  route.params.tg ? colors.MAINCOLOR : colors.SECONDCOLOR
                }></Icon>
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>Số TB: {item.Sotb}</Text>
          <Text style={styles.text}>Nội dung:</Text>
          <Text
            style={{
              fontSize: 19,
              fontWeight: '700',
              color: route.params.tg ? colors.MAINCOLOR : colors.SECONDCOLOR,
            }}>
            {item.Tieude}
          </Text>
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
        title={'Thông báo'}
      />
      {loading ? (
        <View
          style={{
            height: '80%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'}></ActivityIndicator>
        </View>
      ) : data ? (
        <Animated.View
          style={styles.body}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}>
          <FlatList
            data={data}
            renderItem={({item}) => renderItem({item})}
            keyExtractor={item => item.index}
            windowSize={10}
          />
        </Animated.View>
      ) : (
        <ReloadComponent
          size={0.9}
          title={'Không có thông báo'}></ReloadComponent>
      )}
      {viewLoading && <LoadingScreen></LoadingScreen>}
    </SafeAreaView>
  );
};

export default Tracuutokhai0;
