import React, { Component } from "react";
import FileBase64 from "react-file-base64";
import { Button, Form, FormGroup, Label, FormText, Input } from "reactstrap";
import axios from "axios";

import "./upload.css";

class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmation: "",
      isLoading: "",
      files: "",
      Ownername: "",
      Address: "",
      Identification: "",
      RegistrationMark: "",
      RBN: "",
      Make: "",
      Model: "",
      Class: "",
      Type: "",
      Colour: "",
      Chassis_Number: "",
      Engine_Number: "",
      Engine_Capacity: ""
    };

    this.handleChane = this.handleChane.bind(this);
  }

  handleChane(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ name: value });
  }

  async handleSubmit(event) {
    event.preventDefaulr();
    this.setState({ confirmation: "Uploading..." });
    console.log(this.state);
  }

  async getFiles(files) {
    this.setState({
      isLoading: "Extracting data",
      files: files,
    });

    const UID = Math.round(1 + Math.random() * (1000000 - 1));

    var date = {
      fileExt: "png",
      name: this.state.files[0].name,
      imageID: UID,
      folder: UID,
      img: this.state.files[0].base64,
    };

    this.setState({ confirmation: "Processing..." });
    await fetch(
      "https://fl7al8rvye.execute-api.us-east-2.amazonaws.com/Prod",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(date),
      }
    );

    console.log(date);

    let targetImage = UID + ".png";
    const response = await fetch(
      "https://fl7al8rvye.execute-api.us-east-2.amazonaws.com/Prod/ocr",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application.json",
        },
        body: JSON.stringify(targetImage),
      }
    );

    this.setState({ confirmation: "" });

    const OCRBody = await response.json();
    console.log("OCRBody", OCRBody);

    this.setState({ Ownername: OCRBody.body[0] });
    this.setState({ Address: OCRBody.body[1] });
    this.setState({ Identification: OCRBody.body[2] });
    this.setState({ RegistrationMark: OCRBody.body[3] });
    this.setState({ RBN: OCRBody.body[4] });
    this.setState({ Make: OCRBody.body[5] });
    this.setState({ Model: OCRBody.body[6] });
    this.setState({ Class: OCRBody.body[7] });
    this.setState({ Type: OCRBody.body[8] });
    this.setState({ Colour: OCRBody.body[9] });
    this.setState({ Chassis_Number: OCRBody.body[10] });
    this.setState({ Engine_Number: OCRBody.body[11] });
    this.setState({ Engine_Capacity: OCRBody.body[12] });
    
  }

  handleFormSubmit( event ) {
    event.preventDefault();
    
    const obj = {
      Ownername: this.state.Ownername,
      Address: this.state.Address,
      Identification: this.state.Identification,
      RegistrationMark: this.state.RegistrationMark,
      RBN: this.state.RBN,
      Make: this.state.Make,
      Model: this.state.Model,
      Class: this.state.Class,
      Type: this.state.Type,
      Colour: this.state.Colour,
      Chassis_Number: this.state.Chassis_Number,
      Engine_Number: this.state.Engine_Number,
      Engine_Capacity: this.state.Engine_Capacity
    };

    axios.post('http://localhost/ccs/api/insert.php',obj)
    .then(res => console.log(res.data));
    console.log(obj);
    
}


  render() {
    const processing = this.state.confirmation;
    return (
      <div className="row">
        <div className="col-6 offset-3">
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <h3 className="text-danger">{processing}</h3>
              <h6>Upload Image</h6>
              <FormText color="muted">PNG,JPG</FormText>

              <div className="form-group files color">
                <FileBase64
                  multiple={true}
                  onDone={this.getFiles.bind(this)}
                ></FileBase64>
              </div>
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Owner Name Detail</h6>
              </Label>
              <Input
                type="text"
                name="Ownername"
                id="Ownername"
                required
                value={this.state.Ownername}
                onChange={this.handleChane}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Address Detail</h6>
              </Label>
              <Input
                type="text"
                name="Address"
                id="Address"
                required
                value={this.state.Address}
                onChange={this.handleChane}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Identification Number</h6>
              </Label>
              <Input
                type="text"
                name="Identification"
                id="Identification"
                required
                value={this.state.Identification}
                onChange={this.handleChane}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <h6>Registration Mark</h6>
              </Label>
              <Input
                type="text"
                name="RegistrationMark"
                id="RegistrationMark"
                required
                value={this.state.RegistrationMark}
                onChange={this.handleChane}
              />
            </FormGroup>

            {/* <FormGroup>
              <Label>
                <h6>RBN</h6>
              </Label>
              <Input
                type="text"
                name="RBN"
                id="RBN"
                required
                value={this.state.RBN}
                onChange={this.handleChane}
              />
            </FormGroup> */}
            {/* <Button className="btn btn-lg btn-block  btn-success">
              Submit
            </Button> */}
            <input type="submit" onClick={e => this.handleFormSubmit(e)} value="Submit" />
          </Form>
        </div>
      </div>
    );
  }
}

export default Upload;
