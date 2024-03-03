import Styles from "../../Styles";
import {Text, TouchableOpacity} from "react-native";

export default function DefaultButton(props) {
    return (
        <TouchableOpacity {...props} style={{ marginTop: 20, backgroundColor: Styles.actionBackground, padding: Styles.buttonPadding, borderRadius: Styles.borderRadius1, alignItems: 'center', ...props.style }}>
            <Text style={{ color: Styles.actionForeground, textAlign: 'center', textAlignVertical: 'center', fontSize: props.style?.fontSize ?? 15}}>{props.title}</Text>
        </TouchableOpacity>
    );
}