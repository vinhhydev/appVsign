import Toast from 'react-native-toast-message';

export const showAlert = (type, title, text) => {
  Toast.show({
    type: type,
    text1: title,
    text2: text,
    visibilityTime: 2500,
    autoHide: true,
  });
};
