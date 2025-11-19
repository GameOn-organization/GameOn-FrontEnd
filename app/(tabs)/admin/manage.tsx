import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Checkbox, Chip, Searchbar } from "react-native-paper";

interface User {
    id: string;
    name: string;
    type: string;
}

// Dados de usuários
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

export default function ManageScreen() {
    const router = useRouter();
    // O array de checkeds deve ter o mesmo tamanho do array de usuários
    const [checkeds, setCheckeds] = useState<boolean[]>(
        new Array(users.length).fill(false)
    );
    const [search, setSearch] = useState("");
    const [filterExpanded, setFilterExpanded] = useState(false);
    const [organizeExpanded, setOrganizeExpanded] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [value1, setValue1] = useState("Filtrar");
    const [items1, setItems1] = useState([
        { label: "ID", value: "ID" },
        { label: "Acesso", value: "Acesso" },
        { label: "Nome", value: "Nome" },
        { label: "Recente", value: "Recente" },
        { label: "Antigo", value: "Antigo" },
        { label: "Premium", value: "Premium" },
        { label: "Todos", value: "Todos" },
    ]);

    // Função que renderiza cada item da lista
    // Nota: Em FlatList, o renderItem recebe um objeto { item, index }
    const renderUserItem = ({ item, index }: { item: User; index: number }) => (
        <View style={styles.item} key={item.id}>
            <Pressable
                style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                onPress={() => {
                    const newCheckeds = [...checkeds];
                    newCheckeds[index] = !newCheckeds[index];
                    setCheckeds(newCheckeds);
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox
                        status={checkeds[index] ? "checked" : "unchecked"}
                    />
                    <Text style={styles.selectedTextStyle}>{item.name}</Text>
                </View>
                <Chip
                    style={[
                        styles.type,
                        { backgroundColor: typeColors[item.type] || "gray" },
                    ]}
                >
                    <Text style={{ color: "white" }}>{item.type}</Text>
                </Chip>
            </Pressable>
        </View>
    );

    // Componente de Cabeçalho para a FlatList
    // Contém a Searchbar e o DropDownPicker
    const ListHeader = () => (
        <>
        <View style={{ zIndex: 5000, paddingLeft: 10 }}>
            <Searchbar
                placeholder="Pesquisar Usuário"
                onChangeText={setSearch}
                value={search}
                style={{ width: "95%", marginBottom: 15 }}
            />
            </View>
            <View style={styles.filtersContainer}>
                <DropDownPicker
                    open={open1}
                    value={value1}
                    items={items1}
                    setOpen={setOpen1}
                    setValue={setValue1}
                    setItems={setItems1}
                    placeholder="Filtrar"
                    containerStyle={{ width: "100%", zIndex: 5000 }}
                />
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                // 1. data: A fonte de dados (o array de usuários)
                data={users}
                // 2. renderItem: A função que renderiza cada item
                renderItem={renderUserItem}
                // 3. keyExtractor: Garante que cada item tenha uma chave única
                keyExtractor={(item) => item.id}
                // 4. ListHeaderComponent: Renderiza o cabeçalho (Searchbar e Filtros)
                ListHeaderComponent={ListHeader}
                // 5. contentContainerStyle: Estilos para o conteúdo da lista
                contentContainerStyle={{
                    alignItems: "center",
                    paddingTop: 40,
                    paddingBottom: 50, // Espaço para evitar que o último item fique cortado
                }}
                style={styles.scroll}
            />
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    scroll: { width: "100%" },
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
        width: "90%",
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
        zIndex: -1, // Adicione esta linha
    },
    type: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginLeft: 10,
        width: 100,
    },
    filters: {
        borderWidth: 1,
        borderRadius: 15,
    },
    filtersContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "95%",
        paddingLeft: 15,
        paddingRight: 7,
        marginRight: 7,
        paddingBottom: 15,
        paddingTop: 15,
        zIndex: 5000, // Adicione esta linha
    },
});