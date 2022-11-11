import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ManageTodo from "./screens/ManageTodo";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/longin";
import SignUp from "./screens/SignUp";
import UserOptionsScreen from "./screens/UserOptionsScreen";
import ClockinScreen from "./screens/ClockinScreen";
import MessageScreen from "./screens/MessageScreen";
import ChannelsScreen from "./screens/ChannelsScreen";
import TodoTaskPage from "./screens/TodoTaskPage";
import AddNewUserScreen from "./screens/AddNewUserScreen";
import { useSelector } from "react-redux";
import { selectAdminUsers } from "./slices/globalSlice";
import TimeSheet from "./screens/TimeSheet";
import YearTimeSheet from "./screens/YearTimeSheet";
import MonthTimeSheet from "./screens/MonthTimeSheet";
import DayTimeSheet from "./screens/DayTimeSheet";
import UpdateAddressAndClockin from "./screens/UpdateAddressAndClockin";
import PaymentScreen from "./screens/PaymentScreen";
import TimeTrackingScreen from "./screens/TimeTrackingScreen";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const golobalScreenOptions = {
  headerStyle: { backgroundColor: "#FFFFFF" },
  headerTitle: { color: "#121111" },
  headerTintColor: "black",
  headerShown: true,
  cardStyle: { backgroundColor: "#121111" },
};
const golobaldrawerOptions = {
  headerStyle: { backgroundColor: "#FFFFFF" },
  headerTitle: { color: "#121111" },
  headerTintColor: "black",
  headerShown: true,
  cardStyle: { backgroundColor: "#121111" },
};
const StackNavigator = () => {
  //   const { user } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={golobalScreenOptions}
      >
        <Stack.Screen
          name="User Options Screen"
          component={UserOptionsScreen}
        />
        <Stack.Screen name="Sign Up" component={SignUp} />
        <Stack.Screen
          name="HomeScreen"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Message Screen"
          component={MessageScreen}
          // options={{ headerShown: true }}
        />
        <Stack.Screen
          name="ToDo Screen"
          component={TodoTaskPage}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Month Time Screen"
          component={MonthTimeSheet}
          // options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Year Time Screen"
          component={YearTimeSheet}
          // options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Day Time Screen"
          component={DayTimeSheet}
          // options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Add New UserScreen"
          component={AddNewUserScreen}
          // options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Update Address And Clockin"
          component={UpdateAddressAndClockin}
          // options={{ headerShown: true }}
        />
        {/* <Stack.Screen
          name="Payment Screen"
          component={PaymentScreen}
          // options={{ headerShown: true }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function DrawerNavigator() {
  const admin = useSelector(selectAdminUsers);
  const ifAdmin = () => {
    if (admin == true) {
      return (
        <Drawer.Screen name="Time Screen" component={TimeTrackingScreen} />
      );
    } else {
      return null;
    }
  };
  return (
    // <NavigationContainer>
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={golobaldrawerOptions}
    >
      {/* <Drawer.Screen name="login" component={LoginScreen} /> */}
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Message" component={ChannelsScreen} />
      {/* <Drawer.Screen name="Manage To-do" component={ManageTodo} /> */}
      <Drawer.Screen name="Clock In screen" component={ClockinScreen} />
      {ifAdmin()}
      {/* <Drawer.Screen name="Sign Up" component={SignUp} /> */}
    </Drawer.Navigator>
    // </NavigationContainer>
  );
}
export default StackNavigator;
