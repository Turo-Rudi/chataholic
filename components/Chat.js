import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Chat extends Component {
  componentDidMount() {
    let name = this.props.route.params.name;
    //or let {name}=this.props.route.params;
    this.props.navigation.setOptions({ title: name });
  }

  render() {
    return (
      <View style={styles.container, { backgroundColor: this.props.route.params.bgColor }}>
        <Text>Start to chat!</Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});