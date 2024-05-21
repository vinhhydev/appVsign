import navigationStrings from '../../../shared/navigationStrings';
import {View, Text, ScrollView, SafeAreaView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import wsStrings from '../../../shared/wsStrings';
import React, {useEffect, useState} from 'react';
import {ehdUrl} from '../../../shared/url';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import moment from 'moment-timezone';
import {Divider} from '@rneui/base';
import axios from 'axios';
// Components
import CustomButton, {ButtonIcon} from '../../components/CustomButton';
import {showAlert} from '../../components/notifications/showAlert';
import Header from '../../components/Header';

const Hoadon = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const ngayct = moment(route.params.item.Ngay_ct).format('DD-MM-YYYY - HH:mm');
  const ngayky = moment(route.params.item.Ngay_ky).format('DD-MM-YYYY - HH:mm');
  const ngaytruyen = moment(route.params.item.Ngay_truyen).format(
    'DD-MM-YYYY - HH:mm',
  );
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState();
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    getHoaDon();
  }, []);

  useEffect(() => {
    if (!isLoading && !url) {
      setDisableButton(true);
    }
  }, []);

  const themNavigation = () => {
    navigation.navigate(navigationStrings.HD0, {
      userName: route.params.userName,
      pwd: route.params.pwd,
      mst: route.params.mst,
      id: route.params.id,
      tg: route.params.tg,
    });
  };

  const getHoaDon = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_XEMHD, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: route.params.mst,
        id: route.params.id,
      })
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          setUrl(res.Status);
        }
      })
      .catch(error => {
        const text =
          'Xảy ra lỗi khi lấy thông tin hoá đơn\n' + 'Lỗi: ' + error.message;
        showAlert('error', 'Lỗi!', text);
      })
      .finally(() => setIsLoading(false));
  };

  const getDetail = () => {
    const newUrl = url.replace('.', '').replace('.', '');
    const combineUrl = 'https://ehoadondientu.com' + newUrl;
    navigation.navigate(navigationStrings.WEBSCREEN, {
      tg: route.params.tg,
      url: combineUrl,
      title: 'Chi tiết hoá đơn',
    });
  };

  const RenderMV = () => (
    <View style={{alignItems: 'center'}}>
      <View style={{width: '100%', alignItems: 'flex-end'}}>
        <View style={styles.hoadon.tbph}>
          <Text style={styles.text}>
            Seri: {route.params.item.Ky_hieu_mau}
            {route.params.item.So_seri}
          </Text>
          <Text style={styles.text}>Số: {route.params.item.So_ct}</Text>
        </View>
      </View>
      {route.params.item.Ky_hieu_mau == 1 ? (
        <Text style={styles.textHighlight}>Hoá Đơn Giá Trị Gia Tăng</Text>
      ) : route.params.item.Ky_hieu_mau == 2 ? (
        <Text style={styles.textHighlight}>Hoá Đơn Bán Hàng</Text>
      ) : route.params.item.Ky_hieu_mau == 5 ? (
        <Text style={styles.textHighlight}>Hoá Đơn Điện Tủ</Text>
      ) : (
        <Text style={styles.textHighlight}>Chứng Từ Điện Tử</Text>
      )}
      <View style={styles.hoadon.timeRow}>
        <View style={styles.hoadon.leftColTime}>
          <Text style={styles.text}>Ngày chứng từ: </Text>
        </View>
        <View style={styles.hoadon.rightColTime}>
          <Text style={styles.text}>{ngayct}</Text>
        </View>
      </View>
      <View style={styles.hoadon.timeRow}>
        <View style={styles.hoadon.leftColTime}>
          <Text style={styles.text}>Ngày ký: </Text>
        </View>
        <View style={styles.hoadon.rightColTime}>
          <Text style={styles.text}>{ngayky}</Text>
        </View>
      </View>
      <View style={styles.hoadon.timeRow}>
        <View style={styles.hoadon.leftColTime}>
          <Text style={styles.text}>Ngày truyền: </Text>
        </View>
        <View style={styles.hoadon.rightColTime}>
          <Text style={styles.text}>{ngaytruyen}</Text>
        </View>
      </View>
      <Divider style={{width: '100%'}} width={1.5} marginBottom={10} />
      <View style={styles.hoadon.row}>
        <View style={styles.hoadon.leftCol}>
          <Text style={styles.text}>Người bán:</Text>
        </View>
        <View style={styles.hoadon.rightCol}>
          <Text style={styles.text}>{route.params.item.ten_nguoi_ban}</Text>
        </View>
      </View>
      <View style={styles.hoadon.row}>
        <View style={styles.hoadon.leftCol}>
          <Text style={styles.text}>Địa chỉ:</Text>
        </View>
        <View style={styles.hoadon.rightCol}>
          <Text style={styles.text}>{route.params.item.dia_chi_ban}</Text>
        </View>
      </View>
      <View style={styles.hoadon.row}>
        <View style={styles.hoadon.leftCol}>
          <Text style={styles.text}>Mã số thuế:</Text>
        </View>
        <View style={styles.hoadon.rightCol}>
          <Text style={styles.text}>{route.params.item.mst_ban}</Text>
        </View>
      </View>
      <View style={styles.hoadon.row}>
        <View style={styles.hoadon.leftCol}>
          <Text style={styles.text}>HTTT:</Text>
        </View>
        <View style={styles.hoadon.rightCol}>
          <Text style={styles.text}>{route.params.item.Httt}</Text>
        </View>
      </View>
      <ButtonIcon
        onPress={() => getDetail()}
        title={'Xem hoá đơn'}
        tg={route.params.tg}
        loading={isLoading}
        disabled={disableButton}></ButtonIcon>
      <View style={styles.hoadon.cash}>
        <View style={styles.hoadon.cashRow}>
          <View style={styles.hoadon.leftColCash}>
            <Text style={styles.text}>Tiền hàng:</Text>
          </View>
          <View style={styles.hoadon.rightColCash}>
            <Text style={styles.text}>
              {new Intl.NumberFormat('vi-VN').format(route.params.item.Ttien0)}{' '}
              {route.params.item.DVTTe}
            </Text>
          </View>
        </View>
        <View style={styles.hoadon.cashRow}>
          <View style={styles.hoadon.leftColCash}>
            <Text style={styles.text}>Thuế:</Text>
          </View>
          <View style={styles.hoadon.rightColCash}>
            <Text style={styles.text}>
              {new Intl.NumberFormat('vi-VN').format(route.params.item.Ttien3)}{' '}
              {route.params.item.DVTTe}
            </Text>
          </View>
        </View>
        <View style={styles.hoadon.cashRow}>
          <View style={styles.hoadon.leftColCash}>
            <Text style={styles.text}>Tổng tiền:</Text>
          </View>
          <View style={styles.hoadon.rightColCash}>
            <Text
              style={{
                fontSize: 19,
                fontWeight: 'bold',
                color:
                  route.params.tg == true
                    ? colors.MAINCOLOR
                    : colors.SECONDCOLOR,
              }}>
              {new Intl.NumberFormat('vi-VN').format(route.params.item.Ttien)}{' '}
              {route.params.item.DVTTe}
            </Text>
          </View>
        </View>
        <CustomButton
          tg={route.params.tg}
          onPress={() => themNavigation()}
          title={'Chi tiết hàng hoá'}
          buttonStyle={{
            borderRadius: 30,
            width: 220,
            height: 45,
            alignSelf: 'center',
          }}></CustomButton>
      </View>
    </View>
  );

  const RenderBR = () => (
    <View style={{alignItems: 'center'}}>
      <View style={{width: '100%', alignItems: 'flex-end'}}>
        <View style={styles.hoadon.tbph}>
          <Text style={styles.text}>
            Seri: {route.params.item.Ky_hieu_mau}
            {route.params.item.So_seri}
          </Text>
          <Text style={styles.text}>Số: {route.params.item.So_ct}</Text>
        </View>
      </View>
      {route.params.item.Ky_hieu_mau == 1 ? (
        <Text style={styles.textHighlight}>Hoá Đơn Giá Trị Gia Tăng</Text>
      ) : route.params.item.Ky_hieu_mau == 2 ? (
        <Text style={styles.textHighlight}>Hoá Đơn Bán Hàng</Text>
      ) : route.params.item.Ky_hieu_mau == 5 ? (
        <Text style={styles.textHighlight}>Hoá Đơn Điện Tủ</Text>
      ) : (
        <Text style={styles.textHighlight}>Chứng Từ Điện Tử</Text>
      )}
      <View style={styles.hoadon.timeRow}>
        <View style={styles.hoadon.leftColTime}>
          <Text style={styles.text}>Ngày chứng từ: </Text>
        </View>
        <View style={styles.hoadon.rightColTime}>
          <Text style={styles.text}>{ngayct}</Text>
        </View>
      </View>
      <View style={styles.hoadon.timeRow}>
        <View style={styles.hoadon.leftColTime}>
          <Text style={styles.text}>Ngày ký: </Text>
        </View>
        <View style={styles.hoadon.rightColTime}>
          <Text style={styles.text}>{ngayky}</Text>
        </View>
      </View>
      <View style={styles.hoadon.timeRow}>
        <View style={styles.hoadon.leftColTime}>
          <Text style={styles.text}>Ngày truyền: </Text>
        </View>
        <View style={styles.hoadon.rightColTime}>
          <Text style={styles.text}>{ngaytruyen}</Text>
        </View>
      </View>
      <Divider style={{width: '100%', marginBottom: 10}} width={2} />
      <View style={styles.hoadon.row}>
        <View style={styles.hoadon.leftCol}>
          <Text style={styles.text}>Người mua:</Text>
        </View>
        <View style={styles.hoadon.rightCol}>
          <Text style={styles.text}>{route.params.item.ten_nguoi_mua}</Text>
        </View>
      </View>
      <View style={styles.hoadon.row}>
        <View style={styles.hoadon.leftCol}>
          <Text style={styles.text}>Địa chỉ:</Text>
        </View>
        <View style={styles.hoadon.rightCol}>
          <Text style={styles.text}>{route.params.item.dia_chi_mua}</Text>
        </View>
      </View>
      <View style={styles.hoadon.row}>
        <View style={styles.hoadon.leftCol}>
          <Text style={styles.text}>Mã số thuế:</Text>
        </View>
        <View style={styles.hoadon.rightCol}>
          <Text style={styles.text}>{route.params.item.mst_mua}</Text>
        </View>
      </View>
      <View style={styles.hoadon.row}>
        <View style={styles.hoadon.leftCol}>
          <Text style={styles.text}>HTTT:</Text>
        </View>
        <View style={styles.hoadon.rightCol}>
          <Text style={styles.text}>{route.params.item.Httt}</Text>
        </View>
      </View>
      <ButtonIcon
        onPress={() => getDetail()}
        title={'Xem hoá đơn'}
        tg={route.params.tg}
        loading={isLoading}
        disabled={disableButton}></ButtonIcon>
      <View style={styles.hoadon.cash}>
        <View style={styles.hoadon.cashRow}>
          <View style={styles.hoadon.leftColCash}>
            <Text style={styles.text}>Tiền hàng:</Text>
          </View>
          <View style={styles.hoadon.rightColCash}>
            <Text style={styles.text}>
              {new Intl.NumberFormat('vi-VN').format(route.params.item.Ttien0)}{' '}
              {route.params.item.DVTTe}
            </Text>
          </View>
        </View>
        <View style={styles.hoadon.cashRow}>
          <View style={styles.hoadon.leftColCash}>
            <Text style={styles.text}>Thuế:</Text>
          </View>
          <View style={styles.hoadon.rightColCash}>
            <Text style={styles.text}>
              {new Intl.NumberFormat('vi-VN').format(route.params.item.Ttien3)}{' '}
              {route.params.item.DVTTe}
            </Text>
          </View>
        </View>
        <View style={styles.hoadon.cashRow}>
          <View style={styles.hoadon.leftColCash}>
            <Text style={styles.text}>Tổng tiền:</Text>
          </View>
          <View style={styles.hoadon.rightColCash}>
            <Text
              style={{
                fontSize: 19,
                fontWeight: 'bold',
                color:
                  route.params.tg == true
                    ? colors.MAINCOLOR
                    : colors.SECONDCOLOR,
              }}>
              {new Intl.NumberFormat('vi-VN').format(route.params.item.Ttien)}{' '}
              {route.params.item.DVTTe}
            </Text>
          </View>
        </View>
        <CustomButton
          tg={route.params.tg}
          onPress={() => themNavigation()}
          title={'Chi tiết hàng hoá'}
          buttonStyle={{
            borderRadius: 30,
            width: 220,
            height: 45,
            alignSelf: 'center',
          }}></CustomButton>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        tg={route.params.tg}
        onPressLeft={() => navigation.goBack()}
        title={'Thông tin hoá đơn'}
      />
      <ScrollView style={styles.body}>
        {route.params.type == 'MV' ? (
          // Giao diện mua vào
          <RenderMV></RenderMV>
        ) : (
          //Giao diện bán ra
          <RenderBR></RenderBR>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Hoadon;
