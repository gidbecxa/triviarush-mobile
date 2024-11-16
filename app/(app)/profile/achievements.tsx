import React, { useState } from 'react';
import { View, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { Text } from '~/components/nativewindui/Text';
import { AntDesign, Foundation, MaterialIcons } from '@expo/vector-icons';
import { fontStyles } from '~/app/_layout';
import { useNavigation } from 'expo-router';

const EmptyListMessage = ({ message, icon }) => {
  const { colors } = useColorScheme();
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
            {'Achievements'}
          </Text>
        </View>
      ),
    });
  }, []);

  return (
    <View className="flex-1 items-center justify-center border-0 border-white pb-12">
      {icon}
      <Text
        variant="subhead"
        style={[fontStyles.promptRegular, { color: colors.grey, marginTop: 16 }]}>
        {message}
      </Text>
    </View>
  );
};

const Achievements = () => {
  const { colors } = useColorScheme();
  const { width: vw } = useWindowDimensions();

  const [selectedTab, setSelectedTab] = useState('Stats');
  const slideAnim = useState(new Animated.Value(0))[0];

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
    Animated.timing(slideAnim, {
      toValue: tab === 'Stats' ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const renderContent = () => {
    if (selectedTab === 'Stats') {
      return (
        <EmptyListMessage
          icon={<AntDesign name="staro" size={64} color={colors.grey} />}
          message="Your stats will appear here"
        />
      );
    } else {
      return (
        <EmptyListMessage
          icon={<AntDesign name="Trophy" size={64} color={colors.grey} />}
          message="Your items will appear here"
        />
      );
    }
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, vw / 2],
  });

  return (
    <View className="flex-1">
      {/* Tab Selector */}
      <View
        className="flex-row justify-between border-b"
        style={{ width: vw, borderColor: colors.grey2 }}>
        <TouchableOpacity
          onPress={() => handleTabPress('Stats')}
          className="flex-1 items-center py-5">
          <Text
            variant="heading"
            style={[
              fontStyles.promptMedium,
              { color: selectedTab === 'Stats' ? colors.primary : colors.grey },
            ]}>
            Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress('My Items')}
          className="flex-1 items-center py-5">
          <Text
            variant="heading"
            style={[
              fontStyles.promptMedium,
              { color: selectedTab === 'My Items' ? colors.primary : colors.grey },
            ]}>
            My Items
          </Text>
        </TouchableOpacity>
      </View>

      {/* Animated Bottom Border */}
      <Animated.View
        style={{
          height: 4,
          backgroundColor: colors.primary,
          width: vw / 2,
          transform: [{ translateX }],
          position: 'relative',
          top: -1,
        }}
      />

      {/* Content */}
      <View className="flex-1 items-center border-0 border-white">{renderContent()}</View>
    </View>
  );
};

export default Achievements;
