import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Share, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { AntDesign } from '@expo/vector-icons';
import { Sheet, useSheetRef } from '~/components/nativewindui/Sheet';
import LottieView from 'lottie-react-native';
import { fontStyles } from '~/app/_layout';
import { useLocalSearchParams, useNavigation } from 'expo-router';
// import Countdown from 'react-native-countdown-component';

const predesignedMessages = [
  "Join me on TriviaRush and let's earn rewards together!",
  "Hey! I'm playing TriviaRush. Download the app and challenge me!",
  "Think you're smart? Prove it! Join TriviaRush and let's see who wins!",
];

const InviteFriendScreen = () => {
  const { profile } = useLocalSearchParams();
  const username = JSON.parse(String(profile)).username;
  const referralCode = `TR-${username}`;

  const { colors } = useColorScheme();
  const [selectedMessage, setSelectedMessage] = useState(
    'Select a preset message to share with a friend'
  );
  const bottomSheetModalRef = useSheetRef();

  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            width,
            height: 96,
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 12,
            gap: 8,
            paddingBottom: 16,
            elevation: 6,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="border-0 border-white p-2"
            style={{ position: 'relative', bottom: 0 }}>
            <AntDesign name="arrowleft" size={24} color={colors.foreground} />
            {/* <Ionicons name='arrow-back' size={24} color={colors.foreground} /> */}
          </TouchableOpacity>

          <Text
            variant="title3"
            className="p-2"
            style={[
              fontStyles.promptMedium,
              { color: colors.foreground, fontSize: 19, position: 'relative', top: 3 },
            ]}>
            {'Invite A Friend'}
          </Text>
        </View>
      ),
    });
  }, []);

  const openBottomSheet = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <View className="flex-1 border-0 border-white p-4">
      {/* Banner */}
      <View className="h-60 w-full items-center p-6">
        <Image
          source={require('~/assets/graphics/coins.png')}
          style={{ width: '100%', height: '100%', borderRadius: 16 }}
          contentFit="contain"
          contentPosition="center"
        />
      </View>

      {/* Lottie Animation */}
      {/* <View className="w-full items-center my-4">
        <LottieView
          source={require('../../assets/animations/invite-friend.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View> */}

      {/* Countdown Timer */}
      {/* <View className="w-full items-center my-4">
        <Countdown
          until={172800}
          size={20}
          onFinish={() => alert('Time is up! Invite now to win!')}
          digitStyle={{ backgroundColor: colors.primary }}
          digitTxtStyle={{ color: colors.foreground }}
          timeLabelStyle={{ color: colors.grey }}
          timeToShow={['H', 'M', 'S']}
          timeLabels={{ h: 'Hours', m: 'Minutes', s: 'Seconds' }}
        />
      </View> */}

      {/* Invite Message */}
      <Text variant="heading" style={fontStyles.promptSemiBold} className="mt-4 text-center">
        Invite a friend and earn RushCoins
      </Text>

      <Text
        variant="callout"
        style={[fontStyles.promptRegular, { color: colors.grey }]}
        className="mb-2 mt-0 text-center">
        Invite your friends and earn RushCoins plus other great Rush rewards.
      </Text>

      <TouchableOpacity
        onPress={openBottomSheet}
        style={{ borderColor: colors.grey, backgroundColor: 'transparent', borderWidth: 3 }}
        className="my-4 flex-row items-center justify-between gap-2 border-dashed p-3">
        <Text variant="callout" style={fontStyles.promptRegular} className="flex-1 leading-6">
          {selectedMessage}
        </Text>
        <AntDesign name="edit" size={24} color={colors.primary} />
      </TouchableOpacity>

      {/* QR Code */}
      {/* <View className="w-full items-center my-4">
        <Image
          source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?data=InviteCodeHere' }}
          style={{ width: 150, height: 150 }}
          contentFit="contain"
        />
      </View> */}

      {/* Bottom Sheet for Message Selection */}
      <Sheet ref={bottomSheetModalRef} snapPoints={[296]}>
        <View className="flex-1 items-center justify-center px-2 pb-8">
          {/* <Text variant="body" style={fontStyles.promptRegular} className="text-center">
            Select a message
          </Text> */}
          {predesignedMessages.map((message, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedMessage(message);
                bottomSheetModalRef.current?.close();
              }}
              className="w-full border-b py-3"
              style={{ borderColor: colors.grey2 }}>
              <Text
                variant="subhead"
                style={fontStyles.promptRegular}
                className="text-left leading-6">
                {message}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Sheet>

      <View className=" absolute bottom-0 w-full self-center py-10">
        <TouchableOpacity
          onPress={async () => {
            const message = `${selectedMessage}\n\nSign up using my referral code: ${referralCode}`;
            await Share.share({
              title: 'Invite to TriviaRush',
              message,
            });
          }}
          disabled={selectedMessage === 'Select a preset message to share with a friend'}
          style={{ backgroundColor: colors.primary }}
          className="mb-2 w-full p-3">
          <Text
            variant="callout"
            style={fontStyles.promptSemiBold}
            className="text-text text-center uppercase">
            Share Invite
          </Text>
        </TouchableOpacity>

        <Text
          variant="subhead"
          style={[fontStyles.promptRegular, { color: colors.grey }]}
          className="mt-0 mt-2 text-center">
          Your referral code:{' '}
          <Text variant="callout" className="font-semibold" style={{ color: colors.primary }}>
            {referralCode}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default InviteFriendScreen;
