import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import axios from "axios";
import LottieView from "lottie-react-native";
import Logo from "../assets/logo-for-map.png";

import Header from "../components/Header";

const AroundMeScreen = () => {
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [coords, setCoords] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  //Loader
  const homeAnimation = useRef();
  const playAnimation = () => {
    homeAnimation.current.play(2, 18);
  };
  const pressAnimation = () => {
    homeAnimation.current.play(0, 1);
  };
  //Loader
  const getPermissionLocationAndData = async () => {
    // Demander l'autorisation d'accéder à la localisation
    const { status } = await Location.requestPermissionsAsync();

    let response = [];
    // WhichRequest granted Request does not work if there isn't any item around your location
    const whichRequest = async () => {
      if (status === "granted") {
        // Récupérer la localisation
        const location = await Location.getCurrentPositionAsync();

        // Stocker les données de localisation
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        // Requête pour récupérer les annonces
        await axios
          .get(
            `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
          )
          .then((res) => {
            response = res.data;
          });
      } else {
        // Requête pour récupérer toutes les annonces
        await axios
          .get(`https://express-airbnb-api.herokuapp.com/rooms/around`)
          .then((res) => {
            response = res.data;
          });
      }
    };

    await whichRequest();

    const setCoordsFunction = (data) => {
      const tab = [];
      for (let i = 0; i < data.length; i++) {
        tab.push({
          latitude: data[i].location[1],
          longitude: data[i].location[0],
        });
      }
      setCoords(tab);
      // console.log("tab", tab);
      setIsLoading(false);
    };

    setCoordsFunction(response);
  };

  useEffect(() => {
    getPermissionLocationAndData();
  }, []);

  return isLoading ? (
    <View style={styles.animationContainer}>
      <LottieView
        source={require("../assets/lottieView.json")}
        loop={true}
        autoPlay={true}
        progress={0}
        style={{
          width: 400,
          height: 400,
          backgroundColor: "#FFFFFF",
        }}
        ref={homeAnimation}
        // OR find more Lottie files @ https://lottiefiles.com/featured
        // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
      />
    </View>
  ) : (
    <View>
      <Header isClickableHeader={false} />
      <MapView
        showsUserLocation={true}
        initialRegion={{
          latitude: latitude || 48.856614,
          longitude: longitude || 2.3522219,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        style={styles.map}
      >
        {/* .map sur un tableau de coordonnées */}
        {coords.map((coord, index) => {
          return (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: coord.latitude,
                longitude: coord.longitude,
              }}
              image={Logo}
            />
          );
        })}
      </MapView>
      <View style={styles.container}>
        <View>
          <Text>Latitude : {latitude}</Text>
          <Text>Longitude : {longitude}</Text>
        </View>
      </View>
    </View>
  );
};
export default AroundMeScreen;

const widthMap = Dimensions.get("window").width;
const heightMap = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 70,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: "space-between",
  },
  map: {
    height: heightMap - 96,
    width: widthMap,
  },
  animationContainer: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
