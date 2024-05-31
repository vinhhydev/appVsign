import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../themes/colors';
import {DataMessage} from '.';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../shared/navigationStrings';
import Icon from 'react-native-vector-icons/MaterialIcons';

type DataProp = {
  data: ListRenderItemInfo<DataMessage>;
  userName: string;
};

const RenderMessage = ({data, userName}: DataProp) => {
  const navigation = useNavigation();
  return userName === data.item.userName ? (
    <View style={[styles.viewCurrentUser, styles.boxMessage]}>
      {data.item.message.length > 0 ? (
        <View style={styles.boxCurrentMess}>
          <Text style={styles.textCurrentUser}>{data.item.message}</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate({
              name: navigationStrings.FULLIMAGE,
              params: {
                url: data.item.path,
                type: data.item.type,
              },
            } as never)
          }>
          <FastImage
            source={{
              uri: data.item.path,
            }}
            resizeMode="cover"
            style={styles.imageMess}
          />
          {data.item.type === 'video' && (
            <Icon
              name="play-arrow"
              size={30}
              style={styles.iconPlay}
              color={colors.BLACK}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  ) : (
    <View style={[styles.viewRepUser, styles.boxMessage]}>
      {data.item.message.length > 0 ? (
        <View style={styles.boxRepMess}>
          <Text style={styles.textRepUser}>{data.item.message}</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate({
              name: navigationStrings.FULLIMAGE,
              params: {
                url: data.item.path,
                type: data.item.type,
              },
            } as never)
          }
          style={{position: 'relative'}}>
          <FastImage
            source={{
              uri: data.item.path,
            }}
            resizeMode="cover"
            style={styles.imageMess}
          />
          {data.item.type === 'video' && (
            <Icon
              name="play-arrow"
              size={30}
              style={styles.iconPlay}
              color={colors.BLACK}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RenderMessage;

const styles = StyleSheet.create({
  boxMessage: {
    marginVertical: 10,
  },
  viewCurrentUser: {
    alignSelf: 'flex-end',
  },
  boxCurrentMess: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.MAINCOLOR,
    borderRadius: 15,
  },
  textCurrentUser: {
    color: colors.WHITE,
  },
  viewRepUser: {
    alignSelf: 'flex-start',
  },
  boxRepMess: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.WHITE,
    borderRadius: 15,
  },
  textRepUser: {},
  imageMess: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  videoMess: {
    width: 150,
    height: 150,
  },
  iconPlay: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: colors.BLACK_GRAY,
    borderRadius: 30,
  },
});
