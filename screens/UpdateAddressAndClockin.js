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
import { db, auth, getCompanyAddress, addCompanyAddress } from "../firebase";
import InputBox from "../components/InputBox";
import MainButton from "../components/MainButton";
import { useSelector } from "react-redux";
import {
  selectCompany,
  selectUserSubscriptionStatus,
  selectCompanyID,
} from "../slices/globalSlice";

import IconButton from "../components/IconButton";
import { FontAwesome } from "@expo/vector-icons";

const UpdateAddressAndClockin = () => {
  const [allAddress, setAllAddress] = useState(null);
  const [address, setAddress] = useState(null);
  const company = useSelector(selectCompany);
  const [Delete, setDelete] = useState(false);
  const companyID = useSelector(selectCompanyID);
  const userSubscriptionStatus = useSelector(selectUserSubscriptionStatus);
  useEffect(() => {
    getCompanyAddress({
      companyID: companyID,
      setAddress: setAllAddress,
      company: company,
    });
  }, [companyID, company]);

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <InputBox
        color={"#7B3AF5"}
        placeholder={"Add New Address"}
        width={Dimensions.get("screen").width / 1.3}
        onChangeText={(text) => {
          setAddress(text);
        }}
        value={address}
      />
      <MainButton
        text={"Add"}
        buttonWidth={Dimensions.get("screen").width / 4}
        onPress={() => {
          addCompanyAddress({
            address: address,
            companyID: companyID,
            company: company,
          });
          setAddress(null);
          setDelete(false);
        }}
      />
      <FlatList
        style={{ flex: 1 }}
        data={allAddress}
        renderItem={({ item, circleColor }) => {
          // console.log("timeeeeeee stamp1 " + item.timesStamps);
          const showDelete = () => {
            if (Delete == false) {
              return (
                <TouchableOpacity
                  // onPress={() => {
                  //   setCompanyAddresslocal(item.address);
                  // }}
                  onLongPress={() => {
                    setDelete(true);
                  }}
                >
                  <View
                    style={{
                      marginVertical: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      shadowColor: "#000000EF",
                      shadowOffset: {
                        width: 0,
                        height: 8,
                      },
                      shadowOpacity: 0.44,
                      shadowRadius: 10.32,

                      // elevation: 16,
                      height: 70,
                      marginHorizontal: 30,
                      width: Dimensions.get("screen").width / 1.3,
                      backgroundColor:
                        Platform.OS == "ios" ? "#F0EFEF" : "#DEDDDD",
                      borderRadius: 20,
                      paddingHorizontal: 30,
                    }}
                  >
                    <Text>{item.address}</Text>
                    {/* <Text>{item.location}</Text>
                <Text>{item.time}</Text>
                <Text>{item.date}</Text> */}
                  </View>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  // onPress={() => {
                  //   setCompanyAddresslocal(item.address);
                  // }}
                  onLongPress={() => {
                    setDelete(false);
                  }}
                >
                  <View
                    style={{
                      marginVertical: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      shadowColor: "#000000EF",
                      shadowOffset: {
                        width: 0,
                        height: 8,
                      },
                      shadowOpacity: 0.44,
                      shadowRadius: 10.32,

                      // elevation: 16,
                      height: 70,
                      marginHorizontal: 30,
                      width: Dimensions.get("screen").width / 1.3,
                      backgroundColor: "#F0EFEF",
                      borderRadius: 20,
                      paddingHorizontal: 30,
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        flex: 0.7,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>{item.address}</Text>
                    </View>
                    <View
                      style={{
                        flex: 0.3,
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        buttonWidth={50}
                        color={"#FF0000"}
                        icon={
                          <FontAwesome name="trash-o" size={24} color="black" />
                        }
                        onPress={() => {
                          try {
                            deleteDoc(
                              doc(
                                db,
                                "companys",
                                company,
                                "address",
                                item.address
                              )
                            );
                          } catch (error) {
                            alert("Item not deleted " + error);
                          }
                        }}
                      ></IconButton>
                    </View>

                    {/* <Text>{item.location}</Text>
                <Text>{item.time}</Text>
                <Text>{item.date}</Text> */}
                  </View>
                </TouchableOpacity>
              );
            }
          };
          return <View>{showDelete()}</View>;
        }}
        key={(item) => item.key}
        keyExtractor={(item) => item.key}
        // keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      ></FlatList>
    </View>
  );
};

export default UpdateAddressAndClockin;

const styles = StyleSheet.create({});
