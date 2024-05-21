import {Text, View, TouchableOpacity, SafeAreaView, Alert} from 'react-native';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useRoute, useNavigation} from '@react-navigation/native';
import {searchObjects} from '../../utils/searchObject';
import React, {useEffect, useState} from 'react';
import styles from '../../themes/styles';
import moment from 'moment-timezone';
import axios from 'axios';
// Shared
import {
  listFilterBR,
  listFilterMV,
  listMact,
} from '../../../shared/dropdownData';
import navigationStrings from '../../../shared/navigationStrings';
import wsStrings from '../../../shared/wsStrings';
import {ehdUrl} from '../../../shared/url';
// Components
import CustomButton, {DeleteButton} from '../../components/CustomButton';
import {showAlert} from '../../components/notifications/showAlert';
import LoadingComponent from '../../components/LoadingComponent';
import ReloadComponent from '../../components/ReloadComponent';
import DropdownList from '../../components/DropdownList';
import Header from '../../components/Header';

const Dshoadon = () => {
  const [data, setData] = useState();
  const [dataRender, setDataRender] = useState();
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [changeList, setChangeList] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    getStoredData();
  }, []);

  useEffect(() => {
    if (data) {
      syncData();
    }
  }, [data]);

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
    const result = searchObjects(data, keyword);
    if (result.length != 0) {
      setDataRender(result);
    } else {
      setDataRender('');
    }
  };

  const storeData = async (link, data) => {
    const key =
      route.params.type +
      link +
      route.params.mst +
      route.params.startDate +
      route.params.endDate;
    const newData = JSON.stringify(data);
    const dataSize = await AsyncStorage.getItem('dataSize');
    var sizeof = require('sizeof');
    const newDataSize = sizeof.sizeof(data) + Number(dataSize);
    try {
      await AsyncStorage.setItem(key, newData);
      await AsyncStorage.setItem('dataSize', newDataSize.toString());
    } catch (error) {
      Alert.alert('Thông báo', 'Không thể lưu trạng thái');
    }
  };

  const getStoredData = async () => {
    if (url) {
      const key =
        route.params.type +
        url +
        route.params.mst +
        route.params.startDate +
        route.params.endDate;
      try {
        const data = await AsyncStorage.getItem(key);
        const newData = JSON.parse(data);
        if (data) {
          setData(newData);
          setDataRender(JSON.parse(JSON.stringify(newData)));
          setLoading(false);
        } else {
          search();
          setLoading(true);
        }
      } catch (error) {
        Alert.alert('Thông báo', 'Không thể tải dữ liệu đã lưu');
      }
    } else {
      const key =
        route.params.type +
        route.params.url +
        route.params.mst +
        route.params.startDate +
        route.params.endDate;
      try {
        const data = await AsyncStorage.getItem(key);
        const newData = JSON.parse(data);
        if (data && data.length > 2) {
          setData(newData);
          setDataRender(JSON.parse(JSON.stringify(newData)));
          setIsLoading(false);
        } else {
          getData();
          if (!isLoading) {
            setIsLoading(true);
          }
        }
      } catch (error) {
        Alert.alert('Thông báo', 'Không thể tải dữ liệu đã lưu');
      }
    }
  };

  const handleDelete = item => {
    Alert.alert('Lưu ý', 'Bạn có chắc muốn xoá hoá đơn?', [
      {text: 'Có', onPress: () => xoaHoaDon(item), style: 'destructive'},
      {text: 'Không', style: 'cancel'},
    ]);
  };

  const handleRefreshList = () => {
    setLoading(true);
    getData();
    setUrl('');
    setKeyword('');
    if (changeList != 'default') {
      setChangeList('default');
    }
  };

  const handleReloadPage = () => {
    setIsLoading(true);
    getData();
    setUrl('');
    setKeyword('');
    if (changeList != 'default') {
      setChangeList('default');
    }
  };

  const onPressSearch = () => {
    setIsLoading(true);
    enableSearch && setEnableSearch(false);
    keyword && setKeyword('');
    if (url) {
      search();
    } else {
      getData();
    }
  };

  const handleDeleteLocal = item => {
    const newData = data.filter(i => i.id !== item.id);
    setData(newData);
  };

  const onPressBH = (type, item) => {
    const navigateData = {
      userName: route.params.userName,
      pwd: route.params.pwd,
      type: route.params.type,
      mst: route.params.mst,
      tg: route.params.tg,
      startDate: route.params.startDate,
      endDate: route.params.endDate,
      ma_dt: item.mst_mua,
      ma_vt: item.ma_vt,
    };
    const navigateLocation =
      type == 'DT' ? navigationStrings.BHDT : navigationStrings.BHVT;
    navigation.navigate(navigateLocation, navigateData);
  };

  const onChangeFilter = item => {
    setData('');
    setDataRender('');
    setUrl(item.value);
    item.type && setChangeList(item.type);
  };

  const navigationHoaDon = item => {
    navigation.navigate(navigationStrings.HD, {
      userName: route.params.userName,
      pwd: route.params.pwd,
      type: route.params.type,
      mst: route.params.mst,
      tg: route.params.tg,
      id: item.id,
      item: item,
    });
  };

  const getData = async () => {
    await axios
      .post(ehdUrl + route.params.url, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        tu_ngay: route.params.startDate,
        den_ngay: route.params.endDate,
        pass_hddt: route.params.pass_hddt,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status) {
          const condition1 =
            'Error: Cannot perform runtime binding on a null reference';
          if (res.Status == condition1) {
            Alert.alert('Thông báo', 'Trang thuế lỗi vui lòng thử lại sau');
          } else {
            Alert.alert('Thông báo', res.Status);
          }
          showAlert('error', 'Lỗi', res.Status);
        } else if (res.length > 0) {
          if (route.params.type == 'BR') {
            const newData = res.filter(item => item.Ma_ct == 'HD');
            setData(newData);
            setDataRender(JSON.parse(JSON.stringify(newData)));
            storeData(route.params.url, newData);
          } else {
            setData(res);
            setDataRender(JSON.parse(JSON.stringify(res)));
            storeData(route.params.url, res);
          }
        }
      })
      .catch(error => {
        switch (error.message) {
          case 'Network Error':
            Alert.alert('Thông báo', 'Lỗi mạng vui lòng kiểm tra lại kết nối');
            break;
          default:
            Alert.alert(
              'Thông báo',
              'Xảy ra lỗi trong quá trình tra cứu\n' + error.message,
            );
            break;
        }
      })
      .finally(() => {
        setIsLoading(false);
        setLoading(false);
      });
  };

  const xoaHoaDon = async item => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_XOAHD, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        id: item.id,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          handleDeleteLocal(item);
        } else {
          showAlert('error', 'Lỗi', res.Status);
        }
      })
      .catch(error => showAlert('error', 'Lỗi', error.message));
  };

  const chuyenMact = async (item, i) => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_CHUYENMACT, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        id: item.id,
        ma_cu: item.Ma_ct,
        ma_moi: i.value,
      })
      .catch(error => showAlert('error', 'Lỗi', error.message));
  };

  const syncData = async () => {
    const IDs = data.map(item => item.id);
    await axios
      .post(ehdUrl + route.params.syncUrl, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        pass_hddt: route.params.pass_hddt,
        tu_ngay: route.params.startDate,
        den_ngay: route.params.endDate,
        chuoi_id: JSON.stringify(IDs),
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.length != 0) {
          var newData = data.concat(res);
          setData(newData);
        }
      });
  };

  const search = async () => {
    await axios
      .post(ehdUrl + url, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        pass_hddt: route.params.pass_hddt,
        tu_ngay: route.params.startDate,
        den_ngay: route.params.endDate,
        ma_vt: '',
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status) {
          Alert.alert('Thông báo', res.Status);
          setData('');
        } else if (res.length > 0) {
          storeData(url, res);
          setData(res);
          setDataRender(JSON.parse(JSON.stringify(res)));
        } else {
          setData('');
          setDataRender('');
        }
      })
      .catch(error => showAlert('error', 'Lỗi', error.message))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRenderItem = item => {
    switch (changeList) {
      case 'nxt':
        return renderNxt(item);
      case 'bhdt':
        return renderBHDT(item);
      case 'bhvt':
        return renderBHVT(item);
      default:
        return renderItem(item);
    }
  };

  const renderNxt = ({item}) => {
    return (
      <View style={styles.dshoadon.itemWrapper}>
        <Text style={styles.text}>
          {item.ma_vt}. {item.ten_vt}
        </Text>
        <View style={styles.dshoadon.row}>
          <Text style={{fontSize: 16}}>
            Tồn đầu: {new Intl.NumberFormat('vi-VN').format(item.ton_dau)}
          </Text>
          <Text style={{fontSize: 16}}>
            Nhập: {new Intl.NumberFormat('vi-VN').format(item.sl_nhap)}
          </Text>
        </View>
        <View style={styles.dshoadon.row}>
          <Text style={{fontSize: 16}}>
            Tồn cuối: {new Intl.NumberFormat('vi-VN').format(item.ton_cuoi)}
          </Text>
          <Text style={{fontSize: 16}}>
            Xuất: {new Intl.NumberFormat('vi-VN').format(item.sl_xuat)}
          </Text>
        </View>
      </View>
    );
  };

  const renderBHDT = ({item}) => {
    return (
      <TouchableOpacity onPress={() => onPressBH((type = 'DT'), item)}>
        <View style={styles.dshoadon.itemWrapper}>
          <Text style={styles.text}>{item.ten_nguoi_mua}</Text>
          <View style={styles.row}>
            <Text style={{fontSize: 16}}>MST: {item.mst_mua}</Text>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {new Intl.NumberFormat('vi-VN').format(item.tien) ||
                'Không có thông tin'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBHVT = ({item}) => {
    return (
      <TouchableOpacity onPress={() => onPressBH((type = 'VT'), item)}>
        <View style={styles.dshoadon.itemWrapper}>
          <Text style={styles.text}>{item.ten_vt}</Text>
          <View style={styles.row}>
            <Text style={{fontSize: 16}}>Mã: {item.ma_vt}</Text>
            <Text style={{fontSize: 16}}>ĐVT: {item.dvt}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {new Intl.NumberFormat('vi-VN').format(item.tien)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => {
    const ngayct = moment(item.Ngay_ct).format('DD-MM-YYYY');
    const renderRightActions = () => {
      return <DeleteButton onPress={() => handleDelete(item)} />;
    };
    if (route.params.type == 'MV') {
      return (
        <GestureHandlerRootView>
          <Swipeable renderRightActions={() => renderRightActions()}>
            <TouchableOpacity onPress={() => navigationHoaDon(item)}>
              <View style={styles.dshoadon.itemWrapper}>
                <Text style={styles.text}>{item.ten_nguoi_ban}</Text>
                <View style={styles.row}>
                  <Text style={{fontSize: 16}}>Ngày: {ngayct}</Text>
                  <Text style={{fontSize: 16}}>MST: {item.mst_ban}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{fontSize: 16}}>
                    Seri: {item.So_seri || item.so_seri}
                  </Text>
                  <Text style={{fontSize: 16}}>
                    Số hoá đơn: {item.So_ct || item.so_ct}
                  </Text>
                </View>
                <View style={styles.row}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.text}>Mã chứng từ: </Text>
                    <DropdownList
                      data={listMact}
                      placeholder="--"
                      value={item.Ma_ct}
                      onChange={i => chuyenMact(item, i)}
                      style={styles.dshoadon.dropdown}
                      tg={route.params.tg}
                      containerStyle={
                        styles.dshoadon.containerStyle1
                      }></DropdownList>
                  </View>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    {new Intl.NumberFormat('vi-VN').format(
                      item.Ttien || item.ttien,
                    )}{' '}
                    {item.DVTTe}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Swipeable>
        </GestureHandlerRootView>
      );
    } else {
      return (
        <GestureHandlerRootView>
          <Swipeable renderRightActions={() => renderRightActions()}>
            <TouchableOpacity onPress={() => navigationHoaDon(item)}>
              <View style={styles.dshoadon.itemWrapper}>
                <Text style={styles.text}>{item.ten_nguoi_mua}</Text>
                <View style={styles.row}>
                  <Text style={{fontSize: 16}}>Ngày chứng từ: {ngayct}</Text>
                  <Text style={{fontSize: 16}}>MST: {item.mst_mua}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={{fontSize: 16}}>Seri: {item.So_seri}</Text>
                  <Text style={{fontSize: 16}}>Số hoá đơn: {item.So_ct}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    {new Intl.NumberFormat('vi-VN').format(item.Ttien)}{' '}
                    {item.DVTTe}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Swipeable>
        </GestureHandlerRootView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        tg={route.params.tg}
        onPressLeft={() => navigation.goBack()}
        title={route.params.title}
        disableRight={isLoading ? true : false}
        rightIcon="magnify"
        onPressRight={() => setEnableSearch(!enableSearch)}
        searchBar={!data ? false : enableSearch}
        onChangeText={value => setKeyword(value)}
      />
      <View style={styles.dshoadon.body}>
        <View style={styles.dshoadon.filterCon}>
          <DropdownList
            data={route.params.type == 'MV' ? listFilterMV : listFilterBR}
            placeholder="Xem báo cáo khác"
            maxHeight={700}
            value={url}
            onChange={item => onChangeFilter(item)}
            style={styles.dshoadon.dropdownFilter}
            containerStyle={styles.dshoadon.containerStyle}
            tg={route.params.tg}></DropdownList>
          <CustomButton
            onPress={() => onPressSearch()}
            title="Tra cứu"
            tg={route.params.tg}
            buttonStyle={styles.dshoadon.button}></CustomButton>
        </View>
        {isLoading ? (
          <LoadingComponent size={0.7}></LoadingComponent>
        ) : !data ? (
          <ReloadComponent
            size={0.7}
            tg={route.params.tg}
            title={'Không có dữ liệu\n'}
            reload={true}
            onPress={() => handleReloadPage()}></ReloadComponent>
        ) : (
          <Animated.FlatList
            entering={FadeIn.duration(1000)}
            exiting={FadeOut.duration(1000)}
            data={dataRender}
            renderItem={({item}) => handleRenderItem({item})}
            keyExtractor={item => item.index}
            windowSize={30}
            refreshing={loading}
            onRefresh={() => handleRefreshList()}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Dshoadon;
