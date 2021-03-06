import React from 'react';
import './App.css';
import {Form, Input, Button, Select} from 'antd';
import {Layout} from "antd";

const {Option} = Select;

class Step1 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            idiomas: [],
            discapacidades: [],
            estadosCiviles: [],
            tiposDocumentos: [],
        };
    }

    componentDidMount() {
        this.getIdiomas();
        this.getDiscapacidades();
        this.getEstadosCiviles();
        this.getTipoDocumento();
    }

    getIdiomas() {
        fetch('http://172.35.123.9/FichaWeb/app/controller/idioma/read.php')
            .then(response => response.json())
            .then(data => this.setState({idiomas: data}));
    }

    getDiscapacidades() {
        fetch('http://172.35.123.9/FichaWeb/app/controller/discapacidad/read.php')
            .then(response => response.json())
            .then(data => this.setState({discapacidades: data}))
    }

    getEstadosCiviles() {
        fetch('http://172.35.123.9/FichaWeb/app/controller/estadoCivil/read.php')
            .then(response => response.json())
            .then(data => this.setState({estadosCiviles: data}))
    }

    getTipoDocumento() {
        fetch('http://172.35.123.9/FichaWeb/app/controller/tipoDocumento/read.php')
            .then(response => response.json())
            .then(data => this.setState({tiposDocumentos: data}))
    }

    render() {

        const {idiomas} = this.state;
        const {discapacidades} = this.state;
        const {estadosCiviles} = this.state;
        const {tiposDocumentos} = this.state;

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

        function handleChanges(value) {
            console.log(`se ha seleccionado ${value}`);
        }

        return (
            <Form {...formItemLayout} onSubmit={this.handleSave} style={{width: "75%"}}>
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

                <Form.Item label="Género">
                    {getFieldDecorator('genero', {
                        rules: [
                            {
                                required: true,
                                message: 'Por favor seleccione su género.',
                            },
                        ],
                    })(
                        <Select placeholder={"Seleccione su sexo"} onChange={handleChanges}>
                            <Option value="M">Masculino</Option>
                            <Option value="F">Femenino</Option>
                        </Select>)}
                </Form.Item>

                <Form.Item label="Estado Civil">
                    {getFieldDecorator('estadoCivil', {
                        rules: [
                            {
                                required: true,
                                message: 'Por favor seleccione su estado civil.',
                            },
                        ],
                    })(
                        <Select placeholder={"Seleccione su estado civil"} onChange={handleChanges}>
                            {
                                estadosCiviles.map(estadoCivil =>
                                    <Option value={estadoCivil.id_est_civil}>{estadoCivil.desc_est_civil}</Option>
                                )
                            }
                        </Select>)}
                </Form.Item>
                <Form.Item label="Discapacidad">
                    {getFieldDecorator('discapacidad', {
                        rules: [
                            {
                                required: true,
                                message: 'En caso cuente con una discapacidad seleccione una.',
                            },
                        ],
                    })(
                        <Select placeholder={"Seleccione en caso tenga alguna discapacidad"} onChange={handleChanges}>
                            {discapacidades.map(discapacidad =>
                                <Option value={discapacidad.IdAdm_Discapacidad}>{discapacidad.Descripcion}</Option>
                            )}
                        </Select>)}
                </Form.Item>
                <Form.Item label="Tipo de documento">
                    {getFieldDecorator('documento', {
                        rules: [
                            {
                                required: true,
                                message: 'Seleccione el tipo de documento.',
                            },
                        ],
                    })(
                        <Select placeholder={"DNI"} onChange={handleChanges}>
                            {tiposDocumentos.map(tipoDocumento =>
                                <Option value={tipoDocumento.id_tipo_doc}>{tipoDocumento.desc_tipo_doc}</Option>
                            )}
                        </Select>)}
                </Form.Item>
                <Form.Item label="Nro. de Documento">
                    {getFieldDecorator('dni', {
                        rules: [
                            {
                                required: true,
                                message: 'Por favor ingrese su DNI',
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>

                <Form.Item label="E-mail">
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                required: true,
                                message: 'Por favor ingrese eu E-mail',
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>


                <Form.Item label="Celular">
                    {getFieldDecorator('celular', {
                        rules: [
                            {
                                required: true,
                                message: 'Por favor ingrese su número de celular',
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>
                <Form.Item label="Teléfono">
                    {getFieldDecorator('telefono', {
                        rules: [
                            {
                                required: true,
                                message: 'Por favor ingrese su número de teléfono',
                            },
                        ],
                    })(<Input/>)}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(Step1);