import React, { useState } from 'react';
import { Send, ShoppingCart, CheckCircle, User, ShoppingBag, FileText } from 'lucide-react';

interface VeroFormProps {
  onBack: () => void;
}

const VeroForm: React.FC<VeroFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    quantidade: '',
    dataCompra: '',
    valor: '',
    descricao: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(`[VERO] Suporte Consultas Compradas - ${formData.nome}`);
    const body = encodeURIComponent(
      `FORMULÁRIO DE SUPORTE - CONSULTAS COMPRADAS VERO\n` +
      `${'='.repeat(50)}\n\n` +
      `DADOS DO CLIENTE:\n` +
      `• Nome: ${formData.nome}\n` +
      `• E-mail: ${formData.email}\n` +
      `• Telefone: ${formData.telefone}\n` +
      `• CPF: ${formData.cpf}\n\n` +
      `INFORMAÇÕES DA COMPRA:\n` +
      `• Quantidade de consultas: ${formData.quantidade}\n` +
      `• Data da compra: ${formData.dataCompra}\n` +
      `• Valor pago: R$ ${formData.valor}\n\n` +
      `DESCRIÇÃO DO PROBLEMA:\n` +
      `${formData.descricao}\n\n` +
      `${'='.repeat(50)}\n` +
      `Enviado via Central de Suporte - Formulário Vero`
    );

    window.location.href = `mailto:suporte@mediquo.com.br?subject=${subject}&body=${body}`;
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Chamado Preparado!</h2>
        <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
          Seu aplicativo de e-mail foi aberto com os dados preenchidos. 
          Basta clicar em <strong>enviar</strong> para finalizar.
        </p>
        <button
          onClick={onBack}
          className="px-10 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95"
        >
          Voltar para Formulários
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[2rem] p-8 md:p-12 mb-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">Parceiro Vero</div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Suporte Consultas</h1>
            <p className="text-emerald-100 text-lg opacity-80 font-medium">Resolva problemas com pacotes adquiridos via Vero</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border border-gray-100">
          <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><User className="w-6 h-6 text-purple-600" /></div>
            Seus Dados Pessoais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Nome completo *</label>
              <input type="text" name="nome" required value={formData.nome || ''} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:bg-white outline-none transition-all font-medium text-gray-900" placeholder="Como devemos te chamar?" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">E-mail *</label>
              <input type="email" name="email" required value={formData.email || ''} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:bg-white outline-none transition-all font-medium text-gray-900" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Telefone / WhatsApp *</label>
              <input type="tel" name="telefone" required value={formData.telefone || ''} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:bg-white outline-none transition-all font-medium text-gray-900" placeholder="(00) 00000-0000" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">CPF *</label>
              <input type="text" name="cpf" required value={formData.cpf || ''} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:bg-white outline-none transition-all font-medium text-gray-900" placeholder="000.000.000-00" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border border-gray-100">
          <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-emerald-600" /></div>
            Informações da Compra
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Qtd. Consultas *</label>
              <input type="number" name="quantidade" required value={formData.quantidade || ''} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:bg-white outline-none transition-all font-medium text-gray-900" placeholder="Ex: 5" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Data Compra *</label>
              <input type="date" name="dataCompra" required value={formData.dataCompra || ''} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:bg-white outline-none transition-all font-medium text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Valor Pago *</label>
              <input type="text" name="valor" required value={formData.valor || ''} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:bg-white outline-none transition-all font-medium text-gray-900" placeholder="Ex: 99,90" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border border-gray-100">
          <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-violet-600" /></div>
            Descrição do Problema
          </h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">O que aconteceu? *</label>
            <textarea name="descricao" required rows={6} value={formData.descricao || ''} onChange={handleChange} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:bg-white outline-none transition-all font-medium text-gray-900 resize-none" placeholder="Descreva detalhadamente o problema com suas consultas compradas na Vero..."></textarea>
          </div>
        </div>

        <button type="submit" className="w-full py-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-[1.5rem] font-black text-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
          <Send className="w-6 h-6" /> Enviar Chamado
        </button>

        <p className="text-center text-gray-400 text-sm font-bold pb-12">Ao enviar, seu aplicativo de e-mail será aberto com os dados preenchidos.</p>
      </form>
    </div>
  );
};

export default VeroForm;
