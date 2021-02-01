import './App.css';
import React from 'react';
import FormComponent from '../FormComponent/FormComponent'
import { Container, Button, Paper } from '@material-ui/core'
// import { w3cwebsocket as W3CWebSocket } from 'websocket'
// import { makeStyles } from '@material-ui/core/styles'

const client = new WebSocket('ws://127.0.0.1:1337/ws')

const firstNames = ['Chunky', 'Anonymous', 'Rebel']
const secondNames = ['Panda', 'Giraffe', 'Racoon', 'Fizz', 'Siphon', 'Shwarma']

class App extends React.Component{
  
  state = {
    userName: null,
    userColor: null,
    formFields: [{
      'type': 'text',
      'question': 'are you okay?',
      'by': 'uddeshya singh',
      'id': 1
    },{
      'type': 'text',
      'question': 'You kidding me right?',
      'by': 'one more',
      'id': 2
    },{
      'type': 'text',
      'question': 'no shit sherlock',
      'by': 'someone else',
      'id': 3
    }]
  }

  componentDidMount() {
    let firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    let secondName = secondNames[Math.floor(Math.random() * secondNames.length)]
    this.setState({
      userName: firstName + " " + secondName
    })
    client.onopen = () => {
      console.log('Websocket Client Connected')
      client.send(JSON.stringify({
        message: this.state.userName,
        messageType: 'helloworld'
      }))
    }
    client.onmessage = (message) => {
      console.log(message)
    }
    console.log("in component mount");
    // get information from user
  }
  itemCallback = async (data) => {
    console.log('oolllaaa')
  }
  render() {
    
    const items = this.state.formFields.map((item) => 
      <div key={item.id}>
        <FormComponent itemData={item} callback={this.itemCallback} />
        <br></br>
      </div>
    )
    return (
      <div className="App">
        <div className="App-header">
          <Container style={{marginTop:"20px"}}>
            <h1>Welcome to your blank form playground </h1>
            <Button variant="contained">
              Add new 
            </Button>
            <Container style={{marginTop:"20px"}}>
              {items}
            </Container>
          </Container>
        </div>
      </div>
    )
  }
}

export default App;
