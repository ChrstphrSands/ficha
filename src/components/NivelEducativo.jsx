import React from "react";
import { Form, Select, Layout } from "antd";

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
      ficha: "",
      paises: [],
      ciudades: [],
      provincias: [],
      distritos: [],
      instituciones: [],
      paisesEduc: [],
      ciudadesEduc: [],
      provinciasEduc: [],
      distritosEduc: [],
      session: this.props.session,
      cod_univ: this.props.cod_univ
    };
  }

  async componentDidMount() {
    const {
      ficha,
      paises,
      ciudades,
      provincias,
      distritos,
      instituciones
    } = this.props;
    await this.setState({
      paises: paises,
      ciudadesEduc: ciudades,
      provinciasEduc: provincias,
      distritosEduc: distritos,
      instituciones: instituciones,
      ficha: ficha
    });

    await this.getCiudades();
    await this.getProvincias();
    await this.getDistritos();
  }

  getPaises = async () => {
    // await fetch(`${apiUrl}/Nacionalidad.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}`)
    //   .then(response => response.json())
    //   .then(data => this.setState({ nacionalidades: data }));
  };

  getCiudades = async () => {
    // await fetch(
    //   `${apiUrl}/Ciudad.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}&idPais=9589`
    // )
    //   .then(response => response.json())
    //   .then(data => this.setState({ ciudades: data }));
    const ciudades = [];

    for (let index = 0; index < this.state.ciudadesEduc.length; index++) {
      if (
        this.state.ciudadesEduc[index].relacion ==
        this.state.ficha.id_educ_pais_per
      ) {
        ciudades.push(this.state.ciudadesEduc[index]);
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
    //       id_nac_ciudad_per: "-------",
    //       id_nac_provincia_per: "-------"
    //     }
    //   });
    // }
  };

  getProvincias = async () => {
    // await fetch(
    //   `${apiUrl}/Provincia.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}&idCiudad=2919`
    // )
    //   .then(response => response.json())
    //   .then(data => this.setState({ provincias: data }));

    const provincias = [];
    for (let index = 0; index < this.state.provinciasEduc.length; index++) {
      if (
        this.state.provinciasEduc[index].relacion ==
        this.state.ficha.id_educ_ciudad_per
      ) {
        provincias.push(this.state.provinciasEduc[index]);
      }
    }
    if (provincias.length > 0) {
      await this.setState({
        provincias: provincias
      });
    }
  };

  getDistritos = async () => {
    // await fetch(
    //   `${apiUrl}/Distrito.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}&idPais=9589&idCiudad=2919&idProvincia=2301`
    // )
    //   .then(response => response.json())
    //   .then(data => this.setState({ distritos: data }));

    const distritos = [];
    for (let index = 0; index < this.state.distritosEduc.length; index++) {
      if (
        this.state.distritosEduc[index].CodDistProv ==
        this.state.ficha.id_educ_provincia_per
      ) {
        distritos.push(this.state.distritosEduc[index]);
      }
    }
    if (distritos.length > 0) {
      await this.setState({
        distritos: distritos
      });
    }
  };

  getInstituciones = async () => {
    await fetch(
      `${apiUrl}/NivelEducativo.php?p=read&session=${
        this.state.session
      }&CodUniv=${
        this.state.cod_univ
      }&nivel=1&idPais=9589&idCiudad=2919&idProvincia=2301&idDistrito=230101`
    )
      .then(response => response.json())
      .then(data => this.setState({ instituciones: data }));
  };

  handleSelectedPais = async e => {
    await this.setState({
      ficha: {
        ...this.state.ficha,
        id_educ_pais_per: e
      }
    });
    await this.getCiudades();
  };

  handleSelectedCiudad = async e => {
    await this.setState({
      ficha: {
        ...this.state.ficha,
        id_educ_ciudad_per: e
      }
    });
    await this.getProvincias();
  };

  handleSelectedProvincia = async e => {
    await this.setState({
      ficha: {
        ...this.state.ficha,
        id_educ_provincia_per: e
      }
    });
    await this.getDistritos();
  };

  render() {
    const { handleChangeSelect } = this.props;
    const {
      ficha,
      paises,
      ciudades,
      provincias,
      distritos,
      instituciones
    } = this.state;

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
                ficha.id_educ_pais_per == null
                  ? 9589
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
                onSelect={this.handleSelectedPais}
                showSearch={true}
                optionFilterProp={"children"}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {paises.map(pais => (
                  <Option value={pais.CodNac}>{pais.Descripcion}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Ciudad">
            {getFieldDecorator("ciudad", {
              initialValue:
                ficha.id_educ_ciudad_per === "" ||
                ficha.id_educ_ciudad_per == null
                  ? 2919
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
                ficha.id_educ_provincia_per === "" ||
                ficha.id_educ_provincia_per == null
                  ? 2301
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
                ficha.id_educ_distrito_per === "" ||
                ficha.id_educ_distrito_per == null
                  ? 230101
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
                ficha.idIEdu === "" || ficha.idIEdu == null
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
                showSearch={true}
                optionFilterProp={"children"}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
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
