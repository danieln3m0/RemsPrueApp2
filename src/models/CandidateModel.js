// Model: Candidate Information
// Contiene la información del candidato

class CandidateModel {
  constructor() {
    this.data = {
      fullName: "Francis Daniel Nemocón",
      email: "francis.nemocon@example.com",
      profileDescription: "Desarrollador Full Stack con experiencia en React Native y Expo. Apasionado por crear aplicaciones móviles eficientes y escalables. Cuento con sólidos conocimientos en arquitectura de software, patrones de diseño como MVC, y experiencia en el desarrollo de soluciones innovadoras. Mi enfoque está en escribir código limpio, mantenible y siguiendo las mejores prácticas de la industria. Busco contribuir en proyectos desafiantes donde pueda aportar valor y seguir creciendo profesionalmente.",
      skills: [
        "React Native",
        "Expo",
        "JavaScript/TypeScript",
        "Arquitectura MVC",
        "Git",
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
