import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import navigationStrings from '../../../shared/navigationStrings';
import {searchObjects} from '../../utils/searchObject';
import {useNavigation} from '@react-navigation/native';
import {useData} from '../../navigation/DataContext';
import React, {useEffect, useState} from 'react';
import Contacts from 'react-native-contacts';
import copyText from '../../utils/copyText';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import moment from 'moment-timezone';
import {Divider} from '@rneui/base';
import {Input} from '@rneui/themed';
import axios from 'axios';
import _ from 'lodash';
// Shared
import {listLoai, listTinh} from '../../../shared/dropdownData';
import wsStrings from '../../../shared/wsStrings';
import {ehdUrl} from '../../../shared/url';
// Components
import {CalendarModal, CustomModal} from '../../components/CustomModal';
import {showAlert} from '../../components/notifications/showAlert';
import LoadingComponent from '../../components/LoadingComponent';
import ReloadComponent from '../../components/ReloadComponent';
import LoadingScreen from '../../components/LoadingScreen';
import CustomButton from '../../components/CustomButton';
import DropdownList from '../../components/DropdownList';
import Header from '../../components/Header';

const Dangkykinhdoanh = () => {
  const navigation = useNavigation();
  const {userData} = useData();
  const [data, setData] = useState('');
  const [defaultData, setDefaultData] = useState('');
  const [pickDate, setPickDate] = useState();
  const [pickLoai, setPickLoai] = useState('1');
  const [pickTinh, setPickTinh] = useState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mst, setMst] = useState('');
  const [note, setNote] = useState('');
  const [masp, setMasp] = useState('');
  const [itemInfo, setItemInfo] = useState('');
  const [keyword, setKeyword] = useState('');
  const [editContact, setEditContact] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [xemLoading, setXemLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [optionModal, setOptionModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const currentDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');

  useEffect(() => {
    getStoredForm();
  }, []);

  useEffect(() => {
    if (enableSearch) {
      if (keyword) {
        searchObject();
      } else {
        setData(defaultData);
      }
    } else {
      if (keyword) {
        setKeyword('');
      }
    }
  }, [keyword]);

  const onPressXem = () => {
    if (!pickDate && !pickLoai && !pickTinh) {
      const type = 'error';
      const title = 'Form không được để trống';
      showAlert(type, title);
    } else if (!pickDate) {
      const type = 'error';
      const title = 'Vui lòng chọn ngày';
      showAlert(type, title);
    } else if (!pickLoai) {
      const type = 'error';
      const title = 'Vui lòng chọn loại';
      showAlert(type, title);
    } else if (!pickTinh) {
      const type = 'error';
      const title = 'Vui lòng chọn tỉnh';
      showAlert(type, title);
    } else {
      checkAndroidContactPermission();
    }
  };

  const onPressItem = (item, type) => {
    getItemInfo(item).then(() => {
      chooseType(item.ngaygoi, type);
    });
  };

  const onPressNganh = item => {
    navigation.navigate(navigationStrings.BUSINESS, {
      userName: userData.userName,
      pwd: userData.pwd,
      mst: item.mst,
    });
  };

  const onPressView = item => {
    setPdfLoading(true);
    xemPdf(item);
  };

  const onSubmitNote = () => {
    setNoteLoading(true);
    updateMakeCall('edit');
  };

  const onChangeDropDown = (item, type) => {
    if (type == 'L') {
      setPickLoai(item.value);
    } else {
      setPickTinh(item.value);
    }
    data && setData('');
    defaultData && setDefaultData('');
  };

  const getItemInfo = item => {
    return new Promise(resole => {
      if (item.lien_he.includes('(') && item.lien_he.includes(')')) {
        setEditContact(true);
      } else {
        setEditContact(false);
      }
      setPhoneNumber(item.tel);
      setMst(item.mst);
      setMasp(item.ma_sp);
      setNote(item.ghi_chu);
      setItemInfo(item);
      resole();
    });
  };

  const chooseType = (date, type) => {
    switch (type) {
      case 'option':
        setOptionModal(true);
        break;
      case 'edit':
        if (date) {
          setNoteModal(true);
        } else {
          const type = 'info';
          const title = 'Không thể ghi chú SĐT chưa gọi';
          showAlert(type, title);
        }
        break;
    }
  };

  const directCall = item => {
    Linking.openURL(`tel:${item.tel}`).then(async () => {
      await axios
        .post(ehdUrl + wsStrings.DKKD_UPDATECALL, {
          token: '@acc2k',
          username: userData.userName,
          password: userData.pwd,
          tel: item.tel,
          masp: item.ma_sp,
          ghichu: item.ghi_chu,
        })
        .then(response => {
          if (response.data.d == 'Ok') {
            const newData = data.map(i => {
              if (i.mst == item.mst) {
                i.ngaygoi = currentDate;
                return i;
              }
              return i;
            });
            setData(newData);
          }
        });
    });
  };

  const makeCall = type => {
    Linking.openURL(`tel:${phoneNumber}`).then(() => {
      updateMakeCall(type);
      if (optionModal) {
        setOptionModal(false);
      }
    });
  };
  // Kiểm tra quyền truy cập danh bạ
  const checkContactsPermission = () => {
    Contacts.checkPermission().then(permission => {
      if (permission === 'undefined') {
        Contacts.requestPermission().then(permission => {
          if (permission === 'authorized') {
            addPhoneNumbertoContact();
          }
        });
      } else if (permission === 'authorized') {
        addPhoneNumbertoContact();
      } else if (permission === 'denied') {
        Alert.alert(
          'Lưu ý',
          'Để làm điều này bạn cần cấp quyền cho ứng dụng truy cập vào danh bạ máy. Hướng dẫn: Cài đặt > Vsign > Danh bạ',
        );
      }
    });
  };

  // Kiểm tra quyền truy cập danh bạ đối với thiết bị Android
  const checkAndroidContactPermission = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Danh bạ',
      message: 'Yêu cầu quyền truy cập danh bạ để sự dụng chức năng này',
      buttonPositive: 'Xác nhận',
    }).then(res => {
      if (res == 'granted') {
        setXemLoading(true);
        setEnableSearch(false);
        tracuu();
      } else {
        Alert.alert(
          'Lưu ý',
          'Để làm điều này bạn cần cấp quyền cho ứng dụng truy cập vào danh bạ máy. Hướng dẫn: Cài đặt > Vsign > Danh bạ',
        );
      }
    });
  };

  // Lưu thông tin đối tượng vào danh bạ
  const addPhoneNumbertoContact = () => {
    if (editContact) {
      Contacts.getContactsByPhoneNumber(phoneNumber).then(res => {
        if (res.length >= 1) {
          Contacts.viewExistingContact(res[0]);
        }
      });
    } else {
      // Tạo thông tin người dùng
      const newContact = {
        company: itemInfo.ten_cty,
        emailAddresses: [
          {
            label: 'work',
            email: itemInfo.email,
          },
        ],
        familyName: '',
        givenName: itemInfo.lien_he,
        phoneNumbers: [
          {
            label: 'mobile',
            number: phoneNumber,
          },
        ],
      };
      Contacts.openContactForm(newContact)
        .then(result => {
          if (result) {
            setOptionModal(false);
            const type = 'success';
            const title = 'Đã lưu vào danh bạ';
            showAlert(type, title);
          }
        })
        .catch(e => {
          Alert.alert('Thông báo', 'Không thể thêm số điện thoại vào danh bạ');
        });
    }
  };

  // So sánh tất cả sđt của dữ liệu từ ws với danh bạ nếu có số trùng thì ghi chú
  const compareSavedPhoneNumber = async data => {
    Promise.all(
      data.map(item => {
        return Contacts.getContactsByPhoneNumber(item.tel).then(result => {
          if (result.length >= 1) {
            item.lien_he = item.lien_he + ' (' + result[0].givenName + ')';
          }
          return item;
        });
      }),
    ).then(newData => {
      if (newData) {
        setDefaultData(JSON.parse(JSON.stringify(newData)));
        setData(newData);
      }
      setXemLoading(false);
    });
  };

  const handleDateChange = date => {
    if (date) {
      setPickDate(moment(date).format('YYYY-MM-DD'));
      setCalendarModal(false);
      defaultData && setDefaultData('');
      data && setData('');
    }
  };

  const openPdf = url => {
    setPdfLoading(false);
    navigation.navigate(navigationStrings.WEBSCREEN, {
      tg: true,
      url: url,
      title: 'Giấy đăng ký kinh doanh',
    });
  };

  // Mặc định chọn ngày trước đó
  const setDefaultDate = () => {
    const date = moment(currentDate).subtract(1, 'days').format('YYYY-MM-DD');
    setPickDate(date);
  };

  const setToDayDate = () => {
    const date = moment(currentDate).format('YYYY-MM-DD');
    setPickDate(date);
    setCalendarModal(false);
    defaultData && setDefaultData('');
    data && setData('');
  };

  // Lưu form tìm kiếm
  const storeForm = async () => {
    try {
      await AsyncStorage.setItem('dkkd_ngay', pickDate);
      await AsyncStorage.setItem('dkkd_loai', pickLoai);
      await AsyncStorage.setItem('dkkd_tinh', pickTinh);
    } catch (error) {
      Alert.alert(
        'Thông báo',
        'Xảy ra lỗi khi lưu trạng thái\n' + 'Lỗi: ' + error.message,
      );
    }
  };

  const searchObject = () => {
    const result = searchObjects(defaultData, keyword);
    if (result) {
      setData(result);
    } else {
      setData('');
    }
  };

  // Lấy dữ liệu tìm kiếm gần nhất
  const getStoredForm = async () => {
    try {
      const ngay = await AsyncStorage.getItem('dkkd_ngay');
      const loai = await AsyncStorage.getItem('dkkd_loai');
      const tinh = await AsyncStorage.getItem('dkkd_tinh');
      if (ngay && loai && tinh) {
        setPickDate(ngay);
        setPickLoai(loai);
        setPickTinh(tinh);
      } else {
        setDefaultDate();
      }
    } catch (e) {
      Alert.alert(
        'Thông báo',
        'Không thể cập nhật trạng thái\n' + 'Lỗi: ' + e.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const tracuu = async () => {
    await axios
      .post(ehdUrl + wsStrings.DKKD_TRACUU, {
        token: '@acc2k',
        username: userData.userName,
        password: userData.pwd,
        ngay: pickDate,
        loai: pickLoai,
        tinh: pickTinh,
      })
      .then(response => {
        if (response.data.d.length > 2) {
          const res = JSON.parse(response.data.d);
          compareSavedPhoneNumber(res);
        } else {
          Alert.alert('Thông báo', 'Không có dữ liệu');
          setXemLoading(false);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi khi tra cứu thông tin\n' + 'Lỗi: ' + error.message,
        );
      })
      .finally(() => {
        storeForm();
      });
  };

  const updateMakeCall = async type => {
    await axios
      .post(ehdUrl + wsStrings.DKKD_UPDATECALL, {
        token: '@acc2k',
        username: userData.userName,
        password: userData.pwd,
        tel: phoneNumber,
        masp: masp,
        ghichu: note,
      })
      .then(response => {
        if (response.data.d == 'Ok') {
          if (type == 'call') {
            const newData = data.map(i => {
              if (i.mst == mst) {
                i.ngaygoi = currentDate;
                return i;
              }
              return i;
            });
            setData(newData);
            setDefaultData(JSON.parse(JSON.stringify(newData)));
          } else {
            const newData = data.map(i => {
              if (i.mst == mst) {
                i.ma_sp = masp;
                i.ghi_chu = note;
                return i;
              }
              return i;
            });
            setData(newData);
            setNoteLoading(false);
            setNoteModal(false);
            setDefaultData(JSON.parse(JSON.stringify(newData)));
          }
        }
      });
  };

  const updateUnCall = async item => {
    await axios
      .post(ehdUrl + wsStrings.DKKD_UNCALL, {
        token: '@acc2k',
        username: userData.userName,
        password: userData.pwd,
        tel: item.tel,
      })
      .then(response => {
        if (response.data.d == 'Ok') {
          const newData = data.map(i => {
            if (i.mst == item.mst) {
              i.ngaygoi = '';
              return i;
            }
            return i;
          });
          setData(newData);
        }
      });
  };

  const xemPdf = async item => {
    await axios
      .post(ehdUrl + wsStrings.DKKD_XEMPDF, {
        token: '@acc2k',
        username: userData.userName,
        password: userData.pwd,
        mst: item.mst,
      })
      .then(response => {
        if (response.data.d) {
          const parts = response.data.d.split('\\');
          const index = parts.indexOf('ehoadondientu.com');
          const url = 'https://' + parts.slice(index).join('/');
          const newUrl = url.replace('httpdocs/', '');
          openPdf(newUrl);
        } else {
          Alert.alert('Thông báo', 'Không có file PDF', [
            {text: 'OK', onPress: () => setPdfLoading(false)},
          ]);
        }
      })
      .catch(e => {
        Alert.alert('Thông báo', 'Không thể xem file', [
          {text: 'OK', onPress: () => setPdfLoading(false)},
        ]);
      });
  };

  const renderFormEditNote = () => {
    return (
      <View style={styles.dmcty.calendar}>
        <Text style={styles.textH}>Nhập ghi chú{'\n'}</Text>
        <Input
          label="Mã SP"
          value={masp}
          onChangeText={text => setMasp(text)}
          maxLength={50}
        />
        <Input
          label="Nội dung (200 từ)"
          value={note}
          onChangeText={text => setNote(text)}
          maxLength={200}
          multiline={true}
        />
        <View style={styles.dmcty.buttonCon}>
          <CustomButton
            title="Xác nhận"
            loading={noteLoading}
            buttonStyle={{borderRadius: 30, width: 120}}
            onPress={() => onSubmitNote(data)}></CustomButton>
        </View>
      </View>
    );
  };

  const renderBottomMenu = () => {
    return (
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        style={styles.dkkd.bottomModal}>
        <TouchableOpacity onPress={() => makeCall('call')}>
          <View style={styles.dmcty.row}>
            <Text style={styles.highlight}>Gọi {phoneNumber}</Text>
          </View>
        </TouchableOpacity>
        <Divider width={1.5}></Divider>
        <TouchableOpacity
          onPress={() => {
            copyText(phoneNumber), setOptionModal(false);
          }}>
          <View style={styles.dmcty.row}>
            <Text style={styles.highlight}>Sao chép </Text>
            <Icon
              name={'arrange-send-backward'}
              size={30}
              color={colors.MAINCOLOR}></Icon>
          </View>
        </TouchableOpacity>
        <Divider width={1.5}></Divider>
        <TouchableOpacity onPress={() => checkContactsPermission()}>
          <View style={styles.dmcty.row}>
            <Text style={styles.highlight}>
              {editContact ? 'Sửa thông tin liên hệ ' : 'Thêm vào danh bạ '}
            </Text>
            <Icon
              name={'contacts-outline'}
              size={30}
              color={colors.MAINCOLOR}></Icon>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderItem = ({item}) => {
    const enableCall = item.tel.includes('*');
    const renderRightActions = () => {
      return (
        <TouchableOpacity
          onPress={() => onPressItem(item, 'edit')}
          style={styles.dkkd.swipeButton}>
          <Icon name="square-edit-outline" size={40} color={colors.WHITE} />
        </TouchableOpacity>
      );
    };

    return (
      <GestureHandlerRootView>
        <Swipeable renderRightActions={() => renderRightActions()}>
          <View style={styles.ehd.itemWrapper}>
            <View style={styles.row}>
              <Text style={styles.textH}>
                {moment(item.ngay).format('DD/MM/YYYY')}
              </Text>
              <Text style={styles.textH}>MST: {item.mst}</Text>
              <TouchableOpacity
                onPress={() => onPressView(item)}
                style={styles.ehd.button}>
                <Icon
                  name="eye-outline"
                  size={35}
                  color={colors.MAINCOLOR}></Icon>
              </TouchableOpacity>
            </View>
            <Text style={styles.textH}>{item.ten_cty}</Text>
            <Text style={styles.text}>Địa chỉ: {item.dia_chi}</Text>
            {item.email && <Text style={styles.text}>Email: {item.email}</Text>}
            <Text style={styles.text}>Liên hệ: {item.lien_he}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.text}>Tel: </Text>
              {enableCall ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL('tel:19007105')}
                  style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={styles.text}>{item.tel} </Text>
                  <Text style={styles.textU}>Liên hệ </Text>
                </TouchableOpacity>
              ) : (
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <TouchableOpacity
                    onPress={() => directCall(item)}
                    onLongPress={() => onPressItem(item, 'option')}>
                    <Text style={styles.textU}>
                      {item.tel}
                      {'  '}
                    </Text>
                  </TouchableOpacity>
                  {item.ngaygoi && (
                    <TouchableOpacity onPress={() => updateUnCall(item)}>
                      <Icon
                        name="check"
                        size={25}
                        color={colors.MAINCOLOR}></Icon>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            {item.ghi_chu && (
              <Text style={styles.text}>Ghi chú: {item.ghi_chu}</Text>
            )}
            <View style={styles.row}>
              <Text style={styles.text}>{item.ma_sp}</Text>
              <TouchableOpacity onPress={() => onPressNganh(item)}>
                <Text style={styles.textU}>Ngành</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Divider width={1.5}></Divider>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={'Đăng ký kinh doanh'}
        disableRight={xemLoading ? true : false}
        rightIcon="magnify"
        onPressRight={() => setEnableSearch(!enableSearch)}
        searchBar={enableSearch}
        onChangeText={value => setKeyword(value)}
      />
      {loading ? (
        <LoadingComponent size={0.9}></LoadingComponent>
      ) : (
        <Animated.View entering={FadeIn.duration(1000)} style={styles.body}>
          <View style={styles.dmcty.row}>
            <Text style={styles.textH}>Ngày: </Text>
            <Text style={styles.text}>
              {' '}
              {moment(pickDate).format('DD/MM/YYYY') || ''}
            </Text>
            <TouchableOpacity onPress={() => setCalendarModal(true)}>
              <Icon name="calendar" size={35} color={colors.MAINCOLOR}></Icon>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={styles.dmcty.row}>
              <DropdownList
                data={listLoai}
                style={styles.dkkd.dropdownLoai}
                placeholder="Chọn loại"
                value={pickLoai}
                onChange={item => onChangeDropDown(item, 'L')}
                containerStyle={styles.dkkd.containerLoai}></DropdownList>
            </View>
            <View style={styles.dmcty.row}>
              <DropdownList
                data={listTinh}
                style={styles.tdt.dropdown}
                placeholder="Chọn tỉnh"
                search={true}
                inputSearchStyle={styles.dropdownSearch}
                maxHeight={350}
                value={pickTinh}
                onChange={item => onChangeDropDown(item, 'T')}
                containerStyle={styles.dkkd.containerTinh}></DropdownList>
            </View>
          </View>
          <View style={styles.dmcty.row}>
            <CustomButton
              onPress={() => onPressXem()}
              title="Tra cứu"
              loading={xemLoading}></CustomButton>
          </View>
          {data ? (
            <Animated.FlatList
              style={styles.dkkd.list}
              entering={FadeIn.duration(1000)}
              exiting={FadeOut.duration(1000)}
              data={data}
              extraData={data}
              renderItem={({item}) => renderItem({item})}
              keyExtractor={item => item.mst}
              windowSize={20}
            />
          ) : (
            <ReloadComponent
              size={0.5}
              title={'Không có dữ liệu'}></ReloadComponent>
          )}
        </Animated.View>
      )}
      {pdfLoading && <LoadingScreen></LoadingScreen>}
      {/* Modal lịch */}
      <CalendarModal
        visible={calendarModal}
        onPressOutside={() => setCalendarModal(!calendarModal)}
        onDateChange={date => handleDateChange(date)}
        onSubmit={() => setToDayDate()}
        buttonTitle={'Hôm nay'}
        buttonStyle={{borderRadius: 30, width: 200}}></CalendarModal>
      {/* Modal nhập ghi chú */}
      <CustomModal
        visible={noteModal}
        onPressOutSide={() => setNoteModal(!noteModal)}
        renderContent={() => renderFormEditNote()}></CustomModal>
      {/* Bottom Menu */}
      <CustomModal
        type="bottom"
        visible={optionModal}
        onPressOutSide={() => setOptionModal(!optionModal)}
        renderContent={() => renderBottomMenu()}></CustomModal>
    </SafeAreaView>
  );
};

export default Dangkykinhdoanh;
