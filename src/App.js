import React from 'react';
import './App.css';
import {Form, Input, Button, Select} from 'antd';
import {Layout} from "antd";
import {LoginPage} from "./LoginPage/LoginPage";
import {Route} from "react-router";

const {Option} = Select;

class App extends React.Component {
    render() {
        return (
            <Route path="/" component={LoginPage}/>
        )
    }
}

export default App;