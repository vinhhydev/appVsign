import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ehd, youtubeUrl, zaloUrl} from '../../../shared/url';
import IconA from 'react-native-vector-icons/AntDesign';
import imagesPath from '../../../shared/imagesPath';
import {promoText} from '../../../shared/appPromo';
import Header from '../../components/Header';
import copyText from '../../utils/copyText';
import colors from '../../themes/colors';
import styles from '../../themes/styles';
import {Image} from '@rneui/base';
import React from 'react';

const Info0 = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const onPressHotline = () => {
    Linking.openURL('tel:19007105');
  };

  const openLink = (url, title) => {
    Alert.alert('Thông báo', 'Bạn có muốn mở đường liên kết?', [
      {
        text: 'Có',
        onPress: () => openWebscreen(url, title),
      },
      {text: 'Không'},
    ]);
  };

  const openWebscreen = (url, title) => {
    navigation.navigate(navigationStrings.WEBSCREEN, {
      tg: true,
      url: url,
      title: title,
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header
          onPressLeft={() => navigation.goBack()}
          title={route.params.title}
        />
        {/* Giới thiệu Screen */}
        {route.params.giatri == 'GT' && (
          <ScrollView style={styles.info.body}>
            <View style={styles.info.content}>
              <Text style={[styles.highlight, {fontSize: 40}]}>Vsign</Text>
              <View style={{paddingLeft: 20, paddingRight: 10}}>
                <Text style={styles.text}>{promoText}</Text>
                <Text style={styles.highlight}>
                  {'   '}Vsign không chỉ là một công cụ mà còn là một đối tác
                  đáng tin cậy, hỗ trợ doanh nghiệp nâng cao hiệu suất làm việc
                  và giảm bớt rủi ro trong quản lý tài chính.{'\n\n\n'}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
        {/* Liên hệ Screen */}
        {route.params.giatri == 'LH' && (
          <View style={styles.body}>
            <View style={styles.lh.row}>
              <TouchableOpacity onPress={() => onPressHotline()}>
                <View style={styles.lh.contentRow}>
                  <IconA
                    name="customerservice"
                    size={30}
                    color={colors.MAINCOLOR}
                  />
                  <Text style={styles.info.text}> CSKH: 1900 7105</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.lh.row}>
              <TouchableOpacity
                onPress={() => copyText('info@ehoadondientu.com')}>
                <View style={styles.lh.contentRow}>
                  <Icon
                    name="email-fast-outline"
                    size={30}
                    color={colors.MAINCOLOR}
                  />
                  <Text style={[styles.textU, {fontSize: 23}]}>
                    {' '}
                    info@ehoadondientu.com
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.lh.row}>
              <TouchableOpacity onPress={() => openLink(ehd, 'Đường liên kết')}>
                <View style={styles.lh.contentRow}>
                  <Icon name="web" size={30} color={colors.MAINCOLOR} />
                  <Text style={[styles.textU, {fontSize: 23}]}> Trang Web</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.lh.row}>
              <View style={styles.lh.contentRow}>
                <TouchableOpacity
                  onPress={() => openLink(youtubeUrl, 'Youtube')}>
                  <View style={styles.lh.row}>
                    <Icon name="youtube" size={30} color={colors.RED} />
                    <Text style={styles.info.text}>Vĩnh Hy Tech</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openLink(zaloUrl, 'Zalo')}>
                  <View style={styles.lh.row}>
                    <Image
                      style={{height: 30, width: 30, resizeMode: 'contain'}}
                      source={imagesPath.ZALO}></Image>
                    <Text style={styles.info.text}> Zalo</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.lh.row, {marginTop: 20}]}>
              <Text style={styles.info.text}>Văn phòng</Text>
              <View style={styles.lh.contentRow}>
                <Text style={styles.textH}>
                  Số 82 đường 76, P10, Q6, TPHCM.
                </Text>
              </View>
            </View>
            <View style={styles.lh.row}>
              <Text style={styles.info.text}>Chi nhánh</Text>
              <View style={styles.lh.contentRow}>
                <Text style={[styles.textH, {textAlign: 'center'}]}>
                  Tầng 6, Tòa nhà Sannam, 78 Duy Tân, P. Dịch Vọng Hậu, Cầu
                  Giấy, Hà Nội.
                </Text>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default Info0;
