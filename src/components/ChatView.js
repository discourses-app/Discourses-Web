import React from 'react';
import ChatBubble from './ChatBubble'
import { db } from '../firebase.js'

class ChatView extends React.Component {

    constructor() {
        super()
        this.state = {
            selectedChannel: '',
            selectedChannelChats: [],
            channels: [],
            message: ""
        }
    }

    componentDidMount() {
        this.getData()
        this.listenForMessages()
    }

    listenForMessages = () => {
        db.collection('Classes').onSnapshot(
            (snapshot) => {
                // Loop through the snapshot and collect
                // the necessary info we need. Then push
                // it into our array
                // const allMessages = [];
                // snapshot.forEach((doc) => allMessages.push(doc.data()));
                console.log('HIHIHI', snapshot)
                // Set the collected array as our state
                // setMessages(allMessages);
            },
            (error) => console.error(error)
        );
    };

    getData = async () => {
        // this.streamDocument()
        const Classes = db.collection('Classes');
        const Channels = await Classes.get();
        let availableGroups = []
        Channels.forEach(async (channel) => {

            const Messages = db.collection('Classes').doc(channel.id).collection('messages')
            const MessageId = await Messages.orderBy('date').get()
            let arrayOfMessages = []
            MessageId.forEach(message => {
                // console.log(message.id, '=>', message.data().sender, 'says: ', message.data().content)
                arrayOfMessages.push(message.data().content)
            })
            availableGroups.push({
                name: channel.id,
                chats: arrayOfMessages
            })
            this.setState({
                channels: availableGroups
            })
        });

    }

    renderChats = () => {
        return <ChatBubble channels={this.state.selectedChannelChats} />
    }

    writeData = async () => {
        // add a new message with an auto generated id.
        // below is the firestore date type
        // const timestamp = firebase.firestore.Timestamp.fromDate(new Date())

        const timestamp = new Date() / 1000;
        const res = await db.collection('Classes').doc(this.state.selectedChannel).collection('messages').add({
            content: this.state.message,
            date: timestamp,
            sender: 'Sanya S'
        })
        this.setState({ message: "" })
        document.getElementById('message').value = ''
    }

    changeSelectedChannel = (e) => {
        e.preventDefault()
        this.setState({
            selectedChannel: e.target.value
        })
        console.log('state: ', this.state.selectedChannel)
        let allChannels = this.state.channels
        let desiredChannel = allChannels.filter(channel => { return channel.name === e.target.value })
        this.setState({
            selectedChannelChats: desiredChannel
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-2" style={{ backgroundColor: '#b4da55' }}>
                    <button type="button" onClick={this.getData}>get data</button>
                    <div>
                        {this.state.channels.map(channel => <div><button type="button" class="btn btn-secondary btn-lg btn-block" onClick={this.changeSelectedChannel} style={{ fontSize: 14 }} value={channel.name}>{channel.name}</button></div>)}
                    </div>
                </div>
                <div className="col-sm-10" style={{ backgroundColor: '#f42069' }}>
                    <ChatBubble channels={this.state.selectedChannelChats} />
                    {/* <button type="button" onClick={this.writeData}>Write Data</button> */}
                    <input type="text" id="message" onChange={(e) => {
                        this.setState({ message: e.target.value })
                        console.log(this.state.message)
                    }}></input>
                    <button type="button" onClick={this.writeData}>Send</button>
                </div>
            </div>
        )
    }
}

export default ChatView;
