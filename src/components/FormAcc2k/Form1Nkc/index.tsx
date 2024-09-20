import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IDataBaoCao} from '../../../type/IAcc2k';
import moment from 'moment-timezone';
import {formStyles} from '../styles';
import PickDate from '../../PickDate';
import {CalendarModal} from '../../CustomModal';
import colors from '../../../themes/colors';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../../shared/navigationStrings';

const Form1Nkc = (data: IDataBaoCao) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [createDate, setCreateDate] = useState(moment.now());
  const [isPickStartDate, setIsPickStartDate] = useState<
    'START' | 'END' | 'CURRENT' | ''
  >('');
  const [minDate, setMinDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const currentDate = moment().tz('Asia/Ho_Chi_Minh');
  const navigation = useNavigation();
  const [taikhoan, setTaikhoan] = useState(data.ma);

  useEffect(() => {
    setDefaultMonth();
  }, []);

  // Giới hạn minDate của lịch để người dùng không chọn sai
  const pickDate = (type: string) => {
    if (type == 'startDate') {
      if (isPickStartDate !== 'START') {
        setIsPickStartDate('START');
        setMinDate('2021-11-01');
      }
    } else if (type == 'endDate') {
      if (isPickStartDate !== 'END') {
        setIsPickStartDate('END');
        setMinDate(startDate);
      }
    } else {
      setIsPickStartDate('CURRENT');
    }
    setShowCalendar(true);
  };

  const handleDateChange = (date: any) => {
    if (date) {
      if (isPickStartDate === 'START') {
        const ed = moment(endDate, 'YYYY-MM-DD');
        // Kiểm tra ngày bắt đầu nằm sau ngày kết thúc nếu có thì thay đổi ngày kết thúc
        const isStartDateAfterEndDate = date.isAfter(ed);
        if (isStartDateAfterEndDate) {
          setStartDate(moment(date).format('YYYY-MM-DD'));
          setEndDate(moment(date).format('YYYY-MM-DD'));
        } else {
          setStartDate(moment(date).format('YYYY-MM-DD'));
        }
      } else if (isPickStartDate === 'END') {
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
          type="2"
          startDate={startDate}
          onPressStartDate={() => pickDate('startDate')}
          endDate={endDate}
          onPressEndDate={() => pickDate('endDate')}
          date={undefined}
          onPressDate={undefined}
          styleText={{}}
        />

        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Từ số: </Text>
            <TextInput style={formStyles.formTextInput} value={''} />
          </View>
          <View style={formStyles.rightLineHalf}>
            <Text style={formStyles.text}>Đến số: </Text>
            <TextInput style={formStyles.formTextInput} value={''} />
          </View>
        </View>
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Mã chứng từ: </Text>
            <TextInput style={formStyles.formTextInput} value={''} />
          </View>
        </View>
      </View>

      <View style={formStyles.formPanel}>
        <View style={formStyles.rowLineTitle}>
          <Text style={formStyles.formTitleText}>Tài khoản</Text>
        </View>
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Tài khoản: </Text>
            <TextInput
              style={formStyles.formTextInput}
              value={taikhoan}
              onChangeText={x => setTaikhoan(x)}
            />
            <TouchableOpacity
              style={formStyles.touchLoadmore}
              onPress={() => {
                navigation.navigate({
                  name: navigationStrings.LOADMORELIST,
                  params: {
                    typeList: 'dmtk',
                    setValue: setTaikhoan,
                  },
                } as never);
              }}>
              <Text style={formStyles.textLoadmore}>...</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Nợ có: </Text>
            <TextInput style={formStyles.formTextInput} value={data.ma} />
          </View>
        </View>
        <View style={formStyles.rowLineContent}>
          <View style={formStyles.leftLineHalf}>
            <Text style={formStyles.text}>Tài khoản đối ứng: </Text>
            <TextInput style={formStyles.formTextInput} value={data.ma} />
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
          onPressDate={() => pickDate('')}
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

export default Form1Nkc;

const styles = StyleSheet.create({});
