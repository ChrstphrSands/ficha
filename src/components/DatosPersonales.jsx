import React from "react";
import { Form, Input, Select } from "antd";
import { Layout } from "antd";

const { Option } = Select;

const initttt = {
  mode: "no-cors",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};

const apiUrl = "http://localhost";
// const apiUrl = 'https://net.upt.edu.pe';

class DatosPersonales extends React.Component {
  continue = e => {
    e.preventDefault();
    this.props.siguiente();

    this.validar();
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.validar();
  }

  // getDiscapacidades = async () => {
  //   const response = await fetch(
  //     `${apiUrl}/FichaDatos/FichaWeb/modules/Discapacidad.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}`
  //   );
  //   const data = await response.json();
  //   await this.setState({
  //     discapacidades: data
  //   });
  // };
  //
  // getEstadosCiviles = async () => {
  //   const response = await fetch(
  //     `${apiUrl}/FichaDatos/FichaWeb/modules/EstadoCivil.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}`);
  //   const data = await response.json();
  //   await this.setState({
  //     estadosCiviles: data
  //   });
  // };

  // getTipoDocumento = async () => {
  //   const response = await fetch(
  //     `${apiUrl}/FichaDatos/FichaWeb/modules/TipoDocumento.php?p=read&session=${this.state.session}&CodUniv=${this.state.cod_univ}`);
  //   const data = await response.json();
  //   await this.setState({
  //     tiposDocumentos: data
  //   });
  // };

  validar = () => {
    const { ficha } = this.props;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(re.test(String(ficha.email_per).toLowerCase()));
  };

  render() {
    const { ficha, handleChangeInput, handleChangeSelect } = this.props;
    const { discapacidades } = this.props;
    const { estadosCiviles } = this.props;
    const { tiposDocumentos } = this.props;

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
        <Form {...formItemLayout} onSubmit={this.handleSave}>
          <Form.Item label="Nombres">
            {getFieldDecorator("nombres", {
              initialValue: ficha.nombre_per,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Input
                style={{ background: "lightgray" }}
                onChange={handleChangeInput("nombre_per")}
                readOnly={true}
              />
            )}
          </Form.Item>
          <Form.Item label="Apellido Paterno">
            {getFieldDecorator("paterno", {
              initialValue: ficha.apellido_pat_per,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Input
                style={{ background: "lightgray" }}
                onChange={handleChangeInput("apellido_pat_per")}
                readOnly={true}
              />
            )}
          </Form.Item>
          <Form.Item label="Apellido Materno">
            {getFieldDecorator("materno", {
              initialValue: ficha.apellido_mat_per,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Input
                style={{ background: "lightgray" }}
                onChange={handleChangeInput("apellido_mat_per")}
                readOnly={true}
              />
            )}
          </Form.Item>

          <Form.Item label="Género">
            {getFieldDecorator("genero", {
              initialValue: ficha.sexo_per === "" ? "M" : ficha.sexo_per,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Select
                placeholder={"Seleccione su sexo"}
                onChange={handleChangeSelect("sexo_per")}
                disabled={true}
              >
                <Option value="M">Masculino</Option>
                <Option value="F">Femenino</Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item label="Tipo de documento">
            {getFieldDecorator("documento", {
              initialValue:
                ficha.id_tipo_doc === "" || ficha.id_tipo_doc === "0"
                  ? "1"
                  : ficha.id_tipo_doc,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Select
                placeholder={"DNI"}
                onChange={handleChangeSelect("id_tipo_doc")}
                disabled={true}
              >
                {tiposDocumentos.map(tipoDocumento => (
                  <Option
                    key={tipoDocumento.id_tipo_doc}
                    value={tipoDocumento.id_tipo_doc}
                  >
                    {tipoDocumento.desc_tipo_doc}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Nro. de Documento">
            {getFieldDecorator("dni", {
              initialValue: ficha.nro_doc_per,
              rules: [
                {
                  required: false
                }
              ]
            })(
              <Input
                style={{ background: "lightgray" }}
                onChange={handleChangeInput("nro_doc_per")}
                readOnly={true}
              />
            )}
          </Form.Item>

          <Form.Item label="Estado Civil">
            {getFieldDecorator("estadoCivil", {
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione su estado civil."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione su estado civil"}
                onChange={handleChangeSelect("id_est_civil")}
                disabled={false}
              >
                {estadosCiviles.map(estadoCivil => (
                  <Option
                    key={estadoCivil.id_est_civil}
                    value={estadoCivil.id_est_civil}
                  >
                    {estadoCivil.desc_est_civil}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Discapacidad">
            {getFieldDecorator("discapacidad", {
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: "En caso cuente con una discapacidad seleccione una."
                }
              ]
            })(
              <Select
                placeholder={"Seleccione en caso tenga alguna discapacidad"}
                onChange={handleChangeSelect("IdAdm_Discapacidad")}
              >
                {discapacidades.map(discapacidad => (
                  <Option
                    key={discapacidad.IdAdm_Discapacidad}
                    value={discapacidad.IdAdm_Discapacidad}
                  >
                    {discapacidad.Descripcion}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="E-mail">
            {getFieldDecorator("email", {
              initialValue: ficha.email_per,
              rules: [
                {
                  type: "email",
                  message: "El correo no es válido"
                },
                {
                  required: true,
                  message: "Por favor ingrese su E-mail"
                }
              ]
            })(<Input onChange={handleChangeInput("email_per")} />)}
          </Form.Item>

          <Form.Item label="Celular">
            {getFieldDecorator("celular", {
              initialValue: ficha.celular_per,
              rules: [
                {
                  required: true,
                  message: "Por favor ingrese su número de celular"
                }
              ]
            })(<Input onChange={handleChangeInput("celular_per")} />)}
          </Form.Item>
          <Form.Item label="Teléfono">
            {getFieldDecorator("telefono", {
              initialValue: ficha.telefono_per
            })(<Input onChange={handleChangeInput("telefono_per")} />)}
          </Form.Item>
        </Form>
      </Layout>
    );
  }
}

export default Form.create()(DatosPersonales);
