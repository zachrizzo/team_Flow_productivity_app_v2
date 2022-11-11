import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  collection,
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
  doc,
} from "firebase/firestore";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import {
  selectCompany,
  selectEmployeeSelected,
  selectMonthSelected,
  selectYearSelected,
  selectCompanyID,
} from "../slices/globalSlice";
import { db, auth, getClockInDays } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import MainButton from "../components/MainButton";

const DayTimeSheet = () => {
  const currentDate = new Date();
  const dateInMM = Date.now();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const min = currentDate.getMinutes();
  const year = currentDate.getFullYear();
  const navigation = useNavigation();
  var completedate =
    year.toString() + "/" + month.toString() + "/" + day.toString();

  const completedatestring = completedate.toString();
  const company = useSelector(selectCompany);
  const [daySelected, setDaySelected] = useState(null);
  const employeePersonSelected = useSelector(selectEmployeeSelected);
  const yearSelected = useSelector(selectYearSelected);
  const monthSelected = useSelector(selectMonthSelected);
  const [minutesConverted, setminutesConverted] = useState(null);
  const [addButton, setAddButton] = useState(false);
  const [allDaysAdded, setAllDaysAdded] = useState([]);
  const [daysAdded, setDaysAdded] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [finalSum, setFinalSum] = useState(null);
  const companyID = useSelector(selectCompanyID);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Day",

      // headerLeft: () => (
      //   <View style={{ marginLeft: 20 }}>
      //     <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
      //       {/* <Avatar rounded source = {{uri: auth?.currentUser.photoURL}}/> */}
      //       <FontAwesome name="bars" size={30} color="black" />
      //     </TouchableOpacity>
      //   </View>
      // ),

      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (addButton == false) {
              setAddButton(true);
            } else {
              setAllDaysAdded([]);
              setDaysAdded([]);
              setAddButton(false);
              setFinalSum(null);
            }
          }}
        >
          <AntDesign name="plus" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [addButton]);

  useEffect(() => {
    getClockInDays({
      setDaySelected: setDaySelected,
      yearSelected: yearSelected,
      monthSelected: monthSelected,
      employeePersonSelected: employeePersonSelected,
      companyID: companyID,
    });
  }, []);

  const addUpTime = () => {
    if (addButton == true) {
      return (
        <View
          style={{
            backgroundColor: "#DBDADADF",
            paddingVertical: 10,
            width: Dimensions.get("screen").width / 1.1,
            borderRadius: 20,
            // marginVertical: 30,
            shadowColor: "#000000EF",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            alignItems: "center",
            marginTop: 30,
            // flex: 1,
          }}
        >
          <Text style={{ fontSize: 20 }}>Days Selected</Text>
          <View
            style={{
              width: Dimensions.get("screen").width / 2,
              height: 100,
              backgroundColor: "#9B9B9B",
              borderRadius: 20,
              alignSelf: "center",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <FlatList
              style={{ flex: 1 }}
              data={daysAdded}
              horizontal={true}
              renderItem={({ item }) => {
                return (
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        margin: 30,
                        backgroundColor: "#7B3AF5",
                        borderRadius: 80,
                        padding: 6,
                      }}
                    >
                      <Text style={{ fontSize: 25 }}>{item}</Text>
                    </View>
                  </View>
                );
              }}
              key={(item) => item.key}
              keyExtractor={(item) => item.key}
            ></FlatList>
          </View>
          <Text style={{ fontSize: 15 }}> {finalSum} Hours</Text>
          <MainButton
            text={"Add Total Hours"}
            onPress={() => {
              var sum = 0;
              var allHR = 0;
              allDaysAdded.forEach((item) => {
                allHR = sum += item;
              });
              setFinalSum(allHR);
            }}
            buttonWidth={300}
          />
        </View>
      );
    }
  };

  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      {addUpTime()}
      <FlatList
        style={{ flex: 1 }}
        data={daySelected}
        renderItem={({ item }) => {
          const ShadowColor = () => {
            if (daysAdded.includes(item.day)) {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor:
                      Platform.OS == "ios" ? "#F0EFEF" : "#A574FF47",
                    width: Dimensions.get("screen").width / 1.2,
                    shadowColor: "#7B3AF5",
                    shadowOffset: {
                      width: 0,
                      height: 8,
                    },
                    shadowOpacity: 0.44,
                    shadowRadius: 10.32,

                    // elevation: 16,
                    borderRadius: 20,
                    margin: 30,
                    padding: 10,
                  }}
                >
                  <Text style={{ fontSize: 25, textAlign: "center" }}>
                    Day: {"\n"}
                    {item.day} {"\n"}
                  </Text>
                  <Text style={{ fontSize: 20, textAlign: "center" }}>
                    Location: {item.location} {"\n"}
                  </Text>
                  <Text style={{ fontSize: 25, textAlign: "center" }}>
                    {item.totalHoursToday} hours total
                  </Text>
                </View>
              );
            } else {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",

                    backgroundColor:
                      Platform.OS == "ios" ? "#F0EFEF" : "#D6D6D6",
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
                    padding: 10,
                  }}
                >
                  <Text style={{ fontSize: 25, textAlign: "center" }}>
                    Day: {"\n"}
                    {item.day} {"\n"}
                  </Text>
                  <Text style={{ fontSize: 20, textAlign: "center" }}>
                    Location: {item.location} {"\n"}
                  </Text>
                  <Text style={{ fontSize: 25, textAlign: "center" }}>
                    {item.totalHoursToday} hours total
                  </Text>
                </View>
              );
            }
          };
          return (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                if (addButton == true) {
                  if (daysAdded.includes(item.day)) {
                    return null;
                  } else {
                    if (refresh == true) {
                      setRefresh(false);
                    } else {
                      setRefresh(true);
                    }

                    daysAdded.push(item.day);
                    allDaysAdded.push(item.totalHoursToday);

                    console.log(allDaysAdded);
                    console.log(daysAdded);
                  }
                } else {
                  return null;
                }
              }}
              onLongPress={() => {
                const index1 = daysAdded.indexOf(item.day);
                if (index1 > -1) {
                  daysAdded.splice(index1, 1); // 2nd parameter means remove one item only
                }
                const index2 = allDaysAdded.indexOf(item.totalHoursToday);
                if (index2 > -1) {
                  allDaysAdded.splice(index2, 1); // 2nd parameter means remove one item only
                }
                setFinalSum(null);
                console.log(allDaysAdded);
                if (refresh == true) {
                  setRefresh(false);
                } else {
                  setRefresh(true);
                }
              }}
            >
              {ShadowColor()}
            </TouchableOpacity>
          );
        }}
        key={(item) => item.key}
        keyExtractor={(item) => item.key}
      ></FlatList>
    </View>
  );
};

export default DayTimeSheet;

const styles = StyleSheet.create({});
