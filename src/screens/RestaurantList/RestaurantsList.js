import React from "react";
import {
  Button,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  View,
  StatusBar
} from "react-native";

import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

import { StyleRestaurant } from "./StyleRestaurant";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const resto = {};

export default class Restaurants extends React.PureComponent {
  // static navigationOptions = ({ navigation }) => ({
  //   title: navigation.state.params.name
  // });

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      backgroundColor: "white",
      borderBottomWidth: 0
    },
    headerTintColor: "#7FC149",
    title:
      typeof navigation.state.params === "undefined" ||
      typeof navigation.state.params.title === "undefined"
        ? null
        : navigation.state.params.title,
    // remove title on the back button
    headerBackTitle: null
  });
  state = {
    restaurants: [],
    isLoading: true,
    length: null,
    hour: this.props.navigation.state.params.hour
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.restaurants === nextProps.restaurants) {
  //     return false;
  //   }
  //   return true;
  // }

  ShowHideActivityIndicator = () => {
    if (this.state.isLoading == true) {
      this.setState({ isLoading: false });
    } else {
      this.setState({ isLoading: true });
    }
  };

  // Generate random number to populate rank '%' and 'Avis'

  GenerateRandomNumber = () => {
    return (RandomNumber = Math.floor(Math.random() * 100) + 1);
  };

  componentDidMount() {
    console.log("Did mount restaurants Page ");

    let hour = this.props.navigation.state.params.hour;
    let geohash = this.props.navigation.state.params.geoloc;

    // console.log("hour dans resto : ", hour);
    // console.log("geohash dans resto ", geohash);

    axios
      .get(
        hour === null || hour === this.props.navigation.state.params.pick
          ? `https://consumer-ow-api.deliveroo.com/orderapp/v2/restaurants?geohash=${geohash}`
          : `https://consumer-ow-api.deliveroo.com/orderapp/v2/restaurants?delivery_time=${hour}&geohash=${geohash}`
      )
      .then(response => {
        // console.log("reponse dans la liste des resto : ", response.data.data);
        // console.log(
        //   "reponse dans la liste pour type : ",
        //   response.data.included
        // );
        this.props.navigation.setParams({
          title: response.data.meta.neighborhood_name
        });
        const element = [];
        const restaurantTypeId = [];
        response.data.data.map((item, index) => {
          //console.log("test : ", response.data.data[index].relationships);
          //restaurantTypeId.push(response.data.data[index].relationships);
          // response.data.data[index].attributes.relationships.menu_tags.data.map(
          //   (item, idex) => {
          //     restaurantTypeId.push(item);
          //   }
          // );
          if (
            hour === null ||
            hour === this.props.navigation.state.params.pick
          ) {
            if (item.attributes.delivery_time === "30 - 40") {
              element.push(item);
            }
          } else {
            if (item.attributes.rating_percentage > 90) {
              element.push(item);
            }
            // if (item.attributes.rating_percentage > 80) {
            //   element.push(item);
            // }
          }
          //rating_percentage / rating_formatted_count / price_category
          return element;
        });
        // console.log("element du tab : ", element);
        // console.log("restaurantTypeId  : ", restaurantTypeId);
        // restaurantTypeId.map((item,index)=>{

        // })

        this.setState({
          restaurants: element,
          length: element.length
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    console.log("rendering restaurants Page");
    const { navigate } = this.props.navigation;
    // récupération du nom et de la photo
    const arrResto = [];
    for (let i = 0; i < this.state.restaurants.length; i++) {
      arrResto.push(
        <View key={i} style={StyleRestaurant.container}>
          <TouchableOpacity
            onPress={() =>
              // passage du nom, id et lien à la page Menu
              navigate("Menu", {
                name: this.state.restaurants[i].attributes.name,
                id_deliveroo: this.state.restaurants[i].id,
                link: this.state.restaurants[i].links.web,
                picture: this.state.restaurants[i].attributes.image_url,
                rank: this.state.restaurants[i].attributes
                  .rating_formatted_count,
                percent: this.state.restaurants[i].attributes.rating_percentage,
                arrChoose: this.props.navigation.state.params.arrChoose,
                data: this.props.navigation.state.params.data
              })
            }
          >
            <Image
              style={{ width: "100%", height: height / 5 }}
              source={{
                uri: this.state.restaurants[i].attributes.image_url
              }}
            />
          </TouchableOpacity>
          <View style={StyleRestaurant.restaurantNameView}>
            <View style={{}}>
              <Text style={StyleRestaurant.restaurantName}>
                {this.state.restaurants[i].attributes.name}
              </Text>
            </View>

            <View style={StyleRestaurant.rankView}>
              <Text style={StyleRestaurant.textAvis}>
                {this.state.restaurants[i].attributes.rating_percentage}%
              </Text>
              <Text style={StyleRestaurant.textAvis}>
                {this.state.restaurants[i].attributes.rating_formatted_count}{" "}
                Avis
              </Text>
            </View>
          </View>
        </View>
      );
    }
    return [
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar barStyle="dark-content" />
        <View>
          {this.state.length === this.state.restaurants.length ? (
            this.state.length === 0 && this.state.restaurants.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Icon name="ios-alert" size={100} color="#7FC149" />
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: "Lato-Regular",
                    color: "#4A4A4A",
                    textAlign: "center"
                  }}
                >
                  Nous sommes désolés ! Aucun restaurant ne peut livrer à{" "}
                  {this.props.navigation.state.params.title} à l'heure
                  sélectionnée
                </Text>
              </View>
            ) : (
              <View>{arrResto}</View>
            )
          ) : (
            <ActivityIndicator
              size="large"
              color="#7FC149"
              style={{ alignSelf: "center", flex: 1 }}
            />
          )}
        </View>
      </ScrollView>,
      <View style={StyleRestaurant.UserNav}>
        <TouchableOpacity
          onPress={() =>
            navigate("Restaurants", {
              name: "Restaurant",
              geoloc: this.props.navigation.state.params.geoloc,
              hour: this.props.navigation.state.params.hour,
              pick: this.props.navigation.state.params.pick,
              arrChoose: this.props.navigation.state.params.arrChoose,
              data: this.props.navigation.state.params.data
            })
          }
        >
          <Icon name="ios-restaurant" size={40} color="#7FC149" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigate("Account", {
              name: "Account",
              geoloc: this.props.navigation.state.params.geoloc,
              hour: this.props.navigation.state.params.hour,
              pick: this.props.navigation.state.params.pick,
              arrChoose: this.props.navigation.state.params.arrChoose,
              data: this.props.navigation.state.params.data
            })
          }
        >
          <Icon name="ios-heart" size={40} color="#7FC149" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigate("Account", {
              name: "Account",
              geoloc: this.props.navigation.state.params.geoloc,
              hour: this.props.navigation.state.params.hour,
              pick: this.props.navigation.state.params.pick,
              arrChoose: this.props.navigation.state.params.arrChoose,
              data: this.props.navigation.state.params.data
            })
          }
        >
          <Icon name="ios-list-box" size={40} color="#7FC149" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigate("Account", {
              name: "Account",
              geoloc: this.props.navigation.state.params.geoloc,
              hour: this.props.navigation.state.params.hour,
              pick: this.props.navigation.state.params.pick,
              arrChoose: this.props.navigation.state.params.arrChoose,
              data: this.props.navigation.state.params.data
            })
          }
        >
          <Icon name="ios-person" size={40} color="#7FC149" />
        </TouchableOpacity>
      </View>
    ];
  }
}
