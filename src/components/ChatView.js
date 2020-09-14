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
        this.listenForEnter()
    }

    listenForEnter = (event) => {
        let input = document.getElementById("message");

        input.addEventListener("keyup", (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                document.getElementById("submit").click();
            }
        });
    }

    listenForMessages = async () => {
        const Classes = db.collection('Classes');
        const Channels = await Classes.get();
        Channels.forEach(async (channel) => {
            db.collection('Classes').doc(channel.id).collection('messages').onSnapshot(async (snapshot) => {
                console.log('snapshot')
                await this.getData()
            })
        })
    };

    getData = async () => {
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
            console.log('inside getDAta')
            console.log(this.state.channels)
            if (this.state.selectedChannel !== '') {
                let allChannels = this.state.channels
                let desiredChannel = allChannels.filter(channel => { return channel.name === this.state.selectedChannel })
                this.setState({
                    selectedChannelChats: desiredChannel
                })
                this.renderChats()
            }
        });

    }

    renderChats = () => {
        return <ChatBubble channels={this.state.selectedChannelChats} />
    }

    writeData = async () => {
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
        console.log('target value', e.target.value)
        console.log(e)
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

    renderChats = () => {
        return <ChatBubble channels={this.state.selectedChannelChats} />
    }

    render() {
        return (
            <div className="row vh-100">
                <div className="col-sm-2" style={{ backgroundColor: '#C4C4C4', height: 100 + '%' }}>
                    <h1 style={{ textAlign: 'center' }}>Your Courses</h1>
                    <div style={{ marginRight: 0 }}>
                        {this.state.channels.map(channel => <div>
                            <button type="button" class="btn btn-secondary btn-lg btn-block" onClick={this.changeSelectedChannel}
                                style={{ fontSize: 14, backgroundColor: 'white', color: 'black', borderRadius: 10, marginBottom: 20, marginLeft: 3 + '%', width: 100 + '%' }}
                                value={channel.name}>
                                {channel.name.slice(0, channel.name.indexOf('*'))} {channel.name.slice(channel.name.indexOf('*') + 1, channel.name.lastIndexOf('*'))} {channel.name.slice(channel.name.lastIndexOf('*') + 1)}
                            </button>
                            <div role="button" onClick={this.changeSelectedChannel} value={channel.name} className="card" style={{ width: '13rem', cursor: "pointer", marginLeft: 3 + '%', borderRadius: 10, borderColor: 'black' }}>
                                <div className="card-body" style={{ textAlign: 'center', paddingTop: 5, paddingBottom: 0 }}>
                                    <h6 className="card-title">{channel.name.slice(0, channel.name.indexOf('*'))}</h6>
                                    <p className="card-subtitle mb-2 text-muted" style={{ fontSize: 12 }}>{channel.name.slice(channel.name.indexOf('*') + 1, channel.name.lastIndexOf('*'))} {channel.name.slice(channel.name.lastIndexOf('*') + 1)}</p>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className="col-sm-10 no-gutters" style={{ backgroundColor: '#526B83', marginLeft: 0, paddingLeft: 0 }}>
                    <p>{this.state.selectedChannel === ''
                        ?
                        <h1>No channel selected</h1>
                        :
                        <h1>{this.state.selectedChannel.slice(0, this.state.selectedChannel.indexOf('*'))}<span style={{ fontSize: 20, paddingLeft: 8 }}>{" ".concat(this.state.selectedChannel.slice(this.state.selectedChannel.indexOf('*') + 1, this.state.selectedChannel.lastIndexOf('*'))).concat(" - Lecture ").concat(this.state.selectedChannel.slice(this.state.selectedChannel.lastIndexOf('*') + 1))}</span></h1>
                    }
                    </p>
                    <div style={{ overflowY: 'scroll', border: '5px solid black', height: '80%', paddingLeft: 10 }}>
                        {this.state.selectedChannel === '' ? <h1 style={{ textAlign: 'center', marginTop: 300 }}>Pick a channel and start chatting away! :)</h1> : this.renderChats()}
                    </div>
                    <div className="row">
                        <div className="col-sm-11" style={{ marginRight: 0, paddingRight: 0 }}>
                            <input type="text" id="message" onChange={(e) => {
                                this.setState({ message: e.target.value })
                            }} style={{ width: '100%', height: '5rem', paddingRight: 0, marginRight: 0 }}></input>
                        </div>
                        <div className="col-sm-1 no-gutters" style={{ marginLeft: 0, paddingLeft: 0 }}>
                            <button type="submit" id="submit" onClick={this.writeData} style={{ width: '100%', height: '5rem' }}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatView;
