import { Text, View, Pressable, Alert, ScrollView } from "react-native";
import DefaultLabel from "./base/DefaultLabel";
import Styles from "../Styles";
import TagElement from "./TagElement";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteContainer(props) {
    const note = props.note;

    return (
        <View style={{ width: 'auto', backgroundColor: Styles.background2, borderWidth: 1, borderColor: Styles.borderColor2, paddding: 40, margin: 10, borderRadius: 10 }}>
            <Pressable onPress={props.onPress}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Pressable>
                        <DefaultLabel value={note.title} style={{ fontWeight: 'bold', fontSize: 18, padding: 10 }} />
                    </Pressable>
                    <Pressable style={{ padding: 10, }} onPress={props.onDelete}>
                        <Text style={{ color: Styles.foreground2, fontWeight: '900' }}>
                            X
                        </Text>
                    </Pressable>
                </View>
                <Text style={{ color: Styles.foreground1, padding: 10 }}>{note.note}</Text>
                <View style={{ flexDirection: 'row-reverse' }}>
                    <SafeAreaView>
                        <ScrollView horizontal directionalLockEnabled={true} showsHorizontalScrollIndicator={false}>
                            {
                                note.tags?.map((tag, index) => {
                                    return (
                                        <TagElement key={index} tag={tag} />
                                    );
                                })
                            }
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Pressable>
        </View>
    );
}