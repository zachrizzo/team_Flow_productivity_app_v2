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
import React from "react";
import { useLayoutEffect, useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import { useDrawerStatus } from "@react-navigation/drawer";
// import ImportanceCircle from "../components/ImportanceCircle";
import { AntDesign } from "@expo/vector-icons";
import {
  collectionGroup,
  deleteDoc,
  documentId,
  DocumentSnapshot,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db, auth, sendMessage, getMessages } from "../firebase";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { color } from "react-native-reanimated";
import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import LineBorder from "../components/LineBorder";
import MainButton from "../components/MainButton";
import InputBox from "../components/InputBox";
import globalSlice, {
  selectChannel,
  selectChannelID,
  setChannel,
  setChannelID,
  selectCompanyID,
  selectCompany,
} from "../slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../components/IconButton";
import { Feather } from "@expo/vector-icons";
const MessageScreen = () => {
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState(null);
  const navigation = useNavigation();
  const channel = useSelector(selectChannel);
  const channelID = useSelector(selectChannelID);
  const [loading, setLoading] = useState(true);
  const companyID = useSelector(selectCompanyID);
  const company = useSelector(selectCompany);
  const dispatch = useDispatch();
  const [currenttext, setCurremtText] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: channel,
    });
  }, []);

  useEffect(() => {
    getMessages({ channelID: channelID, setMessages: setMessages });
  }, [channelID, companyID]);
  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={100}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.08 }}>
          <View
            style={{
              //backgroundColor: "#D42929",
              flex: 0.8,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 3.3 }}></View>
            <View style={{ flex: 3.3 }}>
              <View style={{ flex: 0.8 }}></View>
              <View style={{ flex: 0.2 }}>
                <LineBorder></LineBorder>
              </View>
            </View>
            <View style={{ flex: 3.3 }}></View>
          </View>
        </View>
        <View style={{ flex: 0.8 }}>
          <FlatList
            style={{ flex: 1 }}
            data={messages}
            renderItem={({ item }) => {
              const whosMessage = () => {
                if (item.uid == auth.currentUser.uid) {
                  return (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "flex-end",
                        margin: 10,
                        // paddingHorizontal: 20,
                      }}
                    >
                      <View
                        style={{
                          height: 50,
                          backgroundColor: "#F0EFEF",
                          borderRadius: 30,
                          flex: 1,
                          // alignSelf: "center",
                          justifyContent: "center",
                          marginHorizontal: 10,
                          paddingHorizontal: 25,
                          shadowColor: "#000000EF",
                          shadowOffset: {
                            width: 0,
                            height: 8,
                          },
                          shadowOpacity: 0.44,
                          shadowRadius: 10.32,

                          elevation: 16,
                        }}
                      >
                        <Text style={{ textAlign: "center", fontSize: 15 }}>
                          {item.message}
                        </Text>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "flex-start",
                        margin: 20,
                        // paddingHorizontal: 50,
                      }}
                    >
                      <View
                        style={{
                          height: 50,
                          backgroundColor: "#5CD3F1",
                          borderRadius: 30,
                          flex: 1,
                          paddingHorizontal: 25,
                          // alignSelf: "center",
                          justifyContent: "center",
                          marginHorizontal: 15,

                          shadowColor: "#000000EF",
                          shadowOffset: {
                            width: 0,
                            height: 8,
                          },
                          shadowOpacity: 0.44,
                          shadowRadius: 10.32,

                          elevation: 16,
                        }}
                      >
                        <Text style={{ textAlign: "center", fontSize: 15 }}>
                          {item.message}
                        </Text>
                      </View>
                      <View
                        style={{ flex: 1, alignItems: "center", margin: 15 }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            color: "#807F7F",
                            fontSize: 12,
                          }}
                        >
                          {item.userEmail}
                        </Text>
                      </View>
                    </View>
                  );
                }
              };
              return <View style={{ flex: 1 }}>{whosMessage()}</View>;
            }}
            key={(item) => item.key}
            keyExtractor={(item) => item.key}
            // keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          ></FlatList>
        </View>
        <View
          style={{
            // backgroundColor: "#B1C02A",
            flex: 0.12,
            // alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 0.9,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <InputBox
              placeholder="Your Message"
              type="channels"
              onChangeText={setMessage}
              value={message}
              width={Dimensions.get("screen").width / 1.5}
              color={"#7B3AF5"}
            ></InputBox>
          </View>
          <View
            style={{
              flex: 0.1,

              // alignSelf: "center",
              alignItems: "center",
              // paddingRight: 5,
              marginRight: 20,
              // marginBottom: 45,
              // paddingBottom: 45,
              // flexDirection: "row",
            }}
          >
            <IconButton
              buttonWidth={50}
              // text={"send"}
              icon={<Feather name="send" size={24} color="white" />}
              onPress={() => {
                sendMessage({
                  message: message,
                  channelID: channelID,
                  company: company,
                  channel: channel,
                  companyID: companyID,
                });
                setMessage(null);
              }}
              color={"#7B3AF5"}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  inputTitle: {
    borderRadius: 50,
    height: 60,
    width: Dimensions.get("window").width / 1.2,
    borderColor: "#7DCEF38A",
    borderWidth: 2,
    marginBottom: 15,
    marginTop: 10,
    padding: 20,

    backgroundColor: "#D8D8D84D",
    marginHorizontal: 300,
  },
});
