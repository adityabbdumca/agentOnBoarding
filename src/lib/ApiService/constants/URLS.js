export const URLs = {
  //Theme
  GET_THEME: "getTheme",
  CREATE_UPDATE_THEME: "create/UpdateTheme",
  GET_THEME_LISTING: "getThemeList",
  SET_THEME: "setTheme",
  DELETE_THEME: "deleteTheme",

  //Login
  REGISTER_USER: "registration",
  REGISTER_LEAD: "leadCreation",
  LOGIN_USER: "login",
  LOGOUT: "logout",
  FORGOT_PASSWORD: "forgotPassword",

  //Menu
  AGENT_MENU: "getAgentMenu",
  ADMIN_MENU: "menus",

  //Access Control
  ACCESS_CONTROL: "access",

  //Agent-Master
  STAGE_COUNT: "agentMasterCounts",
  EXPORT_AGENT_MASTER: "download_excel",
  UPDATE_EXAM_RESULT: "UpdateExamResult",
  APPROVE_CERTIFICATE: "ApproveCertificate",
  SHARE_JOURNEY: "shareJourneyLink",

  //Certified Agent
  GET_CERTIFIED_AGENT_DEMO_EXCEL: "certifiedAgentLeadSampleExcel",
  UPLOAD_CERTIFIED_AGENT_EXCEL: "certifiedAgentDataUpload",
  CREATE_AND_UPDATE_AGENT_BULK_UPLOAD: "createCertifiedAgent",
  GENERATE_APPLICATION_FORM_PDF: "generateApplicationFormPdf",

  //Branch Onboarding
  ADD_UPDATE_BRANCH: "createBranch",
  UPLOAD_BRANCH_EXCEL: "uploadBranchExcel",
  BRANCH_ONBOARDING_DEMO_EXCEL: "branchSampleExcel",
  GET_BRANCH_NAME: "getOrganisationName",

  //USER-Creation
  GET_REPORTING_TO_LIST: "ReportingToList",
  GET_REPORTING_USER_LIST: "getReportingUserList",
  GET_CATEGORIES: "categories",
  CREATE_USER: "CreateUser",
  EXPORT_USER_LISTING: "UserListExport",
  GET_ROLE_WITH_VERTICAL: "getRoleWithVertical",
  GET_BRANCH_LIST: "getBranch",
  SET_ACTIVE_USER: "updateUserStatus",

  //EVENT MASTER
  CREATE_EVENT: "createEvent",

  //IFSC MASTER
  ADD_UPDATE_IFSC_DETAILS: "createOrUpdateIFSC",
  DELETE_IFSC_DETAILS: "deleteIFSC",
  EXPORT_IFSC_LISTING: "exportIFSC",
  IFSC_DATA_UPLOAD: "ifscDataUpload",

  //   IRDAI-Report
  EXPORT_IRDAI_LISTING: "exportIRDAIReport",
  DEACTIVATE_AGENT: "deactivationUser",

  //Lead-Bulk-Upload
  GET_DEMO_LEAD_AGENT_EXCEL: "agentLeadSampleExcel",
  UPLOAD_LEAD_AGENT_EXCEL: "uploadAgentLeadExcel",

  //MENU-MASTER
  ADD_MENU: "menus",

  //ONBOARDING
  CREATE_ONBOARDING: "storeOnboardingData",
  GET_DEMO_ADD_ONBOARDING_EXCEL: "onboardingSampleExcel",
  EXPORT_ONBOARDING_LISTING: "exportOnboarding",

  //AGENT JOURNEY
  ADD_UPDATE_PROFILE: "profile/save",
  OCCUPATIONS_LIST: "occupations",
  LIFEINSURANCECOMPANYLIST: "lifeInsuranceCompanyList",
  ADD_UPDATE_BANK_DETAILS: "bank-details/save",
  ADD_UPDATE_NOMINEE: "nominee/save",
  ADD_UPDATE_EXAM_DETAILS: "createExamDetails",
  GENERATE_DECLARATION_FORM: "declarationForm",
  ADD_UDPATE_DOCUMENTS: "createUserDocument",
  HANDLE_PAYMENT: "payment-data",
  GET_USER_DATA: "getUserDetails",
  GET_CITY_STATE: "fetchCity",
  GET_IFSC_DETAILS: "getIFSCCode",
  GET_EXAM_CENTER_DETAILS: "getExamCenter",
  CREATE_CKYC: "createCkycNo",
  SET_AGENT_TYPE: "agentTypeMaster",
  VERIFY_OTP: "declareOtp",
  GET_DISCREPANCY_LISTING: "getDiscrepancy",
  GENERATE_DECLARATION_PDF: "generateDeclarationPdf",
  ADD_DISCREPANCY: "createDiscrepancy",
  APPROVE_AGENT_DOCUMENT: "docApproval",
  CREATE_NOC: "createNoc",
  UPDATE_DISCREPANCY_DETAILS: "updateDiscrepancy",
  VERIFY_PAYMENT: "payment-verify",
  APPROVE_EXAM_DATE: "ExamDateApproval",
  AGENT_FINAL_APPROVAL: "userDocumentFinalApproval",
  GET_HEALTH_IC_LIST: "healthInsuranceCompanyList",
  GET_GENERAL_IC_LIST: "generalInsuranceCompanyList",
  GET_LIFE_IC_LIST: "lifeInsuranceCompanyList",
  PREFILL_OCR_DATA: "addOCRUserDocument",
  CKYC_DATA: "addOCRCkycNo",
  GET_USER_DOCUMENT: "getUserDocumentList",
  HEREIDATRY_DOCUMENT: "generateHereditaryCertificate",
  TRAINING_DOCS: "ic38Pdf",
  START_TRAINING: "startTraining",
  POS_EXAM_QUESTIONS: "getexamquestions",
  POS_EXAM_SUBMIT: "submitPosExam",
  LIST_OF_BOARD_OR_UNIVERSITY: "listBoardUniversity",
  //PAYMENT-BULK-UPLOAD
  GET_DEMO_PAYMENT_EXCEL: "paymentUploadSample",
  UPLOAD_PAYMENT_EXCEL: "paymentUpload",

  //PINCODE-MASTER
  GET_STATE_LIST: "fetchState",
  GET_CITY_LIST: "getCity",
  ADD_UDPATE_PINCODE_DETAILS: "create/Update-Pincode",
  DELETE_PINCODE_DETAILS: "deletePincode",
  EXPORT_PINCODE_LISTING: "exportPincode",
  UPLOAD_PINCODE_EXCEL: "uploadPincodeExcel",
  SAMPLE_PINCODE_EXCEL: "samplePincodeExcel",
  SAMPLE_IFSC_EXCEL: "IFSCSampleExcel",
  //POS-BULK-UPLOAD
  ADD_UPDATE_POS: "createPOSDetails",

  //   ROLE-MASTER
  VIEW_REPORTING_TO_ROLES: "viewReportingTo",
  CREATE_ROLE: "createRoleMaster",
  UPDATE_ROLE: "updateMaster",
  DELETE_ROLE: "deleteMaster",
  GET_VERTICAL_LIST: "getVertical",

  //   SP-DETAILS
  CREATE_UPDATE_SP_DETAILS: "createSPDetails",

  //Training Master
  ADD_TRAINING_TIME: "addTrainingConfig",
  DELETE_TRAINING_TIME: "deleteTrainingConfig",
  ADD_TRAINING_DOCUMENT: "addTrainingDoc",
  DELETE_TRAINING_DOCUMENT: "deleteTrainingDoc",
  GET_STATUS_TRACKING:"getStatusTracking",

  //Exam Date Excel
  EXPORT_EXAM_DATE_EXCEL: "uploadExamDateExcel",
  EXPORT_EXAM_DATE_SAMPLE: "sampleExamDateExcel",
  EXPORT_EXAM_PENDINGEXAM_LIST: "pendingExamList",
  EXPORT_EXAM_EXPORT_EXCEL: "pendingExamExcel",

  //Exam Result Excel
  EXPORT_EXAM_RESULT_EXCEL: "uploadExamResultExcel",
  EXPORT_EXAM_RESULT_SAMPLE: "examResultSampleExcel",

  //Disxrepancy Lisiting
  DISCREPANCY_ACTIONS: "approvDiscrepancy",
  //Exam Questions
  UPLOAD_EXAM_QUESTIONS: "addQuestionSet",
  EXAM_QUESTIONS_SAMPLE_EXCEL: "queSetSampleExcel",
  EXAM_QUESTIONS_LISTING: "listBulkQuestionSet",

  //Add Exam Config
  ADD_UPDATE_EXAM_CONFIG: "addExamConfig",
  GET_EXAM_CONFIG_LIST: "listExamConfig",
  DELETE_EXAM_CONFIG: "deleteExamConfig",
  //Certificate
  GET_USER_CERTIFICATE: "agentOnboardingCertificate",

  //URL Config
  URL_CONFIG: "config-settings",
  SYNC_URL_CONFIG: "userSync",

  //Utility Master
  GET_UTILITY_MASTER: "listMasterStage",
  UPDATE_UTILITY_MASTER: "addMasterStage",

  // Role Based Charges
  GET_ROLE_CHARGES: "listPaymentConfig",
  UPDATE_ROLE_CHARGES: "updatePaymentConfig",
  // payment of way
  LISTPAYMENTWAYOF: "listPaymentWayOf",
  CREATEPAYMENTOF: "createPaymentWayOf",
  DELETEPAYMENTWAYOF: "deletePaymentWayOf",
  UPDATE_PAYMENT_WAY_OF: "updatePaymentWayOf",
  SEARCH_APPLICATION_NO: "searchApplicationNo",
  DELETE_PAYMEENT_WAY_OF: "deletePaymentWayOf",

  //SERVICE MODULE
  ENDORSEMENT_TYPES: "endorsement-types",
  GET_ENDORSEMENT_REGISTER_REQUEST: "get-endorsement-register-request",
  STORE_ENDORSEMENT_ENDORSEMENT_REGISTER_REQUEST:
    "store-endorsement-register-request",
  UPDATE_ENDORSEMENT_DATA: "update-endorsement-data",
  ENDORSEMENT_HISTORY: "endorsement-history",
  COMPOSITE_IC_LIST: "compositeInsuranceCompanies",
  ENDORSEMENT_OTP_GENERATE: "endorsement-otp-generate",
  ENDORSEMENT_OTP_VERIFY: "endorsement-otp-verify",
  ENDORSEMENT_VIEW: "endorsement-view",
  GENERAL_INSURANCE_COMPANY_LIST: "generalInsuranceCompanyList",
  ENDORSEMENT_EXPORT: "endorsement-export",

  UPLOAD_DOCUMENT: "upload/document",

  PAYMENT_STATUS: "payment-status",
  PAYMENT_RECEIPT: "paymentReceiptPdf",
  UPDATE_TAX_PAYER_STATUS: "updateTaxPayerStatus",
  PAYMENT_RECEIPT_VIEW: "payment-receipt-view",
};
