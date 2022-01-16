import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {useRouter} from "next/router"
function Chat({ id, users }) {
    const router=useRouter()  
    const [user]=useAuthState(auth)
    const [recipientSnapShot]=useCollection(db.collection("users").where("email","==",getRecipientEmail(users,user)))
    const recipient=recipientSnapShot?.docs?.[0]?.data()
    const recipientEmail=getRecipientEmail(users,user)
    const enterChat=()=>{
        router.push(`/chat/${id}`)
    }
    console.log(getRecipientEmail(users,user),users)
  return (
    <Container onClick={enterChat}>
      <IconButton>
          {
              recipient?(
                  <UserAvater src={recipient.photoURL}/>
                  ):(
                      <UserAvater>{recipientEmail[0]}</UserAvater>
              )
          }
      </IconButton>
      <Name>{recipientEmail.split("@gmail.com")}</Name>
    </Container>
  );
}

export default Chat;
const Container = styled.div`
  display: flex;
  align-items: center;
  cursor:pointer;
  word-break:break-word;
  :hover{
      background-color:whitesmoke;
  }
`;
const UserAvater = styled(Avatar)``;
const Name = styled.div`
  padding-left: 10px;
  font-weight:500;
`;
