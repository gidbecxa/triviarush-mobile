import * as React from 'react';
import { Link, router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Pressable, Touchable, TouchableOpacity, View } from 'react-native';
import { cssInterop, StyleSheet } from 'nativewind';
import * as SecureStore from 'expo-secure-store';

import { Text } from '~/components/nativewindui/Text';
import { Image, ImageBackground } from 'expo-image';
import { useColorScheme } from '~/lib/useColorScheme';
import { topics } from '~/data/schema/topics';
import { fontStyles } from '../_layout';
import { PLACEHOLDER_ROOMS } from '~/data/schema/placeholder';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { RoomParticipant, UserProfile } from '~/data/types';
import { RoomApi } from '~/api/api';

cssInterop(Image, {
  className: 'style',
});

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

export default function DetailsScreen() {
  const { topic: topicParam } = useLocalSearchParams();
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const topic = topics.find((t) => t.slug === topicParam);
  const ComponentToRender = COMPONENTS.find((c) => c.name === topicParam)?.component;

  return (
    <ImageBackground
      style={styles.container}
      cachePolicy="memory"
      contentFit="cover"
      contentPosition="center"
      source={topic.background}>
      {ComponentToRender ? (
        <ComponentToRender topic={topic} />
      ) : (
        <Text variant="title3" style={fontStyles.promptSemiBold}>
          No details found for topic: {topicParam}
        </Text>
      )}
    </ImageBackground>
  );
}

type ComponentItem = { name: string; component: React.FC<{ topic: any }> };

const renderTitleWithoutEmojis = (title: string) => {
  return title.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
};

function DetailsComponent({ topic }: { topic: any }) {
  const { roomName, roomId } = useLocalSearchParams();

  const { colors } = useColorScheme();

  const placeholderRoom = PLACEHOLDER_ROOMS.find((room) => room.category === topic.slug);
  const placeholderPlayers = placeholderRoom?.participants || [];

  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [players, setPlayers] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        console.log('Profile:', profile);
        setProfile(profile);
      } else {
        console.log('No profile found');
      }
    };

    fetchProfile();
  }, []);

  React.useEffect(() => {
    async function fetchPlayersInRoom() {
      if (roomId) {
        try {
          const data = await RoomApi.getPlayersInRoom(String(roomId));
          console.log('Players in room:', data);
          setPlayers(data);
        } catch (error) {
          console.error('Failed to fetch participants:', error);
        }
      }
    }

    fetchPlayersInRoom();
  }, [roomId]);

  const isThisPlayerInRoom = players?.some((player) => player.userId === profile?.id);

  const participantNames = players
    .slice(0, 3)
    .map((p) => p.user.username)
    .join(', ');

  console.log('Participants names:', participantNames);

  return (
    <View className="w-full flex-1 items-center justify-between border-0 border-white py-16">
      <TouchableOpacity
        className="absolute left-2 top-8 rounded-full bg-white/15 p-3"
        onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color={colors.foreground} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text variant="largeTitle" className="text-center" style={fontStyles.promptSemiBold}>
          {renderTitleWithoutEmojis(topic.title)}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.foreground }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarShadow} />
          <Image
            style={styles.avatar}
            className="rounded-full"
            source={topic.avatar}
            alt={`${topic.slug} avatar`}
            cachePolicy="memory"
          />
        </View>

        <Text
          variant="callout"
          style={[fontStyles.promptRegular, styles.description, { color: colors.grey3 }]}>
          Dive into the world of{' '}
          <Text variant="heading" style={[fontStyles.promptMedium, { color: colors.secondary }]}>
            {renderTitleWithoutEmojis(topic.title)}
          </Text>{' '}
          and test your knowledge. Can you master this trivia challenge? Join now and find out!
        </Text>

        {/* Render participants who have joined the room */}
        <View
          className="w-full flex-row justify-center"
          style={{ position: 'absolute', bottom: 32 }}>
          {players.map((participant, index) => (
            <Image
              key={index}
              style={{ width: 32, height: 32, borderRadius: 64, marginHorizontal: -4 }}
              source={{ uri: participant.user.avatar }}
              alt={`${participant.user.username} avatar`}
              // cachePolicy="memory"
            />
          ))}
        </View>
        {participantNames && (
          <Text
            variant="caption1"
            style={[
              fontStyles.promptRegular,
              { color: colors.grey2, position: 'relative', top: -8 },
            ]}>
            {participantNames} {players.length > 1 ? 'are' : 'is'} in this room
          </Text>
        )}
      </View>

      <Link
        href={{
          pathname: `/rooms`,
          params: { roomId: roomId, roomName: roomName, topic: topic.slug },
        }}
        style={[styles.button, { backgroundColor: colors.primary }]}
        replace
        asChild>
        <Pressable>
          <Text variant="heading" className="uppercase text-text" style={[fontStyles.promptSemiBold, {textTransform: 'uppercase'}]}>
            {isThisPlayerInRoom ? 'Continue' : 'Join Room'}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const COMPONENTS: ComponentItem[] = topics.map((topic) => ({
  name: topic.slug,
  component: (props: any) => <DetailsComponent topic={props.topic} />,
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: 'white',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -60,
  },
  avatarShadow: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'transparent',
    position: 'absolute',
    shadowColor: '#2b3c50',
    shadowOffset: { width: 20, height: 24 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20, // For Android shadow
  },
  avatar: {
    width: 120,
    height: 120,
  },
  description: {
    textAlign: 'left',
    marginVertical: 80,
  },
  button: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'relative',
    // top: -4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
