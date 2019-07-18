import React from "react";
import { Form, Select, Layout } from "antd";

const { Option } = Select;

class NivelEducativo extends React.Component {
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
      distritos: [],
      instituciones: []
    };
  }

  componentDidMount() {
    this.getPaises();
    this.getCiudades();
    this.getProvincias();
    this.getDistritos();
    this.getInstituciones();
  }

  getPaises() {
    fetch("http://localhost/FichaWeb/app/controller/nacionalidad/read.php")
      .then(response => response.json())
      .then(data => this.setState({ nacionalidades: data }));
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

  getInstituciones() {
    fetch(
      "http://localhost/FichaWeb/app/controller/nivelEducativo/read.php/?nivel=1&idPais=9589&idCiudad=2919&idProvincia=2301&idDistrito=230101"
    )
      .then(response => response.json())
      .then(data => this.setState({ instituciones: data }));
  }

  render() {
    const { nacionalidades } = this.state;
    const { ciudades } = this.state;
    const { provincias } = this.state;
    const { distritos } = this.state;
    const { instituciones } = this.state;
    const { ficha, handleChangeSelect } = this.props;

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
          <Form.Item label="Pais">
            {getFieldDecorator("pais", {
              initialValue:
                ficha.id_educ_pais_per === "" ||
                ficha.id_educ_pais_per === "0" ||
                ficha.id_educ_pais_per === null
                  ? "9589"
                  : ficha.id_educ_pais_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione el pais."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione el pais"}
                onChange={handleChangeSelect("id_educ_pais_per")}
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
                ficha.id_educ_ciudad_per == "" ||
                ficha.id_educ_ciudad_per == null
                  ? "2919"
                  : ficha.id_educ_ciudad_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione la ciudad."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione la ciudad"}
                onChange={handleChangeSelect("id_educ_ciudad_per")}
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
                ficha.id_educ_provincia_per == "" ||
                ficha.id_educ_provincia_per == null
                  ? "2301"
                  : ficha.id_educ_provincia_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione la provincia."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione la provincia"}
                onChange={handleChangeSelect("id_educ_provincia_per")}
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
                ficha.id_educ_distrito_per == "" ||
                ficha.id_educ_distrito_per == null
                  ? "230101"
                  : ficha.id_educ_distrito_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione el distrito."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione el distrito"}
                onChange={handleChangeSelect("id_educ_distrito_per")}
              >
                {distritos.map(distritos => (
                  <Option value={distritos.CodDist}>
                    {distritos.descripcion}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Institucion Educativa">
            {getFieldDecorator("institucion", {
              initialValue:
                ficha.idIEdu == "" || ficha.idIEdu == null
                  ? "NINGUNO"
                  : ficha.idIEdu,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione la Institución Educativa."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione la Institución Educativa"}
                onChange={handleChangeSelect("idIEdu")}
              >
                {instituciones.map(institucion => (
                  <Option value={institucion.IdiEdu}>
                    {institucion.NombreIE}
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

export default Form.create()(NivelEducativo);
