import React from 'react';
import { View, Pressable } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Text } from '~/components/nativewindui/Text';
import { topics } from '~/data/schema/topics';

const getTopicAvatarBySlug = (slug: string) => {
  const topic = topics.find((topic) => topic.slug === slug);
  return topic ? topic.avatar : '';
};

const ChatroomAppBar = () => {
  const { colors, isDarkColorScheme } = useColorScheme();
  const { roomName, topic } = useLocalSearchParams();
  const avatar = getTopicAvatarBySlug(topic as string);

  return (
    <Appbar.Header
      style={{ backgroundColor: 'transparent', borderColor: colors.grey4, elevation: 0 }}
      elevated={false}
      className="border-b-0">
      <View className="mb-2 flex-row items-center">
        <Image
          source={avatar}
          style={{ width: 55, height: 55, marginHorizontal: 6 }}
          className="rounded-full"
          alt="Room avatar"
          cachePolicy="memory"
        />
        <Text
          variant="callout"
          style={{ color: colors.foreground, fontFamily: 'Prompt-Regular', fontSize: 18 }}>
          {''}
        </Text>
      </View>
      <Appbar.Content title="" />
      {/* <Appbar.Action
        accessibilityLabel="Room Information"
        size={48}
        rippleColor="transparent"
        icon={() => (
          <Pressable
            accessibilityHint="Tap to view room information"
            className="h-12 w-12"
            style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <Feather name="info" size={24} color={colors.foreground} />
          </Pressable>
        )}
        onPress={() => console.log('Room Information Clicked')}
      /> */}
      <View accessibilityLabel="Room Information" className="p-3">
        <Pressable
          accessibilityHint="Tap to view room information"
          className="h-12 w-12"
          style={{ alignItems: 'flex-end', justifyContent: 'center' }}
          onPress={() => console.log('Room Information Clicked')}>
          <Feather name="info" size={24} color={colors.foreground} />
        </Pressable>
      </View>
    </Appbar.Header>
  );
};

export default ChatroomAppBar;
