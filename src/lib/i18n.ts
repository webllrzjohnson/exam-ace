import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const RTL_LOCALES = ["ar", "ur"] as const;
export type RtlLocale = (typeof RTL_LOCALES)[number];

export const SUPPORTED_LOCALES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "ur", name: "اردو", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
] as const;

export const DEFAULT_LOCALE = "en";
export const FALLBACK_LOCALE = "fr";

const resources: Record<string, { translation: Record<string, unknown> }> = {
  en: {
    translation: {
      nav: {
        home: "Home",
        quizCatalog: "Quiz Catalog",
        flashcards: "Flashcards",
        simulation: "Simulation",
        leaderboard: "Leaderboard",
        dashboard: "Dashboard",
        admin: "Admin",
        upgrade: "Upgrade",
        register: "Register",
        login: "Login",
        signOut: "Sign out",
      },
      footer: {
        copyright: "© 2026 Canadian Citizenship Test Prep. Practice smarter, pass with confidence. 🍁",
      },
      home: {
        badge: "#1 Canadian Citizenship Test Prep",
        title: "Pass Your Canadian Citizenship Test with Confidence",
        subtitle: "Practice with real exam-style questions, get instant feedback, and track your progress. Join thousands who passed on their first try.",
        startPracticing: "Start Practicing",
        browseQuizzes: "Browse All Quizzes",
        upgrade: "Upgrade",
        quizCategories: "Quiz Categories",
        categoriesDesc: "Choose a category to start practicing. Each area covers key topics from the official citizenship test.",
        quizzes: "quizzes",
        readyTitle: "Ready to Become a Canadian Citizen?",
        readySubtitle: "Start your free practice today and join thousands of successful test-takers.",
        startNow: "Start Practicing Now",
      },
      common: {
        upgrade: "Upgrade",
        viewAll: "View all",
      },
    },
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        quizCatalog: "Catalogue de quiz",
        flashcards: "Cartes mémoire",
        simulation: "Simulation",
        leaderboard: "Classement",
        dashboard: "Tableau de bord",
        admin: "Admin",
        upgrade: "Mettre à niveau",
        register: "S'inscrire",
        login: "Connexion",
        signOut: "Déconnexion",
      },
      footer: {
        copyright: "© 2026 Préparation au test de citoyenneté canadienne. Pratiquez intelligemment, réussissez avec confiance. 🍁",
      },
      home: {
        badge: "#1 Préparation au test de citoyenneté canadienne",
        title: "Réussissez votre test de citoyenneté canadienne en toute confiance",
        subtitle: "Pratiquez avec des questions de style examen réel, obtenez des retours instantanés et suivez vos progrès. Rejoignez des milliers de personnes qui ont réussi du premier coup.",
        startPracticing: "Commencer à pratiquer",
        browseQuizzes: "Parcourir tous les quiz",
        upgrade: "Mettre à niveau",
        quizCategories: "Catégories de quiz",
        categoriesDesc: "Choisissez une catégorie pour commencer. Chaque domaine couvre les sujets clés du test de citoyenneté officiel.",
        quizzes: "quiz",
        readyTitle: "Prêt à devenir citoyen canadien ?",
        readySubtitle: "Commencez votre pratique gratuite aujourd'hui et rejoignez des milliers de candidats réussis.",
        startNow: "Commencer maintenant",
      },
      common: {
        upgrade: "Mettre à niveau",
        viewAll: "Voir tout",
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        quizCatalog: "Catálogo de quiz",
        flashcards: "Tarjetas",
        simulation: "Simulación",
        leaderboard: "Clasificación",
        dashboard: "Panel",
        admin: "Admin",
        upgrade: "Actualizar",
        register: "Registrarse",
        login: "Iniciar sesión",
        signOut: "Cerrar sesión",
      },
      footer: {
        copyright: "© 2026 Preparación para el examen de ciudadanía canadiense. Practica con inteligencia, aprueba con confianza. 🍁",
      },
      home: {
        badge: "#1 Preparación para el examen de ciudadanía canadiense",
        title: "Aprueba tu examen de ciudadanía canadiense con confianza",
        subtitle: "Practica con preguntas de estilo examen real, obtén retroalimentación instantánea y sigue tu progreso. Únete a miles que aprobaron en su primer intento.",
        startPracticing: "Empezar a practicar",
        browseQuizzes: "Ver todos los quiz",
        upgrade: "Actualizar",
        quizCategories: "Categorías de quiz",
        categoriesDesc: "Elige una categoría para empezar. Cada área cubre temas clave del examen oficial de ciudadanía.",
        quizzes: "quiz",
        readyTitle: "¿Listo para ser ciudadano canadiense?",
        readySubtitle: "Comienza tu práctica gratuita hoy y únete a miles de candidatos exitosos.",
        startNow: "Empezar ahora",
      },
      common: {
        upgrade: "Actualizar",
        viewAll: "Ver todo",
      },
    },
  },
  pa: {
    translation: {
      nav: {
        home: "ਘਰ",
        quizCatalog: "ਕੁਇਜ਼ ਕੈਟਾਲਾਗ",
        flashcards: "ਫਲੈਸ਼ਕਾਰਡ",
        simulation: "ਸਿਮੂਲੇਸ਼ਨ",
        leaderboard: "ਲੀਡਰਬੋਰਡ",
        dashboard: "ਡੈਸ਼ਬੋਰਡ",
        admin: "ਐਡਮਿਨ",
        upgrade: "ਅੱਪਗ੍ਰੇਡ",
        register: "ਰਜਿਸਟਰ",
        login: "ਲਾਗਇਨ",
        signOut: "ਸਾਇਨ ਆਟ",
      },
      footer: {
        copyright: "© 2026 ਕੈਨੇਡੀਅਨ ਸਿਟੀਜ਼ਨਸ਼ਿਪ ਟੈਸਟ ਪ੍ਰੈਪ। ਸਮਝਦਾਰੀ ਨਾਲ ਅਭਿਆਸ ਕਰੋ, ਆਤਮਵਿਸ਼ਵਾਸ ਨਾਲ ਪਾਸ ਕਰੋ। 🍁",
      },
      home: {
        badge: "#1 ਕੈਨੇਡੀਅਨ ਸਿਟੀਜ਼ਨਸ਼ਿਪ ਟੈਸਟ ਪ੍ਰੈਪ",
        title: "ਆਪਣੀ ਕੈਨੇਡੀਅਨ ਸਿਟੀਜ਼ਨਸ਼ਿਪ ਟੈਸਟ ਨੂੰ ਆਤਮਵਿਸ਼ਵਾਸ ਨਾਲ ਪਾਸ ਕਰੋ",
        subtitle: "ਅਸਲ ਇਮਤਿਹਾਨ ਸ਼ੈਲੀ ਦੇ ਸਵਾਲਾਂ ਨਾਲ ਅਭਿਆਸ ਕਰੋ, ਤੁਰੰਤ ਫੀਡਬੈਕ ਲਓ ਅਤੇ ਆਪਣੀ ਤਰੱਕੀ ਨੂੰ ਟਰੈਕ ਕਰੋ। ਹਜ਼ਾਰਾਂ ਨਾਲ ਜੁੜੋ ਜਿਨ੍ਹਾਂ ਨੇ ਪਹਿਲੀ ਕੋਸ਼ਿਸ਼ ਵਿੱਚ ਪਾਸ ਕੀਤਾ।",
        startPracticing: "ਅਭਿਆਸ ਸ਼ੁਰੂ ਕਰੋ",
        browseQuizzes: "ਸਾਰੇ ਕੁਇਜ਼ ਦੇਖੋ",
        upgrade: "ਅੱਪਗ੍ਰੇਡ",
        quizCategories: "ਕੁਇਜ਼ ਕੈਟਾਗਰੀਆਂ",
        categoriesDesc: "ਸ਼ੁਰੂਆਤ ਕਰਨ ਲਈ ਇੱਕ ਕੈਟਾਗਰੀ ਚੁਣੋ। ਹਰ ਖੇਤਰ ਅਧਿਕਾਰਤ ਨਾਗਰਿਕਤਾ ਟੈਸਟ ਦੇ ਮੁੱਖ ਵਿਸ਼ਿਆਂ ਨੂੰ ਕਵਰ ਕਰਦਾ ਹੈ।",
        quizzes: "ਕੁਇਜ਼",
        readyTitle: "ਕੈਨੇਡੀਅਨ ਨਾਗਰਿਕ ਬਣਨ ਲਈ ਤਿਆਰ?",
        readySubtitle: "ਆਪਣੀ ਮੁਫਟ ਅਭਿਆਸ ਅੱਜ ਸ਼ੁਰੂ ਕਰੋ ਅਤੇ ਹਜ਼ਾਰਾਂ ਸਫਲ ਟੈਸਟ ਪ੍ਰਾਪਤ ਕਰਨ ਵਾਲਿਆਂ ਨਾਲ ਜੁੜੋ।",
        startNow: "ਹੁਣੇ ਅਭਿਆਸ ਸ਼ੁਰੂ ਕਰੋ",
      },
      common: {
        upgrade: "ਅੱਪਗ੍ਰੇਡ",
        viewAll: "ਸਭ ਦੇਖੋ",
      },
    },
  },
  zh: {
    translation: {
      nav: {
        home: "首页",
        quizCatalog: "测验目录",
        flashcards: "闪卡",
        simulation: "模拟",
        leaderboard: "排行榜",
        dashboard: "仪表板",
        admin: "管理",
        upgrade: "升级",
        register: "注册",
        login: "登录",
        signOut: "退出",
      },
      footer: {
        copyright: "© 2026 加拿大公民考试准备。聪明练习，自信通过。🍁",
      },
      home: {
        badge: "#1 加拿大公民考试准备",
        title: "自信通过加拿大公民考试",
        subtitle: "使用真实考试风格练习，获得即时反馈并跟踪进度。加入数千名首次通过者。",
        startPracticing: "开始练习",
        browseQuizzes: "浏览所有测验",
        upgrade: "升级",
        quizCategories: "测验类别",
        categoriesDesc: "选择类别开始练习。每个领域涵盖官方公民考试的关键主题。",
        quizzes: "测验",
        readyTitle: "准备好成为加拿大公民了吗？",
        readySubtitle: "今天开始免费练习，加入数千名成功的应试者。",
        startNow: "立即开始练习",
      },
      common: {
        upgrade: "升级",
        viewAll: "查看全部",
      },
    },
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        quizCatalog: "كتالوج الاختبارات",
        flashcards: "البطاقات",
        simulation: "المحاكاة",
        leaderboard: "لوحة المتصدرين",
        dashboard: "لوحة التحكم",
        admin: "المسؤول",
        upgrade: "ترقية",
        register: "التسجيل",
        login: "تسجيل الدخول",
        signOut: "تسجيل الخروج",
      },
      footer: {
        copyright: "© 2026 التحضير لاختبار الجنسية الكندية. تدرب بذكاء، اجتز بثقة. 🍁",
      },
      home: {
        badge: "#1 التحضير لاختبار الجنسية الكندية",
        title: "اجتز اختبار الجنسية الكندية بثقة",
        subtitle: "تدرب على أسئلة بنمط الامتحان الحقيقي، واحصل على ملاحظات فورية وتتبع تقدمك. انضم إلى آلاف الذين اجتازوا من المحاولة الأولى.",
        startPracticing: "ابدأ التدريب",
        browseQuizzes: "تصفح جميع الاختبارات",
        upgrade: "ترقية",
        quizCategories: "فئات الاختبارات",
        categoriesDesc: "اختر فئة للبدء. كل مجال يغطي مواضيع رئيسية من اختبار الجنسية الرسمي.",
        quizzes: "اختبارات",
        readyTitle: "مستعد لتصبح مواطناً كندياً؟",
        readySubtitle: "ابدأ تدريبك المجاني اليوم وانضم إلى آلاف الناجحين.",
        startNow: "ابدأ التدريب الآن",
      },
      common: {
        upgrade: "ترقية",
        viewAll: "عرض الكل",
      },
    },
  },
  hi: {
    translation: {
      nav: {
        home: "होम",
        quizCatalog: "क्विज़ कैटलॉग",
        flashcards: "फ्लैशकार्ड",
        simulation: "सिमुलेशन",
        leaderboard: "लीडरबोर्ड",
        dashboard: "डैशबोर्ड",
        admin: "एडमिन",
        upgrade: "अपग्रेड",
        register: "रजिस्टर",
        login: "लॉगिन",
        signOut: "साइन आउट",
      },
      footer: {
        copyright: "© 2026 कनाडाई नागरिकता परीक्षा तैयारी। समझदारी से अभ्यास करें, आत्मविश्वास के साथ पास करें। 🍁",
      },
      home: {
        badge: "#1 कनाडाई नागरिकता परीक्षा तैयारी",
        title: "अपनी कनाडाई नागरिकता परीक्षा को आत्मविश्वास के साथ पास करें",
        subtitle: "वास्तविक परीक्षा शैली के प्रश्नों के साथ अभ्यास करें, तुरंत फीडबैक प्राप्त करें और अपनी प्रगति ट्रैक करें। हजारों के साथ जुड़ें जिन्होंने पहली कोशिश में पास किया।",
        startPracticing: "अभ्यास शुरू करें",
        browseQuizzes: "सभी क्विज़ देखें",
        upgrade: "अपग्रेड",
        quizCategories: "क्विज़ श्रेणियां",
        categoriesDesc: "शुरू करने के लिए एक श्रेणी चुनें। प्रत्येक क्षेत्र आधिकारिक नागरिकता परीक्षा के मुख्य विषयों को कवर करता है।",
        quizzes: "क्विज़",
        readyTitle: "कनाडाई नागरिक बनने के लिए तैयार?",
        readySubtitle: "आज ही अपना मुफ्त अभ्यास शुरू करें और हजारों सफल परीक्षार्थियों के साथ जुड़ें।",
        startNow: "अभी अभ्यास शुरू करें",
      },
      common: {
        upgrade: "अपग्रेड",
        viewAll: "सभी देखें",
      },
    },
  },
  ur: {
    translation: {
      nav: {
        home: "ہوم",
        quizCatalog: "کوئز کیٹلاگ",
        flashcards: "فلیش کارڈز",
        simulation: "سیمولیشن",
        leaderboard: "لیڈر بورڈ",
        dashboard: "ڈیش بورڈ",
        admin: "ایڈمن",
        upgrade: "اپ گریڈ",
        register: "رجسٹر",
        login: "لاگ ان",
        signOut: "سائن آؤٹ",
      },
      footer: {
        copyright: "© 2026 کینیڈین شہریت ٹیسٹ کی تیاری۔ سمجھداری سے مشق کریں، اعتماد کے ساتھ پاس کریں۔ 🍁",
      },
      home: {
        badge: "#1 کینیڈین شہریت ٹیسٹ کی تیاری",
        title: "اپنی کینیڈین شہریت ٹیسٹ کو اعتماد کے ساتھ پاس کریں",
        subtitle: "حقیقی امتحان کی طرز کے سوالات کے ساتھ مشق کریں، فوری فیڈ بیک حاصل کریں اور اپنی پیشرفت کا ٹریک رکھیں۔ ہزاروں کے ساتھ شامل ہوں جنہوں نے پہلی کوشش میں پاس کیا۔",
        startPracticing: "مشق شروع کریں",
        browseQuizzes: "تمام کوئز دیکھیں",
        upgrade: "اپ گریڈ",
        quizCategories: "کوئز زمرے",
        categoriesDesc: "شروع کرنے کے لیے ایک زمرہ منتخب کریں۔ ہر علاقہ سرکاری شہریت ٹیسٹ کے اہم موضوعات کا احاطہ کرتا ہے۔",
        quizzes: "کوئز",
        readyTitle: "کینیڈین شہری بننے کے لیے تیار؟",
        readySubtitle: "آج ہی اپنی مفت مشق شروع کریں اور ہزاروں کامیاب امتحان دینے والوں کے ساتھ شامل ہوں۔",
        startNow: "ابھی مشق شروع کریں",
      },
      common: {
        upgrade: "اپ گریڈ",
        viewAll: "سب دیکھیں",
      },
    },
  },
  ta: {
    translation: {
      nav: {
        home: "முகப்பு",
        quizCatalog: "வினாடி வினா பட்டியல்",
        flashcards: "ஃபிளாஷ் கார்டுகள்",
        simulation: "சிமுலேஷன்",
        leaderboard: "முன்னிலை பட்டியல்",
        dashboard: "டாஷ்போர்டு",
        admin: "நிர்வாகம்",
        upgrade: "மேம்படுத்து",
        register: "பதிவு",
        login: "உள்நுழை",
        signOut: "வெளியேறு",
      },
      footer: {
        copyright: "© 2026 கனேடிய குடியுரிமை தேர்வு தயாரிப்பு. புத்திசாலித்தனமாக பயிற்சி செய்யுங்கள், நம்பிக்கையுடன் தேர்ச்சி பெறுங்கள். 🍁",
      },
      home: {
        badge: "#1 கனேடிய குடியுரிமை தேர்வு தயாரிப்பு",
        title: "உங்கள் கனேடிய குடியுரிமை தேர்வை நம்பிக்கையுடன் தேர்ச்சி பெறுங்கள்",
        subtitle: "உண்மையான தேர்வு பாணி கேள்விகளுடன் பயிற்சி செய்யுங்கள், உடனடி கருத்து பெறுங்கள் மற்றும் உங்கள் முன்னேற்றத்தை கண்காணிக்கவும். முதல் முயற்சியில் தேர்ச்சி பெற்ற ஆயிரக்கணக்கானோருடன் இணையுங்கள்.",
        startPracticing: "பயிற்சி தொடங்கு",
        browseQuizzes: "அனைத்து வினாடி வினாக்களையும் பாருங்கள்",
        upgrade: "மேம்படுத்து",
        quizCategories: "வினாடி வினா பிரிவுகள்",
        categoriesDesc: "தொடங்க ஒரு பிரிவைத் தேர்ந்தெடுக்கவும். ஒவ்வொரு பகுதியும் அதிகாரப்பூர்வ குடியுரிமை தேர்வின் முக்கிய தலைப்புகளை உள்ளடக்கியது.",
        quizzes: "வினாடி வினாக்கள்",
        readyTitle: "கனேடிய குடிமகனாக மாற தயாரா?",
        readySubtitle: "இன்றே உங்கள் இலவச பயிற்சியைத் தொடங்குங்கள் மற்றும் ஆயிரக்கணக்கான வெற்றிகரமான தேர்வர்களுடன் இணையுங்கள்.",
        startNow: "இப்போது பயிற்சி தொடங்கு",
      },
      common: {
        upgrade: "மேம்படுத்து",
        viewAll: "அனைத்தையும் பார்க்க",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: [FALLBACK_LOCALE, DEFAULT_LOCALE],
    supportedLngs: SUPPORTED_LOCALES.map((l) => l.code),
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
