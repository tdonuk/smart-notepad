import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import DefaultLabel from "./base/DefaultLabel";
import Styles from "../Styles";
import TagElement from "./TagElement";
import {SafeAreaView} from "react-native-safe-area-context";
import Highlighter from "react-native-highlight-words";
import * as Environment from "../Environment";
import DefaultImageViewer from "./base/DefaultImageViewer";

export default function NoteContainer(props) {
    const note = props.note;

    return (
        <View style={{ width: 'auto', backgroundColor: Styles.background2, borderWidth: 1, borderColor: Styles.borderColor2, padding: 5, margin: 10, borderRadius: 10 }}>
            <TouchableOpacity onPress={props.onPress}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Highlighter style={{ fontWeight: 'bold', color: Styles.labelColor, fontSize: 18, padding: 10 }}
                                 highlightStyle={{backgroundColor: 'yellow', color: 'black'}}
                                 searchWords={[props.searchWords]}
                                 textToHighlight={note.title}/>
                    <TouchableOpacity style={{ padding: 10, }} onPress={props.onDelete}>
                        <Text style={{ color: Styles.foreground2, fontWeight: '900' }}>
                            X
                        </Text>
                    </TouchableOpacity>
                </View>

                { note.noteContent &&
                    <Highlighter style={{ color: Styles.foreground1, padding: 10 }}
                                 highlightStyle={{backgroundColor: 'yellow', color: 'black'}}
                                 searchWords={[props.searchWords]}
                                 textToHighlight={note.noteContent}/>
                }

                <ScrollView horizontal={true}>
                    {
                        note.images.map((image, index) => {
                            return (
                                <DefaultImageViewer key={index} image={image}/>
                            );
                        })
                    }
                </ScrollView>

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

                <DefaultLabel style={{color: 'gray', padding: 5}} value={new Date(note.createdAt).toLocaleString(Environment.default.locale?.replace("_", "-"), {})}/>
            </TouchableOpacity>
        </View>
    );
}