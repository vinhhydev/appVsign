import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import styles from '../../themes/styles';
import {Divider} from '@rneui/base';
// Components
import ReloadComponent from '../../components/ReloadComponent';
import Header from '../../components/Header';

const TracuuDKT1 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(route.params.data);
  }, []);

  const onPressItem = item => {
    navigation.navigate(navigationStrings.DKT0, {
      data: [item],
    });
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => onPressItem(item)}>
        <View style={styles.ehd.itemWrapper}>
          <Text style={styles.textH}>{item.hovaten}</Text>
          <Text style={styles.text}>Ngày sinh: {item.ngaysinh}</Text>
          <Text style={styles.text}>CCCD/CMT: {item.cmt}</Text>
          <Text style={styles.text}>MST: {item.mst || 'Không có'}</Text>
          <Text style={styles.text}>
            Địa chỉ: {item.diachihk}, {item.xaphuonghk}, {item.quanhuyenhk},{' '}
            {item.tinhthanhphohk}
          </Text>
        </View>
        <Divider width={1.5}></Divider>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={'Danh sách kết quả'}
      />
      <View style={styles.dmcty.body}>
        {data.length != 0 ? (
          <Animated.FlatList
            entering={FadeIn.duration(1000)}
            exiting={FadeOut.duration(1000)}
            data={data}
            renderItem={({item}) => renderItem({item})}
            keyExtractor={item => item.index}
            windowSize={10}
          />
        ) : (
          <ReloadComponent
            size={0.75}
            title={'Không có dữ liệu'}></ReloadComponent>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TracuuDKT1;
