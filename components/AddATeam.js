import { View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import InputBox from "./InputBox";
import MainButton from "./MainButton";
import UserSearch from "./UserSearch";
import { addTeam } from "../firebase";

export default function AddATeam({
  companyID,
  //   setTeamID,

  company,
}) {
  const [selectedUser, setSelectedUser] = useState([]);
  //generate a random team ID Number with letters and numbers
  const [teamName, setTeamName] = useState(null);
  const [teamID, setTeamID] = useState("");

  var teamIDs = "";
  useEffect(() => {
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++) {
      teamIDs += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    setTeamID(teamIDs.toString());
    console.log(teamIDs);
  }, [teamName]);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <InputBox
        placeholder={"Team Name"}
        onChangeText={(text) => {
          setTeamName(text);
        }}
        width={Dimensions.get("screen").width / 2.5}
        value={teamName}
        color="#7B3AF5"
      />
      <UserSearch
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        companyID={companyID}
      />

      <MainButton
        text="Create Team"
        onPress={() => {
          //create a team in firebase
          addTeam({
            team: teamName,
            teamID: teamID,
            companyID: companyID,
            company: company,
            teamMembers: selectedUser,
          }).then(() => {
            setTeamName("");
            setSelectedUser([]);
          });
        }}
      />
    </View>
  );
}
