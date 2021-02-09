import React from 'react';
import { Card, CardContent, Typography, Accordion, AccordionActions, AccordionDetails, AccordionSummary, Avatar, Divider, Button, CardActions } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  }
}

class FormComponent extends React.Component {
  state = {
    small: true
  }
  componentDidMount() {
    if (window.innerWidth > 600) {
      this.setState({
        small: false
      })
    }
    console.log("in component mount of form");
    // get information from user
  }
  render() {
    const userColorParsed = (this.props.itemData.Versions && this.props.itemData.Versions[0].EditedBy.colour) || 'black'
    const userNameParsed = (this.props.itemData.Versions && this.props.itemData.Versions[0].EditedBy.userName) || 'someone'
    const createdAt = new Date(this.props.itemData.CreatedAt).toDateString()
    return (
      <div>
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
          <CardActions style={{justifyContent:'center'}}>
            <Button size="small"> Edit </Button>
            <Button size="small" color="secondary"> Delete </Button>
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
                <Avatar style={{backgroundColor:userColorParsed, marginLeft: '5px'}} variant="square" sizes="small" alt={userNameParsed}>
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
              <AccordionActions>
                <Button size="small"> Edit </Button>
                <Button size="small" color="secondary"> Delete </Button>
              </AccordionActions>
          </Accordion>
        </div>}
      </div>
    )
  }
}

export default FormComponent;
