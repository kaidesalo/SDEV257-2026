import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi, my name is Kaide, and I am a mobile developer.</Text>
      <Text style={styles.text}>~~~</Text>
      <Text style={styles.text}>This assignment has outdated</Text>
      <Text style={styles.text}>instructions on downloading expo which causes</Text>
      <Text style={styles.text}>delays on submitting the assignment.</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});
