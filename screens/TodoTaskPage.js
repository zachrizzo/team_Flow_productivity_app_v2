import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
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
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db, auth, getCompanyID } from "../firebase";
import { useSelector } from "react-redux";
import {
  selectCompany,
  selectTaskID,
  setCompanyID,
} from "../slices/globalSlice";
import LineBorder from "../components/LineBorder";
import { FontAwesome5 } from "@expo/vector-icons";
import { hasStartedLocationUpdatesAsync } from "expo-location";
import InputBox from "../components/InputBox";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import MainButton from "../components/MainButton";

const TodoTaskPage = () => {
  const company = useSelector(selectCompany);
  const [taskinfo, setTaskInfo] = useState(null);
  const taskID = useSelector(selectTaskID);
  const [edit, setEdit] = useState(false);
  const [update, setUpdate] = useState(false);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [companyId, setCompanyId] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Home",

      headerRight: () => (
        <View style={{ marginRight: 20, flexDirection: "row" }}>
          <TouchableOpacity
            onPress={async () => {
              if (edit == false) {
                setEdit(true);
              } else {
                setEdit(false);
              }
            }}
          >
            {/* <Avatar rounded source = {{uri: auth?.currentUser.photoURL}}/> */}
            <View style={{ flex: 0.5 }}>
              <AntDesign name="edit" size={24} color="black" />
            </View>
            <View style={{ flex: 0.5 }}>
              <Text>Edit</Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [edit]);
  useEffect(() => {
    return () => {
      getCompanyID({
        setCompanyId: setCompanyId,
        company: company,
        dispatch: dispatch,
      });
    };
  }, []);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "tasks"), where("taskID", "==", taskID)),
      (querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((snap) => {
          tasks.push(snap.data());
          // key: snap.id;
        });
        // console.log(tasks);
        setTaskInfo(tasks);
      }
    );
  }, [update, edit]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        data={taskinfo}
        renderItem={({ item, circleColor }) => {
          const edittrue = () => {
            const importanceconst = item.importance;
            if (importanceconst == 10) {
              circleColor = "#FF0000";
            }
            if (importanceconst == 9) {
              circleColor = "#FF5E00";
            }
            if (importanceconst == 8) {
              circleColor = "#FF8800";
            }
            if (importanceconst == 7) {
              circleColor = "#FFA600";
            }
            if (importanceconst == 6) {
              circleColor = "#FFC400";
            }
            if (importanceconst == 5) {
              circleColor = "#FFFB00";
            }
            if (importanceconst == 4) {
              circleColor = "#E5FF00";
            }
            if (importanceconst == 3) {
              circleColor = "#C3FF00";
            }
            if (importanceconst == 2) {
              circleColor = "#A6FF00";
            }
            if (importanceconst == 1) {
              circleColor = "#48FF00";
            }
            if (edit == true) {
              return (
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 0.3 }}>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flex: 0.5, margin: 5 }}>
                        <InputBox
                          placeholder={item.name}
                          color={"#7B3AF5"}
                          width={Dimensions.get("screen").width / 10}
                          onChangeText={(text) => {
                            setName(text);
                          }}
                        />
                      </View>
                      <View style={{ flex: 0.5, margin: 5 }}>
                        <LineBorder width={300} color={"#7B3AF5"} />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      // backgroundColor: "#903D3D",
                      margin: 20,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ textAlign: "center", fontSize: 18 }}>
                      Description:
                    </Text>
                    <InputBox
                      placeholder={item.description}
                      color={"#7B3AF5"}
                      width={Dimensions.get("screen").width / 1.2}
                      onChangeText={(text) => {
                        setDescription(text);
                      }}
                    />
                  </View>
                  <View style={{ flex: 0.2, alignItems: "center" }}>
                    <Text style={{ textAlign: "center", fontSize: 30 }}>
                      Importance:{"\n"}
                      {item.importance}
                    </Text>
                    <View
                      style={{
                        borderRadius: 80,
                        backgroundColor: circleColor,
                        width: 60,
                        height: 60,
                        margin: 30,
                      }}
                    ></View>
                    <View>
                      <TouchableOpacity
                        style={{ margin: 12 }}
                        onPress={async () => {
                          try {
                            if (update == false) {
                              setUpdate(true);
                            } else {
                              setUpdate(false);
                            }

                            await setDoc(
                              doc(db, "tasks", item.taskID),
                              {
                                importance: increment(1),
                              },
                              { merge: true }
                            );
                          } catch (error) {
                            alert(error);
                            console.log("i got an error ${error}");
                          }
                        }}
                      >
                        <FontAwesome5 name="arrow-up" size={38} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ margin: 12 }}
                        onPress={async () => {
                          try {
                            if (update == false) {
                              setUpdate(true);
                            } else {
                              setUpdate(false);
                            }

                            await setDoc(
                              doc(db, "tasks", item.taskID),
                              {
                                importance: increment(-1),
                              },
                              { merge: true }
                            );
                          } catch (error) {
                            alert(error);
                            console.log("i got an error ${error}");
                          }
                        }}
                      >
                        <FontAwesome5
                          name="arrow-down"
                          size={38}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                    <MainButton
                      text={"update"}
                      buttonWidth={Dimensions.get("screen").width / 2.8}
                      onPress={async () => {
                        if (edit == false) {
                          setEdit(true);
                        } else {
                          setEdit(false);
                        }
                        if (update == false) {
                          setUpdate(true);
                        } else {
                          setUpdate(false);
                        }

                        try {
                          await setDoc(
                            doc(db, "tasks", item.taskID),
                            { name: name, description: description },
                            { merge: true }
                          );
                        } catch (error) {
                          alert(error);
                          console.log("i got an error ${error}");
                        }
                      }}
                    />
                  </View>
                </View>
              );
            } else
              return (
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 0.3 }}>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flex: 0.5, margin: 5 }}>
                        <Text style={{ textAlign: "center", fontSize: 30 }}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={{ flex: 0.5, margin: 5 }}>
                        <LineBorder width={300} color={"#7B3AF5"} />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      // backgroundColor: "#903D3D",
                      margin: 20,
                    }}
                  >
                    <Text style={{ textAlign: "center", fontSize: 18 }}>
                      Description: {"\n"}
                      {item.description}
                    </Text>
                  </View>
                  <View style={{ flex: 0.2, alignItems: "center" }}>
                    <Text style={{ textAlign: "center", fontSize: 30 }}>
                      Importance:{"\n"}
                      {item.importance}
                    </Text>
                    <View
                      style={{
                        borderRadius: 80,
                        backgroundColor: circleColor,
                        width: 60,
                        height: 60,
                        margin: 30,
                      }}
                    ></View>
                    <View>
                      <TouchableOpacity
                        style={{ margin: 12 }}
                        onPress={async () => {
                          try {
                            if (update == false) {
                              setUpdate(true);
                            } else {
                              setUpdate(false);
                            }

                            await setDoc(
                              doc(db, "tasks", item.taskID),
                              {
                                importance: increment(1),
                              },
                              { merge: true }
                            );
                          } catch (error) {
                            alert(error);
                            console.log("i got an error ${error}");
                          }
                        }}
                      >
                        <FontAwesome5 name="arrow-up" size={38} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ margin: 12 }}
                        onPress={async () => {
                          try {
                            if (update == false) {
                              setUpdate(true);
                            } else {
                              setUpdate(false);
                            }

                            await setDoc(
                              doc(db, "tasks", item.taskID),
                              {
                                importance: increment(-1),
                              },
                              { merge: true }
                            );
                          } catch (error) {
                            alert(error);
                            console.log("i got an error ${error}");
                          }
                        }}
                      >
                        <FontAwesome5
                          name="arrow-down"
                          size={38}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
          };
          return <View style={{ flex: 1 }}>{edittrue()}</View>;
        }}
      />
    </View>
  );
};

export default TodoTaskPage;

const styles = StyleSheet.create({});
