// import './App.css';
import React from 'react';
import FormComponent from '../FormComponent/FormComponent'
import NotificationComponent, { notify } from '../Notification/Notification'
import AppBarComponent from '../AppBar/AppBar'
import { Container, Button, createMuiTheme, CssBaseline, Box } from '@material-ui/core'
import { ThemeProvider } from "@material-ui/styles";
const { hasCookie } = require('../../Utililty/CookieManager')
const { messageHandler } = require('../../Utililty/MessageHandler')

var client = new WebSocket('ws://127.0.0.1:1337/ws')  
const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

class App extends React.Component{
  
  state = {
    userName: null,
    userColor: null,
    ws: null,
    disconnected: false,
    formFields: [{
      'type': 'text',
      'question': 'are you okay?',
      'by': 'uddeshya singh',
      'id': 1
    }],
    userList : [],
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
    if (messageData['messageType'] === 'welcome') {
      messageHandler(messageData, this.stateUpdateMount)
    } else if (messageData['messageType'] === 'user-joined'){
      messageHandler(messageData, notify)
    } else if (messageData['messageType'] === 'updater') {
      messageHandler(messageData, notify)
    }
  }
  closeSocket = (event) => {
    console.log("You are discssconnected")
    this.setState({disconnected: true})
    setTimeout(()=>{
      console.log("Retrying connection")
      client = new WebSocket('ws://127.0.0.1:1337/ws')
      client.addEventListener('open', this.openEventListener)
      client.addEventListener('message', this.incomingMessageListener)
      client.addEventListener('close', this.closeSocket)
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
      userColor: colour
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
            <AppBarComponent />
            <NotificationComponent />
          </Box>
          <Container style={{marginTop:"50px", textAlign:'center'}}>
            {customWelcome()}
            <Button variant="contained">
              Add new 
            </Button>
            <Container style={{marginTop:"20px"}}>
              {items}
            </Container>
          </Container>
        </div>
      </ThemeProvider>
    )
  }
}

export default App;
