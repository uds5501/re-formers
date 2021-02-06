import React from 'react';
import { Typography, Snackbar } from '@material-ui/core'
import ee from 'event-emitter'

const emitter = new ee();

export const notify = (msg) => {
  emitter.emit('notification', msg);
}
class NotificationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: '',
      open: false
    }
    this.timeout = null;
    emitter.on('notification', (name, color) => {
      this.onShow(name, color)
    })
  }

  onShow = (name, color) => {
    if(this.timeout) {
      clearTimeout(this.timeout)
      this.setState({
        open: false,
        name: '',
        color: '',
      }, () => {
        this.timeout = setTimeout(() => {
          this.showNotif(name, color);
        }, 500)
      })
    } else {
      this.showNotif(name, color)
    }
  }
  showNotif = (name, color) => {
    this.setState({
      open: true,
      name: name,
      color: color
    }, () => {
      this.timeout = setTimeout(() => {
        this.setState({
          open: false,
          name: '',
          color: ''
        });
      }, 3000)
    });
  }
  render() {
    const titleMessage = () => {
      return <Typography variant="h5"> {this.state.name} has joined the chat 🥳</Typography>
    }
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({open: false})
      clearTimeout(this.timeout)
    }
    
    return (
      <Snackbar open={this.state.open} autoHideDuration={1000} onClose={handleClose}>
        {titleMessage()}
      </Snackbar>
    )
  }
}
export default NotificationComponent