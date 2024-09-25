import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {DataForm} from '.';
import colors from '../../../themes/colors';
import moment from 'moment-timezone';

const RenderItem = (item: DataForm) => {
  return (
    <View style={styles.containerItem}>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Ký hiệu mẫu: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.ky_hieu_mau0}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Số Seri: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.so_seri0}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Số ct: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.so_ct0}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Ngày: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>
            {moment(item.ngay_ct0).format('DD/MM/YYYY')}
          </Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Tên người bán: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.ten_dtgtgt}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Mã số thuế: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.ma_dtgtgt}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Mặt hàng: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.ma_vt}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Mã ctrình: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.ma_ctrinh}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Doanh số: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.doanh_so}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Ts: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.thue_gtgt}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Thuế: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.tien3}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Kiểm tra: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.kiemtra}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Tổng tiền: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.ttien}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Ghi chú: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.ghi_chu}</Text>
        </View>
      </View>
      <View style={styles.lineContent}>
        <View style={styles.leftLine}>
          <Text style={[styles.text, styles.textTitle]}>Doctype: </Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={styles.text}>{item.doctype}</Text>
        </View>
      </View>
    </View>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  containerItem: {
    borderWidth: 0.5,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    flex: 1,
  },
  lineContent: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 5,
  },
  textTitle: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    color: colors.BLACK,
    textAlign: 'justify',
  },
  leftLine: {flex: 1},
  rightLine: {flex: 2},
});
