import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IDataBaoCao} from '../../../type/IAcc2k';
import moment from 'moment-timezone';
import {ScrollView} from 'react-native';
import {formStyles} from '../styles';
import PickDate from '../../PickDate';
import {CalendarModal} from '../../CustomModal';
import colors from '../../../themes/colors';

const Form8Kq1 = (data: IDataBaoCao) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isTwo, setIsTwo] = useState(false);
  const [startDate2, setStartDate2] = useState<string>('');
  const [endDate2, setEndDate2] = useState<string>('');

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
  const pickDate = (type: string, isTwo: boolean) => {
    setIsTwo(isTwo);
    if (type == 'startDate') {
      if (isPickStartDate !== 'START') {
        setIsPickStartDate('START');
        setMinDate('2021-11-01');
      }
    } else if (type == 'endDate') {
      if (isPickStartDate !== 'END') {
        setIsPickStartDate('END');
        if (!isTwo) {
          setMinDate(startDate);
        } else {
          setMinDate(startDate2);
        }
      }
    } else {
      setIsPickStartDate('CURRENT');
    }
    setShowCalendar(true);
  };

  const handleDateChange = (date: any) => {
    if (date) {
      if (isPickStartDate === 'START') {
        if (!isTwo) {
          const ed = moment(endDate, 'YYYY-MM-DD');
          // Kiểm tra ngày bắt đầu nằm sau ngày kết thúc nếu có thì thay đổi ngày kết thúc
          const isStartDateAfterEndDate = date.isAfter(ed);
          if (isStartDateAfterEndDate) {
            setStartDate(moment(date).format('YYYY-MM-DD'));
            setEndDate(moment(date).format('YYYY-MM-DD'));
          } else {
            setStartDate(moment(date).format('YYYY-MM-DD'));
          }
        } else {
          const ed = moment(endDate2, 'YYYY-MM-DD');
          // Kiểm tra ngày bắt đầu nằm sau ngày kết thúc nếu có thì thay đổi ngày kết thúc
          const isStartDateAfterEndDate = date.isAfter(ed);
          if (isStartDateAfterEndDate) {
            setStartDate2(moment(date).format('YYYY-MM-DD'));
            setEndDate2(moment(date).format('YYYY-MM-DD'));
          } else {
            setStartDate2(moment(date).format('YYYY-MM-DD'));
          }
        }
      } else if (isPickStartDate === 'END') {
        if (!isTwo) {
          const start = moment(startDate, 'YYYY-MM-DD');
          const isEndDateBeforeStartDate = date.isBefore(start);
          // Kiểm tra ngày kết thúc nằm trước ngày bắt đầu nếu có thì thay đổi ngày bắt đầu
          if (isEndDateBeforeStartDate) {
            setStartDate(moment(date).format('YYYY-MM-DD'));
            setEndDate(moment(date).format('YYYY-MM-DD'));
          } else {
            setEndDate(moment(date).format('YYYY-MM-DD'));
          }
        } else {
          const start = moment(startDate2, 'YYYY-MM-DD');
          const isEndDateBeforeStartDate = date.isBefore(start);
          // Kiểm tra ngày kết thúc nằm trước ngày bắt đầu nếu có thì thay đổi ngày bắt đầu
          if (isEndDateBeforeStartDate) {
            setStartDate2(moment(date).format('YYYY-MM-DD'));
            setEndDate2(moment(date).format('YYYY-MM-DD'));
          } else {
            setEndDate2(moment(date).format('YYYY-MM-DD'));
          }
        }
      } else {
        setCreateDate(moment(date).format('YYYY-MM-DD') as any);
      }
      setShowCalendar(false);
    }
  };
  const setDefaultMonth = () => {
    const startD = moment(currentDate).startOf('month').format('YYYY-MM-DD');
    const endD = moment(currentDate).endOf('month').format('YYYY-MM-DD');
    setStartDate(startD);
    setEndDate(endD);
    setStartDate2(startD);
    setEndDate2(endD);
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
            <Text style={[formStyles.text, {fontWeight: 'bold'}]}>Kỳ này:</Text>
          </View>
        </View>
        <PickDate
          type="2"
          startDate={startDate}
          onPressStartDate={() => pickDate('startDate', false)}
          endDate={endDate}
          onPressEndDate={() => pickDate('endDate', false)}
          date={undefined}
          onPressDate={undefined}
          styleText={{}}
        />

        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={[formStyles.text, {fontWeight: 'bold'}]}>
              Kỳ trước:
            </Text>
          </View>
        </View>
        <PickDate
          type="2"
          startDate={startDate2}
          onPressStartDate={() => pickDate('startDate', true)}
          endDate={endDate2}
          onPressEndDate={() => pickDate('endDate', true)}
          date={undefined}
          onPressDate={undefined}
          styleText={{}}
        />
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
          onPressDate={() => pickDate('', false)}
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

export default Form8Kq1;

const styles = StyleSheet.create({});
