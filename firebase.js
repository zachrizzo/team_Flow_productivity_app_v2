// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// https://firebase.google.com/docs/web/setup#available-libraries
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
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
  setTaskID,
  setAdminUsers,
  setClockinButtonState,
  selectClockinButtonState,
  selectUserSubscriptionStatus,
  setUserSubscriptionStatus,
  setCompanySubscriptionStatus,
  selectCompanySubscriptionStatus,
  setTrial,
  setCompanyID,
} from "./slices/globalSlice";
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
  arrayUnion,
} from "firebase/firestore";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGAsPfxD6ND0JVLKuSY6nVTJbLLpgVLdY",
  authDomain: "task-manager-2-9a235.firebaseapp.com",
  projectId: "task-manager-2-9a235",
  storageBucket: "task-manager-2-9a235.appspot.com",
  messagingSenderId: "1003484984079",
  appId: "1:1003484984079:web:a02996d46d3107a5b8047a",
};
const randomNumberTaskId = Math.random() * 1000000 + 1;
const randomnumberString = randomNumberTaskId.toString();
// const dispatch = useDispatch();
// const company = useSelector(selectCompany);
const currentDate = new Date();
const dateInMM = Date.now();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();
const hours = currentDate.getHours();
const min = currentDate.getMinutes();
const year = currentDate.getFullYear();
const fullDate = month + "/" + day;
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export function getActive({ setIsActive }) {
  try {
    onSnapshot(
      collection(db, "customers", auth.currentUser.uid, "subscriptions"),
      where("status", "in", ["trialing", "active"]),
      (querySnapshot) => {
        const all = [];
        const doc = querySnapshot.docs[0];
        if (doc) {
          //   console.log(doc.id, " => ", doc.get("status"));
          setIsActive(doc.get("status"));
          //useDispatch(setUserSubscriptionStatus(doc.get("status")));
        }
      }
    );
  } catch (e) {
    alert(e + "your account is no longer active");
  }
}

export async function addNewTask({
  description,
  title,
  importance,
  todaysHours,
  todaysMin,
  company,
  companyID,
  fulldate,
  randomnumberString,
  team,
  teamID,
}) {
  try {
    await setDoc(
      doc(db, "tasks", randomnumberString),
      {
        description: description,
        name: title,
        importance: parseInt(importance),
        lastUpdateTime: todaysHours + ":" + todaysMin,
        lastUpdateDate: fulldate,
        company: company,
        companyID: companyID,
        taskID: randomnumberString,
        randomnumberString: randomnumberString,
        timestamp: serverTimestamp(),
        team: team,
        teamID: teamID,
      },
      { merge: true }
    );
  } catch (error) {
    alert("Please make sure you fill all fields ");
    console.log(error);
  }
}
export function getCompany({ setCompanyDB, dispatchCompany }) {
  onSnapshot(doc(db, "users", auth.currentUser.email), (doc) => {
    // setCompanyDB(doc.get("company"));
    dispatchCompany(setCompany(doc.get("company")));
    setCompanyDB(doc.get("company"));
    //setCompanyFireBase(doc.get("company"));
  });
}
//TODO:fix this
export function getTasks({ setTasks, companyID, teamID, team }) {
  onSnapshot(
    query(
      collection(db, "tasks"),
      where("companyID", "==", companyID),
      where("teamID", "==", teamID),
      orderBy("importance", "desc")
    ),
    (querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((snap) => {
        tasks.push(snap.data());
        // key: snap.id;
      });
      // console.log(tasks);
      setTasks(tasks);
    }
  );
}
export function checkadminUsers({
  company,
  companyID,
  dispatchAdminUsers,
  setAdminUsers,
}) {
  onSnapshot(
    doc(db, "companys", companyID),
    where("companyID", "array-contains", companyID),

    (doc) => {
      const adminlist = doc.get("adminUsers");
      try {
        adminlist.forEach((item) => {
          try {
            if (auth.currentUser.email == item) {
              dispatchAdminUsers(setAdminUsers(true));
              console.log(" is admin");
            }
          } catch (error) {
            console.long("not admin " + error);
          }
        });
      } catch (e) {
        console.log(e);
      }
      // console.log(adminlist);
    }
  );
}

