import React from "react";
import axios from "axios";
import geo from "geo-hash";
import moment from "moment";

import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  Text,
  Picker
} from "react-native";

import { stylesHome } from "./StylesHome";
import { commonStyles } from "../../../src/CommonStyles";
import Icon from "react-native-vector-icons/Ionicons";

// import AppStyle from "../../../AppStyle";
// const styles = StyleSheet.create(AppStyle);

export default class Home extends React.PureComponent {
  static navigationOptions = {
    header: null
  };

  state = {
    error: null,
    geoloc: null,
    hour: null
  };

  // Optimizing the rendering page, if the geoloc state not changing then we don't rendering
  // instead we using PureComponent

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     //this.props.geoloc === nextProps.geoloc ||
  //     this.state.hour === nextProps.hour
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }

  // function to get geoloc and convert it to geohash

  getGeoLoc() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        let geohash = geo.encode(
          position.coords.latitude,
          position.coords.longitude
        );
        this.setState({
          geoloc: geohash,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );
  }

  // Listen if geoloc change

  UNSAFE_componentWillMount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  componentDidMount() {
    console.log("Did mount home page");
    this.getGeoLoc();
  }

  render() {
    console.log("data home:", this.props.navigation.state.params.data);
    console.log("rendering home page");

    /* PICKERS */
    const pickers = [];

    /* ON ARRONDIT L'HEURE ACTUELLE A 15 MIN SUPERIEURES */
    const rounded = Math.round(moment().minute() / 15) * 15;
    const roundedDown = Math.floor(moment().minute() / 15) * 15;
    const roundedUp = Math.ceil(moment().minute() / 15) * 15;

    roundedtime = moment()
      .minute(roundedUp)
      .second(0);

    const timestamp = moment(roundedtime).unix();
    const tonightTimestamp = moment(moment().endOf("day")).unix();

    for (let i = 0; i < Math.ceil((tonightTimestamp - timestamp) / 900); i++) {
      i > 0
        ? pickers.push(
            <Picker.Item
              key={i}
              label={moment((timestamp + i * 900) * 1000).format("HH:mm")}
              value={moment((timestamp + i * 900) * 1000).unix()}
            />
          )
        : null;
    }
    let chooseHour = null;
    let chooseHour1 = null;
    let chooseHour2 = null;
    let arrChoose = [];
    if (this.state.hour === null) {
      chooseHour = moment.unix(pickers[0].props.value).format("HH:mm");
      chooseHour1 = moment.unix(pickers[0].props.value + 900).format("HH:mm");
      chooseHour2 = moment.unix(pickers[0].props.value + 1800).format("HH:mm");
    } else {
      chooseHour = moment.unix(this.state.hour).format("HH:mm");
      chooseHour1 = moment.unix(this.state.hour + 900).format("HH:mm");
      chooseHour2 = moment.unix(this.state.hour + 1800).format("HH:mm");
    }
    arrChoose.push(chooseHour, chooseHour1, chooseHour2);

    const { navigate } = this.props.navigation;
    return (
      <View style={stylesHome.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Icon name="ios-time" size={100} color="#fff" />
          {/* <Text style={commonStyles.foodPicking}>Food Picking</Text> */}
        </View>

        {this.state.error ? (
          <View
            style={{
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text>Error: {this.state.error}</Text>
          </View>
        ) : null}
        <View style={{ flex: 2 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                textAlign: "center",
                padding: 10,
                fontSize: 20,
                color: "white",
                fontFamily: "Lato-Regular"
              }}
            >
              &Agrave; partir de quelle heure souhaitez-vous récupérer votre
              commande?{" "}
            </Text>
          </View>
          <View style={{ flex: 2 }}>
            <Picker
              itemStyle={{
                color: "white"
              }}
              selectedValue={this.state.hour}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({
                  hour: itemValue
                })
              }
            >
              {pickers}
            </Picker>
          </View>

          <TouchableOpacity
            style={commonStyles.button}
            onPress={() =>
              navigate("Restaurants", {
                name: "Restaurant",
                geoloc: this.state.geoloc,
                hour: this.state.hour,
                pick: pickers[0].props.value,
                arrChoose: arrChoose,
                data: this.props.navigation.state.params.data
              })
            }
          >
            <Text style={commonStyles.textButton}>C'est Parti !</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
