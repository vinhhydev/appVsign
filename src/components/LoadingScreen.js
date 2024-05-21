import {View, Text, ActivityIndicator} from 'react-native';
import styles from '../themes/styles';
import React from 'react';

const LoadingScreen = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size={'large'} color={'#F7F9F9'}></ActivityIndicator>
      <Text
        style={{
          fontSize: 19,
          color: '#F7F9F9',
        }}>
        Vui lòng đợi
      </Text>
    </View>
  );
};

export default LoadingScreen;