export function deleteTask({ task }) {
  try {
    deleteDoc(doc(db, "tasks", task));
  } catch (error) {
    alert("Item not deleted " + error);
  }
}
export async function clockInFunction({
  setTodaysMin,
  company,
  companyAddresslocal,
  todaysHours,
  todaysMin,
  companyID,
  clockinButtonstate2,
  minutesConverted,
  setClockinButtonstate2,
  setClockinButtonstate,
}) {
  try {
    // if (button == false) {
    //   setButton(true);
    // } else if (button == true) {
    //   setButton(false);
    // }
    if (min < 10) {
      setTodaysMin(0 + "" + min);
    } else if (min > 10) {
      setTodaysMin(min);
    }

    await setDoc(
      doc(db, "companys", companyID, "clockIn", auth.currentUser.email),
      { email: auth.currentUser.email, company: company, companyID: companyID },

      { merge: true }
    )
      .then(async () => {
        await setDoc(
          doc(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString()
          ),
          { year: year.toString(), company: company, companyID: companyID },
          { merge: true }
        );
      })
      .then(async () => {
        await setDoc(
          doc(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString(),
            "month",
            month.toString()
          ),
          { month: month.toString(), company: company, companyID: companyID },
          { merge: true }
        );
      })
      .then(async () => {
        await setDoc(
          doc(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString(),
            "month",
            month.toString(),
            "day",
            day.toString()
          ),
          { day: day.toString(), company: company, companyID: companyID },
          { merge: true }
        );
      })
      .then(async () => {
        // useDispatch()(setClockinButtonState(true));
        await setClockinButtonstate2(true);
        await setClockinButtonstate(false);
      })
      .then(async () => {
        // if (button == false) {
        //   setButton(true);
        // } else if (button == true) {
        //   setButton(false);
        // }
        if (min < 10) {
          setTodaysMin(0 + "" + min);
        } else if (min > 10) {
          setTodaysMin(min);
        }

        await setDoc(
          doc(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString(),
            "month",
            month.toString(),
            "day",
            day.toString()
          ),
          {
            // description: description,

            location: companyAddresslocal,
            clockIn: arrayUnion(dateInMM),
            email: auth.currentUser.email,
            dateInMM: dateInMM,
            date: fullDate,
            time: todaysHours + ":" + todaysMin,
            timestampIn: serverTimestamp(),
            buttonState: false,
            totalHoursToday: minutesConverted,
            company: company,
            companyID: companyID,
          },
          { merge: true }
        );
      })
      .then(async () => {
        await addDoc(
          collection(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString(),
            "month",
            month.toString(),
            "day",
            day.toString(),
            "clockIn"
          ),
          {
            // description: description,
            clockIn: serverTimestamp(),
            company: company,
            companyID: companyID,
          },
          { merge: true }
        );
      });
    // .then(() => {
    //   setClockinButtonstate(false);
    // });
  } catch (error) {
    alert(error);
    console.log("i got an error ${error}");
  }
}
export async function addNewChannel({
  userList,
  dispatch,
  setAllRecipreants,
  setNewChannel,
  setRecipients,
  setDeleteChannel,
  channels,
  newChannel,
  setChannelID,
  item,
  company,
  setUserList,
  companyID,
}) {
  try {
    if (userList != null) {
      const randomNumberChannelId = Math.random() * 1000000 + 1;
      const randomnumberString = randomNumberChannelId.toString();
      dispatch(setChannelID(randomnumberString));
      console.log(randomNumberChannelId);

      try {
        if (channels == newChannel) {
          console.log("yes");
        }
        await setDoc(
          doc(
            db,
            "users",
            auth.currentUser.email,
            "channels",
            randomnumberString
          ),
          {
            channel: newChannel,
            timestamp: serverTimestamp(),
            channelID: randomNumberChannelId,
            channelIDstring: randomnumberString,
            company: company,
            companyID: companyID,
          },
          { merge: true }
        )
          .then(async () => {
            setDoc(
              doc(db, "channels", randomnumberString),
              {
                users: arrayUnion(auth.currentUser.email),

                channel: newChannel,
                timestamp: serverTimestamp(),
                channelID: randomNumberChannelId,
                channelIDstring: randomnumberString,
                company: company,
                companyID: companyID,
              },
              { merge: true }
            );
          })
          .then(async () => {
            userList.forEach((item) => {
              setDoc(
                doc(db, "channels", randomnumberString),
                {
                  users: arrayUnion(item.email),
                  company: company,
                  companyID: companyID,
                },
                { merge: true }
              );
            });
          })

          .then(async () => {
            setDoc(
              doc(db, "users", auth.currentUser.email),
              {
                channels: arrayUnion(randomnumberString),
                company: company,
                companyID: companyID,
              },
              { merge: true }
            );
          })
          .then(() => {
            setUserList([]);
            setAllRecipreants(null);
            setNewChannel(null);
            setRecipients(null);
            setDeleteChannel(false);
          });
      } catch (error) {
        alert(error);
        console.log("i got an error ${error}");
      }
    } else {
      alert(
        "make sure recipients isn't empty and that your using a correct email"
      );
    }
  } catch (error) {
    alert("recipients can't be empty" + error);
  }
}
export async function clockOutFunction({
  setTodaysMin,
  company,
  companyAddresslocal,
  todaysHours,
  todaysMin,
  clockinButtonstate2,
  minutesConverted,
  setClockinButtonstate2,
  setClockinButtonstate,
  setClockOutState,
  clockOutState,
  companyID,
}) {
  try {
    // if (button == false) {
    //   setButton(true);
    // } else if (button == true) {
    //   setButton(false);
    // }
    if (min < 10) {
      setTodaysMin(0 + "" + min);
    } else if (min > 10) {
      setTodaysMin(min);
    }

    await setDoc(
      doc(db, "companys", companyID, "clockIn", auth.currentUser.email),
      {
        email: auth.currentUser.email,
        company: company,
        companyID: companyID,
        totalHoursToday: minutesConverted,
      },
      { merge: true }
    )
      .then(async () => {
        await setDoc(
          doc(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString()
          ),
          {
            year: year.toString(),
            company: company,
            companyID: companyID,
            totalHoursToday: minutesConverted,
          },
          { merge: true }
        );
      })
      .then(async () => {
        await setDoc(
          doc(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString(),
            "month",
            month.toString()
          ),
          {
            month: month.toString(),
            company: company,
            companyID: companyID,
            totalHoursToday: minutesConverted,
          },
          { merge: true }
        );
      })
      .then(async () => {
        await setDoc(
          doc(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString(),
            "month",
            month.toString(),
            "day",
            day.toString()
          ),
          {
            day: day.toString(),
            company: company,
            companyID: companyID,
            totalHoursToday: minutesConverted,
          },
          { merge: true }
        );
      })
      .then(async () => {
        // dispatch(setClockinButtonState(false));
        await setClockinButtonstate(true);
        await setClockinButtonstate2(false);
        await setClockOutState(!clockOutState);
      })

      .then(async () => {
        // if (button == false) {
        //   setButton(true);
        // } else if (button == true) {
        //   setButton(false);
        // }
        if (min < 10) {
          setTodaysMin(0 + "" + min);
        } else if (min > 10) {
          setTodaysMin(min);
        }

        await setDoc(
          doc(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString(),
            "month",
            month.toString(),
            "day",
            day.toString()
          ),
          {
            // description: description,

            location: companyAddresslocal,
            clockOut: arrayUnion(dateInMM),
            email: auth.currentUser.email,
            dateInMM: dateInMM,
            date: fullDate,
            time: todaysHours + ":" + todaysMin,
            timestampOut: serverTimestamp(),
            companyID: companyID,
            buttonState: true,
            totalHoursToday: minutesConverted,
          },
          { merge: true }
        );
      })
      .then(async () => {
        await addDoc(
          collection(
            db,
            "companys",
            companyID,
            "clockIn",
            auth.currentUser.email,
            "year",
            year.toString(),
            "month",
            month.toString(),
            "day",
            day.toString(),
            "clockOut"
          ),
          {
            clockOut: serverTimestamp(),
            company: company,
            companyID: companyID,
          },
          { merge: true }
        );
      });

    // .then(() => {
    //   setClockinButtonstate(true);
    // });
  } catch (error) {
    alert(error);
    console.log("i got an error ${error}");
  }
}
export function getAllUsersInCompany({ companyID, setAllUsers }) {
  onSnapshot(
    query(collection(db, "users"), where("companyID", "==", companyID)),
    (querySnapshot) => {
      const allUsers = [];
      querySnapshot.forEach((snap) => {
        allUsers.push(snap.data());
        // key: snap.id;
      });

      setAllUsers(allUsers);
    }
  );
}
export function getListOfChannels({ setChannels }) {
  onSnapshot(
    query(
      collection(db, "channels"),
      where("users", "array-contains", auth.currentUser.email),
      orderBy("timestamp", "desc")
    ),
    (querySnapshot) => {
      const channels = [];
      querySnapshot.forEach((snap) => {
        channels.push(snap.data());
        // key: snap.id;
      });
      // console.log(channels);
      setChannels(channels);
    }
  );
}
export function getClockIn({ setClockIn, company, companyID }) {
  try {
    onSnapshot(
      query(
        collection(
          db,
          "companys",
          companyID,
          "clockIn",
          auth.currentUser.email,
          "year",
          year.toString(),
          "month",
          month.toString(),
          "day",
          day.toString(),
          "clockIn"
        ),
        where("companyID", "==", companyID),
        orderBy("clockIn", "desc")
      ),
      (querySnapshot) => {
        const clockIn = [];
        querySnapshot.forEach((snap) => {
          clockIn.push(snap.get("clockIn"));
          // alert("ggg", snap.data());
          // key: snap.id;
        });
        //alert("here is the clock in " + clockIn);

        setClockIn(clockIn);
      }
    );
  } catch (error) {
    alert(error);
  }
}
export function getClockOut({ setClockOut, company, companyID }) {
  try {
    onSnapshot(
      query(
        collection(
          db,
          "companys",
          companyID,
          "clockIn",
          auth.currentUser.email,
          "year",
          year.toString(),
          "month",
          month.toString(),
          "day",
          day.toString(),
          "clockOut"
        ),
        where("companyID", "==", companyID),
        orderBy("clockOut", "desc")
      ),
      (querySnapshot) => {
        const clockOut = [];
        querySnapshot.forEach((snap) => {
          clockOut.push(snap.get("clockOut"));
          // key: snap.id;
        });
        // console.log(clockOut);
        setClockOut(clockOut);
      }
    );
  } catch (error) {
    alert(error);
    console.log("i got an error ${error}");
  }
}
export function getClockInButtonState({
  setClockinButtonState,
  company,
  companyID,
}) {
  try {
    onSnapshot(
      doc(
        db,
        "companys",
        companyID,
        "clockIn",
        auth.currentUser.email,
        "year",
        year.toString(),
        "month",
        month.toString(),
        "day",
        day.toString()
      ),
      where("companyID", "==", companyID),
      (data) => {
        const buttonState = data.get("buttonState");
        if (buttonState == true || buttonState == false) {
          setClockinButtonState(buttonState);
          //alert("here is the button state " + buttonState);
        }
      }
    );
  } catch (error) {
    alert(error);
    console.log("i got an error ${error}");
  }
}

