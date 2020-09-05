import React from 'react';

function ChatBubble(props) {
    const { channels } = props
    console.log(channels)

    return <div>{channels.map(channel => <div><h4>{channel.name}</h4><p>
        {channel.chats.map(chat => <p>{chat}</p>)}
    </p></div>)}</div>
}

export default ChatBubble;