import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, TouchableOpacity} from 'react-native';
import SearchInput from './SearchInput';
import styles from '../themes/styles';
import colors from '../themes/colors';
import React from 'react';

const Header = ({
  tg = true,
  onPressLeft,
  onPressRight,
  iconSize = 30,
  leftIcon = 'arrow-left',
  colorLeft = tg ? colors.MAINCOLOR : colors.SECONDCOLOR,
  title,
  rightIcon = 'arrow-left',
  disableRight = true,
  colorRight = disableRight ? colors.WHITE : colorLeft,
  searchBar = false,
  keyword,
  onChangeText,
  titleStyle = styles.title,
  duration = 0,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPressLeft}>
        <Icon name={leftIcon} size={iconSize} color={colorLeft}></Icon>
      </TouchableOpacity>
      {searchBar ? (
        <SearchInput
          keyword={keyword}
          duration={duration}
          onChangeText={onChangeText}
          style={{width: 300, height: 40, backgroundColor: colors.WHITE}}
          rightIcon={false}></SearchInput>
      ) : (
        <Text style={titleStyle}>{title}</Text>
      )}
      <TouchableOpacity onPress={onPressRight} disabled={disableRight}>
        <Icon name={rightIcon} size={iconSize} color={colorRight}></Icon>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
