import React from "react";
import {Form, Input, Select} from "antd";
import {Layout} from "antd";

const {Option} = Select;

class DatosPersonales extends React.Component {
  continue = e => {
    e.preventDefault();
    this.props.siguiente();
  };

  constructor(props) {
    super(props);

    this.state = {
      idiomas: [],
      discapacidades: [],
      estadosCiviles: [],
      tiposDocumentos: []
    };
  }

  async componentDidMount() {
    await this.getIdiomas();
    await this.getDiscapacidades();
    await this.getEstadosCiviles();
    await this.getTipoDocumento()
  }

  getIdiomas = async () => {
    const response = await fetch(`http://localhost/FichaWeb/app/controller/idioma/read.php`);
    const data = await response.json();
    await this.setState({
      nacionalidades: data
    });
  }

  getDiscapacidades = async () => {
    const response = await fetch("http://localhost/FichaWeb/app/controller/discapacidad/read.php");
    const data = await response.json();
    await this.setState({
      discapacidades: data
    })
  }

  getEstadosCiviles = async () => {
    const response = await fetch("http://localhost/FichaWeb/app/controller/estadoCivil/read.php");
    const data = await response.json();
    await this.setState({
      estadosCiviles: data
    })
  }

  getTipoDocumento = async () => {
    const response = await fetch("http://localhost/FichaWeb/app/controller/tipoDocumento/read.php");
    const data = await response.json();
    await this.setState({
      tiposDocumentos: data
    });
  }

  render() {
    const {ficha, handleChangeInput, handleChangeSelect} = this.props;
    const {discapacidades} = this.state;
    const {estadosCiviles} = this.state;
    const {tiposDocumentos} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16}
      }
    };

    const {getFieldDecorator} = this.props.form;

    return (
      <Layout style={{background: "white"}}>
        <Form {...formItemLayout} onSubmit={this.handleSave}>
          <Form.Item label="Nombres">
            {getFieldDecorator("nombres", {
              initialValue: ficha.nombre_per,
              rules: [
                {
                  required: true,
                  message: "Por favor ingrese sus nombres"
                }
              ]
            })(
              <Input
                onChange={handleChangeInput("nombre_per")}
                disabled={true}
              />
            )}
          </Form.Item>
          <Form.Item label="Apellido Paterno">
            {getFieldDecorator("paterno", {
              initialValue: ficha.apellido_pat_per,
              rules: [
                {
                  required: true,
                  message: "Por favor ingrese su apellido paterno"
                }
              ]
            })(
              <Input
                onChange={handleChangeInput("apellido_pat_per")}
                disabled={true}
              />
            )}
          </Form.Item>
          <Form.Item label="Apellido Materno">
            {getFieldDecorator("materno", {
              initialValue: ficha.apellido_mat_per,
              rules: [
                {
                  required: true,
                  message: "Por favor ingrese su apellido materno"
                }
              ]
            })(
              <Input
                onChange={handleChangeInput("apellido_mat_per")}
                disabled={true}
              />
            )}
          </Form.Item>

          <Form.Item label="Género">
            {getFieldDecorator("genero", {
              initialValue: ficha.sexo_per === "" ? "M" : ficha.sexo_per,
              rules: [
                {
                  required: true,
                  message: "Por favor seleccione su género."
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

          <Form.Item label="Estado Civil">
            {getFieldDecorator("estadoCivil", {
              initialValue: ficha.id_est_civil === "" ? "1" : ficha.id_est_civil,
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
                disabled={true}
              >
                {estadosCiviles.map(estadoCivil => (
                  <Option value={estadoCivil.id_est_civil}>
                    {estadoCivil.desc_est_civil}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Discapacidad">
            {getFieldDecorator("discapacidad", {
              initialValue:
                ficha.IdAdm_Discapacidad === "" ||
                ficha.IdAdm_Discapacidad === "0"
                  ? "1"
                  : ficha.IdAdm_Discapacidad,
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
                disabled={true}
              >
                {discapacidades.map(discapacidad => (
                  <Option value={discapacidad.IdAdm_Discapacidad}>
                    {discapacidad.Descripcion}
                  </Option>
                ))}
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
                  required: true,
                  message: "Seleccione el tipo de documento."
                }
              ]
            })(
              <Select
                placeholder={"DNI"}
                onChange={handleChangeSelect("id_tipo_doc")}
                disabled={true}
              >
                {tiposDocumentos.map(tipoDocumento => (
                  <Option value={tipoDocumento.id_tipo_doc}>
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
                  required: true,
                  message: "Por favor ingrese su DNI"
                }
              ]
            })(
              <Input
                onChange={handleChangeInput("nro_doc_per")}
                disabled={true}
              />
            )}
          </Form.Item>

          <Form.Item label="E-mail">
            {getFieldDecorator("email", {
              initialValue: ficha.email_per,
              rules: [
                {
                  required: true,
                  message: "Por favor ingrese eu E-mail"
                }
              ]
            })(<Input onChange={handleChangeInput("email_per")}/>)}
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
            })(<Input onChange={handleChangeInput("celular_per")}/>)}
          </Form.Item>
          <Form.Item label="Teléfono">
            {getFieldDecorator("telefono", {
              initialValue: ficha.telefono_per
            })(<Input onChange={handleChangeInput("telefono_per")}/>)}
          </Form.Item>
        </Form>
      </Layout>
    );
  }
}

export default Form.create()(DatosPersonales);
