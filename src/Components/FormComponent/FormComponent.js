import React from 'react';
import { Card, CardContent, Typography,Accordion, AccordionActions, AccordionDetails, AccordionSummary, Avatar, Divider, Button, CardActions, CircularProgress, Snackbar } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditElementDialog from '../EditElementDialog/EditElementDialog'
const { requestEditLock } = require('../../Utililty/MessageHandler')
const { hasCookie } = require('../../Utililty/CookieManager')

const styledTheme = {
  root: {
    width: '100%',
  },
  title: {
    flexBasis: '30.00%',
  },
  question: {
    flexBasis: '70.00%',
    marginTop:'5px',
  },
  details: {
    alignItems: 'center'
  },
  buttonProgress: {
    color: 'green',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}

class FormComponent extends React.Component {
  state = {
    small: true,
    loading: false,
    openEdit: false,
    showDecline: false,
    showError: false,
  }
  componentDidMount() {
    if (window.innerWidth > 600) {
      this.setState({
        small: false
      })
    }
  }
  closeDialog = () => {
    this.setState({
      openEdit: false
    })
  }
  editFlow = async (event) => {
    console.log(this.props.itemData.id, 'edit')
    let token = hasCookie().entryToken || '-1'
    var lockResponse
    if (token !== '-1') {
      this.setState({loading: true})
      lockResponse = await requestEditLock(token, this.props.itemData.id)
    }
    this.setState({loading: false})
    let lockData = lockResponse.data
    if (lockData['message'] === 'declined') {
      console.log("you have been denied")
      this.setState({
        showError: true
      }, () => {
        setTimeout(() => {
          this.setState({
            showError: false
          });
        }, 3000);
      })
    } else {
      this.setState({openEdit: true})
    }
  }
  render() {
    const userColorParsed = (this.props.itemData.Versions && this.props.itemData.Versions[0].EditedBy.colour) || 'black'
    const userNameParsed = (this.props.itemData.Versions && this.props.itemData.Versions[0].EditedBy.userName) || 'Jane Doe'
    const createdAt = new Date(this.props.itemData.CreatedAt).toDateString()
    return (
      <div>
        <EditElementDialog 
          open={this.state.openEdit}
          closeDialog={this.closeDialog}
          currItem={this.props.itemData}
          ws={this.props.socket}
          currColor={this.props.currColor}
          currName={this.props.currName}
        />
        {this.state.small && <Card style={{ minWidth: '275' }} variant="outlined">
          <CardContent>
            <Typography style={{ fontSize: "14px", color: userColorParsed }} gutterBottom>
              Created By: {userNameParsed}
            </Typography>
            <Typography variant="h5" component="p">
              {this.props.itemData.title}
            </Typography>
            <Typography variant="body2" component="p" color="textSecondary">
              {this.props.itemData.question}
            </Typography>
          </CardContent>
          <Divider />
          {this.state.showError && <Typography>You cannot edit this element right now</Typography>}
          <Divider />
          <CardActions style={{justifyContent:'center'}}>
            <Button size="small" onClick={this.editFlow} disabled={this.state.loading}> 
              Edit {this.state.loading && <CircularProgress size={24} style={styledTheme.buttonProgress}/> } 
            </Button>
            <Button size="small" color="secondary" disabled={this.state.loading}> Delete </Button>
          </CardActions>
        </Card>}
        {!this.state.small && <div style={styledTheme.root}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1c-content"
              id="panel1c-header"
              >
              <div style={styledTheme.title}>
                <Typography variant="h5">{this.props.itemData.title}</Typography>
              </div>

              <div style={styledTheme.question}>
                <Typography color="textSecondary">{this.props.itemData.question}</Typography>
              </div>
              <div>
                <Avatar style={{backgroundColor:userColorParsed, marginLeft: '5px'}} variant="square" size={20} alt={userNameParsed}>
                  {userNameParsed.substring(0,2)}
                </Avatar>
              </div>
              </AccordionSummary>
              <AccordionDetails style={styledTheme.details}>
                <div style={styledTheme.title} />
                <div style={styledTheme.question}>
                  <Typography> Element Created on {createdAt}</Typography>
                </div>
              </AccordionDetails>
              <Divider />
              {this.state.showError && <Typography>You cannot edit this element right now</Typography>}
              <Divider />
              <AccordionActions>
                <Button size="small" onClick={this.editFlow} disabled={this.state.loading || this.state.openEdit || this.state.showError}> 
                  Edit {this.state.loading && <CircularProgress size={24} style={styledTheme.buttonProgress}/> } 
                </Button>
                <Button size="small" color="secondary" disabled={this.state.loading || this.state.openEdit || this.state.showError}> Delete </Button>
              </AccordionActions>
          </Accordion>
        </div>}
      </div>
    )
  }
}

export default FormComponent;
