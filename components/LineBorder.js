import { StyleSheet, Text, View } from "react-native";
import React from "react";

export function LineBorder({ width, color }) {
  return (
    <View
      style={{
        height: 10,
        backgroundColor: color,
        width: width,
        borderRadius: 50,
      }}
    />
  );
}

export default LineBorder;
