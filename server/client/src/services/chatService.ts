import httpService, { endpoints } from "./httpService";
import { chatDispatch } from "../store/chatsSlice";
import Chat from "../types/chat";
import store from "../store";

const { commentEndpoint } = endpoints;

const getChats = async () => {
  try {
    const result = await httpService.get(commentEndpoint);
    const data = result.data.data ?? [];
    chatDispatch.set(data);
  } catch (e) {
    console.log(e.message);
  }
};

const addChat = async (chat: Chat) => {
  const newChat: any = { ...chat };
  delete newChat.id;

  chatDispatch.addChat({ ...newChat, notSent: true});

  try {
    await httpService.post(commentEndpoint, newChat);
    const { chats } = store.getState();
    if (chats.length > 15) deleteChat(chats[chats.length - 1].id);
  } catch (error) {
    console.log(error);
    chatDispatch.updateChat(newChat);
  }

  return;
};

const deleteChat = (id: string) => {
  return httpService
    .post(endpoints.deleteComment, { id })
    .then(() => chatDispatch.removeChat(id));
};

const chatService = { addChat, getChats, deleteChat };

export default chatService;
