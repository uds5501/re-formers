import React from 'react'
import { Paper, Grid, Typography } from '@material-ui/core'
const paperStyle = {
  padding: '5px',
  textAlign: 'center',

}
class VersionControl extends React.Component {  
  render() {
    const items = (
      this.props.versions.map((item, i) => 
        // const createdAt = new Date(item.editedAt).toLocaleDateString()
        <Grid item xs={12} sm={3}>
          <Paper variant="outlined" style={paperStyle} elevation={10}>
            <Typography> <font color={item.EditedBy.colour}>{i===0 ? 'Created' : 'Edited'} By: {item.EditedBy.userName}</font></Typography>
            <Typography gutterBottom> {new Date(item.editedAt).toLocaleDateString()} - {new Date(item.editedAt).toLocaleTimeString()}</Typography>
            <Typography> Question: {item.question}</Typography>
            <Typography> Title: {item.title} </Typography>
          </Paper>
        </Grid>
      )
    )
    return (
      <Grid container spacing={3} style={{marginTop: "10px"}}>
        {items}
      </Grid>
    )
  }
}
export default VersionControl