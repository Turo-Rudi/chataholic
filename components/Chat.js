import React, { Component } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, Text, Button } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello world!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: `Welcome to the chat ${this.props.route.params.name}!`,
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#DCF8C6',
          },
          left: {
            backgroundColor: '#075e54',
          },
        }}
        textStyle={{
          right: {
            color: '#000',
          },
          left: {
            color: '#fff',
          },
        }}
      />
    );
  }

  render() {
    let { name, bgColor } = this.props.route.params;
    //or let {name}=this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={[styles.bgColor(bgColor), styles.container]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ? (<KeyboardAvoidingView behavior="height" />) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});