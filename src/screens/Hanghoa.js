import {View, Text, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import CurrencyInput from 'react-native-currency-input';
import {searchObjects} from '../utils/searchObject';
import React, {useEffect, useState} from 'react';
import styles from '../themes/styles';
import colors from '../themes/colors';
import {Divider} from '@rneui/base';
import {Input} from '@rneui/themed';
import axios from 'axios';
// Shared
import navigationStrings from '../../shared/navigationStrings';
import {listThue} from '../../shared/dropdownData';
import wsStrings from '../../shared/wsStrings';
import {ehdUrl} from '../../shared/url';
// Components
import {showAlert} from '../components/notifications/showAlert';
import LoadingComponent from '../components/LoadingComponent';
import ReloadComponent from '../components/ReloadComponent';
import DropdownList from '../components/DropdownList';
import CustomButton from '../components/CustomButton';
import {CustomModal} from '../components/CustomModal';
import SearchInput from '../components/SearchInput';
import Header from '../components/Header';

const Hanghoa = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [dataRender, setDataRender] = useState([]);
  const [sanpham, setSanpham] = useState([]);
  const [soluong, setSoluong] = useState('1');
  const [ma_vt, setMa_vt] = useState('');
  const [ten_vt, setTen_vt] = useState('');
  const [ma_nh, setMa_nh] = useState('');
  const [dvt, setDvt] = useState('');
  const [gia_ban, setGia_ban] = useState('');
  const [inputGia, setInputGia] = useState('');
  const [ts, setTs] = useState('10');
  const [tondau, setTondau] = useState('');
  const [dudau, setDudau] = useState('');
  const [note, setNote] = useState('');
  const [noteLength, setNoteLength] = useState(0);
  const [totalPrice, setTotalPrice] = useState('');
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [themModal, setThemModal] = useState(false);
  const [soluongModal, setSoluongModal] = useState(false);
  const [inputGiaErrorMessage, setInputGiaErrorMessage] = useState('');
  const [soluongErrorMessage, setSoluongErrorMessage] = useState('');
  const [totalPriceErrorMessage, setTotalPriceErrorMessage] = useState('');
  const [mavtErrorMessage, setMavtErrorMessage] = useState('');
  const [tenvtErrorMessage, setTenvtErrorMessage] = useState('');
  const [dvtErrorMessage, setDvtErrorMessage] = useState('');
  const [giabanErrorMessage, setGiabanErrorMessage] = useState('');

  useEffect(() => {
    getData();
  }, []);

  // Xử lý field tìm kiếm
  useEffect(() => {
    if (keyword) {
      searchObject();
    } else {
      setDataRender(data);
    }
  }, [keyword]);

  // Tìm kiếm vật tư
  const searchObject = () => {
    const result = searchObjects(data, dataRender);
    if (result) {
      setDataRender(result);
    } else {
      setDataRender('');
    }
  };

  const onPressItem = item => {
    if (route.params.type == 'ehd') {
      setSoluongModal(true);
      setSanpham(item);
      setInputGia(item.gia_ban);
      setTotalPrice(item.gia_ban);
    } else {
      capnhatMH(item);
    }
  };

  const onSubmitItem = () => {
    if (inputGia == '') {
      setInputGiaErrorMessage('Đơn giá không được để trống');
    } else if (soluong == '') {
      setSoluongErrorMessage('Số lượng không được để trống');
    } else if (totalPrice == '') {
      setTotalPriceErrorMessage('Thành tiền không được để trống');
    } else {
      navigateEhd();
    }
  };

  const onSubmit = () => {
    setLoading(true);
    if (type == true) {
      themHh();
    } else {
      suaHh();
    }
  };

  const onPressThem = () => {
    setType(true);
    setThemModal(true);
    resetForm();
  };

  const onPressEdit = item => {
    setType(false);
    setThemModal(true);
    setupForm(item);
  };

  const onRefresh = () => {
    setIsLoading(true);
    getData();
    setKeyword('');
  };

  const setupForm = item => {
    setMa_vt(item.ma_vt);
    setTen_vt(item.ten_vt);
    setMa_nh(item.ma_nh);
    setDvt(item.dvt);
    setTs(item.ts.toString());
    setGia_ban(item.gia_ban);
    setTondau(item.tondau.toString());
    setDudau(item.dudau.toString());
  };

  const resetForm = () => {
    setMa_vt('');
    setTen_vt('');
    setMa_nh('');
    setDvt('');
    setGia_ban('');
    setTs('10');
    setTondau('0');
    setDudau('0');
  };

  // Kiểm tra lại form thêm vật tư trước khi xác nhận thêm
  const checkForm = () => {
    if (ma_vt == '') {
      setMavtErrorMessage('Bạn chưa nhập mã vật tư');
    } else if (ten_vt == '') {
      setTenvtErrorMessage('Bạn chưa nhập tên vật tư');
    } else if (dvt == '') {
      setDvtErrorMessage('Bạn chưa nhập đơn vị tính');
    } else if (gia_ban == '') {
      setGiabanErrorMessage('Bạn chưa nhập giá bán');
    } else {
      onSubmit();
    }
  };

  const getData = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_GETDMVT, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          const newData = JSON.parse(JSON.stringify(res));
          if (res.Status) {
            const type = 'error';
            const title = 'Không thể lấy dữ liệu ' + res.Status;
            showAlert(type, title);
          } else {
            setData(res);
            setDataRender(newData);
          }
        } else {
          setData('');
          setDataRender('');
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi trong quá trình lấy dữ liệu\n' + error.message,
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const themHh = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_ADDDMVT, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        ma_vt: ma_vt,
        ten_vt: ten_vt,
        dvt: dvt,
        ma_nh: ma_nh,
        gia_ban: gia_ban,
        ts: ts,
        tondau: tondau,
        dudau: dudau,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          setThemModal(false);
          const type = 'success';
          const title = 'Đã thêm hàng hoá';
          showAlert(type, title);
          getData();
          resetForm();
        } else {
          Alert.alert('Thông báo', 'Không thể thêm hàng hoá\n' + res.Status);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi trong quá trình thêm hàng hoá\n' + error.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const suaHh = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_EDITDMVT, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        ma_vt: ma_vt,
        ten_vt: ten_vt,
        dvt: dvt,
        ma_nh: ma_nh,
        gia_ban: gia_ban,
        ts: ts,
        tondau: tondau,
        dudau: dudau,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          setThemModal(false);
          const type = 'success';
          const title = 'Đã sửa hàng hoá';
          showAlert(type, title);
          getData();
          resetForm();
        } else {
          Alert.alert('Thông báo', 'Không thể sửa hàng hoá\n' + res.Status);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi trong quá trình thêm hàng hoá\n' + error.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const capnhatMH = async item => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_EDITINVOICE, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        id0: route.params.id0,
        ma_hang: item.ma_vt,
      })
      .then(response => {
        const res = response.data.d;
        if (res == 'Ok') {
          navigateHoadon0();
          const type = 'success';
          const title = 'Đã cập nhật mã hàng';
          showAlert(type, title);
        } else {
          const type = 'error';
          const title = 'Không thể cập nhật mã hàng';
          const text = res.Status;
          showAlert(type, title, text);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi trong quá trình cập nhật mã hàng\n' + error.message,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const navigateHoadon0 = () => {
    navigation.navigate(navigationStrings.HD0, {
      userName: route.params.userName,
      pwd: route.params.pwd,
      mst: route.params.mst,
      id: route.params.id,
      tg: route.params.tg,
      update: 'C',
    });
  };

  const navigateEhd = () => {
    navigation.navigate(navigationStrings.EHD2, {
      userName: route.params.userName,
      pwd: route.params.pwd,
      mst: route.params.mst,
      pass_ehd: route.params.pass_ehd,
      action: route.params.action,
      item: route.params.item,
      data: [sanpham],
      soluong: soluong,
      diengiai: note,
      tongtien: totalPrice,
      giaban: inputGia,
    });
  };

  const renderFormAddProduct = () => {
    return (
      <View style={styles.dmcty.calendar}>
        <Text style={styles.textH}>Nhập thông tin vật tư</Text>
        <View style={styles.dmcty.input}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '50%'}}>
              <Input
                label={'Mã vật tư'}
                placeholder="Vd: A001"
                value={ma_vt}
                errorMessage={mavtErrorMessage}
                onChangeText={value => setMa_vt(value)}
                onChange={() => mavtErrorMessage && setMavtErrorMessage('')}
              />
            </View>
            <View style={{width: '50%'}}>
              <Input
                label={'Mã nhóm'}
                value={ma_nh}
                onChangeText={value => setMa_nh(value)}
              />
            </View>
          </View>
          <Input
            label={'Tên vật tư'}
            placeholder="Vd: Điện thoại"
            value={ten_vt}
            multiline={true}
            errorMessage={tenvtErrorMessage}
            onChangeText={value => setTen_vt(value)}
            onChange={() => tenvtErrorMessage && setTenvtErrorMessage('')}
          />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '50%'}}>
              <Input
                label={'Đơn vị tính'}
                placeholder="Vd: Cái"
                errorMessage={dvtErrorMessage}
                value={dvt}
                onChangeText={value => setDvt(value)}
                onChange={() => dvtErrorMessage && setDvtErrorMessage('')}
              />
            </View>
            <View style={{width: '50%', justifyContent: 'flex-start'}}>
              <Text
                style={{
                  color: 'gray',
                  fontWeight: 'bold',
                  fontSize: 15,
                }}>
                Thuế suất
              </Text>
              <DropdownList
                tg={route.params.tg}
                data={listThue}
                value={ts}
                onChange={i => setTs(i.value)}
                style={styles.hanghoa.dropdown}
                containerStyle={styles.hanghoa.containerStyle}></DropdownList>
            </View>
          </View>
          <CurrencyInput
            delimiter="."
            minValue={0}
            precision={0}
            value={gia_ban}
            onChangeValue={value => setGia_ban(value)}
            onChange={() => giabanErrorMessage && setGiabanErrorMessage('')}
            renderTextInput={textInputProps => (
              <Input
                {...textInputProps}
                variant="filled"
                label={'Đơn giá'}
                errorMessage={giabanErrorMessage}
                placeholder="Vd: 100.000VNĐ"
                keyboardType="number-pad"
                style={{textAlign: 'right', paddingRight: 10}}
              />
            )}
          />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '50%'}}>
              <CurrencyInput
                delimiter="."
                minValue={0}
                precision={0}
                value={tondau}
                onChangeValue={value => setTondau(value)}
                renderTextInput={textInputProps => (
                  <Input
                    {...textInputProps}
                    variant="filled"
                    label={'SL Tồn'}
                    keyboardType="number-pad"
                    style={{textAlign: 'right', paddingRight: 10}}
                  />
                )}
              />
            </View>
            <View style={{width: '50%'}}>
              <CurrencyInput
                delimiter="."
                minValue={0}
                precision={0}
                value={dudau}
                onChangeValue={value => setDudau(value)}
                renderTextInput={textInputProps => (
                  <Input
                    {...textInputProps}
                    variant="filled"
                    label={'SL Dư'}
                    keyboardType="number-pad"
                    style={{textAlign: 'right', paddingRight: 10}}
                  />
                )}
              />
            </View>
          </View>
        </View>
        <View style={styles.dmcty.buttonCon}>
          <CustomButton
            tg={route.params.tg}
            onPress={() => checkForm()}
            title={'OK'}
            loading={loading}></CustomButton>
        </View>
      </View>
    );
  };

  const renderFormVolume = () => {
    return (
      <View style={styles.dmcty.calendar}>
        <Text style={styles.textH}>Nhập số lượng vật tư</Text>
        <View style={styles.dmcty.input}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '40%'}}>
              <CurrencyInput
                delimiter="."
                minValue={0}
                precision={0}
                value={soluong}
                onChangeValue={value => {
                  setSoluong(value);
                  setTotalPrice(inputGia * value);
                }}
                onChange={() =>
                  soluongErrorMessage && setSoluongErrorMessage('')
                }
                renderTextInput={textInputProps => (
                  <Input
                    {...textInputProps}
                    variant="filled"
                    label={'SL'}
                    errorMessage={soluongErrorMessage}
                    inputStyle={{paddingHorizontal: 10}}
                    keyboardType="decimal-pad"
                  />
                )}
              />
            </View>
            <View style={{width: '60%'}}>
              <CurrencyInput
                delimiter="."
                minValue={0}
                precision={0}
                value={inputGia}
                onChangeValue={value => {
                  setInputGia(value);
                  setTotalPrice(value * soluong);
                }}
                onChange={() =>
                  inputGiaErrorMessage && setInputGiaErrorMessage('')
                }
                renderTextInput={textInputProps => (
                  <Input
                    {...textInputProps}
                    variant="filled"
                    label={'Đơn giá'}
                    errorMessage={inputGiaErrorMessage}
                    inputStyle={{
                      paddingHorizontal: 10,
                      textAlign: 'right',
                    }}
                    keyboardType="number-pad"
                  />
                )}
              />
            </View>
          </View>
          <CurrencyInput
            delimiter="."
            minValue={0}
            precision={0}
            value={totalPrice}
            onChangeValue={value => setTotalPrice(value)}
            onChange={() =>
              totalPriceErrorMessage && setTotalPriceErrorMessage('')
            }
            renderTextInput={textInputProps => (
              <Input
                {...textInputProps}
                variant="filled"
                label={'Thành tiền'}
                errorMessage={totalPriceErrorMessage}
                inputStyle={{paddingHorizontal: 10}}
                keyboardType="number-pad"
              />
            )}
          />
          <Input
            label={'Nội dung'}
            value={note}
            placeholder="*300 từ"
            multiline={true}
            maxLength={300}
            onChangeText={value => {
              setNote(value);
              setNoteLength(value.length);
            }}
          />
          <Text
            style={{
              color: 'grey',
              fontSize: 12,
              fontWeight: 'bold',
              textAlign: 'right',
            }}>
            {noteLength} / 300
          </Text>
        </View>
        <View style={styles.dmcty.buttonCon}>
          <CustomButton
            onPress={() => onSubmitItem()}
            title={'OK'}
            loading={loading}
            tg={route.params.tg}></CustomButton>
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => onPressItem(item)}>
        <View style={styles.hanghoa.itemWrapper}>
          <View style={styles.hanghoa.row}>
            <Text style={styles.textH}>{item.ten_vt}</Text>
            <TouchableOpacity
              onPress={() => onPressEdit(item)}
              style={styles.hanghoa.pressalbeIcon}>
              <Icon
                name="square-edit-outline"
                size={30}
                color={
                  route.params.tg == true
                    ? colors.MAINCOLOR
                    : colors.SECONDCOLOR
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.hanghoa.row}>
            <Text style={styles.text}>{item.ma_vt}</Text>
            {item.ts == '-1' ? (
              <Text style={styles.text}>TS: KCT</Text>
            ) : (
              <Text style={styles.text}>TS: {item.ts}%</Text>
            )}
          </View>
          <View style={styles.hanghoa.row}>
            <Text style={styles.text}>
              SL tồn: {new Intl.NumberFormat('vi-VN').format(item.tondau)}
            </Text>
            <Text style={styles.textH}>
              Giá: {new Intl.NumberFormat('vi-VN').format(item.gia_ban)} /{' '}
              {item.dvt}
            </Text>
          </View>
          <Divider width={1.5}></Divider>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        tg={route.params.tg}
        onPressLeft={() => navigation.goBack()}
        title={'Danh mục vật tư'}
        disableRight={false}
        rightIcon="plus"
        onPressRight={() => onPressThem()}
      />
      <View style={styles.body}>
        <SearchInput
          tg={route.params.tg}
          keyword={keyword}
          onChangeText={value => setKeyword(value)}></SearchInput>
        {isLoading ? (
          <LoadingComponent size={0.8}></LoadingComponent>
        ) : dataRender == '' ? (
          <ReloadComponent
            size={0.8}
            reload={true}
            title={'Không có dữ liệu'}
            tg={route.params.tg}
            onPress={() => onRefresh()}></ReloadComponent>
        ) : (
          <Animated.FlatList
            entering={FadeInDown.duration(1000)}
            data={dataRender}
            renderItem={({item}) => renderItem({item})}
            keyExtractor={item => item.ma_vt}
            refreshing={isLoading}
            onRefresh={() => onRefresh()}
          />
        )}
      </View>
      {/* Modal thêm hàng hoá */}
      <CustomModal
        visible={themModal}
        onPressOutSide={() => setThemModal(!themModal)}
        renderContent={() => renderFormAddProduct()}></CustomModal>
      {/* Modal nhập số lượng */}
      <CustomModal
        visible={soluongModal}
        onPressOutSide={() => setSoluongModal(!soluongModal)}
        renderContent={() => renderFormVolume()}></CustomModal>
    </SafeAreaView>
  );
};

export default Hanghoa;
