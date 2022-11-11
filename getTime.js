// import React from "react";
// import { useLayoutEffect, useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import globalSlice, {
//   selectCompany,
//   setCompany,
//   setTime1,
// } from "../slices/globalSlice";

// const month = currentDate.getMonth() + 1;
// const day = currentDate.getDate();
// const hours = currentDate.getHours();
// const min = currentDate.getMinutes();
// const dispatch = useDispatch();
// const monthsDays = day.toString();
// const hoursToString = hours.toString();
// const time = useSelector(selectTime1);
// useEffect(() => {
//   // const theTime = () => {
//   if (hours > 12) {
//     const todayHoursOverTwelve = hours - 12;
//     const todayHoursOverTwelveString = todayHoursOverTwelve.toString();
//     console.log("OVER 12 " + todayHoursOverTwelveString);
//     dispatch(setTime1(todayHoursOverTwelveString));
//     // setTodaysHours(todayHoursOverTwelveString);
//   } else dispatch(setTime1(hoursToString)), console.log("hhhhhh", time);
//   // };

//   // return () => {
//   //   theTime();
//   // };
// }, []);
// const time = todaysHours + ":" + min;
// const fulldate = month + "/" + day;
console.log(fulldate);
