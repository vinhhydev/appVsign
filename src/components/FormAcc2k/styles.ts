import {StyleSheet} from 'react-native';
import colors from '../../themes/colors';

export const formStyles = StyleSheet.create({
  // style caledar modal
  calendarButton: {
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    width: 150,
    borderWidth: 1.5,
    borderColor: colors.SECONDCOLOR,
  },
  calendarButtonR: {
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    width: 150,
    borderWidth: 1.5,
    borderColor: colors.SECONDCOLOR,
  },

  //
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  titleForm: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.MAINCOLOR,
    marginVertical: 15,
  },
  rowLine: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  rowLineTitle: {
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.MAINCOLOR,
    backgroundColor: colors.LIGHT_BLUE,
  },
  rowLineContent: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 17,
    color: colors.BLACK,
  },
  leftLine: {
    flex: 1,
  },
  rightLine: {
    flex: 2,
  },

  leftLineHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  rightLineHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  textInput: {
    borderBottomWidth: 0.5,
    padding: 0,
    fontSize: 17,
  },
  formPanel: {
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  formTitleText: {
    fontSize: 18,
    color: colors.BLACK,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  formTextInput: {
    borderBottomWidth: 0.5,
    padding: 0,
    fontSize: 17,
    flex: 1,
    marginHorizontal: 5,
  },
  ddlWrapper: {
    width: '50%',
    maxWidth: 150,
  },
  ddlAutoWidth: {},
  viewAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  touchOK: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginRight: 20,
    backgroundColor: colors.MAINCOLOR,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.LIGHT_BLUE,
  },
  textTouchOK: {
    fontSize: 16,
    color: colors.WHITE,
    fontWeight: 'bold',
  },
  touchCancel: {
    padding: 5,
    marginHorizontal: 5,
    backgroundColor: colors.WHITE,
    borderRadius: 5,
  },
  textTouchCancel: {
    fontSize: 16,
    color: colors.BLACK,
    fontWeight: 'bold',
  },

  touchLoadmore: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLoadmore: {
    lineHeight: 15,
    color: colors.BLACK,
  },
  touchMonth: {
    color: colors.MAINCOLOR,
    fontWeight: 'bold',
    fontSize: 17,
  },
});
