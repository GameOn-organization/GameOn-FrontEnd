import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    ScrollView,
    Dimensions,
    Pressable,
} from 'react-native'
import {
    Checkbox,
    Chip,
    Searchbar,
    List,
} from 'react-native-paper'
import { useRouter } from 'expo-router'

interface User {
    id: string;
    name: string;
    type: string;
}

export default function ManageScreen() {

    const router = useRouter()
    // Fix: Use array of booleans for checkeds, one per user
    const [checkeds, setCheckeds] = useState<boolean[]>([false, false, false, false])
    const [search, setSearch] = useState('')
    const [filterExpanded, setFilterExpanded] = useState(false)
    const [organizeExpanded, setOrganizeExpanded] = useState(false)

    const users: User[] = [
        {
            id: "1",
            name: "Vitor",
            type: "Player",
        },
        {
            id: "2",
            name: "Álvaro",
            type: "Partner",
        },
        {
            id: "3",
            name: "Arthur",
            type: "Admin",
        },
        {
            id: "4",
            name: "Andressa",
            type: "Support",
        },
    ];

    const typeColors: { [key: string]: string } = {
        Player: "green",
        Partner: "purple",
        Admin: "red",
        Support: "blue",
    };

    // Fix: Pass index to handle checkeds array
    const renderUser = (item: User, index: number) => (
        <View style={styles.item} key={item.id}>
            <Pressable
                style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}
                onPress={() => {
                    const newCheckeds = [...checkeds];
                    newCheckeds[index] = !newCheckeds[index];
                    setCheckeds(newCheckeds);
                }}
            >
                <View
                    style={{flexDirection: 'row', alignItems: 'center'}}
                >
                    <Checkbox
                        status={checkeds[index] ? 'checked' : 'unchecked'}
                    />
                    <Text style={styles.selectedTextStyle}>{item.name}</Text>
                </View>
                <Chip
                    style={[
                        styles.type,
                        { backgroundColor: typeColors[item.type] || "gray" }
                    ]}
                >
                    <Text style={{color: "white"}}>{item.type}</Text>
                </Chip>
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40 }}
            >
                <Searchbar
                    placeholder="Pesquisar Usuário"
                    onChangeText={setSearch}
                    value={search}
                />
                <View
                    style={{flexDirection: 'row'}}
                >
                    <List.Accordion
                        title="Filtrar"
                        style={styles.filters}
                        left={props => <List.Icon {...props} icon="filter-variant" />}
                        expanded={filterExpanded}
                        onPress={() => {
                            setFilterExpanded(!filterExpanded)
                        }}>
                        <List.Item
                            title="ID"
                            left={props => <List.Icon {...props} icon="identifier" />}
                        />
                        <List.Item
                            title="Acesso"
                            left={props => <List.Icon {...props} icon="account-wrench" />}
                        />
                        <List.Item
                            title="Nome"
                            left={props => <List.Icon {...props} icon="badge-account-outline" />}
                        />
                        <List.Item
                            title="Recente"
                            left={props => <List.Icon {...props} icon="clock-plus-outline" />}
                        />
                        <List.Item
                            title="Antigo"
                            left={props => <List.Icon {...props} icon="clock-minus-outline" />}
                        />
                        <List.Item
                            title="Premium"
                            left={props => <List.Icon {...props} icon="lightning-bolt-outline" />}
                        />
                    </List.Accordion>

                    <List.Accordion
                        title="Organizar"
                        style={styles.filters}
                        left={props => <List.Icon {...props} icon="file-tree" />}
                        expanded={organizeExpanded}
                        onPress={() => {
                            setOrganizeExpanded(!organizeExpanded)
                        }}>
                        <List.Item
                            title="ID"
                            left={props => <List.Icon {...props} icon="identifier" />}
                        />
                        <List.Item
                            title="Acesso"
                            left={props => <List.Icon {...props} icon="account-wrench" />}
                        />
                        <List.Item
                            title="Nome"
                            left={props => <List.Icon {...props} icon="badge-account-outline" />}
                        />
                        <List.Item
                            title="Recente"
                            left={props => <List.Icon {...props} icon="clock-plus-outline" />}
                        />
                        <List.Item
                            title="Antigo"
                            left={props => <List.Icon {...props} icon="clock-minus-outline" />}
                        />
                        <List.Item
                            title="Premium"
                            left={props => <List.Icon {...props} icon="lightning-bolt-outline" />}
                        />
                    </List.Accordion>
                </View>
                {/* Render users below the title */}
                {users.map((user, idx) => renderUser(user, idx))}
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
    selectedTextStyle: {
        fontSize: 14,
        color: "#333",
        marginRight: 10,
    },
    item: {
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        width: '90%',
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
    },
    type: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginLeft: 10,
        width: 100,
    },
    filters: {
        borderWidth: 1,
        borderRadius: 15,
    }
})