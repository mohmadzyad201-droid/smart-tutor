import { type ChangeEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import {
  ClerkProvider,
  SignIn,
  SignUp,
  useAuth,
  useClerk,
  useUser,
} from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import {
  arSA,
  deDE,
  enUS,
  esES,
  frFR,
  heIL,
  itIT,
  jaJP,
  koKR,
  ptBR,
  ruRU,
  trTR,
  zhCN,
} from '@clerk/localizations';
import { shadcn } from '@clerk/themes';
import {
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Check,
  ChevronLeft,
  FileText,
  GraduationCap,
  Languages,
  LogOut,
  MessageCircle,
  Paperclip,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Link,
  Redirect,
  Route,
  Router as WouterRouter,
  Switch,
  useLocation,
  useParams,
} from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  LANGUAGE_OPTIONS,
  type LanguageCode,
  useTranslation,
} from './i18n';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const clerkLocalizations = {
  ar: arSA,
  en: enUS,
  fr: frFR,
  es: esES,
  de: deDE,
  tr: trTR,
  ru: ruRU,
  zh: zhCN,
  ja: jaJP,
  ko: koKR,
  he: heIL,
  pt: ptBR,
  it: itIT,
} as const;

const gradeInfo = {
  '11': { color: 'from-cyan-50 to-blue-50' },
  '12': { color: 'from-sky-50 to-indigo-50' },
} as const;

type Grade = keyof typeof gradeInfo;
type Attachment = { id: string; name: string; type: string; size: number; url: string };
type StudentMessage = { id: string; text: string; attachments: Attachment[]; sentAt: string };

const MIME_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain',
};

function getFileMimeType(file: File) {
  if (file.type) return file.type;
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[extension] ?? 'application/octet-stream';
}

function stripBase(path: string) {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

function gradeLabel(grade: Grade, t: ReturnType<typeof useTranslation>['t']) {
  return t(grade === '11' ? 'grade11Label' : 'grade12Label');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#1684c2',
    colorForeground: '#183348',
    colorMutedForeground: '#668196',
    colorDanger: '#c24140',
    colorBackground: '#ffffff',
    colorInput: '#f4fbfd',
    colorInputForeground: '#183348',
    colorNeutral: '#d7e7ec',
    fontFamily: "'IBM Plex Sans Arabic', 'Cairo', sans-serif",
    borderRadius: '1rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-[24px] w-[440px] max-w-full overflow-hidden shadow-[0_24px_70px_rgba(41,132,165,.14)]',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#183348] font-bold',
    headerSubtitle: 'text-[#668196]',
    socialButtonsBlockButtonText: 'text-[#183348] font-medium',
    formFieldLabel: 'text-[#183348] font-semibold',
    footerActionLink: 'text-[#087eae] font-semibold',
    footerActionText: 'text-[#668196]',
    dividerText: 'text-[#668196]',
    identityPreviewEditButton: 'text-[#087eae]',
    formFieldSuccessText: 'text-[#1684c2]',
    alertText: 'text-[#a93635]',
    logoBox: 'h-12',
    logoImage: 'h-12 w-12 rounded-2xl',
    socialButtonsBlockButton: 'border-[#d7e7ec] bg-[#f7fcfd] hover:bg-[#edf8fb]',
    formButtonPrimary: 'bg-[#1684c2] hover:bg-[#087eae] text-white shadow-none',
    formFieldInput: 'bg-[#f4fbfd] border-[#d7e7ec] text-[#183348]',
    footerAction: 'bg-transparent',
    dividerLine: 'bg-[#d7e7ec]',
    alert: 'bg-[#fff3f2] border-[#f0c7c4]',
    otpCodeFieldInput: 'bg-[#f4fbfd] border-[#d7e7ec] text-[#183348]',
    formFieldRow: 'mb-4',
    main: 'px-1',
  },
};

function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const { t } = useTranslation();
  const sizes = {
    sm: 'h-10 w-10 rounded-xl',
    md: 'h-12 w-12 rounded-2xl',
    lg: 'h-[72px] w-[72px] rounded-[22px]',
  };
  const iconSizes = { sm: 20, md: 25, lg: 34 };
  return (
    <div
      className={`${sizes[size]} brand-mark flex items-center justify-center text-white`}
      aria-label={t('brand')}
    >
      <GraduationCap size={iconSizes[size]} strokeWidth={1.8} />
    </div>
  );
}

