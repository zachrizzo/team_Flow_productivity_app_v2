import React, { useState, useEffect } from "react";
import {
  Dimensions,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { getTeams } from "../firebase";
import InputBox from "./InputBox";

export default function TeamSearch({
  companyID,
  selectedTeam,
  setSelectedTeam,
  setSelectedTeamID,
}) {
  const [teams, setTeams] = useState([]);
  const [teamSearch, setTeamSearch] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [teamsFound, setTeamsFound] = useState([]);
  useEffect(() => {
    getTeams({ setTeams: setTeams, companyID: companyID });
  }, [companyID]);
  useEffect(() => {
    var searched = [];
    if (teamSearch != null && teamSearch != "") {
      teams.forEach((item) => {
        //if item is in the list of usersLlist then dont add it to the searched list

        if (
          item.team != null &&
          teamSearch != null &&
          item.team.toLowerCase().includes(teamSearch.toLowerCase())
        ) {
          searched.push(item);
        }
      });
      setTeamsFound(searched);
      searched = [];
    } else {
      setTeamsFound(null);
      searched = [];
    }
    setRefresh(!refresh);
  }, [teams, teamSearch]);

  return (
    <View
      style={{
        flex: 1,

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{}}>
        <InputBox
          placeholder="Search for a team"
          color="#7B3AF5"
          width={Dimensions.get("window").width / 2.5}
          value={teamSearch}
          onChangeText={(text) => setTeamSearch(text)}
        />
      </View>
      {teamSearch != "" && teamSearch != null && (
        <View
          style={{
            backgroundColor: "#A8A7A786",
            width: Dimensions.get("screen").width / 2,

            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",

            zIndex: 1,
          }}
        >
          <FlatList
            data={teamsFound}
            style={{ flex: 1 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTeam(item.team);
                    setSelectedTeamID(item.teamID);
                    setRefresh(!refresh);
                    setTeamsFound([]);
                    setTeamSearch("");
                  }}
                >
                  <View
                    style={{
                      marginVertical: 20,
                      padding: 10,
                      backgroundColor: "#1B6AD8",
                      width: Dimensions.get("screen").width / 2.5,
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#FFFFFF" }}>{item.team}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.email}
            listKey={5}
            Key={3}
          />
        </View>
      )}
    </View>
  );
}
