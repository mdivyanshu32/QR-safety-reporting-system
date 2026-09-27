import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import type { ReportSubmissionPayload } from '../../types/safety';
import { Mic, MicOff, Volume2, SkipForward, RotateCcw, X, Sparkles, Send, Edit3, ArrowLeft, Check, AlertCircle, Info } from 'lucide-react';

interface VoiceAssistantProps {
  initialLocation?: string;
  initialDivision?: string;
  onSubmit: (payload: ReportSubmissionPayload) => Promise<void>;
  onCancel: () => void;
  onEditInForm: (partialData: Partial<ReportSubmissionPayload>) => void;
}

interface QuestionStep {
  id: string;
  questionEn: string;
  questionHi: string;
  suggestionsEn: string[];
  suggestionsHi: string[];
  fieldKey: keyof ReportSubmissionPayload;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  initialLocation = '',
  initialDivision = 'South Delhi',
  onSubmit,
  onCancel,
  onEditInForm,
}) => {
  const { language, t } = useLanguage();

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [completedInterview, setCompletedInterview] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const [collectedData, setCollectedData] = useState<ReportSubmissionPayload>({
    type: 'NEAR_MISS',
    employeeId: 'EMP-VOICE',
    employeeName: '',
    location: initialLocation || 'Field Substation',
    division: initialDivision || 'South Delhi',
    description: '',
    injured: false,
    bodyPart: '',
    immediateAction: '',
    severity: 'HIGH',
    rawVoiceTranscript: '',
    structuredVoiceJson: '',
  });

  const recognitionRef = useRef<any>(null);

  const questions: QuestionStep[] = [
    {
      id: 'worker',
      questionEn: 'Please speak your Employee ID and Name.',
      questionHi: 'कृपया अपना एम्प्लॉई आईडी और नाम बोलें।',
      suggestionsEn: ['Divyanshu Sharma (EMP-9081)', 'Rajesh Kumar (EMP-4420)', 'Amit Singh (EMP-1102)'],
      suggestionsHi: ['दिव्यांशू शर्मा (EMP-9081)', 'राजेश कुमार (EMP-4420)', 'अमित सिंह (EMP-1102)'],
      fieldKey: 'employeeName',
    },
    {
      id: 'location',
      questionEn: 'Which substation or site location are you currently working at?',
      questionHi: 'आप किस सबस्टेशन या लोकेशन पर कार्य कर रहे हैं?',
      suggestionsEn: ['Okhla 220kV Grid Substation', 'Janakpuri 66kV Substation', 'Mayur Vihar 33kV Yard'],
      suggestionsHi: ['ओखला 220kV ग्रिड सबस्टेशन', 'जनकपुरी 66kV सबस्टेशन', 'मयूर विहार 33kV यार्ड'],
      fieldKey: 'location',
    },
    {
      id: 'hazard',
      questionEn: 'Please describe what safety hazard, incident, or tool defect occurred.',
      questionHi: 'कृपया बताएं कि क्या सुरक्षा खतरा, औजार की खराबी या घटना हुई?',
      suggestionsEn: [
        'Insulation on 11kV discharge rod cracked',
        'Dielectric gloves damaged during pole work',
        'Transformer oil leak & sparking noticed',
        'Near miss: Fallen HT cable conductor'
      ],
      suggestionsHi: [
        '11kV डिस्चार्ज रॉड की इंसुलेशन कटी हुई है',
        'पोल पर काम करते समय दस्ताने कटे पाए गए',
        'ट्रांसफॉर्मर ऑयल लीक और स्पार्किंग देखी गई',
        'टूटा हुआ HT तार जमीन पर गिरा (नियर मिस)'
      ],
      fieldKey: 'description',
    },
    {
      id: 'injuryCheck',
      questionEn: 'Did any injury or electrical shock occur? Answer Yes or No.',
      questionHi: 'क्या किसी को करंट या चोट लगी? हाँ या नहीं में बताएं।',
      suggestionsEn: ['No injury occurred (सुरक्षित)', 'Yes, minor shock / injury occurred'],
      suggestionsHi: ['नहीं, कोई चोट नहीं लगी (सुरक्षित)', 'हाँ, हल्का झटका / चोट लगी'],
      fieldKey: 'injured',
    },
    {
      id: 'injuryDetail',
      questionEn: 'Which body part was hurt and what immediate first aid action was taken?',
      questionHi: 'शरीर के किस अंग में चोट लगी और मौके पर क्या प्राथमिक उपचार किया गया?',
      suggestionsEn: [
        'Minor burn on right hand palm; applied burn cream & bandaged',
        'Left wrist strain; applied ice pack & rested'
      ],
      suggestionsHi: [
        'दाहिने हाथ की हथेली पर हल्का बर्न; बर्न क्रीम लगाकर पट्टी बांधी',
        'बाएं हाथ में मोच; बर्फ से सेकाई की और विश्राम दिया'
      ],
      fieldKey: 'immediateAction',
    },
  ];

  const currentQuestion = questions[currentStepIndex];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setMicError('Web Speech API is not supported in this browser mode. You can tap quick suggestions or type below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        setTypedInput(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicError('Microphone access was denied or blocked by browser security policy. Please allow microphone permissions or use direct tap buttons.');
        } else if (event.error === 'no-speech') {
          setMicError('No speech detected. Tap microphone and speak clearly.');
        } else {
          setMicError(`Voice Recognition Error: ${event.error}. You can use tap buttons below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e: any) {
      setSpeechSupported(false);
      setMicError('Speech initialization failed. Using voice simulation mode.');
    }
  }, [language]);

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Note: Do NOT auto-call startListening() here to avoid browser gesture security blocks
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!completedInterview && currentQuestion) {
      const qText = language === 'hi' ? currentQuestion.questionHi : currentQuestion.questionEn;
      speakQuestion(qText);
    }
  }, [currentStepIndex, completedInterview]);

  const startListening = () => {
    setMicError(null);
    if (!speechSupported || !recognitionRef.current) {
      setMicError('Microphone input is restricted in your current browser session. Tap any quick answer chip below!');
      return;
    }

    try {
      setTranscript('');
      setTypedInput('');
      recognitionRef.current.start();
    } catch (err: any) {
      console.warn('Failed to start recognition:', err);
      // Restart if already running
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          try { recognitionRef.current.start(); } catch (e) {}
        }, 200);
      } catch (e) {}
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
    setIsListening(false);
  };

  const processCurrentAnswer = (answerText: string) => {
    if (!answerText || !answerText.trim()) return;

    setIsProcessing(true);
    const text = answerText.trim();
    const newRaw = (collectedData.rawVoiceTranscript || '') + `\nQ${currentStepIndex + 1}: ` + text;
    const updated = { ...collectedData, rawVoiceTranscript: newRaw };

    if (currentQuestion.id === 'worker') {
      updated.employeeName = text;
      const idMatch = text.match(/EMP-?\d+/i);
      if (idMatch) updated.employeeId = idMatch[0].toUpperCase();
    } else if (currentQuestion.id === 'location') {
      updated.location = text;
    } else if (currentQuestion.id === 'hazard') {
      updated.description = text;
      if (text.toLowerCase().includes('tool') || text.toLowerCase().includes('औजार') || text.toLowerCase().includes('rod') || text.toLowerCase().includes('ladder')) {
        updated.type = 'TOOL';
      } else if (text.toLowerCase().includes('glove') || text.toLowerCase().includes('helmet') || text.toLowerCase().includes('पीपीई')) {
        updated.type = 'PPE';
      } else if (text.toLowerCase().includes('shock') || text.toLowerCase().includes('burn') || text.toLowerCase().includes('चोट')) {
        updated.type = 'ACCIDENT';
      } else {
        updated.type = 'NEAR_MISS';
      }
    } else if (currentQuestion.id === 'injuryCheck') {
      const lower = text.toLowerCase();
      const isYes = lower.includes('yes') || lower.includes('हाँ') || lower.includes('haan') || lower.includes('injury') || lower.includes('shock') || lower.includes('हल्का');
      updated.injured = isYes;

      if (!isYes) {
        updated.structuredVoiceJson = JSON.stringify(updated);
        setCollectedData(updated);
        setIsProcessing(false);
        setCompletedInterview(true);
        return;
      }
    } else if (currentQuestion.id === 'injuryDetail') {
      updated.immediateAction = text;
      updated.type = 'ACCIDENT';
      updated.injuryOccurred = true;
    }

    updated.structuredVoiceJson = JSON.stringify(updated);
    setCollectedData(updated);
    setIsProcessing(false);
    setTranscript('');
    setTypedInput('');

    if (currentStepIndex < questions.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCompletedInterview(true);
    }
  };

  const handleSelectSuggestion = (chipText: string) => {
    stopListening();
    setTypedInput(chipText);
    processCurrentAnswer(chipText);
  };

  const handleNextStep = () => {
    stopListening();
    processCurrentAnswer(typedInput || transcript);
  };

  const handleSkip = () => {
    stopListening();
    if (currentStepIndex < questions.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCompletedInterview(true);
    }
  };

  const handleBack = () => {
    stopListening();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleRepeat = () => {
    if (currentQuestion) {
      const qText = language === 'hi' ? currentQuestion.questionHi : currentQuestion.questionEn;
      speakQuestion(qText);
    }
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(collectedData);
    } finally {
      setSubmitting(false);
    }
  };

  if (completedInterview) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {t('voiceSummaryTitle')}
              </h2>
              <p className="text-xs text-emerald-400 font-semibold">
                AI structured voice transcript extracted successfully
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-semibold">Report Category:</span>
              <span className="font-extrabold text-amber-400">{collectedData.type}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-semibold">Worker / ID:</span>
              <span className="font-bold text-white">{collectedData.employeeName || 'Field Lineman'} ({collectedData.employeeId})</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between">
              <span className="text-slate-400 font-semibold">Location:</span>
              <span className="font-bold text-white">{collectedData.location} ({collectedData.division})</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">Spoken Event Description:</span>
              <p className="text-slate-200 text-xs italic bg-slate-900 p-2.5 rounded border border-slate-800">
                "{collectedData.description || 'Hazard reported via voice interview'}"
              </p>
            </div>

            {collectedData.injured && (
              <div className="bg-rose-950/60 p-3 rounded-lg border border-rose-500/40 text-rose-200 text-xs">
                ⚠️ <strong>Injury Reported:</strong> {collectedData.immediateAction}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleConfirmSubmit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-base py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{submitting ? t('submitting') : t('confirmSubmit')}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onEditInForm(collectedData)}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>{t('editManual')}</span>
              </button>

              <button
                onClick={() => {
                  setCompletedInterview(false);
                  setCurrentStepIndex(0);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('restartVoice')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const suggestions = language === 'hi' ? currentQuestion.suggestionsHi : currentQuestion.suggestionsEn;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>{t('voiceAssistantTitle')}</span>
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
            <span>Question {currentStepIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentStepIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300" 
              style={{ width: `${((currentStepIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Box */}
        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-center space-y-3 shadow-inner">
          <span className="text-[11px] font-extrabold text-amber-400 tracking-widest uppercase bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 inline-block">
            {language === 'hi' ? 'AI सुरक्षा साक्षात्कार (TAP TO SPEAK)' : 'AI SAFETY INTERVIEW (TAP TO SPEAK)'}
          </span>

          <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
            {language === 'hi' ? currentQuestion.questionHi : currentQuestion.questionEn}
          </h3>

          <div className="flex items-center justify-center gap-2 pt-1">
            {isSpeaking && (
              <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
                {t('speaking')}
              </span>
            )}
            {isListening && (
              <span className="bg-rose-500/20 text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                {t('listening')} (Recording active...)
              </span>
            )}
            {isProcessing && (
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                {t('processing')}
              </span>
            )}
          </div>
        </div>

        {/* Mic Banner & Controls */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-slate-950 shadow-2xl transition-all active:scale-95 ${
              isListening
                ? 'bg-rose-500 shadow-rose-500/60 ring-8 ring-rose-500/30 scale-105 animate-pulse'
                : 'bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 hover:scale-105 shadow-amber-500/40 ring-4 ring-amber-500/20'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-10 h-10 stroke-[2.5]" />
                <span className="text-[10px] font-black text-slate-950 mt-1 uppercase">STOP</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 stroke-[2.5]" />
                <span className="text-[10px] font-black text-slate-950 mt-1 uppercase">TAP TO SPEAK</span>
              </>
            )}
          </button>
          <p className="text-xs text-amber-300/90 font-semibold text-center">
            {isListening ? '🎙️ Listening... Speak clearly into your microphone now' : '👆 Tap the Mic icon above to start voice recording'}
          </p>

          {micError && (
            <div className="bg-amber-950/70 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5 max-w-md w-full">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300">Voice Note / Permission Info:</p>
                <p>{micError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Voice Answer Suggestion Chips (Guarantees usability if mic blocked) */}
        <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? 'त्वरित उत्तर चुनें (Quick Tap Answer):' : 'Tap Quick Spoken Answer:'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(sug)}
                className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 transition-all text-left"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Input Field */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Or type answer directly here..."
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none shadow-inner"
          />
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={handleRepeat}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px]">{t('repeatQuestion')}</span>
          </button>

          <button
            type="button"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">{t('backQuestion')}</span>
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <SkipForward className="w-4 h-4 text-amber-400" />
            <span className="text-[10px]">{t('skipQuestion')}</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            disabled={!typedInput.trim() && !transcript.trim()}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-xs flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-40 shadow"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span className="text-[10px]">NEXT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
