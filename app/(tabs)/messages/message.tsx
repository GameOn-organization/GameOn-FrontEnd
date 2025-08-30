import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    ScrollView,
    Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import ChatButton from '../../../components/ChatButton'


export default function Message() {

    const router = useRouter()

    return (
        <SafeAreaView
            style={styles.container}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
            >
                <ChatButton
                    // idProfile={}
                    // pfp={source}
                    // name={}
                    // idChat={}
                    // lastMsg={}
                    // time={}
                    onPress={() =>router.navigate('/messages/chat')}
                />
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
                <ChatButton onPress={() =>router.navigate('/messages/chat')}/>
            </ScrollView>
        </SafeAreaView>
    )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: { width: '100%' },
})