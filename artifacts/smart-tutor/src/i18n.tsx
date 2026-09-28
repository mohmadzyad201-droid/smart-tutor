import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type LanguageCode =
  | 'ar'
  | 'en'
  | 'fr'
  | 'es'
  | 'de'
  | 'tr'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'he'
  | 'pt'
  | 'it';

export type LanguageOption = {
  code: LanguageCode;
  locale: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  nativeName: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'ar', locale: 'ar-SA', dir: 'rtl', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'en', locale: 'en-US', dir: 'ltr', flag: '🇺🇸', nativeName: 'English' },
  { code: 'fr', locale: 'fr-FR', dir: 'ltr', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'es', locale: 'es-ES', dir: 'ltr', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'de', locale: 'de-DE', dir: 'ltr', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'tr', locale: 'tr-TR', dir: 'ltr', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'ru', locale: 'ru-RU', dir: 'ltr', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'zh', locale: 'zh-CN', dir: 'ltr', flag: '🇨🇳', nativeName: '简体中文' },
  { code: 'ja', locale: 'ja-JP', dir: 'ltr', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', locale: 'ko-KR', dir: 'ltr', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'he', locale: 'he-IL', dir: 'rtl', flag: '🇮🇱', nativeName: 'עברית' },
  { code: 'pt', locale: 'pt-BR', dir: 'ltr', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'it', locale: 'it-IT', dir: 'ltr', flag: '🇮🇹', nativeName: 'Italiano' },
];

type Messages = {
  brand: string;
  homeSignIn: string;
  homeEyebrow: string;
  homeTitle: string;
  homeDescription: string;
  grade11Label: string;
  grade12Label: string;
  startGrade: string;
  quietSpace: string;
  portalTitle: string;
  portalSubtitle: string;
  portalEyebrow: string;
  portalHeading: string;
  portalDescription: string;
  openGrade: string;
  startNow: string;
  settings: string;
  settingsTitle: string;
  settingsSubtitle: string;
  settingsLanguageTitle: string;
  settingsLanguageDescription: string;
  languageSaved: string;
  language: string;
  back: string;
  signIn: string;
  signUp: string;
  signInSubtitle: string;
  signUpSubtitle: string;
  remember: string;
  rememberNote: string;
  logout: string;
  greeting: string;
  greetingDefault: string;
  chatTitle: string;
  chatSubtitle: string;
  chatAssistant: string;
  available: string;
  backToPortal: string;
  emptyTitle: string;
  emptyDescription: string;
  chatPlaceholder: string;
  attach: string;
  send: string;
  attachmentFormats: string;
  removeAttachment: string;
  fileType: string;
  loading: string;
  notFoundTitle: string;
  notFoundDescription: string;
  aiThinking: string;
  aiError: string;
  aiNeedQuestion: string;
};