function LanguageSelect({ compact = false }: { compact?: boolean }) {
  const { language, languageOption, setLanguage, t } = useTranslation();
  return (
    <label className={`flex items-center gap-2 ${compact ? '' : 'w-full'}`}>
      <Languages size={16} className="shrink-0 text-[#1684c2]" aria-hidden="true" />
      <span className="sr-only">{t('language')}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        className={`rounded-full border border-[#d7e7ec] bg-white text-sm text-[#183348] outline-none transition focus:border-[#1684c2] ${
          compact ? 'max-w-[145px] px-3 py-2' : 'w-full px-3 py-3'
        }`}
        aria-label={t('language')}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.flag} {option.nativeName}
          </option>
        ))}
      </select>
      {!compact && (
        <span className="text-sm text-[#668196]">
          {languageOption.flag} {languageOption.nativeName}
        </span>
      )}
    </label>
  );
}

function HomeRedirect() {
  const { isSignedIn, isLoaded } = useAuth();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const intended = sessionStorage.getItem('smart-tutor-grade');
    setLocation(
      intended === '11' || intended === '12' ? `/chat/${intended}` : '/user-portal',
    );
    if (intended) sessionStorage.removeItem('smart-tutor-grade');
  }, [isLoaded, isSignedIn, setLocation]);
  if (!isLoaded || isSignedIn) {
    return <div className="app-shell min-h-[100dvh]" aria-label={t('loading')} />;
  }
  return <Home />;
}

function Home() {
  const [, setLocation] = useLocation();
  const { direction, t } = useTranslation();
  const chooseGrade = (grade: Grade) => {
    sessionStorage.setItem('smart-tutor-grade', grade);
    setLocation('/sign-in');
  };
  return (
    <main className="app-shell soft-grid min-h-[100dvh] px-5 py-8 sm:px-8" dir={direction}>
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3" data-testid="link-home-brand">
          <BrandMark size="sm" />
          <span className="text-base font-bold text-[#183348]">{t('brand')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelect compact />
          <Link
            href="/sign-in"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#087eae] transition hover:bg-white/70"
            data-testid="link-home-sign-in"
          >
            {t('homeSignIn')}
          </Link>
        </div>
      </header>
      <section className="mx-auto flex min-h-[calc(100dvh-116px)] max-w-6xl items-center justify-center py-12">
        <div className="w-full max-w-[620px] text-center">
          <div className="mb-7 flex justify-center"><BrandMark size="lg" /></div>
          <p className="mb-3 text-sm font-semibold tracking-[.08em] text-[#1684c2]">{t('homeEyebrow')}</p>
          <h1 className="text-3xl font-extrabold leading-[1.35] text-[#183348] sm:text-5xl">{t('homeTitle')}</h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-8 text-[#668196]">{t('homeDescription')}</p>
          <div className="mt-12 grid gap-4 text-start sm:grid-cols-2">
            {(['11', '12'] as Grade[]).map((grade) => (
              <button
                type="button"
                key={grade}
                onClick={() => chooseGrade(grade)}
                className={`card-lift group flex min-h-[108px] items-center justify-between rounded-[22px] border border-[#d7e7ec] bg-gradient-to-br ${gradeInfo[grade].color} p-5 text-start`}
                data-testid={`button-grade-${grade}`}
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-xl font-extrabold text-[#1684c2] shadow-sm">{grade}</span>
                  <span className="min-w-0">
                    <span className="block text-base font-bold leading-6 text-[#183348]">{gradeLabel(grade, t)}</span>
                    <span className="mt-1 block text-xs text-[#668196]">{t('startGrade')}</span>
                  </span>
                </span>
                <ChevronLeft className="shrink-0 text-[#1684c2] transition-transform group-hover:-translate-x-1" size={21} />
              </button>
            ))}
          </div>
          <p className="mt-9 flex items-center justify-center gap-2 text-xs text-[#668196]"><Sparkles size={14} className="text-[#eda92e]" /> {t('quietSpace')}</p>
        </div>
      </section>
    </main>
  );
}

function AuthPage({ mode }: { mode: 'in' | 'up' }) {
  const [remember, setRemember] = useState(() => localStorage.getItem('smart-tutor-remember') === 'true');
  const { direction, t } = useTranslation();
  const updateRemember = (checked: boolean) => {
    setRemember(checked);
    if (checked) localStorage.setItem('smart-tutor-remember', 'true');
    else localStorage.removeItem('smart-tutor-remember');
  };
  return (
    <main className="app-shell flex min-h-[100dvh] items-center justify-center px-4 py-8" dir={direction}>
      <div className="w-full max-w-[500px]">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <BrandMark size="sm" />
          <span className="font-bold text-[#183348]">{t('brand')}</span>
          <LanguageSelect compact />
        </div>
        <div className="flex justify-center">
          {mode === 'in' ? (
            <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} fallbackRedirectUrl={`${basePath}/user-portal`} />
          ) : (
            <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} fallbackRedirectUrl={`${basePath}/user-portal`} />
          )}
        </div>
        {mode === 'in' && (
          <label className="mx-auto mt-4 flex max-w-[440px] cursor-pointer items-center justify-center gap-2 text-sm text-[#668196]" data-testid="label-remember-me">
            <input type="checkbox" checked={remember} onChange={(event) => updateRemember(event.target.checked)} className="h-4 w-4 accent-[#1684c2]" data-testid="input-remember-me" />
            {t('remember')}
          </label>
        )}
        <p className="mx-auto mt-4 max-w-[440px] text-center text-[11px] leading-5 text-[#8aa0ad]">{t('rememberNote')}</p>
      </div>
    </main>
  );
}

function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { t } = useTranslation();
  const logout = () => {
    localStorage.removeItem('smart-tutor-remember');
    sessionStorage.removeItem('smart-tutor-grade');
    void signOut({ redirectUrl: basePath || '/' });
  };
  return (
    <header className="sticky top-0 z-10 border-b border-[#d7e7ec]/80 bg-[#f3fbfd]/90 px-5 py-4 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" />
          <div><h1 className="font-bold text-[#183348]">{title}</h1>{subtitle && <p className="hidden text-xs text-[#668196] sm:block">{subtitle}</p>}</div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <LanguageSelect compact />
          <Link href="/settings" className="flex items-center gap-2 rounded-full border border-[#d7e7ec] bg-white px-3 py-2 text-xs font-semibold text-[#668196] transition hover:text-[#1684c2]" data-testid="link-settings">
            <Settings size={15} /> <span className="hidden sm:inline">{t('settings')}</span>
          </Link>
          <span className="hidden text-sm text-[#668196] lg:block">{user?.firstName ? t('greeting', { name: user.firstName }) : t('greetingDefault')}</span>
          <button type="button" onClick={logout} className="flex items-center gap-2 rounded-full border border-[#d7e7ec] bg-white px-3 py-2 text-xs font-semibold text-[#668196] transition hover:text-[#c24140]" data-testid="button-logout">
            <LogOut size={15} /> {t('logout')}
          </button>
        </div>
      </div>
    </header>
  );
}

