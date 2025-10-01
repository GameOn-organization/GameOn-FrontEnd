import { IconButton } from "react-native-paper";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    Modal,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Pressable
} from "react-native";

interface User {
    id: number;
    name: string;
    image: any;
}

interface PostProps {
    id: string;
    user: User;
    images?: any[];
    likes: number;
    comments?: PostProps[];
}

export default function Post({id, user, likes, comments}: PostProps) {

    const [postTransparent, setPostTransparent] = useState(false);
    const [postVisible, setPostVisible] = useState(false);

    const [liked, setLiked] = useState(false);

    return (
        <>
            {/* Formulário de Publicar Post*/}
            <Modal
                backdropColor='rgba(0,0,0,0.5)'
                animationType="fade"
                transparent={postTransparent}
                visible={postVisible}
                onRequestClose={() => {
                    setPostVisible(!postVisible),
                    setPostTransparent(!postTransparent);
                }}
            >
                <Pressable
                    style={{flex: 0.1, height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                    onPress={() => {
                        setPostVisible(!postVisible),
                        setPostTransparent(!postTransparent);
                    }}
                />
                <Post
                    // id={this}
                />
            </Modal>
            <SafeAreaView style={styles.container}>
                <SafeAreaView style={styles.postContainer}>
                    <SafeAreaView style={styles.userContainer}>
                        {/* <Image
                                source={user.image}
                                style={styles.image}
                            /> */}
                        {/* <Text>{user.name}</Text> */}
                        <Image
                            source={require("../assets/images/icon.jpeg")}
                            style={styles.image}
                        />
                        <Text>Usuário</Text>
                    </SafeAreaView>
                    <SafeAreaView style={styles.content}>
                        <SafeAreaView>
                            <TextInput
                                style={styles.input}
                                multiline
                                placeholder="O que você está pensando?"
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.iconContainer}>
                            {/* If posted */}
                                <IconButton
                                    icon={liked ? "cards-heart" : "cards-heart-outline"}
                                    size={24}
                                    iconColor="red"
                                    onPress={() => setLiked(!liked)}
                                />
                                <IconButton
                                    icon="comment-outline"
                                    size={24}
                                    iconColor="green"
                                    onPress={() => {
                                        setPostVisible(true),
                                        setPostTransparent(false);
                                    }}
                                />
                            {/* else */}
                                {/* if is posting */}
                                <IconButton
                                    icon="attachment"
                                    style={{transform: [{ rotate: '-45deg' }]}}
                                    size={24}
                                    iconColor="black"
                                    onPress={() => console.log("Upload Image")}
                                />
                                {/* endif */}
                            {/* endif */}
                            <TouchableOpacity
                                onPress={() => console.log("Send Pressed")}
                                style={styles.buttonSend}
                            >
                                <Text>Postar</Text>
                                <IconButton
                                    icon="send"
                                    size={24}
                                    iconColor="purple"
                                />
                            </TouchableOpacity>
                        </SafeAreaView>
                    </SafeAreaView>
                </SafeAreaView>
            </SafeAreaView>
        </>
    );
}

const {width, height} = Dimensions.get("window")

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "50%",
        marginLeft: width * 0.025,
        maxHeight: height * 0.3,
        maxWidth: width * 0.95,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
        gap: 20,
    },
    postContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        width: width * 0.8,
        height: 100,
        borderRadius: 10,
    },
    buttonSend: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        borderRadius: 25,
        paddingLeft: 15,
    },
});
