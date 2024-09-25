import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hook';
import {RootState} from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  IAccountAcc2k,
  ILoadMoreDoiTuong,
  ILoadMoreTaiKhoan,
  ILoadMoreVatTu,
} from '../../type/IAcc2k';
import colors from '../../themes/colors';
import {Input} from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import removeDiacritics from '../../utils/removeDiacritics';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {getLoadMore} from '../../redux/action/acc2k';

type PropFlatList = {
  data: ListRenderItemInfo<
    ILoadMoreTaiKhoan | ILoadMoreDoiTuong | ILoadMoreVatTu
  >;
};

const LoadMoreList = ({route}: any) => {
  const navigation = useNavigation();
  const {typeList, setValue} = route.params;
  const [listData, setListData] = useState<
    ILoadMoreTaiKhoan[] | ILoadMoreDoiTuong[] | ILoadMoreVatTu[]
  >([]);
  const [listTaiKhoan, setListTaiKhoan] = useState<ILoadMoreTaiKhoan[]>([]);
  const [listDoiTuong, setListDoiTuong] = useState<ILoadMoreDoiTuong[]>([]);
  const [listVatTu, setListVatTu] = useState<ILoadMoreVatTu[]>([]);
  const dispatch = useAppDispatch();
  const {
    loadMoreTaiKhoan,
    loadMoreDoiTuong,
    loadMoreVatTu,
    selectData,
    isLoading,
  } = useAppSelector((state: RootState) => state.acc2kSlice);
  const titleHeader =
    typeList === 'dmtk'
      ? 'Tài khoản'
      : typeList === 'dmdt'
      ? 'Đối tượng'
      : 'Vật tư';

  useEffect(() => {
    getListData();
  }, [typeList]);

  const getListData = async () => {
    const accountAcc2k = await AsyncStorage.getItem('ACC2K');
    // always !== null
    const jsonParse = JSON.parse(accountAcc2k!) as IAccountAcc2k;
    const data = {
      ...jsonParse,
      data: selectData.data,
      typeList,
    };
    if (typeList === 'dmtk') {
      if (loadMoreTaiKhoan.length <= 0) {
        dispatch(getLoadMore(data)).then(res => {
          setListData(res.payload as any);
          setListTaiKhoan(res.payload as any);
        });
      } else {
        setListData(loadMoreTaiKhoan);
        setListTaiKhoan(loadMoreTaiKhoan);
      }
    } else if (typeList === 'dmdt') {
      if (loadMoreDoiTuong.length <= 0) {
        dispatch(getLoadMore(data)).then(res => {
          setListData(res.payload as any);
          setListDoiTuong(res.payload as any);
        });
      } else {
        setListData(loadMoreDoiTuong);
        setListDoiTuong(loadMoreDoiTuong);
      }
    } else {
      if (loadMoreVatTu.length <= 0) {
        dispatch(getLoadMore(data)).then(res => {
          setListData(res.payload as any);
          setListVatTu(res.payload as any);
        });
      } else {
        setListData(loadMoreVatTu);
        setListVatTu(loadMoreVatTu);
      }
    }
  };

  const RenderItemList = memo(
    (data: PropFlatList) => {
      if (typeList === 'dmtk') {
        const dataTK = data.data.item as ILoadMoreTaiKhoan;
        return (
          <View style={styles.itemList}>
            <View style={styles.leftLine}>
              <Text style={[styles.text, styles.textTitle]}>
                {dataTK.ten_tk}
              </Text>
              <Text style={styles.text}>Mã: {dataTK.tk}</Text>
            </View>
            <View style={styles.rightLine}>
              <TouchableOpacity
                style={styles.touchChoose}
                onPress={() => handleChoose(dataTK.tk)}>
                <Text style={[styles.text, {color: colors.WHITE}]}>Chọn</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else if (typeList === 'dmdt') {
        const dataDT = data.data.item as ILoadMoreDoiTuong;
        return (
          <View style={styles.itemList}>
            <View style={styles.leftLine}>
              <Text style={[styles.text, styles.textTitle]}>
                {dataDT.ten_dt}
              </Text>
              <Text style={styles.text}>Mã đối tượng: {dataDT.ma_dt}</Text>
              <Text style={styles.text}>Mã số thuế: {dataDT.ma_so_thue}</Text>
            </View>
            <View style={styles.rightLine}>
              <TouchableOpacity
                style={styles.touchChoose}
                onPress={() => handleChoose(dataDT.ma_dt)}>
                <Text style={[styles.text, {color: colors.WHITE}]}>Chọn</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        const dataVT = data.data.item as ILoadMoreVatTu;
        return (
          <View style={styles.itemList}>
            <View style={styles.leftLine}>
              <Text style={[styles.text, styles.textTitle]}>
                {dataVT.ten_vt}
              </Text>
              <Text style={styles.text}>Mã vật tư: {dataVT.ma_vt}</Text>
            </View>
            <View style={styles.rightLine}>
              <TouchableOpacity
                style={styles.touchChoose}
                onPress={() => handleChoose(dataVT.ma_vt)}>
                <Text style={[styles.text, {color: colors.WHITE}]}>Chọn</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    },
    (prevProps, nextProps) => {
      return prevProps.data === nextProps.data;
    },
  );
  const onChangeFilter = (text: any) => {
    if (text.length > 0) {
      if (typeList === 'dmtk') filterTaiKhoan(text);
      else if (typeList === 'dmdt') filterDoiTuong(text);
      else filterVatTu(text);
    } else {
      if (typeList === 'dmtk') setListTaiKhoan(listData as ILoadMoreTaiKhoan[]);
      else if (typeList === 'dmdt')
        setListDoiTuong(listData as ILoadMoreDoiTuong[]);
      else setListVatTu(listData as ILoadMoreVatTu[]);
    }
  };

  const filterTaiKhoan = (text: any) => {
    const data = listData as ILoadMoreTaiKhoan[];
    if (text == Number(text)) {
      const tempList = data.filter(x => {
        return x.tk.trim().includes(text.trim());
      });
      setListTaiKhoan(tempList);
    } else {
      const tempList = data.filter(x => {
        const ten_tk = removeDiacritics(x.ten_tk.toLocaleLowerCase().trim());
        return ten_tk.includes(
          removeDiacritics(text.toLocaleLowerCase().trim()),
        );
      });
      setListTaiKhoan(tempList);
    }
  };

  const filterDoiTuong = (text: any) => {
    const data = listData as ILoadMoreDoiTuong[];
    if (text == Number(text)) {
      const tempList = data.filter(x => {
        return x.ma_so_thue.trim().includes(text.trim());
      });
      setListDoiTuong(tempList);
    } else {
      const tempList = data.filter(x => {
        const ten_dt = removeDiacritics(x.ten_dt.toLocaleLowerCase().trim());
        const filterByTenDT = ten_dt.includes(
          removeDiacritics(text.toLocaleLowerCase().trim()),
        );
        if (filterByTenDT) {
          return filterByTenDT;
        } else {
          const ma_dt = removeDiacritics(x.ma_dt.toLocaleLowerCase().trim());
          const filterByMaDT = ma_dt.includes(
            removeDiacritics(text.toLocaleLowerCase().trim()),
          );
          return filterByMaDT;
        }
      });
      setListDoiTuong(tempList);
    }
  };

  const filterVatTu = (text: any) => {
    const data = listData as ILoadMoreVatTu[];
    const tempList = data.filter(x => {
      const ten_vt = removeDiacritics(x.ten_vt.toLocaleLowerCase().trim());
      const filterByTenVT = ten_vt.includes(
        removeDiacritics(text.toLocaleLowerCase().trim()),
      );
      if (filterByTenVT) {
        return filterByTenVT;
      } else {
        const ma_vt = removeDiacritics(x.ma_vt.toLocaleLowerCase().trim());
        const filterByMaVT = ma_vt.includes(
          removeDiacritics(text.toLocaleLowerCase().trim()),
        );
        return filterByMaVT;
      }
    });
    setListVatTu(tempList);
  };

  const handleChoose = (value: string) => {
    setValue(value);
    navigation.goBack();
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
      <Header
        title={`Chọn ${titleHeader}`}
        onPressLeft={() => navigation.goBack()}
        onPressRight={undefined}
        keyword={undefined}
        onChangeText={undefined}
        style={styles.header}
      />
      {!isLoading ? (
        <>
          <View style={styles.viewSearch}>
            <Input
              placeholder="Tìm kiếm"
              rightIcon={<Icon name="search" size={25} />}
              onChangeText={text => onChangeFilter(text)}
            />
          </View>
          {typeList === 'dmtk' && (
            <FlashList
              data={listTaiKhoan}
              keyExtractor={(_, index) => `itemList-${index}`}
              renderItem={data => <RenderItemList data={data} />}
              estimatedItemSize={1000}
            />
          )}
          {typeList === 'dmdt' && (
            <FlashList
              data={listDoiTuong}
              keyExtractor={(_, index) => `itemList-${index}`}
              renderItem={data => <RenderItemList data={data} />}
              estimatedItemSize={1000}
            />
          )}
          {typeList === 'dmvt' && (
            <FlashList
              data={listVatTu}
              keyExtractor={(_, index) => `itemList-${index}`}
              renderItem={data => <RenderItemList data={data} />}
              estimatedItemSize={1000}
            />
          )}
        </>
      ) : (
        <ActivityIndicator
          size={25}
          color={colors.MAINCOLOR}
          style={{alignSelf: 'center', paddingTop: 20}}
        />
      )}
    </SafeAreaView>
  );
};

export default LoadMoreList;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  viewSearch: {},
  itemList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 0.3,
  },
  leftLine: {
    width: '80%',
  },
  rightLine: {},
  text: {
    color: colors.BLACK,
    fontSize: 15,
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 10,
  },
  touchChoose: {
    backgroundColor: colors.SECONDCOLOR,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
