import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './src/navigation/MainNavigation';
import {toastConfig} from './src/components/notifications/toastConfig';
import {DataProvider} from './src/navigation/DataContext';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import 'react-native-get-random-values';
import {useEffect} from 'react';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <DataProvider>
        <MainNavigation />
        <Toast config={toastConfig} />
      </DataProvider>
    </NavigationContainer>
  );
};

export default App;
