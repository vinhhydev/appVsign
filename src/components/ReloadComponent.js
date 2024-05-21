import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Text, TouchableOpacity, Dimensions} from 'react-native';
import styles from '../themes/styles';
import React from 'react';

const {height, width} = Dimensions.get('screen');

const ReloadComponent = ({
  tg = true,
  size = 1,
  title,
  reload = false,
  disabled = false,
  onPress,
  color = tg ? '#0A68FE' : '#F9A726',
  icon = 'reload',
}) => {
  return (
    <Animated.View
      entering={FadeIn.duration(1000)}
      exiting={FadeOut.duration(1000)}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: height * size,
      }}>
      <Text style={styles.textH}>{title}</Text>
      {reload && (
        <TouchableOpacity disabled={disabled} onPress={onPress}>
          <Icon name={icon} size={30} color={color} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default ReloadComponent;
