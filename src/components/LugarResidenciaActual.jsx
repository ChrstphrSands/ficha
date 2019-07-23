import React from "react";
import { Form, Input, Select, Layout } from "antd";

const { TextArea } = Input;
const { Option } = Select;

class LugarResidenciaActual extends React.Component {
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
      ciudades: [],
      provincias: [],
      distritos: [],
      dependencias: []
    };
  }

  componentDidMount() {
    this.getCiudades();
    this.getProvincias();
    this.getDistritos();
    this.getDependencias();
  }

  getCiudades() {
    fetch(
      "http://localhost/FichaWeb/app/controller/ciudad/read.php/?idPais=9589"
    )
      .then(response => response.json())
      .then(data => this.setState({ ciudades: data }));
  }

  getProvincias() {
    fetch(
      "http://localhost/FichaWeb/app/controller/provincia/read.php/?idCiudad=2919"
    )
      .then(response => response.json())
      .then(data => this.setState({ provincias: data }));
  }

  getDistritos() {
    fetch(
      "http://localhost/FichaWeb/app/controller/distrito/read.php/?idPais=9589&idCiudad=2919&idProvincia=2301"
    )
      .then(response => response.json())
      .then(data => this.setState({ distritos: data }));
  }

  getDependencias() {
    fetch(
      "http://localhost/FichaWeb/app/controller/dependenciaVivienda/read.php"
    )
      .then(response => response.json())
      .then(data => this.setState({ dependencias: data }));
  }

  render() {
    const { ciudades, provincias, distritos, dependencias } = this.state;
    // const { provincias } = this.state;
    // const { distritos } = this.state;
    const { ficha, handleChangeInput, handleChangeSelect } = this.props;

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

    return (
      <Layout style={{ background: "white" }}>
        <Form {...formItemLayout}>
          <Form.Item label="Ciudad">
            {getFieldDecorator("ciudad", {
              initialValue:
                ficha.id_res_ciudad_per === "" ||
                ficha.id_res_ciudad_per == null
                  ? "2919"
                  : ficha.id_res_ciudad_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione la ciudad."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione en caso tenga alguna discapacidad"}
                onChange={handleChangeSelect("id_res_ciudad_per")}
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
                ficha.id_res_provincia_per === "" ||
                ficha.id_res_provincia_per == null
                  ? "2301"
                  : ficha.id_res_provincia_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione la provincia."
                }
              ]
            })(
              <Select
                placeholder={"Provincia"}
                onChange={handleChangeSelect("id_res_provincia_per")}
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
                ficha.id_res_distrito_per === "" ||
                ficha.id_res_distrito_per == null
                  ? "230101"
                  : ficha.id_res_distrito_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione el distrito."
                }
              ]
            })(
              <Select
                placeholder={"Distrito"}
                onChange={handleChangeSelect("id_res_distrito_per")}
              >
                {distritos.map(distrito => (
                  <Option value={distrito.CodDist}>
                    {distrito.descripcion}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Dirección de Domicilio">
            {getFieldDecorator("direccionDomicilio", {
              initialValue: ficha.res_direccion_per,
              rules: [
                {
                  required: true,
                  message: "Por registre su dirección."
                }
              ]
            })(
              <TextArea
                rows={4}
                onChange={handleChangeInput("res_direccion_per")}
              />
            )}
          </Form.Item>

          <Form.Item label="Referencia de Domicilio">
            {getFieldDecorator("referenciaDomicilio", {
              initialValue: ficha.res_referencia_per,
              rules: [
                {
                  required: true,
                  message: "Por favor registre la referencia de su domicilio."
                }
              ]
            })(
              <TextArea
                rows={4}
                onChange={handleChangeInput("res_referencia_per")}
              />
            )}
          </Form.Item>

          <Form.Item label="Teléfono de Referencia">
            {getFieldDecorator("telefonoReferencia", {
              initialValue: ficha.res_telefono_per,
              rules: [
                {
                  required: true,
                  message: "Por favor ingrese un teléfono de referencia."
                }
              ]
            })(<Input onChange={handleChangeInput("res_telefono_per")} />)}
          </Form.Item>

          <Form.Item label="Vive en:">
            {getFieldDecorator("dependencia", {
              initialValue:
                ficha.id_dependencia_vivienda === "" ||
                ficha.id_dependencia_vivienda == null
                  ? "1"
                  : ficha.id_dependencia_vivienda,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione una dependencia."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione:"}
                onChange={handleChangeSelect("id_dependencia_vivienda")}
              >
                {dependencias.map(dependencia => (
                  <Option value={dependencia.id_dependencia_vivienda}>
                    {dependencia.descripcion}
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

export default Form.create()(LugarResidenciaActual);
