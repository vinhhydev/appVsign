import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import PickDate from '../../PickDate';
import moment from 'moment-timezone';
import {CalendarModal} from '../../CustomModal';
import colors from '../../../themes/colors';
import DropdownList from '../../DropdownList';
import {IAccountAcc2k, IDataBaoCao} from '../../../type/IAcc2k';
import {useAppSelector} from '../../../redux/hook';
import {RootState} from '../../../redux/store';
import axios from 'axios';
import {ehd2} from '../../../../shared/url';
import wsStrings from '../../../../shared/wsStrings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getJSONByAPI} from '../../../utils/convertXML';
import {formStyles} from '../styles';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../../shared/navigationStrings';
import {showAlert} from '../../notifications/showAlert';
import RenderItem from './RenderItem';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ThueSuat = {
  label: string;
  value: string;
};

export type DataForm = {
  stt: string;
  stt0: string;
  ky_hieu_mau0: string;
  so_seri0: string;
  so_ct0: string;
  ngay_ct0: string;
  ten_dtgtgt: string;
  ma_dtgtgt: string;
  ma_vt: string;
  doanh_so: number;
  thue_gtgt: number;
  tien3: number;
  ttien: number;
  kiemtra: number;
  ma_thue: string;
  ma_ctrinh: string;
  ghi_chu: string;
  ma_dvcs: string;
  tk_du: string;
  doctype: string;
  pdftype: string;
};

const Form7Vao = (data: IDataBaoCao) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isPickStartDate, setIsPickStartDate] = useState<
    'START' | 'END' | 'CURRENT' | ''
  >('');
  const [minDate, setMinDate] = useState<string>('');
  const [createDate, setCreateDate] = useState(moment.now());
  const [showCalendar, setShowCalendar] = useState(false);
  const [mst, setMst] = useState('');
  const [thueSuat, setThueSuat] = useState<ThueSuat[]>([]);
  const [pickThueSuat, setPickThueSuat] = useState('');
  const currentDate = moment().tz('Asia/Ho_Chi_Minh');
  const [taiKhoan, setTaiKhoan] = useState(data.ma);
  const [resultData, setResultData] = useState<DataForm[]>([]);
  const [nameExcel, setNameExcel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [layoutYShow, setLayoutYShow] = useState(0);
  const [showScroll, setShowScroll] = useState(false);
  const navigation = useNavigation();
  const acc2kState = useAppSelector((state: RootState) => state.acc2kSlice);
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    setDefaultMonth();
    getThueSuat();
  }, []);

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

          // add V% to list
          const v: ThueSuat = {
            label: 'V%',
            value: 'V%',
          };
          listThueSuat.unshift(v);
          setThueSuat(listThueSuat);
        });
    }
  };
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

  const handleSubmit = async () => {
    if (pickThueSuat === '') {
      showAlert('error', 'Thông báo', 'Vui lòng chọn thuế suất');
    } else if (taiKhoan === '') {
      showAlert('error', 'Thông báo', 'Vui lòng điền tài khoản');
    } else {
      setIsLoading(true);
      const acc2k: IAccountAcc2k = JSON.parse(
        (await AsyncStorage.getItem('ACC2K')) ?? '',
      );
      await axios
        .post(
          `${ehd2 + wsStrings.SP_VAT}`,
          {
            tel: acc2k.phoneNumber,
            password: acc2k.password,
            database: acc2kState.selectData.data,
            m_user: '1',
            tu_ngay: startDate,
            den_ngay: endDate,
            lt: pickThueSuat,
            tk: taiKhoan,
            mst: '',
            loai_cp: '',
            ma_bp: '',
          },
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .then(async res => {
          if (res.data !== null) {
            const rsData = getJSONByAPI(res.data);
            setResultData(rsData);
            const funcExel = `${ehd2 + data.excel}`;
            await getFileNameExcel(funcExel);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.log('ERROR SUBMIT', err);
          setIsLoading(false);
        });
    }
  };

  const getFileNameExcel = async (func: string) => {
    const acc2k: IAccountAcc2k = JSON.parse(
      (await AsyncStorage.getItem('ACC2K')) ?? '',
    );
    await axios
      .post(func, {
        tel: acc2k.phoneNumber,
        password: acc2k.password,
        database: acc2kState.selectData.data,
        tu_ngay: startDate,
        den_ngay: endDate,
        lt: pickThueSuat,
        tk: taiKhoan,
        mst: '',
        loai_cp: '',
        ma_bp: '',
      })
      .then(res => {
        if (res.data !== null) {
          console.log('DATA', res.data.d);
          setNameExcel(res.data.d);
        }
      });
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={formStyles.container}
        onMomentumScrollEnd={e => {
          if (e.nativeEvent.contentOffset.y >= layoutYShow && !showScroll) {
            setShowScroll(true);
          } else if (
            e.nativeEvent.contentOffset.y <= layoutYShow &&
            showScroll
          ) {
            setShowScroll(false);
          }
        }}>
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
              <Text style={formStyles.text}>Tài khoản: </Text>
              <TextInput
                style={formStyles.formTextInput}
                value={taiKhoan}
                onChangeText={x => setTaiKhoan(x)}
              />
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
          </View>
          <View style={formStyles.rowLineContent}>
            <View style={formStyles.leftLineHalf}>
              <Text style={formStyles.text}>Thuế suất: </Text>
              <DropdownList
                data={thueSuat}
                style={styles.dropdownList}
                placeholder="Chọn loại"
                value={pickThueSuat}
                onChange={(item: any) => setPickThueSuat(item.value)}
              />
            </View>
          </View>
          <View style={formStyles.rowLineContent}>
            <View style={formStyles.leftLineHalf}>
              <Text style={formStyles.text}>Mã số thuế: </Text>
              <TextInput
                style={formStyles.formTextInput}
                value={mst}
                onChangeText={x => setMst(x)}
              />
            </View>
          </View>
        </View>
        <View style={formStyles.viewAction}>
          <TouchableOpacity
            style={formStyles.touchOK}
            onPress={() => handleSubmit()}
            disabled={isLoading}>
            {!isLoading ? (
              <Text style={formStyles.textTouchOK}>OK</Text>
            ) : (
              <ActivityIndicator size={20} color={colors.WHITE} />
            )}
          </TouchableOpacity>
          {resultData.length > 0 && (
            <TouchableOpacity style={formStyles.touchCancel}>
              <Text style={formStyles.textTouchCancel}>Xuất Excel</Text>
            </TouchableOpacity>
          )}
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
        <View
          onLayout={x => {
            setLayoutYShow(x.nativeEvent.layout.y);
          }}>
          {resultData.length > 0 ? (
            <FlatList
              data={resultData}
              keyExtractor={(_, _index) => `itemForm-${_index}`}
              renderItem={({item}) => <RenderItem {...item} />}
              scrollEnabled={false}
              contentContainerStyle={{paddingBottom: 30}}
            />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                marginTop: 20,
              }}>
              Không có dữ liệu
            </Text>
          )}
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
      {showScroll && (
        <View style={{position: 'absolute', bottom: 10, right: 10}}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: colors.MAINCOLOR,
              borderRadius: 50,
            }}
            onPress={() => {
              scrollViewRef.current?.scrollTo({y: 0});
              setShowScroll(false);
            }}>
            <Icon name="keyboard-arrow-up" size={25} color={colors.WHITE} />
          </TouchableOpacity>
        </View>
      )}
    </>
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
    flexDirection: 'row',
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
