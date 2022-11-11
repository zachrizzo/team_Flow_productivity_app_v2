import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";

import { useSelector, useDispatch } from "react-redux";
import {
  selectCompany,
  selectEmployeeSelected,
  setEmployeePersonSelected,
  selectCompanyID,
} from "../slices/globalSlice";
import { db, auth, getClockInUsers } from "../firebase";
import { useNavigation } from "@react-navigation/native";
const TimeSheet = () => {
  const currentDate = new Date();
  const dateInMM = Date.now();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const min = currentDate.getMinutes();
  const year = currentDate.getFullYear();
  const dispatch = useDispatch();
  var completedate =
    year.toString() + "/" + month.toString() + "/" + day.toString();
  const navigation = useNavigation();
  const completedatestring = completedate.toString();
  const company = useSelector(selectCompany);
  const [employees, setEmployees] = useState(null);
  const employeePersonSelected = useSelector(selectEmployeeSelected);
  const companyID = useSelector(selectCompanyID);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Time Sheet",

      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            {/* <Avatar rounded source = {{uri: auth?.currentUser.photoURL}}/> */}
            <FontAwesome name="bars" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ),

      //   headerRight: () => <View>{showClockInSettings()}</View>,
    });
  }, []);

  useEffect(() => {
    getClockInUsers({ setEmployees: setEmployees, companyID: companyID });
  }, [companyID]);

  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        data={employees}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                navigation.navigate("Year Time Screen");
                dispatch(setEmployeePersonSelected(item.email));
                console.log(employeePersonSelected);
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",

                  backgroundColor: Platform.OS == "ios" ? "#F0EFEF" : "#DEDDDD",
                  width: Dimensions.get("screen").width / 1.2,
                  shadowColor: "#000000EF",
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.44,
                  shadowRadius: 10.32,

                  // elevation: 16,
                  borderRadius: 20,
                  margin: 30,
                  padding: 30,
                }}
              >
                <Text style={{ fontSize: 25, textAlign: "center" }}>
                  {item.email}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        key={(item) => item.key}
        keyExtractor={(item) => item.key}
      ></FlatList>
    </View>
  );
};

export default TimeSheet;

const styles = StyleSheet.create({});
