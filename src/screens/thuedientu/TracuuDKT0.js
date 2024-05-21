import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useNavigation, useRoute} from '@react-navigation/native';
import {View, Text, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from '../../themes/styles';
import {Divider} from '@rneui/base';
// Components
import LoadingComponent from '../../components/LoadingComponent';
import ReloadComponent from '../../components/ReloadComponent';
import Header from '../../components/Header';
//

const TracuuDKT0 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    formatData();
  }, []);

  // Chuyển dữ liệu về dạng array object
  const formatData = () => {
    setData(route.params.data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPressLeft={() => navigation.goBack()} title={'Kết quả'} />
      {loading ? (
        <LoadingComponent size={0.9}></LoadingComponent>
      ) : data ? (
        <Animated.ScrollView
          style={styles.body}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(1000)}>
          {data.map(item => (
            <View style={{padding: 20}}>
              <Text style={styles.highlight}>Thông tin cá nhân</Text>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Họ và tên: </Text>
                <Text style={styles.text}>{item.hovaten}</Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Ngày sinh: </Text>
                <Text style={styles.text}>{item.ngaysinh}</Text>
              </View>
              <View style={styles.ehd.itemRow}>
                <View style={styles.tdt.rowDkt}>
                  <Text style={styles.textH}>Giới tính: </Text>
                  <Text style={styles.text}>
                    {item.gioitinh} {'(' + item.magioitinh + ')'}
                  </Text>
                </View>
                <View style={styles.tdt.rowDkt}>
                  <Text style={styles.textH}>Quốc tịch: </Text>
                  <Text style={styles.text}>
                    {item.quoctich} {'(' + item.maquoctich + ')'}
                  </Text>
                </View>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Địa chỉ: </Text>
                <Text style={styles.text}>{item.diachihk}</Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Tỉnh/TP: </Text>
                <Text style={styles.text}>
                  {item.tinhthanhphohk} {'(' + item.matinhthanhphohk + ')'}
                </Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Quận/Huyện: </Text>
                <Text style={styles.text}>
                  {item.quanhuyenhk} {'(' + item.maquanhuyenhk + ')'}
                </Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Xã/Phường: </Text>
                <Text style={styles.text}>
                  {item.xaphuonghk} {'(' + item.maxaphuonghk + ')'}
                </Text>
              </View>
              <Divider width={1.5} style={{marginVertical: 20}}></Divider>
              <Text style={styles.highlight}>Thẻ CCCD/CMT</Text>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>CCCD/CMT: </Text>
                <Text style={styles.text}>{item.cmt}</Text>
              </View>
              <View style={styles.ehd.itemRow}>
                <View style={styles.tdt.rowDkt}>
                  <Text style={styles.textH}>Ngày cấp: </Text>
                  <Text style={styles.text}>{item.ngaycapcmt}</Text>
                </View>
                <View style={styles.tdt.rowDkt}>
                  <Text style={styles.textH}>Nơi cấp: </Text>
                  <Text style={styles.text}>
                    {item.noicapcmt} {'(' + item.manoicapcmt + ')'}
                  </Text>
                </View>
              </View>
              <Divider width={1.5} style={{marginVertical: 20}}></Divider>
              <Text style={styles.highlight}>Thông tin hộ chiếu</Text>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Số hộ chiếu: </Text>
                <Text style={styles.text}>{item.sohochieu || 'Không có'}</Text>
              </View>
              <View style={styles.ehd.itemRow}>
                <View style={styles.tdt.rowDkt}>
                  <Text style={styles.textH}>Ngày cấp: </Text>
                  <Text style={styles.text}>
                    {item.ngaycapshc || 'Không có'}
                  </Text>
                </View>
                <View style={styles.tdt.rowDkt}>
                  <Text style={styles.textH}>Nơi cấp: </Text>
                  <Text style={styles.text}>
                    {item.noicapshc || 'Không có'}
                  </Text>
                </View>
              </View>
              <Divider width={1.5} style={{marginVertical: 20}}></Divider>
              <Text style={styles.highlight}>Chứng từ</Text>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Ngày đăng ký: </Text>
                <Text style={styles.text}>{item.ngaydangky}</Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Quốc gia: </Text>
                <Text style={styles.text}>
                  {item.quocgia} {'(' + item.maquocgia + ')'}
                </Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Điện thoại: </Text>
                <Text style={styles.text}>{item.dienthoai}</Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Email: </Text>
                <Text style={styles.text}>{item.email || 'Không có'}</Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Địa chỉ: </Text>
                <Text style={styles.text}>{item.diachict}</Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Tỉnh/TP: </Text>
                <Text style={styles.text}>
                  {item.tinhthanhphoct} {'(' + item.matinhthanhphoct + ')'}
                </Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Quận/Huyện: </Text>
                <Text style={styles.text}>
                  {item.quanhuyenct} {'(' + item.maquanhuyenct + ')'}
                </Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Xã/Phường: </Text>
                <Text style={styles.text}>
                  {item.xaphuongct} {'(' + item.maxaphuongct + ')'}
                </Text>
              </View>
              <View style={styles.tdt.rowDkt}>
                <Text style={styles.textH}>Lỗi: </Text>
                <Text style={styles.highlight}>
                  {item.chitietloi} {'(' + item.maloi + ')'}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      ) : (
        <ReloadComponent
          size={0.75}
          title={'Không có dữ liệu'}></ReloadComponent>
      )}
    </SafeAreaView>
  );
};

export default TracuuDKT0;
