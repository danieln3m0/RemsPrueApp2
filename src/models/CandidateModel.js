

class CandidateModel {
  constructor() {
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

  getCandidateData() {
    return this.data;
  }

  getFullName() {
    return this.data.fullName;
  }

  getEmail() {
    return this.data.email;
  }

  getProfileDescription() {
    return this.data.profileDescription;
  }

  getSkills() {
    return this.data.skills;
  }
}

export default new CandidateModel();
