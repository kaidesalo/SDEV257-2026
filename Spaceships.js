import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";

export default function Starships() {
  const [starships, setStarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStarships() {
      try {
        const response = await fetch("https://www.swapi.tech/api/starships");

        if (!response.ok) {
          throw new Error(`SWAPI returned status ${response.status}`);
        }

        const data = await response.json();
        setStarships(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadStarships();
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Could not load starships. {error}</Text>;

  return (
    <FlatList
      data={starships}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}