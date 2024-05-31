import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import RenderListChat from './RenderListChat';
import colors from '../../themes/colors';
import {db} from '../../../firebaseConfig';
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import {getRoomId} from '../../utils/chat';
import {useData} from '../../navigation/DataContext';
import {ActivityIndicator} from 'react-native';

export type DataListMess = {
  roomId: string;
  docId: string;
  userName: string;
  name: string;
  lastMessage: string;
  checkNew: boolean;
  createAt: string;
};

const ListChat = () => {
  const {userData} = useData();
  const navigation = useNavigation();
  const [listMess, setListMess] = useState<DataListMess[]>();
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  useEffect(() => {
    const docNewMess = doc(db, 'newMess', userData.userName);
    const collNewMess = collection(docNewMess, 'listmessage');

    const unsub = onSnapshot(collNewMess, async snapshot => {
      const listTemp: DataListMess[] = [];
      const collect = collection(db, 'rooms');
      const q = query(collect, orderBy('createAt', 'desc'));
      const querySnap = await getDocs(q);
      await Promise.all(
        querySnap.docs.map(async docData => {
          const docRef = doc(db, 'rooms', docData.data().roomId);
          const messageRef = collection(docRef, 'messages');
          const q = query(messageRef, orderBy('createAt', 'desc'), limit(1));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(val => {
            listTemp.push({
              roomId: docData.data().roomId,
              docId: val.id,
              userName: val.data().userName,
              name: docData.data().customerName,
              lastMessage:
                val.data().message.length > 0 ? val.data().message : 'Hình ảnh',
              createAt: val.data().createAt,
              checkNew:
                userData.userName === val.data().userName
                  ? false
                  : val.data().checkNew,
            });
          });
        }),
      );
      setListMess(listTemp);
    });
    return unsub;
  }, [isFocused]);

  useEffect(() => {
    if (listMess && listMess.length > 0) {
      setLoading(false);
    }
  }, [listMess]);

  return (
    <View style={styles.container}>
      <Header
        title={'Tin nhắn'}
        onPressLeft={() => navigation.goBack()}
        onPressRight={undefined}
        keyword={undefined}
        onChangeText={undefined}
        style={styles.backgroundHeader}
      />
      {loading ? (
        <ActivityIndicator size={35} />
      ) : (
        <FlatList
          data={listMess}
          keyExtractor={(_, index) => `listRoom-${index}`}
          renderItem={({item}) => <RenderListChat {...item} />}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}
        />
      )}
    </View>
  );
};

export default ListChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
  },
  backgroundHeader: {
    backgroundColor: colors.WHITE,
  },
});
