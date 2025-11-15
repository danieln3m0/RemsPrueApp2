/**
 * CandidateController - Controlador para la información del candidato
 * 
 * Implementa la capa de control en el patrón MVC. Actúa como intermediario
 * entre la vista (HomeView) y el modelo (CandidateModel), proporcionando
 * una interfaz clara para acceder a los datos del candidato.
 * 
 * @class
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 */

import CandidateModel from '../models/CandidateModel';

class CandidateController {
  /**
   * Obtiene toda la información del candidato
   * @returns {Object} Datos completos del candidato (nombre, email, descripción, habilidades)
   */
  getCandidateInfo() {
    return CandidateModel.getCandidateData();
  }

  /**
   * Obtiene el nombre completo del candidato
   * @returns {string} Nombre completo
   */
  getFullName() {
    return CandidateModel.getFullName();
  }

  /**
   * Obtiene el correo electrónico del candidato
   * @returns {string} Dirección de correo electrónico
   */
  getEmail() {
    return CandidateModel.getEmail();
  }

  /**
   * Obtiene la descripción del perfil profesional
   * @returns {string} Descripción del perfil
   */
  getProfileDescription() {
    return CandidateModel.getProfileDescription();
  }

  /**
   * Obtiene el listado de habilidades técnicas
   * @returns {Array<string>} Array de habilidades
   */
  getSkills() {
    return CandidateModel.getSkills();
  }
}

/**
 * Exporta una instancia única del controlador (Singleton)
 * @type {CandidateController}
 */
export default new CandidateController();
