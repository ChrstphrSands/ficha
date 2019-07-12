import React from 'react';
import {Form, Select, DatePicker, Layout} from 'antd';
import moment from "moment";

const {Option} = Select;

let idPais = '';

class LugarFechaNacimiento extends React.Component {

  siguiente = e => {
    e.preventDefault();
    this.props.siguiente();
  };

  regresar = e => {
    e.preventDefault();
    this.props.regresar();
  };

  constructor(props) {
    super(props);

    this.state = {
      nacionalidades: [],
      ciudades: [],
      provincias: [],
      distritos: []
    };
  }

  componentDidMount() {
    this.getPaises();
    this.getCiudades();
    this.getProvincias();
    this.getDistritos();
  }

  getPaises() {
    fetch('http://localhost/FichaWeb/app/controller/nacionalidad/read.php')
      .then(response => response.json())
      .then(data => this.setState({nacionalidades: data}));
  }

  getCiudades() {
    fetch(`http://localhost/FichaWeb/app/controller/ciudad/read.php?idPais=9589`)
      .then(response => response.json())
      .then(data => this.setState({ciudades: data}));
    console.log(idPais);
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
    const {ficha, handleChangeSelect, handleChangeDatePicker} = this.props;
    const {nacionalidades, ciudades, provincias, distritos} = this.state;

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
    const dateFormat = 'DD-MM-YYYY';

    return (
      <Layout style={{background: "white"}}>
        <Form {...formItemLayout} >
          <Form.Item label="Fecha de Nacimiento">
            {getFieldDecorator('fechaNac', {
              initialValue: moment(ficha.fch_nacimiento_per, dateFormat),
              rules: [
                {type: 'object', required: true, message: 'Por favor seleccione la fecha de su nacimiento'}
              ],
            })(
              <DatePicker
                defaultPickerValue={moment(ficha.fch_nacimiento_per, dateFormat)}
                placeholder={"25-11-1999"}
                format={dateFormat}
                onChange={handleChangeDatePicker('fch_nacimiento_per')}
              />
            )}
          </Form.Item>

          <Form.Item label="País">
            {getFieldDecorator('pais', {
              initialValue: ficha.id_nac_pais_per == '' ? '9589': ficha.id_nac_pais_per,
              rules: [
                {
                  required: true,
                  message: 'Por favor seleccione el país.',
                },
              ],
            })(
              <Select
                placeholder={"Perú"}
                onChange={handleChangeSelect('id_nac_pais_per')}
                showSearch={true}
                optionFilterProp={"children"}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                {
                  nacionalidades.map(nacionalidad =>
                    <Option value={nacionalidad.CodNac}>{nacionalidad.Descripcion}</Option>)
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Ciudad">
            {getFieldDecorator('ciudad', {
              initialValue: ficha.id_nac_ciudad_per == '' ? '2919': ficha.id_nac_ciudad_per,
              rules: [
                {
                  required: true,
                  message: 'Por favor seleccione la ciudad.',
                },
              ],
            })(
              <Select placeholder={"Seleccione ciudad"} onChange={handleChangeSelect('id_nac_ciudad_per')}>
                {
                  ciudades.map(ciudad =>
                    <Option value={ciudad.CodCiudad}>{ciudad.descripcion}</Option>)
                }
              </Select>)}
          </Form.Item>
          <Form.Item label="Provincia">
            {getFieldDecorator('provincia', {
              initialValue: ficha.id_nac_provincia_per == '' ? '2301': ficha.id_nac_provincia_per,
              rules: [
                {
                  required: true,
                  message: 'Por favor seleccione la provincia.',
                },
              ],
            })(
              <Select placeholder={"Seleccione la provincia"} onChange={handleChangeSelect('id_nac_provincia_per')}>
                {provincias.map(provincia =>
                  <Option value={provincia.CodProv}>{provincia.descripcion}</Option>
                )}
              </Select>)}
          </Form.Item>
          <Form.Item label="Distrito">
            {getFieldDecorator('distrito', {
              initialValue: ficha.id_nac_distrito_per == '' ? '230101': ficha.id_nac_distrito_per,
              rules: [
                {
                  required: true,
                  message: 'Por favor seleccione el distrito.',
                },
              ],
            })(
              <Select placeholder={"Seleccione el distrito"} onChange={handleChangeSelect('id_nac_distrito_per')}>
                {distritos.map(distrito =>
                  <Option value={distrito.CodDist}>{distrito.descripcion}</Option>
                )}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Layout>
    )
  }
}

export default Form.create()(LugarFechaNacimiento);