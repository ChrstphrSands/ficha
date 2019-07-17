import React from "react";
import DatosPersonales from "./DatosPersonales";
import LugarFechaNacimiento from "./LugarFechaNacimiento";
import LugarResidenciaActual from "./LugarResidenciaActual";
import NivelEducativo from "./NivelEducativo";
import { Steps, Button, Modal, Input, Form } from "antd";
import { Layout } from "antd";

const { Header, Content } = Layout;

const { Step } = Steps;

class UsuarioForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paso: 0,
      nombre_per: "",
      apellido_pat_per: "",
      apellido_mat_per: "",
      id_tipo_doc: "",
      nro_doc_per: "",
      sexo_per: "",
      id_est_civil: "",
      telefono_per: "",
      celular_per: "",
      email_per: "",
      nacionalidad: "",
      fch_nacimiento_per: "",
      id_nac_pais_per: "",
      id_nac_ciudad_per: "",
      id_nac_provincia_per: "",
      id_nac_distrito_per: "",
      residencia_per: "",
      id_res_ciudad_per: "",
      id_res_provincia_per: "",
      id_res_distrito_per: "",
      res_direccion_per: "",
      res_referencia_per: "",
      res_telefono_per: "",
      IdAdm_Discapacidad: "",
      idIEdu: "",
      id_educ_pais_per: "",
      id_educ_ciudad_per: "",
      id_educ_provincia_per: "",
      id_educ_distrito_per: "",

      id_ficha: "",
      id_datos_personales: "",
      id_nacimiento: "",
      id_direccion: "",
      id_educacion: "",

      cod_univ: "",
      cod_per: "",
      terminos: "",
      correo_verificado: "",
      correo_fecha_verificacion: "",
      sms_verificado: "",
      sms_fecha_verificacion: "",
      estado: "",

      loading: false,
      bloqued: false,
      visibleSave: true,
      visibleModal: false,
      visibleSend: false,
      disableNumero: false,

      fichaPersona: true
    };
  }

  siguiente() {
    const paso = this.state.paso + 1;
    this.setState({
      paso
    });
  }

  regresar() {
    const paso = this.state.paso - 1;
    this.setState({
      paso
    });
  }

  handleChangeInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handleChangeInputCodigo = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handlePressEnter = () => {
    if (this.state.fichaPersona) {
      this.getFichaPersona();
      this.getDatosPersonales();
      this.getLugarNacimiento();
      this.getLugarResidencia();
      this.getNivelEducativo();
      this.saveFichaActualizacionPersona();
      this.getFichaPersona();
    }
  };

  handleChangeSelect = select => e => {
    this.setState({ [select]: e });
  };

  handleChangeDatePicker = picker => date => {
    this.setState({ [picker]: date });
    console.log(this.state.fch_nacimiento_per);
  };

  handleOk() {
    this.setState({ loading: true, bloqued: true, disableNumero: true });
    setTimeout(() => {
      this.setState({ loading: false, visibleSend: true, visibleSave: false });
    }, 2000);
  }

  handleCancel = () => {
    this.setState({
      visibleModal: false,
      visibleSend: false,
      visibleSave: true,
      disableNumero: false
    });
  };

  handleSave = () => {
    this.setState({ visibleSave: false, visibleSend: true });
    this.saveDatosPersonales();
  };

  saveFichaActualizacionPersona = () => {
    const url =
      "http://localhost/FichaWeb/app/controller/fichaActualizacionPersona/create.php";

    const data = {
      id_ficha: 1,
      cod_univ: this.state.cod_univ,
      cod_per: this.state.cod_per == "" ? 1 : this.state.cod_per,
      terminos: this.state.terminos == "" ? 1 : this.state.terminos,
      correo_verificado:
        this.state.correo_verificado == "" ? 1 : this.state.correo_verificado,
      correo_fecha_verificacion:
        this.state.correo_fecha_verificacion == ""
          ? "2019/7/17 12:39"
          : this.state.correo_fecha_verificacion,
      sms_verificado:
        this.state.sms_verificado == "" ? 1 : this.state.sms_verificado,
      sms_fecha_verificacion:
        this.state.sms_fecha_verificacion == ""
          ? "2019/7/17 12:39"
          : this.state.sms_fecha_verificacion,
      estado: this.state.estado == "" ? 1 : this.state.estado
    };

    console.log(data);

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .catch(error => console.log(`Error: ${error}`))
      .then(res => console.log(`Sucess: ${res}`));
  };

  saveDatosPersonales = () => {
    const url =
      "http://localhost/FichaWeb/app/controller/datosPersonales/create.php";

    const data = {
      id_datos_personales: 1,
      id_ficha: parseInt(this.state.id_ficha, 10),
      nombres: this.state.nombre_per,
      apellido_paterno: this.state.apellido_pat_per,
      apellido_materno: this.state.apellido_mat_per,
      sexo: this.state.sexo_per,
      estado_civil: parseInt(this.state.id_est_civil, 10),
      id_discapacidad:
        this.state.IdAdm_Discapacidad == 0 ? 1 : this.state.IdAdm_Discapacidad,
      tipo_documento: parseInt(this.state.id_tipo_doc, 10),
      numero_documento: this.state.nro_doc_per,
      email: this.state.email_per,
      celular: this.state.celular_per,
      telefono: this.state.telefono_per == "" ? "-" : this.state.telefono_per
    };

    console.log(data);

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .catch(error => console.log(`Error: ${error}`))
      .then(res => console.log(`Sucess: ${res}`));
  };

  showModal = () => {
    this.setState({
      visibleModal: true
    });
  };

  showModal = () => {
    this.setState({
      visibleModal: true
    });
  };

  getFichaPersona() {
    fetch(
      `http://localhost/FichaWeb/app/controller/fichaActualizacionPersona/read.php?CodUniv=${
        this.state.cod_univ
      }`
    )
      .then(response =>
        response.json().then(data => {
          if (response.status == 400) {
            this.getPersona();
          }
          this.setState({
            id_ficha: data.id_ficha,
            cod_univ: data.cod_univ,
            cod_per: data.cod_per,
            terminos: data.terminos,
            correo_verificado: data.correo_verificado,
            correo_fecha_verificacion: data.correo_fecha_verificacion,
            sms_verificado: data.sms_verificado,
            sms_fecha_verificacion: data.sms_fecha_verificacion,
            estado: data.estado
          });
        })
      )
      .catch(err => console.log(err));
  }

  getDatosPersonales() {
    fetch(
      `http://localhost/FichaWeb/app/controller/datosPersonales/read.php?CodUniv=${
        this.state.cod_univ
      }`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          nombre_per: data.nombres,
          apellido_pat_per: data.apellido_paterno,
          apellido_mat_per: data.apellido_materno,
          id_tipo_doc: data.tipo_documento,
          nro_doc_per: data.numero_documento,
          id_est_civil: data.estado_civil,
          sexo_per: data.sexo,
          IdAdm_Discapacidad: data.id_discapacidad,
          telefono_per: data.telefono,
          celular_per: data.celular,
          email_per: data.email
        })
      );
  }

  getLugarNacimiento() {
    fetch(
      `http://localhost/FichaWeb/app/controller/lugarNacimiento/read.php?CodUniv=${
        this.state.cod_univ
      }`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          id_nacimiento: data.id_nacimiento,
          fch_nacimiento_per: data.fecha_nacimiento,
          id_nac_pais_per: data.id_nac_cod_pais,
          id_nac_ciudad_per: data.id_nac_cod_ciudad,
          id_nac_provincia_per: data.id_nac_cod_provincia,
          id_nac_distrito_per: data.id_nac_cod_distrito
        })
      );
  }

  getLugarResidencia() {
    fetch(
      `http://localhost/FichaWeb/app/controller/lugarResidencia/read.php?CodUniv=${
        this.state.cod_univ
      }`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          id_direccion: data.id_direccion,
          id_res_ciudad_per: data.id_dir_cod_ciudad,
          id_res_provincia_per: data.id_dir_cod_provincia,
          id_res_distrito_per: data.id_dir_cod_distrito,
          res_direccion_per: data.direccion,
          res_referencia_per: data.referencia,
          res_telefono_per: data.telefono_referencia
        })
      );
  }

  getNivelEducativo() {
    fetch(
      `http://localhost/FichaWeb/app/controller/nivelEducativo/readOne.php?CodUniv=${
        this.state.cod_univ
      }`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          id_direccion: data.id_educacion,
          id_educ_pais_per: data.id_educ_cod_pais,
          id_educ_ciudad_per: data.id_educ_cod_ciudad,
          id_educ_provincia_per: data.id_educ_cod_provincia,
          id_educ_distrito_per: data.id_educ_cod_distrito,
          idIEdu: data.idEdu
        })
      );
  }

  getPersona() {
    fetch(
      `http://localhost/FichaWeb/app/controller/fichaPersona/read.php?CodUniv=${
        this.state.cod_univ
      }`
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          id_ficha: 1,
          nombre_per: data.NomPer,
          apellido_pat_per: data.ApepPer,
          apellido_mat_per: data.ApemPer,
          id_tipo_doc: data.TipoDocum,
          nro_doc_per: data.DniPer,
          sexo_per: data.Sexo,
          telefono_per: data.TelefFijo,
          celular_per: data.TelefCelular,
          email_per: data.Email,
          fch_nacimiento_per: data.FechaNac,
          res_direccion_per: data.Direccion,
          id_educ_pais_per: data.id_educ_pais_per,
          id_educ_ciudad_per: data.id_educ_ciudad_per,
          id_educ_provincia_per: data.id_educ_provincia_per,
          id_educ_distrito_per: data.id_educ_distrito_per,
          idIEdu: data.IdiEdu
        })
      )
      .catch(error =>
        this.setState({
          fichaPersona: true
        })
      );
  }

  render() {
    const {
      paso,
      loading,
      visibleModal,
      bloqued,
      visibleSave,
      visibleSend,
      disableNumero
    } = this.state;
    const {
      nombre_per,
      apellido_pat_per,
      apellido_mat_per,
      id_tipo_doc,
      nro_doc_per,
      sexo_per,
      id_est_civil,
      telefono_per,
      celular_per,
      email_per,
      nacionalidad,
      fch_nacimiento_per,
      id_nac_pais_per,
      id_nac_ciudad_per,
      id_nac_provincia_per,
      id_nac_distrito_per,
      residencia_per,
      id_res_ciudad_per,
      id_res_provincia_per,
      id_res_distrito_per,
      res_direccion_per,
      res_referencia_per,
      res_telefono_per,
      id_idioma_origen,
      idioma_ingles_per,
      idioma_portuguez_per,
      idioma_frances_per,
      id_idioma_otro,
      IdAdm_Discapacidad,
      idIEdu,
      id_educ_pais_per,
      id_educ_ciudad_per,
      id_educ_provincia_per,
      id_educ_distrito_per,

      id_ficha,
      id_datos_personales,
      id_nacimiento,
      id_direccion,
      id_educacion,

      cod_univ,
      cod_per,
      terminos,
      correo_verificado,
      correo_fecha_verificacion,
      sms_verificado,
      sms_fecha_verificacion,
      estado,
      fichaPersona
    } = this.state;
    const ficha = {
      nombre_per,
      apellido_pat_per,
      apellido_mat_per,
      id_tipo_doc,
      nro_doc_per,
      sexo_per,
      id_est_civil,
      telefono_per,
      celular_per,
      email_per,
      nacionalidad,
      fch_nacimiento_per,
      id_nac_pais_per,
      id_nac_ciudad_per,
      id_nac_provincia_per,
      id_nac_distrito_per,
      residencia_per,
      id_res_ciudad_per,
      id_res_provincia_per,
      id_res_distrito_per,
      res_direccion_per,
      res_referencia_per,
      res_telefono_per,
      id_idioma_origen,
      idioma_ingles_per,
      idioma_portuguez_per,
      idioma_frances_per,
      id_idioma_otro,
      IdAdm_Discapacidad,
      idIEdu,
      id_educ_pais_per,
      id_educ_ciudad_per,
      id_educ_provincia_per,
      id_educ_distrito_per,

      id_ficha,
      id_datos_personales,
      id_nacimiento,
      id_direccion,
      id_educacion,

      cod_univ,
      cod_per,
      terminos,
      correo_verificado,
      correo_fecha_verificacion,
      sms_verificado,
      sms_fecha_verificacion,
      estado,

      fichaPersona
    };
    const pasos = [
      {
        title: "Datos Personales",
        content: (
          <DatosPersonales
            ficha={ficha}
            handleChangeInput={this.handleChangeInput}
            handleChangeSelect={this.handleChangeSelect}
          />
        )
      },
      {
        title: "Lugar y fecha de nacimiento",
        content: (
          <LugarFechaNacimiento
            ficha={ficha}
            handleChangeInput={this.handleChangeInput}
            handleChangeSelect={this.handleChangeSelect}
            handleChangeDatePicker={this.handleChangeDatePicker}
          />
        )
      },
      {
        title: "Lugar de residencia actual",
        content: (
          <LugarResidenciaActual
            ficha={ficha}
            handleChangeInput={this.handleChangeInput}
            handleChangeSelect={this.handleChangeSelect}
          />
        )
      },
      {
        title: "Nivel educativo e institucion educativa",
        content: (
          <NivelEducativo
            ficha={ficha}
            handleChangeInput={this.handleChangeInput}
            handleChangeSelect={this.handleChangeSelect}
          />
        )
      }
    ];

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
        <Header style={{ color: "white", marginBottom: "1em" }}>
          Actualización de Datos Personales
        </Header>
        <Input
          placeholder="2014049413"
          style={{ marginBottom: "16px", marginTop: "16px" }}
          onPressEnter={this.handlePressEnter}
          onChange={this.handleChangeInputCodigo("cod_univ")}
        />
        <div>
          <Steps current={paso}>
            {pasos.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{pasos[paso].content}</div>
          <div className="steps-action">
            {paso > 0 && (
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => this.regresar()}
                icon={"caret-left"}
              >
                Regresar
              </Button>
            )}
            {paso < pasos.length - 1 && (
              <Button
                type="primary"
                onClick={() => this.siguiente()}
                icon={"caret-right"}
              >
                Siguiente
              </Button>
            )}
            {paso === pasos.length - 1 && (
              <Button
                type="primary"
                icon={"save"}
                onClick={() => this.showModal()}
              >
                Guardar
              </Button>
            )}
            <Modal
              width={500}
              visible={visibleModal}
              style={{ textAlign: "inherit" }}
              title="Confirmación por SMS"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              centered={true}
              footer={[
                <div style={{ textAlign: "center" }}>
                  <Button
                    style={{ width: "50%", marginBottom: "8px" }}
                    key="back"
                    icon={"close"}
                    type="danger"
                    onClick={() => this.handleCancel()}
                  >
                    Cancelar
                  </Button>
                </div>,
                <div style={{ textAlign: "center" }}>
                  <Button
                    hidden={visibleSend}
                    style={{ width: "50%", marginBottom: "8px" }}
                    key="submit"
                    icon={"check"}
                    type="primary"
                    loading={loading}
                    block={bloqued}
                    onClick={() => this.handleOk()}
                  >
                    Enviar
                  </Button>
                </div>,
                <div style={{ textAlign: "center" }}>
                  <Button
                    hidden={visibleSave}
                    style={{ width: "50%" }}
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => this.handleSave()}
                  >
                    Confirmar y Guardar
                  </Button>
                </div>
              ]}
            >
              <Form {...formItemLayout}>
                <Form.Item label="Numero de celular">
                  {getFieldDecorator("celular", {
                    initialValue: this.state.celular_per,
                    rules: [
                      {
                        required: true,
                        message: "Por favor ingrese su número de celular"
                      }
                    ]
                  })(
                    <Input
                      disabled={disableNumero}
                      onChange={this.handleChangeInput("celular_per")}
                      style={{ width: "45%" }}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Mensaje de confirmación">
                  {getFieldDecorator("confirmacion", {
                    rules: [
                      {
                        required: true,
                        message: "Por favor ingrese el código de confirmación"
                      }
                    ]
                  })(<Input style={{ width: "45%" }} />)}
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Form.create()(UsuarioForm);
