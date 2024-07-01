import { useColorScheme as _useColorScheme } from "react-native";
import { COLORS } from "~/theme/colors";

export default function useColorScheme() {
    const scheme = _useColorScheme();
    const mode = scheme === 'dark' ? 'dark' : 'light';
    return {
        mode,
        colors: COLORS[mode],
    };
}