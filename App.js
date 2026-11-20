import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const PRIMARY_SERVER = "https://overpass.private.coffee/api/interpreter";
const FALLBACK_SERVER = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS_KM = 2;

const GAS_HOUSE = {
  name: "The Gas House",
  coordinate: {
    latitude: 41.083176,
    longitude: -85.136570,
  },
};

function distanceKm(from, to) {
  const northKm = (to.latitude - from.latitude) * 111.32;
  const eastKm =
    (to.longitude - from.longitude) *
    111.32 *
    Math.cos((from.latitude * Math.PI) / 180);

  return Math.hypot(northKm, eastKm);
}

async function fetchRestaurants(endpoint, query) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `${endpoint}?data=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      throw new Error(`Restaurant server returned HTTP ${response.status}.`);
    }

    const data = await response.json();

    if (!Array.isArray(data.elements) || data.remark) {
      throw new Error("Restaurant server returned incomplete results.");
    }

    return data.elements;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Restaurant server timed out.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function findNearbyRestaurant(location) {
  const { latitude, longitude } = location;
  const radiusMeters = SEARCH_RADIUS_KM * 1000;
  const query = `
    [out:json][timeout:15];
    nwr["amenity"="restaurant"](around:${radiusMeters},${latitude},${longitude});
    out center;
  `;

  let elements;

  try {
    elements = await fetchRestaurants(PRIMARY_SERVER, query);
  } catch {
    elements = await fetchRestaurants(FALLBACK_SERVER, query);
  }

  let closest = null;
  let closestDistance = Infinity;

  for (const place of elements) {
    const point = place.center ?? place;

    if (!Number.isFinite(point.lat) || !Number.isFinite(point.lon)) {
      continue;
    }

    const coordinate = {
      latitude: point.lat,
      longitude: point.lon,
    };
    const distance = distanceKm(location, coordinate);

    if (distance < closestDistance) {
      closestDistance = distance;
      closest = {
        name: place.tags?.name || "Nearby restaurant",
        coordinate,
      };
    }
  }

  return closest;
}

export default function App() {
  const [location, setLocation] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [message, setMessage] = useState("Getting your location…");

  useEffect(() => {
    async function loadMap() {
      let coords;

      try {
        const { granted } =
          await Location.requestForegroundPermissionsAsync();

        if (!granted) {
          setMessage("Allow location access to see nearby restaurants.");
          return;
        }

        const position = await Location.getCurrentPositionAsync({});
        coords = position.coords;
        setLocation(coords);
      } catch {
        setMessage("Could not get your location. Check Location Services.");
        return;
      }

      setMessage("Looking for a nearby restaurant…");

      try {
        const nearbyRestaurant = await findNearbyRestaurant(coords);
        setRestaurant(nearbyRestaurant);
        setMessage(
          nearbyRestaurant?.name ??
            `No restaurants found within ${SEARCH_RADIUS_KM} km.`
        );
      } catch (error) {
        if (distanceKm(coords, GAS_HOUSE.coordinate) <= SEARCH_RADIUS_KM) {
          setRestaurant(GAS_HOUSE);
          setMessage("The Gas House · Saved nearby restaurant");
          return;
        }

        const reason = error instanceof Error ? error.message : "Unknown error.";
        setMessage(`Could not load nearby restaurants. ${reason}`);
      }
    }

    loadMap();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={StyleSheet.absoluteFill}
          showsUserLocation
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.06,
            longitudeDelta: 0.08,
          }}
        >
          {restaurant && (
            <Marker
              coordinate={restaurant.coordinate}
              title={restaurant.name}
              pinColor="orange"
            />
          )}
        </MapView>
      )}

      <View style={styles.label}>
        <Text style={styles.labelText}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  label: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 48,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "white",
  },
  labelText: {
    textAlign: "center",
    fontWeight: "600",
  },
});
