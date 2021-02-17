import React from 'react';
import { Dialog, TextField, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar, Button, Typography } from '@material-ui/core'
const { hasCookie } = require('../../Utililty/CookieManager')
const { sendUnlockMessage } = require('../../Utililty/MessageHandler')

class EditElementDialog extends React.Component {
  state = {
    ws: null,
    newQuestion: '',
    newTitle: '',
  }
  componentDidMount() {
    this.setState({
      ws: this.props.ws,
      newQuestion: this.props.currItem.question,
      newTitle: this.props.currItem.title,
    })
  }
  handleClose = () => {
    let token = hasCookie().entryToken
    sendUnlockMessage(token, this.props.currItem.id)
    this.props.closeDialog()
  }
  handleSubmit = () => {
    let obj = hasCookie()
    this.state.ws.send(JSON.stringify({
      entryToken: obj.entryToken,
      messageType: 'edit',
      question: this.state.newQuestion,
      title: this.state.newTitle,
      formId: this.props.currItem.id
    }))
    this.setState({
      newQuestion: this.props.currItem.question,
      newTitle: this.props.currItem.title,
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
    
    const len = (this.props.currItem.Versions != null) ? this.props.currItem.Versions.length : 0
    // console.log("in len", (len > 0) ? this.state.versionState[len-1]['EditedBy'] : 'meh')
    const lastEditUser = (len > 0) ? this.props.currItem.Versions[len-1]['EditedBy']['userName'] : 'Jane Doe'
    const lastEditColor = (len > 0) ? this.props.currItem.Versions[len-1]['EditedBy']['colour'] : 'yellow'
    const lastEdited = (
      <div style={{display:'flex'}}>
        <Typography>Last Edited by <font style={{color: lastEditColor}}>{lastEditUser}</font></Typography>
      </div>
    )
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}> 
        <DialogTitle id="form-dialog-title">
          <div style={{display: 'flex'}}>
            <div style={{flex: 1}}>
              Edit Question
            </div>
            <Avatar style={{backgroundColor:this.props.currColor, marginLeft: '5px'}} alt={this.props.currName}>
              {this.props.currName && this.props.currName.substring(0,2)}
            </Avatar>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
              Please edit the question and/or title as you wish
          </DialogContentText>
          {lastEdited}
          <TextField 
            autoFocus
            margin="dense"
            id="standard-required-title"
            color="secondary"
            label="Title"
            type="text"
            onChange={this.titleChangeHandler}
            defaultValue={this.props.currItem.title}
            fullWidth
          />
          <TextField 
            margin="dense"
            id="standard-required"
            label="Question"
            color="secondary"
            type="text"
            defaultValue={this.props.currItem.question}
            onChange={this.questionChangeHandler}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} variant="outlined" disabled={this.state.newQuestion === this.props.currItem.question && this.state.newTitle === this.props.currItem.title}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default EditElementDialog