import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {DataListMess} from '.';
import colors from '../../themes/colors';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../../shared/navigationStrings';
import {useData} from '../../navigation/DataContext';
import {doc, updateDoc} from 'firebase/firestore';

import {db} from '../../../firebaseConfig';

const RenderListChat = (props: DataListMess) => {
  const {userData} = useData();
  const navigation = useNavigation();
  const updateCheckNew = async () => {
    await updateDoc(doc(db, 'rooms', props.roomId, 'messages', props.docId), {
      checkNew: false,
    });
    navigation.navigate({
      name: navigationStrings.CHAT,
      params: {roomId: props.roomId, userName: props.name},
    } as never);
  };
  return (
    <TouchableOpacity
      style={styles.containerList}
      onPress={() => updateCheckNew()}>
      <Text style={styles.textName}>{props.name}</Text>
      <Text style={styles.textMessage}>{`${
        userData.userName === props.userName ? 'Bạn: ' : ''
      } ${props.lastMessage}`}</Text>
      {props.checkNew && <View style={styles.dotNew} />}
    </TouchableOpacity>
  );
};

export default RenderListChat;

const styles = StyleSheet.create({
  containerList: {
    backgroundColor: colors.WHITE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 80,
    position: 'relative',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  textName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  textMessage: {},
  dotNew: {
    width: 15,
    height: 15,
    backgroundColor: colors.RED,
    borderRadius: 20,
    position: 'absolute',
    right: 10,
    top: 5,
  },
});
