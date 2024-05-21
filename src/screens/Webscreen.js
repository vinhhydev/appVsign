import {useRoute, useNavigation} from '@react-navigation/native';
import LoadingComponent from '../components/LoadingComponent';
import WebView from 'react-native-webview';
import {SafeAreaView} from 'react-native';
import Header from '../components/Header';
import styles from '../themes/styles';
import React, {useState} from 'react';

const Webscreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        tg={route.params.tg}
        onPressLeft={() => navigation.goBack()}
        title={route.params.title}
      />
      {isLoading && <LoadingComponent size={0.85}></LoadingComponent>}
      <WebView
        source={{uri: route.params.url}}
        style={{flex: 1}}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
    </SafeAreaView>
  );
};

export default Webscreen;
