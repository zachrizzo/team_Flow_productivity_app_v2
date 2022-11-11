import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";

export default function ImportanceCircle(color) {
  return (
    <View
      style={{
        borderRadius: 80,
        backgroundColor: color,
        width: 20,
        height: 20,
      }}
    ></View>
  );
}
