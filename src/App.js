import React from 'react';
import './App.css';
import { db } from './firebase.js'
import ChatView from './components/ChatView'
import SignUp from './components/SignUp'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false
    }
  }

  authenticateUsers = () => {
    this.setState({ isAuthenticated: true })
  }

  render() {
    return (
      <div>
        {this.state.isAuthenticated ? <ChatView /> : <SignUp auth={this.authenticateUsers} />}
      </div>
    );
  }

}

export default App;
