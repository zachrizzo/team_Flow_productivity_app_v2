import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
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
import { db, auth } from "../firebase";

import MainButton from "../components/MainButton";
import { getApp } from "@firebase/app";
import { async } from "@firebase/util";
import * as WebBrowser from "expo-web-browser";
import { useSelector } from "react-redux";
import { selectCompany } from "../slices/globalSlice";
const PaymentScreen = () => {
  const [allProducts, setAllProducts] = useState(null);
  const app = getApp();
  const [products, setProducts] = useState([]);
  const [button, setButton] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const company = useSelector(selectCompany);
  //   useEffect(() => {
  //     try {
  //       onSnapshot(
  //         collection(db, "customers", auth.currentUser.uid, "subscriptions"),
  //         where("status", "in", ["trialing", "active"]),
  //         (querySnapshot) => {
  //           const all = [];
  //           const doc = querySnapshot.docs[0];
  //           if (doc) {
  //             //   console.log(doc.id, " => ", doc.get("status"));
  //             setIsActive(doc.get("status"));
  //           }
  //         }
  //       );
  //     } catch (e) {
  //       alert(e);
  //     }
  //     const addSubStatus = async () => {
  //       if (isActive == "active") {
  //         await setDoc(
  //           doc(db, "companys", company),
  //           {
  //             subscriptionStatus: "active",
  //           },
  //           { merge: true }
  //         );
  //       } else {
  //         await setDoc(
  //           doc(db, "companys", company),
  //           {
  //             subscriptionStatus: "not active",
  //           },
  //           { merge: true }
  //         );
  //       }
  //     };
  //     return () => {
  //       addSubStatus();
  //     };
  //   }, []);

  useEffect(() => {
    onSnapshot(query(collection(db, "products")), (querySnapshot) => {
      const all = [];
      querySnapshot.forEach((snap) => {
        all.push(snap.data());
      });
      setAllProducts(all);
      //console.log("tt" + JSON.stringify(allProducts));
    });
  }, []);
  const showIsActive = () => {
    if (isActive == "active") {
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: "center", fontSize: 20 }}>
            You are already a member of the Team Flow Eco System. If you wish to
            change your card info, update your subscription, or cancel your
            subscription. Please navigate to the customer portal located in the
            user Options Screen.
          </Text>
        </View>
      );
    } else {
      return (
        <FlatList
          style={{ flex: 1 }}
          data={allProducts}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flex: 1,
                  padding: 20,
                  marginVertical: 20,
                  borderRadius: 30,
                  backgroundColor: "#E0E0E0",
                  alignSelf: "center",
                  // height: 300,
                  width: Dimensions.get("screen").width / 1.2,
                  shadowColor: "#000000EF",
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.44,
                  shadowRadius: 10.32,
                  elevation: 10,
                }}
              >
                <View style={{ flex: 0.7, justifyContent: "flex-start" }}>
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      textAlign: "center",
                      margin: 5,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      margin: 10,
                      textAlign: "center",
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
                <View
                  style={{ flex: 0.3, justifyContent: "flex-end", margin: 5 }}
                >
                  <MainButton
                    buttonWidth={Dimensions.get("screen").width / 1.6}
                    text={"Join Team Flow"}
                    onPress={async () => {
                      directtocheckOut();
                    }}
                  />
                </View>
              </View>
            );
          }}
          key={(item) => item.key}
          keyExtractor={(item) => item.key}
          // keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        ></FlatList>
      );
    }
  };

  const directtocheckOut = async () => {
    try {
      const docRef = await addDoc(
        collection(db, "customers", auth.currentUser.uid, "checkout_sessions"),
        {
          price: "price_1KmRt2H0CaTAz4DNWslB5KvT",
          success_url: "https://stripe.com/",
          cancel_url: "https://stripe.com/",
        }
      );
      onSnapshot(docRef, (snap) => {
        const url = snap.get("url");
        // console.log(error);
        // if (error) {
        //   console.log(error);
        if (url) {
          WebBrowser.openBrowserAsync(url);
        }
      });

      // setButton(true);
    } catch (e) {
      alert(e);
    }
  };
  return <View style={{ flex: 1, marginTop: 20 }}>{showIsActive()}</View>;
};

export default PaymentScreen;

const styles = StyleSheet.create({});
