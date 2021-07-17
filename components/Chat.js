
import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

// Component renders the chat view
export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const name = props.route.params.name;
  props.navigation.setOptions({ title: name }); //displays the name of the user in the navigation

  // Used useeffect to load some mock messages
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `${name} joined the chat`,
        createdAt: new Date(),
        system: true,
      },
      {
        _id: 2,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  //this function gets the screen color from the home page through props.route.params. and display it on chat screen
  const backColor = props.route.params.backColor;

  // Function to send a new message
  const onSend = (messages) => {
    setMessages((previousState) => GiftedChat.append(previousState, messages));
  };

  return (
    <View style={{ flex: 1, backgroundColor: backColor }}>
      <GiftedChat
        renderBubble={renderBubble} // Attribute to customize the chat bubble
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      {/* Fixed Keyboard hiding the input for android devices */}
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}

//this function changes the color of the chat bubbles to custom colors
function renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000",
        },
      }}
    />
  );
}


