import React, { useLayoutEffect, useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import MainButton from "../components/MainButton";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useSelector } from "react-redux";
import {
  selectAdminUsers,
  selectCompany,
  selectCompanyID,
  selectUserSubcriptionStatus,
} from "../slices/globalSlice";
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
import { db, auth, functions, getCompanyID } from "../firebase";
import * as WebBrowser from "expo-web-browser";
import { lastDayOfYear } from "date-fns/esm";
const UserOptionsScreen = () => {
  const companyId = useSelector(selectCompanyID);
  const adminUsers = useSelector(selectAdminUsers);
  const company = useSelector(selectCompany);
  const userSubcriptionStatus = useSelector(selectUserSubcriptionStatus);
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    if (userSubcriptionStatus == "active") {
      navigation.setOptions({
        title: "User Settings",

        headerShown: true,
        headerBackTitle: "Home",
        headerTitleStyle: {},
      });
    } else {
      navigation.setOptions({
        title: "User Settings",

        headerShown: false,
        headerBackTitle: "Home",
        headerTitleStyle: {},
      });
    }
  });
  const showLoading = () => {
    if (loading == true) {
      return (
        <Text style={{ textAlign: "center", fontSize: 20, margin: 30 }}>
          Loading....
        </Text>
      );
    }
  };
  const showActiveText = () => {
    if (userSubcriptionStatus != "active")
      return (
        <View style={{ padding: {} }}>
          <Text style={{ textAlign: "center", fontSize: "20", color: "red" }}>
            Your Account is no longer active, please adivise your admin to renew
            your subcription!
          </Text>
        </View>
      );
  };
  const showPortalButton = () => {
    if (userSubcriptionStatus == "active") {
      return (
        <View style={{ margin: 10 }}>
          <MainButton
            buttonWidth={Dimensions.get("window").width / 1.3}
            text="Customer Portal"
            onPress={async () => {
              setLoading(true);
              const createPortalLink = httpsCallable(
                functions,
                "ext-firestore-stripe-payments-createPortalLink"
              );
              const { data } = await createPortalLink({
                returnUrl: "https://reactnative.dev/docs/transforms",
              });
              WebBrowser.openBrowserAsync(data.url);
              setLoading(false);
            }}
          ></MainButton>
          {showLoading()}
        </View>
      );
    }
  };
  const navigation = useNavigation();
  const Logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigation.replace("login");
    });
  };

  const showAdminButton = () => {
    if (adminUsers == true) {
      return (
        <View>
          <View style={{ margin: 30 }}>
            <MainButton
              buttonWidth={Dimensions.get("window").width / 1.3}
              text="Payment Plans"
              onPress={() => {
                navigation.navigate("Payment Screen");
              }}
            ></MainButton>
          </View>
          {showPortalButton()}
        </View>
      );
    }
  };
  // useEffect(() => {

  //   return () => {
  //     getCompanyID({
  //       setCompanyId: setCompanyId,
  //       company: company,
  //       dispatchSetCompanyID:
  //     });
  //   };
  // }, []);
  return (
    <ScrollView style={styles.scrollview}>
      <View style={{ marginBottom: 10 }}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Welcome!{"\n"}
          {"\n"} {auth.currentUser.email}
          {"\n"}
          {"\n"}
          Company ID:
          {"\n"}
          {companyId}
        </Text>
      </View>
      {showActiveText()}
      <MainButton
        buttonWidth={Dimensions.get("window").width / 1.3}
        text="sign out"
        onPress={Logout}
      ></MainButton>
      {showAdminButton()}
    </ScrollView>
  );
};

export default UserOptionsScreen;

const styles = StyleSheet.create({
  scrollview: {
    paddingTop: 40,
  },
});
