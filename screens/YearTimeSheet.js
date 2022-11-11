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
  selectEmployeeSelected,
  selectYearSelected,
  setEmployeePersonSelected,
  setYearSelected,
  selectCompanyID,
} from "../slices/globalSlice";
import { db, auth, getClockInYears } from "../firebase";
import { useNavigation } from "@react-navigation/native";
const YearTimeSheet = () => {
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
  const [employees, setEmployees] = useState(null);
  const yearSelected = useSelector(selectYearSelected);
  const employeePersonSelected = useSelector(selectEmployeeSelected);
  const dispatch = useDispatch();
  const companyID = useSelector(selectCompanyID);
  useEffect(() => {
    getClockInYears({
      setEmployees: setEmployees,
      companyID: companyID,
      employeePersonSelected: employeePersonSelected,
    });
  }, []);

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
                dispatch(setYearSelected(item.year));
                navigation.navigate("Month Time Screen");
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
                  padding: 10,
                }}
              >
                <Text style={{ fontSize: 25, textAlign: "center" }}>
                  {item.year}
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

export default YearTimeSheet;

const styles = StyleSheet.create({});
