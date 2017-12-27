import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {Spin} from 'antd';
import logo from './logo.svg';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div className="App">
        <Spin spinning={true}></Spin>123
        <Link to="/updater">updater</Link>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default Home;