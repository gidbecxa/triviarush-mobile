import * as React from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, View } from 'react-native';
import { StyleSheet } from 'nativewind';
import {
  GiftedChat,
  IMessage,
  InputToolbarProps,
  BubbleProps,
  MessageProps,
  TimeProps,
  SystemMessageProps,
  SystemMessage,
  SendProps,
  ComposerProps,
  AvatarProps,
  Avatar,
  Bubble,
  InputToolbar,
  Send,
  Composer,
  Time,
  Message,
  DayProps,
  Day,
} from 'react-native-gifted-chat';
import * as SecureStore from 'expo-secure-store';
import { debounce } from 'lodash';

import ChatroomAppBar from '~/components/interface/ChatAppBar';
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '../../_layout';
import { useColorScheme } from '~/lib/useColorScheme';
import { Question, Room, UserProfile } from '~/data/types';
import { Image, ImageBackground } from 'expo-image';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRoomSocket } from '~/utils/socket/useRoomSocket';
import { useSocket } from '~/utils/socket/socketContext';
import { sampleQuestions } from '~/data/schema/placeholder';

const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await SecureStore.getItemAsync('profile');
    if (profile) {
      return JSON.parse(profile);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};

export default function RoomChatScreen() {
  const { roomId } = useLocalSearchParams();
  const { socket } = useSocket();

  const { colors } = useColorScheme();
  const { promptMedium, promptRegular, promptSemiBold } = fontStyles;

  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [roomData, setRoomData] = React.useState<Room | null>(null);
  const [roomStatus, setRoomStatus] = React.useState('waiting');
  const [newMessage, setNewMessage] = React.useState<IMessage>(null);
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [trivia, setTrivia] = React.useState<Question[]>([]);
  const [isCountdownVisible, setIsCountdownVisible] = React.useState(false);
  const [countdown, setCountdown] = React.useState(10); // Countdown starts from 15 seconds

  // Fetch user's profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setProfile(profile);
      } else {
        console.log('No profile found');
      }
    };

    fetchProfile();
  }, []);

  useRoomSocket({
    roomId: Number(roomId),
    username: profile?.username,
    setRoomData,
    setNewMessage,
    setMessages,
    setTrivia,
  });

  console.log('Chatroom players:', roomData?.participants);

  // Append the new message to the existing messages when the new message is received via socket
  React.useEffect(() => {
    if (newMessage) {
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [newMessage]));
    }
  }, [newMessage]);

  // Handle game start countdown when questions are received
  React.useEffect(() => {
    if (trivia.length >= 1) {
      setIsCountdownVisible(true);

      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount === 1) {
            clearInterval(timer);
            console.log('Trivia game started!');
            router.push({
              pathname: '/rooms/multiplayer',
              params: {
                roomId,
                questions: JSON.stringify(trivia),
                participants: JSON.stringify(roomData?.participants),
              },
            });
            setIsCountdownVisible(false);
          }
          return prevCount - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [trivia, roomData]);

  const minimizeCountdown = () => {
    setIsCountdownVisible(false);
  };

  /* React.useEffect(() => {
    setTrivia(sampleQuestions);
  }, []); */

  React.useEffect(() => {
    const backAction = () => {
      setIsModalVisible(true);
      setModalMessage(
        'Are you sure you want to leave? By leaving the room, you might miss the game when it starts.'
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const leaveRoom = () => {
    setIsModalVisible(false);
    router.back();
  };

  const stayInRoom = () => {
    setIsModalVisible(false);
  };

  // implement onSend messages
  const onSend = React.useCallback(
    debounce((newMessages: IMessage[] = []) => {
      if (!socket) return;

      newMessages.forEach((message) => {
        const { _id, text, createdAt, user } = message;
        console.log('Sending message:', message);
        socket.emit('sendMessage', {
          messageId: _id,
          text,
          createdAt,
          userId: String(user._id),
          roomId,
        });
      });

      setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    }, 500),
    [socket, roomId]
  );

  // implement renderAvatar
  const renderAvatar = (props: AvatarProps<IMessage>) => {
    const { currentMessage } = props;

    return (
      <Avatar
        containerStyle={{
          left: {
            marginRight: 4,
            width: 80,
            height: 80,
          },
          right: {
            marginLeft: 4,
            width: 80,
            height: 80,
          },
        }}
        imageStyle={{
          left: {
            borderRadius: 40,
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            objectFit: 'cover',
          },
          right: {
            borderRadius: 40,
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            objectFit: 'cover',
          },
        }}
        currentMessage={currentMessage}
        onPressAvatar={() => console.log('Avatar pressed! User:', currentMessage.user)}
      />
    );
  };

  // implement renderMessageBubble
  const renderMessageBubble = (props: BubbleProps<IMessage>) => {
    const { currentMessage } = props;
    return (
      <Bubble
        {...props}
        renderMessageText={() => (
          <Text
            variant="callout"
            style={fontStyles.promptRegular}
            className="border-0 border-white">
            {currentMessage.text}
          </Text>
        )}
        renderTime={(timeProps: TimeProps<IMessage>) => (
          <Time
            {...timeProps}
            position={currentMessage.user._id === profile.id ? 'right' : 'left'}
            // timeFormat="HH:MM"
            containerStyle={{
              left: {
                borderWidth: 0,
                borderColor: '#ccc',
                width: '100%',
                marginLeft: 0,
              },
              right: {
                borderWidth: 0,
                borderColor: '#ccc',
                width: '100%',
                marginRight: 0,
              },
            }}
            timeTextStyle={{
              left: {
                color: colors.foreground,
                fontSize: 11,
                fontFamily: promptRegular.fontFamily,
              },
              right: {
                color: colors.foreground,
                fontSize: 11,
                fontFamily: promptRegular.fontFamily,
              },
            }}
          />
        )}
        renderUsernameOnMessage={true}
        renderUsername={() => (
          <Text variant="caption1" style={fontStyles.promptRegular} className="border border-white">
            {currentMessage.user.name}
          </Text>
        )}
        containerStyle={{
          left: {
            borderWidth: 0,
            borderColor: '#ccc',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: colors.grey2,
            borderTopRightRadius: 32,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            borderTopLeftRadius: 0,
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 2,
            maxWidth: '75%',
          },
          right: {
            backgroundColor: colors.grey3,
            borderTopLeftRadius: 32,
            borderBottomRightRadius: 32,
            borderBottomLeftRadius: 32,
            borderTopRightRadius: 0,
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 2,
            maxWidth: '75%',
          },
        }}
        textStyle={{
          left: {
            color: colors.foreground,
          },
          right: {
            color: colors.foreground,
          },
        }}
        currentMessage={currentMessage}
        user={currentMessage.user}
      />
    );
  };

  // implement renderMessage
  const renderMessage = (props: MessageProps<IMessage>) => {
    return (
      <Message
        {...props}
        containerStyle={{
          left: {
            borderWidth: 0,
            borderColor: '#ccc',
            marginVertical: 4,
          },
          right: {
            borderWidth: 0,
            borderColor: '#ccc',
            marginVertical: 4,
          },
        }}
        renderAvatar={renderAvatar}
        // renderDay={() => null}
        // renderBubble={renderMessageBubble}
        // renderAvatar={renderAvatar}
      />
    );
  };

  // renderDay
  const renderDay = (props: DayProps<IMessage>) => {
    return (
      <Day
        {...props}
        containerStyle={{
          borderWidth: 0,
          borderColor: '#ccc',
          marginVertical: 4,
        }}
        textStyle={{
          color: colors.grey,
          fontFamily: promptMedium.fontFamily,
          fontSize: 13,
        }}
      />
    );
  };

  // implement renderSystemMessage
  const renderSystemMessage = (props: SystemMessageProps<IMessage>) => {
    const { currentMessage } = props;
    return currentMessage.text.startsWith('Welcome') ? (
      <SystemMessage
        {...props}
        textStyle={{
          color: colors.foreground,
          fontFamily: promptRegular.fontFamily,
          fontSize: 15,
          lineHeight: 22,
        }}
        containerStyle={{
          borderColor: colors.tertiary,
          borderWidth: 0.5,
          paddingVertical: 12,
          paddingRight: 20,
          paddingLeft: 2,
          margin: 8,
        }}
      />
    ) : (
      <SystemMessage
        {...props}
        textStyle={{
          color: colors.foreground,
          fontFamily: promptRegular.fontFamily,
          fontSize: 13,
          lineHeight: 18,
          letterSpacing: -0.5,
        }}
        containerStyle={{
          borderColor: colors.tertiary,
          borderWidth: 0,
          paddingVertical: 12,
          alignItems: 'center',
          marginTop: 0,
        }}
      />
    );
  };

  // implement input toolbar
  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'transparent',
          borderTopColor: colors.background,
          borderTopWidth: 0,
          paddingHorizontal: 8,
        }}
      />
    );
  };

  const renderComposer = (props: ComposerProps) => (
    <Composer
      {...props}
      composerHeight={48}
      multiline={false}
      keyboardAppearance="default"
      textInputStyle={{
        color: colors.foreground,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: 32,
        borderColor: colors.primary,
        paddingHorizontal: 16,
        marginLeft: 0,
        fontFamily: promptRegular.fontFamily,
        fontSize: 16,
        lineHeight: 24,
      }}
    />
  );

  // implement renderSend
  const renderSend = (props: SendProps<IMessage>) => {
    return (
      <Send
        {...props}
        alwaysShowSend
        containerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          height: 48,
          width: 48,
          backgroundColor: 'rgba(142, 142, 147, 0.4)',
          borderRadius: 32,
          marginLeft: 8,
          position: 'relative',
          top: -2,
        }}>
        <MaterialCommunityIcons name="arrow-up-thin" size={24} color={colors.primary} />
      </Send>
    );
  };

  return (
    <View className="flex-1 pb-8" style={{ backgroundColor: colors.card }}>
      <ImageBackground
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.75 }}
        cachePolicy="memory"
        contentFit="cover"
        contentPosition="center"
        source={require('../../../assets/graphics/ImageBackground01.png')}>
        <ChatroomAppBar />
        {/* Render gifted chat ui */}
        <GiftedChat
          messages={messages.sort((a, b) => {
            return b.createdAt.valueOf() - a.createdAt.valueOf();
          })}
          onSend={onSend}
          user={{ _id: profile?.id, name: profile?.username, avatar: profile?.avatar }}
          showUserAvatar
          // renderAvatar={renderAvatar}
          renderBubble={renderMessageBubble}
          renderMessage={renderMessage}
          renderSystemMessage={renderSystemMessage}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          renderComposer={renderComposer}
          renderDay={renderDay}
          keyboardShouldPersistTaps="never"
          alignTop
          scrollToBottom
          renderAvatarOnTop
          infiniteScroll
          maxComposerHeight={80}
          // inverted={false}
        />
        {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
      </ImageBackground>

      <Portal>
        <Modal visible={isModalVisible} onDismiss={stayInRoom} contentContainerStyle={styles.modal}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text variant="body" className="mb-2" style={promptRegular}>
              {modalMessage}
            </Text>
            <View style={styles.modalButtons}>
              <Button mode="text" className="relative top-1" onPress={leaveRoom}>
                <Text variant="body" style={[promptMedium, { color: colors.destructive }]}>
                  Leave
                </Text>
              </Button>
              <Button
                theme={{ colors: { primary: colors.primary, onPrimary: colors.root } }}
                mode="contained"
                onPress={stayInRoom}>
                <Text variant="subhead" style={[promptMedium, { color: colors.card }]}>
                  Stay
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      <Portal>
        {/* Countdown Modal */}
        <Modal
          visible={isCountdownVisible}
          dismissable={true}
          onDismiss={minimizeCountdown}
          contentContainerStyle={styles.modal}>
          <View style={[styles.countdownModal, { backgroundColor: colors.card }]}>
            <View
              className="mt-0 items-center justify-center rounded-full p-2"
              style={{
                width: 84,
                height: 84,
                backgroundColor: 'transparent',
              }}>
              <Image
                source={require('~/assets/graphics/rocket.png')}
                alt="TriviaRush Rocket"
                contentFit="contain"
                contentPosition="center"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: [{ rotate: '45deg' }],
                }}
              />
            </View>
            <Text
              variant="title1"
              className="my-4"
              style={[promptMedium, { color: colors.tertiary }]}>
              Ready?
            </Text>
            <Text
              variant="title3"
              className="mx-4 mb-6"
              style={[promptMedium, { color: colors.foreground }]}>
              The rush begins in ...
            </Text>
            <Text
              variant="largeTitle"
              className="mb-6"
              style={[promptSemiBold, { color: colors.primary }]}>
              {countdown}
            </Text>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: 16,
    borderRadius: 0,
    alignItems: 'center',
  },
  countdownModal: {
    padding: 16,
    width: '90%',
    borderRadius: 0,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 12,
  },
});
