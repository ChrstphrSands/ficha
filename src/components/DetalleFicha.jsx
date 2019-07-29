import React, { Fragment } from "react";
import { Input, Modal, Button, Descriptions, Result } from "antd";
import { Typography } from "antd";

const { Text } = Typography;
const { confirm } = Modal;

const apiUrl = "http://192.168.0.5/FichaDatos/FichaWeb/modules";
class DetalleFicha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cod_univ: "",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      sexo: "",
      estado_civil: "",
      discapacidad: "",
      tipo_documento: "",
      numero_documento: "",
      email: "",
      celular: "",
      telefono: "",
      fecha_nacimiento: "",
      nacimiento_pais: "",
      nacimiento_ciudad: "",
      nacimiento_provincia: "",
      nacimiento_distrito: "",
      direccion_ciudad: "",
      direccion_provincia: "",
      direccion_distrito: "",
      direccion: "",
      referencia: "",
      telefono_referencia: "",
      educacion_pais: "",
      educacion_ciudad: "",
      educacion_provincia: "",
      educacion_distrito: "",
      nombre_ie: "",
      terminos: 1,

      session: "",
      cod_univ: "",
      id_asesor: "",
      permiso: false,
      id_ficha: 0,

      validado: false,
      finalizado: false,
      existe: false,
      habilitado: false
    };
  }

  async componentDidMount() {
    const { session, cod_univ, permiso, validado } = this.props;
    await this.setState({
      session: session,
      id_asesor: cod_univ,
      permiso: permiso,
      validado: validado,
      existe: false,
      habilitado: false
    });

    if (this.state.permiso == false) {
      await this.getFichaPersona();
    }
  }

  handlePressEnter = async () => {
    // this.setState({
    //   paso: 0
    // });
    // this.getFichaPersona();
    //
    // this.esCorreoVerificado();
    // if (this.state.correo_verificado) {
    //   this.confirm();
    // }

    // this.getFichaPersona();

    await this.getIdFichaPersona();
    await this.getFichaPersona();
  };

  getIdFichaPersona = async () => {
    const response = await fetch(
      `${apiUrl}/FichaActualizacionPersona.php?p=read&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}`
    );

    if (response.status == 200) {
      const data = await response.json();
      await this.setState({
        id_ficha: data.id_ficha,
        validado: data.validado,
        finalizado: data.finalizado
      });
    } else if (response.status == 400) {
      this.setState({
        id_ficha: 0,
        existe: false,
        habilitado: false
      });
    }
  };

  getFichaPersona = async () => {
    const response = await fetch(
      `${apiUrl}/FichaActualizacionPersona.php?p=readFinalizada&session=${
        this.state.session
      }&CodUniv=${this.state.cod_univ}&fc=${this.state.id_ficha}`
    );

    if (response.status == 200) {
      const data = await response.json();
      await this.setState({
        cod_univ: data.cod_univ,
        nombres: data.nombres,
        apellido_paterno: data.apellido_paterno,
        apellido_materno: data.apellido_materno,
        sexo: data.sexo,
        estado_civil: data.estado_civil,
        discapacidad: data.discapacidad,
        tipo_documento: data.tipo_documento,
        numero_documento: data.numero_documento,
        email: data.email,
        celular: data.celular,
        telefono: data.telefono,
        fecha_nacimiento: data.fecha_nacimiento,
        nacimiento_pais: data.nacimiento_pais,
        nacimiento_ciudad: data.nacimiento_ciudad,
        nacimiento_provincia: data.nacimiento_provincia,
        nacimiento_distrito: data.nacimiento_distrito,
        direccion_ciudad: data.direccion_ciudad,
        direccion_provincia: data.direccion_provincia,
        direccion_distrito: data.direccion_distrito,
        direccion: data.direccion,
        referencia: data.referencia,
        telefono_referencia: data.telefono_referencia,
        educacion_pais: data.educacion_pais,
        educacion_ciudad: data.educacion_ciudad,
        educacion_provincia: data.educacion_provincia,
        educacion_distrito: data.educacion_distrito,
        nombre_ie: data.nombre_ie,
        existe: true,
        habilitado: true
      });
    } else if (response.status == 400) {
      await this.setState({
        existe: false,
        cod_univ: 0,
        habilitado: true
      });
    }
  };

  handleClickValidar = () => {
    confirm({
      title: "Confirmación",
      content: "¿Está seguro que desea validar la ficha?",
      okText: "Si",
      cancelText: "No",
      onOk: this.validarFicha,
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  handleClickRechazar = () => {
    confirm({
      title: "Confirmación",
      content: "¿Está seguro que desea rechazar la ficha?",
      okText: "Si",
      cancelText: "No",
      onOk: this.rechazarFicha,
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  handleChangeInputCodigo = input => async e => {
    await this.setState({ [input]: e.target.value });
  };

  validarFicha = async () => {
    const url = `${apiUrl}/FichaActualizacionPersona.php?p=updateFichaValidacion&session=${
      this.state.session
    }&CodUniv=${this.state.id_asesor}`;

    const data = {
      id_ficha: this.state.id_ficha,
      validado: true,
      id_asesor: this.state.id_asesor
    };

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8"
      },
      method: "POST",
      body: JSON.stringify(data)
    });

    if (response.status == 200) {
      const data = await response.json();
      await this.setState({
        validado: true
      });
    }

    // .then(function(response) {
    //   return response.json();
    // })
    // .then(function(dato) {
    //   console.log(dato);
    // });
    // .then(datos => console.log(datos.mensaje))
    // .catch(error => console.log(`Error: ${error}`));
  };

  rechazarFicha = async () => {
    const url = `${apiUrl}/FichaActualizacionPersona.php?p=updateFichaRechazo&session=${
      this.state.session
    }&CodUniv=${this.state.id_asesor}`;

    const data = {
      id_ficha: this.state.id_ficha
    };

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8"
      },
      method: "POST",
      body: JSON.stringify(data)
    });

    if (response.status == 200) {
      const data = await response.json();
      await this.setState({
        finalizado: false,
        validado: false
      });
    }
  };

  render() {
    const { finalizado, permiso, validado } = this.props;

    return (
      <div style={{ width: "100%", margin: "0 auto" }}>
        {permiso == true && (
          <Input
            placeholder="2014049413"
            style={{ marginBottom: "16px", marginTop: "16px" }}
            onPressEnter={this.handlePressEnter}
            onChange={this.handleChangeInputCodigo("cod_univ")}
          />
        )}
        {this.state.existe == false && this.state.habilitado == true && (
          <Result
            status="warning"
            title="No existe datos"
            subTitle="El alumno no ha iniciado con el proceso de actualización de datos."
          />
        )}
        {this.state.existe == true &&
          this.state.finalizado == false &&
          this.state.validado == false &&
          permiso == true && (
            <Result
              status="warning"
              title="Ficha sin actualizar"
              subTitle="El alumno no ha finalizado con la edición de sus datos."
            />
          )}
        {this.state.finalizado == true && permiso == true && (
          <div hidden={this.state.validado}>
            <div style={{ width: "100%", "margin-bottom": "1.5em" }}>
              <Descriptions
                title="Información Datos Personales:"
                bordered
                layout={"horizontal"}
              >
                <Descriptions.Item label="Código Universitario" span={3}>
                  {this.state.cod_univ}
                </Descriptions.Item>
                <Descriptions.Item label="Nombres" span={1}>
                  {this.state.nombres}
                </Descriptions.Item>
                <Descriptions.Item label="Apellido Paterno" span={1}>
                  {this.state.apellido_paterno}
                </Descriptions.Item>
                <Descriptions.Item label="Apellido Materno" span={1}>
                  {this.state.apellido_materno}
                </Descriptions.Item>
                <Descriptions.Item label="Sexo" span={1}>
                  {this.state.sexo == "M" ? "Masculino" : "Femenino"}
                </Descriptions.Item>
                <Descriptions.Item label="Estado Civil">
                  {this.state.estado_civil}
                </Descriptions.Item>
                <Descriptions.Item label="Discapacidad">
                  {this.state.discapacidad}
                </Descriptions.Item>
                <Descriptions.Item label={this.state.tipo_documento}>
                  {this.state.numero_documento}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {this.state.email}
                </Descriptions.Item>
                <Descriptions.Item label="Celular">
                  {this.state.celular}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div style={{ "margin-bottom": "1.5em" }}>
              <Descriptions
                title="Lugar y Fecha de nacimiento:"
                bordered
                layout={"horizontal"}
              >
                <Descriptions.Item label="Fecha Nacimiento" span={1}>
                  {this.state.fecha_nacimiento}
                </Descriptions.Item>
                <Descriptions.Item label="País" span={1}>
                  {this.state.nacimiento_pais}
                </Descriptions.Item>
                <Descriptions.Item label="Ciudad" span={1}>
                  {this.state.nacimiento_ciudad}
                </Descriptions.Item>
                <Descriptions.Item label="Provincia" span={1}>
                  {this.state.nacimiento_provincia}
                </Descriptions.Item>
                <Descriptions.Item label="Distrito" span={1}>
                  {this.state.nacimiento_distrito}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div style={{ "margin-bottom": "1.5em" }}>
              <Descriptions
                title="Lugar de Residencia Actual:"
                bordered
                layout={"horizontal"}
              >
                <Descriptions.Item label="Ciudad" span={1}>
                  {this.state.direccion_ciudad}
                </Descriptions.Item>
                <Descriptions.Item label="Provincia" span={1}>
                  {this.state.direccion_provincia}
                </Descriptions.Item>
                <Descriptions.Item label="Distrito" span={1}>
                  {this.state.direccion_distrito}
                </Descriptions.Item>
                <Descriptions.Item label="Dirección" span={1}>
                  {this.state.direccion}
                </Descriptions.Item>
                <Descriptions.Item label="Referencia" span={1}>
                  {this.state.referencia}
                </Descriptions.Item>
                <Descriptions.Item label="Teléfono de Referencia" span={1}>
                  {this.state.telefono_referencia}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div style={{ "margin-bottom": "1.5em" }}>
              <Descriptions title="Estudios:" bordered layout={"horizontal"}>
                <Descriptions.Item label="País" span={1}>
                  {this.state.educacion_pais}
                </Descriptions.Item>
                <Descriptions.Item label="Ciudad" span={1}>
                  {this.state.educacion_ciudad}
                </Descriptions.Item>
                <Descriptions.Item label="Provincia" span={1}>
                  {this.state.educacion_provincia}
                </Descriptions.Item>
                <Descriptions.Item label="Distrito" span={1}>
                  {this.state.educacion_distrito}
                </Descriptions.Item>
                <Descriptions.Item label="Institución Educativa" span={1}>
                  {this.state.nombre_ie}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div className="button-validate-disable" hidden={!permiso}>
              <Button type={"danger"} onClick={this.handleClickRechazar}>
                Rechazar Ficha
              </Button>
              <Button type={"primary"} onClick={this.handleClickValidar}>
                Validar Ficha
              </Button>
            </div>
          </div>
        )}

        {this.state.existe == true &&
          this.state.validado == true &&
          this.state.finalizado == true &&
          permiso == true && (
            <Result
              status="success"
              title="Datos del alumno validados"
              subTitle="Los datos del alumno han sido validados."
              extra={[
                <Fragment>
                  <div>
                    <Text style={{ fontWeight: "bolder" }}>
                      {this.state.cod_univ}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ fontWeight: "bolder" }}>
                      {this.state.nombres} {this.state.apellido_paterno}{" "}
                      {this.state.apellido_materno}
                    </Text>
                  </div>
                </Fragment>
              ]}
            />
          )}
      </div>
    );
  }
}

export default DetalleFicha;
