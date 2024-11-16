import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { useWindowDimensions } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'nativewind';
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import { Text } from '~/components/nativewindui/Text';
import { fontStyles } from '~/app/_layout';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';

const coinPacks = [
  { id: 1, amount: 50, price: '$0.99' },
  { id: 2, amount: 150, price: '$2.49' },
  { id: 3, amount: 300, price: '$4.99' },
  { id: 4, amount: 750, price: '$9.99' },
  { id: 5, amount: 2000, price: '$24.99' },
];

export default function TopUpRushCoins() {
  const { colors } = useColorScheme();
  const { width } = useWindowDimensions();
  const { promptMedium, promptRegular, promptSemiBold } = fontStyles;

  const handlePurchase = (packId: number) => {
    // Placeholder function for handling purchases
    console.log(`Purchasing pack with ID: ${packId}`);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <View
        className="w-full justify-between border-0 border-white"
        style={{
          flexDirection: 'row',
          paddingVertical: 8,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="border-0 border-white p-2 relative -left-2"
            style={{ position: 'relative', bottom: 0 }}>
            <AntDesign name="arrowleft" size={24} color={colors.foreground} />
          </TouchableOpacity>
        <Text variant="title3" style={[promptMedium, { position: 'relative', top: 1, left: -16, flex: 1, textAlign: 'center', color: colors.foreground }]}>
          Top up RushCoins
        </Text>
      </View>

      {/* <View style={styles.coinImageContainer}>
        <Image
          source={require('~/assets/graphics/gold.png')}
          style={styles.coinImage}
          contentFit="cover"
        />
      </View> */}

      <LottieView
        source={require('~/assets//lottie/Animation - 1725511698333.json')}
        autoPlay
        loop
        style={{
          width: 288,
          height: 288,
          position: 'absolute',
          top: '-5%',
          right: '14%',
          zIndex: 2,
        }}
      />

      <View style={styles.packContainer}>
        {coinPacks.map((pack) => (
          <TouchableOpacity
            key={pack.id}
            style={{
              backgroundColor: 'rgba(28, 28, 30, 0.4)',
              borderColor: colors.primary,
              borderRadius: 10,
              borderWidth: 1.25,
              width: '100%',
              marginBottom: 15,
            }}
            onPress={() => handlePurchase(pack.id)}>
            <View style={styles.packCard}>
              <View style={styles.packDetails}>
                <Text variant="title3" style={[promptSemiBold, { color: colors.foreground, fontSize: 21, letterSpacing: 0.5 }]}>
                  {pack.amount}{' '}
                </Text>
                <Text variant='title3' style={[promptMedium, { color: colors.tertiary, lineHeight: 22, letterSpacing: 0.5 }]}>{'RushCoins'}</Text>
              </View>
              <View className="flex-row gap-2 p-2" style={{ backgroundColor: "transparent" }}>
                {/* <Text variant="callout" className="uppercase text-text" style={promptSemiBold}>
                  {'buy'}
                </Text> */}
                <Text variant="heading" className="uppercase" style={[promptSemiBold, {color: colors.primary, fontSize: 18}]}>
                  {pack.price}
                </Text>
              </View>
            </View>
            {/* <Ionicons name="arrow-forward-circle" size={24} color={colors.primary} /> */}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  coinImageContainer: {
    marginBottom: 30,
    alignItems: 'center',
    position: 'absolute',
    top: '11%',
    // borderColor: '#ccc',
    // borderWidth: 1,
  },
  coinImage: {
    width: 184,
    height: 184,
  },
  packContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
    justifyContent: 'flex-end',
  },
  packCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  packDetails: {
    flexDirection: 'column',
  },
  packAmount: {
    fontSize: 18,
    fontWeight: '500',
  },
  packPrice: {
    fontSize: 16,
    marginTop: 4,
  },
});
