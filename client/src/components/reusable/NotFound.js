// import React from 'react'
// //add 404 not found image in this component
// //add Link to home page

// export default () => {
//   return (
//     <div>
//       <h2>404 not found</h2>
//     </div>
//   )
// }



import React from 'react';
import { Button, Card, CardBody, CardImage, CardTitle, CardText, Col } from 'mdbreact';

class CardExample extends React.Component {
  render() {
    return (
      <Col>
        <Card style={{ width: "22rem" }}>
          <CardImage
            className="img-fluid"
            src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"
            waves
          />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              Some quick example text to build on the card title and make
              up the bulk of the card&apos;s content.
            </CardText>
            <Button href="#">Button</Button>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default CardExample;