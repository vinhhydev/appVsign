import {listNam, listQuy} from '../../shared/dropdownData';
import {Dropdown} from 'react-native-element-dropdown';
import {View, ActivityIndicator} from 'react-native';
import styles from '../themes/styles';
import colors from '../themes/colors';
import React from 'react';

const DropdownList = ({
  type = '',
  data = type === 'quy' ? listQuy : type === 'nam' ? listNam : '',
  value = '',
  loading = false,
  placeholder = type === 'quy' ? '-' : type === 'nam' ? '----' : '',
  onChange,
  tg = true,
  style = type === 'quy'
    ? styles.dmcty.dropdownQuy
    : type === 'nam'
    ? styles.dmcty.dropdownNam
    : '',
  containerStyle = type === 'quy'
    ? styles.dmcty.containerQuy
    : type === 'nam'
    ? styles.dmcty.containerNam
    : '',
  loadingStyle = style,
  search = false,
  inputSearchStyle = styles.dropdownSearch,
  maxHeight = 250,
  disable = false,
}) => {
  return (
    <View>
      {loading ? (
        <View style={loadingStyle}>
          <ActivityIndicator style={{alignSelf: 'center'}}></ActivityIndicator>
        </View>
      ) : (
        <Dropdown
          data={data}
          disable={disable}
          placeholder={placeholder}
          maxHeight={maxHeight}
          labelField="label"
          valueField="value"
          value={value}
          onChange={onChange}
          style={style}
          search={search}
          searchPlaceholder="Tìm kiếm"
          inputSearchStyle={inputSearchStyle}
          placeholderStyle={{textAlign: 'center'}}
          selectedTextStyle={{textAlign: 'center'}}
          containerStyle={containerStyle}
          activeColor={colors.GRAY}
          iconColor={tg ? colors.MAINCOLOR : colors.SECONDCOLOR}
        />
      )}
    </View>
  );
};

export default DropdownList;
