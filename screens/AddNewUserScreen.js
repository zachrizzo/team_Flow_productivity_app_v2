import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import InputBox from "../components/InputBox";
import {
  arrayUnion,
  collectionGroup,
  deleteDoc,
  doc,
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
  setDoc,
  where,
  collection,
} from "firebase/firestore";
import MainButton from "../components/MainButton";
import { auth, db } from "../firebase";

import { async } from "@firebase/util";
import { useSelector } from "react-redux";
import { selectCompany, setCompany } from "../slices/globalSlice";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const AddNewUserScreen = () => {
  const [employeesName, setEmployeesName] = useState(null);
  const [employeesEmail, setEmployeesEmail] = useState(null);
  const [employeesPosition, setEmployeesPosition] = useState(null);
  const [employeesPassword, setEmployeesPassword] = useState(null);
  const [employeesPassword2, setEmployeesPassword2] = useState(null);
  const [employeesPhoneNumber, setEmployeesPhoneNumber] = useState(null);
  const [employeesCompany, setEmployeesCompany] = useState(null);
  const [employeesCompanyID, setEmployeesCompanyID] = useState(null);
  const [companyList, setCompanyList] = useState(null);
  const [employeesCompanyID2, setEmployeesCompanyID2] = useState(null);
  const auth = getAuth();
  // const company = useSelector(selectCompany);
  const foundCompanys = () => {
    if (employeesCompanyID != null) {
      return (
        <FlatList
          style={{ flex: 1 }}
          data={companyList}
          // horizontal={true}
          renderItem={({ item }) => {
            return (
              <View>
                <Text
                  style={{ textAlign: "center", fontSize: 20, color: "red" }}
                >
                  If you see your company listed, tap on it.
                </Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: "#CFCCCC93",
                    width: Dimensions.get("screen").width / 1.2,
                    borderRadius: 20,
                    marginTop: 10,
                    justifyContent: "center",
                    height: 40,
                  }}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setEmployeesCompany(item.company);
                      setEmployeesCompanyID(null);
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        // backgroundColor: "#4FA3DB",
                        marginHorizontal: 40,
                        // margin: 40,
                        borderRadius: 30,
                        height: 20,
                        marginTop: 10,
                      }}
                    >
                      <View
                        style={{
                          flex: 0.9,
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <View style={{ flex: 0.5, justifyContent: "center" }}>
                          <Text>{item.company}</Text>
                        </View>
                        <View style={{ flex: 0.5 }}>
                          <Text>{item.companyID}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          // key={(item) => item.key}
          keyExtractor={(item, index) => index.toString()}
          // keyExtractor={(item) => item.id}
          // showsVerticalScrollIndicator={false}
        ></FlatList>
      );
    }
  };
  const ShowCompany = () => {
    if (employeesCompany != null) {
      return (
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Company:
          {"\n"}
          {employeesCompany}
        </Text>
      );
    }
  };
  const PassordCheck = () => {
    if (employeesPassword != employeesPassword2) {
      return (
        <Text style={{ color: "red", textAlign: "center" }}>
          The passwords dont match!
        </Text>
      );
    } else return null;
  };
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "companys"),
        where("companyID", "==", employeesCompanyID)
      ),
      (querySnapshot) => {
        const companys = [];
        querySnapshot.forEach((snap) => {
          companys.push(snap.data());
        });
        console.log(companys);
        setCompanyList(companys);
      }
    );

    // return () => {
    //   getData();
    // };
  }, [employeesCompanyID]);

  const addNewEmployee = () => {
    if (
      employeesCompany == null ||
      employeesEmail == null ||
      employeesPassword == null ||
      employeesPassword2 == null
    ) {
      alert("please complete alll feilds");
    } else if (employeesCompanyID2 != null) {
      createUserWithEmailAndPassword(auth, employeesEmail, employeesPassword)
        .then(async (userCredential) => {
          const user = userCredential.user.uid;

          await setDoc(
            doc(db, "users", auth.currentUser.email),
            {
              fullName: employeesName,
              company: employeesCompany.toLowerCase(),
              email: employeesEmail.toLowerCase(),
              phoneNumber: employeesPhoneNumber,
              uid: user,
              position: employeesPosition,
              company: employeesCompany,
              companyID: employeesCompanyID2,
            },
            { merge: true }
          );

          // user.displayName(company);
          // user.phoneNumber(phoneNumber);
        })
        .then(async () => {
          try {
            await setDoc(
              doc(db, "companys", employeesCompanyID2),
              {
                employees: arrayUnion(employeesEmail),
                numberOfEmployeesCurrentlySignedUp: increment(1),
              },
              { merge: true }
            );
          } catch (error) {
            alert(error);
          }
        })
        .catch((error) => {
          alert(error);
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={10}
        style={{ flex: 1, alignItems: "center" }}
      >
        <View>
          <InputBox
            width={Dimensions.get("screen").width / 1.2}
            color={"#7B3AF5"}
            placeholder={"Company ID your employer gave you"}
            onChangeText={(text) => {
              setEmployeesCompanyID(text);
              setEmployeesCompanyID2(text);
            }}
          />
          {foundCompanys()}
          {ShowCompany()}
          <InputBox
            width={Dimensions.get("screen").width / 1.2}
            color={"#7B3AF5"}
            placeholder={"Full name"}
            onChangeText={(text) => {
              setEmployeesName(text);
            }}
          />
          <InputBox
            width={Dimensions.get("screen").width / 1.2}
            color={"#7B3AF5"}
            placeholder={"Email"}
            onChangeText={(text) => {
              setEmployeesEmail(text);
            }}
          />
          <InputBox
            width={Dimensions.get("screen").width / 1.2}
            color={"#7B3AF5"}
            placeholder={"Position"}
            onChangeText={(text) => {
              setEmployeesPosition(text);
            }}
          />
          <InputBox
            width={Dimensions.get("screen").width / 1.2}
            color={"#7B3AF5"}
            placeholder={"Phone Number"}
            onChangeText={(text) => {
              setEmployeesPhoneNumber(text);
            }}
          />
          <InputBox
            width={Dimensions.get("screen").width / 1.2}
            color={"#7B3AF5"}
            placeholder={"Password"}
            onChangeText={(text) => {
              setEmployeesPassword(text);
            }}
          />
          <InputBox
            width={Dimensions.get("screen").width / 1.2}
            color={"#7B3AF5"}
            placeholder={"Re-type Password"}
            onChangeText={(text) => {
              setEmployeesPassword2(text);
            }}
          />
          {PassordCheck()}
          <View style={{ flex: 1, marginBottom: 50 }}>
            <MainButton
              buttonWidth={250}
              text="Create an account"
              onPress={addNewEmployee}
            ></MainButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddNewUserScreen;

const styles = StyleSheet.create({});
