import React from "react";
import { Form, Select, DatePicker, Layout } from "antd";
import moment from "moment";

const { Option } = Select;

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

  async componentDidMount() {
    await this.getPaises();
    await this.getCiudades();
    await this.getProvincias();
    await this.getDistritos();
  }

  getPaises = async () => {
    const response = await fetch(
      "http://localhost/FichaWeb/app/controller/nacionalidad/read.php"
    );

    const data = await response.json();
    await this.setState({
      nacionalidades: data
    });
  };

  getCiudades = async () => {
    const response = await fetch(
      `http://localhost/FichaWeb/app/controller/ciudad/read.php?idPais=9589`
    );
    const data = await response.json();
    await this.setState({
      ciudades: data
    });
  };

  getProvincias = async () => {
    const response = await fetch(
      "http://localhost/FichaWeb/app/controller/provincia/read.php/?idCiudad=2919"
    );

    const data = await response.json();
    await this.setState({
      provincias: data
    });
  };

  getDistritos = async () => {
    const response = await fetch(
      "http://localhost/FichaWeb/app/controller/distrito/read.php/?idPais=9589&idCiudad=2919&idProvincia=2301"
    );
    const data = await response.json();
    await this.setState({
      distritos: data
    });
  };

  render() {
    const { ficha, handleChangeSelect, handleChangeDatePicker } = this.props;
    const { nacionalidades, ciudades, provincias, distritos } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };

    const { getFieldDecorator } = this.props.form;
    const dateFormat = "YYYY-MM-DD";
    const dateFormat2 = ["DD-MM-YYYY", "DD-MM-YY"];

    return (
      <Layout style={{ background: "white" }}>
        <Form {...formItemLayout}>
          <Form.Item label="Fecha de Nacimiento">
            {getFieldDecorator("fechaNac", {
              initialValue:
                ficha.fch_nacimiento_per === ""
                  ? moment("1999-11-25", dateFormat)
                  : moment(ficha.fch_nacimiento_per, dateFormat),
              rules: [
                {
                  type: "object",
                  required: true,
                  message: "Por favor seleccione la fecha de su nacimiento"
                }
              ]
            })(
              <DatePicker
                defaultPickerValue={moment(ficha.fch_nacimiento_per)}
                placeholder={"25-11-1999"}
                format={dateFormat2}
                onChange={handleChangeDatePicker("fch_nacimiento_per")}
              />
            )}
          </Form.Item>

          <Form.Item label="País">
            {getFieldDecorator("pais", {
              initialValue:
                ficha.id_nac_pais_per === "" || ficha.id_nac_pais_per == null
                  ? "9589"
                  : ficha.id_nac_pais_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione el país."
                }
              ]
            })(
              <Select
                placeholder={"Perú"}
                onChange={handleChangeSelect("id_nac_pais_per")}
                showSearch={true}
                optionFilterProp={"children"}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {nacionalidades.map(nacionalidad => (
                  <Option value={nacionalidad.CodNac}>
                    {nacionalidad.Descripcion}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Ciudad">
            {getFieldDecorator("ciudad", {
              initialValue:
                ficha.id_nac_ciudad_per === "" ||
                ficha.id_nac_ciudad_per == null
                  ? "2919"
                  : ficha.id_nac_ciudad_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione la ciudad."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione ciudad"}
                onChange={handleChangeSelect("id_nac_ciudad_per")}
              >
                {ciudades.map(ciudad => (
                  <Option value={ciudad.CodCiudad}>{ciudad.descripcion}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Provincia">
            {getFieldDecorator("provincia", {
              initialValue:
                ficha.id_nac_provincia_per === "" ||
                ficha.id_nac_provincia_per == null
                  ? "2301"
                  : ficha.id_nac_provincia_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione la provincia."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione la provincia"}
                onChange={handleChangeSelect("id_nac_provincia_per")}
              >
                {provincias.map(provincia => (
                  <Option value={provincia.CodProv}>
                    {provincia.descripcion}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Distrito">
            {getFieldDecorator("distrito", {
              initialValue:
                ficha.id_nac_distrito_per === "" ||
                ficha.id_nac_distrito_per == null
                  ? "230101"
                  : ficha.id_nac_distrito_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione el distrito."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione el distrito"}
                onChange={handleChangeSelect("id_nac_distrito_per")}
              >
                {distritos.map(distrito => (
                  <Option value={distrito.CodDist}>
                    {distrito.descripcion}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Layout>
    );
  }
}

export default Form.create()(LugarFechaNacimiento);
