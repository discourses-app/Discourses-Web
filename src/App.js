import React from 'react';
import './App.css';
import { db } from './firebase.js'
import ChatView from './components/ChatView'

class App extends React.Component {

  render() {
    return (
      <ChatView />
    );
  }

}

export default App;
