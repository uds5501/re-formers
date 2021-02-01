import React from 'react';
import { Container, Button, Card, CardActions, CardContent, Typography } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles'

class FormComponent extends React.Component{
  
//   state = {
//     userName: null,
//     userColor: null,
//     formFields: [{
//       'type': 'text',
//       'question': 'are you okay?',
//       'by': 'uddeshya-singh',
//       'id': 1
//     }]
//   }

  componentDidMount() {
    console.log("in component mount of form");
    // get information from user
  }
  render() {
    return (
      <Card style={{minWidth: '275'}} variant="outlined">
          <CardContent>
              <Typography style={{fontSize: "14px"}} gutterBottom>
                  Created By: {this.props.itemData.by}
              </Typography>
              <Typography variant="body2" component="p">
                Question:
                <br />
                {this.props.itemData.question}
              </Typography>   
          </CardContent>
      </Card>
    )
  }
}

export default FormComponent;
