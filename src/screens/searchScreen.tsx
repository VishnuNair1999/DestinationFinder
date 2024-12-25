import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Touchable,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import destinationsData from "../data/destination.json";

interface Destination {
  id: number;
  name: string;
  country: string;
  population: number;
}

const SearchScreen = () => {
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<"population" | "name">("name");
  const itemsPerPage = 15;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const cachedData = await AsyncStorage.getItem("destinations");
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setAllDestinations(parsedData);
        } else if (isOnline) {
          await AsyncStorage.setItem(
            "destinations",
            JSON.stringify(destinationsData)
          );
          setAllDestinations(destinationsData);
        } else {
          Alert.alert(
            "Offline Mode",
            "No cached data available. Please connect to the internet."
          );
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, [isOnline]);

  const sortedDestinations = useMemo(() => {
    return [...allDestinations].sort((a, b) => {
      if (sortOption === "population") {
        return b?.population - a?.population;
      }
      return a?.name?.localeCompare(b?.name);
    });
  }, [allDestinations, sortOption]);

  const filteredDestinations = useMemo(() => {
    return sortedDestinations.filter((place) =>
      place?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  }, [searchQuery, sortedDestinations]);

  const paginatedDestinations = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    return filteredDestinations.slice(startIndex, endIndex);
  }, [filteredDestinations, currentPage]);

  const loadMoreData = () => {
    if (currentPage * itemsPerPage < filteredDestinations.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const renderDestination = useCallback(({ item }: { item: Destination }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>
          {item.country} - Population: {item.population}
        </Text>
      </View>
    );
  }, []);

  const keyExtractor = useCallback(
    (item: Destination) => item?.id?.toString(),
    []
  );

  return (
    <View style={styles.container}>
      {!isOnline && (
        <Text style={styles.offlineBanner}>
          You are offline. Some features may not work.
        </Text>
      )}
      <View style={styles.container1}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-back"
              size={24}
              color="#000"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.searchBar}
            placeholder="Search destinations..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setCurrentPage(1);
            }}
          />
        </View>
      </View>

      <View style={styles.sortOptions}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOption === "name" && styles.activeSortButton,
          ]}
          onPress={() => setSortOption("name")}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOption === "name" && styles.activeSortButtonText,
            ]}
          >
            Sort by Name
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOption === "population" && styles.activeSortButton,
          ]}
          onPress={() => setSortOption("population")}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOption === "population" && styles.activeSortButtonText,
            ]}
          >
            Sort by Population
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={paginatedDestinations}
        keyExtractor={keyExtractor}
        renderItem={renderDestination}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        estimatedItemSize={6000}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            No destinations found. Try a different search.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, marginTop: 60 },
  offlineBanner: {
    backgroundColor: "#ffcccb",
    padding: 10,
    textAlign: "center",
    color: "#d9534f",
    fontWeight: "bold",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },

  sortOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sortButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeSortButton: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  sortButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  activeSortButtonText: {
    color: "#fff", // White color for active button
  },
  container1: {
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    height: 40,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});

export default SearchScreen;
