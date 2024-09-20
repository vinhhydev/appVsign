import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import PickDate from '../../PickDate';
import moment from 'moment-timezone';
import {CalendarModal} from '../../CustomModal';
import colors from '../../../themes/colors';
import DropdownList from '../../DropdownList';
import {IDataBaoCao} from '../../../type/IAcc2k';
import {useAppSelector} from '../../../redux/hook';
import {RootState} from '../../../redux/store';
import {Input} from '@rneui/themed';
import axios from 'axios';
import {ehd2} from '../../../../shared/url';
import wsStrings from '../../../../shared/wsStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getJSONByAPI} from '../../../utils/convertXML';
import {listQuy, listThang} from '../../../../shared/dropdownData';
import CustomSwitch from '../../CustomSwitch';
import {formStyles} from '../styles';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../../shared/navigationStrings';

type ThueSuat = {
  label: string;
  value: string;
};

const Form7Vao = (data: IDataBaoCao) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isPickStartDate, setIsPickStartDate] = useState(true);
  const [minDate, setMinDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [tg, setTg] = useState(false);
  const [mst, setMst] = useState('');
  const [thueSuat, setThueSuat] = useState<ThueSuat[]>([]);
  const [pickThueSuat, setPickThueSuat] = useState('');
  const [pickQuy, setPickQuy] = useState('');
  const [pickThang, setPickThang] = useState('');
  const currentDate = moment().tz('Asia/Ho_Chi_Minh');
  const [taiKhoan, setTaiKhoan] = useState(data.ma);
  const navigation = useNavigation();

  const acc2kState = useAppSelector((state: RootState) => state.acc2kSlice);

  useEffect(() => {
    setDefaultMonth();
    getThueSuat();
  }, []);

  useEffect(() => {
    changeMonth();
  }, [pickThang]);

  const getThueSuat = async () => {
    const getAcc2k = await AsyncStorage.getItem('ACC2K');
    if (getAcc2k !== null) {
      const parseJson = JSON.parse(getAcc2k);
      await axios
        .get(`${ehd2}${wsStrings.GETDMTHUE}`, {
          params: {
            tel: parseJson.phoneNumber,
            password: parseJson.password,
            data: acc2kState.selectData.data,
            tk: data.ma,
          },
        })
        .then(res => {
          const data = getJSONByAPI(res.data);
          const listThueSuat = data.map((x: any) => {
            return {
              label: x.ma_thue,
              value: x.ma_thue,
            };
          }) as ThueSuat[];
          setThueSuat(listThueSuat);
        });
    }
  };
  // Giới hạn minDate của lịch để người dùng không chọn sai
  const pickDate = (type: string) => {
    if (type == 'startDate') {
      if (!isPickStartDate) {
        setIsPickStartDate(true);
        setMinDate('2021-11-01');
      }
    } else if (type == 'endDate') {
      if (isPickStartDate) {
        setIsPickStartDate(false);
        setMinDate(startDate);
      }
    }
    setShowCalendar(true);
  };

  const handleDateChange = (date: any) => {
    if (date) {
      if (isPickStartDate) {
        const ed = moment(endDate, 'YYYY-MM-DD');

        // Kiểm tra ngày bắt đầu nằm sau ngày kết thúc nếu có thì thay đổi ngày kết thúc
        const isStartDateAfterEndDate = date.isAfter(ed);
        if (isStartDateAfterEndDate) {
          setStartDate(moment(date).format('YYYY-MM-DD'));
          setEndDate(moment(date).format('YYYY-MM-DD'));
        } else {
          setStartDate(moment(date).format('YYYY-MM-DD'));
        }
      } else if (!isPickStartDate) {
        const start = moment(startDate, 'YYYY-MM-DD');
        const isEndDateBeforeStartDate = date.isBefore(start);
        if (isEndDateBeforeStartDate) {
          setStartDate(moment(date).format('YYYY-MM-DD'));
          setEndDate(moment(date).format('YYYY-MM-DD'));
        } else {
          setEndDate(moment(date).format('YYYY-MM-DD'));
        }
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
  const changeMonth = () => {
    if (pickThang.length > 0) {
      const startD = moment(
        moment()
          .month(Number.parseInt(pickThang) - 1)
          .startOf('month'),
      )
        .startOf('month')
        .format('YYYY-MM-DD');
      const endD = moment(moment().month(Number.parseInt(pickThang) - 1))
        .endOf('month')
        .format('YYYY-MM-DD');
      setStartDate(startD);
      setEndDate(endD);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titleForm}>{data.bar.toUpperCase()}</Text>
      <View style={styles.rowLine}>
        <View style={styles.leftLine}>
          <Text style={styles.text}>Thời gian: </Text>
        </View>
        <View style={styles.rightLine}>
          <CustomSwitch
            value={tg}
            onValueChange={() => setTg(!tg)}
            disabled={false}
            activeText="Tháng"
            inActiveText="Quý"
          />
        </View>
      </View>
      {tg ? (
        <>
          <View style={styles.rowLine}>
            <View style={styles.leftLine}>
              <Text style={styles.text}>Tháng:</Text>
            </View>
            <View style={styles.rightLine}>
              <DropdownList
                data={listThang}
                style={styles.dropdownListHafl}
                placeholder={currentDate.format('M')}
                value={pickThang}
                onChange={(item: any) =>
                  setPickThang(item.value)
                }></DropdownList>
            </View>
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
            disabled
          />
        </>
      ) : (
        <View style={styles.rowLine}>
          <View style={styles.leftLine}>
            <Text style={styles.text}>Qúy:</Text>
          </View>
          <View style={styles.rightLine}>
            <DropdownList
              data={listQuy}
              style={styles.dropdownListHafl}
              placeholder="1"
              value={pickQuy}
              onChange={(item: any) => setPickQuy(item.value)}></DropdownList>
          </View>
        </View>
      )}

      <View style={styles.rowLine}>
        <View style={styles.leftLine}>
          <Text style={styles.text}>Tài khoản:</Text>
        </View>
        <View style={styles.rightLine}>
          <Text style={[styles.text, {fontWeight: 'bold'}]}>{taiKhoan}</Text>
        </View>
        <TouchableOpacity
          style={formStyles.touchLoadmore}
          onPress={() => {
            navigation.navigate({
              name: navigationStrings.LOADMORELIST,
              params: {
                typeList: 'dmtk',
                setValue: setTaiKhoan,
              },
            } as never);
          }}>
          <Text style={formStyles.textLoadmore}>...</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rowLine}>
        <View style={styles.leftLine}>
          <Text style={styles.text}>Thuế suất:</Text>
        </View>
        <View style={styles.rightLine}>
          <DropdownList
            data={thueSuat}
            style={styles.dropdownList}
            placeholder="Chọn loại"
            value={pickThueSuat}
            onChange={(item: any) =>
              setPickThueSuat(item.value)
            }></DropdownList>
        </View>
      </View>
      <View style={styles.rowLine}>
        <View style={styles.leftLine}>
          <Text style={styles.text}>Mã số thuế:</Text>
        </View>
        <View style={styles.rightLine}>
          <TextInput placeholder="Nhập mã số thuế" style={styles.textInput} />
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.touchOK}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: colors.WHITE}}>
            OK
          </Text>
        </TouchableOpacity>
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
        buttonStyle={styles.calendarButton}
        buttonTitle2={'Tháng này'}
        onSubmit2={() => setDefaultMonth()}
        titleStyle2={{fontWeight: 'bold', color: colors.SECONDCOLOR}}
        buttonStyle2={styles.calendarButtonR}></CalendarModal>
    </ScrollView>
  );
};

export default Form7Vao;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleForm: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.MAINCOLOR,
    marginVertical: 15,
  },
  rowLine: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    color: colors.BLACK,
  },
  leftLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightLine: {
    flex: 2,
  },
  dropdownList: {
    width: 140,
    height: 40,
    borderWidth: 2,
    borderColor: colors.GRAY,
    paddingLeft: 10,
    paddingRight: 5,
    marginLeft: 10,
    borderRadius: 30,
  },
  dropdownListHafl: {
    width: 80,
    height: 40,
    borderWidth: 2,
    borderColor: colors.GRAY,
    paddingLeft: 10,
    paddingRight: 5,
    marginLeft: 10,
    borderRadius: 30,
  },
  calendarButton: {
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    width: 150,
    borderWidth: 1.5,
    borderColor: colors.SECONDCOLOR,
  },
  calendarButtonR: {
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    width: 150,
    borderWidth: 1.5,
    borderColor: colors.SECONDCOLOR,
  },
  textInput: {
    borderBottomWidth: 0.5,
    padding: 0,
    fontSize: 17,
  },
  touchOK: {
    backgroundColor: colors.GREEN,
    alignSelf: 'center',
    alignItems: 'center',
    width: 100,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 30,
  },
});
