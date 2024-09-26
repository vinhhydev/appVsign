import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import navigationStrings from '../../../shared/navigationStrings';
import colors from '../../themes/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

export type DataBaoCao = {
  idLoai: number;
  nameBaoCao: string;
};

const Acc2k = () => {
  const navigation = useNavigation();

  const dataAcc2k: DataBaoCao[] = [
    {
      idLoai: 1,
      nameBaoCao: 'Sổ sách kế toán',
    },
    {
      idLoai: 3,
      nameBaoCao: 'Báo cáo công nợ',
    },
    {
      idLoai: 4,
      nameBaoCao: 'Báo cáo TSCĐ',
    },
    {
      idLoai: 5,
      nameBaoCao: 'Báo cáo vật tư hàng hóa',
    },
    {
      idLoai: 6,
      nameBaoCao: 'Báo cáo chi phí giá thành',
    },
    {
      idLoai: 8,
      nameBaoCao: 'Báo cáo thuế',
    },
    {
      idLoai: 9,
      nameBaoCao: 'Báo cáo tài chính',
    },
    {
      idLoai: 10,
      nameBaoCao: 'Báo cáo quản trị',
    },
    {
      idLoai: 14,
      nameBaoCao: 'Báo cáo tiền lương',
    },
  ];

  const RenderItem = (item: DataBaoCao) => {
    return (
      <Animated.View entering={FadeInUp.duration(1000)}>
        <TouchableOpacity
          style={styles.rowLine}
          onPress={() => {
            navigation.navigate({
              name: navigationStrings.DETAIL_ACC2K,
              params: {data: item},
            } as never);
          }}>
          <Text style={styles.textTitle}>{item.nameBaoCao}</Text>
          <Icon name="keyboard-arrow-right" size={20} color={colors.BLACK} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
      <View style={{overflow: 'hidden', paddingBottom: 5}}>
        <Header
          title={'Acc2k'}
          onPressLeft={() => navigation.goBack()}
          onPressRight={undefined}
          keyword={undefined}
          onChangeText={undefined}
          style={styles.header}
        />
      </View>
      <FlatList
        data={dataAcc2k}
        style={{flex: 1}}
        keyExtractor={data => `${data.idLoai}-Baocao`}
        renderItem={({item}) => <RenderItem {...item} />}
      />
    </SafeAreaView>
  );
};

export default Acc2k;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  rowLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 22,
    paddingHorizontal: 15,
    borderBottomWidth: 0.3,
    borderTopWidth: 0,
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});
