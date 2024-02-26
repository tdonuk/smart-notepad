import { Text } from "react-native";
import Styles from "../../Styles";

export default function DefaultLabel(props) {
    return(
        <Text {...props} style={{color: Styles.labelColor, ...props.style}}>{props?.value}</Text>
    );
}