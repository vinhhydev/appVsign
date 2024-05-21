import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarPicker from 'react-native-calendar-picker';
import {useNavigation} from '@react-navigation/native';
import {emailHdUrl} from '../../shared/url';
import CustomButton from './CustomButton';
import styles from '../themes/styles';
import colors from '../themes/colors';
import {Input} from '@rneui/themed';
import {Button} from '@rneui/base';
import React from 'react';

export const EmailModal = ({
  tg = true,
  visible,
  onPressOutSide,
  tk,
  mk,
  errorMessageTK = '',
  onChangeTextTK,
  onChangeTK,
  onChangeTextMK,
  onChangeMK,
  errorMessageMK = '',
  secureTextEntry,
  onPressIcon,
  onPressSubmit,
  buttonLoading = false,
  onPressHyperlink,
}) => {
  const navigation = useNavigation();

  const openLink = (url, title) => {
    navigation.navigate('Webscreen', {
      tg: tg,
      url: url,
      title: title,
    });
    if (onPressHyperlink && typeof onPressHyperlink === 'function') {
      onPressHyperlink();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
        <TouchableOpacity
          onPress={onPressOutSide}
          style={styles.dmcty.modalView}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.dmcty.calendar}>
              <Text style={styles.textH}>Nhập địa chỉ email nhận hoá đơn</Text>
              <View style={styles.dmcty.input}>
                <Input
                  label={'Địa chỉ email'}
                  placeholder="example@gmail.com"
                  value={tk}
                  errorMessage={errorMessageTK}
                  onChangeText={onChangeTextTK}
                  onChange={onChangeTK}
                />
                <Input
                  label={'Mật khẩu'}
                  placeholder="Nhập ở đây"
                  secureTextEntry={secureTextEntry}
                  value={mk}
                  errorMessage={errorMessageMK}
                  onChangeText={onChangeTextMK}
                  onChange={onChangeMK}
                  rightIcon={
                    <TouchableOpacity onPress={onPressIcon}>
                      <Icon
                        name={
                          secureTextEntry == true
                            ? 'eye-outline'
                            : 'eye-off-outline'
                        }
                        size={30}
                      />
                    </TouchableOpacity>
                  }
                />
                <TouchableOpacity
                  onPress={() => openLink(emailHdUrl, 'Đường liên kết')}>
                  <Text style={styles.dmcty.hyperlink}>
                    Hướng dẫn kích hoạt xác thử 2 lớp
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dmcty.buttonCon}>
                <CustomButton
                  onPress={onPressSubmit}
                  title={'OK'}
                  loading={buttonLoading}
                  tg={tg}></CustomButton>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export const CalendarModal = ({
  visible,
  onPressOutside,
  rangeSelect = false,
  onDateChange,
  color = colors.MAINCOLOR,
  color2 = colors.WHITE,
  onSubmit,
  onSubmit2,
  buttonTitle,
  buttonTitle2,
  buttonStyle,
  buttonStyle2,
  minDate = '2021-11-01',
  secondButton = false,
  titleStyle = {fontWeight: 'bold', color: colors.WHITE},
  titleStyle2 = {fontWeight: 'bold', color: colors.MAINCOLOR},
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableOpacity onPress={onPressOutside} style={styles.dmcty.modalView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.dmcty.calendar}>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={rangeSelect}
              todayBackgroundColor={color}
              selectedDayColor={color}
              selectedDayTextColor="#FFFFFF"
              previousTitle="Trước"
              nextTitle="Sau"
              minDate={minDate}
              weekdays={['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']}
              months={[
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12',
              ]}
              onDateChange={onDateChange}
            />
            {secondButton ? (
              <View style={styles.dmcty.buttonCon}>
                <Button
                  onPress={onSubmit}
                  title={buttonTitle}
                  titleStyle={titleStyle}
                  buttonStyle={buttonStyle}
                  color={color}></Button>
                <Button
                  onPress={onSubmit2}
                  title={buttonTitle2}
                  titleStyle={titleStyle2}
                  buttonStyle={buttonStyle2}
                  color={color2}></Button>
              </View>
            ) : (
              <View style={styles.dmcty.buttonCon}>
                <Button
                  onPress={onSubmit}
                  title={buttonTitle}
                  titleStyle={titleStyle}
                  buttonStyle={buttonStyle}
                  color={color}></Button>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export const CustomModal = ({
  visible,
  onPressOutSide,
  renderContent,
  animationType = 'fade',
  behavior = 'padding',
  type = 'center',
  style = type == 'center' ? styles.dmcty.modalView : styles.dkkd.modalView,
}) => {
  return (
    <Modal visible={visible} animationType={animationType} transparent={true}>
      <KeyboardAvoidingView behavior={behavior} style={{flex: 1}}>
        <TouchableOpacity onPress={onPressOutSide} style={style}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {renderContent()}
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};
