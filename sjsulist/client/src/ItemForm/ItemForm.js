import React, { Component } from 'react'
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
//import { TextField } from '@material-ui/core';
import './ItemForm.css';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

import Clarifai from 'clarifai';
import image2base64 from '../Tools/ImageDecoder';

const app = new Clarifai.App({
    apiKey: '8987d7299e5943c5bb94928bd2fdfe63'
   });

   var u="";

class ItemForm extends Component {

    constructor(){
        super()
        this.routeChange = this.routeChange.bind(this);
    }
    routeChange(){
        let path = `/Items`;
        this.props.history.push(path);
    }
    
    state = {
                imageSrc: "images/placeholder.jpeg",
                itemName: "",
                description: "",
                price: "",
                contact: "",
                name: localStorage.getItem('username'),
                condition: ""
                
            }
    

    onChanger=(event)=>{
        try{
    
        var output = document.getElementById("image");
        
        output.src= URL.createObjectURL(event.target.files[0]);

        image2base64(output.src) // you can also to use url
            .then(
                (response) => {
                    this.setState({imageSrc: 'data:image/png;base64,'+response});
                    this.predictPic(response);
                
                }
            )
            .catch(
                (error) => {
                    console.log(error); //Exepection error....
                }
            )
        }
        catch(err)
        {
           
        }


    }
    predictPic(result){
        app.models.predict(Clarifai.GENERAL_MODEL, {base64: result}).then(
            function(response) {
              // do something with response
              var concepts = response['outputs'][0]['data']['concepts'];
              document.getElementById("description").value=concepts[0].name;
            },
            function(err) {
              // there was an error
            }
        );
    }


    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    submitForm = (e) => {
        
        e.preventDefault();
        const { imageSrc, itemName, description, price, contact, name, condition } = this.state
        const addNewItem = {
            imageSrc: imageSrc,
            itemName: itemName,
            description: description,
            price: price,
            contact: contact,
            name: name,
            condition: condition
        }

        const userId = localStorage.getItem('userId'); 
        axios.post(`http://localhost:5000/addItem/${userId}`, addNewItem)
            .then(res => { console.log(res.data)})
            .then(this.routeChange);

    }

  render() {
    return (
        <div className="i-form">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
            <form onSubmit={this.submitForm } >
                <div className="up-image">
                <label for="up" class="btn">Select Image</label>
                    <input type="file" onChange={this.onChanger} id="up" className="inputbutton"></input>
                    <div className="image-props">
                        <img alt="file image" src='images/placeholder.jpeg' id="image" className="itemimg"></img>
                       
                    </div>
                    
                </div>
                
                <div className="input-info">
                    {/* Name of item */}
                    <div className="i-input" >
                        <div class="input-field col s20">
                        <h6>Item:</h6>
                            <input placeholder="Calc textbook, it-84, etc." id='itemName' required="required" onChange={this.handleChange} type="text" class="validate"></input>
                        
                        </div>
                    </div>
                
                {/* Item category */}
                    <div className="i-input">
                        <div class="input-field col s10">
                        <h6>Category:</h6>
                            <textarea placeholder="Books, calculator, computer, etc." id='description' required="required" onChange={this.handleChange}class="materialize-textarea" data-length="120"></textarea>
                            
                        </div>
                    </div>

                {/* Price of item */}
                    <div className="i-input">
                        <div class="input-field col s10">
                        <h6>Price (USD):</h6>
                            <input placeholder="Everything has a price..." id='price' required="required" onChange={this.handleChange} type="number" class="validate"></input>
                            
                        </div>
                    </div>

                {/* Condition info */}
                <div className="i-input">
                        <div class="input-field col s10">
                        <h6>Condition:</h6>
                            <input placeholder="New, used, if other:please explain." id='condition' required="required" onChange={this.handleChange}type="text" class="validate"></input>
                            
                        </div>
                    </div>

                    {/* Description */}
                    <div className="i-input">
                        <div class="input-field col s10">
                            <h6>Description:</h6>
                            <input placeholder="Description of the item" id='description' required="required" onChange={this.handleChange} type="text" class="validate"></input>

                        </div>
                    </div>

                    {/* Name */}
                    <div className="i-input">
                        <div class="input-field col s10">
                            <h6>Name: </h6>
                            <input placeholder="your name." id='name' value={localStorage.getItem('username')} onChange={this.handleChange} required="required" type="text" class="validate"></input>

                        </div>
                    </div>
               
                    
                    {/* Contact info */}
                    <div className="i-input">
                        <div class="input-field col s10">
                        <h6>Contact info:</h6>
                            <input placeholder="Provide an email, you wish to be contacted." id='contact' required="required" onChange={this.handleChange} type="text" class="validate"></input>
                            
                        </div>
                    </div>
                </div>
                        
                <button class="btn waves-effect waves-light submit-button" type="submit" name="action"> 
                    <i class="material-icons right">attach_money</i> sUBMIT
                </button>
                
                
               
                

            </form>

            

            <a href="/Items">
                      <button class="btn postBtn2" type="submit" name="action">
              Cancel 
                      </button>

            </a>
        </div>
    )
  }
}

export default withRouter(ItemForm);
