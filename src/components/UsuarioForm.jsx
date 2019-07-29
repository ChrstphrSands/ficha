import React from "react";
import DatosPersonales from "./DatosPersonales";
import LugarFechaNacimiento from "./LugarFechaNacimiento";
import LugarResidenciaActual from "./LugarResidenciaActual";
import NivelEducativo from "./NivelEducativo";
import { Steps, Button, Modal, Input, Form, Result } from "antd";
import { Layout } from "antd";
import { Typography } from "antd";
import moment from "moment";
import DetalleFicha from "./DetalleFicha";

const { Text } = Typography;
const { Header } = Layout;
const { Step } = Steps;

// const initttt = {
//   mode: "no-cors",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   }
// };

// const apiUrl = 'https://net.upt.edu.pe/FichaDatos/FichaWeb/modules';
const apiUrl = "http://192.168.0.5/FichaDatos/FichaWeb/modules";

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
      id_nac_pais_per: 9589,
      id_nac_ciudad_per: 2919,
      id_nac_provincia_per: 2301,
      id_nac_distrito_per: 230101,
      residencia_per: "",
      id_res_ciudad_per: 2919,
      id_res_provincia_per: 2301,
      id_res_distrito_per: 230101,
      res_direccion_per: "",
      res_referencia_per: "",
      res_telefono_per: "",
      IdAdm_Discapacidad: "",
      idIEdu: "",
      id_educ_pais_per: 9589,
      id_educ_ciudad_per: 2919,
      id_educ_provincia_per: 2301,
      id_educ_distrito_per: 230101,

      id_ficha: 0,
      id_datos_personales: 0,
      id_nacimiento: 0,
      id_direccion: 0,
      id_educacion: 0,

      cod_univ: "",
      cod_per: "",
      terminos: false,
      correo_verificado: false,
      correo_fecha_verificacion: "",
      sms_verificado: "",
      sms_fecha_verificacion: "",
      estado: "",

      loading: false,
      bloqued: false,
      visibleSave: true,
      visibleModal: false,
      visibleModalCorreo: false,
      visibleSend: false,
      visibleSendCorreo: false,
      visibleSaveCorreo: true,
      disableNumero: false,

      fichaPersona: true,

      segundos: 62,
      intentos: 0,
      existe: false,

      mensaje: "",
      confirmacion: 0,
      codigo_correo: 0,
      codigo_sms: 0,

      validado: false,
      finalizado: false,
      permiso: false,
      session: "",

      discapacidades: [],
      estadosCiviles: [],
      tiposDocumentos: [],
      paises: [],
      ciudades: [],
      provincias: [],
      distritos: [],
      instituciones: [],
      dependencias: [],

      emailValido: false,
      celularValido: false,
      edadValida: false
    };
  }

  codigo = "";

  async componentDidMount() {
    const href = await window.location.href;
    const arrUrl = await href.split("=");

    await this.setState({
      session: arrUrl[1]
    });

    const response = await fetch(
      `${apiUrl}/Usuario.php?p=read&session=${this.state.session}`
    );

    if (response.status === 200) {
      const data = await response.json();
      await this.setState({
        cod_univ: data.CodUniv,
        permiso: data.bolAsesorFichaDatos
      });
    } else if (response.status === 400) {
      console.log("No funciona");
    }

    if (this.state.permiso == false) {
      this.getFichaPersona();
    }

    await this.getDiscapacidades();
    await this.getEstadosCiviles();
    await this.getTipoDocumento();
    await this.getPaises();
    await this.getCiudades();
    await this.getProvincias();
    await this.getDistritos();
    await this.getInstituciones();
    await this.getDiscapacidades();
    await this.getDependencias();
  }

  siguiente = async () => {
    await this.validarEmail();
    await this.validarCelular();
    await this.validarEdad();
    if (this.state.emailValido && this.state.celularValido) {
      if (this.state.correo_verificado == true) {
        const paso = this.state.paso + 1;

        if (paso == 2) {
          if (this.state.edadValida) {
            await this.setState(
              {
                paso
              },
              this.updateData()
            );
          } else {
            Modal.warning({
              title: "Edad inválida",
              content: "Tiene menos de 16 años",
              centered: true
            });
          }
        } else {
          await this.setState(
            {
              paso
            },
            this.updateData()
          );
        }
      } else {
        this.showModalCorreo();
      }
    } else if (!this.state.emailValido) {
      Modal.warning({
        title: "Email inválido",
        content: "El email ingresado no es válido",
        centered: true
      });
    } else if (!this.state.celularValido) {
      Modal.warning({
        title: "Celular inválido",
        content:
          "El número de celular que ha ingresado tiene que ser mínimo de 9 dígitos",
        centered: true
      });
    }
  };

  regresar() {
    const paso = this.state.paso - 1;
    this.setState({
      paso
    });
  }

  validarEdad = async () => {
    let a = Math.floor(
      moment(new Date()).diff(moment("07/25/2002"), "years", true)
    );
    if (a > 16) {
      await this.setState({
        edadValida: true
      });
    }
    console.log(a);
  };

  validarEmail = async () => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    await this.setState({
      emailValido: re.test(String(this.state.email_per).toLowerCase())
    });
  };

  validarCelular = async () => {
    const re = /^([0-9]{9})$/;
    await this.setState({
      celularValido: re.test(this.state.celular_per)
    });
  };

  handleChangeInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  handlePressEnter = () => {
    // this.setState({
    //   paso: 0
    // });
    // this.getFichaPersona();
    //
    // this.esCorreoVerificado();
    // if (this.state.correo_verificado) {
    //   this.confirm();
    // }
  };

  getDiscapacidades = async () => {
    const response = await fetch(
      `${apiUrl}/Discapacidad.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    );
    const data = await response.json();
    await this.setState({
      discapacidades: data
    });
  };

  getEstadosCiviles = async () => {
    const response = await fetch(
      `${apiUrl}/EstadoCivil.php?p=read&session=${this.state.session}&CodUniv=${
        this.state.cod_univ
      }`
    );
    const data = await response.json();
    await this.setState({
      estadosCiviles: data
    });
  };

  getTipoDocumento = async () => {
    const response = await fetch(
      `${apiUrl}/TipoDocumento.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    );
    const data = await response.json();
    await this.setState({
      tiposDocumentos: data
    });
  };

  getPaises = async () => {
    const response = await fetch(
      `${apiUrl}/Nacionalidad.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    );
    const data = await response.json();
    await this.setState({
      paises: data
    });
  };

  getCiudades = async () => {
    // const response = await fetch(
    //   `${apiUrl}/Ciudad.php?p=read&session=${this.state.session}&CodUniv=${
    //     this.state.cod_univ
    //   }&idPais=${this.state.id_nac_pais_per}`
    // );
    const response = await fetch(
      `${apiUrl}/Ciudad.php?p=read&session=${this.state.session}&CodUniv=${
        this.state.cod_univ
      }`
    );
    const data = await response.json();
    await this.setState({
      ciudades: data
    });
  };

  getProvincias = async () => {
    // const response = await fetch(
    //   `${apiUrl}/Provincia.php?p=read&session=${this.state.session}&CodUniv=${
    //     this.state.cod_univ
    //   }&idCiudad=${this.state.id_nac_ciudad_per}`
    // );
    const response = await fetch(
      `${apiUrl}/Provincia.php?p=read&session=${this.state.session}&CodUniv=${
        this.state.cod_univ
      }`
    );
    const data = await response.json();
    await this.setState({
      provincias: data
    });
  };

  getDistritos = async () => {
    // const response = await fetch(
    //   `${apiUrl}/Distrito.php?p=read&session=${this.state.session}&CodUniv=${
    //     this.state.cod_univ
    //   }&idPais=${this.state.id_nac_pais_per}&idCiudad=${
    //     this.state.id_nac_ciudad_per
    //   }&idProvincia=${this.state.id_nac_provincia_per}`
    // );
    const response = await fetch(
      `${apiUrl}/Distrito.php?p=read&session=${this.state.session}&CodUniv=${
        this.state.cod_univ
      }`
    );
    const data = await response.json();
    await this.setState({
      distritos: data
    });
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

  getDependencias = async () => {
    await fetch(
      `${apiUrl}/DependenciaVivienda.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    )
      .then(response => response.json())
      .then(data => this.setState({ dependencias: data }));
  };

  esCorreoVerificado = () => {
    fetch(
      `http://172.35.123.9/FichaWeb/app/controller/fichaActualizacionPersona/read.php?CodUniv=${
        this.state.cod_univ
      }`
    ).then(response =>
      response.json().then(data => {
        if (response.status === 200) {
          this.setState(
            {
              correo_verificado: data.correo_verificado === "0" ? false : true,
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
    );
  };

  confirm() {
    // if (this.state.correo_verificado === true && this.state.existe === true) {
    //   this.getFichaPersona();
    // } else

    if (this.state.existe === true && this.state.terminos === false) {
      Modal.confirm({
        title: "Compromisos de las normas establecidas en la UPT",
        content: (
          <div>
            <h3>TÉRMINOS Y CONDICIONES</h3>
            <div
              style={{
                height: "250px",
                overflowY: "scroll",
                marginBottom: "16px",
                backgroundColor: "#f7f7f7",
                padding: "0 16px",
                border: "1px solid #001529"
              }}
            >
              <p
                style={{
                  textAlign: "justify",
                  backgroundColor: "#f7f7f7",
                  borderRadius: "16px"
                }}
              >
                "De conformidad con la Ley N° 29733, Ley de Protección de Datos
                Personales (en adelante, la Ley), y su reglamento, aprobado por
                el Decreto Supremo N° 003-2013- JUS (en adelante, el
                Reglamento), el usuario autoriza el tratamiento de los datos
                personales que facilite a la Universidad Privada de Tacna (en
                adelante, la Universidad) por el presente medio electrónico. Al
                completar el presente formulario y aceptar previamente los
                términos que rigen el tratamiento de los datos personales, la
                Universidad procederá a guardar la información del usuario en la
                base de datos que posee en condición de titular, por tiempo
                indefinido o hasta que usted revoque el consentimiento otorgado.
                La información que brindará el usuario a la Universidad se
                encontrará referida a nombres y apellidos, documento de
                identidad, fecha de nacimiento, teléfono, correo electrónico y,
                en general, cualquier otro dato personal que se ponga en
                conocimiento de la Universidad. La Universidad (sito en Campus
                Capanique s/n), declara ser la titular del banco de datos
                personales y utilizará su información para las siguientes
                finalidades: i) realización de gestiones académicas,
                institucionales y administrativas; ii) remisión de información
                para cubrir las necesidades respecto de los programas académicos
                que son del interés o consulta del titular; y, iii) realización
                de encuestas de satisfacción y mejora del servicio educativo.
                Adicionalmente, y de ser aceptado por el usuario, la Universidad
                queda autorizada a remitirle información sobre los diferentes
                programas académicos de postgrado, educación ejecutiva e
                idiomas, eventos académicos, artísticos, culturales y de
                entretenimiento organizados por la Universidad o cualquiera de
                sus dependencias, para lo cual utilizará la vía postal,
                telefónica o cualquier otro medio de comunicación. En caso de
                que el usuario desee ejercer sus derechos de acceso,
                cancelación, oposición, revocatoria de consentimiento,
                modificación o cualquier otro contemplado en la Ley, deberá
                enviar una comunicación al buzón computo@upt.edu.pe. Se pone en
                conocimiento de los usuarios que los formularios, mediante los
                cuales otorguen sus datos personales, incluyen preguntas
                obligatorias y facultativas, las cuales podrán ser identificadas
                en cada formulario. Las consecuencias de la concesión de datos
                personales, faculta a la Universidad a utilizarlos de acuerdo a
                las finalidades señaladas precedentemente. La negativa en la
                entrega de los datos personales del usuario imposibilita a la
                Universidad a incluirlos en su base de datos y a atender sus
                requerimientos.
              </p>
            </div>
            <h3>DECLARO BAJO JURAMENTO QUE:</h3>
            <div
              style={{
                height: "250px",
                overflowY: "scroll",
                backgroundColor: "#f7f7f7",
                padding: "0 16px",
                border: "1px solid #001529"
              }}
            >
              <ol
                style={{
                  textAlign: "justify",
                  backgroundColor: "#f7f7f7",
                  borderRadius: "16px"
                }}
              >
                <li>
                  He sido informado respecto a los reglamentos, normas y
                  directivas establecidas en la UPT, referidas a las Actividades
                  Académicas, Administrativas y de Pagos, las mismas que se
                  encuentran publicadas y disponibles en la página web de la
                  Universidad Privada de Tacna: www.upt.edu.pe y que declaro
                  conocer.
                </li>
                <li>
                  He tomado conocimiento de los beneficios, oportunidades y
                  moras relacionadas al pago por el servicio educativo, según
                  directiva de Gestión de Pagos por derechos de enseñanza en la
                  Universidad Privada de Tacna y demás normas y directivas
                  internas vigentes y aplicables, así como las tasas
                  administrativas y académicas, cuyo procedimiento y montos
                  declaro conocer, asumir y cumplir.
                </li>
                <li>
                  En el calendario académico que fija la UPT para cada semestre
                  académico, se establece el Cronograma para el pago de las
                  cuotaspor el Servicio Educativo y que,en caso de retraso en su
                  pago, se genera un interés moratorio del que he sido
                  informado.
                </li>
                <li>
                  Los datos personales consignados en el presente documento, son
                  veraces y auténticos y tienen carácter de Declaración Jurada,
                  por lo que pueden ser utilizados por la Universidad Privada de
                  Tacna para que se me informe respecto a aspectos académicos y
                  administrativos de esta institución. Encaso de falsedad y
                  ausencia de estos datos, asumo y me someto a las acciones
                  administrativas y legales que resulten aplicables.
                </li>
              </ol>
            </div>
          </div>
        ),
        okText: "Si acepto",
        cancelText: "No acepto",
        onOk: this.handleOkTerminos,
        onCancel: this.handleCancelTerminos,
        width: "70%",
        centered: true
      });
    } else if (this.state.existe === false) {
      Modal.error({
        title: "ERROR",
        content: this.state.mensaje
      });
    }
  }

  handleOkTerminos = () => {
    this.setState(
      {
        terminos: true
      },
      this.state.id_ficha === 1
        ? this.saveFichaActualizacionPersona
        : this.updateFichaActualizacion
    );
  };

  handleCancelTerminos = () => {
    Modal.confirm({
      title: "Compromisos de las normas establecidas en la UPT",
      content: (
        <p>
          Para continuar con el proceso de matrícula es necesario que complete
          la actualización de datos.
        </p>
      )
    });
  };

  handleChangeSelect = select => e => {
    this.setState({ [select]: e });
  };

  handleChangeDatePicker = picker => date => {
    this.setState({ [picker]: date });
  };

  handleOk = async () => {
    await this.setState({ loading: true, bloqued: true, disableNumero: true });
    setTimeout(() => {
      this.setState({ loading: false, visibleSend: true, visibleSave: false });
    }, 2000);

    await this.timer();
    await this.sendSms();
  };

  handleOkCorreo = async () => {
    await this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        loading: false,
        visibleSendCorreo: true,
        visibleSaveCorreo: false
      });
    }, 2000);
    await this.sendEmail();
  };

  generateCodigo = () => {
    let max = 9999;
    let min = 1000;
    return Math.floor(Math.random() * (max + 1 - min) + min);
  };

  sendEmail = async () => {
    const url = `${apiUrl}/Email.php?p=send&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const codigo = this.generateCodigo();

    const data = {
      email_per: this.state.email_per,
      codigo: codigo
    };
    fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    }).then(res => res.json());

    await this.saveEmail(codigo);
  };

  sendSms = async () => {
    // const url = "http://172.35.123.9/FichaWeb/app/controller/sms/send.php";

    const codigo = this.generateCodigo();

    // const data = {
    //   celular_numero: this.state.celular_per,
    //   celular_mensaje: codigo
    // };
    // await fetch(url, {
    //   method: "POST",
    //   mode: "no-cors",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(data)
    // })
    //   .then(res => res.json())
    //   .catch(error => console.log(`Error: ${error}`));

    await this.saveSms(codigo);
  };

  saveEmail = async codigo => {
    // const codigo2 = this.generateCodigo();

    const url = `${apiUrl}/FichaActualizacionPersona.php?p=updateCodigoCorreo&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_ficha: this.state.id_ficha,
      codigo_correo: codigo
    };
    await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    }).then(res => res.json());
  };

  saveSms = async codigo => {
    const url = `${apiUrl}/FichaActualizacionPersona.php?p=updateCodigoSms&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_ficha: this.state.id_ficha,
      codigo_sms: codigo
    };
    await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    }).then(res => res.json());
  };

  handleCancel = () => {
    this.setState({
      visibleModal: false,
      visibleSend: false,
      visibleSave: true,
      disableNumero: false
    });
  };

  handleCancelCorreo = () => {
    this.setState({
      visibleModalCorreo: false,
      visibleSendCorreo: false,
      visibleSaveCorreo: true
    });
  };

  getCodigoSms = async () => {
    await fetch(
      `${apiUrl}/FichaActualizacionPersona.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    ).then(response =>
      response.json().then(data => {
        if (response.status === 200) {
          this.setState({
            codigo_sms: data.codigo_sms
          });
        }
      })
    );
  };

  handleSave = async () => {
    await this.getCodigoSms();
    if (this.state.codigo_sms == this.state.confirmacion) {
      await this.setState({
        visibleSave: false,
        visibleSend: true,
        sms_verificado: true,
        visibleModal: false,
        intentos: 0,
        confirmacion: 0,
        finalizado: true
      });
      // this.saveLugarNacimiento();
      // this.saveLugarResidencia();
      // this.saveEducacion();
      if (this.state.sms_verificado) {
        const url = `${apiUrl}/FichaActualizacionPersona.php?p=updateSmsVerificacion&session=${
          this.state.session
        }&CodUniv=${this.state.cod_univ}`;
        const data = {
          id_ficha: this.state.id_ficha,
          sms_verificado: true,
          finalizado: true
        };
        await fetch(url, {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          // mode: "no-cors",
          body: JSON.stringify(data)
        }).then(res => res.json());
      }
    } else {
      Modal.error({
        title: "ERROR",
        content: "El código ingresado no coincide."
      });
    }
  };

  getCodigoCorreo = async () => {
    await fetch(
      `${apiUrl}/FichaActualizacionPersona.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    ).then(response =>
      response.json().then(data => {
        if (response.status === 200) {
          this.setState({
            codigo_correo: data.codigo_correo
          });
        }
      })
    );
  };

  handleSaveCorreoVerificado = async () => {
    await this.getCodigoCorreo();
    if (this.state.codigo_correo == this.state.confirmacion) {
      await this.setState({
        correo_verificado: true,
        visibleModalCorreo: false,
        confirmacion: 0
      });

      if (this.state.correo_verificado) {
        const url = `${apiUrl}/FichaActualizacionPersona.php?p=updateCorreoVerificacion&session=${
          this.state.session
        }&CodUniv=${this.state.cod_univ}`;
        const data = {
          id_ficha: this.state.id_ficha,
          correo_verificado: true
        };
        fetch(url, {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          // mode: "no-cors",
          body: JSON.stringify(data)
        }).then(res => res.json());
      }
      this.siguiente();
    } else {
      console.log("No son iguales");
    }
  };

  saveFichaActualizacionPersona = async () => {
    const url = `${apiUrl}/FichaActualizacionPersona.php?p=create&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_ficha: this.state.id_ficha,
      cod_univ: this.state.cod_univ,
      cod_per: this.state.cod_per,
      terminos: this.state.terminos, //TODO Agregar this.state.terminos
      correo_verificado: false,
      correo_fecha_verificacion: moment(),
      sms_verificado: false,
      sms_fecha_verificacion: moment(),
      estado: false,
      finalizado: false,
      validado: false,
      id_asesor: 0,
      fecha_validacion: ""
    };

    await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(data)
    });
    // .then(res => res.json())
    // .catch(error => console.log(`Error: ${error}`))
    // .then(res => console.log(`Sucess: ${res}`));

    await this.getIdFichaPersona();
  };

  saveDatosPersonales = async () => {
    const url = `${apiUrl}/DatosPersonales.php?p=create&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_datos_personales: 0,
      id_ficha: parseInt(this.state.id_ficha, 10),
      nombres: this.state.nombre_per,
      apellido_paterno: this.state.apellido_pat_per,
      apellido_materno: this.state.apellido_mat_per,
      sexo: this.state.sexo_per,
      estado_civil:
        this.state.id_est_civil === "" || this.state.id_est_civil == null
          ? 1
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
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    }).then(res => res.json());

    await this.getIds();
  };

  saveLugarNacimiento = async () => {
    const url = `${apiUrl}/LugarNacimiento.php?p=create&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_nacimiento: 1,
      id_ficha: this.state.id_ficha,
      fecha_nacimiento: this.state.fch_nacimiento_per,
      id_nac_cod_pais:
        this.state.id_nac_pais_per == null || this.state.id_nac_pais_per === ""
          ? 9589
          : this.state.id_nac_pais_per,
      id_nac_cod_ciudad:
        this.state.id_nac_ciudad_per == null ||
        this.state.id_nac_ciudad_per === ""
          ? 2919
          : this.state.id_nac_ciudad_per,
      id_nac_cod_provincia:
        this.state.id_nac_provincia_per == null ||
        this.state.id_nac_provincia_per === ""
          ? 2301
          : this.state.id_nac_provincia_per,
      id_nac_cod_distrito:
        this.state.id_nac_distrito_per == null ||
        this.state.id_nac_distrito_per === ""
          ? 230101
          : this.state.id_nac_distrito_per
    };

    await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    }).then(res => res.json());

    await this.getIds();
  };

  saveLugarResidencia = async () => {
    const url = `${apiUrl}/LugarResidencia.php?p=create&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_direccion: 1,
      id_ficha: this.state.id_ficha,
      id_dir_cod_ciudad:
        this.state.id_res_ciudad_per == null ||
        this.state.id_res_ciudad_per === ""
          ? 2919
          : this.state.id_res_ciudad_per,
      id_dir_cod_provincia:
        this.state.id_res_provincia_per == null ||
        this.state.id_res_provincia_per === ""
          ? 2301
          : this.state.id_res_provincia_per,
      id_dir_cod_distrito:
        this.state.id_res_distrito_per == null ||
        this.state.id_res_distrito_per === ""
          ? 230101
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

    await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    }).then(res => res.json());

    await this.getIds();
  };

  saveEducacion = async () => {
    const url = `${apiUrl}/NivelEducativo.php?p=create&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

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

    await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    }).then(res => res.json());

    await this.getIds();
  };

  updateData = () => {
    if (this.state.paso === 0 && this.state.id_datos_personales === 0) {
      this.saveDatosPersonales();
    } else if (this.state.paso === 0 && this.state.id_datos_personales !== 0) {
      this.updateDatosPersonales();
    } else if (
      this.state.paso === 1 &&
      (this.state.id_nacimiento == null || this.state.id_nacimiento === 0)
    ) {
      this.saveLugarNacimiento();
    } else if (this.state.paso === 1 && this.state.id_nacimiento !== 0) {
      this.updateLugarNacimiento();
    } else if (
      this.state.paso === 2 &&
      (this.state.id_direccion == null || this.state.id_direccion === 0)
    ) {
      this.saveLugarResidencia();
    } else if (this.state.paso === 2 && this.state.id_direccion !== 0) {
      this.updateLugarResidencia();
    }
  };

  updateFichaActualizacion = async () => {
    let url = "";
    url = `${apiUrl}/FichaActualizacionPersona.php?p=update&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_ficha: this.state.id_ficha,
      cod_univ: this.state.cod_univ,
      cod_per: this.state.cod_per === "" ? 1 : this.state.cod_per,
      terminos:
        this.state.terminos === "" || this.state.terminos == null
          ? 1
          : this.state.terminos,
      correo_verificado: this.state.correo_verificado,
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
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    });
  };

  updateDatosPersonales = async () => {
    let url = "";
    url = `${apiUrl}/DatosPersonales.php?p=update&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

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
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    });
  };

  updateLugarNacimiento = async () => {
    let url = "";
    url = `${apiUrl}/LugarNacimiento.php?p=update&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_nacimiento: this.state.id_nacimiento,
      id_ficha: this.state.id_ficha,
      fecha_nacimiento: this.state.fch_nacimiento_per,
      id_nac_cod_pais: this.state.id_nac_pais_per,
      id_nac_cod_ciudad: this.state.id_nac_ciudad_per,
      id_nac_cod_provincia: this.state.id_nac_provincia_per,
      id_nac_cod_distrito: this.state.id_nac_distrito_per
    };

    await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    });
  };

  updateLugarResidencia = async () => {
    let url = "";
    url = `${apiUrl}/LugarResidencia.php?p=update&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_direccion: this.state.id_direccion,
      id_ficha: this.state.id_ficha,
      id_dir_cod_ciudad: this.state.id_res_ciudad_per,
      id_dir_cod_provincia: this.state.id_res_provincia_per,
      id_dir_cod_distrito: this.state.id_res_distrito_per,
      direccion: this.state.res_direccion_per,
      referencia: this.state.res_referencia_per,
      telefono_referencia: this.state.res_telefono_per
    };

    await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    });
  };

  updateEducacion = async () => {
    let url = "";
    url = `${apiUrl}/NivelEducativo.php?p=update&session=${
      this.state.session
    }&CodUniv=${this.state.cod_univ}`;

    const data = {
      id_educacion: this.state.id_educacion,
      id_ficha: this.state.id_ficha,
      idEdu: this.state.idIEdu,
      id_educ_cod_pais: this.state.id_educ_pais_per,
      id_educ_cod_ciudad: this.state.id_educ_ciudad_per,
      id_educ_cod_provincia: this.state.id_educ_provincia_per,
      id_educ_cod_distrio: this.state.id_educ_distrito_per
    };

    await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify(data)
    });
  };

  showModal = () => {
    this.setState(
      {
        visibleModal: true
      },
      this.state.id_educacion == null || this.state.id_educacion === 0
        ? this.saveEducacion
        : this.updateEducacion
    );
  };

  showModalCorreo = () => {
    this.setState({
      visibleModalCorreo: true
    });
  };

  getPersona = async () => {
    const response = await fetch(
      `${apiUrl}/FichaPersona.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
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
          id_est_civil: data.EstadoCivil,
          nro_doc_per: data.DniPer,
          sexo_per: data.Sexo,
          telefono_per: data.TelefFijo,
          celular_per: data.TelefCelular,
          email_per: data.Email,
          fch_nacimiento_per: data.FechaNac,
          res_direccion_per: data.Direccion,
          IdAdm_Discapacidad: 1,
          correo_verificado: false,
          sms_verificado: false,
          estado: false,
          existe: true,
          id_datos_personales: 0,
          terminos: false,
          finalizado: false
        },
        this.confirm
      );
    } else if (response.status === 400) {
      const res = await response.json();
      this.setState(
        {
          mensaje: res.message
        },
        this.confirm
      );
    }
  };

  getFichaPersona = async () => {
    const response = await fetch(
      `${apiUrl}/FichaActualizacionPersona.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    );
    if (response.status === 200) {
      const data = await response.json();
      this.getDatosPersonales();
      this.getLugarNacimiento();
      this.getLugarResidencia();
      this.getNivelEducativo();

      await this.setState(
        {
          id_ficha: data.id_ficha,
          id_datos_personales: data.id_datos_personales,
          id_nacimiento: data.id_nacimiento,
          id_direccion: data.id_direccion,
          id_educacion: data.id_educacion,
          cod_univ: data.cod_univ,
          cod_per: data.cod_per,
          terminos: data.terminos,
          correo_verificado: data.correo_verificado,
          correo_fecha_verificacion: data.correo_fecha_verificacion,
          sms_verificado: data.sms_verificado,
          sms_fecha_verificacion: data.sms_fecha_verificacion,
          estado: data.estado,
          existe: true,
          finalizado: data.finalizado,
          validado: data.validado
        },
        this.confirm
      );
    }
    if (response.status === 400) {
      this.getPersona();
    }
  };

  getIdFichaPersona = async () => {
    await fetch(
      `${apiUrl}/FichaActualizacionPersona.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    ).then(response =>
      response.json().then(data => {
        if (response.status === 200) {
          this.setState(
            {
              id_ficha: data.id_ficha
            },
            this.saveDatosPersonales
          );
        }
      })
    );
  };

  getDatosPersonales() {
    fetch(
      `${apiUrl}/DatosPersonales.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
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

  getIds = async () => {
    if (
      this.state.id_datos_personales === 0 ||
      this.state.id_nacimiento === 0 ||
      this.state.id_direccion === 0 ||
      this.state.id_educacion === 0
    ) {
      const response = await fetch(
        `${apiUrl}/FichaActualizacionPersona.php?p=read&session=${
          this.state.session
        }&CodUniv=${this.state.cod_univ}`
      );

      if (response.status === 200) {
        const data = await response.json();
        await this.setState({
          id_datos_personales: data.id_datos_personales,
          id_nacimiento: data.id_nacimiento,
          id_direccion: data.id_direccion,
          id_educacion: data.id_educacion
        });
      }

      // .then(response =>
      //   response.json().then(data => {
      //     if (response.status === 200) {
      //       this.setState({
      //         id_datos_personales: data.id_datos_personales,
      //         id_nacimiento: data.id_nacimiento,
      //         id_direccion: data.id_direccion,
      //         id_educacion: data.id_educacion
      //       });
      //     }
      //   })
    }
  };

  getLugarNacimiento = async () => {
    const response = await fetch(
      `${apiUrl}/LugarNacimiento.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    );

    if (response.status === 200) {
      const data = await response.json();

      await this.setState({
        id_nacimiento: data.id_nacimiento,
        fch_nacimiento_per: data.fecha_nacimiento,
        id_nac_pais_per:
          data.id_nac_cod_pais != null
            ? data.id_nac_cod_pais
            : this.state.id_nac_pais_per,
        id_nac_ciudad_per:
          data.id_nac_cod_ciudad != null
            ? data.id_nac_cod_ciudad
            : this.state.id_nac_pais_per,
        id_nac_provincia_per:
          data.id_nac_cod_provincia != null
            ? data.id_nac_cod_provincia
            : this.state.id_nac_provincia_per,
        id_nac_distrito_per:
          data.id_nac_cod_distrito != null
            ? data.id_nac_cod_distrito
            : this.state.id_nac_distrito_per
      });
    }
  };

  getLugarResidencia = async () => {
    const response = await fetch(
      `${apiUrl}/LugarResidencia.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    );
    if (response.status === 200) {
      const data = await response.json();
      await this.setState({
        id_direccion: data.id_direccion,
        id_res_ciudad_per: data.id_dir_cod_ciudad,
        id_res_provincia_per: data.id_dir_cod_provincia,
        id_res_distrito_per: data.id_dir_cod_distrito,
        res_direccion_per: data.direccion,
        res_referencia_per: data.referencia,
        res_telefono_per: data.telefono_referencia
      });
    }
  };

  getNivelEducativo = async () => {
    const response = await fetch(
      `${apiUrl}/NivelEducativo.php?p=readOne&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    );
    if (response.status === 200) {
      const data = await response.json();
      await this.setState({
        id_educacion: data.id_educacion,
        id_educ_pais_per: data.id_educ_cod_pais,
        id_educ_ciudad_per: data.id_educ_cod_ciudad,
        id_educ_provincia_per: data.id_educ_cod_provincia,
        id_educ_distrito_per: data.id_educ_cod_distrito,
        idIEdu: data.idEdu
      });
    }
  };

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
      disableNumero,
      visibleModalCorreo,
      visibleSendCorreo,
      visibleSaveCorreo
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
      mensaje,
      confirmacion,
      finalizado,
      session,
      permiso,
      validado
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
      mensaje,
      confirmacion,
      finalizado,
      validado,
      session
    };

    const { discapacidades } = this.state;
    const { estadosCiviles } = this.state;
    const { tiposDocumentos } = this.state;
    const {
      paises,
      ciudades,
      provincias,
      distritos,
      instituciones,
      dependencias
    } = this.state;

    const pasos = [
      {
        title: "Datos Personales",
        content: (
          <DatosPersonales
            ficha={ficha}
            discapacidades={discapacidades}
            estadosCiviles={estadosCiviles}
            tiposDocumentos={tiposDocumentos}
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
            session={session}
            cod_univ={cod_univ}
            paises={paises}
            ciudades={ciudades}
            provincias={provincias}
            distritos={distritos}
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
            session={session}
            cod_univ={cod_univ}
            ciudades={ciudades}
            provincias={provincias}
            dependencias={dependencias}
            distritos={distritos}
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
            session={session}
            cod_univ={cod_univ}
            paises={paises}
            ciudades={ciudades}
            provincias={provincias}
            instituciones={instituciones}
            distritos={distritos}
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
        {this.state.finalizado == true && validado == true && (
          <Result
            status="success"
            title="Su ficha ha sido validada correctamente"
            subTitle="Puede continuar con el proceso de matrícula"
          />
        )}
        {this.state.finalizado == true && validado == false && (
          <Result
            status="info"
            title="En proceso de validación"
            subTitle="Acérquese donde un asesor para terminar de validar su ficha"
          />
        )}
        {permiso == true && (
          <DetalleFicha
            permiso={permiso}
            session={session}
            finalizado={finalizado}
            validado={ficha.validado}
            cod_univ={this.state.cod_univ}
          />
        )}
        {this.state.finalizado == false && (
          <div hidden={!terminos}>
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
                          message:
                            "Por favor ingrese su número de celular válido"
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

              <Modal
                visible={visibleModalCorreo}
                title="Validación de email"
                centered={true}
                footer={[
                  <div style={{ textAlign: "center" }}>
                    <Button
                      style={{ width: "50%", marginBottom: "8px" }}
                      key="back"
                      icon={"close"}
                      type="danger"
                      onClick={() => this.handleCancelCorreo()}
                    >
                      Cancelar
                    </Button>
                  </div>,
                  <div style={{ textAlign: "center" }}>
                    <Button
                      hidden={visibleSendCorreo}
                      style={{ width: "50%", marginBottom: "8px" }}
                      key="submit"
                      icon={"check"}
                      type="primary"
                      loading={loading}
                      block={bloqued}
                      onClick={() => this.handleOkCorreo()}
                    >
                      Enviar Código
                    </Button>
                  </div>,
                  <div style={{ textAlign: "center" }}>
                    <Button
                      hidden={visibleSaveCorreo}
                      style={{ width: "50%" }}
                      key="submit"
                      type="primary"
                      loading={loading}
                      onClick={() => this.handleSaveCorreoVerificado()}
                    >
                      Confirmar y Guardar
                    </Button>
                  </div>
                ]}
              >
                <div />
                <Form {...formItemLayout}>
                  <Form.Item label="Email">
                    {getFieldDecorator("email", {
                      initialValue: this.state.email_per,
                      rules: [
                        {
                          required: true,
                          message: "Por favor ingrese su email"
                        }
                      ]
                    })(
                      <Input
                        disabled={true}
                        onChange={this.handleChangeInput("email_per")}
                        style={{ width: "45%" }}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="Código de confirmación">
                    {getFieldDecorator("confirmacion", {
                      rules: [
                        {
                          required: true,
                          message:
                            "Por favor ingrese el código que ha sido enviado a su correo"
                        }
                      ]
                    })(
                      <Input
                        style={{ width: "45%" }}
                        onChange={this.handleChangeInput("confirmacion")}
                      />
                    )}
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </div>
        )}
      </Layout>
    );
  }
}

export default Form.create()(UsuarioForm);
