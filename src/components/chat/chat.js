import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';

import * as firebase from 'firebase';
import Message from './message';
import TripToolbar from '../trips/trip_toolbar';
import Icon from 'react-native-vector-icons/Entypo';

const window = Dimensions.get('window');

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      messages: [],
      submitButtonActive: false
    };
    this.tripID = props.navigation.state.params.id;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.redirectToMap = this.redirectToMap.bind(this);
    this.scrollToEnd = this.scrollToEnd.bind(this);
    this.submitButtonColor = this.submitButtonColor.bind(this);
  }

  componentWillMount() {
    const messagesRef = firebase.database()
                                .ref(`/messages/${this.tripID}`);
    messagesRef.on("value", snap => { if (snap.val()) {
      this.setState({
        messages: Object.values(snap.val())
      });
    }});
  }

  handleChange(text) {
    this.setState({ body: text });
    if (!text) {
      this.setState({ submitButtonActive: false });
    } else {
      this.setState({ submitButtonActive: true });
    }
  }

  handleSubmit() {
    if (this.state.submitButtonActive) {
      this.props.postMessage(this.state,
        this.props.currentUser,
        this.tripID);
        this.setState({ body: '', submitButtonActive: false });
    }
  }

  redirectToMap() {
    this.props.navigation.navigate("TripMap", { id: this.tripID });
  }

  scrollToEnd() {
    this.flatListRef.scrollToEnd({animated: false});
  }

  submitButtonColor() {
    if (this.state.submitButtonActive) {
      return '#1F2B4B';
    } else {
      return '#90939b';
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}>
          <TripToolbar
            type="chat"
            tripID={this.tripID}
            title={this.props.currentUser.trips[this.tripID]}
            navigation={this.props.navigation}
          />

        <View style={styles.chat} >
          <FlatList
            keyExtractor={item => item.id}
            ref={ref => { this.flatListRef = ref; }}
            onContentSizeChange={this.scrollToEnd}
            data={this.state.messages}
            renderItem={item => <Message message={item} />}
            />
          <View style={styles.inputContainer}>
            <TextInput placeholder="Send a message"
              style={styles.input}
              value={this.state.body}
              multiline={true}
              onChange={this.scrollToEnd}
              onChangeText={(text) => this.handleChange(text)}/>
            <Icon name='chevron-with-circle-right'
              size={ 34 }
              color={this.submitButtonColor()}
              onPress={this.handleSubmit}/>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: window.width,
    marginHorizontal: 0
  },
  chat: {
    flex: 1,
    justifyContent: 'center',
    width: window.width - 30,
    marginHorizontal: 10,
    paddingTop: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  input: {
    height: 35,
    borderRadius: 2,
    fontSize: 18,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: window.width - 80,
  }
});
