import React from "react";
import {
  Button,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import MainButton from "../components/MainButton";
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
import { db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import globalSlice, {
  selectCompany,
  setCompany,
  setTime1,
  selectTime1,
  setDate,
  selectDate,
  setLat,
  setLong,
  setWorkLat,
  setWorkLong,
  setLocation,
  setDistance,
  selectCompanyAddress,
  selectLat,
  selectLong,
  selectWorkLat,
  selectWorkLong,
  setCompanyAddress,
} from "../slices/globalSlice";
const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigation = useNavigation();
  const company = useSelector(selectCompany);
  // const auth = getAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user != null) {
        navigation.replace("HomeScreen");
      }
    });
    return () => {
      unsubscribe;
    };
  }, []);
  // const googleSignIn = async () => {
  //   try {
  //     await signInWithPopup(auth, new GoogleAuthProvider())
  //       .then((result) => {
  //         // This gives you a Google Access Token. You can use it to access the Google API.
  //         const credential = GoogleAuthProvider.credentialFromResult(result);
  //         const token = credential.accessToken;
  //         // The signed-in user info.
  //         const user = result.user;
  //         // ...
  //       })
  //       .catch((error) => {
  //         // Handle Errors here.
  //         const errorCode = error.code;
  //         const errorMessage = error.message;
  //         // The email of the user's account used.
  //         const email = error.email;
  //         // The AuthCredential type that was used.
  //         const credential = GoogleAuthProvider.credentialFromError(error);
  //         // ...
  //       });
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

  const SignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log("it worked");
        // const user = userCredential.user;

        // ...
      })
      .catch((error) => {
        alert(error);
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
  };

  //   const createUser = createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
  //     });
  return (
    <KeyboardAvoidingView
      // Platform.OS ==
      behavior={Platform.OS === "ios" ? "padding" : null}
      // keyboardVerticalOffset={10}
      style={{ flex: 1, alignItems: "center" }}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Flow Team</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputfeild}
              placeholder="Email"
              autoFocus
              type="email"
              onChangeText={(text) => setEmail(text.trim())}
              autoCapitalize="none"
              placeholderTextColor={"#858585"}
            ></TextInput>
            <TextInput
              style={styles.inputfeild}
              placeholder="Password"
              type="password"
              onChangeText={(text) => setPassword(text.trim())}
              autoCapitalize="none"
              placeholderTextColor={"#858585"}
            ></TextInput>
          </View>
          {/* <View style={{ marginTop: 40 }}>
          <MainButton
            buttonWidth={Dimensions.get("screen").width / 1.9}
            text="Sign Up"
            onPress={googleSignIn}
          ></MainButton>
        </View> */}
          <View style={styles.buttonView}>
            <MainButton
              buttonWidth={Dimensions.get("screen").width / 1.3}
              text="Sign In"
              onPress={SignIn}
            ></MainButton>
            {/* <View style={{ marginTop: 20 }}> */}
            {/* <MainButton
                buttonWidth={Dimensions.get("screen").width / 1.3}
                text="Sign Up Your Company"
                onPress={() => {
                  navigation.navigate("Sign Up");
                }}
              ></MainButton>
            </View> */}

            <View style={{ marginVertical: 40 }}>
              <Text style={{ textAlign: "center" }}>
                Is your organization all ready signed up?
              </Text>
              <MainButton
                buttonWidth={Dimensions.get("screen").width / 1.9}
                text="Join the Team "
                onPress={() => {
                  navigation.navigate("Add New UserScreen");
                }}
              ></MainButton>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;
const styles = StyleSheet.create({
  inputView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 150,
  },
  inputfeild: {
    borderRadius: 50,
    height: 65,
    width: Dimensions.get("window").width / 1.2,
    borderColor: "#7B3AF5",
    borderWidth: 2,
    marginVertical: 20,
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "bold",
    marginTop: 115,
  },

  buttonView: {
    marginTop: 20,
  },
});
