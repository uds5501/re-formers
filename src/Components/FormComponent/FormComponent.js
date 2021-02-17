import React from 'react';
import { Card, CardContent, Typography,Accordion, AccordionActions, Box, AccordionDetails, AccordionSummary, Avatar, Divider, Button, CardActions, CircularProgress } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditElementDialog from '../EditElementDialog/EditElementDialog'
import VersionControl from '../VersionControl/VersionControl'
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
    deleting: false,
    showVersions: false,
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
  showVersionHandler = () => {
    this.setState({
      showVersions: !this.state.showVersions
    })
  }
  deleteFlow = () => {
    let obj = hasCookie().entryToken
    this.setState({
      deleting: true
    })
    console.log("Sent command to delete")
    this.props.socket.send(JSON.stringify({
      entryToken: obj,
      messageType: 'delete element',
      formId: this.props.itemData.id
    }))
    this.setState({
      deleting: false
    })
  
  }
  render() {
    const userColorParsed = (this.props.itemData.Versions && this.props.itemData.Versions[0].EditedBy.colour) || 'black'
    const userNameParsed = (this.props.itemData.Versions && this.props.itemData.Versions[0].EditedBy.userName) || 'Jane Doe'
    const createdAt = new Date(this.props.itemData.CreatedAt).toLocaleDateString()
    const isStatic = (this.props.itemData.id === -99)
    const disableButton = this.state.loading || this.state.openEdit || this.state.showError || this.state.deleting || isStatic || this.props.itemData.IsDeleted
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
            <Button size="small" onClick={this.showVersionHandler} disabled={disableButton}> Versions </Button>    
            <Button size="small" onClick={this.editFlow} disabled={disableButton}> 
              Edit {this.state.loading && <CircularProgress size={24} style={styledTheme.buttonProgress}/> } 
            </Button>
            <Button size="small" color="secondary" onClick={this.deleteFlow} disabled={disableButton}> Delete </Button>
          </CardActions>
        </Card>}
        {!this.state.small && <Box style={styledTheme.root} border={this.props.itemData.IsDeleted && 2} borderColor={this.props.itemData.IsDeleted && 'red'}>
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
                  <Typography> Element Created by <font color={userColorParsed}>{userNameParsed}</font></Typography>
                </div>
              </AccordionDetails>
              <Divider />
              {this.state.showError && <Typography>You cannot edit this element right now</Typography>}
              <Divider />
              <AccordionActions>
                <Button size="small" onClick={this.showVersionHandler} disabled={disableButton}> Versions </Button>
                <Button size="small" onClick={this.editFlow} disabled={disableButton}> 
                  Edit {this.state.loading && <CircularProgress size={24} style={styledTheme.buttonProgress}/> } 
                </Button>
                <Button size="small" color="secondary" onClick={this.deleteFlow} disabled={disableButton}> Delete </Button>
              </AccordionActions>
          </Accordion>
        </Box>}
        {this.state.showVersions && <VersionControl versions={this.props.itemData.Versions}/>}
      </div>
    )
  }
}

export default FormComponent;
