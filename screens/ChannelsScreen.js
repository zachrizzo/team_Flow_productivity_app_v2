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
import React, { useState, useLayoutEffect, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
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
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import {
  db,
  auth,
  addNewChannel,
  getAllUsersInCompany,
  getListOfChannels,
} from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import InputBox from "../components/InputBox";
import MainButton from "../components/MainButton";
import LineBorder from "../components/LineBorder";
import globalSlice, {
  selectChannel,
  setChannel,
  setChannelID,
  selectChannelID,
  selectCompany,
  selectCompanyID,
} from "../slices/globalSlice";
import { useDispatch, useSelector } from "react-redux";
// import { findNonSerializableValue } from "@reduxjs/toolkit";
// import DeleteButton from "../components/DeleteButton";
// import { reauthenticateWithPhoneNumber } from "firebase/auth";
// import Checkbox from "expo-checkbox";
import IconButton from "../components/IconButton";
const ChannelsScreen = () => {
  const navigation = useNavigation();
  const [channels, setChannels] = useState(null);
  const [deleteChannel, setDeleteChannel] = useState(false);
  const [newChannel, setNewChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipients, setRecipients] = useState(null);
  const channelID = useSelector(selectChannelID);
  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  const [allRecipreants, setAllRecipreants] = useState(null);
  const [searchedRecipreants, setSearchedRecipreants] = useState([]);
  const [isChecked, setChecked] = useState(false);
  const company = useSelector(selectCompany);
  const companyID = useSelector(selectCompanyID);

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
  const addedUsers = () => {
    try {
      if (userList != null) {
        return (
          <TouchableOpacity
            onPress={() => {
              userList.filter();
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#A5A5A593",
                width: Dimensions.get("screen").width / 1.5,
                borderRadius: 20,
                marginTop: 10,
                justifyContent: "center",
              }}
            >
              <FlatList
                style={{ flex: 1 }}
                data={userList}
                // horizontal={true}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        //remove user from list

                        setUserList(userList.filter((user) => user !== item));
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center",
                          backgroundColor: "#FFFFFF",
                          marginHorizontal: 40,
                          // margin: 40,
                          borderRadius: 30,
                          height: 60,
                          marginVertical: 10,
                        }}
                      >
                        <View style={{ flex: 0.9, alignItems: "center" }}>
                          <Text>{item.email}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                // key={(item) => item.key}
                keyExtractor={(item, index) => index.toString()}
                listKey={1}
                // keyExtractor={(item) => item.id}
                // showsVerticalScrollIndicator={false}
              ></FlatList>
            </View>
          </TouchableOpacity>
        );
      }
    } catch {
      alert("error");
    }
  };
  const allUsers = () => {
    if (recipients != null) {
      return (
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <FlatList
              style={{ flex: 1 }}
              data={allRecipreants}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setRecipients(null);
                      setAllRecipreants(null);

                      // addOneRecipreant()
                      setUserList((userList) => [
                        ...userList,
                        { email: item.email },
                      ]);
                      // console.log(
                      //   "userList " +
                      //     JSON.stringify(
                      //       userList.forEach((item) => {
                      //         //console.log(item.email);
                      //       })
                      //     )
                      // );
                      setAllRecipreants(null);
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        flexDirection: "row",
                        alignContent: "center",
                        alignSelf: "center",
                        justifyContent: "center",
                        backgroundColor: "#D3D0D0",
                        width: "60%",

                        // margin: 40,
                        borderRadius: 30,
                        height: 50,
                        marginVertical: 10,
                      }}
                    >
                      <View style={{ flex: 0.9, alignItems: "center" }}>
                        <Text>{item.email}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              key={(item) => item.key}
              keyExtractor={(item) => item.key}
              listKey={2}
              // keyExtractor={(item) => item.id}
            ></FlatList>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    getListOfChannels({ setChannels });
  }, [recipients, newChannel, deleteChannel]);

  useEffect(() => {
    return () => {
      getAllUsersInCompany({
        companyID: companyID,
        setAllUsers: setSearchedRecipreants,
      });
    };
  }, [recipients]);
  useEffect(() => {
    var searched = [];
    if (searchedRecipreants != null && recipients != null && recipients != "") {
      searchedRecipreants.forEach((item) => {
        //if item is in the list of usersLlist then dont add it to the searched list

        if (
          item.email != null &&
          recipients != null &&
          item.email.toLowerCase().includes(recipients.toLowerCase()) &&
          userList.filter((user) => user !== item.email) &&
          item.email.toLowerCase() != auth.currentUser.email.toLowerCase()
        ) {
          console.log("hhhhhhh " + userList);
          searched.push(item);
        }
      });
      setAllRecipreants(searched);
      searched = [];
    } else {
      setAllRecipreants(null);
      searched = [];
    }
  }, [recipients, setAllRecipreants, userList]);

  // console.log(newChannel);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={200}
      behavior={Platform.OS === "ios" ? null : "height"}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <FlatList
          style={{ flex: 1 }}
          data={[true]}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      marginBottom: 20,
                      alignItems: "center",
                    }}
                  >
                    <InputBox
                      placeholder="New Channel"
                      type="channels"
                      value={newChannel}
                      onChangeText={setNewChannel}
                      width={Dimensions.get("screen").width / 1.2}
                      color={"#7B3AF5"}
                    ></InputBox>
                    <InputBox
                      placeholder="Add Recipients "
                      type="channels"
                      value={recipients}
                      onChangeText={setRecipients}
                      width={Dimensions.get("screen").width / 1.5}
                      color={"#7B3AF5"}
                    ></InputBox>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginVertical: 20,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <View style={{ flex: 0.5 }}> */}
                    <View>{allUsers()}</View>
                    <LineBorder color={"#7B3AF5"} width={200} />
                    {addedUsers()}
                    {/* </View> */}

                    <MainButton
                      buttonWidth={200}
                      text={"add Channel"}
                      onPress={() => {
                        addNewChannel({
                          userList: userList,
                          dispatch: dispatch,
                          setAllRecipreants: setAllRecipreants,
                          setNewChannel: setNewChannel,
                          setRecipients: setRecipients,
                          setDeleteChannel: setDeleteChannel,
                          setChannelID: setChannelID,
                          channels: channels,
                          newChannel: newChannel,
                          company: company,
                          companyID: companyID,
                          setUserList: setUserList,
                        });
                      }}
                    />
                  </View>

                  <LineBorder />
                </View>
                <View style={{ flex: 1 }}>
                  <FlatList
                    style={{ flex: 1, marginTop: 80 }}
                    data={channels}
                    renderItem={({ item }) => {
                      const ShowChannelOptions = () => {
                        if (deleteChannel == true) {
                          return (
                            <View
                              style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{ flex: 0.5, alignItems: "flex-end" }}
                              >
                                <Text
                                  style={{ textAlign: "center", fontSize: 30 }}
                                >
                                  {item.channel}
                                </Text>
                              </View>
                              <View
                                style={{ flex: 0.5, alignItems: "flex-end" }}
                              >
                                <IconButton
                                  buttonWidth={50}
                                  color={"#FF0000"}
                                  icon={
                                    <FontAwesome
                                      name="trash-o"
                                      size={24}
                                      color="black"
                                    />
                                  }
                                  onPress={() => {
                                    try {
                                      deleteDoc(
                                        doc(
                                          db,
                                          "channels",
                                          item.channelIDstring
                                        )
                                      );
                                    } catch (error) {
                                      alert("Item not deleted " + error);
                                    }
                                  }}
                                ></IconButton>
                              </View>
                            </View>
                          );
                        } else {
                          return (
                            <View
                              style={{
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <View style={{ alignItems: "center" }}>
                                <Text
                                  style={{ textAlign: "center", fontSize: 30 }}
                                >
                                  {item.channel}
                                </Text>
                              </View>
                            </View>
                          );
                        }
                      };
                      return (
                        <View
                          style={{
                            marginVertical: 20,
                            flex: 1,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate("Message Screen");
                              dispatch(setChannel(item.channel));
                              dispatch(setChannelID(item.channelID));
                            }}
                            onLongPress={() => {
                              if (deleteChannel == false) {
                                setDeleteChannel(true);
                              } else {
                                setDeleteChannel(false);
                              }
                            }}
                          >
                            <View
                              style={{
                                width: Dimensions.get("screen").width / 1.4,
                                height: 100,
                                backgroundColor:
                                  Platform.OS == "ios" ? "#F0EFEF" : "#DEDDDD",
                                borderRadius: 30,
                                flex: 1,
                                alignSelf: "center",
                                justifyContent: "center",
                                marginHorizontal: 15,
                                paddingHorizontal: 15,
                                shadowColor: "#000000EF",
                                shadowOffset: {
                                  width: 0,
                                  height: 8,
                                },
                                shadowOpacity: 0.44,
                                shadowRadius: 10.32,

                                // elevation: 16,
                              }}
                            >
                              {ShowChannelOptions()}
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                    key={(item) => item.key}
                    keyExtractor={(item) => item.key}
                    // keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            );
          }}
          key={(item) => item.key}
          keyExtractor={(item) => item.key}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
export default ChannelsScreen;
const styles = StyleSheet.create({
  checkbox: {},
});
