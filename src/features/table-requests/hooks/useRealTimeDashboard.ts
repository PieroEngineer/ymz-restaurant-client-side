import type { Message } from "ably";
import { useChannel } from "ably/react";

export const useRealTimeDashboard = (
    onRequestUpdate: (eventName: string, data: Message) => void,
    onOrderUpdate: (eventName: string, data: Message) => void,
    realTimeChannelName: string
) => {

    /* const { channel } = */ useChannel(realTimeChannelName, (message) => {
        if(message.name !== undefined){
            console.log(`🔎📩  Websockets data :\n ${JSON.stringify(message)}`)
            onRequestUpdate(message.name, message.data)
            onOrderUpdate(message.name, message.data)
        }
        else{
            console.warn("⚠️  Received a message without a name");
        }

    })


}