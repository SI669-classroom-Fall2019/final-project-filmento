import React from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  SegmentedControlIOSComponent,
  Image,
  TouchableOpacity
} from "react-native";
import { Overlay, ButtonGroup } from "react-native-elements";
import { styles } from "./Styles";
import firebase from "firebase";
import "@firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";



export class MovieCollectionPage extends React.Component {
  constructor(props) {
    super(props);


    this.UID = this.props.navigation.getParam('UID');


    this.state = {
      user: {},
      selectedIndex: 0
    };


    this.db = firebase.firestore();

    // read entries collection from database and store in state
    this.usersRef = this.db.collection("users").doc(this.UID);

    this.usersRef.get().then(queryRef => {
      let docData = queryRef.data();
      let newUser = {
        moviesCollection: docData.movies,

        wishList: docData.wishList
      };

      this.setState({ user: newUser });
    });

    this.tabs = ["My Movies", "Watch List", "Friend List"];
  }

  handleGoToInfo(clickedMovie) {
    this.props.navigation.navigate("MovieCollectionDetail", {
      movie: clickedMovie,
      mainScreen: this
    });
  }

  //still don't know how to navigate to other page
  handleTab(item) {
    this.props.navigation.navigate(navigatePage, {
      user: this.state.user,
      mainScreen: this
    });
  }

  render() {
    let navigatePage = "";
    if (this.state.selectedIndex == 0){
        navigatePage == "MovieCollection"
    } else if (this.state.selectedIndex == 1){
        navigatePage == "WatchList"
    } else if (this.state.selectedIndex == 2){
        navigatePage == "FriendList"
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Ｍy Movies</Text>
          <View style={styles.headerButtons}>
            <Icon.Button
              name="search"
              color="black"
              backgroundColor="transparent"
              // onPress={() => {
              //   this.handleEdit(item);
              // }}
            />
            <Icon.Button
              name="filter"
              color="black"
              backgroundColor="transparent"
              // onPress={() => {
              //   this.handleEdit(item);
              // }}
            />
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <FlatList
            data={this.state.user.moviesCollection}
            numColumns={2}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.imageContainer}
                  onPress={() => {
                    this.handleGoToInfo(item);
                  }}
                >
                  <Image
                    style={styles.imageStyle}
                    resizeMode="contain"
                    source={{ uri: item.poster }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={styles.footerContainer}>
          <ButtonGroup
            onPress={newIndex =>
              this.setState({ selectedIndex: newIndex }) 
            }
            selectedIndex={this.state.selectedIndex}
            buttons={this.tabs}
            containerStyle={styles.buttonGroupContainer}
            // selectedButtonStyle={styles.buttonGroupSelected}
            // selectedTextStyle={styles.buttonGroupSelectedText}
            // buttonStyle={styles.buttonGroupStyle}
            // textStyle={styles.buttonGroupText}
          />
        </View>
      </View>
    );
  }

}

