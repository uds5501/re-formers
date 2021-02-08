import React from 'react';
import { AppBar, Typography, Toolbar, Button } from '@material-ui/core'

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
            <Typography variant="h5" style={{ flex: 1 }}>Re-Formers</Typography>
            {showLogout()}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
export default AppBarComponent