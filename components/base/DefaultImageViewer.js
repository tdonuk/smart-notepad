import {Image, Modal, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
import Animated, {useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import styles from "../../Styles";

export default function DefaultImageViewer(props) {
    const[modalViewerVisible, setModalViewerVisible] = useState(false);

    const [ratio, setRatio] = useState(1);
    useEffect(() => {
        if (props.image) {
            Image.getSize(props.image, (width, height) => {
                setRatio(width / height);
            });
        }
    }, [props.image]);

    const modalImageScale = useSharedValue(1);
    const savedImageScale = useSharedValue(1);

    const pinchHandler = Gesture.Pinch()
        .onUpdate((e) => {
            if(modalImageScale.value > 4 && e.scale > 1) return;
            if(modalImageScale.value < 0.5 && e.scale < 1) return;

            modalImageScale.value = savedImageScale.value * e.scale;
        })
        .onEnd((e) => {
            savedImageScale.value = modalImageScale.value;
        });

    const positionX = useSharedValue(0);
    const positionY = useSharedValue(0);
    const positionXOffset = useSharedValue(0);
    const positionYOffset = useSharedValue(0);

    const panHandler = Gesture.Pan()
        .onStart(() => {
            // Store the initial position when the pan gesture starts
            positionXOffset.value = positionX.value;
            positionYOffset.value = positionY.value;
        })
        .onUpdate((e) => {
            const x = e.translationX + positionXOffset.value;
            const y = e.translationY + positionYOffset.value;

            positionX.value = x;
            positionY.value = y;
        });

    const gestures = Gesture.Simultaneous(pinchHandler, panHandler);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: modalImageScale.value }
        ],
        left: positionX.value,
        top: positionY.value
    }));

    const dismissModal = () => {
        setModalViewerVisible(false);
        savedImageScale.value = 1;
        modalImageScale.value = 1;
        positionX.value = 0;
        positionY.value = 0;
    }

    return(
        <View>
            <TouchableOpacity style={{ width: 100, height: 100, margin: 5, ...props.style }} onPress={() => setModalViewerVisible(true)} {...props}>
                <Image source={{ uri: props.image }} style={{ width: '100%', height: '100%' }}/>
            </TouchableOpacity>

            { modalViewerVisible &&
                <Modal transparent={true} animationType="fade" visible={modalViewerVisible} onRequestClose={dismissModal}>
                    <TouchableOpacity style={{ alignSelf: 'flex-end', margin: 10, padding: 5, zIndex: 1000 }} onPress={dismissModal}>
                        <Text style={{ fontSize: 24, color: 'white' }}>X</Text>
                    </TouchableOpacity>

                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        padding: 20,
                        backgroundColor: '#242424c0'
                    }}>
                        <GestureHandlerRootView style={{flex: 1, justifyContent: 'center'}}>
                            <GestureDetector gesture={gestures}>
                                <View style={{justifyContent: 'center', display: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
                                    <Animated.Image source={{ uri: props.image }} style={[{ width: '100%', height: undefined, aspectRatio: ratio, borderWidth: 1, borderColor: styles.borderColor2, borderRadius: Styles.borderRadius2 }, animatedStyle]} resizeMode={'contain'}/>
                                </View>
                            </GestureDetector>
                        </GestureHandlerRootView>
                    </View>
                </Modal>
            }
        </View>
    );
}