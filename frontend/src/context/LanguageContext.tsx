import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    appTitle: 'ELECTRICAL SAFETY REPORTING',
    appSubtitle: 'Zero-Friction Incident & Hazard Portal',
    hindiToggle: '🇮🇳 हिंदी',
    englishToggle: '🇬🇧 English',
    adminAccess: '🔐 Admin Portal',
    substationDetected: 'Substation QR Detected',

    // Category Selector
    selectReportType: 'Select Report Category',
    selectReportTypeSub: 'Tap any card or use AI Voice Assistant for zero-typing report creation',
    voiceReportCta: '🎙️ REPORT BY VOICE / आवाज़ से रिपोर्ट करें',
    voiceReportSub: 'Step-by-step AI voice interview in English/Hindi',

    toolReportTitle: '🔧 Tool Defect Report',
    toolReportDesc: 'Report damaged, unsafe, or malfunctioning tools (Crimper, Tester, Rods)',
    ppeReportTitle: '🦺 PPE Defect / Lack Report',
    ppeReportDesc: 'Report missing or damaged Personal Protective Equipment',
    nearMissTitle: '⚠️ Near Miss Hazard',
    nearMissDesc: 'Report unsafe condition or event that could have caused injury',
    incidentTitle: '🚨 Electrical Incident',
    incidentDesc: 'Report equipment flashover, trip, cable damage, or minor property damage',
    accidentTitle: '🏥 Injury / Accident',
    accidentDesc: 'Report electrical shock, burn, fall, or physical injury requiring assistance',

    // Form Common
    stepEmployeeInfo: '1. Field Worker ID',
    stepLocationInfo: '2. Location & Substation',
    stepReportDetails: '3. Hazard & Event Details',
    stepEvidenceUpload: '4. ID & Photo Evidence',

    employeeId: 'Employee ID Card / Gate Pass No.',
    employeeName: 'Full Name',
    employeePhone: 'Mobile Number',
    date: 'Date of Incident',
    time: 'Time of Incident',
    division: 'Division / Zone',
    subdivision: 'Sub-Division / Feeder',
    location: 'Substation / Pole / Site Location',
    activity: 'Work Activity Being Performed',
    description: 'Detailed Description of Event',
    severity: 'Severity Level',
    skip: '⏭️ SKIP THIS FIELD',
    submitReport: '✅ SUBMIT REPORT',
    submitting: '⏳ Submitting Report...',

    // Tools & PPE
    selectTool: 'Select Tool Type',
    selectProblem: 'Select Defect / Problem Type',
    selectPpe: 'Select PPE Item',
    selectPpeIssue: 'Select PPE Issue',

    // Incident / Accident specific
    equipmentInvolved: 'Equipment / Line Involved',
    immediateAction: 'Immediate Action Taken On-Site',
    workStopped: 'Was Work Stopped Immediately?',
    witnessDetails: 'Witness Name & Details',
    injuryOccurred: 'Did Any Injury Occur?',
    bodyPart: 'Affected Body Part',
    injuryType: 'Nature of Injury / Burn',
    firstAid: 'First Aid Applied On-Site?',
    hospitalRequired: 'Hospitalization / Doctor Required?',
    potentialHazard: 'What Could Have Happened? (Potential Hazard)',

    // ID & Photos
    uploadIdCard: '📷 Take / Upload ID Card Photo',
    uploadEvidence: '📸 Add Photo Evidence (Up to 5 Photos)',
    retakePhoto: '🔄 Retake',
    addMorePhotos: '➕ Add Photo',

    // Voice Assistant
    voiceAssistantTitle: '🎙️ AI Voice Safety Reporter',
    voiceAssistantSubtitle: 'Speak naturally in Hindi, English, or Hinglish. AI will structure your report.',
    listening: '🔴 Listening... Speak now',
    speaking: '🔊 AI Speaking question...',
    processing: '⚡ Processing response...',
    repeatQuestion: '🔊 Repeat Question',
    skipQuestion: '⏭️ Skip',
    backQuestion: '🔙 Back',
    cancelVoice: '❌ Cancel',
    voiceSummaryTitle: '📋 Voice Report Summary Review',
    confirmSubmit: '✅ Confirm & Submit Report',
    editManual: '✏️ Edit in Form',
    restartVoice: '🔄 Start Voice Interview Again',

    // Admin
    adminLoginTitle: '🔐 Admin / Safety Supervisor Login',
    enterPin: 'Enter 4-Digit Security PIN',
    pinPlaceholder: 'e.g. 8888',
    loginBtn: 'Unlock Dashboard',
    invalidPin: 'Invalid Security PIN! Please try again.',
    totalReports: 'Total Safety Reports',
    nearMissCount: 'Near Miss Hazards',
    incidentCount: 'Incidents / Trips',
    accidentCount: 'Injuries / Accidents',
    ppeToolCount: 'PPE & Tool Defects',
    openStatus: 'Open Action Items',
    closedStatus: 'Resolved & Closed',
    exportReport: '📥 Export PDF Ticket',
    qrGeneratorTitle: '⚡ Generate Substation Safety QR Code',
    substationName: 'Substation / Grid Name',
    generateQr: '🖨️ Generate Printable QR Badge',

    // Statuses
    statusNew: 'NEW',
    statusReview: 'UNDER REVIEW',
    statusActionReq: 'ACTION REQUIRED',
    statusActionTaken: 'ACTION TAKEN',
    statusClosed: 'CLOSED & RESOLVED',
  },
  hi: {
    // Header
    appTitle: 'विद्युत सुरक्षा रिपोर्टिंग प्रणाली',
    appSubtitle: 'फील्ड कर्मचारियों हेतु त्वरित घटना एवं खतरा पोर्टल',
    hindiToggle: '🇮🇳 हिंदी',
    englishToggle: '🇬🇧 English',
    adminAccess: '🔐 एडमिन पोर्टल',
    substationDetected: 'सबस्टेशन क्यूआर पहचाना गया',

    // Category Selector
    selectReportType: 'रिपोर्ट श्रेणी चुनें',
    selectReportTypeSub: 'कार्ड पर टैप करें या AI आवाज़ सहायक का उपयोग करें',
    voiceReportCta: '🎙️ आवाज़ से रिपोर्ट करें (VOICE REPORT)',
    voiceReportSub: 'हिंदी/इंग्लिश में सरल बोलकर AI साक्षात्कार',

    toolReportTitle: '🔧 टूल खराबी रिपोर्ट',
    toolReportDesc: 'टूटे या खराब औज़ार (क्रिमपिंग टूल, वोल्टेज टेस्टर, अर्थ रॉड)',
    ppeReportTitle: '🦺 पीपीई किट खराबी / कमी',
    ppeReportDesc: 'सुरक्षा हेलमेट, दस्ताने, जूते या बेल्ट की खराबी दर्ज करें',
    nearMissTitle: '⚠️ नियर मिस (संभावित खतरा)',
    nearMissDesc: 'ऐसी घटना जो दुर्घटना बनते-बनते बच गई',
    incidentTitle: '🚨 घटना / ट्रिपिंग रिपोर्ट',
    incidentDesc: 'आर्क स्पार्किंग, केबल डैमेज, या उपकरण ट्रिपिंग की जानकारी दें',
    accidentTitle: '🏥 चोट / दुर्घटना रिपोर्ट',
    accidentDesc: 'करंट लगना, जलना, गिरना या शारीरिक चोट की आपात स्थिति',

    // Form Common
    stepEmployeeInfo: '1. कर्मचारी पहचान विवरण',
    stepLocationInfo: '2. स्थान एवं सबस्टेशन',
    stepReportDetails: '3. घटना एवं खतरे का विवरण',
    stepEvidenceUpload: '4. आईडी कार्ड एवं फोटो सबूत',

    employeeId: 'कर्मचारी आईडी / गेट पास नंबर',
    employeeName: 'पूरा नाम',
    employeePhone: 'मोबाइल नंबर',
    date: 'घटना की तिथि',
    time: 'घटना का समय',
    division: 'डिवीजन / ज़ोन',
    subdivision: 'सब-डिवीजन / फीडर',
    location: 'सबस्टेशन / खंभा / कार्य स्थल',
    activity: 'किया जा रहा कार्य',
    description: 'घटना का पूरा विवरण',
    severity: 'गंभीरता का स्तर',
    skip: '⏭️ छोड़ें (SKIP)',
    submitReport: '✅ रिपोर्ट जमा करें',
    submitting: '⏳ रिपोर्ट सबमिट हो रही है...',

    // Tools & PPE
    selectTool: 'टूल का प्रकार चुनें',
    selectProblem: 'खराबी का प्रकार चुनें',
    selectPpe: 'सुरक्षा उपकरण (PPE) चुनें',
    selectPpeIssue: 'समस्या का प्रकार चुनें',

    // Incident / Accident specific
    equipmentInvolved: 'शामिल उपकरण / लाइन',
    immediateAction: 'मौके पर की गई त्वरित कार्रवाई',
    workStopped: 'क्या काम तुरंत रोक दिया गया?',
    witnessDetails: 'गवाह का नाम एवं जानकारी',
    injuryOccurred: 'क्या किसी को चोट लगी?',
    bodyPart: 'प्रभावित शरीर का अंग',
    injuryType: 'चोट / जलने का प्रकार',
    firstAid: 'मौके पर प्राथमिक उपचार (First Aid) दिया गया?',
    hospitalRequired: 'अस्पताल / डॉक्टर की आवश्यकता?',
    potentialHazard: 'क्या बड़ा हादसा हो सकता था?',

    // ID & Photos
    uploadIdCard: '📷 आईडी कार्ड की फोटो खींचें / अपलोड करें',
    uploadEvidence: '📸 फोटो सबूत जोड़ें (अधिकतम 5 फोटो)',
    retakePhoto: '🔄 दोबारा फोटो लें',
    addMorePhotos: '➕ अन्य फोटो जोड़ें',

    // Voice Assistant
    voiceAssistantTitle: '🎙️ AI वॉइस सुरक्षा रिपोर्टर',
    voiceAssistantSubtitle: 'हिंदी या Hinglish में स्वाभाविक रूप से बोलें। AI आपकी रिपोर्ट तैयार करेगा।',
    listening: '🔴 सुन रहा हूँ... अब बोलें',
    speaking: '🔊 AI प्रश्न पूछ रहा है...',
    processing: '⚡ जानकारी समझी जा रही है...',
    repeatQuestion: '🔊 प्रश्न दोहराएं',
    skipQuestion: '⏭️ छोड़ें',
    backQuestion: '🔙 पीछे जाएँ',
    cancelVoice: '❌ रद्द करें',
    voiceSummaryTitle: '📋 वॉइस रिपोर्ट सारांश समीक्षा',
    confirmSubmit: '✅ पुष्टि करें एवं सबमिट करें',
    editManual: '✏️ फॉर्म में सुधार करें',
    restartVoice: '🔄 दोबारा वॉइस इंटरव्यू शुरू करें',

    // Admin
    adminLoginTitle: '🔐 एडमिन / सुरक्षा अधिकारी लॉगिन',
    enterPin: '4-अंकों का सुरक्षा पिन दर्ज करें',
    pinPlaceholder: 'जैसे 8888',
    loginBtn: 'डैशबोर्ड खोलें',
    invalidPin: 'गलत पिन! कृपया पुनः प्रयास करें।',
    totalReports: 'कुल सुरक्षा रिपोर्ट',
    nearMissCount: 'नियर मिस खतरे',
    incidentCount: 'घटनाएं / ट्रिपिंग',
    accidentCount: 'चोट / दुर्घटनाएं',
    ppeToolCount: 'पीपीई एवं टूल खराबी',
    openStatus: 'लंबित कार्रवाइयां',
    closedStatus: 'हल किए गए मामले',
    exportReport: '📥 पीडीएफ रसीद डाउनलोड करें',
    qrGeneratorTitle: '⚡ सबस्टेशन क्यूआर कोड बनाएं',
    substationName: 'सबस्टेशन का नाम',
    generateQr: '🖨️ प्रिंट योग्य क्यूआर पोस्टर बनाएं',

    // Statuses
    statusNew: 'नया (NEW)',
    statusReview: 'समीक्षाधीन',
    statusActionReq: 'कार्रवाई आवश्यक',
    statusActionTaken: 'कार्रवाई की गई',
    statusClosed: 'बंद व हल किया गया',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi'); // Default Hindi for Indian electrical field workers

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
