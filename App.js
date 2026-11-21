import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Button,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Planets from "./Planets";
import Spaceships from "./Spaceships";
import Films from "./Films";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function SearchableScreen({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState(null);

  function submitSearch() {
    if (!searchTerm.trim()) return;

    Keyboard.dismiss();
    setSubmittedTerm(searchTerm);
  }

  function closeModal() {
    setSubmittedTerm(null);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          accessibilityLabel="Search term"
          placeholder="Enter a search term"
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          onSubmitEditing={submitSearch}
        />
        <Button
          title="Search"
          onPress={submitSearch}
          disabled={!searchTerm.trim()}
        />
      </View>

      <View style={styles.content}>{children}</View>

      <Modal
        visible={submittedTerm !== null}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>You searched for</Text>
            <Text style={styles.dialogText}>{submittedTerm}</Text>
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function withSearch(Screen) {
  return function ScreenWithSearch(props) {
    return (
      <SearchableScreen>
        <Screen {...props} />
      </SearchableScreen>
    );
  };
}

const PlanetsScreen = withSearch(Planets);
const SpaceshipsScreen = withSearch(Spaceships);
const FilmsScreen = withSearch(Films);

export default function App() {
  const Navigator = Platform.OS === "android" ? Drawer : Tab;

  return (
    <NavigationContainer>
      <Navigator.Navigator>
        <Navigator.Screen name="Planets" component={PlanetsScreen} />
        <Navigator.Screen name="Spaceships" component={SpaceshipsScreen} />
        <Navigator.Screen name="Films" component={FilmsScreen} />
      </Navigator.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  input: {
    flex: 1,
    minHeight: 44,
    marginRight: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#767676",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#111",
  },
  content: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  dialogTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  dialogText: {
    marginBottom: 16,
    fontSize: 16,
    color: "#111",
  },
});