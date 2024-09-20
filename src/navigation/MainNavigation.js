import {createNativeStackNavigator} from '@react-navigation/native-stack';
import navigationStrings from '../../shared/navigationStrings';
import Login from '../screens/taikhoan/Login';
import Register from '../screens/taikhoan/Register';
import Home from '../screens/Home';
import Hanghoa from '../screens/Hanghoa';
import Webscreen from '../screens/Webscreen';
import Ktruiro from '../screens/kiemtraruiro/Ktruiro';
import Account from '../screens/taikhoan/Account';
import Nganh from '../screens/dangkykinhdoanh/Nganh';

const Stack = createNativeStackNavigator();
const register = '';

// Stack Tính thuế VAT
import Dmcty from '../screens/tinhthuevat/Dmcty';
import Dshoadon from '../screens/tinhthuevat/Dshoadon';
import Hoadon from '../screens/tinhthuevat/Hoadon';
import Hoadon0 from '../screens/tinhthuevat/Hoadon0';
import Bhdt from '../screens/tinhthuevat/Bhdt';
import Bhvt from '../screens/tinhthuevat/Bhvt';

function DmctyScreens() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.MENU}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.MENU} component={Dmcty} />
      <Stack.Screen name={navigationStrings.DSHD} component={Dshoadon} />
      <Stack.Screen name={navigationStrings.HD} component={Hoadon} />
      <Stack.Screen name={navigationStrings.HD0} component={Hoadon0} />
      <Stack.Screen name={navigationStrings.BHDT} component={Bhdt} />
      <Stack.Screen name={navigationStrings.BHVT} component={Bhvt} />
    </Stack.Navigator>
  );
}

// Stack Danh sách Cty
import Dscty from '../screens/danhsachcty/Dscty';
import Dscty0 from '../screens/danhsachcty/Dscty0';

function DsctyScreens() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.MENU}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.MENU} component={Dscty} />
      <Stack.Screen name={navigationStrings.DSCTY0} component={Dscty0} />
    </Stack.Navigator>
  );
}

// Stack thông tin ứng dụng
import Info from '../screens/thongtin/Info';
import Info0 from '../screens/thongtin/Info0';

function InfoScreens() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.MENU}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.MENU} component={Info} />
      <Stack.Screen name={navigationStrings.INFO0} component={Info0} />
    </Stack.Navigator>
  );
}

// Stack Thuế điện tử
import Thuedientu from '../screens/thuedientu/Thuedientu';
import Tracuuthongbao from '../screens/thuedientu/Tracuuthongbao';
import Tracuutokhai from '../screens/thuedientu/Tracuutokhai';
import Tracuutokhai0 from '../screens/thuedientu/Tracuutokhai0';
import Tracuugiaynoptien from '../screens/thuedientu/Tracuugiaynoptien';
import Tracuuthongbaocoquanthue from '../screens/thuedientu/Tracuuthongbaocoquanthue';
import Tracuuthongtinnghiavu from '../screens/thuedientu/Tracuuthongtinnghiavu';
import Tracuunghiavukekhai from '../screens/thuedientu/Tracuunghiavukekhai';
import ThongtinCKS from '../screens/thuedientu/ThongtinCKS';
import TracuuDKT from '../screens/thuedientu/TracuuDKT';
import TracuuDKT0 from '../screens/thuedientu/TracuuDKT0';
import TracuuDKT1 from '../screens/thuedientu/TracuuDKT1';

function TdtScreens() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.MENU}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.MENU} component={Thuedientu} />
      <Stack.Screen
        name={navigationStrings.TCTHONGBAO}
        component={Tracuuthongbao}
      />
      <Stack.Screen
        name={navigationStrings.TCTOKHAI}
        component={Tracuutokhai}
      />
      <Stack.Screen
        name={navigationStrings.TCTOKHAI0}
        component={Tracuutokhai0}
      />
      <Stack.Screen
        name={navigationStrings.TCGIAYNOPTIEN}
        component={Tracuugiaynoptien}
      />
      <Stack.Screen
        name={navigationStrings.TCTBCQT}
        component={Tracuuthongbaocoquanthue}
      />
      <Stack.Screen
        name={navigationStrings.TCTTNV}
        component={Tracuuthongtinnghiavu}
      />
      <Stack.Screen
        name={navigationStrings.TCNVKK}
        component={Tracuunghiavukekhai}
      />
      <Stack.Screen name={navigationStrings.CKS} component={ThongtinCKS} />
      <Stack.Screen name={navigationStrings.DKT} component={TracuuDKT} />
      <Stack.Screen name={navigationStrings.DKT0} component={TracuuDKT0} />
      <Stack.Screen name={navigationStrings.DKT1} component={TracuuDKT1} />
    </Stack.Navigator>
  );
}

