import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {formatTaxcode} from '../../utils/formatTaxcode';
import React, {useState, useEffect} from 'react';
import styles from '../../themes/styles';
import {encode, decode} from 'base-64';
import axios from 'axios';
// Shared
import {
  listLoaihinh,
  listThongtu,
  listTinhtrang,
} from '../../../shared/dropdownData';
import navigationStrings from '../../../shared/navigationStrings';
import wsStrings from '../../../shared/wsStrings';
import {ehdUrl} from '../../../shared/url';
// Components
import {showAlert} from '../../components/notifications/showAlert';
import DropdownList from '../../components/DropdownList';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';

const Dscty0 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [pmkt, setPmkt] = useState([]);
  const [pickPmkt, setPickPmkt] = useState();
  const [loaiHinh, setLoaiHinh] = useState('');
  const [thongtu, setThongtu] = useState('');
  const [tinhtrang, setTinhtrang] = useState('');
  const [mst, setMst] = useState();
  const [pass_hddt, setPass_hddt] = useState();
  const [pass_tdt, setPass_tdt] = useState('');
  const [pass_bhxh, setPass_bhxh] = useState('');
  const [pass_ehd, setPass_ehd] = useState('');
  const [pass_bct, setPass_bct] = useState('');
  const [pass_eks, setPass_eks] = useState('');
  const [tk_pmkt, setTk_pmkt] = useState('');
  const [pass_pmkt, setPass_pmkt] = useState('');
  const [stt, setStt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPmkt();
    if (route.params.item) {
      updateData();
    } else {
      setLoaiHinh('TM');
      setThongtu('133');
      setTinhtrang('C');
      setStt('1');
    }
  }, []);

  const updateData = () => {
    setMst(route.params.item.mst);
    route.params.item.pass_hddt &&
      setPass_hddt(decode(route.params.item.pass_hddt));
    route.params.item.pass_tdt &&
      setPass_tdt(decode(route.params.item.pass_tdt));
    route.params.item.pass_bct &&
      setPass_bct(decode(route.params.item.pass_bct));
    route.params.item.pass_bhxh &&
      setPass_bhxh(decode(route.params.item.pass_bhxh));
    route.params.item.pass_ehd &&
      setPass_ehd(decode(route.params.item.pass_ehd));
    route.params.item.pass_eks &&
      setPass_eks(decode(route.params.item.pass_eks));
    route.params.item.pmkt && setPickPmkt(route.params.item.pmkt);
    route.params.item.username_pmkt &&
      setTk_pmkt(route.params.item.username_pmkt);
    route.params.item.pass_pmkt &&
      setPass_pmkt(decode(route.params.item.pass_pmkt));
    route.params.item.loaihinh && setLoaiHinh(route.params.item.loaihinh);
    route.params.item.thongtu && setThongtu(route.params.item.thongtu);
    route.params.item.tinhtrang && setTinhtrang(route.params.item.tinhtrang);
    route.params.item.thu_tu && setStt(route.params.item.thu_tu.toString());
  };

  const checkForm = () => {
    if (!mst) {
      showAlert('error', 'Bạn chưa nhập mã số thuế');
    } else if (!pickPmkt) {
      showAlert('error', 'Bạn chưa chọn phần mềm kế toán');
    } else {
      setIsLoading(true);
      if (route.params.item) {
        suamst();
      } else {
        themmst();
      }
    }
  };

  const dsctyNavigation = () => {
    navigation.navigate(navigationStrings.MENU, {
      userName: route.params.userName,
      pwd: route.params.pwd,
    });
  };

  const getPmkt = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_GETPMKT, {
        username: route.params.userName,
        password: route.params.pwd,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res) {
          const data = res.map(item => ({
            label: item.pm,
            value: item.pm,
          }));
          setPmkt(data);
        } else {
          const text =
            'Không tìm thấy dữ liệu pmkt của tài khoản ' +
            route.params.userName;
          showAlert('error', 'Lỗi!', text);
        }
      })
      .catch(error => {
        Alert.alert(
          'Thông báo',
          'Xảy ra lỗi trong quá trình lấy dữ liệu PMKT' + '\n' + error.message,
        );
      });
  };

  const themmst = async () => {
    await axios
      .post(ehdUrl + wsStrings.VSIGN_ADDMST, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: mst,
        pass_hddt: pass_hddt != '' ? encode(pass_hddt) : '',
        pass_tdt: pass_tdt != '' ? encode(pass_tdt) : '',
        pass_bhxh: pass_bhxh != '' ? encode(pass_bhxh) : '',
        pass_ehd: pass_ehd != '' ? encode(pass_ehd) : '',
        pass_bct: pass_bct != '' ? encode(pass_tdt) : '',
        pass_eks: pass_eks != '' ? encode(pass_eks) : '',
        pmkt: pickPmkt,
        server_pmkt: '',
        username_pmkt: tk_pmkt,
        pass_pmkt: pass_pmkt != '' ? encode(pass_pmkt) : '',
        data_pmkt: '',
        loaihinh: loaiHinh,
        thongtu: thongtu,
        tinhtrang: tinhtrang,
        thu_tu: stt,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          dsctyNavigation();
        } else {
          Alert.alert('Thông báo', 'Lỗi khi thêm mã số thuế\n' + res.Status);
        }
      })
      .catch(error => {
        Alert.alert('Thông báo', 'Lỗi khi thêm mã số thuế\n' + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const suamst = async () => {
    await axios
      .post(ehdUrl + wsStrings.VISGN_EDITMST, {
        username: route.params.userName,
        password: route.params.pwd,
        mst: mst,
        pass_hddt: pass_hddt != '' ? encode(pass_hddt) : '',
        pass_tdt: pass_tdt != '' ? encode(pass_tdt) : '',
        pass_bhxh: pass_bhxh != '' ? encode(pass_bhxh) : '',
        pass_ehd: pass_ehd != '' ? encode(pass_ehd) : '',
        pass_bct: pass_bct != '' ? encode(pass_tdt) : '',
        pass_eks: pass_eks != '' ? encode(pass_eks) : '',
        pmkt: pickPmkt,
        server_pmkt: '',
        username_pmkt: tk_pmkt,
        pass_pmkt: pass_pmkt != '' ? encode(pass_pmkt) : '',
        data_pmkt: '',
        loaihinh: loaiHinh,
        thongtu: thongtu,
        tinhtrang: tinhtrang,
        thu_tu: stt,
      })
      .then(response => {
        const res = JSON.parse(response.data.d);
        if (res.Status == 'Ok') {
          showAlert('success', 'Đã cập nhật thay đổi');
          dsctyNavigation();
        } else {
          Alert.alert('Thông báo', 'Lỗi khi thêm mã số thuế\n' + res.Status);
        }
      })
      .catch(error => {
        Alert.alert('Thông báo', 'Lỗi khi thêm mã số thuế\n' + error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => dsctyNavigation()}
        title={route.params.title}
      />
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        <ScrollView style={styles.body}>
          {/* Mã số thuế */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Mã số thuế: </Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <TextInput
                style={styles.dscty0.input}
                onChangeText={value => setMst(formatTaxcode(value))}
                maxLength={14}
                placeholder="Nhập mã số thuế"
                keyboardType="number-pad"
                value={mst}
              />
            </View>
          </View>
          {/* Mật khẩu hoá đơn điện tử */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Mật khẩu HĐĐT: </Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <TextInput
                style={styles.dscty0.input}
                placeholder="HĐĐT: Hoá đơn điện tử"
                onChangeText={value => setPass_hddt(value)}
                value={pass_hddt}
              />
            </View>
          </View>
          {/* Mật khẩu Thuế điện tử */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Mật khẩu TĐT:</Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <TextInput
                style={styles.dscty0.input}
                placeholder="TĐT: Thuế điện tử"
                onChangeText={value => setPass_tdt(value)}
                value={pass_tdt}
              />
            </View>
          </View>
          {/* Mật khẩu BHXH */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Mật khẩu BHXH:</Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <TextInput
                style={styles.dscty0.input}
                placeholder="BHXH: Bảo hiểm xã hội"
                onChangeText={value => setPass_bhxh(value)}
                value={pass_bhxh}
              />
            </View>
          </View>
          {/* Mật khẩu EHD */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Mật khẩu EHĐ:</Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <TextInput
                style={styles.dscty0.input}
                placeholder="EHĐ: ehoadon"
                onChangeText={value => setPass_ehd(value)}
                value={pass_ehd}
              />
            </View>
          </View>
          {/* Mật khẩu BCT */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Mật khẩu BCT:</Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <TextInput
                style={styles.dscty0.input}
                placeholder="BCT: Báo cáo thuế"
                onChangeText={value => setPass_bct(value)}
                value={pass_bct}
              />
            </View>
          </View>
          {/* Mật khẩu EKS*/}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Mật khẩu EKS:</Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <TextInput
                style={styles.dscty0.input}
                placeholder="EKS: Chữ ký số"
                onChangeText={value => setPass_eks(value)}
                value={pass_eks}
              />
            </View>
          </View>
          {/* Phần mềm kế toán */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Phần mềm kế toán:</Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <DropdownList
                data={pmkt}
                value={pickPmkt}
                placeholder="Chọn PMKT"
                onChange={item => setPickPmkt(item.value)}
                style={styles.dscty0.pmktDropdown}
                containerStyle={styles.dscty0.containerPmkt}></DropdownList>
            </View>
          </View>
          {pickPmkt && (
            <View>
              <View style={styles.dscty0.contentRow}>
                <View style={styles.dscty0.leftCol}>
                  <Text style={styles.textH}>Tên tài khoản: </Text>
                </View>
                <View style={styles.dscty0.rightCol}>
                  <TextInput
                    style={styles.dscty0.input}
                    placeholder="Tài khoản PMKT"
                    onChangeText={value => setTk_pmkt(value)}
                    value={tk_pmkt}
                  />
                </View>
              </View>
              <View style={styles.dscty0.contentRow}>
                <View style={styles.dscty0.leftCol}>
                  <Text style={styles.textH}>Mật khẩu: </Text>
                </View>
                <View style={styles.dscty0.rightCol}>
                  <TextInput
                    style={styles.dscty0.input}
                    placeholder="Mật khẩu PMKT"
                    onChangeText={value => setPass_pmkt(value)}
                    value={pass_pmkt}
                  />
                </View>
              </View>
            </View>
          )}
          {/* Loại hình */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Loại hình Cty: </Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <DropdownList
                data={listLoaihinh}
                value={loaiHinh}
                onChange={item => setLoaiHinh(item.value)}
                style={styles.dscty0.lhDropdown}
                containerStyle={styles.dscty0.containerLh}></DropdownList>
            </View>
          </View>
          {/* Thông tư */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Thông tư: </Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <DropdownList
                data={listThongtu}
                value={thongtu}
                onChange={item => setThongtu(item.value)}
                style={styles.dscty0.ttDropdown}
                containerStyle={styles.dscty0.containerTt}></DropdownList>
            </View>
          </View>
          {/* Tình trạng */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Tình trạng: </Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <DropdownList
                data={listTinhtrang}
                value={tinhtrang}
                onChange={item => setTinhtrang(item.value)}
                style={styles.dscty0.ttrangDropdown}
                containerStyle={styles.dscty0.containerTtrang}></DropdownList>
            </View>
          </View>
          {/* Thứ tự */}
          <View style={styles.dscty0.contentRow}>
            <View style={styles.dscty0.leftCol}>
              <Text style={styles.textH}>Thứ tự: </Text>
            </View>
            <View style={styles.dscty0.rightCol}>
              <TextInput
                style={styles.dscty0.inputStt}
                keyboardType="number-pad"
                onChangeText={value => setStt(value)}
                value={stt}
                defaultValue="0"
              />
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <CustomButton
              onPress={() => checkForm()}
              loading={isLoading}
              title={'Xác nhận'}
              buttonStyle={{borderRadius: 30, width: 150}}></CustomButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Dscty0;