export async function sendMessage({
  companyID,
  channelID,
  message,
  channel,
  company,
}) {
  try {
    await addDoc(
      collection(db, "messages"),
      {
        message: message,

        uid: auth.currentUser.uid,
        company: company,
        companyID: companyID,

        channelID: channelID,
        channel: channel,
        timestamp: serverTimestamp(),
        userEmail: auth.currentUser.email,
      },

      { merge: true }
    );
  } catch (error) {
    alert(error);
    console.log("i got an error ${error}");
  }
}
export function getMessages({ setMessages, channelID, companyID }) {
  onSnapshot(
    query(
      collection(db, "messages"),
      where("channelID", "==", channelID),

      orderBy("timestamp"),
      limit(130)
    ),
    (querySnapshot) => {
      const messages = [];
      const otherMessages = [];
      querySnapshot.forEach((snap) => {
        messages.push(snap.data());

        // key: snap.id;
      });

      console.log(messages);
      setMessages(messages);
    }
  );
}
export function getCompanyID({ setCompanyId, company, dispatch }) {
  try {
    onSnapshot(doc(db, "users", auth.currentUser.email), (doc) => {
      // setCompanyDB(doc.get("company"));
      const data = doc.data();
      dispatch(setCompanyID(data.companyID));

      console.log(data.companyID);
    });
  } catch (error) {
    alert(error);
    console.log("i got an error ${error}");
  }
}
export function getCompanyAddress({ setAddress, company, companyID }) {
  onSnapshot(
    query(
      collection(db, "companys", companyID, "address"),
      where("companyID", "==", companyID)
    ),

    (querySnapshot) => {
      const address = [];
      querySnapshot.forEach((snap) => {
        address.push(snap.data());
        // key: snap.id;
      });
      // console.log(tasks);
      setAddress(address);
    }
  );
}
export async function addCompanyAddress({ address, company, companyID }) {
  try {
    await setDoc(
      doc(db, "companys", companyID, "address", address),
      {
        address: address,
        timestamp: serverTimestamp(),
        company: company,
        companyID: companyID,
      },
      { merge: true }
    );
  } catch (e) {
    alert("Please add a valid address");
  }
}
export function getClockInUsers({ setEmployees, companyID }) {
  onSnapshot(
    query(collection(db, "companys", companyID, "clockIn")),
    (querySnapshot) => {
      const employees = [];
      querySnapshot.forEach((snap) => {
        employees.push(snap.data());
        // key: snap.id;
      });
      // console.log(tasks);
      setEmployees(employees);
    }
  );
}
export function getClockInYears({
  setEmployees,
  companyID,
  employeePersonSelected,
}) {
  onSnapshot(
    query(
      collection(
        db,
        "companys",
        companyID,
        "clockIn",
        employeePersonSelected,
        "year"
      )
    ),
    (querySnapshot) => {
      const years = [];
      querySnapshot.forEach((snap) => {
        years.push(snap.data());
        // key: snap.id;
      });
      console.log(years);
      setEmployees(years);
    }
  );
}
export function getClockInMonths({
  employeePersonSelected,
  setMonthselected,
  companyID,
  yearSelected,
}) {
  onSnapshot(
    query(
      collection(
        db,
        "companys",
        companyID,
        "clockIn",
        employeePersonSelected,
        "year",
        yearSelected,
        "month"
      )
    ),
    (querySnapshot) => {
      const monthselected = [];
      querySnapshot.forEach((snap) => {
        monthselected.push(snap.data());
        // key: snap.id;
      });

      setMonthselected(monthselected);
      console.log(monthselected);
    }
  );
}

