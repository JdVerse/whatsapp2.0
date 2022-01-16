import Head from "next/head";
import styled from "styled-components";
import {ImWhatsapp} from "react-icons/im";
import { Avatar, IconButton,Button } from "@material-ui/core";
import { auth, provider } from "../firebase";

function Login() {
    const signIn=()=>{
        auth.signInWithPopup(provider).catch(alert)
    }
  return (
    <Container>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="https://web.whatsapp.com/favicon.ico" />
      </Head>
      <LoginContainer>
            <MyLogo />
            <MyButton onClick={signIn}>
                Sign In With Google
            </MyButton>
      </LoginContainer>
    </Container>
  );
}

export default Login;
const Container = styled.div`
display:grid;
place-items:center;
height:100vh;
background-color:whitesmoke
`;
const LoginContainer = styled.div`
display:flex;
flex-direction: column;
border: 2px solid whitesmoke;
padding: 40px;
background-color:white;
border-radius:20px;
box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
`;
const MyLogo = styled(ImWhatsapp)`
font-size:150px;
padding-left:20px;
color:#69ff1f;
`;
const MyButton = styled(Button)`
&&&{
    margin-top: 30px;
    border:2px solid whitesmoke;
}
`;