import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment-timezone';
import {formStyles} from '../styles';
import PickDate from '../../PickDate';
import {CalendarModal} from '../../CustomModal';
import colors from '../../../themes/colors';
import {IDataBaoCao} from '../../../type/IAcc2k';

const Form8Cdkt = (data: IDataBaoCao) => {
  const [toDate, setToDate] = useState<string>('');
  const [createDate, setCreateDate] = useState(moment.now());
  const [isPickStartDate, setIsPickStartDate] = useState<
    'START' | 'END' | 'CURRENT' | ''
  >('');
  const [minDate, setMinDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const currentDate = moment().tz('Asia/Ho_Chi_Minh');

  useEffect(() => {
    setDefaultMonth();
  }, []);

  // Giới hạn minDate của lịch để người dùng không chọn sai
  const pickDate = (type: string) => {
    if (type == 'CURRENT') {
      setIsPickStartDate('CURRENT');
    } else {
      setIsPickStartDate('');
    }
    setShowCalendar(true);
  };

  const handleDateChange = (date: any) => {
    if (date) {
      if (isPickStartDate === 'CURRENT') {
        setCreateDate(moment(date).format('YYYY-MM-DD') as any);
      } else {
        setToDate(moment(date).format('YYYY-MM-DD') as any);
      }
      setShowCalendar(false);
    }
  };
  const setDefaultMonth = () => {
    // const startD = moment(currentDate).startOf('month').format('YYYY-MM-DD');
    // const endD = moment(currentDate).endOf('month').format('YYYY-MM-DD');
    // setStartDate(startD);
    // setEndDate(endD);
    setShowCalendar(false);
  };

  return (
    <ScrollView style={formStyles.container}>
      <Text style={formStyles.titleForm}>{data.bar.toUpperCase()}</Text>
      <View style={formStyles.formPanel}>
        <View style={formStyles.rowLineTitle}>
          <Text style={formStyles.formTitleText}>Chứng từ</Text>
        </View>
        <PickDate
          type="1"
          textTitle="Đến ngày"
          startDate={undefined}
          endDate={undefined}
          onPressStartDate={undefined}
          onPressEndDate={undefined}
          styleText={{}}
          date={toDate}
          onPressDate={() => pickDate('')}
        />
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Hiện chi tiết: </Text>
            <TextInput style={formStyles.formTextInput} />
          </View>
        </View>
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Ngôn ngữ: </Text>
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
          onPressDate={() => pickDate('CURRENT')}
          textTitle="Ngày lập"
          startDate={undefined}
          endDate={undefined}
          onPressStartDate={undefined}
          onPressEndDate={undefined}
          styleText={{fontSize: 15}}
          iconSize={30}
        />
      </View>

      {/* Modal lịch */}
      <CalendarModal
        visible={showCalendar}
        onPressOutside={() => setShowCalendar(!showCalendar)}
        color={colors.SECONDCOLOR}
        minDate={minDate}
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

export default Form8Cdkt;

const styles = StyleSheet.create({});
