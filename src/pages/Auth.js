import React, { Component } from 'react';

import './Auth.css';
import AlarmContext from "../context/alarm-context";
import servers from '../assets/servers';
class AuthPage extends Component {
  state = {
    isLogin: true,
    messagge: ""
  };

  static contextType = AlarmContext;

  constructor(props) {
    super(props);
    this.usernameEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  

  submitHandler = event => {
    event.preventDefault();
    const username = this.usernameEl.current.value;
    const password = this.passwordEl.current.value;

    if (username.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            userId
            token
            tokenExpiration
            username
          }
        }
      `,
      variables: {
        username: username,
        password: password
      }
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($username: String!, $password: String!) {
            createUser(userInput: {username: $username, password: $password}) {
              _id
              username
            }
          }
        `,
        variables: {
          username: username,
          password: password
        }
      };
    }
    // http://localhost:8000/graphql
    // https://aiems-dashboard.herokuapp.com/graphql
    fetch(servers.gqServer, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration,
            resData.data.login.username
            
          );
          
          this.setState({
            messagge: "Welcome!!!"
          })
          
        }
      })
      .catch(err => {
        
        this.setState({
          messagge: "Wrong User Name or Password"
        })
      });
  };

  render() {
    return (
        <div>
            <div class="contaier">
      <div class="wrapper">
        <div class="title"><span>Authenticate</span></div>
        <form className="auth-form" onSubmit={this.submitHandler}>
          <div class="row">
          <i class='bx bx-user'></i>
          <input type="username" id="username" ref={this.usernameEl} />
          </div>
          <div class="row">
          <i class='bx bx-lock-alt' ></i>
          <input type="password" id="password" ref={this.passwordEl} />
          </div>
          
          <div class="row button">
            <button type="submit">Submit</button>
          </div>
          <div className="message">
            {this.state.messagge}
            </div>
          
        </form>
      </div>
    </div>
      
      </div>
    );
  }
}

export default AuthPage;