const dictionaries: Record<LanguageCode, Messages> = {
  ar: {
    brand: 'المعلم الذكي', homeSignIn: 'تسجيل الدخول', homeEyebrow: 'رفيقك في رحلة التفوق',
    homeTitle: 'تعلم بذكاء، وتقدم بثقة', homeDescription: 'معلّمك الذكي متاح ليساعدك على فهم الدروس، مراجعة المفاهيم، والاستعداد لاختبارات المرحلة الثانوية.',
    grade11Label: 'الصف الحادي عشر العلمي', grade12Label: 'الصف الثاني عشر العلمي', startGrade: 'ابدأ محادثة مخصصة لصفك', quietSpace: 'مساحة هادئة لفهم أصعب الدروس',
    portalTitle: 'بوابتك التعليمية', portalSubtitle: 'اختر صفك وابدأ جلسة تعلم جديدة', portalEyebrow: 'مساحتك الخاصة', portalHeading: 'من أين نبدأ اليوم؟',
    portalDescription: 'اسأل عن أي درس، أرفق مسألتك، ودع المعلّم الذكي يرتب لك الطريق.', openGrade: 'افتح محادثة خاصة بمنهجك', startNow: 'ابدأ الآن',
    settings: 'الإعدادات', settingsTitle: 'إعدادات التطبيق', settingsSubtitle: 'خصّص تجربتك التعليمية كما تحب', settingsLanguageTitle: 'اللغة',
    settingsLanguageDescription: 'اختر لغة الواجهة. سيتغير اتجاه التطبيق تلقائياً عند الحاجة.', languageSaved: 'تم حفظ اللغة على هذا الجهاز', language: 'اللغة', back: 'رجوع',
    signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب جديد', signInSubtitle: 'سجّل الدخول إلى مساحتك التعليمية', signUpSubtitle: 'أنشئ حسابك وابدأ رحلة تعلمك',
    remember: 'تذكرني على هذا الجهاز', rememberNote: 'تفضيل التذكر يحفظ اختيارك فقط. بيانات الدخول والجلسة الآمنة يديرها Clerk.',
    logout: 'خروج', greeting: 'مرحباً، {{name}}', greetingDefault: 'مرحباً بك',
    chatTitle: 'محادثة {{grade}}', chatSubtitle: 'اسأل، أرفق، وتعلّم على طريقتك', chatAssistant: 'مساعدك في {{grade}}', available: 'متاح',
    backToPortal: 'العودة إلى البوابة', emptyTitle: 'ما الذي تريد فهمه اليوم؟', emptyDescription: 'اكتب سؤالك أو أرفق صورة المسألة، وسجّل أفكارك هنا لتبدأ جلسة تعلمك.',
    chatPlaceholder: 'اكتب سؤالك هنا...', attach: 'إرفاق ملفات', send: 'إرسال الرسالة', attachmentFormats: 'PNG و JPG و PDF و DOCX و TXT، ويمكنك اختيار أكثر من ملف',
    removeAttachment: 'إزالة {{name}}', fileType: 'ملف {{type}}', loading: 'جار التحميل', notFoundTitle: 'الصفحة غير موجودة', notFoundDescription: 'تعذر العثور على الصفحة التي طلبتها.',
    aiThinking: 'المعلّم الذكي يكتب إجابة...', aiError: 'تعذر الحصول على إجابة الآن. حاول مرة أخرى.', aiNeedQuestion: 'اكتب سؤالك نصياً حتى يتمكن المعلّم الذكي من الإجابة.',
  },
  en: {
    brand: 'Smart Tutor', homeSignIn: 'Sign in', homeEyebrow: 'Your companion on the path to excellence',
    homeTitle: 'Learn smarter, move forward with confidence', homeDescription: 'Your smart tutor helps you understand lessons, review concepts, and prepare for secondary school exams.',
    grade11Label: 'Grade 11 Science', grade12Label: 'Grade 12 Science', startGrade: 'Start a conversation for your grade', quietSpace: 'A calm space for your toughest lessons',
    portalTitle: 'Your learning hub', portalSubtitle: 'Choose your grade and start a new learning session', portalEyebrow: 'Your private space', portalHeading: 'Where should we start today?',
    portalDescription: 'Ask about any lesson, attach a problem, and let your smart tutor guide the way.', openGrade: 'Open a conversation for your curriculum', startNow: 'Start now',
    settings: 'Settings', settingsTitle: 'App settings', settingsSubtitle: 'Make your learning experience your own', settingsLanguageTitle: 'Language',
    settingsLanguageDescription: 'Choose your interface language. The app direction changes automatically when needed.', languageSaved: 'Language saved on this device', language: 'Language', back: 'Back',
    signIn: 'Sign in', signUp: 'Create an account', signInSubtitle: 'Sign in to your learning space', signUpSubtitle: 'Create your account and start learning',
    remember: 'Remember me on this device', rememberNote: 'Only your preference is saved. Your secure sign-in and session are managed by Clerk.',
    logout: 'Sign out', greeting: 'Hello, {{name}}', greetingDefault: 'Welcome',
    chatTitle: '{{grade}} conversation', chatSubtitle: 'Ask, attach, and learn your way', chatAssistant: 'Your assistant for {{grade}}', available: 'Available',
    backToPortal: 'Back to hub', emptyTitle: 'What would you like to understand today?', emptyDescription: 'Write your question or attach a problem image to start your learning session.',
    chatPlaceholder: 'Write your question here...', attach: 'Attach files', send: 'Send message', attachmentFormats: 'PNG, JPG, PDF, DOCX, and TXT. You can choose multiple files.',
    removeAttachment: 'Remove {{name}}', fileType: '{{type}} file', loading: 'Loading', notFoundTitle: 'Page not found', notFoundDescription: 'We could not find the page you requested.',
    aiThinking: 'The smart tutor is writing an answer...', aiError: 'We could not get an answer right now. Please try again.', aiNeedQuestion: 'Write your question so the smart tutor can answer.',
  },
  fr: {
    brand: 'Tuteur intelligent', homeSignIn: 'Se connecter', homeEyebrow: 'Votre compagnon vers la réussite',
    homeTitle: 'Apprenez mieux, avancez avec confiance', homeDescription: 'Votre tuteur intelligent vous aide à comprendre les cours, réviser les notions et préparer vos examens du secondaire.',
    grade11Label: 'Première scientifique', grade12Label: 'Terminale scientifique', startGrade: 'Commencer une conversation pour votre classe', quietSpace: 'Un espace calme pour les cours difficiles',
    portalTitle: 'Votre espace d’apprentissage', portalSubtitle: 'Choisissez votre classe et commencez une session', portalEyebrow: 'Votre espace privé', portalHeading: 'Par où commencer aujourd’hui ?',
    portalDescription: 'Posez une question, joignez un exercice et laissez votre tuteur vous guider.', openGrade: 'Ouvrir une conversation pour votre programme', startNow: 'Commencer',
    settings: 'Paramètres', settingsTitle: 'Paramètres de l’application', settingsSubtitle: 'Personnalisez votre expérience d’apprentissage', settingsLanguageTitle: 'Langue',
    settingsLanguageDescription: 'Choisissez la langue de l’interface. Le sens de lecture s’adapte automatiquement.', languageSaved: 'Langue enregistrée sur cet appareil', language: 'Langue', back: 'Retour',
    signIn: 'Se connecter', signUp: 'Créer un compte', signInSubtitle: 'Accédez à votre espace d’apprentissage', signUpSubtitle: 'Créez votre compte et commencez à apprendre',
    remember: 'Se souvenir de moi sur cet appareil', rememberNote: 'Seule votre préférence est enregistrée. Clerk gère votre session sécurisée.',
    logout: 'Se déconnecter', greeting: 'Bonjour, {{name}}', greetingDefault: 'Bienvenue',
    chatTitle: 'Conversation {{grade}}', chatSubtitle: 'Posez une question, joignez un fichier et apprenez à votre rythme', chatAssistant: 'Votre assistant pour {{grade}}', available: 'Disponible',
    backToPortal: 'Retour à l’espace', emptyTitle: 'Que souhaitez-vous comprendre aujourd’hui ?', emptyDescription: 'Écrivez votre question ou joignez une image pour commencer.',
    chatPlaceholder: 'Écrivez votre question ici…', attach: 'Joindre des fichiers', send: 'Envoyer', attachmentFormats: 'PNG, JPG, PDF, DOCX et TXT. Plusieurs fichiers sont acceptés.',
    removeAttachment: 'Supprimer {{name}}', fileType: 'Fichier {{type}}', loading: 'Chargement', notFoundTitle: 'Page introuvable', notFoundDescription: 'La page demandée est introuvable.',
    aiThinking: 'Le tuteur intelligent rédige une réponse…', aiError: 'Impossible d’obtenir une réponse pour le moment. Réessayez.', aiNeedQuestion: 'Écrivez votre question pour obtenir une réponse.',
  },
  es: {
    brand: 'Tutor inteligente', homeSignIn: 'Iniciar sesión', homeEyebrow: 'Tu compañero hacia la excelencia',
    homeTitle: 'Aprende mejor y avanza con confianza', homeDescription: 'Tu tutor inteligente te ayuda a entender las lecciones, repasar conceptos y prepararte para los exámenes de secundaria.',
    grade11Label: '11.º grado científico', grade12Label: '12.º grado científico', startGrade: 'Iniciar una conversación para tu curso', quietSpace: 'Un espacio tranquilo para las lecciones difíciles',
    portalTitle: 'Tu espacio de aprendizaje', portalSubtitle: 'Elige tu curso y comienza una nueva sesión', portalEyebrow: 'Tu espacio privado', portalHeading: '¿Por dónde empezamos hoy?',
    portalDescription: 'Pregunta sobre cualquier lección, adjunta un problema y deja que tu tutor te guíe.', openGrade: 'Abrir una conversación para tu programa', startNow: 'Empezar ahora',
    settings: 'Configuración', settingsTitle: 'Configuración de la aplicación', settingsSubtitle: 'Personaliza tu experiencia de aprendizaje', settingsLanguageTitle: 'Idioma',
    settingsLanguageDescription: 'Elige el idioma de la interfaz. La dirección se adapta automáticamente.', languageSaved: 'Idioma guardado en este dispositivo', language: 'Idioma', back: 'Volver',
    signIn: 'Iniciar sesión', signUp: 'Crear una cuenta', signInSubtitle: 'Entra en tu espacio de aprendizaje', signUpSubtitle: 'Crea tu cuenta y comienza a aprender',
    remember: 'Recordarme en este dispositivo', rememberNote: 'Solo se guarda tu preferencia. Clerk gestiona tu sesión segura.',
    logout: 'Cerrar sesión', greeting: 'Hola, {{name}}', greetingDefault: 'Bienvenido',
    chatTitle: 'Conversación de {{grade}}', chatSubtitle: 'Pregunta, adjunta y aprende a tu manera', chatAssistant: 'Tu asistente para {{grade}}', available: 'Disponible',
    backToPortal: 'Volver al espacio', emptyTitle: '¿Qué quieres entender hoy?', emptyDescription: 'Escribe tu pregunta o adjunta una imagen para comenzar tu sesión.',
    chatPlaceholder: 'Escribe tu pregunta aquí…', attach: 'Adjuntar archivos', send: 'Enviar mensaje', attachmentFormats: 'PNG, JPG, PDF, DOCX y TXT. Puedes elegir varios archivos.',
    removeAttachment: 'Quitar {{name}}', fileType: 'Archivo {{type}}', loading: 'Cargando', notFoundTitle: 'Página no encontrada', notFoundDescription: 'No pudimos encontrar la página solicitada.',
    aiThinking: 'El tutor inteligente está escribiendo una respuesta…', aiError: 'No pudimos obtener una respuesta. Inténtalo de nuevo.', aiNeedQuestion: 'Escribe tu pregunta para que el tutor pueda responder.',
  },
  de: {
    brand: 'Intelligenter Tutor', homeSignIn: 'Anmelden', homeEyebrow: 'Dein Begleiter auf dem Weg zum Erfolg',
    homeTitle: 'Clever lernen, sicher vorankommen', homeDescription: 'Dein intelligenter Tutor hilft dir, Unterricht zu verstehen, Konzepte zu wiederholen und dich auf Prüfungen vorzubereiten.',
    grade11Label: '11. Klasse Naturwissenschaften', grade12Label: '12. Klasse Naturwissenschaften', startGrade: 'Gespräch für deine Klasse starten', quietSpace: 'Ein ruhiger Ort für schwierige Themen',
    portalTitle: 'Dein Lernbereich', portalSubtitle: 'Wähle deine Klasse und starte eine neue Lerneinheit', portalEyebrow: 'Dein persönlicher Bereich', portalHeading: 'Womit beginnen wir heute?',
    portalDescription: 'Frage zu jedem Thema, füge eine Aufgabe an und lass dich von deinem Tutor begleiten.', openGrade: 'Gespräch für deinen Lehrplan öffnen', startNow: 'Jetzt starten',
    settings: 'Einstellungen', settingsTitle: 'App-Einstellungen', settingsSubtitle: 'Gestalte dein Lernerlebnis nach deinen Wünschen', settingsLanguageTitle: 'Sprache',
    settingsLanguageDescription: 'Wähle die Sprache der Oberfläche. Die Leserichtung wird automatisch angepasst.', languageSaved: 'Sprache auf diesem Gerät gespeichert', language: 'Sprache', back: 'Zurück',
    signIn: 'Anmelden', signUp: 'Konto erstellen', signInSubtitle: 'Melde dich in deinem Lernbereich an', signUpSubtitle: 'Erstelle dein Konto und beginne zu lernen',
    remember: 'Auf diesem Gerät angemeldet bleiben', rememberNote: 'Nur deine Einstellung wird gespeichert. Clerk verwaltet deine sichere Sitzung.',
    logout: 'Abmelden', greeting: 'Hallo, {{name}}', greetingDefault: 'Willkommen',
    chatTitle: '{{grade}}-Gespräch', chatSubtitle: 'Frage, füge Dateien an und lerne auf deine Weise', chatAssistant: 'Dein Tutor für {{grade}}', available: 'Verfügbar',
    backToPortal: 'Zurück zum Lernbereich', emptyTitle: 'Was möchtest du heute verstehen?', emptyDescription: 'Schreibe deine Frage oder füge ein Aufgabenbild an, um zu beginnen.',
    chatPlaceholder: 'Schreibe deine Frage hier…', attach: 'Dateien anhängen', send: 'Nachricht senden', attachmentFormats: 'PNG, JPG, PDF, DOCX und TXT. Mehrere Dateien sind möglich.',
    removeAttachment: '{{name}} entfernen', fileType: '{{type}}-Datei', loading: 'Wird geladen', notFoundTitle: 'Seite nicht gefunden', notFoundDescription: 'Die angeforderte Seite wurde nicht gefunden.',
    aiThinking: 'Der intelligente Tutor schreibt eine Antwort…', aiError: 'Wir konnten gerade keine Antwort erhalten. Bitte versuche es erneut.', aiNeedQuestion: 'Schreibe deine Frage, damit der Tutor antworten kann.',
  },
  tr: {
    brand: 'Akıllı Öğretmen', homeSignIn: 'Giriş yap', homeEyebrow: 'Başarı yolculuğundaki arkadaşın',
    homeTitle: 'Daha akıllı öğren, güvenle ilerle', homeDescription: 'Akıllı öğretmenin dersleri anlamana, konuları tekrar etmene ve lise sınavlarına hazırlanmana yardımcı olur.',
    grade11Label: '11. sınıf sayısal', grade12Label: '12. sınıf sayısal', startGrade: 'Sınıfına özel sohbet başlat', quietSpace: 'Zor dersleri anlamak için sakin bir alan',
    portalTitle: 'Öğrenme alanın', portalSubtitle: 'Sınıfını seç ve yeni bir öğrenme oturumu başlat', portalEyebrow: 'Özel alanın', portalHeading: 'Bugün nereden başlayalım?',
    portalDescription: 'Herhangi bir dersi sor, sorunu ekle ve akıllı öğretmenin yolu göstermesine izin ver.', openGrade: 'Müfredatın için sohbet aç', startNow: 'Şimdi başla',
    settings: 'Ayarlar', settingsTitle: 'Uygulama ayarları', settingsSubtitle: 'Öğrenme deneyimini kendine göre düzenle', settingsLanguageTitle: 'Dil',
    settingsLanguageDescription: 'Arayüz dilini seç. Metin yönü gerektiğinde otomatik değişir.', languageSaved: 'Dil bu cihaza kaydedildi', language: 'Dil', back: 'Geri',
    signIn: 'Giriş yap', signUp: 'Hesap oluştur', signInSubtitle: 'Öğrenme alanına giriş yap', signUpSubtitle: 'Hesabını oluştur ve öğrenmeye başla',
    remember: 'Bu cihazda beni hatırla', rememberNote: 'Yalnızca tercihin kaydedilir. Güvenli oturumunu Clerk yönetir.',
    logout: 'Çıkış yap', greeting: 'Merhaba, {{name}}', greetingDefault: 'Hoş geldin',
    chatTitle: '{{grade}} sohbeti', chatSubtitle: 'Sor, ekle ve kendi yönteminle öğren', chatAssistant: '{{grade}} için yardımcın', available: 'Çevrimiçi',
    backToPortal: 'Öğrenme alanına dön', emptyTitle: 'Bugün neyi anlamak istiyorsun?', emptyDescription: 'Sorunu yaz veya bir problem görseli ekleyerek öğrenme oturumunu başlat.',
    chatPlaceholder: 'Sorunu buraya yaz…', attach: 'Dosya ekle', send: 'Mesaj gönder', attachmentFormats: 'PNG, JPG, PDF, DOCX ve TXT. Birden fazla dosya seçebilirsin.',
    removeAttachment: '{{name}} dosyasını kaldır', fileType: '{{type}} dosyası', loading: 'Yükleniyor', notFoundTitle: 'Sayfa bulunamadı', notFoundDescription: 'İstediğin sayfayı bulamadık.',
    aiThinking: 'Akıllı öğretmen cevap yazıyor…', aiError: 'Şu anda cevap alınamadı. Lütfen tekrar deneyin.', aiNeedQuestion: 'Öğretmenin cevap verebilmesi için sorunuzu yazın.',
  },
  ru: {
    brand: 'Умный репетитор', homeSignIn: 'Войти', homeEyebrow: 'Твой помощник на пути к успеху',
    homeTitle: 'Учись умнее и двигайся вперёд уверенно', homeDescription: 'Умный репетитор поможет понять уроки, повторить темы и подготовиться к экзаменам старшей школы.',
    grade11Label: '11 класс, естественные науки', grade12Label: '12 класс, естественные науки', startGrade: 'Начать разговор для своего класса', quietSpace: 'Спокойное место для сложных тем',
    portalTitle: 'Твоё учебное пространство', portalSubtitle: 'Выбери класс и начни новую учебную сессию', portalEyebrow: 'Личное пространство', portalHeading: 'С чего начнём сегодня?',
    portalDescription: 'Спроси о любой теме, прикрепи задачу и позволь репетитору проложить путь.', openGrade: 'Открыть разговор по программе', startNow: 'Начать',
    settings: 'Настройки', settingsTitle: 'Настройки приложения', settingsSubtitle: 'Настрой обучение под себя', settingsLanguageTitle: 'Язык',
    settingsLanguageDescription: 'Выбери язык интерфейса. Направление текста изменится автоматически.', languageSaved: 'Язык сохранён на этом устройстве', language: 'Язык', back: 'Назад',
    signIn: 'Войти', signUp: 'Создать аккаунт', signInSubtitle: 'Войди в своё учебное пространство', signUpSubtitle: 'Создай аккаунт и начни учиться',
    remember: 'Запомнить меня на этом устройстве', rememberNote: 'Сохраняется только настройка. Безопасную сессию управляет Clerk.',
    logout: 'Выйти', greeting: 'Привет, {{name}}', greetingDefault: 'Добро пожаловать',
    chatTitle: 'Разговор: {{grade}}', chatSubtitle: 'Спрашивай, прикрепляй и учись по-своему', chatAssistant: 'Твой помощник по предметам {{grade}}', available: 'Доступен',
    backToPortal: 'Вернуться в пространство', emptyTitle: 'Что ты хочешь понять сегодня?', emptyDescription: 'Напиши вопрос или прикрепи изображение задачи, чтобы начать.',
    chatPlaceholder: 'Напиши вопрос здесь…', attach: 'Прикрепить файлы', send: 'Отправить', attachmentFormats: 'PNG, JPG, PDF, DOCX и TXT. Можно выбрать несколько файлов.',
    removeAttachment: 'Удалить {{name}}', fileType: '{{type}}-файл', loading: 'Загрузка', notFoundTitle: 'Страница не найдена', notFoundDescription: 'Мы не нашли запрошенную страницу.',
    aiThinking: 'Умный репетитор готовит ответ…', aiError: 'Не удалось получить ответ. Попробуйте ещё раз.', aiNeedQuestion: 'Напиши вопрос, чтобы репетитор мог ответить.',
  },
  zh: {
    brand: '智能导师', homeSignIn: '登录', homeEyebrow: '陪你走过每一步成长',
    homeTitle: '聪明学习，自信前进', homeDescription: '智能导师帮助你理解课程、复习知识点，并为中学阶段的考试做好准备。',
    grade11Label: '高中一年级理科', grade12Label: '高中二年级理科', startGrade: '开始你的年级专属对话', quietSpace: '安静理解难题的学习空间',
    portalTitle: '学习中心', portalSubtitle: '选择年级，开始新的学习会话', portalEyebrow: '你的专属空间', portalHeading: '今天从哪里开始？',
    portalDescription: '询问任何课程，附上题目，让智能导师为你梳理学习路径。', openGrade: '打开对应课程对话', startNow: '立即开始',
    settings: '设置', settingsTitle: '应用设置', settingsSubtitle: '打造适合你的学习体验', settingsLanguageTitle: '语言',
    settingsLanguageDescription: '选择界面语言。文字方向会根据语言自动调整。', languageSaved: '语言已保存到此设备', language: '语言', back: '返回',
    signIn: '登录', signUp: '创建账户', signInSubtitle: '登录你的学习空间', signUpSubtitle: '创建账户，开始学习',
    remember: '在此设备上记住我', rememberNote: '只保存你的偏好。安全登录和会话由 Clerk 管理。',
    logout: '退出登录', greeting: '你好，{{name}}', greetingDefault: '欢迎',
    chatTitle: '{{grade}} 对话', chatSubtitle: '提问、添加附件，按照自己的方式学习', chatAssistant: '{{grade}} 学习助手', available: '在线',
    backToPortal: '返回学习中心', emptyTitle: '今天想弄懂什么？', emptyDescription: '写下问题或附上题目图片，开始你的学习会话。',
    chatPlaceholder: '在这里写下问题…', attach: '添加文件', send: '发送消息', attachmentFormats: '支持 PNG、JPG、PDF、DOCX 和 TXT，可选择多个文件。',
    removeAttachment: '移除 {{name}}', fileType: '{{type}} 文件', loading: '加载中', notFoundTitle: '找不到页面', notFoundDescription: '无法找到你请求的页面。',
    aiThinking: '智能导师正在撰写答案…', aiError: '暂时无法获取答案，请重试。', aiNeedQuestion: '请写下问题，智能导师才能回答。',
  },
  ja: {
    brand: 'スマートチューター', homeSignIn: 'ログイン', homeEyebrow: '成長への道を支える学習パートナー',
    homeTitle: '賢く学び、自信を持って前へ', homeDescription: 'スマートチューターが授業の理解、概念の復習、高校試験の準備をサポートします。',
    grade11Label: '高校1年生・理系', grade12Label: '高校2年生・理系', startGrade: '学年専用の会話を始める', quietSpace: '難しい内容を理解するための静かな空間',
    portalTitle: '学習ポータル', portalSubtitle: '学年を選んで新しい学習セッションを開始', portalEyebrow: 'あなた専用の空間', portalHeading: '今日はどこから始めますか？',
    portalDescription: '授業について質問し、問題を添付して、チューターと学習を進めましょう。', openGrade: 'カリキュラムの会話を開く', startNow: '今すぐ始める',
    settings: '設定', settingsTitle: 'アプリ設定', settingsSubtitle: '自分に合った学習体験に整えましょう', settingsLanguageTitle: '言語',
    settingsLanguageDescription: '画面の言語を選択します。文字の方向は自動的に変わります。', languageSaved: 'この端末に言語を保存しました', language: '言語', back: '戻る',
    signIn: 'ログイン', signUp: 'アカウントを作成', signInSubtitle: '学習スペースにログイン', signUpSubtitle: 'アカウントを作って学習を始める',
    remember: 'この端末にログイン情報を保存', rememberNote: '保存されるのは設定だけです。安全なセッションはClerkが管理します。',
    logout: 'ログアウト', greeting: '{{name}}さん、こんにちは', greetingDefault: 'ようこそ',
    chatTitle: '{{grade}}の会話', chatSubtitle: '質問、添付、そして自分らしい学び', chatAssistant: '{{grade}}の学習アシスタント', available: '利用可能',
    backToPortal: 'ポータルに戻る', emptyTitle: '今日は何を理解したいですか？', emptyDescription: '質問を書き込むか問題の画像を添付して、学習を始めましょう。',
    chatPlaceholder: 'ここに質問を書いてください…', attach: 'ファイルを添付', send: 'メッセージを送信', attachmentFormats: 'PNG、JPG、PDF、DOCX、TXTに対応。複数選択できます。',
    removeAttachment: '{{name}}を削除', fileType: '{{type}}ファイル', loading: '読み込み中', notFoundTitle: 'ページが見つかりません', notFoundDescription: '指定されたページを見つけられませんでした。',
    aiThinking: 'スマートチューターが回答を書いています…', aiError: '回答を取得できませんでした。もう一度お試しください。', aiNeedQuestion: '回答のために質問を書いてください。',
  },
  ko: {
    brand: '스마트 튜터', homeSignIn: '로그인', homeEyebrow: '성장 여정을 함께하는 학습 파트너',
    homeTitle: '더 똑똑하게 배우고 자신 있게 나아가세요', homeDescription: '스마트 튜터가 수업 이해, 개념 복습, 고등학교 시험 준비를 도와드립니다.',
    grade11Label: '고등학교 2학년 이과', grade12Label: '고등학교 3학년 이과', startGrade: '학년별 대화 시작하기', quietSpace: '어려운 수업을 이해하는 차분한 공간',
    portalTitle: '학습 포털', portalSubtitle: '학년을 선택하고 새 학습 세션을 시작하세요', portalEyebrow: '나만의 공간', portalHeading: '오늘은 어디서 시작할까요?',
    portalDescription: '수업에 대해 질문하고 문제를 첨부하면 스마트 튜터가 학습 방향을 안내합니다.', openGrade: '교과 과정 대화 열기', startNow: '지금 시작',
    settings: '설정', settingsTitle: '앱 설정', settingsSubtitle: '나에게 맞는 학습 경험을 만들어 보세요', settingsLanguageTitle: '언어',
    settingsLanguageDescription: '인터페이스 언어를 선택하세요. 글자 방향은 자동으로 바뀝니다.', languageSaved: '이 기기에 언어를 저장했습니다', language: '언어', back: '뒤로',
    signIn: '로그인', signUp: '계정 만들기', signInSubtitle: '학습 공간에 로그인하세요', signUpSubtitle: '계정을 만들고 학습을 시작하세요',
    remember: '이 기기에 로그인 정보 기억하기', rememberNote: '환경 설정만 저장됩니다. 안전한 세션은 Clerk가 관리합니다.',
    logout: '로그아웃', greeting: '{{name}}님, 안녕하세요', greetingDefault: '환영합니다',
    chatTitle: '{{grade}} 대화', chatSubtitle: '질문하고 첨부하며 나만의 방식으로 배우세요', chatAssistant: '{{grade}} 학습 도우미', available: '사용 가능',
    backToPortal: '학습 포털로 돌아가기', emptyTitle: '오늘은 무엇을 이해하고 싶나요?', emptyDescription: '질문을 작성하거나 문제 이미지를 첨부하여 학습을 시작하세요.',
    chatPlaceholder: '여기에 질문을 입력하세요…', attach: '파일 첨부', send: '메시지 보내기', attachmentFormats: 'PNG, JPG, PDF, DOCX, TXT 지원. 여러 파일을 선택할 수 있습니다.',
    removeAttachment: '{{name}} 삭제', fileType: '{{type}} 파일', loading: '로드 중', notFoundTitle: '페이지를 찾을 수 없습니다', notFoundDescription: '요청한 페이지를 찾지 못했습니다.',
    aiThinking: '스마트 튜터가 답변을 작성하고 있습니다…', aiError: '지금은 답변을 가져올 수 없습니다. 다시 시도해 주세요.', aiNeedQuestion: '답변을 받으려면 질문을 입력하세요.',
  },
  he: {
    brand: 'מורה חכם', homeSignIn: 'התחברות', homeEyebrow: 'השותף שלך בדרך למצוינות',
    homeTitle: 'לומדים חכם ומתקדמים בביטחון', homeDescription: 'המורה החכם עוזר להבין שיעורים, לחזור על מושגים ולהתכונן למבחני התיכון.',
    grade11Label: 'כיתה י״א מדעים', grade12Label: 'כיתה י״ב מדעים', startGrade: 'התחלת שיחה לכיתה שלך', quietSpace: 'מרחב רגוע להבנת השיעורים המאתגרים',
    portalTitle: 'מרחב הלמידה שלך', portalSubtitle: 'בחרו כיתה והתחילו מפגש למידה חדש', portalEyebrow: 'המרחב הפרטי שלך', portalHeading: 'מאיפה מתחילים היום?',
    portalDescription: 'שאלו על כל שיעור, צרפו שאלה ותנו למורה החכם להוביל את הדרך.', openGrade: 'פתיחת שיחה לפי תוכנית הלימודים', startNow: 'התחלה',
    settings: 'הגדרות', settingsTitle: 'הגדרות האפליקציה', settingsSubtitle: 'התאימו את חוויית הלמידה שלכם', settingsLanguageTitle: 'שפה',
    settingsLanguageDescription: 'בחרו את שפת הממשק. כיוון הטקסט משתנה אוטומטית.', languageSaved: 'השפה נשמרה במכשיר הזה', language: 'שפה', back: 'חזרה',
    signIn: 'התחברות', signUp: 'יצירת חשבון', signInSubtitle: 'התחברו למרחב הלמידה שלכם', signUpSubtitle: 'צרו חשבון והתחילו ללמוד',
    remember: 'זכור אותי במכשיר הזה', rememberNote: 'נשמרת רק ההעדפה. Clerk מנהל את ההתחברות וההפעלה המאובטחת.',
    logout: 'התנתקות', greeting: 'שלום, {{name}}', greetingDefault: 'ברוכים הבאים',
    chatTitle: 'שיחה לכיתה {{grade}}', chatSubtitle: 'שאלו, צרפו ולמדו בדרך שלכם', chatAssistant: 'העוזר שלכם לכיתה {{grade}}', available: 'זמין',
    backToPortal: 'חזרה למרחב הלמידה', emptyTitle: 'מה תרצו להבין היום?', emptyDescription: 'כתבו שאלה או צרפו תמונה של הבעיה כדי להתחיל את המפגש.',
    chatPlaceholder: 'כתבו את השאלה כאן…', attach: 'צירוף קבצים', send: 'שליחת הודעה', attachmentFormats: 'PNG, JPG, PDF, DOCX ו-TXT. ניתן לבחור כמה קבצים.',
    removeAttachment: 'הסרת {{name}}', fileType: 'קובץ {{type}}', loading: 'טוען', notFoundTitle: 'הדף לא נמצא', notFoundDescription: 'לא הצלחנו למצוא את הדף שביקשתם.',
    aiThinking: 'המורה החכם כותב תשובה…', aiError: 'לא ניתן לקבל תשובה כרגע. נסו שוב.', aiNeedQuestion: 'כתבו את השאלה כדי שהמורה יוכל לענות.',
  },
  pt: {
    brand: 'Tutor inteligente', homeSignIn: 'Entrar', homeEyebrow: 'Seu companheiro na jornada da excelência',
    homeTitle: 'Aprenda melhor e avance com confiança', homeDescription: 'Seu tutor inteligente ajuda a entender as aulas, revisar conceitos e se preparar para as provas do ensino médio.',
    grade11Label: '2.º ano do ensino médio - ciências', grade12Label: '3.º ano do ensino médio - ciências', startGrade: 'Começar uma conversa para sua série', quietSpace: 'Um espaço tranquilo para as matérias difíceis',
    portalTitle: 'Seu espaço de aprendizagem', portalSubtitle: 'Escolha sua série e comece uma nova sessão', portalEyebrow: 'Seu espaço privado', portalHeading: 'Por onde começamos hoje?',
    portalDescription: 'Pergunte sobre qualquer aula, anexe um problema e deixe seu tutor orientar o caminho.', openGrade: 'Abrir conversa do seu currículo', startNow: 'Começar agora',
    settings: 'Configurações', settingsTitle: 'Configurações do app', settingsSubtitle: 'Personalize sua experiência de aprendizagem', settingsLanguageTitle: 'Idioma',
    settingsLanguageDescription: 'Escolha o idioma da interface. A direção do texto muda automaticamente.', languageSaved: 'Idioma salvo neste dispositivo', language: 'Idioma', back: 'Voltar',
    signIn: 'Entrar', signUp: 'Criar conta', signInSubtitle: 'Entre no seu espaço de aprendizagem', signUpSubtitle: 'Crie sua conta e comece a aprender',
    remember: 'Lembrar de mim neste dispositivo', rememberNote: 'Apenas sua preferência é salva. O Clerk gerencia sua sessão segura.',
    logout: 'Sair', greeting: 'Olá, {{name}}', greetingDefault: 'Boas-vindas',
    chatTitle: 'Conversa de {{grade}}', chatSubtitle: 'Pergunte, anexe e aprenda do seu jeito', chatAssistant: 'Seu assistente para {{grade}}', available: 'Disponível',
    backToPortal: 'Voltar ao espaço', emptyTitle: 'O que você quer entender hoje?', emptyDescription: 'Escreva sua pergunta ou anexe uma imagem para começar.',
    chatPlaceholder: 'Escreva sua pergunta aqui…', attach: 'Anexar arquivos', send: 'Enviar mensagem', attachmentFormats: 'PNG, JPG, PDF, DOCX e TXT. Você pode escolher vários arquivos.',
    removeAttachment: 'Remover {{name}}', fileType: 'Arquivo {{type}}', loading: 'Carregando', notFoundTitle: 'Página não encontrada', notFoundDescription: 'Não encontramos a página solicitada.',
    aiThinking: 'O tutor inteligente está escrevendo uma resposta…', aiError: 'Não foi possível obter uma resposta. Tente novamente.', aiNeedQuestion: 'Escreva sua pergunta para que o tutor possa responder.',
  },
  it: {
    brand: 'Tutor intelligente', homeSignIn: 'Accedi', homeEyebrow: 'Il tuo compagno verso l’eccellenza',
    homeTitle: 'Impara meglio e vai avanti con sicurezza', homeDescription: 'Il tuo tutor intelligente ti aiuta a capire le lezioni, ripassare i concetti e prepararti agli esami della scuola superiore.',
    grade11Label: 'Quarto anno - indirizzo scientifico', grade12Label: 'Quinto anno - indirizzo scientifico', startGrade: 'Inizia una conversazione per la tua classe', quietSpace: 'Uno spazio tranquillo per le lezioni più difficili',
    portalTitle: 'Il tuo spazio di apprendimento', portalSubtitle: 'Scegli la classe e inizia una nuova sessione', portalEyebrow: 'Il tuo spazio privato', portalHeading: 'Da dove iniziamo oggi?',
    portalDescription: 'Chiedi di qualsiasi lezione, allega un esercizio e lascia che il tutor ti guidi.', openGrade: 'Apri una conversazione per il programma', startNow: 'Inizia ora',
    settings: 'Impostazioni', settingsTitle: 'Impostazioni dell’app', settingsSubtitle: 'Personalizza la tua esperienza di apprendimento', settingsLanguageTitle: 'Lingua',
    settingsLanguageDescription: 'Scegli la lingua dell’interfaccia. La direzione del testo si adatta automaticamente.', languageSaved: 'Lingua salvata su questo dispositivo', language: 'Lingua', back: 'Indietro',
    signIn: 'Accedi', signUp: 'Crea un account', signInSubtitle: 'Accedi al tuo spazio di apprendimento', signUpSubtitle: 'Crea il tuo account e inizia a imparare',
    remember: 'Ricordami su questo dispositivo', rememberNote: 'Viene salvata solo la preferenza. Clerk gestisce la sessione sicura.',
    logout: 'Esci', greeting: 'Ciao, {{name}}', greetingDefault: 'Benvenuto',
    chatTitle: 'Conversazione {{grade}}', chatSubtitle: 'Chiedi, allega e impara a modo tuo', chatAssistant: 'Il tuo assistente per {{grade}}', available: 'Disponibile',
    backToPortal: 'Torna allo spazio', emptyTitle: 'Cosa vuoi capire oggi?', emptyDescription: 'Scrivi la tua domanda o allega un’immagine per iniziare.',
    chatPlaceholder: 'Scrivi qui la tua domanda…', attach: 'Allega file', send: 'Invia messaggio', attachmentFormats: 'PNG, JPG, PDF, DOCX e TXT. Puoi scegliere più file.',
    removeAttachment: 'Rimuovi {{name}}', fileType: 'File {{type}}', loading: 'Caricamento', notFoundTitle: 'Pagina non trovata', notFoundDescription: 'Non abbiamo trovato la pagina richiesta.',
    aiThinking: 'Il tutor intelligente sta scrivendo una risposta…', aiError: 'Non è stato possibile ottenere una risposta. Riprova.', aiNeedQuestion: 'Scrivi la tua domanda per ricevere una risposta.',
  },
};

