// import './App.css';
import React from 'react';
import FormComponent from '../FormComponent/FormComponent'
import NotificationComponent, { notify } from '../Notification/Notification'
import LogoCircle, { populateList } from '../LogoCircle/LogoCircle'
import AppBarComponent from '../AppBar/AppBar'
import { Container, Button, createMuiTheme, CssBaseline, Box, Typography } from '@material-ui/core'
import { ThemeProvider } from "@material-ui/styles";
const { hasCookie, DeleteCookie } = require('../../Utililty/CookieManager')
const { messageHandler, logoutHandler } = require('../../Utililty/MessageHandler')

var client = new WebSocket('ws://127.0.0.1:1337/ws')  
const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

class Logout extends React.Component {
  render() {
    return (        
      <div className="Logout">
        <Container style={{marginTop:"50px", textAlign:'center'}}>
          <Typography variant="h5"> Thanks for trying out our app, hope to see you soon again 😃</Typography>
          <Typography variant="h5"> Pssst... you can reload the page to try and reconnect!</Typography>
        </Container>
      </div>
    )
  }
}

class App extends React.Component{
 
  state = {
    userName: null,
    userColor: null,
    ws: null,
    disconnected: false,
    logout: false,
    formFields: [{
      'type': 'text',
      'question': 'are you okay?',
      'by': 'uddeshya singh',
      'id': 1
    }],
    userList : [],
  }
  handleLogout = () => {
    console.log("Logout triggered")
    let obj = hasCookie()
    logoutHandler(obj.entryToken)
    DeleteCookie(['entryToken'])
    this.setState({
      logout: true
    })
  }
  openEventListener = (event) => {
    let obj = hasCookie()
    this.setState({ws: client, disconnected: false})
    console.log('Websocket Client Connected')
    client.send(JSON.stringify({
      messageType: 'room entry',
      entryToken: obj.entryToken
    }))
  }
  incomingMessageListener = (message) => {
    let messageData = JSON.parse(message.data) 
    console.log(messageData)
    if (messageData['MessageType'] === 'welcome') {
      messageHandler(messageData, this.stateUpdateMount)
    } else if (messageData['MessageType'] === 'user-joined'){
      messageHandler(messageData, notify)
    } else if (messageData['MessageType'] === 'updater') {
      messageHandler(messageData, populateList)
    } else if (messageData['MessageType'] === 'user-logout') {
      messageHandler(messageData, notify)
    } else if (messageData['MessageType'] === 'disconnect') {
      messageHandler(messageData, this.handleLogout)
    }
  }
  closeSocket = (event) => {
    console.log("You are disconnected")
    this.setState({disconnected: true})
    setTimeout(()=>{
      if (!this.state.logout) {
        console.log("Retrying connection")
        client = new WebSocket('ws://127.0.0.1:1337/ws')
        client.addEventListener('open', this.openEventListener)
        client.addEventListener('message', this.incomingMessageListener)
        client.addEventListener('close', this.closeSocket)
      }
    }, 5000)
  }
  componentDidMount() {
    client.addEventListener('open', this.openEventListener)
    client.addEventListener('message', this.incomingMessageListener)
    client.addEventListener('close', this.closeSocket)
    console.log("in component mount");
    // get information from user
  }

  stateUpdateMount = (userName, colour) => {
    this.setState({
      userName: userName,
      userColor: colour,
      logout: false
    })
  }

  render() {    
    const items = this.state.formFields.map((item) => 
      <div key={item.id}>
        <FormComponent itemData={item} callback={this.itemCallback} />
        <br></br>
      </div>
    )
    const customWelcome = () => {
      if (this.state.userColor && this.state.userName) {
        return <h1 style={{color:this.state.userColor}}> {this.state.userName}, Welcome to your blank form playground! 🌈</h1>
      } else {
        return <h1>We are trying to log you in, the room must be full, hang tight 😅, okay?</h1>
      }
    }
    return ( 
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Box>
            <AppBarComponent logout={!this.state.logout} handleLogout={this.handleLogout}/>
            {this.state.logout && <Logout />}
          
            <NotificationComponent />
            {!this.state.logout && 
            <Container>
              <div style={{ justifyContent:'center', display:'flex'}}>
                <h3>Currently in room</h3>
              </div>
              <div style={{ justifyContent:'center', display:'flex'}}>
                <LogoCircle/>
              </div>
            </Container>
            }
          </Box>
          {!this.state.logout && 
          <Container style={{marginTop:"50px", textAlign:'center'}}>
            {customWelcome()}
              <Button variant="contained">
                Add new 
              </Button>
              <Container style={{marginTop:"20px"}}>
                {items}
              </Container>
          </Container>
          }
        </div>
      </ThemeProvider>
    )
  }
}

export default App;
