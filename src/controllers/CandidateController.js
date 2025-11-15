// Controller: Candidate Controller
// Maneja la lógica entre el modelo y la vista

import CandidateModel from '../models/CandidateModel';

class CandidateController {
  getCandidateInfo() {
    return CandidateModel.getCandidateData();
  }

  getFullName() {
    return CandidateModel.getFullName();
  }

  getEmail() {
    return CandidateModel.getEmail();
  }

  getProfileDescription() {
    return CandidateModel.getProfileDescription();
  }

  getSkills() {
    return CandidateModel.getSkills();
  }
}

export default new CandidateController();
