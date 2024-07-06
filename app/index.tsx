import * as React from 'react';
import { View, } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { useAppContext } from '~/store/AppContext';

export default function Screen() {
    const { isFirstLaunch } = useAppContext();
    return isFirstLaunch
        ?
        <Redirect href="/onboarding-one" />
        :
        <Redirect href="/home" />;
}