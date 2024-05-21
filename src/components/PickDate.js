import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../themes/styles';
import moment from 'moment-timezone';
import React from 'react';

const PickDate = ({
  type = '1',
  date,
  onPressDate,
  startDate,
  endDate,
  onPressStartDate,
  onPressEndDate,
  iconSize = 35,
  color = type === '1' ? '#0A68FE' : '#F9A726',
}) => {
  return type == '1' ? (
    <View style={styles.dmcty.row}>
      <Text style={styles.textH}>Ngày: </Text>
      <Text style={styles.text}>
        {' '}
        {moment(date).format('DD/MM/YYYY') || ''}
      </Text>
      <TouchableOpacity onPress={onPressDate}>
        <Icon name="calendar" size={iconSize} color={color}></Icon>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={{flexDirection: 'row'}}>
      <View style={styles.tdt.rowDay}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Text style={styles.text}>Từ ngày:</Text>
          <TouchableOpacity onPress={onPressStartDate}>
            <Icon name="calendar" size={iconSize} color={color}></Icon>
          </TouchableOpacity>
        </View>
        <Text style={styles.textH}>
          {moment(startDate).format('DD/MM/YYYY')}
        </Text>
      </View>
      <View style={styles.tdt.rowDay}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <Text style={styles.text}>Đến ngày:</Text>
          <TouchableOpacity onPress={onPressEndDate}>
            <Icon name="calendar" size={iconSize} color={color}></Icon>
          </TouchableOpacity>
        </View>
        <Text style={styles.textH}>{moment(endDate).format('DD/MM/YYYY')}</Text>
      </View>
    </View>
  );
};

export default PickDate;
