import React from 'react';
import {Form, Input, Button, Select, DatePicker} from 'antd';

const {TextArea} = Input;
const {Option} = Select;

class Paso3 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nacionalidades: [],
            ciudades: [],
            provincias: [],
            distritos: [],
            fichaPersona: [],
        };
    }

    componentDidMount() {
        this.getPaises();
        this.getFichaPersona();
        this.getCiudades();
        this.getProvincias();
        this.getDistritos();
    }

    getFichaPersona() {
        fetch('http://localhost/FichaWeb/app/controller/fichaPersona/read.php')
            .then(response => response.json())
            .then(data => this.setState({fichaPersona: data}))
    }

    getPaises() {
        fetch('http://localhost/FichaWeb/app/controller/nacionalidad/read.php')
            .then(response => response.json())
            .then(data => this.setState({nacionalidades: data}));
    }

    getCiudades() {
        fetch('http://localhost/FichaWeb/app/controller/ciudad/read.php/?idPais=9589')
            .then(response => response.json())
            .then(data => this.setState({ciudades: data}));
    }

    getProvincias() {
        fetch('http://localhost/FichaWeb/app/controller/provincia/read.php/?idCiudad=2919')
            .then(response => response.json())
            .then(data => this.setState({provincias: data}));
    }

    getDistritos() {
        fetch('http://localhost/FichaWeb/app/controller/distrito/read.php/?idPais=9589&idCiudad=2919&idProvincia=2301')
            .then(response => response.json())
            .then(data => this.setState({distritos: data}));
    }

    render() {

        const {nacionalidades} = this.state;
        const {ciudades} = this.state;
        const {provincias} = this.state;
        const {distritos} = this.state;
        const {fichaPersona} = this.state;

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
        const config = {
            rules: [{type: 'object', required: true, message: 'Por favor seleccione la fecha de su nacimiento  '}],
        };

        function handleChanges(value) {
            console.log(`se ha seleccionado ${value}`);
        }

        return (
            <Form {...formItemLayout} style={{width: "75%"}}>
                <Form.Item label="Ciudad">
                    {getFieldDecorator('ciudad', {
                        initialValue: fichaPersona.id_res_ciudad_per,
                        rules: [
                            {
                                required: true,
                                message: 'Por favor seleccione la ciudad.',
                            },
                        ],
                    })(
                        <Select placeholder={"Seleccione en caso tenga alguna discapacidad"} onChange={handleChanges}>
                            {ciudades.map(ciudad =>
                                <Option value={ciudad.CodCiudad}>{ciudad.descripcion}</Option>
                            )}
                        </Select>)}
                </Form.Item>
                <Form.Item label="Provincia">
                    {getFieldDecorator('provincia', {
                        initialValue: fichaPersona.id_res_provincia_per,
                        rules: [
                            {
                                required: true,
                                message: 'Por favor seleccione la provincia.',
                            },
                        ],
                    })(
                        <Select placeholder={"Provincia"} onChange={handleChanges}>
                            {provincias.map(provincia =>
                                <Option value={provincia.CodProv}>{provincia.descripcion}</Option>
                            )}
                        </Select>)}
                </Form.Item>
                <Form.Item label="Distrito">
                    {getFieldDecorator('distrito', {
                        initialValue: fichaPersona.id_res_distrito_per,
                        rules: [
                            {
                                required: true,
                                message: 'Por favor seleccione el distrito.',
                            },
                        ],
                    })(<Select placeholder={"Distrito"} onChange={handleChanges}>
                        {distritos.map(distrito =>
                            <Option value={distrito.CodDist}>{distrito.descripcion}</Option>
                        )}
                    </Select>)}
                </Form.Item>

                <Form.Item label="Dirección de Domicilio">
                    {getFieldDecorator('direccionDomicilio', {
                        initialValue: fichaPersona.res_direccion_per,
                        rules: [
                            {
                                required: true,
                                message: 'Por registre su dirección.',
                            },
                        ],
                    })(
                        <TextArea rows={4}/>
                    )}
                </Form.Item>

                <Form.Item label="Referencia de Domicilio">
                    {getFieldDecorator('referenciaDomicilio', {
                        initialValue: fichaPersona.res_referencia_per,
                        rules: [
                            {
                                required: true,
                                message: 'Por favor registre la referencia de su domicilio.',
                            },
                        ],
                    })(
                        <TextArea rows={4}/>
                    )}
                </Form.Item>

                <Form.Item label="Teléfono de Referencia">
                    {getFieldDecorator('telefonoReferencia', {
                        initialValue: fichaPersona.res_telefono_per,
                        rules: [
                            {
                                required: true,
                                message: 'Por favor ingrese un teléfono de referencia.',
                            },
                        ],
                    })(
                        <Input/>
                    )}
                </Form.Item>
            </Form>
        )
    }

}

export default Form.create()(Paso3);