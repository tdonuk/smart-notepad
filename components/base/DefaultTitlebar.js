import { Text, View } from "react-native";
import Styles from "../../Styles";

export default function DefaultTitlebar(props) {
    return (
        <View style={{ backgroundColor: Styles.background1, alignItems: 'center' }}>
            <Text {...props} style={{ color: Styles.foreground2, fontSize: Styles.headerFontSize, ...props.style }}>
                {props.title}
            </Text>
        </View>
    );
}