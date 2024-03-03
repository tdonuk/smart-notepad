import {useEffect, useState} from "react";
import {Image, Modal, Pressable, ScrollView, ToastAndroid, View} from "react-native";
import TextBox from "./base/TextBox";
import Styles from "../Styles";
import DefaultButton from "./base/DefaultButton";
import DefaultLabel from "./base/DefaultLabel";
import AsyncStorage from '@react-native-async-storage/async-storage';
import StringResources from "../StringResources";
import TagElement from "./TagElement";
import {SafeAreaView} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

export default function CreateNewNoteScreen(props) {
    const noteToEdit = props?.route?.params?.note;


    const title = noteToEdit?.title ?? '';
    const tags = noteToEdit?.tags ?? [];
    const noteContent = noteToEdit?.noteContent ?? '';
    const images = noteToEdit?.images ?? [];
    const createdAt = noteToEdit?.createdAt ?? new Date();
    const updatedAt = noteToEdit?.updatedAt ?? new Date();

    const noteToCreate = {
        id: noteToEdit?.id ?? `${createdAt.getFullYear()}${createdAt.getMonth()}${createdAt.getDay()}${createdAt.getHours()}${createdAt.getMinutes()}${createdAt.getSeconds()}`,
        title: title,
        tags: tags,
        noteContent: noteContent,
        images: images,
        createdAt: createdAt,
        updatedAt: updatedAt
    }

    const [note, setNote] = useState(noteToCreate);

    const [tagsInput, setTagsInput] = useState("");
    const [showAddTagDialog, setShowAddTagDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    useEffect(() => { // update page title if editing instead of creating
        if (noteToEdit) props.navigation.setOptions({headerTitle: StringResources.get("title.edit")});

        requestPermission().then(r => {
            if (r.status !== "granted") {
                ToastAndroid.show(StringResources.get("error.note.permissionRequired"), ToastAndroid.LONG);
            } else {
                console.log("media permissions granted");
            }
        });
    }, []);


    return (
        <View style={{padding: 20, backgroundColor: Styles.background1, flex: 1}}>
            <DefaultLabel value={StringResources.get("note.title")}/>
            <TextBox
                maxLength={40}
                style={{height: 40, fontWeight: 'bold'}}
                placeholder={StringResources.get("note.title")} onChangeText={newTitle => note.title = newTitle}
                defaultValue={note.title}
            />

            <DefaultLabel value={StringResources.get("note.tags")} style={{marginTop: 10}}/>

            <Modal transparent={true} animationType="fade" visible={showAddTagDialog} onRequestClose={() => setShowAddTagDialog(false)}>
                <View style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    padding: 20,
                    backgroundColor: '#242424c0'
                }}>
                    <DefaultLabel value={StringResources.get("label.addTag")}/>
                    <TextBox style={{
                        height: 40,
                        fontWeight: 'bold'
                    }} autoFocus={true} maxLength={20} defaultValue={tagsInput} placeholder={StringResources.get("placeholder.note.tags")} onChangeText={(newTagsInput) => setTagsInput(newTagsInput)}/>

                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <DefaultButton title={StringResources.get("label.add")} onPress={() => {
                            if (tagsInput.trim().length === 0) {
                                ToastAndroid.show(StringResources.get("error.note.invalidTag"), ToastAndroid.LONG);
                                return;
                            }

                            const newTags = [...note.tags];
                            newTags.push(tagsInput);

                            console.log("---------------- tags: " + newTags);

                            note.tags = [...new Set(newTags)];
                            setShowAddTagDialog(false);
                            setTagsInput("");
                        }}/>

                        <DefaultButton title={StringResources.get("title.cancel")} style={{
                            marginLeft: 10,
                            backgroundColor: '#f86262'
                        }} onPress={() => {
                            setShowAddTagDialog(false);
                            setTagsInput("");
                        }}/>
                    </View>
                </View>
            </Modal>

            <SafeAreaView style={{flexDirection: 'row', alignItems: 'center'}}>
                <ScrollView horizontal={true}>
                    {
                        note.tags?.map((tag, index) => {
                            return (tag &&
                                <TagElement tag={tag} key={index} press={() => {
                                    const newTags = [...note.tags];
                                    newTags.splice(newTags.indexOf(tag), 1);
                                    setNote({...note, tags: newTags});
                                }}/>
                            );
                        })
                    }
                </ScrollView>

                <DefaultButton title={"+ " + StringResources.get("label.add")} style={{
                    padding: 10,
                    marginLeft: 10,
                    marginTop: 0,
                    backgroundColor: Styles.background2
                }} onPress={() => {
                    setShowAddTagDialog(true);
                }}/>
            </SafeAreaView>

            <DefaultLabel value={StringResources.get("note.images")} style={{marginTop: 10}}/>
            <SafeAreaView style={{flexDirection: 'row', alignItems: 'center'}}>
                <ScrollView horizontal={true}>
                    {
                        note.images.map((image, index) => {
                            console.log("fetching asset: " + image);

                            return (
                                <Pressable key={index} onLongPress={() => {
                                    const currentImages = [...note.images];
                                    currentImages.splice(index, 1);

                                    setNote({...note, images: currentImages});
                                }}>
                                    <Image style={{margin: 5, width: 100, height: 100}} source={{
                                        uri: image
                                    }} resizeMode={"contain"}/>
                                </Pressable>
                            );
                        })
                    }
                </ScrollView>

                <DefaultButton disabled={loading} title={"+ " + StringResources.get("label.add")} style={{
                    padding: 10,
                    marginLeft: 10,
                    marginTop: 0,
                    backgroundColor: Styles.background2
                }} onPress={() => {
                    if(note.images.length > 4) {
                        ToastAndroid.show(StringResources.get("error.note.imageCountExceeded"), ToastAndroid.LONG);
                        return;
                    }

                    ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        base64: true
                    }).then(response => {
                        if (response.canceled) return;

                        const image = response.assets[0];

                        console.log("image adding: " + image.uri + " (" + image.mimeType + ")");

                        setNote({...note, images: [...note.images, image.uri]});
                    });
                }}/>
            </SafeAreaView>

            <TextBox
                style={{marginTop: 20, fontWeight: 'bold', textAlignVertical: 'top', maxHeight: 200}}
                placeholder={StringResources.get('placeholder.note.note')} multiline={true} numberOfLines={8} maxLength={2000}
                onChangeText={newNote => note.noteContent = newNote}
                defaultValue={note.noteContent}
            />

            <DefaultButton disabled={loading} style={{marginTop: 20}} title={noteToEdit ? StringResources.get("note.edit") : StringResources.get("note.create")} onPress={() => {
                setLoading(true);

                if ((note.title ?? '').length === 0) {
                    ToastAndroid.show(StringResources.get("error.note.titleEmpty"), ToastAndroid.LONG);
                    setLoading(false);
                    return;
                }

                if ((note.noteContent ?? '').length === 0 && (note.images.length === 0)) {
                    ToastAndroid.show(StringResources.get("error.note.noteEmpty"), ToastAndroid.LONG);
                    setLoading(false);
                    return;
                }

                console.log("note creating: ");
                console.log(note);

                AsyncStorage.getItem("notes").then(data => {
                    const notes = JSON.parse(data ?? "[]");

                    if (noteToEdit) {
                        const indexToDelete = notes.map(n => n.id).indexOf(noteToEdit.id);
                        notes.splice(indexToDelete, 1);
                    }

                    // persist cached images
                    const cachedImages = [...note.images];
                    note.images = [];
                    const copyPromises = [];

                    for (let image of cachedImages) {
                        const pathToPersist = FileSystem.documentDirectory + note.id + "/assets/" + image.substring(image.lastIndexOf('/') + 1);

                        console.log("persisting cached image: " + image + " -> " + pathToPersist);

                        const copyPromise = new Promise(async (resolve, reject) => {
                            if(image !== pathToPersist) await FileSystem.copyAsync({from: image, to: pathToPersist});

                            note.images.push(pathToPersist);
                            console.log("persisted image: " + pathToPersist);

                            resolve(pathToPersist);
                        });

                        copyPromises.push(copyPromise);
                    }

                    Promise.all(copyPromises).then((results) => {
                        console.log(results);

                        notes.push(note);

                        AsyncStorage.setItem("notes", JSON.stringify(notes)).then(() => {
                            ToastAndroid.show(StringResources.get("dialog.note.saveSuccess"), ToastAndroid.LONG);

                            props.navigation.navigate('Home');
                        }).catch(err => ToastAndroid.show("Error. (" + err + ")", ToastAndroid.LONG))
                    })

                })
                    .catch(err => ToastAndroid.show("Error. (" + err + ")", ToastAndroid.LONG))
                    .finally(() => setLoading(false));
            }}/>
        </View>
    );
}