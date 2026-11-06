import { Platform, StyleSheet, StatusBar } from "react-native";

export default StyleSheet.create({

    // styles for Container.js component
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "ghostwhite",
        alignItems: "center",
        justifyContent: "space-around",
        ...Platform.select({
            ios: { paddingTop: 40 },
            android: { paddingTop: StatusBar.currentHeight },
        }),
    },

    // styles for Box.js component
    box: {
        height: 100,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "darkslategray",
        backgroundColor: "lightgray",
    },

    // styles for text inside Box.js
    boxText: {
        color: "darkslategray",
        fontWeight: "bold",
    },

    // styles for Row.js
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignSelf: "stretch",
    },

    // styles for Column.js
    column: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        alignSelf: "stretch",
    },
});