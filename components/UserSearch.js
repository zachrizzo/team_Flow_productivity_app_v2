import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import InputBox from "./InputBox";
import { getAllUsersInCompany, auth } from "../firebase";

export default function UserSearch({
  selectedUser,
  setSelectedUser,
  companyID,
}) {
  const [listOfReturnedSearch, setListOfReturnedSearch] = useState([]);
  const [searchBoxValue, setSearchBoxValue] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [allUsersFromDB, setAllUsersFromDB] = useState([]);
  useEffect(() => {
    getAllUsersInCompany({
      companyID: companyID,
      setAllUsers: setAllUsersFromDB,
    });
  }, [searchBoxValue]);

  useEffect(() => {
    var searched = [];
    if (searchBoxValue != null && searchBoxValue != "") {
      allUsersFromDB.forEach((item) => {
        //if item is in the list of usersLlist then dont add it to the searched list

        if (
          item.email != null &&
          searchBoxValue != null &&
          item.email.toLowerCase().includes(searchBoxValue.toLowerCase()) &&
          //listOfReturnedSearch.filter((user) => user !== item.email) &&
          item.email.toLowerCase() != auth.currentUser.email.toLowerCase()
        ) {
          searched.push(item);
        }
      });
      setListOfReturnedSearch(searched);
      searched = [];
    } else {
      setListOfReturnedSearch(null);
      searched = [];
    }
  }, [searchBoxValue, setSearchBoxValue]);
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <InputBox
        placeholder="Search for a user to add to the team"
        color="#7B3AF5"
        width={Dimensions.get("window").width / 2.5}
        value={searchBoxValue}
        onChangeText={(text) => setSearchBoxValue(text)}
      />
      {searchBoxValue != "" && searchBoxValue != null && (
        <View
          style={{
            backgroundColor: "#A8A7A786",
            width: Dimensions.get("screen").width / 2,

            borderRadius: 30,
            overflow: "scroll",

            alignItems: "center",
          }}
        >
          <FlatList
            data={listOfReturnedSearch}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    //if email is not in selectedUser then add it
                    if (
                      selectedUser.filter((user) => user == item.email)
                        .length == 0
                    ) {
                      selectedUser.push(item.email);
                    }
                    setSearchBoxValue("");
                    setRefresh(!refresh);
                  }}
                >
                  <View
                    style={{
                      marginVertical: 20,
                      padding: 10,
                      backgroundColor: "#ffffff",
                      width: Dimensions.get("screen").width / 2.5,
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{}}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.email}
            listKey={2}
          />
        </View>
      )}
      {selectedUser != null && (
        <View
          style={{
            width: Dimensions.get("screen").width / 2,

            borderRadius: 30,
            overflow: "scroll",

            alignItems: "center",
          }}
        >
          <FlatList
            data={selectedUser}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    //get the index of the item in the array
                    var index = selectedUser.indexOf(item);
                    //remove the item from the array
                    selectedUser.splice(index, 1);
                    setRefresh(!refresh);
                  }}
                >
                  <View
                    style={{
                      marginVertical: 20,
                      padding: 10,
                      backgroundColor: "#1B6AD8",
                      width: Dimensions.get("screen").width / 2.5,
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#FFFFFF" }}>{item}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.email}
            listKey={3}
            Key={3}
          />
        </View>
      )}
    </View>
  );
}
