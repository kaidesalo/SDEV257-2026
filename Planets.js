import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";

export default function Planets() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlanets() {
      try {
        const response = await fetch("https://swapi.dev/api/planets/");

        if (!response.ok) {
          throw new Error(`SWAPI returned status ${response.status}`);
        }

        const data = await response.json();
        setPlanets(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPlanets();
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Could not load planets. {error}</Text>;

  return (
    <FlatList
      data={planets}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}