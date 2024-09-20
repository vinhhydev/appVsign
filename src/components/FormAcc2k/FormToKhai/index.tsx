import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IDataBaoCao} from '../../../type/IAcc2k';
import colors from '../../../themes/colors';
import {CheckBox} from '@rneui/base';
import DropdownList from '../../DropdownList';
import {listQuy, listThang} from '../../../../shared/dropdownData';

const FormToKhai = (data: IDataBaoCao) => {
  const [selectTg, setSelectTg] = useState(0);
  const [pickTime, setPickTime] = useState(1);

  useEffect(() => {
    setPickTime(1);
  }, [selectTg]);

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={styles.formView}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.titleForm}>{data.bar.toUpperCase()}</Text>
        <View style={styles.headerForm}>
          <View style={[styles.rowLine, styles.backgroundTitleHead]}>
            <View style={styles.leftContent}>
              <Text style={styles.title}>Chi tiêu</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.title}>
                Giá trị hàng hóa, dịch vụ {'\n'} (chưa có thuế giá trị gia tăng){' '}
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.title}>Thuế giá trị {'\n'}gia tăng</Text>
            </View>
          </View>
        </View>
        <View style={styles.bodyForm}>
          <View style={styles.rowLine}>
            <View style={styles.leftContent}>
              <Text style={styles.text}>
                Không phát sinh hoạt động mua, bán trong kỳ
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>
                Thuế giá trị gia tăng còn được khấu trừ kỳ trước chuyển sang
              </Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={[styles.rowLine, styles.backgroundTitleHead]}>
            <View style={[styles.leftContent, {width: '100%'}]}>
              <Text style={styles.title}>
                Kê khai thuế giá trị gia tăng phải nộp ngân sách nhà nước
              </Text>
            </View>
          </View>

          <View style={[styles.rowLine, styles.backgroundTitle]}>
            <View style={[styles.leftContent, {width: '100%'}]}>
              <Text style={styles.title}>
                Hàng hóa, dịch vụ mua vào trong kỳ
              </Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {borderBottomWidth: 0}]}>
              <Text style={styles.text}>
                Giá trị và thuế giá trị gia tăng của hàng hóa, dịch vụ mua vào
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={styles.leftContent}>
              <Text style={styles.text}>
                Trong đó: hàng hóa, dịch vụ nhập khẩu
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>
                Thuế giá trị gia tăng của hàng hóa, dịch vụ mua vào được khấu
                trừ kỳ này
              </Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={[styles.rowLine, styles.backgroundTitle]}>
            <View style={[styles.leftContent, {width: '100%'}]}>
              <Text style={styles.title}>
                Hàng hóa, dịch vụ bán ra trong kỳ
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={styles.leftContent}>
              <Text style={styles.text}>
                Hàng hóa, dịch vụ bán ra không chịu thuế giá trị gia tăng
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={styles.leftContent}>
              <Text style={styles.text}>
                Hàng hóa, dịch vụ bán ra không chịu thuế giá trị gia tăng
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={styles.leftContent}>
              <Text style={styles.text}>
                Hàng hóa, dịch vụ bán ra chịu thuế suất 0%
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={styles.leftContent}>
              <Text style={styles.text}>
                Hàng hóa, dịch vụ bán ra chịu thuế suất 5%
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={styles.leftContent}>
              <Text style={styles.text}>
                Hàng hóa, dịch vụ bán ra chịu thuế suất 10%
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={styles.leftContent}>
              <Text style={styles.text}>
                Hàng hóa, dịch vụ bán ra không tính thuế
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={styles.leftContent}>
              <Text style={styles.text}>
                Tổng doanh thu và thuế giá trị gia tăng của hàng hóa, dịch vụ
                bán ra
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={[styles.rowLine, styles.backgroundTitle]}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.title}>
                Thuế giá trị gia tăng phát sinh trong kỳ
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={[styles.rowLine, styles.backgroundTitle]}>
            <View style={[styles.leftContent, {width: '100%'}]}>
              <Text style={styles.title}>
                Điều chỉnh tăng, giảm thuế giá trị gia tăng còn được khấu trừ
                của các kỳ trước
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>Điều chỉnh giảm</Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>Điều chỉnh tăng</Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>
                Thuế giá trị gia tăng nhận bàn giao được khấu trừ trong kỳ
              </Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={[styles.rowLine, styles.backgroundTitle]}>
            <View style={[styles.leftContent, {width: '100%'}]}>
              <Text style={styles.title}>
                Xác định nghĩa vụ thuế giá trị gia tăng phải nộp trong kỳ
              </Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>
                Thuế giá trị gia tăng phải nộp của hoạt động sản xuất kinh doanh
                trong kỳ
              </Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>
                Thuế giá trị gia tăng mua vào của dự án đầu tư được bù trừ với
                thuế GTGT còn phải nộp của hoạt động sản xuất kinh doanh cùng kỳ
                tính thuế
              </Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>
                Thuế giá trị gia tăng còn phải nộp trong kỳ
              </Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>
                Thuế giá trị gia tăng chưa khấu trừ hết kỳ này
              </Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>
                Thuế giá trị gia tăng đề nghị hoàn
              </Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>0</Text>
            </View>
          </View>

          <View style={styles.rowLine}>
            <View style={[styles.leftContent, {width: '70%'}]}>
              <Text style={styles.text}>
                Thuế giá trị gia tăng còn được khấu trừ chuyển kỳ sau
              </Text>
            </View>

            <View style={styles.halfRight}>
              <Text style={styles.text}>1.000.000.000</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.viewAction}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <DropdownList
            data={selectTg === 0 ? listQuy : listThang}
            placeholder="1"
            onChange={(x: any) => setPickTime(x.value)}
            style={styles.ddlTime}
          />
          <CheckBox
            checked={selectTg === 0}
            onPress={() => setSelectTg(0)}
            iconType="material-community"
            checkedIcon="radiobox-marked"
            uncheckedIcon="radiobox-blank"
            title={'Quý'}
            containerStyle={{paddingHorizontal: 0}}
          />
          <CheckBox
            checked={selectTg === 1}
            onPress={() => setSelectTg(1)}
            iconType="material-community"
            checkedIcon="radiobox-marked"
            uncheckedIcon="radiobox-blank"
            title={'Tháng'}
            containerStyle={{paddingHorizontal: 0}}
          />
        </View>

        <TouchableOpacity style={styles.touchSend}>
          <Text style={{color: colors.WHITE, fontWeight: 'bold'}}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FormToKhai;

const styles = StyleSheet.create({
  titleForm: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.MAINCOLOR,
    marginVertical: 15,
  },
  headerForm: {
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  bodyForm: {
    borderWidth: 1,
    borderTopWidth: 0,
  },
  formView: {
    paddingHorizontal: 5,
  },
  rowLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backgroundTitleHead: {
    backgroundColor: colors.SECONDCOLOR,
  },
  backgroundTitle: {
    backgroundColor: colors.LIGHT_BLUE,
  },
  leftContent: {
    width: '40%',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  halfRight: {
    width: '30%',
    borderLeftWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 14,
    color: colors.BLACK,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    color: colors.BLACK,
    fontSize: 13,
    textAlign: 'justify',
  },
  viewAction: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  ddlTime: {
    width: 60,
  },
  touchSend: {
    backgroundColor: colors.MAINCOLOR,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
});
