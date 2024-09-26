import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import {DataBaoCao} from '.';
import colors from '../../themes/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import navigationStrings from '../../../shared/navigationStrings';
import {useAppDispatch, useAppSelector} from '../../redux/hook';

import {IDataBaoCao} from '../../type/IAcc2k';
import {RootState} from '../../redux/store';
import {getBaoCao} from '../../redux/action/acc2k';

const DetailAcc2k = ({route}: any) => {
  const navigation = useNavigation();
  const data = route.params.data as DataBaoCao;
  const [listBaoCao, setListBaoCao] = useState<IDataBaoCao[]>([]);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    (state: RootState) => state.acc2kSlice.isLoading,
  );
  useEffect(() => {
    //get List Bao cao con
    getData();
  }, [data.idLoai]);

  const getData = async () => {
    if (listBaoCao.length <= 0) {
      dispatch(getBaoCao(data.idLoai)).then(res => {
        const data = res.payload as IDataBaoCao[];
        if (data !== null && data.length > 0) {
          setListBaoCao(data);
        }
      });
    }
  };

  const RenderItem = (item: IDataBaoCao) => {
    return item.ham.length <= 0 && item.spud.length <= 0 ? (
      <View style={styles.lineBreak}>
        <Text style={{color: colors.MAINCOLOR}}>*</Text>
      </View>
    ) : (
      <TouchableOpacity
        style={styles.lineName}
        onPress={() =>
          navigation.navigate({
            name: navigationStrings.FORMBAOCAO,
            params: {data: item},
          } as never)
        }>
        <Text
          style={{
            fontSize: 16,
            color: colors.BLACK,
            textAlign: 'justify',
            width: '90%',
          }}>
          {item.bar}
        </Text>
        <Icon name="keyboard-arrow-right" size={20} color={colors.BLACK} />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
      <Header
        title={data.nameBaoCao}
        onPressLeft={() => navigation.goBack()}
        onPressRight={undefined}
        keyword={undefined}
        onChangeText={undefined}
        style={styles.header}
        titleStyle={styles.titleHeader}
      />
      {!isLoading ? (
        <FlatList
          data={listBaoCao}
          keyExtractor={(_, _index) => `${_index}-baocaocon`}
          renderItem={({item}) => <RenderItem {...item} />}
        />
      ) : (
        <ActivityIndicator size={25} />
      )}
    </SafeAreaView>
  );
};

export default DetailAcc2k;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  titleHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lineName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,

    borderBottomWidth: 0.5,
    backgroundColor: colors.LIGHT_GRAY,
  },
  lineBreak: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