// Stack Hoá đơn Vĩnh Hy
import Ehd from '../screens/hoadonvinhhy/Ehd';
import Ehd1 from '../screens/hoadonvinhhy/Ehd1';
import Ehd2 from '../screens/hoadonvinhhy/Ehd2';

function EhdScreens() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.MENU}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.MENU} component={Ehd} />
      <Stack.Screen name={navigationStrings.EHD1} component={Ehd1} />
      <Stack.Screen name={navigationStrings.EHD2} component={Ehd2} />
    </Stack.Navigator>
  );
}

// Stack Hợp đồng điện tử
import Ekyso from '../screens/hopdongdientuvinhhy/Ekyso';
import Ekyso0 from '../screens/hopdongdientuvinhhy/Ekyso0';

function EkysoScreens() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.MENU}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.MENU} component={Ekyso} />
      <Stack.Screen name={navigationStrings.EKYSO} component={Ekyso0} />
    </Stack.Navigator>
  );
}

// Stack Đăng ký kinh doanh
import Dangkykinhdoanh from '../screens/dangkykinhdoanh/Dangkykinhdoanh';

function DkkdScreens() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.DKKDMENU}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={navigationStrings.DKKDMENU}
        component={Dangkykinhdoanh}
      />
    </Stack.Navigator>
  );
}

// Stack Bảo hiểm xã hội
import Bhxh from '../screens/bhxh/Bhxh';
import Lichsunophoso from '../screens/bhxh/Lichsunophoso';

function BhxhScreens() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.MENU}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.MENU} component={Bhxh} />
      <Stack.Screen name={navigationStrings.LICHSU} component={Lichsunophoso} />
    </Stack.Navigator>
  );
}

// Stack Tư vấn thuế
import Tuvanthue from '../screens/tuvanthue/Tuvanthue';
import Message from '../screens/tuvanthue/Message';
import Chat from '../screens/chat';
import ListChat from '../screens/listchat';
import FullImage from '../screens/fullImage';
import Acc2k from '../screens/Acc2k';
import DetailAcc2k from '../screens/Acc2k/DetailAcc2k';
import FormBaoCao from '../screens/Acc2k/FormBaoCao';
import LoginAcc2k from '../screens/Acc2k/LoginAcc2k';
import LoadMoreList from '../screens/Acc2k/LoadMoreList';

function TuvanthueScreens() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.MENU}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.MENU} component={Tuvanthue} />
      <Stack.Screen name={navigationStrings.MESSAGE} component={Message} />
    </Stack.Navigator>
  );
}

// Main Stack
function MainNavigation() {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.LOGIN}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={navigationStrings.LOGIN}
        component={Login}
        initialParams={register}
      />
      <Stack.Screen name={navigationStrings.REGISTER} component={Register} />
      <Stack.Screen name={navigationStrings.HOME} component={Home} />
      <Stack.Screen name={navigationStrings.PRODUCTS} component={Hanghoa} />
      <Stack.Screen name={navigationStrings.WEBSCREEN} component={Webscreen} />
      <Stack.Screen name={navigationStrings.KTRUIRO} component={Ktruiro} />
      <Stack.Screen name={navigationStrings.ACCOUNT} component={Account} />
      <Stack.Screen name={navigationStrings.BUSINESS} component={Nganh} />
      <Stack.Screen name={navigationStrings.CHAT} component={Chat} />
      <Stack.Screen name={navigationStrings.LISTCHAT} component={ListChat} />
      <Stack.Screen name={navigationStrings.FULLIMAGE} component={FullImage} />
      <Stack.Screen name={navigationStrings.ACC2k} component={Acc2k} />
      <Stack.Screen
        name={navigationStrings.FORMBAOCAO}
        component={FormBaoCao}
      />
      <Stack.Screen
        name={navigationStrings.DETAIL_ACC2K}
        component={DetailAcc2k}
      />
      <Stack.Screen
        name={navigationStrings.LOGINACC2k}
        component={LoginAcc2k}
      />
      <Stack.Screen
        name={navigationStrings.LOADMORELIST}
        component={LoadMoreList}
      />
      {/* List stack screens */}
      <Stack.Screen name={navigationStrings.TVT} component={TuvanthueScreens} />
      <Stack.Screen name={navigationStrings.DMCTY} component={DmctyScreens} />
      <Stack.Screen name={navigationStrings.DSCTY} component={DsctyScreens} />
      <Stack.Screen name={navigationStrings.INFO} component={InfoScreens} />
      <Stack.Screen name={navigationStrings.TDT} component={TdtScreens} />
      <Stack.Screen name={navigationStrings.EHD} component={EhdScreens} />
      <Stack.Screen name={navigationStrings.DKKD} component={DkkdScreens} />
      <Stack.Screen name={navigationStrings.EKS} component={EkysoScreens} />
      <Stack.Screen name={navigationStrings.BHXH} component={BhxhScreens} />
    </Stack.Navigator>
  );
}

export default MainNavigation;
