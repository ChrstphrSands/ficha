import React from 'react';
import DatosPersonales from "./DatosPersonales";
import LugarFechaNacimiento from "./LugarFechaNacimiento";
import LugarResidenciaActual from "./LugarResidenciaActual";
import NivelEducativo from "./NivelEducativo";
import {Steps, Button} from "antd";

const {Step} = Steps;

class UsuarioForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      paso: 0,
      nombre_per: '',
      apellido_pat_per: '',
      apellido_mat_per: '',
      id_tipo_doc: '',
      nro_doc_per: '',
      sexo_per: '',
      id_est_civil: '',
      telefono_per: '',
      celular_per: '',
      email_per: '',
      nacionalidad: '',
      fch_nacimiento_per: '',
      id_nac_pais_per: '',
      id_nac_ciudad_per: '',
      id_nac_provincia_per: '',
      id_nac_distrito_per: '',
      residencia_per: '',
      id_res_ciudad_per: '',
      id_res_provincia_per: '',
      id_res_distrito_per: '',
      res_direccion_per: '',
      res_referencia_per: '',
      res_telefono_per: '',
      id_idioma_origen: '',
      idioma_ingles_per: '',
      idioma_portuguez_per: '',
      idioma_frances_per: '',
      id_idioma_otro: '',
      IdAdm_Discapacidad: '',
      id_educ_pais_per: '',
      id_educ_ciudad_per: '',
      id_educ_provincia_per: '',
      id_educ_distrito_per: '',
    }
  }

  siguiente() {

    const paso = this.state.paso + 1;
    this.setState({
      paso
    });

  };

  regresar() {
    const paso = this.state.paso - 1;
    this.setState({
      paso
    });
  };

  handleChangeInput = input => (e) => {
    this.setState({[input]: e.target.value});
  };

  handleChangeSelect = select => (e) => {
    this.setState({[select]: e});
  };

  handleChangeDatePicker = picker => (date, dateString) => {
    this.setState({[picker]: date});
    console.log(this.state.fch_nacimiento_per);
  }

  getFichaPersona() {
    fetch('http://localhost/FichaWeb/app/controller/fichaPersona/read.php')
      .then(response => response.json())
      .then(data => this.setState({
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
      }))
  }

  componentDidMount() {
    this.getFichaPersona();
  }

  render() {

    const {paso} = this.state;
    const {
      nombre_per, apellido_pat_per, apellido_mat_per, id_tipo_doc, nro_doc_per, sexo_per, id_est_civil,
      telefono_per, celular_per, email_per, nacionalidad, fch_nacimiento_per, id_nac_pais_per, id_nac_ciudad_per,
      id_nac_provincia_per, id_nac_distrito_per, residencia_per, id_res_ciudad_per, id_res_provincia_per, id_res_distrito_per,
      res_direccion_per, res_referencia_per, res_telefono_per, id_idioma_origen, idioma_ingles_per, idioma_portuguez_per,
      idioma_frances_per, id_idioma_otro, IdAdm_Discapacidad, id_educ_pais_per, id_educ_ciudad_per, id_educ_provincia_per, id_educ_distrito_per
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
        id_educ_pais_per,
        id_educ_ciudad_per,
        id_educ_provincia_per,
        id_educ_distrito_per
      }
    ;

    const pasos = [
      {
        title: 'Datos Personales',
        content: <DatosPersonales ficha={ficha}
                                  handleChangeInput={this.handleChangeInput}
                                  handleChangeSelect={this.handleChangeSelect}/>
      },
      {
        title: 'Lugar de y fecha de nacimiento',
        content: <LugarFechaNacimiento ficha={ficha}
                                       handleChangeInput={this.handleChangeInput}
                                       handleChangeSelect={this.handleChangeSelect}
                                       handleChangeDatePicker={this.handleChangeDatePicker}/>
      },
      {
        title: 'Lugar de residencia actual',
        content: <LugarResidenciaActual ficha={ficha}
                                        handleChangeInput={this.handleChangeInput}
                                        handleChangeSelect={this.handleChangeSelect}/>
      },
      {
        title: 'Nivel educativo e institucion educativa',
        content: <NivelEducativo ficha={ficha}
                                 handleChangeInput={this.handleChangeInput}
                                 handleChangeSelect={this.handleChangeSelect}/>
      },
    ]

    return (
      <div>
        <Steps current={paso}>
          {pasos.map(item => (
            <Step key={item.title} title={item.title}/>
          ))}
        </Steps>
        <div className="steps-content">{pasos[paso].content}</div>
        <div className="steps-action">
          {paso === pasos.length - 1 && (
            <Button type="primary">
              Completo
            </Button>
          )}
          {paso > 0 && (
            <Button style={{marginLeft: 8}} onClick={() => this.regresar()}>
              Regresar
            </Button>
          )}
          {paso < pasos.length - 1 && (
            <Button type="primary" onClick={() => this.siguiente()}>
              Siguiente
            </Button>
          )}
        </div>
      </div>
    )
  }
}

export default UsuarioForm;