import React from 'react';
import { AppBar, Typography, Toolbar } from '@material-ui/core'

class AppBarComponent extends React.Component {
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Re-Formers</Typography>
        </Toolbar>
      </AppBar>
    )
  }
}
export default AppBarComponent