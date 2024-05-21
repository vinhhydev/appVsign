import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {BounceInDown} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native';
import styles from '../themes/styles';
import colors from '../themes/colors';
import {Button} from '@rneui/base';
import React from 'react';

export const ButtonIcon = ({
  tg = true,
  color = tg ? colors.MAINCOLOR : colors.SECONDCOLOR,
  title,
  onPress,
  iconRight = true,
  loading = false,
  disabled = false,
  icon = 'file-document-outline',
  iconColor = colors.WHITE,
  iconSize = 30,
  buttonStyle = {borderRadius: 30, width: 220, height: 45},
}) => {
  return (
    <Button
      onPress={onPress}
      title={title}
      color={color}
      iconRight={iconRight}
      loading={loading}
      disabled={disabled}
      icon={<Icon name={icon} size={iconSize} color={iconColor} />}
      titleStyle={[styles.textH, {marginRight: 7}]}
      buttonStyle={buttonStyle}
    />
  );
};

export const ScrollButton = ({
  onPress,
  style = {position: 'absolute', right: 15, bottom: 30},
  buttonStyle = {borderRadius: 360},
  icon = 'arrow-collapse-up',
  iconSize = 30,
  iconColor = colors.WHITE,
  tg = true,
}) => {
  return (
    <Animated.View entering={BounceInDown.duration(1000)} style={style}>
      <Button
        onPress={onPress}
        icon={<Icon name={icon} size={iconSize} color={iconColor}></Icon>}
        buttonStyle={buttonStyle}
        color={tg ? colors.MAINCOLOR : colors.SECONDCOLOR}></Button>
    </Animated.View>
  );
};

export const DeleteButton = ({
  onPress,
  style = styles.dshoadon.deleteButton,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Icon name="trash-can-outline" size={45} color={colors.WHITE} />
    </TouchableOpacity>
  );
};

const CustomButton = ({
  onPress,
  title,
  loading,
  titleStyle = {color: colors.WHITE},
  buttonStyle = {borderRadius: 30, minWidth: 100},
  tg = true,
  color = tg ? colors.MAINCOLOR : colors.SECONDCOLOR,
}) => {
  return (
    <Button
      onPress={onPress}
      loading={loading}
      title={title}
      titleStyle={titleStyle}
      color={color}
      buttonStyle={buttonStyle}></Button>
  );
};

export default CustomButton;
