import React from "react";
import {
  Text,
  View,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
const backgroundImage = require("../assets/backgroundImage.png");

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      backColor: '#757083'
    }
  }

  render() {
    return (
      //these are all the parts that make up the home page of this chat app.
      <View style={Styles.container}>
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          style={Styles.backgroundImage}
        >
          <View style={Styles.heading}>
            <Text style={{ fontSize: 40, fontWeight: 'bold', paddingBottom: 300, color: "#ffffff" }}>
              Chatter App
            </Text>
          </View>
          <View style={Styles.container2}>
            <TextInput
              style={Styles.input}
              placeholder="Your Name"
              onChangeText={(name) => {
                this.setState({ name });
              }}
              value={this.state.name}
            />

            <View style={Styles.colorBox}>
              <View>
                <Text style={{ paddingBottom: 10 }}>
                  Choose Background Color:
                </Text>
              </View>
              <View style={Styles.colorButtons}>
                <TouchableOpacity
                  onPress={() => this.setState({ backColor: "#090C08" })}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#090C08",
                    borderRadius: 50 / 2,
                  }}
                />
                <TouchableOpacity
                  onPress={() => this.setState({ backColor: "#474056" })}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#474056",
                    borderRadius: 50 / 2,
                  }}
                />
                <TouchableOpacity
                  onPress={() => this.setState({ backColor: "#8A95A5" })}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#8A95A5",
                    borderRadius: 50 / 2,
                  }}
                />
                <TouchableOpacity
                  onPress={() => this.setState({ backColor: "#B9C6AE" })}
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: "#B9C6AE",
                    borderRadius: 50 / 2,
                  }}
                />
              </View>
            </View>

            <View style={Styles.buttonContainer}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("Chat", {
                    name: this.state.name,
                    backColor: this.state.backColor,
                  })
                }
              >
                <Text style={Styles.chatButton}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

//this is the stylinf of all the above components displayed on the home page
const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    alignItems: "center",
    justifyContent: "center",

  },
  container2: {
    justifyContent: "flex-end",
    height: "44%",
    width: "88%",
    marginBottom: 20,
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: "#ffffff",
    position: "absolute",
    bottom: 0,
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  chatButton: {
    paddingTop: 15,
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "#757083",
    height: 50,
  },

  input: {
    paddingLeft: 10,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginTop: 0,
  },
  colorBox: {
    flex: 1,
    justifyContent: "flex-end",
  },
  colorButtons: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    opacity: 0.7,
  },
});
