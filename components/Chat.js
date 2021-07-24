import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import firebase from "firebase";
import "firebase/firestore";

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

// The application’s main Chat component that renders the chat UI
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: null,
      },
      isConnected: false,
      
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
    this.props.navigation.setOptions({ title: `${name}'s Chat` });

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
              user: {
                _id: user.uid,
                name: name,
              },
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
    this.authUnsubscribe();
    this.unsubscribe();
  }

  //when something changes in the messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: new Date(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });

    // //access the user’s name
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: `${name}` });
    this.setState({
      messages,
    });
  };

  // Adds messages to cloud storage
  addMessages = () => {
    const messages = this.state.messages[0];
    firebase
      .firestore()
      .collection("messages")
      .add({
        _id: messages._id,
        text: messages.text,
        createdAt: messages.createdAt,
        user: {
          _id: messages.user._id,
          name: messages.user.name,
        },
      })
      .then()
      .catch((error) => console.log("error", error));
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
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessages();
        this.saveMessages();
      }
    );
  }

  // disables message input bar if offline
  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
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
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar}
          renderUsernameOnMessage={true}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
            name: name,
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
