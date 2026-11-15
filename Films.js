import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";

export default function Films() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFilms() {
      try {
        const response = await fetch("https://www.swapi.tech/api/films");

        if (!response.ok) {
          throw new Error(`SWAPI returned status ${response.status}`);
        }

        const data = await response.json();
        setFilms(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFilms();
  }, []);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Could not load films. {error}</Text>;

  return (
    <FlatList
      data={films}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}