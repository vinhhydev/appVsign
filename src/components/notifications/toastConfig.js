import {BaseToast, ErrorToast} from 'react-native-toast-message';

export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#2ECC71'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: 'bold',
      }}
    />
  ),

  info: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#0A68FE'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: 'bold',
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: props => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: 'red'}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: 'bold',
      }}
    />
  ),
};
