import React from 'react';
import './App.css';
import {Form, Input, Button, Select} from 'antd';

const {Option} = Select;

class App extends React.Component {
    render() {

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        const {getFieldDecorator} = this.props.form;

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{width: "75%"}}>
                <Form.Item label="Nombres">
                    {getFieldDecorator('nombres', {
                        rules: [
                            {
                                required: true,
                                message: 'Por favor ingrese sus nombres',
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Apellido Paterno">
                    {getFieldDecorator('paterno', {
                        rules: [
                            {
                                required: true,
                                message: 'Por favor ingrese su apellido paterno',
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Apellido Materno">
                    {getFieldDecorator('materno', {
                        rules: [
                            {
                                required: true,
                                message: 'Por favor ingrese su apellido materno',
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Sexo">
                    <Select placeholder={"Seleccione su sexo"}>
                        <Option value="M">Masculino</Option>
                        <Option value="F">Femenino</Option>
                    </Select>
                </Form.Item>

            </Form>
        )
    }
}

export default Form.create()(App);