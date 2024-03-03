import {Alert, Pressable, ScrollView, Text, View} from "react-native";
import Styles from "../Styles";
import AsyncStorage from "@react-native-async-storage/async-storage"
import {useEffect, useState} from "react";
import DefaultButton from "./base/DefaultButton";
import NoteContainer from "./NoteContainer";
import StringResources from "../StringResources";
import {useIsFocused} from "@react-navigation/native";
import TextBox from "./base/TextBox";
import TagElement from "./TagElement";
import {SafeAreaView} from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";

export default function HomeScreen(props) {
    const [notes, setNotes] = useState([]);
    const [filter, setFilter] = useState({ searchText: "", tags: [] });
    const [allTags, setAllTags] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            console.log("loading notes..");
            AsyncStorage.getItem("notes").then(data => {
                const parsedNotes = JSON.parse(data || "[]");

                setNotes(parsedNotes.sort((n1, n2) => {
                    if (n1.createdAt > n2.createdAt) return -1;
                    if (n1.createdAt < n2.createdAt) return 1;

                    else return 0;
                }));
            });
        }
    }, [isFocused]);

    useEffect(() => {
        const mergedTags = [...new Set(notes.flatMap(n => n.tags))].sort((former, latter) => {
            if (former < latter) {
                return -1;
            }

            if (former > latter) {
                return 1;
            }

            return 0;
        });

        setAllTags([StringResources.get("note.tags.none"), ...mergedTags]);
    }, [notes]);

    return (
        <View style={{ flex: 1, backgroundColor: Styles.background1 }}>
            <View style={{ padding: 10 }}>
                <TextBox
                    style={{ fontWeight: 'bold', margin: 5 }}
                    placeholder={StringResources.get("placeholder.search")} maxLength={20}
                    onChangeText={searchText => setFilter({ ...filter, searchText: searchText })}
                    defaultValue={filter.searchText}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <SafeAreaView>
                        <ScrollView horizontal={true} centerContent={true}>
                            {
                                allTags.map((tag, index) => {
                                    return (
                                        <TagElement key={index} tag={tag} count={tag === StringResources.get("note.tags.none") ? undefined : notes.flatMap(n => n.tags)?.filter(t => t === tag)?.length} selected={filter.tags.includes(tag)} press={() => {
                                            const tagFilter = filter.tags;

                                            if (tagFilter.includes(tag)) tagFilter.splice(tagFilter.indexOf(tag), 1);
                                            else tagFilter.push(tag);

                                            console.log("tag filter selected: " + tag + ", new filters: " + tagFilter);
                                            setFilter({ ...filter, tags: tagFilter });
                                        }} />
                                    );
                                })
                            }
                        </ScrollView>
                    </SafeAreaView>
                    {filter.tags?.length > 0 &&
                        <Pressable onPress={() => setFilter({ ...filter, tags: [] })} style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                            <Text style={{ color: 'whitesmoke', fontWeight: 'bold', textDecorationLine: 'underline' }}>{StringResources.get("label.clear")}</Text>
                        </Pressable>
                    }
                </View>
            </View>

            <ScrollView>
                {
                    notes.filter(note =>
                        ( // search by title or note
                            note.title?.toLowerCase().includes(filter.searchText.toLowerCase())
                            ||
                            note.noteContent?.toLowerCase().includes(filter.searchText.toLowerCase())
                        )
                        &&
                        ( // search by tags
                            filter.tags?.length === 0 ? true : filter.tags.some((t, idx) => {
                                if(t === StringResources.get("note.tags.none") && idx === 0) return note.tags.length === 0;
                                else return note.tags?.includes(t);
                            })
                        )
                    ).map((note, index) => {
                        return (
                            <NoteContainer note={note} searchWords={filter?.searchText} key={index} onDelete={() => {
                                Alert.alert(StringResources.get('title.confirmation'), StringResources.get('dialog.note.delete'),
                                    [
                                        {
                                            text: StringResources.get("title.cancel"),
                                            onPress: () => console.log("note delete cancelled"),
                                            style: "cancel"
                                        },
                                        {
                                            text: StringResources.get("title.confirm"), onPress: () => {
                                                console.log("note is deleting..");
                                                const updatedNotes = notes.filter((_, idx) => idx !== index);

                                                const deletePromises = [];

                                                //  delete assets of note
                                                note.images.forEach(image => {
                                                    console.log("deleting asset: " + image);
                                                    deletePromises.push(FileSystem.deleteAsync(image).catch(err => console.log("error on deleting note asset. ("+err+")")));
                                                });

                                                Promise.all(deletePromises).then(() => {
                                                    AsyncStorage.setItem("notes", JSON.stringify(updatedNotes)).then(() => {
                                                        setNotes(updatedNotes);
                                                    });
                                                })
                                            }
                                        }
                                    ]
                                );
                            }
                            } onPress={() => props.navigation.navigate('CreateNote', { note: note })} />
                        );
                    })
                }
            </ScrollView>
            <DefaultButton onPress={() => props.navigation.navigate('CreateNote')} title={"+"} style={{ position: 'absolute', bottom: 20, right: 20, width: 50, height: 50, borderRadius: 25, fontSize: 30, fontWeight: 'bold', padding: 0, justifyContent: 'center' }} />
        </View>
    );
}