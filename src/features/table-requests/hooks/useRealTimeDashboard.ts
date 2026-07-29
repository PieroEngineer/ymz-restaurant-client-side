import { MOCK_MENU_RESTAURANT_ID } from "@/features/menu/api/menuApi";
import type { Message } from "ably";
import { useChannel } from "ably/react";

export const useRealTimeDashboard = (onRequestUpdate: (eventName: string, data: Message) => void, onOrderUpdate: (eventName: string, data: Message) => void) => {

    const channelName = `restaurant:${MOCK_MENU_RESTAURANT_ID}:ops`;

    /* const { channel } = */ useChannel(channelName, (message) => {
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