import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";
function Chat({chat,messages}) {
    const [user]=useAuthState(auth)
  return (
    <Conteiner>
      <Head>
        <title>Chat To {getRecipientEmail(chat.users,user)}</title>
      </Head>
      <Optional>
      <Sidebar />
      </Optional>
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages}/>
      </ChatContainer>
    </Conteiner>
  );
}
 
export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();
    const messages=messagesRes.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
    })).map(messages=>({
        ...messages,
        timestamp:messages.timestamp.toDate().getTime()
    }))
    const chatRes=await ref.get()
    const chat={
        id:chatRes.id,
        ...chatRes.data()
    }
    return {
        props:{
            messages:JSON.stringify(messages),
            chat:chat
        }
    }
}
const Conteiner = styled.div`
  display: flex;
`;
const Optional = styled.div`
   @media (max-width: 784px) {
    display:none;
  }
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
