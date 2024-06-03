import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import colors from '../../themes/colors';
import Header from '../../components/Header';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useData} from '../../navigation/DataContext';
import RenderMessage from './RenderMessage';
import {getRoomId} from '../../utils/chat';
import {db, storage} from '../../../firebaseConfig';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {showAlert} from '../../components/notifications/showAlert';
const WINDOW = Dimensions.get('screen');

export type DataMessage = {
  name: string;
  userName: string;
  message: string;
  path: string;
  type: 'image' | 'video' | '';
  createAt: string;
};

const Chat = ({route}: any) => {
  const {userData, userSupportChat} = useData();
  const [dataMessage, setDataMessage] = useState<DataMessage[]>();
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);
  const [responseImage, setResponseImage] = useState<ImageOrVideo[]>([]);
  const paramRoomId = route?.params?.roomId;
  const paramUserName = route?.params?.userName;
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  useEffect(() => {
    createRoom();
    const roomId =
      userData.userName !== userSupportChat
        ? getRoomId(userData.userName, userSupportChat)
        : paramRoomId;

    const docRef = doc(db, 'rooms', roomId);
    const messageRef = collection(docRef, 'messages');
    const q = query(messageRef, orderBy('createAt', 'asc'));

    const unsub = onSnapshot(q, snapshot => {
      let getMessage = snapshot.docs.map(doc => {
        return doc.data();
      }) as DataMessage[];
      setDataMessage(getMessage.reverse());
      setLoading(false);
    });
    return unsub;
  }, [isFocused]);

  const createRoom = async () => {
    const roomId = getRoomId(userData.userName, userSupportChat);
    if (userData.userName !== userSupportChat) {
      await setDoc(doc(db, 'rooms', roomId), {
        roomId,
        customerName: userData.fullName,
        createAt: Timestamp.fromDate(new Date()),
      });
    }
  };
  const handleSendMessage = async () => {
    try {
      const roomId =
        userData.userName !== userSupportChat
          ? getRoomId(userData.userName, userSupportChat)
          : paramRoomId;
      //update mess user support
      await updateDoc(doc(db, 'rooms', roomId), {
        createAt: Timestamp.fromDate(new Date()),
      });
      //handle send new mess to user support
      if (userData.userName !== userSupportChat) {
        const docRef = doc(db, 'newMess', userSupportChat);
        const coll = collection(docRef, 'listmessage');
        await addDoc(coll, {
          newMessage: true,
          createAt: Timestamp.fromDate(new Date()),
          message: message !== '' ? message : 'Hình ảnh',
          name: userData.fullName,
          userName: userData.userName,
        });
      }

      //handle send mess

      if (responseImage.length > 0) {
        await Promise.all(
          responseImage.map(async val => {
            await uploadFile(val.path, val.mime);
          }),
        );
      } else {
        const roomRef = doc(db, 'rooms', roomId);
        const messageRef = collection(roomRef, 'messages');
        const newDoc = await addDoc(messageRef, {
          userName: userData.userName,
          name: userData.fullName,
          message: message,
          path: '',
          type: '',
          checkNew: true,
          createAt: Timestamp.fromDate(new Date()),
        });

        console.log('message send', newDoc.id);
        setMessage('');
        inputRef.current?.clear();
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message);
    }
  };

  const handlePickerImage = () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      sortOrder: 'desc',
      includeBase64: true,
      forceJpg: true,
    })
      .then(images => {
        const temp = responseImage;

        if (images.length > 2) {
          showAlert('error', 'Chọn tối đa 2 hình hoặc video');
          return;
        }
        temp.push(...images);
        const unique = temp.filter((obj, index) => {
          return index === temp.findIndex(o => obj.path === o.path);
        });
        console.log('UNI', unique);
        setMessage('');
        setResponseImage(unique);
      })
      .catch(e => console.log('IMAGE PICKER: ', e.message));
  };

  const handleDeleteImage = (index: number) => {
    const newImages = responseImage.filter((_, _index) => _index !== index);

    setResponseImage(newImages);
  };

  const uploadFile = async (uri: string, fileType: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, 'Chat/' + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob, {
      contentType: fileType,
    });
    console.log('UPLOAD', uploadTask);

    // listen for events
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progressLoad =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progressLoad + '% done');
        setProgress(progress + progressLoad / responseImage.length);
        // setProgress(progressLoad.toFixed());
      },
      error => {
        // handle error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          console.log('File available at', downloadURL);
          // save record
          const type = fileType.indexOf('image') > -1 ? 'image' : 'video';
          await saveRecord(type, downloadURL);
        });
      },
    );
  };
  const saveRecord = async (fileType: string, url: string) => {
    try {
      const roomId =
        userData.userName !== userSupportChat
          ? getRoomId(userData.userName, userSupportChat)
          : paramRoomId;
      const roomRef = doc(db, 'rooms', roomId);
      const messageRef = collection(roomRef, 'messages');
      const newDoc = await addDoc(messageRef, {
        userName: userData.userName,
        name: userData.fullName,
        message: '',
        path: url,
        type: fileType,
        checkNew: true,
        createAt: Timestamp.fromDate(new Date()),
      });
      setResponseImage([]);
      setProgress(0);
      console.log('message send', newDoc.id);
    } catch (error) {
      Alert.alert('Lỗi', error as any);
    }
  };

  return (
    <SafeAreaView style={{position: 'relative'}}>
      <KeyboardAvoidingView behavior={'height'}>
        <View style={styles.container}>
          <Header
            title={
              paramUserName && paramUserName !== undefined
                ? paramUserName
                : 'Hỗ trợ trực tuyến'
            }
            onPressLeft={() => navigation.goBack()}
            onPressRight={undefined}
            keyword={undefined}
            onChangeText={undefined}
          />
          <Progress.Bar
            progress={progress}
            width={WINDOW.width}
            height={3}
            borderRadius={0}
            borderWidth={0}
          />
          {loading ? (
            <View
              style={{
                flex: 1,
                backgroundColor: colors.GRAY,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size={35} />
            </View>
          ) : (
            <FlatList
              data={dataMessage}
              keyExtractor={(_: any, index: number) => `message-${index}`}
              renderItem={data => (
                <RenderMessage data={data} userName={userData.userName} />
              )}
              style={{flex: 1, backgroundColor: colors.GRAY}}
              contentContainerStyle={styles.viewChat}
              inverted={true}
              showsVerticalScrollIndicator={false}
            />
          )}
          <View style={styles.viewInput}>
            {responseImage.length > 0 ? (
              <View style={styles.viewPickImage}>
                {responseImage.map((item, index) => {
                  return (
                    <View
                      key={`select-${index}`}
                      style={{paddingHorizontal: 5, position: 'relative'}}>
                      <Image
                        resizeMode="cover"
                        resizeMethod="scale"
                        style={styles.imagePick}
                        source={{uri: item.path}}
                      />
                      <TouchableOpacity
                        style={styles.iconClose}
                        onPress={() => handleDeleteImage(index)}>
                        <Icon name="close" size={20} color={colors.BLACK} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              <TextInput
                ref={inputRef}
                placeholder="Soạn văn bản..."
                style={styles.inputMess}
                onChangeText={val => setMessage(val)}
                multiline
              />
            )}
            <View
              style={[
                styles.viewTouch,
                responseImage.length > 0 && styles.fixTop,
              ]}>
              <TouchableOpacity
                style={styles.touchImage}
                onPress={handlePickerImage}>
                <Icon name="image" size={25} color={colors.BLACK} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchSendMess}
                disabled={message.length <= 0 && responseImage.length <= 0}
                onPress={handleSendMessage}>
                <Icon
                  name="send"
                  size={25}
                  color={
                    message.length <= 0 && responseImage.length <= 0
                      ? colors.BLACK_GRAY
                      : colors.BLACK
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    width: WINDOW.width,
    height: WINDOW.height - 80,
    flexShrink: 1,
  },
  viewChat: {
    backgroundColor: colors.GRAY,
    paddingVertical: 20,
    padding: 15,
  },
  viewInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    paddingHorizontal: 15,
    padding: 10,
    maxHeight: 150,
  },
  viewPickImage: {
    width: WINDOW.width - 100,
    flexDirection: 'row',
  },
  imagePick: {
    width: 100,
    height: 100,
    borderWidth: 0.5,
    borderColor: colors.BLACK_GRAY,
    borderRadius: 8,
  },
  iconClose: {
    position: 'absolute',
    right: 0,
    zIndex: 99,
    backgroundColor: colors.GRAY,
    borderRadius: 50,
    padding: 3,
  },
  inputMess: {
    width: WINDOW.width - 120,
    paddingHorizontal: 10,
  },
  viewTouch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
  fixTop: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  touchImage: {
    paddingVertical: 5,
    alignItems: 'center',
    width: 30,
  },
  touchSendMess: {
    paddingVertical: 5,
    alignItems: 'center',
    width: 30,
  },
});
