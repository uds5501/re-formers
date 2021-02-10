import React from 'react';
import { Typography, Snackbar } from '@material-ui/core'
import ee from 'event-emitter'

const emitter = new ee();

export const notify = (name, color, inout, caseType) => {
  console.log("NOTIFY:" ,name, color, inout, caseType)
  emitter.emit('notification', name, color, inout, caseType);
}
class NotificationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: '',
      open: false,
      inout: '',
      caseType: ''
    }
    this.timeout = null;
    emitter.on('notification', (name, color, inout, caseType) => {
      this.onShow(name, color, inout, caseType)
    })
  }

  onShow = (name, color, inout, caseType) => {
    if(this.timeout) {
      clearTimeout(this.timeout)
      this.setState({
        open: false,
        name: '',
        color: '',
        inout: '',
        caseType: ''
      }, () => {
        this.timeout = setTimeout(() => {
          this.showNotif(name, color, inout, caseType);
        }, 500)
      })
    } else {
      this.showNotif(name, color, inout, caseType)
    }
  }
  showNotif = (name, color, inout, caseType) => {
    this.setState({
      open: true,
      name: name,
      color: color,
      inout: inout,
      caseType: caseType
    }, () => {
      this.timeout = setTimeout(() => {
        this.setState({
          open: false,
          name: '',
          color: '',
          inout: '',
          caseType: ''
        });
      }, 3000)
    });
  }
  render() {
    const titleMessage = () => {
      if (this.state.caseType === 'case1') {
        if (this.state.inout === 'login') {
          return <Typography variant="h5"> {this.state.name} has joined the chat 🥳</Typography>
        } else if (this.state.inout === 'logout') {
          return <Typography variant="h5"> {this.state.name} has left 👋</Typography>
        }
      } else if (this.state.caseType === 'case2') {
        if (this.state.inout === 'already-deleted') {
          return <Typography variant="h5"> The requested element had already been deleted! </Typography>
        } else if (this.state.inout === 'current-locked') {
          return <Typography variant="h5"> Requested element is being edited by another user </Typography>
        } else if (this.state.inout === 'delete-confirmed') {
          return <Typography variant="h5"> Element has been successfully deleted </Typography>
        }
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