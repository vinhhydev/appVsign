import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../themes/colors';
import Video from 'react-native-video';

const FullImage = ({route, navigation}: any) => {
  const {url, type} = route?.params;
  const [showLoading, setShowLoading] = useState(true);

  return (
    <View style={styles.container}>
      {type === 'image' ? (
        <FastImage
          source={{uri: url}}
          style={styles.imageFullScreen}
          resizeMode="contain"
          onLoadEnd={() => {
            setShowLoading(false);
          }}
        />
      ) : (
        <Video
          source={{uri: url}}
          style={styles.imageFullScreen}
          resizeMode="contain"
          onLoadStart={() => {
            setShowLoading(false);
          }}
        />
      )}
      {showLoading && <ActivityIndicator style={styles.loading} size={30} />}

      <TouchableOpacity
        style={styles.touchClose}
        onPress={() => navigation.goBack()}>
        <Icon name="close" size={25} color={colors.BLACK} />
      </TouchableOpacity>
    </View>
  );
};

export default FullImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  imageFullScreen: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    right: '50%',
  },
  touchClose: {
    position: 'absolute',
    top: 15,
    left: 15,
    padding: 10,
    backgroundColor: colors.GRAY,
    borderRadius: 30,
  },
});
