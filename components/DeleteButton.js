import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function DeleteButton({ text, onPress, buttonWidth }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          borderRadius: 30,
          paddingVertical: 14,
          paddingHorizontal: 20,
          backgroundColor: "#FF0000",
          alignSelf: "center",
          //   marginTop: 12,
          height: 40,
          width: buttonWidth,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.44,
          shadowRadius: 10.32,

          elevation: 16,
        }}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#7B3AF5",
    alignSelf: "center",
    marginTop: 12,
    width: 450,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
    textAlign: "center",
  },
});
