import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  MessageCircle, 
  Calendar, 
  FileText, 
  CreditCard,
  ChevronDown,
  ChevronRight,
  Rocket,
  Video,
  Settings,
  Send,
  Home,
  Sparkles,
  Zap,
  CheckCircle2,
  Menu,
  X,
  Stethoscope,
  ShoppingBag,
  ClipboardList,
  Smartphone,
  Info,
  ArrowLeft,
  User
} from 'lucide-react';
import { faqCategories, quickAnswers } from './data/faqData';
import VeroForm from './components/VeroForm';

// Declare Zoho types
declare global {
  interface Window {
    $zoho?: {
      salesiq?: {
        ready?: () => void;
        floatwindow?: {
          visible: (state: string) => void;
        };
        chat?: {
          start: () => void;
        };
      };
    };
  }
}

// ━━━━━━ CONFIGURAÇÕES DE FORMULÁRIOS ━━━━━━

interface FormField {
  label: string;
  type: 'text' | 'select' | 'date' | 'textarea';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface TicketType {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgIcon: string;
  description: string;
  fields: FormField[];
}

const especialidadesList = [
  'Clínica Geral Adulto',
  'Clínico Geral Infantil',
  'Medicina de Família',
  'Medicina Veterinária (Pet)',
  'Canal de Receitas',
  'Ginecologia',
  'Psicologia',
  'Nutrição',
  'Dermatologia',
  'Treinadores / Educação Física'
];

const ticketTypes: TicketType[] = [
  { 
    id: 'agendamento', 
    title: 'Suporte a Agendamento', 
    icon: <Calendar className="w-6 h-6" />, 
    color: 'from-blue-500 to-cyan-600', 
    bgIcon: 'bg-blue-100 text-blue-600',
    description: 'Dificuldade para marcar ou reagendar consultas',
    fields: [
      { label: 'Especialidade Desejada', type: 'select', options: especialidadesList, required: true },
      { label: 'Data e Hora Tentada', type: 'text', placeholder: 'Ex: Segunda às 14h', required: true },
      { label: 'O que ocorreu?', type: 'select', options: ['Erro ao confirmar', 'Não aparecem horários', 'Opção agendamento sumiu', 'Preciso cancelar/reagendar', 'Outro'], required: true },
    ]
  },
  { 
    id: 'consulta', 
    title: 'Problemas na Consulta', 
    icon: <Video className="w-6 h-6" />, 
    color: 'from-purple-500 to-indigo-600', 
    bgIcon: 'bg-purple-100 text-purple-600',
    description: 'Erros durante o atendimento com o médico',
    fields: [
      { label: 'Especialidade da Consulta', type: 'select', options: especialidadesList, required: true },
      { label: 'Nome do Médico (se souber)', type: 'text', placeholder: 'Nome do profissional' },
      { label: 'Tipo de Problema', type: 'select', options: ['Queda de conexão', 'Sem áudio/vídeo', 'Médico não compareceu', 'Erro ao iniciar sala', 'Outro'], required: true },
      { label: 'Data/Hora da Consulta', type: 'text', placeholder: 'Ex: Hoje às 10h', required: true },
    ]
  },
  { 
    id: 'receita', 
    title: 'Receitas e Atestados', 
    icon: <FileText className="w-6 h-6" />, 
    color: 'from-fuchsia-500 to-pink-600', 
    bgIcon: 'bg-fuchsia-100 text-fuchsia-600',
    description: 'Problemas com documentos médicos digitais',
    fields: [
      { label: 'Tipo de Documento', type: 'select', options: ['Receita Simples', 'Receita Controlada', 'Atestado Médico', 'Solicitação de Exame', 'Relatório'], required: true },
      { label: 'Qual o erro?', type: 'select', options: ['Não recebi no e-mail', 'Não aparece no app', 'Dados incorretos', 'Farmácia recusou', 'Preciso de 2ª via'], required: true },
      { label: 'Data da Consulta original', type: 'date', required: true },
    ]
  },
  { 
    id: 'tecnico', 
    title: 'Suporte Técnico App', 
    icon: <Smartphone className="w-6 h-6" />, 
    color: 'from-amber-500 to-orange-600', 
    bgIcon: 'bg-amber-100 text-amber-600',
    description: 'Bugs, erros de login ou travamentos no app',
    fields: [
      { label: 'Dispositivo', type: 'select', options: ['Android', 'iPhone (iOS)', 'Computador/Web', 'Tablet'], required: true },
      { label: 'Modelo do Aparelho', type: 'text', placeholder: 'Ex: iPhone 13, Samsung S22', required: true },
      { label: 'Versão do App', type: 'text', placeholder: 'Vá em configurações para ver' },
      { label: 'Onde ocorre o erro?', type: 'select', options: ['Ao fazer login', 'Ao carregar perfil', 'Ao tentar abrir chat', 'App fecha sozinho', 'Outro'], required: true },
    ]
  },
  { 
    id: 'pagamento', 
    title: 'Financeiro e Cobrança', 
    icon: <CreditCard className="w-6 h-6" />, 
    color: 'from-emerald-500 to-teal-600', 
    bgIcon: 'bg-emerald-100 text-emerald-600',
    description: 'Dúvidas sobre pagamentos, estornos e planos',
    fields: [
      { label: 'Motivo do Contato', type: 'select', options: ['Cobrança indevida', 'Solicitar estorno', 'Problema com PIX/Cartão', 'Nota Fiscal', 'Dúvida sobre valor'], required: true },
      { label: 'Valor da Transação', type: 'text', placeholder: 'R$ 0,00' },
      { label: 'Data da Cobrança', type: 'date' },
      { label: 'Últimos 4 dígitos do cartão', type: 'text', placeholder: 'Se aplicável' },
    ]
  },
  { 
    id: 'ativacao', 
    title: 'Ativação de Código', 
    icon: <Rocket className="w-6 h-6" />, 
    color: 'from-violet-500 to-purple-600', 
    bgIcon: 'bg-violet-100 text-violet-600',
    description: 'Problemas para ativar benefício de empresa',
    fields: [
      { label: 'Nome da Empresa/Convênio', type: 'text', required: true },
      { label: 'O Código que você tem', type: 'text', placeholder: 'Ex: EMPRESA2024' },
      { label: 'Problema exato', type: 'select', options: ['Código inválido', 'Código expirado', 'Não sei onde colocar', 'Já usei e não ativou'], required: true },
    ]
  },
  { 
    id: 'consultas-compradas', 
    title: 'Consultas Compradas', 
    icon: <ShoppingBag className="w-6 h-6" />, 
    color: 'from-rose-500 to-pink-600', 
    bgIcon: 'bg-rose-100 text-rose-600',
    description: 'Créditos de parceiros (Araujo, Emagreçer)',
    fields: [
      { label: 'Parceiro', type: 'select', options: ['Araujo', 'Emagreçer'], required: true },
      { label: 'Quantidade Comprada', type: 'text', placeholder: 'Ex: 5 consultas', required: true },
      { label: 'Data da Compra', type: 'date', required: true },
    ]
  },
  { 
    id: 'portal-id', 
    title: 'Portal ID', 
    icon: <User className="w-6 h-6" />, 
    color: 'from-indigo-600 to-violet-700', 
    bgIcon: 'bg-indigo-100 text-indigo-600',
    description: 'Ajuda com cadastros, licenças e integrações',
    fields: [
      { label: 'O que você precisa?', type: 'select', options: ['Cadastro de Licenças', 'Cadastro de Paciente', 'Integração', 'Outros'], required: true },
      { label: 'Nome do Cliente', type: 'text', placeholder: 'Digite o nome do cliente', required: true },
    ]
  },
];

const colorMap: { [key: string]: string } = {
  'violet': 'from-violet-500 to-purple-600',
  'purple': 'from-purple-500 to-indigo-600',
  'blue': 'from-blue-500 to-cyan-600',
  'fuchsia': 'from-fuchsia-500 to-pink-600',
  'indigo': 'from-indigo-500 to-blue-600',
  'amber': 'from-amber-500 to-orange-600',
  'emerald': 'from-emerald-500 to-teal-600',
  'rose': 'from-rose-500 to-red-600',
};

const bgColorMap: { [key: string]: string } = {
  'violet': 'bg-violet-100 text-violet-600',
  'purple': 'bg-purple-100 text-purple-600',
  'blue': 'bg-blue-100 text-blue-600',
  'fuchsia': 'bg-fuchsia-100 text-fuchsia-600',
  'indigo': 'bg-indigo-100 text-indigo-600',
  'amber': 'bg-amber-100 text-amber-600',
  'emerald': 'bg-emerald-100 text-emerald-600',
  'rose': 'bg-rose-100 text-rose-600',
};

const iconComponentMap: { [key: string]: React.ReactNode } = {
  'rocket': <Rocket className="w-6 h-6" />,
  'video': <Video className="w-6 h-6" />,
  'calendar': <Calendar className="w-6 h-6" />,
  'file-text': <FileText className="w-6 h-6" />,
  'settings': <Settings className="w-6 h-6" />,
  'credit-card': <CreditCard className="w-6 h-6" />,
  'heart': <CheckCircle2 className="w-6 h-6" />,
};

function App() {
  const [currentView, setCurrentView] = useState<'faq' | 'formularios' | 'formulario-detalhe' | 'vero'>('faq');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Improved FAQ Filtering + Auto Expand
  const getFilteredFAQs = useCallback(() => {
    const isSearching = searchTerm.trim().length > 0;
    if (!isSearching && !selectedCategory) return faqCategories;

    return faqCategories.map(category => {
      const filteredItems = category.items.filter(item => {
        const matchesSearch = !isSearching || 
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
      return { ...category, items: filteredItems };
    }).filter(category => {
      const hasItems = category.items.length > 0;
      const matchesCategory = !selectedCategory || category.id === selectedCategory;
      return hasItems && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const filteredFAQs = getFilteredFAQs();
  const isSearching = searchTerm.trim().length > 0;
  const totalResults = filteredFAQs.reduce((acc, cat) => acc + cat.items.length, 0);

  // Handle auto-expansion during search
  useEffect(() => {
    if (isSearching && currentView === 'faq') {
      const newExpanded: { [key: string]: boolean } = {};
      filteredFAQs.forEach(cat => {
        cat.items.forEach((_, idx) => {
          newExpanded[`${cat.id}-${idx}`] = true;
        });
      });
      setExpandedItems(newExpanded);
    } else {
      setExpandedItems({});
    }
  }, [searchTerm, currentView, filteredFAQs, isSearching]);

  // Routing
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      if (path === '/formularios/vero') {
        setCurrentView('vero');
      } else if (path.startsWith('/formularios/')) {
        const ticketId = path.split('/')[2];
        const ticket = ticketTypes.find(t => t.id === ticketId);
        if (ticket) {
          setCurrentView('formulario-detalhe');
          setSelectedTicketId(ticketId);
        } else {
          setCurrentView('formularios');
        }
      } else if (path === '/formularios') {
        setCurrentView('formularios');
      } else {
        setCurrentView('faq');
      }
    };
    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  const navigateTo = (view: 'faq' | 'formularios' | 'formulario-detalhe' | 'vero', ticketId?: string) => {
    let path = '/';
    if (view === 'formularios') path = '/formularios';
    if (view === 'vero') path = '/formularios/vero';
    if (view === 'formulario-detalhe' && ticketId) path = `/formularios/${ticketId}`;

    window.history.pushState({}, '', path);
    setCurrentView(view);
    setSelectedTicketId(ticketId || null);
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  const openZohoChat = () => {
    if (window.$zoho?.salesiq?.floatwindow) {
      window.$zoho.salesiq.floatwindow.visible('show');
    }
  };

  const toggleItem = (categoryId: string, index: number) => {
    const key = `${categoryId}-${index}`;
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ━━━━━━ COMPONENTS ━━━━━━

  const Breadcrumb = () => {
    const isFaq = (currentView as string) === 'faq';
    if (isFaq) return null;

    const crumbs = [{ label: 'Início', path: 'faq' }];
    crumbs.push({ label: 'Formulários', path: 'formularios' });
    
    if (currentView === 'vero') crumbs.push({ label: 'Vero', path: 'vero' });
    if (currentView === 'formulario-detalhe' && selectedTicketId) {
      const t = ticketTypes.find(x => x.id === selectedTicketId);
      crumbs.push({ label: t?.title || 'Detalhe', path: 'formulario-detalhe' });
    }

    return (
      <nav className="bg-white border-b border-purple-100 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
          <Home className="w-4 h-4" />
          {crumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-300" />
              {idx === crumbs.length - 1 ? (
                <span className="text-purple-700 font-bold">{crumb.label}</span>
              ) : (
                <button onClick={() => navigateTo(crumb.path as any)} className="hover:text-purple-600">{crumb.label}</button>
              )}
            </div>
          ))}
        </div>
      </nav>
    );
  };

  const TicketDetailForm = ({ typeId }: { typeId: string }) => {
    const ticket = ticketTypes.find(t => t.id === typeId);
    const [formData, setFormData] = useState<any>({
      Nome: '', Email: '', CPF: '', Descricao: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const subject = encodeURIComponent(`[${ticket?.title.toUpperCase()}] Chamado de Suporte`);
      let body = `=== CHAMADO DE SUPORTE: ${ticket?.title} ===\n\n`;
      body += `DADOS DO CLIENTE:\n`;
      Object.entries(formData).forEach(([key, val]) => {
        if (val) body += `• ${key}: ${val}\n`;
      });
      body += `\nEnviado via Central de Suporte.`;
      
      window.location.href = `mailto:suporte@mediquo.com.br?subject=${subject}&body=${encodeURIComponent(body)}`;
    };

    if (!ticket) return null;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigateTo('formularios')} className="flex items-center gap-2 text-purple-600 font-bold mb-6 hover:underline">
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>

        <div className={`bg-gradient-to-br ${ticket.color} p-8 rounded-3xl text-white mb-8 shadow-xl shadow-purple-500/10`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">{ticket.icon}</div>
            <div>
              <h2 className="text-2xl font-black">{ticket.title}</h2>
              <p className="opacity-80">{ticket.description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-2xl p-6 sm:p-10 border border-gray-100 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo *</label>
              <input required type="text" value={formData.Nome || ''} onChange={e => setFormData({...formData, Nome: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Seu E-mail *</label>
              <input required type="email" value={formData.Email || ''} onChange={e => setFormData({...formData, Email: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Seu CPF *</label>
              <input required type="text" value={formData.CPF || ''} onChange={e => setFormData({...formData, CPF: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all" />
            </div>
            
            {ticket.fields.map((f, i) => (
              <div key={i} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="block text-sm font-bold text-gray-700 mb-2">{f.label} {f.required && '*'}</label>
                {f.type === 'select' ? (
                  <select required={f.required} value={formData[f.label] || ''} onChange={e => setFormData({...formData, [f.label]: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all">
                    <option value="" disabled>Selecione...</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input required={f.required} type={f.type} value={formData[f.label] || ''} placeholder={f.placeholder} onChange={e => setFormData({...formData, [f.label]: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all" />
                )}
              </div>
            ))}

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Descreva detalhadamente o problema *</label>
              <textarea required rows={5} value={formData.Descricao || ''} onChange={e => setFormData({...formData, Descricao: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none" placeholder="O que aconteceu?"></textarea>
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl font-black text-xl hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3">
            <Send className="w-5 h-5" /> Abrir Chamado
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] font-sans">
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigateTo('faq')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg"><Stethoscope className="w-6 h-6 text-white" /></div>
            <div className="text-left"><h1 className="font-bold text-gray-800 text-lg leading-none mb-1">Central de Suporte</h1><p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Telemedicina</p></div>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => navigateTo('faq')} className={`px-4 py-2 rounded-lg font-medium ${currentView === 'faq' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}>FAQ</button>
            <button onClick={() => navigateTo('formularios')} className={`px-4 py-2 rounded-lg font-medium ${currentView !== 'faq' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}>Formulários</button>
            <button onClick={openZohoChat} className="ml-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all hover:shadow-lg"><MessageCircle className="w-4 h-4" /> Suporte</button>
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2"><Menu /></button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2">
            <button onClick={() => navigateTo('faq')} className="w-full text-left p-3 rounded-xl hover:bg-purple-50">FAQ</button>
            <button onClick={() => navigateTo('formularios')} className="w-full text-left p-3 rounded-xl hover:bg-purple-50">Formulários</button>
            <button onClick={openZohoChat} className="w-full p-3 bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Suporte</button>
          </div>
        )}
      </header>

      <Breadcrumb />

      {currentView === 'faq' && (
        <>
          <section className="bg-gradient-to-br from-purple-700 via-violet-600 to-indigo-800 text-white py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold mb-8 shadow-xl"><Sparkles className="w-4 h-4 text-yellow-300" /><span>Central de Suporte e Ajuda</span></div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Olá! Como podemos<br /><span className="text-purple-200">te ajudar hoje?</span></h1>
              <p className="text-purple-100 text-lg max-w-2xl mx-auto mb-10 opacity-90 leading-relaxed">Encontre respostas rápidas para consultas, receitas, planos e muito mais. Estamos aqui para você!</p>
              
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400" />
                <input 
                  type="text" 
                  placeholder="Digite sua dúvida aqui..." 
                  value={searchTerm} 
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.length > 0) {
                      document.getElementById('faq-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }} 
                  className="w-full pl-14 pr-14 sm:pr-32 py-5 rounded-2xl text-gray-800 shadow-2xl outline-none focus:ring-4 focus:ring-purple-300 text-lg sm:text-xl" 
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-32 top-1/2 -translate-y-1/2 p-2 text-gray-400 hidden sm:block hover:text-purple-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hidden sm:block">Buscar</button>
                {/* Mobile clear button */}
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 sm:hidden"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Status Stats - Only show when NOT searching */}
              {!isSearching && (
                <div className="flex justify-center gap-12 md:gap-24 mt-16 font-bold text-purple-200 uppercase text-xs tracking-widest animate-fade-in">
                  <div className="text-center"><div className="text-3xl md:text-5xl text-white font-black mb-1">24h</div>Consultas</div>
                  <div className="text-center"><div className="text-3xl md:text-5xl text-white font-black mb-1">08-18h</div>Suporte</div>
                  <div className="text-center"><div className="text-3xl md:text-5xl text-white font-black mb-1">100%</div>Seguro</div>
                </div>
              )}
            </div>
          </section>

          {/* Chat CTA - Only show when NOT searching */}
          {!isSearching && (
            <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-20 mb-16 animate-fade-in">
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center shrink-0"><MessageCircle className="w-8 h-8 text-green-500" /></div>
                  <div className="text-left">
                    <div className="text-green-600 font-black uppercase text-xs mb-1 tracking-widest">Online agora</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Fale com o Suporte</h3>
                    <p className="text-gray-500 text-sm">Chat em tempo real · Seg a Sex, 08h às 18h</p>
                  </div>
                </div>
                <button onClick={openZohoChat} className="w-full md:w-auto bg-purple-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95">Iniciar Chat</button>
              </div>
            </section>
          )}

          {/* Quick Answers - Only show when NOT searching */}
          {!isSearching && !selectedCategory && (
            <section className="max-w-6xl mx-auto px-4 mb-20 animate-fade-in">
              <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3"><Zap className="w-6 h-6 text-purple-600" /> Respostas Rápidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickAnswers.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-3xl p-6 shadow-xl shadow-purple-500/5 border border-gray-100 hover:border-purple-200 transition-all">
                    <h3 className="font-bold text-gray-800 mb-3 leading-tight">{item.question}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Categories Grid - Only show when NOT searching */}
          {!isSearching && (
            <section className="max-w-6xl mx-auto px-4 mb-24 animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-gray-800 mb-4">Categorias</h2>
                <p className="text-gray-500">Escolha uma categoria para respostas rápidas</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {faqCategories.map(cat => (
                  <button key={cat.id} onClick={() => {
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                    document.getElementById('faq-results')?.scrollIntoView({ behavior: 'smooth' });
                  }} className={`p-8 rounded-[2rem] text-left transition-all hover:scale-105 group relative overflow-hidden ${selectedCategory === cat.id ? 'bg-gradient-to-br ' + colorMap[cat.color] + ' text-white shadow-2xl' : 'bg-white hover:shadow-2xl border border-gray-100'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${selectedCategory === cat.id ? 'bg-white/20' : bgColorMap[cat.color]}`}>{iconComponentMap[cat.icon]}</div>
                    <h3 className="font-black text-lg mb-2 leading-tight">{cat.title}</h3>
                    <p className={`text-xs ${selectedCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>{cat.description}</p>
                    <div className={`text-xs font-black uppercase mt-4 ${selectedCategory === cat.id ? 'text-white' : 'text-purple-600'}`}>{cat.items.length} artigos</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Accordion - RECTIVE RESULTS */}
          <section id="faq-results" className="max-w-4xl mx-auto px-4 mb-32 pt-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                {isSearching ? 'Resultados da Busca' : 'FAQ'}
              </div>
              <h2 className="text-3xl font-black text-gray-800 mb-4">
                {isSearching ? `Encontramos ${totalResults} resposta${totalResults !== 1 ? 's' : ''}` : 'Perguntas Frequentes'}
              </h2>
              {isSearching && (
                <button onClick={() => setSearchTerm('')} className="text-purple-600 font-bold hover:underline">
                  Limpar busca e ver tudo
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredFAQs.map(category => (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center gap-3 px-2 mt-8 mb-6">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[category.color]} text-white flex items-center justify-center shadow-lg shadow-purple-500/10`}>
                      <Info className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800">{category.title}</h3>
                  </div>
                  {category.items.map((item, idx) => {
                    const isOpen = expandedItems[`${category.id}-${idx}`];
                    return (
                      <div key={idx} className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-xl ring-2 ring-purple-500/10' : 'hover:shadow-md'}`}>
                        <button onClick={() => toggleItem(category.id, idx)} className="w-full px-6 py-5 flex items-center justify-between text-left group">
                          <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-purple-700' : 'text-gray-700'}`}>{item.question}</span>
                          <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180 text-purple-600' : 'text-gray-400'}`} />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 pt-0 border-t border-gray-100 pt-6 text-gray-600 leading-relaxed font-medium animate-fade-in text-base">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && isSearching && (
              <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200 animate-fade-in">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhuma resposta encontrada para "{searchTerm}"</h3>
                <p className="text-gray-400 mb-8">Tente usar palavras mais simples como "receita", "agendamento" ou "app".</p>
                <button onClick={() => setSearchTerm('')} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-black hover:bg-purple-700 transition-all">Ver todas as perguntas</button>
              </div>
            )}
          </section>

          <section className="max-w-4xl mx-auto px-4 mb-24">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-[3rem] p-10 md:p-16 text-white text-center shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Não encontrou sua resposta?</h2>
              <p className="text-purple-200 text-lg mb-10 opacity-80">Nossa equipe está pronta para analisar seu caso e responder o mais rápido possível.</p>
              <button onClick={() => navigateTo('formularios')} className="bg-white text-purple-900 px-10 py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"><ClipboardList className="w-6 h-6" /> Abrir um Chamado</button>
            </div>
          </section>
        </>
      )}

      {currentView === 'formularios' && (
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-gray-800 mb-4">Abrir Chamado</h1>
            <p className="text-gray-500">Selecione o tipo de problema abaixo</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => navigateTo('vero')} className="md:col-span-2 bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[2rem] text-white text-left hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0"><ShoppingBag className="w-8 h-8" /></div>
                <div><div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">Parceiro Vero</div><h3 className="text-2xl font-black mb-1">Suporte a Consultas Compradas - Vero</h3><p className="text-white/80">Resolva problemas com pacotes adquiridos via Vero</p></div>
                <div className="ml-auto"><ChevronRight className="w-6 h-6" /></div>
              </div>
            </button>
            {ticketTypes.map(t => (
              <button key={t.id} onClick={() => navigateTo('formulario-detalhe', t.id)} className="bg-white p-6 rounded-[2rem] border border-gray-100 text-left hover:shadow-2xl hover:border-purple-200 transition-all group flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.color} text-white flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>{t.icon}</div>
                <div className="flex-1"><h3 className="font-bold text-gray-800 mb-1 group-hover:text-purple-700">{t.title}</h3><p className="text-gray-400 text-sm">{t.description}</p></div>
                <ChevronRight className="w-5 h-5 text-gray-300 self-center group-hover:text-purple-600 group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </main>
      )}

      {currentView === 'formulario-detalhe' && selectedTicketId && <TicketDetailForm typeId={selectedTicketId} />}
      {currentView === 'vero' && <VeroForm onBack={() => navigateTo('formularios')} />}

      <footer className="bg-gray-950 text-gray-500 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gray-900 pb-12 mb-12">
            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center"><Stethoscope className="w-6 h-6 text-white" /></div><span className="text-xl font-bold text-white tracking-tight">Central de Suporte</span></div>
            <div className="flex gap-8 text-sm font-bold"><button onClick={() => navigateTo('faq')} className="hover:text-purple-400 transition-colors uppercase tracking-widest">FAQ</button><button onClick={() => navigateTo('formularios')} className="hover:text-purple-400 transition-colors uppercase tracking-widest">Chamados</button></div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold uppercase tracking-widest">
            <p>© {new Date().getFullYear()} Telemedicina. Todos os direitos reservados.</p>
            <div className="flex gap-6"><span className="flex items-center gap-1">LGPD</span><span className="flex items-center gap-1">CFM</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
