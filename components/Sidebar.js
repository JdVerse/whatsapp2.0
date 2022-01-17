import styled from "styled-components";
import { Avatar, IconButton, Button } from "@material-ui/core";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { FiMoreVertical } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import Chat from "../components/Chat";
function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db.collection("chats").where("users", "array-contains", user?.email);
  const [chatSnapShot] = useCollection(userChatRef);
  const createChat = () => {
    const input = prompt("Enter The Email Adress");
    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExist(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };
  // chat.data().users.find((user) => user[1] === recipientEmail)?.lenght > 0
  const chatAlreadyExist = (recipientEmail) =>
    !!chatSnapShot?.docs.find(
      (chat) =>
        chat.data().users[1] === recipientEmail
    );

  return (
    <Container>
      <Header>
        <IconButton>
          <UserAvatar
          src={user.photoURL}
            onClick={() => {
              auth.signOut();
            }}
          />
        </IconButton>
          <Name>
              {user.email.split("@gmail.com")}
          </Name>
      </Header>
      {/* <Search>
        <IconButton>
          <FaSearch />
        </IconButton>
        <SearchInput placeholder="Seach Here" />
      </Search> */}
      <SidebarButton onClick={createChat}>Start A New Chat</SidebarButton>
      {
        chatSnapShot?.docs.map((chat)=>(
          <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
        ))
      }
    </Container>
  );
}

export default Sidebar;
const Container = styled.div`
border-right:1px solid whitesmoke;
height:100vh;
min-width:300px;
overflow:scroll;
::-webkit-scrollbar{
  display:none
}
-ms-overflow-scrollbar:none;
scrollbar-width:none;
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  @media (max-width: 784px) {
    display:flex;
    justify-content:center;
  }
`;
const UserAvatar = styled(Avatar)`
  :hover {
    opacity: 0.8;
  }
`;
const IconsContainer = styled.div`
  @media (max-width: 784px) {
    display:none;
  }
`;
const Name = styled.div`
font-size:15px;
padding-left:15px;
color:black;
font-weight: bold;
`;
const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;
const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
`;
const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    font-weight: bold;
    border: 1px solid whitesmoke;
  }
`;
