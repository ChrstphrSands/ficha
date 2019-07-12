import React from 'react';
import {Button, Form, Icon, Input} from "antd";
import {Router} from "react-router";

class Login extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            dni: '',
            password: ''
        }


    }

    submitForm(e) {
        e.preventDefault();
        this.props.history.push('/Paso1');
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <Form onSubmit={this.submitForm.bind(this)} className="login-form">
                <Form.Item>
                    {getFieldDecorator('dni', {
                        rules: [{required: true, message: 'Por ingrese su número de DNI!'}],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="DNI"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Por favor ingrese su contraseña!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="Contraseña"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Ingresar
                    </Button>
                    O <a href="#">Regístrese!</a>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(Login);