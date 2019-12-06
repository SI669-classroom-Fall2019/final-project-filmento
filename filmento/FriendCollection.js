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
import { Overlay, ButtonGroup, SearchBar } from "react-native-elements";
import { styles } from "./Styles";
import firebase from "firebase";
import "@firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";

const firebaseConfig = {
  apiKey: "AIzaSyBTcn24Cx35Cw5s1jeqEnQh9gaXccv_c_8",
  authDomain: "si669-film.firebaseapp.com",
  databaseURL: "https://si669-film.firebaseio.com",
  projectId: "si669-film",
  storageBucket: "si669-film.appspot.com",
  messagingSenderId: "1085644586813",
  appId: "1:1085644586813:web:354b9a69d3c17cfdbb4f54"
};

export class FriendCollectionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      selectedIndex: 0,
      userCollectionData: [], // this array is for storing the user collection movie data, will be used for searching within collection
      arrayholder: [], // also for storing user collection movie data
    };

    this.friendAccountEmail = this.props.navigation.getParam('friendAccountEmail') // get friend accounnt email from previous screen

    this.navigatePage = "";

    this.db = firebase.firestore();

    // read entries collection from database and store in state
    this.userRef = this.db.collection("users").doc(this.friendAccountEmail);
    this.userRef.get().then(queryRef => {
      let docData = queryRef.data();
      let newUser = {
        username: docData.username,
        moviesCollection: docData.movies,
        password: docData.password,
        wishList: docData.wishList
      };

      this.setState({ 
        user: newUser, 
        userCollectionData: docData.movies,
        arrayholder: docData.movies,
      });
    });

    //this.tabs = ["My Movies", "Watch List", "Friend List"];
  }

  handleGoToInfo(clickedMovie) {
    this.props.navigation.navigate("MovieCollectionDetail", {
      movie: clickedMovie,
      mainScreen: this
    });
  }

  // Added navigation logic, may still contain a minor bug, but so far testing has been fine.
  handleTab(newIndex) {
    this.setState({ prevIndex: this.state.selectedIndex, selectedIndex: newIndex })
    // alert('prev ' + this.state.prevIndex);
    // alert('new ' + this.state.selectedIndex);
    if (newIndex == 0 && newIndex != this.state.selectedIndex){
      this.navigatePage = "MovieCollection"
    } else if (newIndex == 1 && newIndex != this.state.selectedIndex){
      this.navigatePage = "WatchList"
    } else if (newIndex == 2 && newIndex != this.state.selectedIndex){
      this.navigatePage = "FriendList"
    }

    this.props.navigation.navigate(this.navigatePage, {
      user: this.state.user,
      mainScreen: this
    });
    this.setState({selectedIndex: 0}) // ser index back to the default for this page
  }

  // The following functions are for searching within the collection

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.state.arrayholder.filter(item => {
      const itemData = `${item.title.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      userCollectionData: newData,
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search within collection"
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.friendCollectionHeaderText}>{this.state.user.username}'s Collection</Text>
          <View style={styles.headerButtons}>
            <Icon.Button
              name="search"
              color="black"
              backgroundColor="transparent"
            />
            <Icon.Button
              name="filter"
              color="black"
              backgroundColor="transparent"
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
            keyExtractor={item => item.id} 
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
          />
        </View>
        {/* <View style={styles.footerContainer}>
          <ButtonGroup
            onPress={ newIndex =>
              //newIndex =>
              //this.setState({ prevIndex: this.state.selectedIndex, selectedIndex: newIndex }),
              this.handleTab(newIndex)
            }
            selectedIndex={this.state.selectedIndex}
            buttons={this.tabs}
            containerStyle={styles.buttonGroupContainer}
            underlayColor='black'
            selectedButtonStyle={styles.buttonGroupSelected}
            selectedTextStyle={styles.buttonGroupSelectedText}
            buttonStyle={styles.buttonGroupStyle}
            textStyle={styles.buttonGroupText}
          />
        </View> */}
      </View>
    );
  }
}