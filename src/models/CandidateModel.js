/**
 * CandidateModel - Modelo de datos para la información del candidato
 * 
 * Este modelo almacena y proporciona acceso a la información personal y profesional
 * del candidato. Implementa el patrón Singleton para garantizar una única instancia.
 * 
 * @class
 * @author Francis Daniel Mamani Silva
 * @version 1.0.0
 */
class CandidateModel {
  /**
   * Constructor del modelo de candidato
   * Inicializa los datos del candidato con información predefinida
   */
  constructor() {
    /**
     * Objeto con toda la información del candidato
     * @type {Object}
     * @property {string} fullName - Nombre completo del candidato
     * @property {string} email - Correo electrónico de contacto
     * @property {string} profileDescription - Descripción profesional del candidato
     * @property {Array<string>} skills - Lista de habilidades técnicas
     */
    this.data = {
      fullName: "Francis Daniel Mamani Silva",
      email: "francisdani143@gmail.com",
      profileDescription: "Full Stack Developer con experiencia sólida en React Native y Expo. Me especializo en crear aplicaciones móviles eficientes, escalables y con un enfoque en la experiencia del usuario. Tengo dominio de arquitecturas limpias, patrones de diseño como MVC y buenas prácticas de desarrollo. Me enfoco en producir código limpio, mantenible y orientado a resultados. Busco participar en proyectos desafiantes donde pueda aportar valor, optimizar procesos y seguir creciendo como desarrollador.",
      skills: [
        "React Native",
        "Expo",
        "JavaScript/TypeScript",
        "Arquitectura MVC",
        "Git",
        "RESTful APIs",
        "Diseño UI/UX",
        "Pruebas Unitarias",
        "Optimización de Rendimiento",
        "Control de Versiones",
        "EAS Build"
      ]
    };
  }

  /**
   * Obtiene todos los datos del candidato
   * @returns {Object} Objeto completo con toda la información del candidato
   */
  getCandidateData() {
    return this.data;
  }

  /**
   * Obtiene el nombre completo del candidato
   * @returns {string} Nombre completo
   */
  getFullName() {
    return this.data.fullName;
  }

  /**
   * Obtiene el correo electrónico del candidato
   * @returns {string} Dirección de correo electrónico
   */
  getEmail() {
    return this.data.email;
  }

  /**
   * Obtiene la descripción profesional del candidato
   * @returns {string} Descripción del perfil profesional
   */
  getProfileDescription() {
    return this.data.profileDescription;
  }

  /**
   * Obtiene el array de habilidades técnicas
   * @returns {Array<string>} Lista de habilidades y tecnologías
   */
  getSkills() {
    return this.data.skills;
  }
}

/**
 * Exporta una instancia única del modelo (Singleton)
 * Garantiza que toda la aplicación use los mismos datos del candidato
 * @type {CandidateModel}
 */
export default new CandidateModel();
