import React from "react";
import { View, Text } from "react-native";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backColor: this.props.route.params.backColor
    }
  }
  render() {
    let name = this.props.route.params.name;
    // OR ...
    // let { name } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ flex: 1, backgroundColor: this.state.backColor }}>
        {/* Rest of the UI */}
      </View>
    );
  }
}
