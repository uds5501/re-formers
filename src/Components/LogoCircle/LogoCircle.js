import React from 'react';
import ee from 'event-emitter'
import { Avatar, Typography } from '@material-ui/core'

const emitter = new ee();

export const populateList = (list) => {
  emitter.emit('update', list)
}

class LogoCircle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      list: []
    }
    emitter.on('update', (list) => {
      this.showList(list)
    })
  }
  showList = (list) => {
    this.setState({
      loading: false,
      list: list
    });
  }
  render() {
    const logoCraft = this.state.list.map((item) => 
      <Avatar style={{backgroundColor:item.colour, marginLeft: '5px'}} alt={item.userName}>
        {item.userName.substring(0,2)}
      </Avatar>
    )
    const returnObj = () => {
      if (this.state.loading) {
        return <Typography variant="h5"> User list loading.. </Typography>
      } else {
        return this.state.list.length === 0 ?  <Typography variant="h5"> No user found in room </Typography> : logoCraft
      }
    }
    const inlineStyle = {
      display: 'flex'
    }
    return (
      <React.Fragment>
        <div style={inlineStyle}>
          {returnObj()}
        </div>
      </React.Fragment>
    )
  }
}
export default LogoCircle