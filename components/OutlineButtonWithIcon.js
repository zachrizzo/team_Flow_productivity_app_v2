import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function OutlineButtonWithIcon({
  buttonValue,
  onPress,
  text,
  Icon,
}) {
  var buttonBackgroundColor = null;
  var borderColor = "#8D8A8A";
  var textColor = "#000000";
  if (buttonValue) {
    buttonBackgroundColor = "#7B3AF5";
  }
  if (buttonValue) {
    borderColor = "#7B3AF5";
  }
  if (buttonValue) {
    textColor = "#FFFFFF";
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: buttonBackgroundColor,
        borderColor: borderColor,
        borderWidth: 2,
        width: 180,
        justifyContent: "center",

        flexDirection: "row",
        padding: 10,
        borderRadius: 20,
      }}
    >
      {Icon}
      <Text style={{ marginLeft: 15, fontSize: 18, color: textColor }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}
