import {GiftedChat, Send, InputToolbar, Bubble} from 'react-native-gifted-chat';
import navigationStrings from '../../../shared/navigationStrings';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import IconUser from 'react-native-vector-icons/FontAwesome';
import {View, Text, SafeAreaView, Alert} from 'react-native';
import imagesPath from '../../../shared/imagesPath';
import wsStrings from '../../../shared/wsStrings';
import socket from '../../utils/socketConnect';
import {hotroUrl} from '../../../shared/url';
import Header from '../../components/Header';
import styles from '../../themes/styles';
import colors from '../../themes/colors';
import {Image} from '@rneui/base';
import vi from 'dayjs/locale/vi';
import axios from 'axios';

const Message = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [dataMessage, setDataMessage] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const roomId = route.params.data[0].giatri;

  // Lắng nghe sự kiện từ phía server
  useEffect(() => {
    socket.on('SUPPORTER_JOINED', () => {
      if (!isJoined) {
        setIsJoined(true);
      }
    });
    socket.on('USER_HAVE_NEW_MESSAGE', () => getMessage());
  }, [socket]);

  useEffect(() => {
    socket.emit('JOIN_ROOM', {
      roomId: roomId,
      connection: 'user',
    });
    getMessage();
  }, []);

  // Xử lý khi người dùng gửi tin nhắn
  const onSend = useCallback((messages = []) => {
    setDataMessage(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    sendMessage(messages[0].text);
  }, []);

  // Chuyển đổi dữ liệu tin nhắn từ server thành dữ liệu để render
  const createMessagesData = async data => {
    if (data) {
      const formatedMessage = {
        _id: Math.round(Math.random() * 10000000), // Random giá trị _id
        text: data.noidung,
        createdAt: data.thoigian,
        user: {
          _id: data.ben == 'B' ? 1 : 2,
          name: data.hotena,
          avatar: '',
        },
      };
      setDataMessage(prevMessages => [formatedMessage, ...prevMessages]);
    }
  };

  const askUserLeaveChat = () => {
    Alert.alert('Xác nhận', 'Bạn có muốn kết thúc đoạn chat?', [
      {text: 'Có', style: 'destructive', onPress: () => endChat()},
      {text: 'Không'},
    ]);
  };

  const getMessage = async () => {
    await axios
      .post(hotroUrl + wsStrings.GET_MESSAGE, {id: roomId})
      .then(response => {
        if (response.data.d) {
          const res = JSON.parse(response.data.d);
          const newestMessage = res[res.length - 1];
          createMessagesData(newestMessage);
        }
      })
      .catch(e =>
        Alert.alert('Lỗi', 'Không thể gửi yêu cầu hỗ trợ\n' + e.message),
      );
  };

  const sendMessage = async message => {
    await axios
      .post(hotroUrl + wsStrings.SEND_MESSAGE, {
        id: roomId,
        username: route.params.userInfo.phoneNumber,
        danhxung: route.params.userInfo.pickDanhxung,
        hoten: route.params.userInfo.name,
        email: route.params.userInfo.email,
        ma_loai_sp: route.params.userInfo.pickDmnhsp,
        ma_sp: route.params.userInfo.pickSp,
        ben: 'B',
        noidung: message,
        tenfile: '',
        hotena: route.params.userInfo.name,
      })
      .then(response => {
        if (response.data.d) {
          socket.emit('USER_SEND_NEW_MESSAGE', {roomId: roomId});
        }
      });
  };

  const endChat = async () => {
    await axios
      .post(hotroUrl + wsStrings.END_CHAT, {
        username: route.params.userInfo.phoneNumber,
        id: route.params.data[0].giatri,
      })
      .then(response => {
        if (response.data.d) {
          socket.emit('LEAVE_ROOM', {
            roomId: roomId,
            connection: 'user',
          });
          navigation.navigate(navigationStrings.HOME);
        }
      });
  };

  const renderSendButton = props => {
    return (
      <Send {...props}>
        <View style={{marginBottom: 7}}>
          <IconUser name="send" size={28} color={colors.MAINCOLOR} />
        </View>
      </Send>
    );
  };

  const renderInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          marginLeft: 15,
          marginRight: 15,
          backgroundColor: colors.WHITE,
          justifyContent: 'flex-end',
        }}
      />
    );
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: colors.GRAY,
          },
          right: {
            backgroundColor: colors.MAINCOLOR,
          },
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onPressLeft={() => navigation.goBack()}
        title={
          <View style={{width: 270, justifyContent: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <IconUser name="user-circle" size={40} color={colors.MAINCOLOR} />
              <View style={{marginLeft: 15}}>
                <Text style={styles.textH}>Username</Text>
                <Text style={styles.text}>Nhân viên hỗ trợ</Text>
              </View>
            </View>
          </View>
        }
        disableRight={false}
        rightIcon="chat-minus-outline"
        colorRight={colors.RED}
        onPressRight={() => askUserLeaveChat()}
      />
      {isJoined ? (
        <GiftedChat
          placeholder="Aa"
          messages={dataMessage}
          locale={vi}
          renderAvatar={null}
          scrollToBottom={true}
          onSend={onSend}
          renderSend={props => renderSendButton(props)}
          renderInputToolbar={props => renderInputToolbar(props)}
          renderBubble={props => renderBubble(props)}
          textInputStyle={{
            borderRadius: 30,
            borderColor: colors.GRAY,
            borderWidth: 3,
            paddingHorizontal: 10,
            paddingTop: 7,
          }}
          user={{
            _id: 1,
            name: route.params.userInfo.name,
          }}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={[styles.textH, {textAlign: 'center'}]}>
            Nhân viên hỗ trợ sẽ liên hệ với bạn {'\n'} trong giây lát
          </Text>
          <Image
            style={{width: 150, height: 50, resizeMode: 'contain'}}
            source={imagesPath.WAIT}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Message;