const STORAGE_KEY = 'smart-tutor-language';

function isLanguageCode(value: string | null): value is LanguageCode {
  return LANGUAGE_OPTIONS.some((option) => option.code === value);
}

function detectLanguage(): LanguageCode {
  if (typeof navigator === 'undefined') return 'ar';
  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('zh')) return 'zh';
  if (browserLanguage.startsWith('ja')) return 'ja';
  if (browserLanguage.startsWith('ko')) return 'ko';
  if (browserLanguage.startsWith('he')) return 'he';
  const matched = LANGUAGE_OPTIONS.find((option) => browserLanguage.startsWith(option.code));
  return matched?.code ?? 'ar';
}

function initialLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'ar';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLanguageCode(stored) ? stored : detectLanguage();
}

function interpolate(value: string, variables?: Record<string, string>) {
  if (!variables) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? '');
}

type I18nContextValue = {
  language: LanguageCode;
  languageOption: LanguageOption;
  direction: 'ltr' | 'rtl';
  setLanguage: (language: LanguageCode) => void;
  t: (key: keyof Messages, variables?: Record<string, string>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const languageOption = LANGUAGE_OPTIONS.find((option) => option.code === language) ?? LANGUAGE_OPTIONS[0];

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = languageOption.locale;
    document.documentElement.dir = languageOption.dir;
    document.body.dir = languageOption.dir;
    document.title = dictionaries[language].brand;
  }, [language, languageOption]);

  const value = useMemo<I18nContextValue>(() => ({
    language,
    languageOption,
    direction: languageOption.dir,
    setLanguage: (nextLanguage) => setLanguage(nextLanguage),
    t: (key, variables) => interpolate(dictionaries[language][key], variables),
  }), [language, languageOption]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useTranslation must be used inside I18nProvider');
  return context;
}

export type TranslationKey = keyof Messages;