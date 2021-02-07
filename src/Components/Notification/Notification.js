import React from 'react';
import { Typography, Snackbar } from '@material-ui/core'
import ee from 'event-emitter'

const emitter = new ee();

export const notify = (name, color, inout) => {
  console.log("NOTIFY:" ,name, color, inout)
  emitter.emit('notification', name, color, inout);
}
class NotificationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: '',
      open: false,
      inout: '',
    }
    this.timeout = null;
    emitter.on('notification', (name, color, inout) => {
      console.log("notification: ", name, color, inout)
      this.onShow(name, color, inout)
    })
  }

  onShow = (name, color, inout) => {
    if(this.timeout) {
      clearTimeout(this.timeout)
      this.setState({
        open: false,
        name: '',
        color: '',
        inout: ''
      }, () => {
        this.timeout = setTimeout(() => {
          this.showNotif(name, color, inout);
        }, 500)
      })
    } else {
      this.showNotif(name, color, inout)
    }
  }
  showNotif = (name, color, inout) => {
    this.setState({
      open: true,
      name: name,
      color: color,
      inout: inout
    }, () => {
      this.timeout = setTimeout(() => {
        this.setState({
          open: false,
          name: '',
          color: '',
          inout: ''
        });
      }, 3000)
    });
  }
  render() {
    const titleMessage = () => {
      if (this.state.inout === 'login') {
        return <Typography variant="h5"> {this.state.name} has joined the chat 🥳</Typography>
      } else if (this.state.inout === 'logout') {
        return <Typography variant="h5"> {this.state.name} has left 👋</Typography>
      }
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