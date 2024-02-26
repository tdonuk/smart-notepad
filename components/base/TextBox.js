import { TextInput } from "react-native";
import Styles from "../../Styles";

export default function TextBox(props) {
    return (
        <TextInput {...props}
            style={{
                backgroundColor: Styles.textBoxBackground,
                padding: Styles.textBoxPadding,
                color: Styles.foreground1,
                borderWidth: Styles.textBoxBorderWidth,
                borderRadius: Styles.borderRadius2,
                borderColor: Styles.borderColor2,
                ...props.style
            }} selectionColor={Styles.selectionColor}
            placeholder={props.placeholder} placeholderTextColor={Styles.placeholderColor} onChangeText={props.onChangeText}
        />
    );
}