function Protected({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useTranslation();
  if (!isLoaded) return <div className="app-shell min-h-[100dvh]" aria-label={t('loading')} />;
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  return <>{children}</>;
}

function SettingsPage() {
  const { direction, language, setLanguage, t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const chooseLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage);
    setSaved(true);
  };
  return (
    <Protected>
      <div className="app-shell min-h-[100dvh]" dir={direction}>
        <AppHeader title={t('settingsTitle')} subtitle={t('settingsSubtitle')} />
        <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8">
          <Link href="/user-portal" className="mb-6 flex w-fit items-center gap-2 text-sm font-semibold text-[#668196] transition hover:text-[#1684c2]" data-testid="link-settings-back">
            <ArrowLeft size={16} /> {t('back')}
          </Link>
          <section className="rounded-[26px] border border-[#d7e7ec] bg-white p-5 shadow-[0_14px_42px_rgba(41,132,165,.08)] sm:p-8">
            <div className="mb-8 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f7fa] text-[#1684c2]"><Languages size={23} /></div>
              <div>
                <h2 className="text-xl font-bold text-[#183348]">{t('settingsLanguageTitle')}</h2>
                <p className="mt-2 max-w-xl leading-7 text-[#668196]">{t('settingsLanguageDescription')}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LANGUAGE_OPTIONS.map((option) => {
                const selected = option.code === language;
                return (
                  <button
                    type="button"
                    key={option.code}
                    onClick={() => chooseLanguage(option.code)}
                    className={`flex min-h-[68px] items-center justify-between rounded-2xl border p-4 text-start transition ${selected ? 'border-[#1684c2] bg-[#eff9fb] shadow-sm' : 'border-[#d7e7ec] bg-white hover:border-[#8bcbd9] hover:bg-[#fbfeff]'}`}
                    aria-pressed={selected}
                    data-testid={`button-language-${option.code}`}
                  >
                    <span className="flex items-center gap-3"><span className="text-xl" aria-hidden="true">{option.flag}</span><span className="font-semibold text-[#183348]">{option.nativeName}</span></span>
                    {selected && <Check size={18} className="text-[#1684c2]" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            {saved && <p className="mt-5 text-sm font-semibold text-[#3c8b66]" role="status">{t('languageSaved')}</p>}
          </section>
        </main>
      </div>
    </Protected>
  );
}

function UserPortal() {
  const [, setLocation] = useLocation();
  const { direction, t } = useTranslation();
  const { isSignedIn } = useAuth();
  useEffect(() => {
    if (!isSignedIn) return;
    const intended = sessionStorage.getItem('smart-tutor-grade');
    if (intended === '11' || intended === '12') {
      sessionStorage.removeItem('smart-tutor-grade');
      setLocation(`/chat/${intended}`);
    }
  }, [isSignedIn, setLocation]);
  return (
    <Protected>
      <div className="app-shell min-h-[100dvh]" dir={direction}>
        <AppHeader title={t('portalTitle')} subtitle={t('portalSubtitle')} />
        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <div className="mb-10 max-w-2xl"><p className="mb-3 text-sm font-semibold text-[#1684c2]">{t('portalEyebrow')}</p><h2 className="text-3xl font-extrabold leading-tight text-[#183348] sm:text-4xl">{t('portalHeading')}</h2><p className="mt-4 leading-8 text-[#668196]">{t('portalDescription')}</p></div>
          <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
            {(['11', '12'] as Grade[]).map((grade) => (
              <button type="button" onClick={() => setLocation(`/chat/${grade}`)} key={grade} className={`card-lift group rounded-[26px] border border-[#d7e7ec] bg-gradient-to-br ${gradeInfo[grade].color} p-6 text-start`} data-testid={`button-portal-grade-${grade}`}>
                <div className="mb-12 flex items-start justify-between"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/85 text-2xl font-extrabold text-[#1684c2]">{grade}</span><BookOpen size={22} className="text-[#1684c2]" /></div>
                <h3 className="text-lg font-bold text-[#183348]">{gradeLabel(grade, t)}</h3><p className="mt-2 text-sm text-[#668196]">{t('openGrade')}</p><span className="mt-6 flex items-center gap-2 text-sm font-bold text-[#1684c2]">{t('startNow')} <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /></span>
              </button>
            ))}
          </div>
        </main>
      </div>
    </Protected>
  );
}

function AttachmentPreview({ attachment, onRemove }: { attachment: { id: string; file: File; preview: string }; onRemove: () => void }) {
  const { t } = useTranslation();
  const isImage = getFileMimeType(attachment.file).startsWith('image/');
  return (
    <div className="relative w-24 shrink-0 overflow-hidden rounded-xl border border-[#d7e7ec] bg-white" data-testid={`attachment-preview-${attachment.id}`}>
      {isImage ? <img src={attachment.preview} alt={attachment.file.name} className="h-16 w-full object-cover" /> : <div className="flex h-16 items-center justify-center bg-[#eff9fb] text-[#1684c2]"><FileText size={25} /></div>}
      <p className="truncate px-2 py-1 text-[10px] text-[#668196]" title={attachment.file.name}>{attachment.file.name}</p>
      <button type="button" onClick={onRemove} aria-label={t('removeAttachment', { name: attachment.file.name })} className="absolute left-1 top-1 rounded-full bg-[#183348]/75 p-1 text-white" data-testid={`button-remove-attachment-${attachment.id}`}><X size={11} /></button>
    </div>
  );
}

function ChatPage() {
  const { grade: rawGrade } = useParams<{ grade: string }>();
  const grade = rawGrade === '12' ? '12' : '11';
  const { direction, languageOption, t } = useTranslation();
  const { isSignedIn } = useAuth();
  const [text, setText] = useState('');
  const [pending, setPending] = useState<{ id: string; file: File; preview: string }[]>([]);
  const [messages, setMessages] = useState<StudentMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const objectUrls = useRef(new Set<string>());
  const canSend = text.trim().length > 0 || pending.length > 0;

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current.clear();
  }, []);
  useEffect(() => {
    if (isSignedIn === false) sessionStorage.setItem('smart-tutor-grade', grade);
  }, [grade, isSignedIn]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []).filter((file) => MIME_BY_EXTENSION[file.name.split('.').pop()?.toLowerCase() ?? '']);
    setPending((current) => [...current, ...selected.map((file) => {
      const preview = URL.createObjectURL(file);
      objectUrls.current.add(preview);
      return { id: `${file.name}-${file.lastModified}-${Math.random()}`, file, preview };
    })]);
    event.target.value = '';
  };
  const removeFile = (id: string) => setPending((current) => {
    const item = current.find((entry) => entry.id === id);
    if (item) { URL.revokeObjectURL(item.preview); objectUrls.current.delete(item.preview); }
    return current.filter((entry) => entry.id !== id);
  });
  const sendMessage = () => {
    if (!canSend) return;
    const message: StudentMessage = {
      id: `${Date.now()}`,
      text: text.trim(),
      sentAt: new Intl.DateTimeFormat(languageOption.locale, { hour: 'numeric', minute: 'numeric' }).format(new Date()),
      attachments: pending.map(({ file, preview, id }) => ({ id, name: file.name, type: getFileMimeType(file), size: file.size, url: preview })),
    };
    setMessages((current) => [...current, message]);
    setText('');
    setPending([]);
  };
  const fullGradeLabel = gradeLabel(grade, t);
  return (
    <Protected>
      <div className="app-shell flex min-h-[100dvh] flex-col" dir={direction}>
        <AppHeader title={t('chatTitle', { grade: fullGradeLabel })} subtitle={t('chatSubtitle')} />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-8">
          <Link href="/user-portal" className="mb-6 flex w-fit items-center gap-2 text-sm font-semibold text-[#668196] transition hover:text-[#1684c2]" data-testid="link-back-portal"><ArrowLeft size={16} /> {t('backToPortal')}</Link>
          <section className="flex min-h-[550px] flex-1 flex-col overflow-hidden rounded-[26px] border border-[#d7e7ec] bg-white shadow-[0_14px_42px_rgba(41,132,165,.08)]">
            <div className="flex items-center gap-3 border-b border-[#e8f1f3] bg-[#fbfeff] px-5 py-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7fa] text-[#1684c2]"><MessageCircle size={20} /></div><div><h2 className="font-bold text-[#183348]">{t('brand')}</h2><p className="text-xs text-[#668196]">{t('chatAssistant', { grade: fullGradeLabel })}</p></div><span className="ms-auto flex items-center gap-1.5 rounded-full bg-[#effaf4] px-2.5 py-1 text-[11px] font-semibold text-[#3c8b66]"><span className="h-1.5 w-1.5 rounded-full bg-[#54b77c]" />{t('available')}</span></div>
            <div className="thin-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto bg-[linear-gradient(180deg,#fbfeff_0%,#f2fafc_100%)] p-5 sm:p-8">
              {messages.length === 0 && <div className="m-auto max-w-sm text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f7fa] text-[#1684c2]"><Sparkles size={25} /></div><h3 className="font-bold text-[#183348]">{t('emptyTitle')}</h3><p className="mt-2 text-sm leading-7 text-[#668196]">{t('emptyDescription')}</p></div>}
              {messages.map((message) => <div className="ms-auto max-w-[90%] sm:max-w-[72%]" key={message.id} data-testid={`message-student-${message.id}`}><div className="rounded-2xl rounded-bl-md bg-[#1684c2] px-4 py-3 text-white shadow-sm">{message.text && <p className="whitespace-pre-wrap text-sm leading-7">{message.text}</p>}{message.attachments.length > 0 && <div className={`mt-3 grid gap-2 ${message.attachments.length > 1 ? 'sm:grid-cols-2' : ''}`}>{message.attachments.map((attachment) => attachment.type.startsWith('image/') ? <a href={attachment.url} target="_blank" rel="noreferrer" key={attachment.id} className="block overflow-hidden rounded-xl border border-white/25 bg-white/10" data-testid={`link-sent-image-${attachment.id}`}><img src={attachment.url} alt={attachment.name} className="max-h-44 w-full object-cover" /><span className="block truncate px-2 py-1 text-[10px] text-white/80">{attachment.name}</span></a> : <a href={attachment.url} target="_blank" rel="noreferrer" download={attachment.name} key={attachment.id} className="flex min-w-[170px] items-center gap-2 rounded-xl border border-white/25 bg-white/10 p-2 text-start" data-testid={`link-sent-document-${attachment.id}`}><FileText size={20} /><span className="min-w-0"><span className="block truncate text-xs font-semibold">{attachment.name}</span><span className="text-[10px] text-white/70">{attachment.type.split('/').pop()?.toUpperCase()}</span></span></a>)}</div>}</div><p className="mt-1 px-1 text-[10px] text-[#8aa0ad]">{message.sentAt}</p></div>)}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-[#e8f1f3] bg-white p-3 sm:p-4">
              {pending.length > 0 && <div className="thin-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">{pending.map((attachment) => <AttachmentPreview attachment={attachment} onRemove={() => removeFile(attachment.id)} key={attachment.id} />)}</div>}
              <div className="flex items-end gap-2 rounded-2xl border border-[#d7e7ec] bg-[#f8fcfd] p-2 focus-within:border-[#1684c2]"><button type="button" onClick={() => inputRef.current?.click()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#668196] transition hover:bg-[#e8f7fa] hover:text-[#1684c2]" aria-label={t('attach')} data-testid="button-attach"><Paperclip size={19} /><span className="sr-only">{t('attach')}</span></button><input ref={inputRef} type="file" multiple accept=".png,.jpg,.jpeg,.pdf,.docx,.txt" onChange={addFiles} className="hidden" data-testid="input-attachments" /><textarea value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} rows={1} placeholder={t('chatPlaceholder')} className="max-h-32 min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-[#183348] outline-none placeholder:text-[#8aa0ad]" data-testid="input-chat-message" /><button type="button" disabled={!canSend} onClick={sendMessage} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1684c2] text-white transition hover:bg-[#087eae] disabled:cursor-not-allowed disabled:opacity-40" aria-label={t('send')} data-testid="button-send-message"><ArrowUp size={19} /></button></div>
              <p className="mt-2 px-1 text-[10px] text-[#8aa0ad]">{t('attachmentFormats')}</p>
            </div>
          </section>
        </main>
      </div>
    </Protected>
  );
}

function LocalizedNotFound() {
  const { direction, t } = useTranslation();
  return <main className="app-shell flex min-h-[100dvh] items-center justify-center px-5 text-center" dir={direction}><div><div className="mb-4 text-5xl font-extrabold text-[#1684c2]">404</div><h1 className="text-2xl font-bold text-[#183348]">{t('notFoundTitle')}</h1><p className="mt-3 text-[#668196]">{t('notFoundDescription')}</p><Link href="/" className="mt-6 inline-flex rounded-full bg-[#1684c2] px-5 py-3 text-sm font-bold text-white">{t('back')}</Link></div></main>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const cache = useQueryClient();
  const previous = useRef<string | null | undefined>(undefined);
  useEffect(() => addListener(({ user }) => { const id = user?.id ?? null; if (previous.current !== undefined && previous.current !== id) cache.clear(); previous.current = id; }), [addListener, cache]);
  return null;
}

function Router() {
  return <ErrorBoundary resetKey={window.location.pathname}><Switch><Route path="/" component={HomeRedirect} /><Route path="/sign-in/*?" component={() => <AuthPage mode="in" />} /><Route path="/sign-up/*?" component={() => <AuthPage mode="up" />} /><Route path="/user-portal" component={UserPortal} /><Route path="/settings" component={SettingsPage} /><Route path="/chat/:grade" component={ChatPage} /><Route component={LocalizedNotFound} /></Switch></ErrorBoundary>;
}

function ClerkApp() {
  const [, setLocation] = useLocation();
  const { language } = useTranslation();
  return <ClerkProvider publishableKey={clerkPubKey} proxyUrl={clerkProxyUrl} appearance={clerkAppearance} localization={clerkLocalizations[language]} signInUrl={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} routerPush={(to) => setLocation(stripBase(to))} routerReplace={(to) => setLocation(stripBase(to), { replace: true })}><QueryClientProvider client={queryClient}><ClerkQueryClientCacheInvalidator /><Router /></QueryClientProvider></ClerkProvider>;
}

function App() {
  return <TooltipProvider><WouterRouter base={basePath}><ClerkApp /></WouterRouter><Toaster /></TooltipProvider>;
}

export default App;