import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import colors from '../themes/colors';
import {Input} from '@rneui/themed';
import React from 'react';

const SearchInput = ({
  tg = true,
  keyword,
  onChangeText,
  onChange,
  style = {height: 55},
  duration = 1000,
  color = tg ? colors.MAINCOLOR : colors.SECONDCOLOR,
  rightIcon = <Icon name="magnify" size={35} color={color}></Icon>,
}) => {
  return (
    <Animated.View
      entering={FadeInUp.duration(duration)}
      exiting={FadeOutUp.duration(duration)}
      style={style}>
      <Input
        placeholder="Tìm kiếm"
        value={keyword}
        style={{paddingHorizontal: 10}}
        onChangeText={onChangeText}
        onChange={onChange}
        rightIcon={rightIcon}
      />
    </Animated.View>
  );
};

export default SearchInput;
