import { useNavigation } from "@react-navigation/native";
import Styles from "../../Styles";
import { Pressable, Text } from "react-native";

export default function DefaultButton(props) {
    return (
        <Pressable {...props} style={{ marginTop: 20, backgroundColor: Styles.actionBackground, padding: Styles.buttonPadding, borderRadius: Styles.borderRadius1, alignItems: 'center', ...props.style }}>
            <Text style={{ color: Styles.actionForeground, textAlign: 'center', textAlignVertical: 'center', fontSize: props.style?.fontSize ?? 15}}>{props.title}</Text>
        </Pressable>
    );
}