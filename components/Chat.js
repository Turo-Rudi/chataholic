import React, { Component } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {
  constructor(props) {
    super(props);
    // web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyDrt1u5WqtYRXp43O_WtUI-mVQD4XEUfVc",
      authDomain: "chataholic-1.firebaseapp.com",
      projectId: "chataholic-1",
      storageBucket: "chataholic-1.appspot.com",
      messagingSenderId: "511488166751",
      appId: "1:511488166751:web:36266d0e79f9f3951984ea",
      measurementId: "G-G2MPT02BRR"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.state = {
      messages: [],
      uid: 0,
      bgColor: this.props.route.params.bgColor,
    }
  }

  componentDidMount() {
    // this.setState({
    //   messages: [
    //     {
    //       _id: 2,
    //       text: `Welcome to the chat ${this.props.route.params.name}!`,
    //       createdAt: new Date(),
    //       system: true,
    //     },
    //   ],
    // });
    // const { name } = this.props.route.params;
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Goes through each message document
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    })
  };

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage();
      },
    );
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
    )
  }

  render() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={styles.container}>
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
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // bgColor: this.state.bgColor,
  }
});