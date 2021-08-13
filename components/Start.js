import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ImageBackground, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bgColor: '#DCF8C6' //light green
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.bg} source={require('../assets/bg.png')}>

          <View style={styles.main}>
            <Text style={styles.title}>Welcome to Chataholic!</Text>
          </View>
          <View style={styles.box}>
            <TextInput style={styles.nameInput}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Enter your name' />

            <View>
              <Text style={styles.chooseBgColor}>Select a background color</Text>
              <View style={styles.bgColor}>
                <TouchableOpacity
                  style={styles.color1}
                  onPress={() => this.setState({ backgroundColor: '#090C08' })}
                />
                <TouchableOpacity
                  style={styles.color2}
                  onPress={() => this.setState({ backgroundColor: '#474056' })}
                />
                <TouchableOpacity
                  style={styles.color3}
                  onPress={() => this.setState({ backgroundColor: '#8A95A5' })}
                />
                <TouchableOpacity
                  style={styles.color4}
                  onPress={() => this.setState({ backgroundColor: '#B9C6AE' })}
                />
              </View>
            </View>
            <Button
              accessible={true}
              accessibilityLabel="Enter chat"
              accessibilityHint="Takes you to the chat screen."
              accessibilityRole="button"
              style={styles.button, { backgroundColor: this.state.backgroundColor }} title="Enter chat" onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, backgroundColor: this.state.backgroundColor })} />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // App container
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  main: {
    flex: 0.7,
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // user box
  box: {
    minHeight: 260,
    height: '44%',
    backgroundColor: '#fff',
    width: '88%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: '6%',
    paddingRight: '6%',
    borderRadius: 10,
  },
  nameInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    paddingLeft: 15,
  },
  // Text for choosing BG color
  chooseBgColor: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 20,
    alignSelf: 'center',
  },
  bgColor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // choosing background colors
  color1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  color2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  color3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  color4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  // button
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757083',
    textAlign: 'center',
  },
});