export function getClockInDays({
  companyID,
  employeePersonSelected,
  yearSelected,
  monthSelected,
  setDaySelected,
}) {
  onSnapshot(
    query(
      collection(
        db,
        "companys",
        companyID,
        "clockIn",
        employeePersonSelected,
        "year",
        yearSelected,
        "month",
        monthSelected,
        "day"
      )
    ),
    (querySnapshot) => {
      const daySelected = [];
      querySnapshot.forEach((snap) => {
        daySelected.push(snap.data());
        const data = snap.data();
        const allTimeWorkedArray = [];
        var sum = 0;
      });

      setDaySelected(daySelected);
    }
  );
}
export function getTeams({ setTeams, companyID, teamID }) {
  onSnapshot(
    query(
      collection(db, "companys", companyID, "teams"),
      where("companyID", "==", companyID),
      where("teamMembers", "array-contains", auth.currentUser.email)
    ),
    (querySnapshot) => {
      const teams = [];
      querySnapshot.forEach((snap) => {
        teams.push(snap.data());

        // key: snap.id;
      });
      console.log(teams);
      setTeams(teams);
    }
  );
}
export async function addTeam({
  company,
  team,
  companyID,
  teamID,
  teamMembers,
}) {
  try {
    await setDoc(
      doc(db, "companys", companyID, "teams", teamID),
      {
        team: team,
        timestamp: serverTimestamp(),
        companyID: companyID,
        teamID: teamID,
        teamMembers: teamMembers,
        company: company,
        userWhoCreatedTeam: auth.currentUser.email,
        adminUsers: arrayUnion(auth.currentUser.email),
      },
      { merge: true }
    )
      .then(async () => {
        await setDoc(
          doc(db, "companys", companyID, "teams", teamID),
          {
            teamMembers: arrayUnion(auth.currentUser.email),
          },
          { merge: true }
        );
      })
      .then(async () => {
        await setDoc(
          doc(db, "users", auth.currentUser.email),
          { teams: arrayUnion(teamID), adminOfTheseTeams: arrayUnion(teamID) },
          { merge: true }
        );
      })
      .then(async () => {
        //add list of teams to users
        teamMembers.forEach(async (member) => {
          await setDoc(
            doc(db, "users", member),
            {
              teams: arrayUnion(teamID),
            },
            { merge: true }
          );
        });
      });
  } catch (error) {
    alert(error);
    console.log("i got an error ${error}");
  }
}
export async function updateTotalHoursWorked({ companyID, totalHoursToday }) {
  setDoc(
    doc(
      db,
      "companys",
      companyID,
      "clockIn",
      auth.currentUser.email,
      "year",
      year.toString(),
      "month",
      month.toString(),
      "day",
      day.toString()
    ),
    { totalHoursToday: totalHoursToday },
    { merge: true }
  );
}
export async function clockInFunction2({
  companyID,
  company,
  companyAddress,
  clockinButtonstate2,
  minutesConverted,
  
  year,
  month,
  day,
  time,
  totalHoursToday,
}) {
  try {
    await setDoc(
      doc(
        db,
        "companys",
        companyID,
        "timeTracking",
        auth.currentUser.email,
        "ClockIn"
      ),
      {
        clockIn: time,
        clockOut: time,
        totalHoursToday: totalHoursToday,
        timestamp: serverTimestamp(),
        companyID: companyID,
        user: auth.currentUser.email,
        year: year.toString(),
        month: month.toString(),
        day: day.toString(),
      },
      { merge: true }
    );
  } catch (e) {
    alert("Please add a valid address");
  }
}
export async function clockOutFunction2({
  companyID,
  year,
  month,
  day,
  time,
  totalHoursToday,
}) {
  try {
    await setDoc(
      doc(
        db,
        "companys",
        companyID,
        "timeTracking",
        auth.currentUser.email,
        "ClockOut"
      ),
      {
        clockOut: time,
        totalHoursToday: totalHoursToday,
        timestamp: serverTimestamp(),
        companyID: companyID,
        user: auth.currentUser.email,
        year: year.toString(),
        month: month.toString(),
        day: day.toString(),
      },
      { merge: true }
    );
  } catch (e) {
    alert("Please add a valid address");
  }
}
