import {Switch} from 'react-native-switch';
import React from 'react';

const CustomSwitch = ({
  value,
  onValueChange,
  activeText = 'Quý',
  inActiveText = 'Ngày',
  disabled,
  circleBorderActiveColor = '#0A68FE',
  circleBorderInactiveColor = '#f9a726',
  backgroundActive = '#0A68FE',
  backgroundInactive = '#f9a726',
  circleActiveColor = '#F7F9F9',
  circleInActiveColor = '#F7F9F9',
}) => {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      activeTextStyle={{
        fontSize: 17,
        color: '#F7F9F9',
      }}
      inactiveTextStyle={{
        fontSize: 17,
        color: '#F7F9F9',
      }}
      disabled={disabled}
      activeText={activeText}
      inActiveText={inActiveText}
      circleSize={35}
      barHeight={35}
      circleBorderWidth={2.5}
      circleBorderActiveColor={circleBorderActiveColor}
      circleBorderInactiveColor={circleBorderInactiveColor}
      backgroundActive={backgroundActive}
      backgroundInactive={backgroundInactive}
      circleActiveColor={circleActiveColor}
      circleInActiveColor={circleInActiveColor}
      changeValueImmediately={true}
      innerCircleStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      switchLeftPx={4}
      switchRightPx={4}
      switchWidthMultiplier={2.5}
      switchBorderRadius={30}
    />
  );
};

export default CustomSwitch;
