import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppStyle from "../../AppStyle";
const styles = StyleSheet.create(AppStyle);

export default class Items extends React.Component {
  state = {
    itemsMenus: null
  };

  _renderItemsMenus() {
    let arrItems = [];
    // on boucle sur le tableau items
    for (let i = 0; i < this.props.idItem.length; i++) {
      // on vérifie la correspondance entre l'id de la catégorie et la category_id de l'item et on récupere les infos
      if (this.props.idCat.id === this.props.idItem[i].category_id) {
        arrItems.push(
          <View
            key={i}
            style={{
              width: 300,
              marginBottom: 10
            }}
          >
            <Text style={styles.strong}>{this.props.idItem[i].name}</Text>
            {this.props.idItem[i].description ? (
              <Text>{this.props.idItem[i].description}</Text>
            ) : null}
            <Text style={[styles.strong, styles.text]}>
              {this.props.idItem[i].price}
            </Text>
          </View>
        );
      }
    }
    // this.setState(
    //   {
    //     itemsMenus: arrItems
    //   },
    //   () => {
    //     console.log("affichage du itemsMenus : ", this.state.itemsMenus);
    //   }
    // );

    return (
      <View>
        <Text>{arrItems}</Text>
      </View>
    );
  }

  render() {
    console.log("render de items /;;;;;;");

    return this._renderItemsMenus();
  }
}
