import {
  Dimensions,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {storeAndroid, storeIOS} from '../../shared/url';
import {Image} from '@rneui/base';
import * as React from 'react';

const Banner = ({data}) => {
  const {height, width} = Dimensions.get('screen');
  const [autoPlay, setAutoPlay] = React.useState(true);

  const onUserPress = index => {
    setAutoPlay(false);
    var appname = index == 0 ? 'ebanhang' : 'Vé Vĩnh Hy';
    const text = 'Bạn có muốn truy cập vào ' + appname + ' ?';
    Alert.alert('Thông báo', text, [
      {text: 'Có', onPress: () => navigateStore(index)},
      {text: 'Không', onPress: () => setAutoPlay(true)},
    ]);
  };

  const navigateStore = index => {
    if (Platform.OS === 'ios') {
      Linking.openURL(storeIOS[index]);
    } else if (Platform.OS === 'android') {
      Linking.openURL(storeAndroid[index]);
    }
    setAutoPlay(true);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Carousel
        loop
        width={width}
        height={height * 0.25}
        autoPlay={autoPlay}
        data={data}
        mode="parallax"
        parallaxScrollingScale={0.9}
        parallaxScrollingOffset={0}
        scrollAnimationDuration={3000}
        renderItem={({index}) => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => onUserPress(index)}
              disabled={index != 2 ? false : true}>
              <Image style={styles.home.banner} source={data[index]} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Banner;
