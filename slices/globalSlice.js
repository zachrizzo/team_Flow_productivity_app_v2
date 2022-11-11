import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    company: null,
    companyID: null,
    time: null,
    date: null,
    location: null,
    distance: null,
    lat: null,
    long: null,
    workLat: 40.7793003942141,
    workLong: -73.96709534550818,
    companyAddress: null,
    channel: null,
    channelID: null,
    taskID: null,
    adminUsers: false,
    clockinButtonState: true,
    yearSelected: null,
    monthSelected: null,
    daySelected: null,
    employeePersonSelected: null,
    userSubscriptionStatus: null,
    companySubscriptionStatus: null,
    trial: null,
  },
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload;
    },
    setCompanyID: (state, action) => {
      state.companyID = action.payload;
    },
    setTime1: (state, action) => {
      state.time = action.payload;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setDistance: (state, action) => {
      state.distance = action.payload;
    },
    setLat: (state, action) => {
      state.lat = action.payload;
    },
    setLong: (state, action) => {
      state.long = action.payload;
    },
    setWorkLat: (state, action) => {
      state.lat = action.payload;
    },
    setWorkLong: (state, action) => {
      state.long = action.payload;
    },
    setCompanyAddress: (state, action) => {
      state.companyAddress = action.payload;
    },
    setChannel: (state, action) => {
      state.channel = action.payload;
    },
    setChannelID: (state, action) => {
      state.channelID = action.payload;
    },
    setTaskID: (state, action) => {
      state.taskID = action.payload;
    },
    setAdminUsers: (state, action) => {
      state.adminUsers = action.payload;
    },
    setClockinButtonState: (state, action) => {
      state.clockinButtonState = action.payload;
    },
    setYearSelected: (state, action) => {
      state.yearSelected = action.payload;
    },
    setMonthSelected: (state, action) => {
      state.monthSelected = action.payload;
    },
    setDaySelected: (state, action) => {
      state.daySelected = action.payload;
    },
    setEmployeePersonSelected: (state, action) => {
      state.employeePersonSelected = action.payload;
    },
    setUserSubscriptionStatus: (state, action) => {
      state.userSubscriptionStatus = action.payload;
    },
    setCompanySubscriptionStatus: (state, action) => {
      state.companySubscriptionStatus = action.payload;
    },
    setTrial: (state, action) => {
      state.trial = action.payload;
    },
  },
});

export const {
  setCompany,
  setCompanyID,
  setTime1,
  setDate,
  setDistance,
  setLocation,
  setLat,
  setLong,
  setWorkLat,
  setWorkLong,
  setCompanyAddress,
  setChannel,
  setChannelID,
  setTaskID,
  setAdminUsers,
  setClockinButtonState,
  setYearSelected,
  setDaySelected,
  setMonthSelected,
  setEmployeePersonSelected,
  setUserSubscriptionStatus,
  setCompanySubscriptionStatus,
  setTrial,
} = globalSlice.actions;

export const selectCompany = (state) => state.global.company;
export const selectCompanyID = (state) => state.global.companyID;
export const selectTime1 = (state) => state.global.time;
export const selectDate = (state) => state.global.date;
export const selectLocation = (state) => state.global.location;
export const selectDistance = (state) => state.global.distance;
export const selectLat = (state) => state.global.lat;
export const selectLong = (state) => state.global.long;
export const selectWorkLat = (state) => state.global.workLat;
export const selectWorkLong = (state) => state.global.workLong;
export const selectCompanyAddress = (state) => state.global.companyAddress;
export const selectChannel = (state) => state.global.channel;
export const selectChannelID = (state) => state.global.channelID;
export const selectTaskID = (state) => state.global.taskID;
export const selectAdminUsers = (state) => state.global.adminUsers;
export const selectClockinButtonState = (state) =>
  state.global.clockinButtonState;
export const selectYearSelected = (state) => state.global.yearSelected;
export const selectMonthSelected = (state) => state.global.monthSelected;
export const selectEmployeeSelected = (state) =>
  state.global.employeePersonSelected;
export default globalSlice.reducer;
export const selectUserSubscriptionStatus = (state) =>
  state.global.userSubscriptionStatus;
export const selectCompanySubscriptionStatus = (state) =>
  state.global.companySubscriptionStatus;
export const selectTrial = (state) => state.global.trial;
