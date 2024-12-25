import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search destinations..."
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#f9f9f9",
  },
});

export default SearchBar;
