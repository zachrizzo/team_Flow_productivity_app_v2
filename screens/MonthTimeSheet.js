import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
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
} from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCompany,
  selectYearSelected,
  setMonthSelected,
  selectEmployeeSelected,
  selectCompanyID,
} from "../slices/globalSlice";
import { db, auth, getClockInMonths } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { setMonth } from "date-fns";
const MonthTimeSheet = () => {
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
  const dispatch = useDispatch();
  const completedatestring = completedate.toString();
  const company = useSelector(selectCompany);
  const yearSelected = useSelector(selectYearSelected);
  const [monthselected, setMonthselected] = useState(null);
  const employeePersonSelected = useSelector(selectEmployeeSelected);
  const companyID = useSelector(selectCompanyID);
  useEffect(() => {
    getClockInMonths({
      setMonthselected: setMonthselected,
      yearSelected: yearSelected,
      employeePersonSelected: employeePersonSelected,
      companyID: companyID,
    });
  }, []);

  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        data={monthselected}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                dispatch(setMonthSelected(item.month));
                navigation.navigate("Day Time Screen");
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
                  {item.month}
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

export default MonthTimeSheet;

const styles = StyleSheet.create({});
