import React from 'react';
import ChatBubble from './ChatBubble'
import { db } from '../firebase.js'

class ChatView extends React.Component {

    constructor() {
        super()
        this.state = {
            selectedChannel: '',
            selectedChannelChats: [],
            channels: []
        }
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
            this.setState({
                channels: availableGroups
            })
        });

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
                </div>
            </div>
        )
    }
}

export default ChatView;
