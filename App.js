import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './src/navigation/MainNavigation';
import {toastConfig} from './src/components/notifications/toastConfig';
import {DataProvider} from './src/navigation/DataContext';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import 'react-native-get-random-values';
import {useEffect} from 'react';
import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {LogBox} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { getFcmToken, registerListenerWithFCM } from './src/utils/fcmHelper';

if (Platform.OS === 'ios') {
  if (__DEV__) {
    NativeModules.DevSettings.setIsDebuggingRemotely(false);
  }
}

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);



const App = () => {

  useEffect(()=>{
    KeepAwake.activate();
    SplashScreen.hide();
    getFcmToken();
  },[])

  useEffect(() => {
    const unsubscribe = registerListenerWithFCM();
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <DataProvider>
          <MainNavigation />
          <Toast config={toastConfig} />
        </DataProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
