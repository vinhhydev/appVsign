import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import colors from '../../themes/colors';
import Form7Vao from '../../components/FormAcc2k/Form7Vao';
import {IDataBaoCao} from '../../type/IAcc2k';
import FormToKhai from '../../components/FormAcc2k/FormToKhai';
import Form1Soct from '../../components/FormAcc2k/Form1Soct';
import Form1Squy from '../../components/FormAcc2k/Form1Squy';
import Form1Nkc from '../../components/FormAcc2k/Form1Nkc';
import Form3Ctn from '../../components/FormAcc2k/Form3Ctcn';
import Form5The from '../../components/FormAcc2k/Form5The';
import Form5Nxt from '../../components/FormAcc2k/Form5Nxt';
import Form5Bke from '../../components/FormAcc2k/Form5Bke';
import Form1Sc0 from '../../components/FormAcc2k/Form1Sc0';
import Form8Cdkt from '../../components/FormAcc2k/Form8Cdkt';
import Form8Kq1 from '../../components/FormAcc2k/Form8Kq1';
import Form9Cpkm from '../../components/FormAcc2k/Form9Cpkm';
import Form9Bhmh from '../../components/FormAcc2k/Form9Bhmh';
import Form0Lg from '../../components/FormAcc2k/Form0Lg';

const FormBaoCao = ({route}: any) => {
  const data = route.params.data as IDataBaoCao;
  const navigation = useNavigation();
  const renderForm = useMemo(() => {
    switch (data.ham) {
      case 'frmTokhai':
        return <FormToKhai {...data} />;
      case 'frm0Lg':
        return <Form0Lg {...data} />;
      case 'frm1Soct':
        return <Form1Soct {...data} />;
      case 'frm1Squy':
        return <Form1Squy {...data} />;
      case 'frm1Sc0':
        return <Form1Sc0 {...data} />;
      case 'frm1Nkc':
        return <Form1Nkc {...data} />;
      case 'frm3Ctcn':
        return <Form3Ctn {...data} />;
      case 'frm5The':
        return <Form5The {...data} />;
      case 'frm5Nxt':
        return <Form5Nxt {...data} />;
      case 'frm5Bke':
        return <Form5Bke {...data} />;
      case 'frm7Vao':
        return <Form7Vao {...data} />;
      case 'frm8Cdkt':
        return <Form8Cdkt {...data} />;
      case 'frm8Kq1':
        return <Form8Kq1 {...data} />;
      case 'frm9Cpkm':
        return <Form9Cpkm {...data} />;
      case 'frm9Bhmh':
        return <Form9Bhmh {...data} />;
      default:
        break;
    }
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.WHITE}}>
      <Header
        title={data.ham}
        onPressLeft={() => navigation.goBack()}
        onPressRight={undefined}
        keyword={undefined}
        onChangeText={undefined}
        style={styles.header}
      />

      <View style={styles.container}>{renderForm}</View>
    </SafeAreaView>
  );
};

export default FormBaoCao;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  container: {
    flex: 1,
  },
});
