import React from 'react';
import { Dialog, TextField, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Button } from '@material-ui/core'
const { hasCookie } = require('../../Utililty/CookieManager')
 
class NewElementForm extends React.Component {
  state = {
    ws: null,
    newQuestion: '',
    newTitle: '',
  }
  componentDidMount() {
    this.setState({
      ws: this.props.webSocket
    })
  }
  handleClose = () => {
    this.setState({
      newQuestion: '',
      newTitle: '',
    })
    this.props.closeDialog()
  }
  handleSubmit = () => {
    let obj = hasCookie()
    console.log("in submit", this.state)
    this.props.webSocket.send(JSON.stringify({
      entryToken: obj.entryToken,
      messageType: 'add element',
      question: this.state.newQuestion,
      title: this.state.newTitle
    })
    )
    this.setState({
      newQuestion: '',
      newTitle: '',
    })
    this.props.closeDialog()
  }
  titleChangeHandler = (event) => {
    this.setState({newTitle: event.target.value});
  }
  questionChangeHandler = (event) => {
    this.setState({newQuestion: event.target.value});
  }
  render() {
    const submit = (
      this.state.newQuestion && this.state.newTitle ? 
      <Button onClick={this.handleSubmit} variant="outlined" >
        Submit
      </Button> : 
      <Button onClick={this.handleSubmit} variant="outlined" disabled>
        Submit
      </Button>
    )
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}> 
        <DialogTitle id="form-dialog-title">
          <div style={{display: 'flex'}}>
            <div style={{flex: 1}}>
              Create New Question
            </div>
            <Avatar style={{backgroundColor:this.props.colour, marginLeft: '5px'}} alt={this.props.userName}>
              {this.props.userName && this.props.userName.substring(0,2)}
            </Avatar>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
              Please enter the title of the question and the main question in the given text fields
          </DialogContentText>
          <TextField 
            autoFocus
            margin="dense"
            id="standard-required-title"
            color="secondary"
            label="Title"
            type="text"
            onChange={this.titleChangeHandler}
            required={true}
            fullWidth
          />
          <TextField 
            margin="dense"
            id="standard-required"
            label="Question"
            color="secondary"
            type="text"
            required={true}
            onChange={this.questionChangeHandler}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} variant="outlined">
            Cancel
          </Button>
          {submit}
        </DialogActions>
      </Dialog>
    )
  }
}

export default NewElementForm