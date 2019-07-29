import React from "react";
import { Form, Select, DatePicker, Layout } from "antd";
import moment from "moment";

const { Option } = Select;

// const apiUrl = 'https://net.upt.edu.pe/FichaDatos/FichaWeb/modules';
const apiUrl = "http://192.168.0.5/FichaDatos/FichaWeb/modules";

class LugarFechaNacimiento extends React.Component {
  siguiente = e => {
    e.preventDefault();

    if (this.state.edadValida == false) {
      this.props.siguiente();
    }
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
      ciudadesNac: [],
      provinciasNac: [],
      distritosNac: [],
      session: this.props.session,
      cod_univ: this.props.cod_univ,
      cod_ciudad: 2919,
      cod_provincia: 2101,
      cod_distrito: 210101,
      edadValida: false
    };
  }

  async componentDidMount() {
    const { ficha, paises, ciudades, provincias, distritos } = this.props;

    await this.setState({
      paises: paises,
      ciudadesNac: ciudades,
      provinciasNac: provincias,
      distritosNac: distritos,
      ficha: ficha
    });

    await this.getCiudades();
    await this.getProvincias();
    await this.getDistritos();
    await this.validarEdad();
  }

  validarEdad = async () => {
    let a = Math.floor(
      moment(new Date()).diff(moment("07/25/2009"), "years", true)
    );
    if (a > 16) {
      await this.setState({
        edadValida: true
      });
    }
  };

  // getPaises = async () => {
  //   const response = await fetch(
  //     `${apiUrl}/Nacionalidad.php?p=read&session=${
  //       this.state.session
  //     }&CodUniv=${this.state.cod_univ}`
  //   );

  //   const data = await response.json();
  //   this.setState({
  //     nacionalidades: data
  //   });
  // };

  getCiudades = async () => {
    // const response = await fetch(
    //   `${apiUrl}/Ciudad.php?p=read&session=${this.state.session}&CodUniv=${
    //     this.state.cod_univ
    //   }&idPais=${this.state.ficha.id_nac_pais_per}`
    // );
    // const response = await fetch(
    //   `${apiUrl}/Ciudad.php?p=read&session=${this.state.session}&CodUniv=${
    //     this.state.cod_univ
    //   }`
    // );
    // const data = await response.json();
    // await this.setState({
    //   ciudades: data,
    //   ficha: {
    //     ...this.state.ficha,
    //     id_nac_ciudad_per: data[0].CodCiudad
    //   }
    // });

    const ciudades = [];

    for (let index = 0; index < this.state.ciudadesNac.length; index++) {
      if (
        this.state.ciudadesNac[index].relacion ==
        this.state.ficha.id_nac_pais_per
      ) {
        ciudades.push(this.state.ciudadesNac[index]);
      }
    }

    if (ciudades.length > 0) {
      await this.setState({
        ciudades: ciudades
      });
    } else {
      await this.setState({
        ciudades: [],
        ficha: {
          ...this.state.ficha,
          id_nac_ciudad_per: "-------",
          id_nac_provincia_per: "-------"
        }
      });
    }
  };

  getProvincias = async () => {
    // const response = await fetch(
    //   `${apiUrl}/Provincia.php?p=read&session=${this.state.session}&CodUniv=${
    //     this.state.cod_univ
    //   }&idCiudad=${this.state.ficha.id_nac_ciudad_per}`
    // );
    // const data = await response.json();
    // await this.setState({
    //   provincias: data,
    //   ficha: {
    //     ...this.state.ficha,
    //     id_nac_provincia_per: data[0].CodProv
    //   }
    // });
    const provincias = [];
    for (let index = 0; index < this.state.provinciasNac.length; index++) {
      if (
        this.state.provinciasNac[index].relacion ==
        this.state.ficha.id_nac_ciudad_per
      ) {
        provincias.push(this.state.provinciasNac[index]);
      }
    }
    if (provincias.length > 0) {
      await this.setState({
        provincias: provincias
      });
    }
  };

  getDistritos = async () => {
    // const response = await fetch(
    //   `${apiUrl}/Distrito.php?p=read&session=${this.state.session}&CodUniv=${
    //     this.state.cod_univ
    //   }&idPais=9589&idCiudad=${
    //     this.state.ficha.id_nac_ciudad_per
    //   }&idProvincia=${this.state.ficha.id_nac_provincia_per}`
    // );
    // const data = await response.json();
    // await this.setState({
    //   distritos: data,
    //   ficha: {
    //     ...this.state.ficha,
    //     id_nac_distrito_per: data[0].CodDist
    //   }
    // });

    const distritos = [];
    for (let index = 0; index < this.state.distritosNac.length; index++) {
      if (
        this.state.distritosNac[index].CodDistProv ==
        this.state.ficha.id_nac_provincia_per
      ) {
        distritos.push(this.state.distritosNac[index]);
      }
    }
    if (distritos.length > 0) {
      await this.setState({
        distritos: distritos
      });
    }
  };

  handleSelectedPais = async e => {
    await this.setState({
      ficha: {
        ...this.state.ficha,
        id_nac_pais_per: e
      }
    });
    await this.getCiudades();
  };

  handleSelectedCiudad = async e => {
    await this.setState({
      ficha: {
        ...this.state.ficha,
        id_nac_ciudad_per: e
      }
    });
    await this.getProvincias();
  };

  handleSelectedProvincia = async e => {
    await this.setState({
      ficha: {
        ...this.state.ficha,
        id_nac_provincia_per: e
      }
    });
    await this.getDistritos();
  };

  render() {
    const { handleChangeSelect, handleChangeDatePicker } = this.props;

    const { ficha, paises, ciudades, provincias, distritos } = this.state;

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
    const dateFormat = "YYYY-DD-MM";
    // const dateFormat2 = ["DD-MM-YYYY", "DD-MM-YY"];

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
                // format={dateFormat2}
                onChange={handleChangeDatePicker("fch_nacimiento_per")}
              />
            )}
          </Form.Item>

          <Form.Item label="País">
            {getFieldDecorator("pais", {
              initialValue:
                ficha.id_nac_pais_per === "" || ficha.id_nac_pais_per == null
                  ? 9589
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
                ficha.id_nac_ciudad_per == null
                  ? 2919
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
                ficha.id_nac_provincia_per == null
                  ? 2301
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
                ficha.id_nac_distrito_per == null
                  ? 2301
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
