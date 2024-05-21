import {View, Dimensions, ActivityIndicator} from 'react-native';
import React from 'react';

const {height, width} = Dimensions.get('screen');

const LoadingComponent = ({size}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: height * size,
      }}>
      <ActivityIndicator size={'large'}></ActivityIndicator>
    </View>
  );
};

export default LoadingComponent;
