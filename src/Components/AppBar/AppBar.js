import React from 'react';
import { AppBar, Typography, Toolbar, Button, Badge } from '@material-ui/core'

class AppBarComponent extends React.Component {
  render() {
    const showLogout = () => {
      if (this.props.logout) {
        return <Button color="inherit" onClick={this.props.handleLogout}>Logout</Button>
      }
    }
    return (
      <div style={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <div style={{ flex: 1 }}>
              <Badge badgeContent={''} variant={'dot'} color={this.props.isDisconnected ? "error" : "primary"} >
                <Typography variant="h5" > Re-Formers </Typography>
              </Badge>
            </div>
            {showLogout()}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
export default AppBarComponent