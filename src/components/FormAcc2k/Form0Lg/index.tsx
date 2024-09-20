import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {IDataBaoCao} from '../../../type/IAcc2k';
import moment from 'moment-timezone';
import {formStyles} from '../styles';
import PickDate from '../../PickDate';
import {CalendarModal} from '../../CustomModal';
import colors from '../../../themes/colors';
import MonthPicker from 'react-native-month-year-picker';
import Toast from 'react-native-toast-message';
const Form0Lg = (data: IDataBaoCao) => {
  const currentDate = moment().tz('Asia/Ho_Chi_Minh');
  const [startMonth, setStartMonth] = useState(
    moment(currentDate).startOf('year'),
  );
  const [endMonth, setEndMonth] = useState(moment(currentDate));
  const [createDate, setCreateDate] = useState(moment.now());
  const [isPickStartDate, setIsPickStartDate] = useState<'START' | 'END' | ''>(
    '',
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleDateChange = (date: any) => {
    if (date) {
      setCreateDate(moment(date).format('YYYY-MM-DD') as any);
      setShowCalendar(false);
    }
  };

  const onValueChange = useCallback(
    (event: any, newDate: any) => {
      const selectedDate = newDate || date;
      setShow(false);
      setDate(selectedDate);
      if (isPickStartDate === 'START') {
        setStartMonth(moment(selectedDate));
      } else {
        const isAfter = startMonth.isAfter(moment(selectedDate));
        if (!isAfter) setEndMonth(moment(selectedDate));
        else
          Toast.show({
            type: 'error',
            text1: 'Sai định dạng',
            text2: `Vui lòng chọn tháng sau ${startMonth.format('MM/YYYY')}`,
          });
      }
    },
    [date, show],
  );

  const handleShowPickerMonth = (type: 'START' | 'END') => {
    if (type === 'START') {
      setDate(new Date(startMonth as any));
    } else {
      setDate(new Date(endMonth as any));
    }
    setIsPickStartDate(type);
    setShow(true);
  };

  const setDefaultMonth = () => {
    const firstDateOfMonth = moment(currentDate)
      .startOf('month')
      .format('YYYY-MM-DD');
    setCreateDate(firstDateOfMonth as any);
    setShowCalendar(false);
  };

  return (
    <ScrollView style={formStyles.container}>
      <Text style={formStyles.titleForm}>{data.bar.toUpperCase()}</Text>
      <View style={formStyles.formPanel}>
        <View style={formStyles.rowLineTitle}>
          <Text style={formStyles.formTitleText}>Chứng từ</Text>
        </View>

        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Từ tháng: </Text>
            <TouchableOpacity
              style={{flex: 1, alignItems: 'center'}}
              onPress={() => handleShowPickerMonth('START')}>
              <Text style={formStyles.touchMonth}>
                {startMonth.format('MM/YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={formStyles.rightLineHalf}>
            <Text style={formStyles.text}>Đến tháng: </Text>
            <TouchableOpacity
              style={{flex: 1, alignItems: 'center'}}
              onPress={() => handleShowPickerMonth('END')}>
              <Text style={formStyles.touchMonth}>
                {endMonth.format('MM/YYYY')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Nhóm bộ phận: </Text>
            <TextInput style={formStyles.formTextInput} />
          </View>
        </View>
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Bộ phận: </Text>
            <TextInput style={formStyles.formTextInput} />
          </View>
        </View>
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Nhân viên: </Text>
            <TextInput style={formStyles.formTextInput} />
          </View>
        </View>
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Hình thức thanh toán: </Text>
            <TextInput style={formStyles.formTextInput} />
          </View>
        </View>
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Ngân hàng: </Text>
            <TextInput style={formStyles.formTextInput} />
          </View>
        </View>
      </View>

      <View style={formStyles.viewAction}>
        <TouchableOpacity style={formStyles.touchOK}>
          <Text style={formStyles.textTouchOK}>OK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={formStyles.touchCancel}>
          <Text style={formStyles.textTouchCancel}>Cancel</Text>
        </TouchableOpacity>
        <PickDate
          type="1"
          date={createDate}
          onPressDate={() => setShowCalendar(true)}
          textTitle="Ngày lập"
          startDate={undefined}
          endDate={undefined}
          onPressStartDate={undefined}
          onPressEndDate={undefined}
          styleText={{fontSize: 15}}
          iconSize={30}
        />
      </View>
      {/* Pick month and year */}
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          mode="number"
          okButton="Chọn"
          cancelButton="Hủy"
        />
      )}

      {/* Modal lịch */}
      <CalendarModal
        visible={showCalendar}
        onPressOutside={() => setShowCalendar(!showCalendar)}
        color={colors.SECONDCOLOR}
        onDateChange={(date: any) => handleDateChange(date)}
        secondButton={true}
        buttonTitle={'Hôm nay'}
        onSubmit={() => handleDateChange(currentDate)}
        buttonStyle={formStyles.calendarButton}
        buttonTitle2={'Tháng này'}
        onSubmit2={() => setDefaultMonth()}
        titleStyle2={{fontWeight: 'bold', color: colors.SECONDCOLOR}}
        buttonStyle2={formStyles.calendarButtonR}
      />
    </ScrollView>
  );
};

export default Form0Lg;

const styles = StyleSheet.create({});
