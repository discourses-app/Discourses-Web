import React from 'react';
import './App.css';
import { db } from './firebase.js'
import ChatView from './components/ChatView'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      chats: [],
      channels: []
    }
  }

  writeData = async () => {
    // db.collection("World").doc("States").collection("West Coast").doc("finally").set({
    //   name: "California"
    // })
    //   .then(() => {
    //     console.log("Document successfully written!");
    //   })
    //   .catch((error) => {
    //     console.error("Error writing document: ", error);
    //   });
    alert('i just told u not to press write data bro')
  }

  getData = async () => {

    const Classes = db.collection('Classes');
    const Channels = await Classes.get();
    let availableGroups = []
    Channels.forEach(async (channel) => {
      const Messages = db.collection('Classes').doc(channel.id).collection('messages')
      const MessageId = await Messages.get()
      let arrayOfMessages = []
      MessageId.forEach(message => {
        // console.log(message.id, '=>', message.data().sender, 'says: ', message.data().content)
        arrayOfMessages.push(message.data().content)
      })
      availableGroups.push({
        name: channel.id,
        chats: arrayOfMessages
      })
      this.setState({ chats: arrayOfMessages })
    });

    this.setState({
      channels: availableGroups
    })
  }

  render() {
    return (
      /* <h6>DO NOT PRESS 'WRITE DATA' UNLESS U WANNA MESS UP YOUR RECORDS</h6>
        <button type="button" onClick={this.writeData}>Write data</button>
        <button type="button" onClick={this.getData}>Get data</button>
        <ChatBubble channels={this.state.channels} /> */
      <ChatView />
    );
  }

}

export default App;
