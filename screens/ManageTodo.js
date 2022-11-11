import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  deleteDoc,
  documentId,
  DocumentSnapshot,
  getDoc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { useLayoutEffect, useState, useEffect } from "react";
import MainButton from "../components/MainButton";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";

const windowWidth = Dimensions.get("window").width;

const ManageTodo = () => {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [importance, setImportance] = useState(null);
  var currentDate = new Date();

  const [todaysHours, setTodaysHours] = useState(null);
  const [companyBD, setCompanyDB] = useState(null);
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const min = currentDate.getMinutes();

  const monthsDays = day.toString();
  const hoursToString = hours.toString();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Manage To-do",

      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
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
  if (importance > 10) {
    Alert.alert(
      "Invalid Importance",
      "Task importance can only be a number 1-10",
      [{ text: "Sounds Good", onPress: () => setImportance(10) }]
    );
  }
  useEffect(() => {
    const getCompany = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (doc) => {
        setCompanyDB(doc.get("company"));
      }
    );

    return () => {
      getCompany();
    };
  }, []);
  useEffect(() => {
    const theTime = () => {
      if (hours > 12) {
        const todayHoursOverTwelve = hours - 12;
        const todayHoursOverTwelveString = todayHoursOverTwelve.toString();
        console.log("OVER 12 " + todayHoursOverTwelveString);
        setTodaysHours(todayHoursOverTwelveString);
      } else setTodaysHours(hoursToString), console.log("hhhhhh", todaysHours);
    };

    return () => {
      theTime();
    };
  }, []);
  const time = todaysHours + ":" + min;
  const fulldate = month + "/" + day;
  console.log(fulldate);
  const addNewTask = async () => {
    try {
      await addDoc(
        collection(db, "tasks"),
        {
          description: description,
          name: title,
          importance: importance,
          lastUpdateTime: time,
          lastUpdateDate: fulldate,
          company: companyBD,
        },
        { merge: true }
      );
    } catch (error) {
      console.log("i got an error ${error}");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, alignItems: "center" }}>
      <View style={{ flex: 1 }}>
        <View style={styles.inputFeildBox}>
          <TextInput
            style={styles.inputTitle}
            placeholder="Title"
            type="name"
            onChangeText={setTitle}
          ></TextInput>
          <View>
            <TextInput
              style={styles.inputTitle}
              placeholder="Task Description"
              type="description"
              onChangeText={setDescription}
            ></TextInput>
          </View>
          <View>
            <TextInput
              style={styles.inputTitle}
              placeholder="Ex:1-10"
              type="importance"
              onChangeText={setImportance}
            ></TextInput>
            <View>
              <MainButton
                text={"Add Task"}
                onPress={() => {
                  addNewTask();
                }}
                buttonWidth={300}
              />
            </View>
          </View>
        </View>
      </View>
      {/* <View style={{ flex: 0.5 }}></View> */}
    </KeyboardAvoidingView>
  );
};

export default ManageTodo;

const styles = StyleSheet.create({
  inputFeildBox: {
    flex: 1,
    backgroundColor: "#CFCFCF6C",
    borderRadius: 30,
  },
  inputTitle: {
    borderRadius: 50,
    height: 60,
    width: windowWidth * 0.8,
    borderColor: "#7DCEF38A",
    borderWidth: 2,
    marginBottom: 15,
    marginTop: 10,
    padding: 20,
    backgroundColor: "#D8D8D84D",
    marginHorizontal: 300,
  },
});
