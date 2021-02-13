// import './App.css';
import React from 'react';
import FormComponent from '../FormComponent/FormComponent'
import NewElementForm from '../NewElementForm/NewElementForm'
import NotificationComponent, { notify } from '../Notification/Notification'
import LogoCircle, { populateList } from '../LogoCircle/LogoCircle'
import AppBarComponent from '../AppBar/AppBar'
import { Container, Button, createMuiTheme, CssBaseline, Box, Typography } from '@material-ui/core'
import { ThemeProvider } from "@material-ui/styles";
const { hasCookie, DeleteCookie } = require('../../Utililty/CookieManager')
const { messageHandler, logoutHandler } = require('../../Utililty/MessageHandler')

var client = new WebSocket('wss://limitless-crag-68335.herokuapp.com/ws')  
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
          <Typography variant="h5"> Thanks for trying out our app, hope to see you soon again <span role="img" aria-label="smile">😃</span></Typography>
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
    formFields: [],
    userList : [],
    newOpen: false,
  }
  handleLogout = () => {
    let obj = hasCookie()
    logoutHandler(obj.entryToken)
    DeleteCookie(['entryToken'])
    this.setState({
      logout: true
    })
  }
  handleNewDialogClose = () => {
    this.setState({
      newOpen: false
    })
  }
  handleNewDialogOpen = () => {
    this.setState({
      newOpen: true
    })
  }
  handleFormHistory = (formData) => {
    // formData.unshift({
    //   CreatedAt: "2021-02-11T00:01:41.448423435+05:30",
    //   IsDeleted: false,
    //   Versions: [
    //     {
    //       EditedBy: {
    //         JoinedAt: "2021-02-11T00:01:07.446153302+05:30",
    //         colour: "DarkKhaki",
    //         entryToken: "dWhqcnh3dnR1bTE2MTI5ODE4Njc0NDYxNDgyOTg=",
    //         ipAddress: "127.0.0.1:33700",
    //         userName: "JANEDOE",
    //       },
    //       actionPerformed: "create",
    //       editedAt: "2021-02-11T00:01:41.448423609+05:30",
    //       question: "Question Text",
    //       title: "Question Title"
    //     }
    //   ],
    //   id: -99,
    //   question: "Question Text",
    //   title: "Question Title",
    // })
    console.log("To update the forms: ", formData)
    this.setState({
      formFields: formData
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
    } else if (messageData['MessageType'] === 'formUpdater') {
      messageHandler(messageData, this.handleFormHistory)
    } else if (messageData['MessageType'] === "already-deleted" || messageData['MessageType'] === "current-locked" || messageData['MessageType'] === "delete-confirmed") {
      messageHandler(messageData, notify)
    }
  }
  closeSocket = (event) => {
    console.log("You are disconnected")
    this.setState({disconnected: true})
    setTimeout(()=>{
      if (!this.state.logout) {
        console.log("Retrying connection")
        client = new WebSocket('wss://limitless-crag-68335.herokuapp.com/ws')
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
    const items = this.state.formFields.map((item, i) => 
      <div key={i}>
        <FormComponent
          itemData={item}
          callback={this.itemCallback}
          itemId={i}
          socket={this.state.ws}
          currName={this.state.userName}
          currColor={this.state.userColor}
        />
        <br></br>
      </div>
    )
    const customWelcome = () => {
      if (this.state.userColor && this.state.userName) {
        return <h1 style={{color:this.state.userColor}}> {this.state.userName}, Welcome to your blank form playground! 🌈</h1>
      } else {
        return <h1>We are trying to log you in, the room must be full, hang tight <span role="img" aria-label="smile">😅</span>, okay?</h1>
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
              <Button variant="contained" onClick={this.handleNewDialogOpen}>
                Add new 
              </Button>
              <NewElementForm
                open={this.state.newOpen}
                colour={this.state.userColor}
                userName={this.state.userName}
                closeDialog={this.handleNewDialogClose}
                webSocket={this.state.ws}
              />
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
