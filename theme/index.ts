import { Theme } from '@react-navigation/native';

import { COLORS } from './colors';

const NAV_THEME: { light: Theme; dark: Theme } = {
  light: {
    dark: false,
    colors: {
      background: COLORS.common.root,
      border: COLORS.common.grey2,
      card: COLORS.common.card,
      notification: COLORS.common.destructive,
      primary: COLORS.common.primary,
      text: COLORS.white,
    },
  },
  dark: {
    dark: true,
    colors: {
      background: COLORS.common.background,
      border: COLORS.common.grey2,
      card: COLORS.common.grey6,
      notification: COLORS.common.destructive,
      primary: COLORS.common.primary,
      text: COLORS.white,
    },
  },
};

export { NAV_THEME };
