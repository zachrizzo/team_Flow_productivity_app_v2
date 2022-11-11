import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Circle, Marker } from "react-native-maps";
import MainButton from "../components/MainButton";
import getDistance from "geolib/es/getPreciseDistance";
import * as TaskManager from "expo-task-manager";
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
  Timestamp,
  arrayUnion,
  FieldValue,
} from "firebase/firestore";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import {
  db,
  auth,
  clockInFunction,
  getClockIn,
  getClockOut,
  clockOutFunction,
  getClockInButtonState,
  getCompanyAddress,
  updateTotalHoursWorked,
} from "../firebase";
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
  selectDistance,
  selectClockinButtonState,
  setChannelID,
  setClockinButtonState,
  selectAdminUsers,
  selectCompanyID,
} from "../slices/globalSlice";
import { Feather } from "@expo/vector-icons";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInSeconds } from "date-fns";
import { async } from "@firebase/util";

// import { Marker } from "react-native-maps";

const ClockinScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latlocal, setlatlocal] = useState(null);
  const [longlocal, setLonglocal] = useState(null);
  const mapRef = useRef(null);
  const [distancelocal, setDistancelocal] = useState(null);
  const [timestamp, setTimeStamp] = useState(null);
  const [companyAddresslocal, setCompanyAddresslocal] = useState(null);
  const [workLocationLonglocal, setWorkLocationLonglocal] =
    useState(40.7793003942141);
  const [workLocationLatlocal, setWorkLocationLatlocal] =
    useState(-73.96709534550818);
  const company = useSelector(selectCompany);
  const time = useSelector(selectTime1);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(1);
  const distance = useSelector(selectDistance);
  const fulldate = useSelector(selectDate);
  const companyAddress = useSelector(selectCompanyAddress);
  const lat = useSelector(selectLat);
  const long = useSelector(selectLong);
  const workLocationLat = useSelector(selectWorkLat);
  const workLocationLong = useSelector(selectWorkLong);
  const [button, setButton] = useState(false);
  const [minutesConverted, setminutesConverted] = useState(null);
  const currentDate = new Date();
  const dateInMM = Date.now();
  const companyID = useSelector(selectCompanyID);

  //  const s= Mon Mar 28 2022 11:33:53
  //  const e= Mon Mar 28 2022 11:33:53

  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const min = currentDate.getMinutes();
  const year = currentDate.getFullYear();
  const clockinButtonStateGolbal = useSelector(selectClockinButtonState);
  const fullDate = month + "/" + day;
  const monthsDays = day.toString();
  const hoursToString = hours.toString();
  const [todaysHours, setTodaysHours] = useState(null);
  const [todaysMin, setTodaysMin] = useState(null);
  const appState = useRef(AppState.currentState);
  const [elapsed, setElapsed] = useState(0);
  const [clockinButtonstate, setClockinButtonstate] = useState(true);
  const [clockinButtonstate2, setClockinButtonstate2] = useState(false);
  const [clockOutState, setClockOutState] = useState(true);
  const [pickCompanyWork, setPickCompanyWork] = useState(null);
  const adminUser = useSelector(selectAdminUsers);
  const [modalVisible, setModalVisible] = useState(false);
  const [clockIn, setClockIn] = useState([]);
  const [clockOut, setClockOut] = useState([]);
  const [clockOutButtonFunctionCaller, setClockOutButtonFunctionCaller] =
    useState(false);
  // useEffect(async () => {
  //   const getstate = await getDoc(
  //     doc(
  //       db,
  //       "companys",
  //       company,
  //       "clockIn",
  //       auth.currentUser.email,
  //       "year",
  //       year.toString(),
  //       "month",
  //       month.toString(),
  //       "day",
  //       day.toString()
  //     )
  //   );
  //   (data) => {
  //     try {
  //       const data = getstate.data();
  //       const bs = data.buttonState;

  //       var clockOutArray = JSON.stringify(data.clockOut);

  //       const allTimeWorkedArray = [];
  //       var sum = 0;
  //       const IN = data.clockIn;
  //       const Out = data.clockOut;
  //       // console.log("IN", IN);
  //       // console.log("Out", Out);
  //       data.clockOut.forEach((itemout, index) => {
  //         //var hours = Math.floor((itemout - IN[index]) / 1000 / 60 / 60);
  //         var minutes = (itemout - IN[index]) / 1000 / 60;
  //         var seconds = (itemout - IN[index]) / 1000;

  //         allTimeWorkedArray.push(minutes);
  //       });
  //       data.clockIn.forEach((itemin) => {});
  //       var allmin = 0;
  //       allTimeWorkedArray.forEach((item) => {
  //         allmin = sum += item;
  //       });
  //       console.log(allmin);
  //       const allminmath = allmin / 60;
  //       const allminround = Math.round(1000 * allminmath) / 1000;
  //       setminutesConverted(allminround);

  //       if (bs === false) {
  //         // dispatch(setClockinButtonState(false));
  //         setClockinButtonstate(false);
  //       } else if (bs === true) {
  //         setClockinButtonstate(true);
  //       }

  //       // console.log(clockinButtonstate);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   // }
  //   // );
  //   // return () => { cle
  //   //   getstate();
  //   // };
  // }, [clockOutState, clockinButtonstate]);

  //useEffect to detect button state
  useEffect(() => {
    getClockInButtonState({
      company: company,
      setClockinButtonState: setClockinButtonstate,
      companyID: companyID,

      //alert(clockinButtonstate);
    });
  }, [clockOutState, distancelocal]);

  useEffect(() => {
    getClockOut({
      setClockOut: setClockOut,
      company: company,
      companyID: companyID,
    });
    getClockIn({
      setClockIn: setClockIn,
      company: company,
      companyID: companyID,
    });
  }, [clockOutState, clockinButtonstate, clockinButtonstate2]);

  useEffect(() => {
    const findtheDifferenceBetweenTimeStamps = async () => {
      var allDifference = [];

      clockIn.forEach((item, index) => {
        //find the difference between the two timestamps
        var clockInSeconds = item.seconds;

        console.log(clockOut[index].seconds);

        var difference = clockOut[index].seconds - clockInSeconds;
        console.log("difference", difference);

        allDifference.push(difference);
      });

      var sum = 0;
      allDifference.forEach((item) => {
        sum += item;
      });

      //round the hours to 3 decimal places
      // convert sec to hours

      const hours = sum / 3600;
      console.log("hours", hours);
      const hoursRounded = Math.round(1000 * hours) / 1000;
      setminutesConverted(hoursRounded);
      console.log(hoursRounded);
      allDifference = [];
    };

    return () => {
      try {
        findtheDifferenceBetweenTimeStamps();
      } catch (error) {
        alert(error);
      }
    };
  }, [
    clockOutState,
    clockinButtonstate,
    clockOut,
    clockOutButtonFunctionCaller,
  ]);

  useEffect(() => {
    updateTotalHoursWorked({
      companyID: companyID,
      totalHoursToday: minutesConverted,
    });
  }, [minutesConverted]);

  useEffect(() => {
    // const theTime = () => {
    if (hours > 12) {
      const todayHoursOverTwelve = hours - 12;
      const todayHoursOverTwelveString = todayHoursOverTwelve.toString();
      // console.log("OVER 12 " + todayHoursOverTwelveString);
      setTodaysHours(todayHoursOverTwelveString);
      setTodaysHours(todayHoursOverTwelveString);
    } else setTodaysHours(hoursToString);
    if (min < 10) {
      setTodaysMin(0 + "" + min);
    } else if (min > 10) {
      setTodaysMin(min);
    }
    // };

    // return () => {
    //   theTime();
    // };
  }, [button]);
  const showClockInSettings = () => {
    if (adminUser == true) {
      return (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Update Address And Clockin")}
          >
            {/* <Avatar rounded source = {{uri: auth?.currentUser.photoURL}}/> */}
            <Feather name="settings" size={24} color="black" />
          </TouchableOpacity>
        </View>
      );
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Clock In",

      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            {/* <Avatar rounded source = {{uri: auth?.currentUser.photoURL}}/> */}
            <FontAwesome name="bars" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ),

      headerRight: () => <View>{showClockInSettings()}</View>,
    });
  }, []);
  useEffect(() => {
    getCompanyAddress({
      company: company,
      companyID: companyID,
      setAddress: setPickCompanyWork,
    });
  }, [button]);
  var completedate = month.toString() + "/" + day.toString();

  const completedatestring = completedate.toString();

  useEffect(() => {
    const ll = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setModalVisible(true);

        return;
      }
      //try {
      let location = await Location.getCurrentPositionAsync();

      let location1 = await Location.geocodeAsync(companyAddresslocal);

      // console.log("hi" + location1);
      // console.log("hi");
      const obj = location1[0];
      // const objLocation = JSON.stringify(obj);
      // const objLocation1 = JSON.stringify(objLocation);
      // console.log(objLocation);
      // dispatch(setWorkLat(JSON.stringify(obj.latitude)));
      // dispatch(setWorkLong(JSON.stringify(obj.longitude)));
      await setWorkLocationLatlocal(JSON.stringify(obj.latitude));
      await setWorkLocationLonglocal(JSON.stringify(obj.longitude));
      // console.log("workLat " + workLocationLatlocal);
      // console.log("worklong " + workLocationLonglocal);

      // dispatch(setLocation(location));
      // console.log(location);
      // dispatch(setLat(JSON.stringify(location.coords.latitude)));
      // dispatch(setLong(JSON.stringify(location.coords.longitude)));
      await setlatlocal(JSON.stringify(location.coords.latitude));
      await setLonglocal(JSON.stringify(location.coords.longitude));
      // console.log(latlocal + " space " + longlocal);

      const distance = await getDistance(
        {
          latitude: JSON.stringify(location.coords.latitude),
          longitude: JSON.stringify(location.coords.longitude),
        },
        {
          latitude: JSON.stringify(obj.latitude),
          longitude: JSON.stringify(obj.longitude),
        }
      );

      // dispatch(setDistance(distance));
      setDistancelocal(distance);
      // console.log("d " + distance);
      setButton(false);
      // } catch (e) {
      //   alert(e + companyAddresslocal);
      // }
    };

    return () => {
      ll();
    };
  }, [companyAddresslocal, button]);

  let text = "Waiting..";

  if (distancelocal <= 100) {
    text = "clock In";
    // setClockInTime();
  } else text = "get to work";

  const showTextandButton = () => {
    if (button == true) {
      return (
        <Text style={{ alignSelf: "center" }}>...caculating distance</Text>
      );
    } else if (distancelocal != null) return null;
  };
  const clockINButton = () => {
    if (distancelocal == null) {
      return null;
    } else {
      if (distancelocal <= 100) {
        if (clockinButtonstate == true) {
          return (
            <MainButton
              text={"Clock In "}
              onPress={async () => {
                // setClockinButtonstate(false, [
                //   () => {
                try {
                  clockInFunction({
                    setTodaysMin: setTodaysMin,
                    company: company,
                    companyID: companyID,
                    companyAddresslocal: companyAddresslocal,
                    todaysHours: todaysHours,
                    todaysMin: todaysMin,
                    clockinButtonstate2: clockinButtonstate2,
                    minutesConverted: minutesConverted,
                    setClockinButtonstate2: setClockinButtonstate2,
                    setTodaysMin: setTodaysMin,
                    setClockinButtonstate: setClockinButtonstate,
                  });
                } catch (e) {
                  alert(e);
                  // console.log(clockinButtonStateGolbal);
                }
              }}
              buttonWidth={200}
            ></MainButton>
          );
        } else if (distancelocal <= 10000000000) {
          if (clockinButtonstate == false) {
            return (
              <MainButton
                text={"Clock out "}
                onPress={async () => {
                  //update the minutesConverted before clocking out
                  try {
                    clockOutFunction({
                      setTodaysMin: setTodaysMin,
                      company: company,
                      companyAddresslocal: companyAddresslocal,
                      todaysHours: todaysHours,
                      todaysMin: todaysMin,
                      clockinButtonstate2: clockinButtonstate2,
                      minutesConverted: minutesConverted,
                      setClockinButtonstate2: setClockinButtonstate2,
                      setTodaysMin: setTodaysMin,
                      setClockinButtonstate: setClockinButtonstate,
                      setClockOutState: setClockOutState,
                      clockOutState: clockOutState,
                      companyID: companyID,
                    });
                  } catch (e) {
                    alert(e);
                    // console.log(clockinButtonStateGolbal);
                  }
                  // setClockOutButtonFunctionCaller(true);
                }}
                buttonWidth={200}
              ></MainButton>
            );
          }
        } else {
          return (
            <Text style={{ alignSelf: "center", textAlign: "center" }}>
              You are not close enough to clock out, please get closer and try
              again
            </Text>
          );
        }
      } else {
        return (
          <Text style={{ alignSelf: "center", textAlign: "center" }}>
            You are not close enough to clock in, please get closer and try
            again
          </Text>
        );
      }
    }
  };

  const showDistanceButton = () => {
    if (companyAddresslocal == null) {
      return (
        <View style={{ margin: 20 }}>
          <Text style={{ textAlign: "center", fontSize: 28 }}>
            Pick the location you want to clock into.
          </Text>
        </View>
      );
    } else {
      return (
        <MainButton
          text={"get distance"}
          onPress={() => {
            if (button == false) {
              setButton(true);
            }
            // else if (button == true) {
            //   setButton(false);
            // }
          }}
          buttonWidth={200}
        ></MainButton>
      );
    }
  };
  const regionChangeCompleteHandler = async () => {
    console.log(
      await mapRef.current?.addressForCoordinate({
        latitude: lat,
        longitude: long,
      })
    );
  };
  const showDistance = () => {
    if (distancelocal != null) {
      return (
        <Text style={{ margin: 8, alignSelf: "center" }}>
          You are {distancelocal}m away from work
        </Text>
      );
    } else {
      return null;
    }
  };
  const showHoursWorked = () => {
    if (minutesConverted == null || minutesConverted == 0) {
      return null;
    } else if (clockinButtonstate == true) {
      return (
        <Text style={{ margin: 5, alignSelf: "center" }}>
          You have worked {minutesConverted}h today
        </Text>
      );
    }
  };
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Plaese grant Permission for Location services, they will be used
              to see how far you are from the work location so you will be able
              to clockin for work.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
      <View
        style={{
          borderRadius: 20,

          alignSelf: "center",
          // alignContent: "center",
          flex: 1,
          margin: 20,
        }}
      >
        <MapView
          ref={mapRef}
          showsUserLocation={true}
          followsUserLocation={true}
          userLocationCalloutEnabled={true}
          onPress={(e) => console.log(e.nativeEvent)}
          onUserLocationChange={(e) => {
            // console.log(e.nativeEvent.coordinate.location);
          }}
          userInterfaceStyle={"dark"}
          showsMyLocationButton={true}
          // addressForCoordinate={{ coordinate: LatLng }}
          style={styles.map}
          // region={{
          //   latitude: workLocationLatlocal,
          //   longitude: workLocationLonglocal,
          //   latitudeDelta: 0.005,
          //   longitudeDelta: 0.005,
          // }}
          // provider={PROVIDER_GOOGLE}
        >
          {/* <Marker
            title="Work"
            coordinate={{
              latitude: workLocationLatlocal,
              longitude: workLocationLonglocal,
            }}
          />
          <Circle
            center={{
              latitude: workLocationLatlocal,
              longitude: workLocationLonglocal,
            }}
            radius={50}
            strokeWidth={3}
          /> */}
        </MapView>
        <Text style={{ margin: 5, alignSelf: "center", textAlign: "center" }}>
          company ID: {companyID}
          {"\n"} company name: {company}
        </Text>
        {showDistance()}
        {showHoursWorked()}
        {showDistanceButton()}
        <View style={{ margin: 15 }}>{showTextandButton()}</View>
        <View>{clockINButton()}</View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // justifyContent: "center",
          }}
        ></View>
      </View>

      <View
        style={{
          flex: 0.5,
          backgroundColor: "#B4B2B2",
          borderRadius: 30,
          width: Dimensions.get("screen").width / 1.1,
          marginBottom: 35,
          alignItems: "center",
        }}
      >
        <FlatList
          style={{ flex: 1 }}
          data={pickCompanyWork}
          renderItem={({ item, circleColor }) => {
            // console.log("timeeeeeee stamp1 " + item.timesStamps);
            if (companyAddresslocal == item.address) {
              return (
                <TouchableOpacity
                  onPress={async () => {
                    // make item blue when selected

                    await setCompanyAddresslocal(item.address);
                    // await alert(companyAddresslocal);
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
                      backgroundColor: "#C8ABFD",
                      borderRadius: 20,
                      paddingHorizontal: 30,
                    }}
                  >
                    <Text style={{ color: "#ffffff" }}>{item.address}</Text>
                    {/* <Text>{item.location}</Text>
                <Text>{item.time}</Text>
                <Text>{item.date}</Text> */}
                  </View>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={async () => {
                    // make item blue when selected

                    await setCompanyAddresslocal(item.address);
                    // await alert(companyAddresslocal);
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
                    }}
                  >
                    <Text>{item.address}</Text>
                    {/* <Text>{item.location}</Text>
                <Text>{item.time}</Text>
                <Text>{item.date}</Text> */}
                  </View>
                </TouchableOpacity>
              );
            }
          }}
          key={(item) => item.address}
          keyExtractor={(item) => item.address}
          // keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        ></FlatList>
      </View>

      {/* );
        }}
        key={(item) => item.key}
        keyExtractor={(item) => item.key}
        // keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      ></FlatList> */}
    </View>
  );
};

export default ClockinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    // flex: 1,
    width: Dimensions.get("screen").width / 1.5,
    height: 200,
    borderRadius: 20,
    alignSelf: "center",
    // overflow: "hidden",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#7B3AF5",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
