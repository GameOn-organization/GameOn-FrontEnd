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
import FaqButton from '../../../components/FaqButton'


export default function FaqsScreen() {

    const router = useRouter()

    return (
        <SafeAreaView
            style={styles.container}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
            >
                <FaqButton
                    // id={}
                    // pfp={source}
                    // name={}
                    onPress={() => console.log('Detalhes da FAQ')}
                />
                <FaqButton onPress={() => console.log('Detalhes da FAQ')} />
                <FaqButton onPress={() => console.log('Detalhes da FAQ')} />
                <FaqButton onPress={() => console.log('Detalhes da FAQ')} />
                <FaqButton onPress={() => console.log('Detalhes da FAQ')} />
                <FaqButton onPress={() => console.log('Detalhes da FAQ')} />
                <FaqButton onPress={() => console.log('Detalhes da FAQ')} />
                <FaqButton onPress={() => console.log('Detalhes da FAQ')} />
                <FaqButton onPress={() => console.log('Detalhes da FAQ')} />
                <FaqButton onPress={() => console.log('Detalhes da FAQ')} />
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