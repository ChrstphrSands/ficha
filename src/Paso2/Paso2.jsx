import React from 'react';
import {Form, Input, Button, Select, DatePicker} from 'antd';
import moment from 'moment';

const {Option} = Select;

let idPais = '';

class Paso2 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nacionalidades: [],
            ciudades: [],
            provincias: [],
            distritos: [],
            fichaPersona: [],
            idPais: '',
        };
    }

    componentDidMount() {
        this.getFichaPersona();
        this.getPaises();
        // this.getCiudades();
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
        fetch(`http://localhost/FichaWeb/app/controller/ciudad/read.php?idPais=${this.state.idPais}`)
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

    handleChanges(e) {
        let {name, value} = e.target;
        this.setState({idPais: value})
        console.log(this.state.idPais);
        this.getCiudades();
    }

    render() {

        const {nacionalidades} = this.state;
        const {ciudades} = this.state;
        const {fichaPersona} = this.state;
        const {provincias} = this.state;
        const {distritos} = this.state;

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
        const dateFormat = 'DD/MM/YYYY';
        const config = {
            rules: [{type: 'object', required: true, message: 'Por favor seleccione la fecha de su nacimiento'}],
        };

        return (
            <Form {...formItemLayout} style={{width: "75%"}}>
                <Form.Item label="Fecha de Nacimiento">
                    {getFieldDecorator('fechaNac', {
                        initialValue: moment(fichaPersona.fch_nacimiento_per, dateFormat)
                    }, config)
                    (
                        <DatePicker defaultPickerValue={moment(fichaPersona.fch_nacimiento_per, dateFormat)}
                                    placeholder={"25/11/1999"}
                                    format={dateFormat}/>
                    )}
                </Form.Item>

                <Form.Item label="País">
                    {getFieldDecorator('pais', {
                        initialValue: fichaPersona.id_nac_pais_per,
                        rules: [
                            {
                                required: true,
                                message: 'Por favor seleccione el país.',
                            },
                        ],
                    })(
                        <Select
                            placeholder={"Seleccione el país"}
                            onChange={this.handleChanges}
                            showSearch={true}
                            optionFilterProp={"children"}
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                nacionalidades.map(nacionalidad =>
                                    <Option value={nacionalidad.CodNac}>{nacionalidad.Descripcion}</Option>
                                )
                            }
                        </Select>)}
                </Form.Item>
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
                        <Select placeholder={"Seleccione ciudad"} onChange={this.handleChanges}
                                showSearch={true}
                                optionFilterProp={"children"}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                        >
                            {
                                ciudades.map(ciudad =>
                                    <Option value={ciudad.CodCiudad}>{ciudad.descripcion}</Option>)
                            }
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
                        <Select placeholder={"Seleccione la provincia"} onChange={this.handleChanges}
                                showSearch={true}
                                optionFilterProp={"children"}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                        >
                            {
                                provincias.map(provincia =>
                                    <Option value={provincia.CodProv}>{provincia.descripcion}</Option>
                                )
                            }
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
                    })(
                        <Select placeholder={"Seleccione el distrito"} onChange={this.handleChanges}
                                showSearch={true}
                                optionFilterProp={"children"}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                        >
                            {
                                distritos.map(distrito =>
                                    <Option value={distrito.CodDist}>{distrito.descripcion}</Option>
                                )
                            }
                        </Select>
                    )}
                </Form.Item>
            </Form>
        )
    }

}

export default Form.create()(Paso2);