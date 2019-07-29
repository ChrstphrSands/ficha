import React from "react";
import { Form, Input, Select, Layout } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const initttt = {
  mode: "no-cors",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};

const apiUrl = "http://192.168.0.5/FichaDatos/FichaWeb/modules";
// const apiUrl = 'https://net.upt.edu.pe/FichaDatos/FichaWeb/modules';
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
      ficha: "",
      ciudades: [],
      provincias: [],
      distritos: [],
      dependencias: [],
      ciudadesRes: [],
      provinciasRes: [],
      distritosRes: [],
      session: this.props.session,
      cod_univ: this.props.cod_univ
    };
  }

  async componentDidMount() {
    const { ficha, ciudades, provincias, distritos, dependencias } = this.props;

    await this.setState({
      ficha: ficha,
      ciudadesRes: ciudades,
      provinciasRes: provincias,
      distritosRes: distritos,
      dependencias: dependencias
    });
    await this.getCiudades();
    await this.getProvincias();
    await this.getDistritos();
    // this.getDependencias();
  }

  getCiudades = async () => {
    // await fetch(
    //   `${apiUrl}/Ciudad.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}&idPais=9589`
    // )
    //   .then(response => response.json())
    //   .then(data => this.setState({ ciudades: data }));
    const ciudades = [];

    for (let index = 0; index < this.state.ciudadesRes.length; index++) {
      if (this.state.ciudadesRes[index].relacion == 9589) {
        ciudades.push(this.state.ciudadesRes[index]);
      }
    }

    if (ciudades.length > 0) {
      await this.setState({
        ciudades: ciudades
      });
    }
    // else {
    //   await this.setState({
    //     ciudades: [],
    //     ficha: {
    //       ...this.state.ficha,
    //       id_res_ciudad_per: "-------",
    //       id_res_provincia_per: "-------"
    //     }
    //   });
    // }
  };

  getProvincias = async () => {
    const provincias = [];
    for (let index = 0; index < this.state.provinciasRes.length; index++) {
      if (
        this.state.provinciasRes[index].relacion ==
        this.state.ficha.id_res_ciudad_per
      ) {
        provincias.push(this.state.provinciasRes[index]);
      }
    }
    if (provincias.length > 0) {
      await this.setState({
        provincias: provincias
      });
    }

    // await fetch(
    //   `${apiUrl}/Provincia.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}&idCiudad=2919`
    // )
    //   .then(response => response.json())
    //   .then(data => this.setState({ provincias: data }));
  };

  getDistritos = async () => {
    const distritos = [];
    for (let index = 0; index < this.state.distritosRes.length; index++) {
      if (
        this.state.distritosRes[index].CodDistProv ==
        this.state.ficha.id_res_provincia_per
      ) {
        distritos.push(this.state.distritosRes[index]);
      }
    }
    if (distritos.length > 0) {
      await this.setState({
        distritos: distritos
      });
    }
    // await fetch(
    //   `${apiUrl}/Distrito.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}&idPais=9589&idCiudad=2919&idProvincia=2301`
    // )
    //   .then(response => response.json())
    //   .then(data => this.setState({ distritos: data }));
  };

  getDependencias = async () => {
    await fetch(
      `${apiUrl}/DependenciaVivienda.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    )
      .then(response => response.json())
      .then(data => this.setState({ dependencias: data }));
  };

  handleSelectedCiudad = async e => {
    await this.setState({
      ficha: {
        ...this.state.ficha,
        id_res_ciudad_per: e
      }
    });
    await this.getProvincias();
  };

  handleSelectedProvincia = async e => {
    await this.setState({
      ficha: {
        ...this.state.ficha,
        id_res_provincia_per: e
      }
    });
    await this.getDistritos();
  };

  render() {
    // const { dependencias } = this.state;
    // const { provincias } = this.state;
    // const { distritos } = this.state;
    const { handleChangeInput, handleChangeSelect } = this.props;
    const { ficha, ciudades, provincias, distritos, dependencias } = this.state;

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
                  ? 2919
                  : ficha.id_res_ciudad_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione la ciudad."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione la ciudad donde reside"}
                onChange={handleChangeSelect("id_res_ciudad_per")}
                onSelect={this.handleSelectedCiudad}
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
                  ? 2301
                  : ficha.id_res_provincia_per,
              rules: [
                {
                  required: true,
                  message: "Seleccione la provincia donde reside."
                }
              ]
            })(
              <Select
                placeholder={"Provincia"}
                onChange={handleChangeSelect("id_res_provincia_per")}
                onSelect={this.handleSelectedProvincia}
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
                  ? 230101
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
                  ? 1
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
