import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function TimeTrackingScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Message",

      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            {/* <Avatar rounded source = {{uri: auth?.currentUser.photoURL}}/> */}
            <FontAwesome name="bars" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("User Options Screen")}
          >
            {/* <Avatar rounded source = {{uri: auth?.currentUser.photoURL}}/> */}
            <Octicons name="person" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);
  return (
    <View>
      <Text>timeTrackingScreen</Text>
    </View>
  );
}
