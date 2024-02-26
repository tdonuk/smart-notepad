import { Pressable, Text ,} from "react-native";

export default function TagElement(props) {
    const tag = props.tag;

    const unselectedStyle = { padding: 5, backgroundColor: '#535353', color: '#e6e6e6', borderRadius: 10, margin: 5, borderWidth: 1, borderColor: 'whitesmoke' };
    const selectedStyle = { padding: 5, backgroundColor: 'whitesmoke', color: 'black', borderRadius: 10, margin: 5, borderWidth: 1, borderColor: 'gray' };

    return (
        <Pressable style={props.selected ? selectedStyle : unselectedStyle} onPress={props.press}>
            <Text style={{color: props.selected ? selectedStyle.color : unselectedStyle.color}}>{tag}{props.count && " (" + props.count + ")"}</Text>
        </Pressable>
    );
}