import React, { Component } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

import firebase from "firebase";
import "firebase/firestore";

// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
      image: null,
      location: null,
    };

    //config to allow the app to connect to Firestore.
    const firebaseConfig = {
      apiKey: "AIzaSyCIU3ycZ3NoOiJeUp3OsXrL-OihOsQFxa4",
      authDomain: "chat-app-d0e18.firebaseapp.com",
      projectId: "chat-app-d0e18",
      storageBucket: "chat-app-d0e18.appspot.com",
      messagingSenderId: "186371536966",
      appId: "1:186371536966:web:317a7fe535317a68b43247",
      measurementId: "G-K81LMTVE93",
    };

    //connect to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //reference the collection in firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  //fetch and display existing messages
  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `${name}` });

    // checks user connect
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");

        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            this.setState({
              uid: user.uid,
              messages: [],
            });
            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        console.log("offline");
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
    }
  }

  //when something changes in the messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });

    this.setState({
      messages,
    });

    // //access the user’s name
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: `${name}` });
    this.setState({
      messages,
    });
  };

  // Adds messages to cloud storage
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  // allows offline access to messages retrieved from client-side storage
  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //Event handler for sending messages
  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  };

  //prevents any input if a user is offline
  renderInputToolbar = (props) => {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  //change bubble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "black",
          },
        }}
      />
    );
  }

  renderCustomActions = (props) => <CustomActions {...props} />;

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  renderActions = (props) => {
    return <CustomActions {...props} />;
  };

  render() {
    let backColor = this.props.route.params.backColor;
    const name = this.props.route.params.name;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backColor,
        }}
      >
        <GiftedChat
          messages={this.state.messages}
          renderBubble={this.renderBubble}
          renderInputToolbar={this.renderInputToolbar}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  item: {
    fontSize: 20,
    color: "blue",
  },
  text: {
    fontSize: 30,
  },
});
