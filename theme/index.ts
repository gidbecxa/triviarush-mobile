import { Theme } from '@react-navigation/native';

import { COLORS } from './colors';

const COMMON_THEME: Theme = {
  dark: true,
  colors: {
    background: COLORS.common.root,
    border: COLORS.common.grey2,
    card: COLORS.common.card,
    notification: COLORS.common.destructive,
    primary: COLORS.common.primary,
    text: COLORS.white,
  },
}

const NAV_THEME: { light: Theme; dark: Theme } = {
  light: COMMON_THEME,
  dark: COMMON_THEME,
};

export { NAV_THEME };
