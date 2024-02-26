import { NativeModules } from "react-native";

export default {
    locale: NativeModules.I18nManager.localeIdentifier
};