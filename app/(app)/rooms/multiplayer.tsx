import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { StyleSheet } from 'nativewind';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useColorScheme } from '~/lib/useColorScheme';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import { Text } from '~/components/nativewindui/Text';
import { sampleQuestions, PLACEHOLDER_ROOMS } from '~/data/schema/placeholder';
import { fontStyles } from '~/app/_layout';
import { Question, UserProfile } from '~/data/types';
import { Image } from 'expo-image';
import { useSocket } from '~/utils/socket/socketContext';
import { debounce, throttle } from 'lodash';
import { AntDesign } from '@expo/vector-icons';

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

const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const ms = milliseconds % 1000;
  const formattedSeconds = seconds.toString().padStart(2, '0');
  const formattedMs = (ms / 10).toFixed(0).padStart(2, '0');
  return `${formattedSeconds}:${formattedMs}`;
};

export default function PlayScreen() {
  const { colors } = useColorScheme();
  const { roomId, questions, participants: participantsParams } = useLocalSearchParams();
  //   console.log('Search params | roomId: ', roomId);

  const trivia = JSON.parse(questions as string);
  const participants = JSON.parse(participantsParams as string);

  const { height } = useWindowDimensions();
  const { promptMedium, promptRegular, promptSemiBold, promptLight } = fontStyles;

  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [gamescore, setGameScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [leadingPlayerId, setLeadingPlayerId] = useState<number | null>(1);
  const [finalScore, setFinalScore] = useState<number | null>(1);

  const { socket } = useSocket();

  const currentQuestion = trivia[currentQuestionIndex];
  const playerSheetHeight = height * 0.4;

  const gameEndSheetRef = useSheetRef();

  const presentGameEndSheet = () => {
    gameEndSheetRef.current?.present();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setProfile(profile);
      } else {
        console.log('Play screen: No profile found');
      }
    };

    fetchProfile();
  }, []);

  // Countdown timer logic
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      handleNextQuestion();
    }
  }, [countdown]);

  const handleUserStats = useCallback(
    debounce((data: { userId: number; score: number, responseTime: number }) => {
      const { userId, score } = data;
      console.log(`Player\'s stats update received. User: ${userId} | Score: ${score}`);
      if (userId === profile?.id) setFinalScore(score);
    }, 300),
    []
  );

  const handleLeadingPlayerStats = useCallback(
    debounce((data: { userId: number; score: number }) => {
      const { userId, score } = data;
      console.log(`Leading Player update received. User: ${userId} | Score: ${score}`);
      setLeadingPlayerId(userId);
    }, 300),
    []
  )

  useEffect(() => {
    if (!socket) {
      console.log('Socket is not initialized is missing.');
      return;
    }

    socket.on('userStats', handleUserStats);
    socket.on('leadingPlayer', handleLeadingPlayerStats);

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      console.log('Cleaning up game socket listeners...');
      socket?.off('userStats', handleUserStats);
      socket?.off('leadingPlayer', handleLeadingPlayerStats);
    };
  }, [socket, handleUserStats]);

  // Function to handle answer selection
  const handleOptionSelect = (option: string) => {
    if (selectedOption) return; // Prevent multiple selections

    const endTime = Date.now();
    const responseTime = endTime - (startTime ?? endTime);
    const score = option === currentQuestion.answer ? 1 : 0;

    setSelectedOption(option);
    setResponseTime(responseTime);
    if (score > 0) {
      setGameScore((prevGameScore) => prevGameScore + score);
    }

    console.log('Response time & Score: ', responseTime, score);

    if (socket) {
      socket.emit('submitResponse', {
        roomId,
        questionId: currentQuestion.id,
        score,
        responseTime,
      });
    }
    {
    }
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setCountdown(15);
      setStartTime(Date.now()); // Reset start time for the next question
      setResponseTime(null);
    } else {
      console.log('Quiz Completed!');
      presentGameEndSheet();
    }
  };

  const handlePlayAnother = () => {
    router.replace('/');
  };

  const handleShare = () => {
    // Share the victory on social media
  };

  const handleViewLeaderboard = () => {
    // Route to the leaderboard screen
  };

  const renderSheetIcon = () => {
    return (
      <View
        style={{ position: 'relative', top: 0, left: 0, transform: [{ rotate: '5deg' }] }}
        className="w-full items-center border-0 border-white p-3">
        {profile?.id === leadingPlayerId ? (
          <AntDesign name="Trophy" size={64} color={colors.tertiary} />
        ) : (
          <AntDesign name="staro" size={64} color={colors.tertiary} />
        )}
      </View>
    );
  };

  const renderGameEndSheetContent = () => {
    const isLeadingPlayer = profile && profile.id === leadingPlayerId;

    if (isLeadingPlayer) {
      return (
        <View className="flex-1 items-center justify-start pb-8">
          <Text
            variant="title1"
            className="my-0 text-center"
            style={[promptSemiBold, { color: colors.foreground }]}>
            Congratulations, {profile?.username}!
          </Text>
          <Text
            variant="callout"
            className="my-2 px-3 text-center"
            style={[promptRegular, { color: colors.grey }]}>
            You dominated this game and earned {finalScore} stars. Keep up the winning streak!
          </Text>
          <Pressable
            className="my-2 rounded-full"
            onPress={handleShare}
            style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text
              variant="callout"
              className="text-text uppercase"
              style={[fontStyles.promptSemiBold, { textTransform: 'uppercase' }]}>
              Share Your Victory
            </Text>
          </Pressable>
          <Pressable
            className="my-1 rounded-full border-2"
            onPress={handleViewLeaderboard}
            style={[styles.button, { borderColor: colors.foreground }]}>
            <Text
              variant="callout"
              className="uppercase"
              style={[fontStyles.promptSemiBold, { textTransform: 'uppercase' }]}>
              View Leaderboard
            </Text>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View className="flex-1 items-center justify-start pb-8">
          <Text
            variant="title1"
            className="my-0 text-center"
            style={[promptSemiBold, { color: colors.foreground }]}>
            Well Done, {profile?.username}!
          </Text>
          <Text
            variant="callout"
            className="my-2 px-5 text-center"
            style={[promptRegular, { color: colors.grey }]}>
            You have earned {finalScore} stars. Play more to improve your score!
          </Text>
          <Pressable
            className="my-2 rounded-full"
            onPress={handlePlayAnother}
            style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text
              variant="callout"
              className="text-text uppercase"
              style={[fontStyles.promptSemiBold, { textTransform: 'uppercase' }]}>
              Play again
            </Text>
          </Pressable>
          <Pressable
            className="my-1 rounded-full border-2"
            onPress={handleViewLeaderboard}
            style={[styles.button, { borderColor: colors.foreground }]}>
            <Text
              variant="callout"
              className="uppercase"
              style={[fontStyles.promptSemiBold, { textTransform: 'uppercase' }]}>
              View Leaderboard
            </Text>
          </Pressable>
        </View>
      );
    }
  };

  return (
    <View className="flex-1 pt-6" style={{ backgroundColor: colors.card }}>
      {/* Header component */}
      <View
        className="w-full justify-between border-0 border-white"
        style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}>
        <View className="h-10 w-10 items-center justify-center rounded-full border-0 border-white bg-white/15">
          <Text variant="callout" style={[promptMedium, { color: colors.primary }]}>
            {countdown}
          </Text>
        </View>

        {selectedOption && (
          <Text
            variant="subhead"
            style={[promptMedium, { color: colors.primary, position: 'absolute', left: '20%' }]}>
            {formatTime(responseTime)}
            {'s'}
          </Text>
        )}

        <View className="flex-1 flex-row items-center justify-center">
          <Text
            variant="heading"
            style={[fontStyles.promptMedium, { position: 'relative', top: 1 }]}>
            {gamescore}
          </Text>
        </View>

        <TouchableOpacity
          className="z-10 h-12 w-12 items-end justify-center rounded-full "
          style={{ borderColor: colors.accent, borderWidth: 0 }}
          onPress={presentGameEndSheet}>
          {/* <Image
            source={{ uri: profile?.avatar }}
            style={{ width: '100%', height: '100%', borderRadius: 100 }}
            contentFit="cover"
            alt="Profile avatar"
            cachePolicy="memory-disk"
          /> */}
          <AntDesign name="bulb1" size={28} color={colors.tertiary} />
        </TouchableOpacity>
      </View>

      {/* Trivia component */}
      <View className="border-0 border-white px-3">
        <Text variant="callout" className="my-0" style={[promptRegular, { color: colors.grey }]}>
          <Text style={[promptMedium, { color: colors.tertiary }]}>
            Question {currentQuestionIndex + 1}
          </Text>{' '}
          of {sampleQuestions.length}
        </Text>

        <Text
          variant="title1"
          className="mb-3 mt-1"
          style={[promptMedium, { color: colors.foreground }]}>
          {currentQuestion.text}
        </Text>

        {JSON.parse(currentQuestion.options).map((option: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              {
                borderColor: selectedOption === option ? 'transparent' : colors.primary,
                backgroundColor:
                  selectedOption === option
                    ? option === currentQuestion.answer
                      ? colors.primary
                      : colors.destructive
                    : 'transparent',
              },
            ]}
            onPress={() => handleOptionSelect(option)}
            disabled={!!selectedOption} // Disable buttons after selection
          >
            <Text
              variant="heading"
              className="text-text"
              style={[promptMedium, { color: colors.foreground }]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Players Sheet component */}
      <View
        className="absolute bottom-0 left-0 right-0"
        style={[styles.bottomSheet, { backgroundColor: colors.grey5, height: playerSheetHeight }]}>
        <View className="flex-1 px-1 py-2">
          <Text
            variant="heading"
            className="my-1 text-center"
            style={[promptMedium, { color: colors.foreground }]}>
            Players
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              borderWidth: 0,
              borderColor: '#ccc',
              paddingTop: 6,
              paddingHorizontal: 6,
            }}>
            {participants.map(
              (
                participant: { user: { id: number; avatar: string; username: string } },
                index: React.Key
              ) => {
                const isCurrentUser = profile && participant.user.id === profile.id;
                const isLeadingPlayer = profile && participant.user.id === leadingPlayerId;
                return (
                  <View key={index} className="mx-2 my-2 items-center">
                    <Pressable
                      onPress={() => null}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
                        overflow: 'hidden',
                        borderColor: colors.accent,
                        borderWidth: 2,
                      }}>
                      <Image
                        source={{ uri: participant.user.avatar }}
                        style={{ width: '100%', height: '100%' }}
                        alt={`Avatar of ${participant.user.username}`}
                      />
                    </Pressable>
                    <Text
                      variant="subhead"
                      className="mt-px"
                      style={[promptRegular, { color: colors.foreground }]}>
                      {isCurrentUser ? 'You' : participant.user.username}
                    </Text>
                    {isLeadingPlayer && (
                      <Text
                        variant="caption1"
                        className="relative rounded-full px-2 text-center"
                        style={[{ color: colors.primary }, fontStyles.promptRegular]}>
                        Leading
                      </Text>
                    )}
  
                    {isLeadingPlayer && (
                      <View className="absolute right-0 top-0">
                        <AntDesign name="star" size={18} color={colors.tertiary} />
                      </View>
                    )}
                  </View>
                )
              }
            )}
          </View>
        </View>
      </View>

      {/* Game end sheet */}
      <Sheet
        ref={gameEndSheetRef}
        snapPoints={[height * 0.475]}
        handleComponent={() => null}
        enablePanDownToClose={false}
        onDismiss={() => router.replace('/')}
        handleIndicatorStyle={{ display: 'none' }}>
        {renderSheetIcon()}
        {renderGameEndSheetContent()}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderRadius: 0,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomSheet: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  modalUsername: {
    fontSize: 16,
    flex: 1,
  },
  modalGameScore: {
    fontSize: 16,
  },
  button: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'relative',
    // top: -4,
  },
});
