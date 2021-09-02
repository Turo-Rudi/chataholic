import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default class Chat extends Component {
  constructor(props) {
    super(props);

    // web app's Firebase configuration
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDrt1u5WqtYRXp43O_WtUI-mVQD4XEUfVc",
        authDomain: "chataholic-1.firebaseapp.com",
        projectId: "chataholic-1",
        storageBucket: "chataholic-1.appspot.com",
        messagingSenderId: "511488166751",
        appId: "1:511488166751:web:36266d0e79f9f3951984ea",
        measurementId: "G-G2MPT02BRR",
      });
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      isConnected: false,
      backgroundColor: this.props.route.params.backgroundColor,
      image: null,
      location: null,
    };
  }

  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `Welcome ${this.props.route.params.name}!` });
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
        // Firebase authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: name,
              avatar: 'https://placeimg.com/140/140/any',
            },
            messages: [],
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log('offline');
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  addMessages() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      uid: this.state.uid,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Goes through each message document
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || '',
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    })
  };

  onSend = (messages = []) => {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: '#DCF8C6' },
          left: { backgroundColor: '#075e54' }
        }}
        textStyle={{
          right: { color: '#000' },
          left: { color: '#fff' }
        }}
        timeTextStyle={{
          right: { color: '#000' },
          left: { color: '#000' }
        }}
      />
    )
  }

  renderInputToolbar = (props) => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{ latitude: currentMessage.location.latitude, longitude: currentMessage.location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421, }}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.state.backgroundColor }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}
