import { useCallback, useEffect, useState } from 'react';
import { useSocket } from './socketContext';
import { Message, Question, Room } from '~/data/types';
import { IMessage } from 'react-native-gifted-chat';
import { debounce, throttle } from 'lodash';
import { PLACEHOLDER_ROOMS } from '~/data/schema/placeholder';

interface UseRoomSocketParams {
  roomId: number;
  username: string;
  // messages: IMessage[];
  setRoomData: (room: Room) => void;
  setNewMessage: (message: IMessage) => void;
  setMessages: (messages: IMessage[]) => void;
  setTrivia: (questions: Question[]) => void;
}

export const useRoomSocket = ({
  roomId,
  username,
  // messages,
  setRoomData,
  setNewMessage,
  setMessages,
  setTrivia,
}: UseRoomSocketParams) => {
  const { socket } = useSocket();
  const receivedMessageIds = new Set<number>();
  const [sentMessageIds, setSentMessageIds] = useState<Set<string>>(new Set());

  const handleNewMessage = useCallback(
    throttle(
      (data: {
        clientId: string;
        createdAt: Date;
        id: number;
        system: boolean;
        text: string;
        user: { id: number; username: string; avatar: string };
      }) => {
        try {
          console.log('handleNewMessage triggered:', data);
          const { createdAt, id, system, text, user } = data;

          if (user.username === username) {
            console.log('Ignoring duplicate message from the current user:', username);
            return;
          }

          if (receivedMessageIds.has(id)) {
            console.log('Duplicate message received, ignoring:', id);
            return;
          }

          receivedMessageIds.add(id);

          if (!user) {
            console.error('User object is undefined in new message received');
            return;
          }

          const newGiftedMessage = {
            _id: id,
            text: text,
            createdAt: new Date(createdAt),
            system: system,
            user: {
              _id: user.id,
              name: user.username,
              avatar: user.avatar,
            },
          };
          console.log('Appending new message:', newGiftedMessage);
          setNewMessage(newGiftedMessage);
        } catch (error) {
          console.error('Error in handleNewMessage:', error);
        }
      },
      1000
    ),
    [setNewMessage, username]
  );

  const handleJoinedRoom = useCallback(
    throttle((updatedRoom: any) => {
      console.log('Joined room:', updatedRoom);

      setRoomData(updatedRoom);
      // setRoomData(PLACEHOLDER_ROOMS[0]);

      if (updatedRoom.messages) {
        const giftedChatMessages = updatedRoom.messages.map((message: any) => ({
          _id: message.id,
          text: message.text,
          createdAt: new Date(message.createdAt),
          system: message.system,
          user: {
            _id: message.user?.id,
            name: message.user?.username,
            avatar: message.user?.avatar,
          },
        }));
        setMessages(giftedChatMessages);
      }
    }, 1000),
    [setRoomData, setMessages]
  );

  const handleTriviaQuestions = useCallback(
    throttle((questions: any) => {
      console.log('Received trivia questions:', questions.questions);
      setTrivia(questions.questions);
    }, 2000),
    [setTrivia]
  );

  const emitJoinRoom = useCallback(
    debounce((roomId: number, username: string) => {
      socket?.emit('joinRoom', { roomId, username }, (response: any) => {
        if (response?.error) {
          console.error('Error joining room:', response.error);
        }
      });
    }, 500),
    [socket]
  );

  /**
   * const handleRoomStatus = useCallback(
    (status: { status: 'active' | 'ended' }) => {
      console.log(`Room status: Room is now ${status.status}!`);
      setRoomStatus(status.status);
    },
    [setRoomStatus]
  );
   */

  useEffect(() => {
    if (!socket || !username) {
      console.log('Socket is not initialized or username is missing.');
      return;
    }

    console.log('Socket connected:', socket.connected);

    console.log('Setting up event listeners for roomId:', roomId);

    emitJoinRoom(roomId, username);

    socket.on('testEvent', (data) => {
      console.log('Test event received:', data);
    });

    socket.on('newMessage', handleNewMessage);
    socket.on('joinedRoom', handleJoinedRoom);
    socket.on('triviaQuestions', handleTriviaQuestions);

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      console.log('Cleaning up socket listeners...');
      socket?.off('testEvent');
      socket?.off('newMessage', handleNewMessage);
      socket?.off('joinedRoom', handleJoinedRoom);
      // socket?.off('triviaQuestions', handleTriviaQuestions);
    };
  }, [roomId, username, socket, handleJoinedRoom, handleNewMessage, handleTriviaQuestions]);
};
