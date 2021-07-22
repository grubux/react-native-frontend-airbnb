import React from "react";
import { View, Image } from "react-native";
import Logo from "../assets/logo.png";

export default function Header({ isClickableHeader }) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: "lightgrey",
      }}
    >
      <Image
        style={{ width: 40, height: 40, resizeMode: "contain" }}
        source={Logo}
      />
    </View>
  );
}
