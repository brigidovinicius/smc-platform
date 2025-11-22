import { useMemo, useState, useEffect, useCallback } from 'react';
import { wizardSteps } from '@/lib/wizardSteps';
import { CheckCircle, Save, Trash2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

const MIN_CHARACTERS = 20; // Reduced from 40 for better UX
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = 'smc_wizard_draft';

const validateStep = (step, value) => {
  const trimmed = value.trim();

  if (step.optional && trimmed.length === 0) {
    return '';
  }

  if (!trimmed) {
    return 'Descreva este passo para avançar.';
  }

  if (trimmed.length < MIN_CHARACTERS) {
    return `Use pelo menos ${MIN_CHARACTERS} caracteres para contextualizar.`;
  }

  return '';
};

const RegisterWizard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [touchedSteps, setTouchedSteps] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setProgress(data.progress || {});
        setLastSaved(new Date(data.timestamp));
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, []);

  // Auto-save to localStorage
  const saveDraft = useCallback(() => {
    try {
      setIsSaving(true);
      const data = {
        progress,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [progress]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(progress).length > 0) {
        saveDraft();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [progress, saveDraft]);

  const currentStep = wizardSteps[currentIndex];
  const currentValue = progress[currentStep.id] ?? '';
  const currentBlockingError = errors[currentStep.id] ?? validateStep(currentStep, currentValue);
  const shouldShowError = touchedSteps[currentStep.id] && Boolean(currentBlockingError);
  const disableNext = currentIndex === wizardSteps.length - 1 || Boolean(currentBlockingError);

  const completion = useMemo(() => {
    const filled = wizardSteps.filter((step) => {
      const value = progress[step.id] ?? '';
      return value.trim().length > 0 && !validateStep(step, value);
    }).length;
    return Math.round((filled / wizardSteps.length) * 100);
  }, [progress]);

  const goToStep = (direction) => {
    setCurrentIndex((index) => {
      if (direction === 'next') {
        return Math.min(wizardSteps.length - 1, index + 1);
      }
      return Math.max(0, index - 1);
    });
  };

  const handleChange = (step, value) => {
    setProgress((prev) => ({ ...prev, [step.id]: value }));
    setTouchedSteps((prev) => ({ ...prev, [step.id]: true }));
    setErrors((prev) => ({ ...prev, [step.id]: validateStep(step, value) }));
  };

  const handleNext = () => {
    setTouchedSteps((prev) => ({ ...prev, [currentStep.id]: true }));
    setErrors((prev) => ({ ...prev, [currentStep.id]: currentBlockingError }));
    if (currentBlockingError) {
      return;
    }

    goToStep('next');
  };

  const handleSaveDraft = () => {
    saveDraft();
    alert('Rascunho salvo com sucesso! Você pode continuar depois.');
  };

  const clearDraft = () => {
    if (confirm('Tem certeza que deseja limpar o rascunho?')) {
      localStorage.removeItem(STORAGE_KEY);
      setProgress({});
      setLastSaved(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-heading">Cadastro guiado</h1>
              <p className="text-slate-500 mt-1">Preencha o pitch padrão SMC para valorizar seu ativo.</p>
            </div>
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                <span>{isSaving ? 'Salvando...' : `Salvo às ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="font-medium text-slate-700">Progresso do Dossiê</span>
              <span className="font-bold text-indigo-600">{completion}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-400 text-right">
              Passo {currentIndex + 1} de {wizardSteps.length}
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
          {/* Sidebar Steps */}
          <div className="hidden lg:block space-y-3 sticky top-8">
            {wizardSteps.map((step, index) => {
              const isCompleted = progress[step.id]?.trim() && !validateStep(step, progress[step.id] ?? '');
              const isActive = index === currentIndex;

              return (
                <div
                  key={step.id}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border ${isActive
                      ? 'bg-white border-indigo-200 shadow-md shadow-indigo-500/5 scale-105'
                      : isCompleted
                        ? 'bg-white/50 border-slate-200 text-slate-500'
                        : 'bg-transparent border-transparent text-slate-400'
                    }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${isActive
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                    {isCompleted ? <CheckCircle size={16} /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-slate-900' : ''}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
                    {currentIndex + 1}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    {currentStep.title}
                  </h2>
                  {currentStep.optional && (
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Opcional
                    </span>
                  )}
                </div>
                <p className="text-slate-500 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              <div className="relative">
                <textarea
                  id={currentStep.id}
                  placeholder="Digite sua resposta aqui..."
                  value={currentValue}
                  onChange={(event) => handleChange(currentStep, event.target.value)}
                  onBlur={() => setTouchedSteps((prev) => ({ ...prev, [currentStep.id]: true }))}
                  className={`w-full min-h-[240px] p-4 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all resize-none ${shouldShowError
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                />
                <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-100">
                  {currentValue.trim().length} / {MIN_CHARACTERS} chars
                </div>
              </div>

              {shouldShowError && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
                  {currentBlockingError}
                </p>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => goToStep('back')}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Voltar</span>
                </button>

                {lastSaved && (
                  <button
                    onClick={clearDraft}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Limpar rascunho"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveDraft}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  <Save size={16} />
                  Salvar
                </button>

                <button
                  onClick={handleNext}
                  disabled={disableNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {currentIndex === wizardSteps.length - 1 ? 'Finalizar' : 'Próximo'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterWizard;
