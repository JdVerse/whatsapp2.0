import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { FiMoreVertical } from "react-icons/fi";
import { ImAttachment } from "react-icons/im";
import { BsEmojiLaughing } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { auth, db } from "../firebase";
import { useEffect, useState, useRef } from "react";
import InputEmoji from 'react-input-emoji'
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import firebase from "firebase";
import MyMessage from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
function ChatScreen({ chat, messages }) {
  const [ text, setText ] = useState('')
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const endOfMessage = useRef(null);
  const router = useRouter();
  const getBack=()=>{
    router.push("/")
  }
  const [messageSnapShot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const [recipientSnapShot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );
  const  handleOnEnter =()=> {
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    ScrollToBottom();
  }
  const showMessages = () => {
    if (messageSnapShot) {
      return messageSnapShot.docs.map((message) => (
        <MyMessage
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
   else {
      return JSON.parse(messages).map((message) => (
        <MyMessage key={message.id} user={message.user} message={message} />
      ));
    }
  };
  const ScrollToBottom = () => {
    endOfMessage.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const submit = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    ScrollToBottom();
  };
  const recipient = recipientSnapShot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInfo>
          <h3>{recipientEmail.split("@gmail.com")}</h3>
          {recipientSnapShot ? (
            <p>
              last seen:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading LastActive</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <FiMoreVertical />
          </IconButton>
          <IconButton>
            <ImAttachment />
          </IconButton>
        </HeaderIcons>
      </Header>
      <Back onClick={getBack}>
            <IconButton>
                <BiArrowBack/>
            </IconButton>
      </Back>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessage} />
      </MessageContainer>
      <InputContainer>
      <InputEmoji
          value={input}
          onChange={setInput}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type a message"
        />
        <Mybutton type="submit" onClick={submit} disable={input} >Send</Mybutton>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;
const Container = styled.div``;
const Mybutton = styled.button`
  @media (max-width: 784px) {
    display:block;
    outline:none;
    border:none;
    padding:5px;
    margin-right:15px;
    border-radius:5px;
  }
  @media (min-width: 784px) {
    display:none; 
  }
`;
const Back = styled.div`
  @media (min-width: 784px) {
    display:none;
  }
position:absolute;
margin:8px;
display: flex;
align-items:center;
justify-content:center;
border-radius:5px;
height: 35px;
width: 35px;
background-color:white;
z-index:1000;
`;
const Header = styled.div`
position:sticky;
background-color:white;
z-index:100;
top:0;
display:flex;
padding:11px;
@media (max-width: 768px) {
  padding:11px;
  }
height:80px;
align-items:center;
border-bottom:1px solid whitesmoke;
`;
const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: -15px;
    @media (max-width: 768px) {
    font-size:17px;
  }
  }
  > p {
    font-size: 14px;
    color: grey;
  }
`;
const HeaderIcons = styled.div`
 @media (max-width: 768px) {
    display:none
  }
`;
const MessageContainer = styled.div`
  padding: 30px;
  padding-bottom: 90px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
const EndOfMessage = styled.div`
padding-bottom:55px;
`;
const InputContainer = styled.form`
display:flex;
align-items:center;
padding:0px;
position:sticky;
bottom:0;
background-color:white;
z-index:100;
@media (max-width: 784px){
  width:90vw;
  position:absolute;
  margin-bottom:60px;
  margin-left:30px;
  border-radius:15px
}
>input{
    border:none;
    outline:0;
    border-radius:10px;
    flex:.90;
    align-items:center;
    padding:5px;
    margin-left:15px;
    margin-right:15px;
    position:sticky;
    bottom:0;
    background-color:whitesmoke; 
}
}
`;
