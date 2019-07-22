import React from "react";
import DatosPersonales from "./DatosPersonales";
import LugarFechaNacimiento from "./LugarFechaNacimiento";
import LugarResidenciaActual from "./LugarResidenciaActual";
import NivelEducativo from "./NivelEducativo";
import { Steps, Button, Modal, Input, Form } from "antd";
import { Layout } from "antd";
import { Typography } from "antd";
import moment from "moment";

const { Text } = Typography;
const { Header } = Layout;
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

      id_ficha: 0,
      id_datos_personales: 0,
      id_nacimiento: 0,
      id_direccion: 0,
      id_educacion: 0,

      cod_univ: "",
      cod_per: "",
      terminos: "",
      correo_verificado: false,
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

      fichaPersona: true,

      segundos: 62,
      intentos: 0,
      existe: false,

      mensaje: ""
    };
  }

  codigo = "";

  siguiente() {
    const paso = this.state.paso + 1;
    this.setState({
      paso
    });
    this.updateData();
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
    this.getFichaPersona();
    //

    // this.esCorreoVerificado();
    // if (this.state.correo_verificado) {
    //   this.confirm();
    // }
  };

  esCorreoVerificado = () => {
    fetch(
      `http://localhost/FichaWeb/app/controller/fichaActualizacionPersona/read.php?CodUniv=${
        this.state.cod_univ
      }`
    )
      .then(response =>
        response.json().then(data => {
          if (response.status === 200) {
            this.setState(
              {
                correo_verificado:
                  data.correo_verificado === "0" ? false : true,
                existe: true
              },
              this.confirm
            );
          } else if (response.status === 400) {
            this.setState(
              {
                correo_verificado: false,
                existe: false
              },
              this.confirm
            );
          }
        })
      )
      .catch(err => console.log(err));
  };

  confirm() {
    // if (this.state.correo_verificado === true && this.state.existe === true) {
    //   this.getFichaPersona();
    // } else

    if (this.state.existe === true && this.state.correo_verificado === false) {
      Modal.confirm({
        title: "Compromisos de las normas establecidas en la UPT",
        content: (
          <div>
            <h3>Declaro bajo juramento que: </h3>
            <ol style={{ textAlign: "justify" }}>
              <li>
                He sido informado respecto a los reglamentos, normas y
                directivas establecidas en la UPT, referidas a las Actividades
                Académicas, Administrativas y de Pagos, las mismas que se
                encuentran publicadas y disponibles en la página web de la
                Universidad Privada de Tacna: www.upt.edu.pe y que declaro
                conocer.
              </li>
              <li>
                He tomado conocimiento de los beneficios, oportunidades y moras
                relacionadas al pago por el servicio educativo, según directiva
                de Gestión de Pagos por derechos de enseñanza en la Universidad
                Privada de Tacna y demás normas y directivas internas vigentes y
                aplicables, así como las tasas administrativas y académicas,
                cuyo procedimiento y montos declaro conocer, asumir y cumplir.
              </li>
              <li>
                En el calendario académico que fija la UPT para cada semestre
                académico, se establece el Cronograma para el pago de las
                cuotaspor el Servicio Educativoy que,en caso de retraso en su
                pago, se genera un interés moratoriodel que he sido informado.
              </li>
              <li>
                Los datos personales consignados en el presente documento, son
                veraces y auténticos y tienen carácter de Declaración Jurada,
                por lo que puedenser utilizados por la Universidad Privada de
                Tacna para que se me informe respecto a aspectos académicos y
                administrativos de esta institución. Encaso de falsedad y
                ausencia de estos datos, asumo y me someto a las acciones
                administrativas y legales que resulten aplicables.
              </li>
            </ol>
          </div>
        ),
        okText: "Si acepto",
        cancelText: "No acepto",
        onOk: this.handleOkCorreo,
        width: "75%"
      });
    } else if (this.state.existe === false) {
      Modal.error({
        title: "ERROR",
        content: this.state.mensaje
      });
    }
  }

  handleOkCorreo = () => {
    this.setState(
      {
        correo_verificado: true
      },
      this.state.id_ficha === 1
        ? this.saveFichaActualizacionPersona
        : this.updateFichaActualizacion
    );
  };

  handleChangeSelect = select => e => {
    this.setState({ [select]: e });
  };

  handleChangeDatePicker = picker => date => {
    this.setState({ [picker]: date });
    console.log(moment(this.state.fch_nacimiento_per, "YYYY-MM-DD"));
  };

  handleOk = async () => {
    await this.setState({ loading: true, bloqued: true, disableNumero: true });
    setTimeout(() => {
      this.setState({ loading: false, visibleSend: true, visibleSave: false });
    }, 2000);

    await this.timer();
  };

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
    this.saveLugarNacimiento();
    this.saveLugarResidencia();
    this.saveEducacion();
  };

  saveCorreoVerificado = () => {
    if (!this.state.correo_verificado) {
      const url =
        "http://localhost/FichaWeb/app/controller/fichaActualizacionPersona/update.php";
      const data = {
        id_ficha: this.state.id_ficha,
        correo_verificado: this.state.correo_verificado
      };
      fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .catch(error => console.log(`Error: ${error}`));
    }
  };

  saveFichaActualizacionPersona = async () => {
    let url = "";
    url =
      "http://localhost/FichaWeb/app/controller/fichaActualizacionPersona/create.php";

    const data = {
      id_ficha: this.state.id_ficha,
      cod_univ: this.state.cod_univ,
      cod_per: this.state.cod_per,
      terminos: false, //TODO Agregar this.state.terminos
      correo_verificado: this.state.correo_verificado,
      correo_fecha_verificacion: moment().local(),
      sms_verificado: false,
      sms_fecha_verificacion: moment().local(),
      estado: false
    };

    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    // .then(res => res.json())
    // .catch(error => console.log(`Error: ${error}`))
    // .then(res => console.log(`Sucess: ${res}`));

    this.getIdFichaPersona();
  };

  saveDatosPersonales = async () => {
    const url =
      "http://localhost/FichaWeb/app/controller/datosPersonales/create.php";

    const data = {
      id_datos_personales: 0,
      id_ficha: parseInt(this.state.id_ficha, 10),
      nombres: this.state.nombre_per,
      apellido_paterno: this.state.apellido_pat_per,
      apellido_materno: this.state.apellido_mat_per,
      sexo: this.state.sexo_per,
      estado_civil:
        this.state.id_est_civil === "" || this.state.id_est_civil == null
          ? "S"
          : this.state.id_est_civil,
      id_discapacidad:
        this.state.IdAdm_Discapacidad === 0 ||
        this.state.IdAdm_Discapacidad === ""
          ? 1
          : this.state.IdAdm_Discapacidad,
      tipo_documento: parseInt(this.state.id_tipo_doc, 10),
      numero_documento: this.state.nro_doc_per,
      email: this.state.email_per,
      celular: this.state.celular_per,
      telefono:
        this.state.telefono_per === "" || this.state.telefono_per == null
          ? "-"
          : this.state.telefono_per
    };

    await fetch(url, {
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

    this.getIdDatosPersonales();
  };

  saveLugarNacimiento = () => {
    const url =
      "http://localhost/FichaWeb/app/controller/lugarNacimiento/create.php";

    const data = {
      id_nacimiento: 1,
      id_ficha: this.state.id_ficha,
      fecha_nacimiento: this.state.fch_nacimiento_per,
      id_nac_cod_pais:
        this.state.id_nac_pais_per == null || this.state.id_nac_pais_per === ""
          ? "9589"
          : this.state.id_nac_pais_per,
      id_nac_cod_ciudad:
        this.state.id_nac_ciudad_per == null ||
        this.state.id_nac_ciudad_per === ""
          ? "2919"
          : this.state.id_nac_ciudad_per,
      id_nac_cod_provincia:
        this.state.id_nac_provincia_per == null ||
        this.state.id_nac_provincia_per === ""
          ? "2301"
          : this.state.id_nac_provincia_per,
      id_nac_cod_distrito:
        this.state.id_nac_distrito_per == null ||
        this.state.id_nac_distrito_per === ""
          ? "230101"
          : this.state.id_nac_distrito_per
    };

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

  saveLugarResidencia = () => {
    const url =
      "http://localhost/FichaWeb/app/controller/lugarResidencia/create.php";

    const data = {
      id_direccion: 1,
      id_ficha: this.state.id_ficha,
      id_dir_cod_ciudad:
        this.state.id_res_ciudad_per == null ||
        this.state.id_res_ciudad_per === ""
          ? "2919"
          : this.state.id_res_ciudad_per,
      id_dir_cod_provincia:
        this.state.id_res_provincia_per == null ||
        this.state.id_res_provincia_per === ""
          ? "2301"
          : this.state.id_res_provincia_per,
      id_dir_cod_distrito:
        this.state.id_res_distrito_per == null ||
        this.state.id_res_distrito_per === ""
          ? "230101"
          : this.state.id_res_distrito_per,
      direccion:
        this.state.res_direccion_per === ""
          ? "-"
          : this.state.res_direccion_per,
      referencia:
        this.state.res_referencia_per === ""
          ? "-"
          : this.state.res_referencia_per,
      telefono_referencia:
        this.state.res_referencia_per === "" ? "-" : this.state.res_telefono_per
    };

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

  saveEducacion = () => {
    const url =
      "http://localhost/FichaWeb/app/controller/nivelEducativo/create.php";

    const data = {
      id_educacion: 1,
      id_ficha: this.state.id_ficha,
      id_educ_cod_pais:
        this.state.id_educ_pais_per == null ||
        this.state.id_educ_pais_per === ""
          ? 9589
          : this.state.id_educ_pais_per,
      id_educ_cod_ciudad:
        this.state.id_educ_ciudad_per == null ||
        this.state.id_educ_ciudad_per === ""
          ? 2919
          : this.state.id_educ_ciudad_per,
      id_educ_cod_provincia:
        this.state.id_educ_provincia_per == null ||
        this.state.id_educ_provincia_per === ""
          ? 2301
          : this.state.id_educ_provincia_per,
      id_educ_cod_distrito:
        this.state.id_educ_distrito_per == null ||
        this.state.id_educ_distrito_per === ""
          ? 230101
          : this.state.id_educ_distrito_per,
      idEdu:
        this.state.idIEdu === "" || this.state.idIEdu == null
          ? "0"
          : this.state.idIEdu
    };

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

  updateData = () => {
    if (this.state.paso === 0 && this.state.id_datos_personales === 0) {
      this.saveDatosPersonales();
    } else {
      this.updateDatosPersonales();
    }
  };

  updateFichaActualizacion = async () => {
    let url = "";
    url =
      "http://localhost/FichaWeb/app/controller/fichaActualizacionPersona/update.php";

    const data = {
      id_ficha: this.state.id_ficha,
      cod_univ: this.state.cod_univ,
      cod_per: this.state.cod_per === "" ? 1 : this.state.cod_per,
      terminos:
        this.state.terminos === "" || this.state.terminos == null
          ? 1
          : this.state.terminos,
      correo_verificado:
        this.state.correo_verificado === "" ||
        this.state.correo_verificado == null
          ? false
          : this.state.correo_verificado,
      correo_fecha_verificacion:
        this.state.correo_fecha_verificacion === ""
          ? "2019/17/7 12:39"
          : this.state.correo_fecha_verificacion,
      sms_verificado: this.state.sms_verificado,
      sms_fecha_verificacion:
        this.state.sms_fecha_verificacion === ""
          ? "2019/17/7 12:39"
          : this.state.sms_fecha_verificacion,
      estado: this.state.estado
    };

    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  };

  updateDatosPersonales = async () => {
    let url = "";
    url = "http://localhost/FichaWeb/app/controller/datosPersonales/update.php";

    const data = {
      id_datos_personales: this.state.id_datos_personales,
      id_ficha: this.state.id_ficha,
      nombres: this.state.nombre_per,
      apellido_paterno: this.state.apellido_pat_per,
      apellido_materno: this.state.apellido_mat_per,
      sexo: this.state.sexo_per,
      estado_civil: this.state.id_est_civil,
      id_discapacidad: this.state.IdAdm_Discapacidad,
      tipo_documento: this.state.id_tipo_doc,
      numero_documento: this.state.nro_doc_per,
      email: this.state.email_per,
      celular: this.state.celular_per,
      telefono: this.state.telefono_per
    };

    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  };

  showModal = () => {
    this.setState({
      visibleModal: true
    });
  };

  getPersona = async () => {
    const response = await fetch(
      `http://localhost/FichaWeb/app/controller/fichaPersona/read.php?CodUniv=${
        this.state.cod_univ
      }`
    );

    if (response.status === 200) {
      const data = await response.json();
      this.setState(
        {
          id_ficha: 1,
          cod_per: data.CodPer,
          nombre_per: data.NomPer,
          cod_univ: data.CodUniv,
          apellido_pat_per: data.ApepPer,
          apellido_mat_per: data.ApemPer,
          id_tipo_doc: data.TipoDocum,
          id_est_civil:
            data.EstadoCivil === "" || data.EstadoCivil == null
              ? "1"
              : data.EstadoCivil,
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
          idIEdu: data.IdiEdu,
          IdAdm_Discapacidad: "1",
          correo_verificado: false,
          sms_verificado: false,
          estado: false,
          existe: true
        },
        this.confirm
      );
    } else if (response.status === 400) {
      const res = await response.json();
      this.setState(
        {
          correo_verificado: false,
          existe: false,
          mensaje: res.message
        },
        this.confirm
      );
    }
  };

  getFichaPersona = async () => {
    fetch(
      `http://localhost/FichaWeb/app/controller/fichaActualizacionPersona/read.php?CodUniv=${
        this.state.cod_univ
      }`
    )
      .then(response =>
        response.json().then(data => {
          if (response.status === 200) {
            this.getDatosPersonales();
            this.getLugarNacimiento();
            this.getLugarResidencia();
            this.getNivelEducativo();
            this.setState(
              {
                id_ficha: data.id_ficha,
                id_datos_personales: data.id_datos_personales,
                cod_univ: data.cod_univ,
                cod_per: data.cod_per,
                terminos: data.terminos,
                correo_verificado:
                  data.correo_verificado === "0" ? false : true,
                correo_fecha_verificacion: data.correo_fecha_verificacion,
                sms_verificado: data.sms_verificado,
                sms_fecha_verificacion: data.sms_fecha_verificacion,
                estado: data.estado,
                existe: true
              },
              this.confirm
            );
          }
          if (response.status === 400) {
            this.getPersona();
          }
        })
      )
      .catch(err => console.log(err));
  };

  getIdFichaPersona() {
    fetch(
      `http://localhost/FichaWeb/app/controller/fichaActualizacionPersona/read.php?CodUniv=${
        this.state.cod_univ
      }`
    )
      .then(response =>
        response.json().then(data => {
          if (response.status === 200) {
            this.setState({
              id_ficha: data.id_ficha
            });
          }
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
          id_datos_personales: data.id_datos_personales,
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

  getIdDatosPersonales() {
    if (this.state.id_datos_personales === 0) {
      fetch(
        `http://localhost/FichaWeb/app/controller/datosPersonales/read.php?CodUniv=${
          this.state.cod_univ
        }`
      )
        .then(response =>
          response.json().then(data => {
            if (response.status === 200) {
              this.setState({
                id_datos_personales: data.id_datos_personales
              });
            }
          })
        )
        .catch(err => console.log(err));
    }
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

  actionButton = () => {
    if (this.state.paso === 0) {
      return "button-right steps-action";
    } else {
      return "steps-action";
    }
  };

  timer = () => {
    const time = setInterval(() => {
      this.setState(
        {
          segundos: this.state.segundos - 1
        },
        () => {
          if (this.state.segundos === 0) {
            clearInterval(time);
            this.setState({
              visibleSend: false,
              visibleSave: true,
              disableNumero: false,
              segundos: 62
            });
          }
        }
      );
    }, 1000);
    this.setState({
      intentos: this.state.intentos + 1
    });
  };

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
      fichaPersona,
      segundos,
      intentos,
      mensaje
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

      fichaPersona,

      segundos,
      intentos,
      mensaje
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
        <div hidden={!correo_verificado}>
          <Steps current={paso}>
            {pasos.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{pasos[paso].content}</div>
          <div className={this.actionButton()}>
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
                    disabled={intentos === 3}
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
              <div className={"button-intentos"}>
                <Button
                  type="link"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                  hidden={!visibleSend}
                >
                  Puede volver a enviar en: {segundos}
                </Button>
              </div>
              <div>
                <Text style={{ fontWeight: "bold" }}>
                  Dispone de 3 intentos cada 24 horas: ha realizado {intentos}{" "}
                  de 3 intentos.
                </Text>
              </div>
              <div hidden={intentos !== 3}>
                <Text>
                  Sino ha llegado el mensaje de confirmación vuelva a intentar
                  el día de mañana
                </Text>
              </div>
            </Modal>
          </div>
        </div>
      </Layout>
    );
  }
}

export default Form.create()(UsuarioForm);
