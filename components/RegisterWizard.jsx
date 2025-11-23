import { useMemo, useState, useEffect, useCallback } from 'react';
import { wizardSteps } from '@/lib/wizardSteps';

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
    <section className="card">
      <header className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Cadastro guiado ({wizardSteps.length} passos)
            </h1>
            <p className="text-slate-600">
              Preencha o pitch padrão SMC: Problema → Validação → Produto → Mercado → Modelo → Métricas → Entrega → Preço.
            </p>
          </div>
          {lastSaved && (
            <div className="text-xs text-slate-500 flex items-center gap-2">
              {isSaving ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <span className="text-emerald-500">✓</span>
                  <span>Salvo {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar Visual */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">
              Progresso: {completion}%
            </span>
            <span className="text-sm text-slate-500">
              Passo {currentIndex + 1} de {wizardSteps.length}
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full relative"
              style={{ width: `${completion}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {wizardSteps.map((step, index) => {
            const isCompleted = progress[step.id]?.trim() && !validateStep(step, progress[step.id] ?? '');
            const isActive = index === currentIndex;
            const isPast = index < currentIndex;

            return (
              <div
                key={step.id}
                className={`flex-1 min-w-[60px] h-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : isActive
                    ? 'bg-indigo-500 ring-2 ring-indigo-300 ring-offset-2'
                    : isPast
                    ? 'bg-indigo-300'
                    : 'bg-slate-200'
                }`}
                title={`${index + 1}. ${step.title}${isCompleted ? ' ✓' : ''}`}
              />
            );
          })}
        </div>
      </header>

      <div className="steps-grid" style={{ marginBottom: '1.5rem' }}>
        {wizardSteps.map((step, index) => (
          <div
            key={step.id}
            className={`step-card ${index === currentIndex ? 'active' : ''} ${
              progress[step.id]?.trim() && !validateStep(step, progress[step.id] ?? '') ? 'completed' : ''
            }`}
          >
            <strong>
              {index + 1}. {step.title}
            </strong>
            <p>{step.description}</p>
            {step.optional && <small>Opcional</small>}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <label htmlFor={currentStep.id} className="block text-lg font-semibold text-slate-900">
          {currentStep.title}
          {currentStep.optional && (
            <span className="ml-2 text-sm font-normal text-slate-500">(opcional)</span>
          )}
        </label>
        <p className="text-sm text-slate-600 mb-3">{currentStep.description}</p>
        <textarea
          id={currentStep.id}
          placeholder={currentStep.description}
          value={currentValue}
          onChange={(event) => handleChange(currentStep, event.target.value)}
          onBlur={() => setTouchedSteps((prev) => ({ ...prev, [currentStep.id]: true }))}
          className={`w-full min-h-[160px] p-4 rounded-xl border-2 transition-all duration-200 resize-y focus:outline-none focus:ring-2 ${
            shouldShowError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200 bg-white'
          }`}
        />
        {shouldShowError && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span>⚠</span>
            {currentBlockingError}
          </p>
        )}
        <div className="flex justify-between items-center text-sm">
          <span
            className={`font-medium ${
              currentValue.trim().length >= MIN_CHARACTERS
                ? 'text-emerald-600'
                : 'text-slate-500'
            }`}
          >
            {currentValue.trim().length} / {MIN_CHARACTERS} caracteres mínimos
          </span>
          {currentValue.trim().length >= MIN_CHARACTERS && (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              ✓ Pronto para avançar
            </span>
          )}
        </div>
      </div>

      <footer className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-200">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => goToStep('back')}
            disabled={currentIndex === 0}
          >
            ← Voltar
          </button>
          <button
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
            onClick={handleSaveDraft}
          >
            💾 Salvar rascunho
          </button>
          {lastSaved && (
            <button
              className="px-3 py-2 rounded-lg text-slate-500 hover:text-slate-700 text-sm transition-colors"
              onClick={clearDraft}
            >
              Limpar
            </button>
          )}
        </div>
        <button
          className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
            disableNext
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
          onClick={handleNext}
          disabled={disableNext}
        >
          {currentIndex === wizardSteps.length - 1 ? '✨ Finalizar' : 'Próximo →'}
        </button>
      </footer>
    </section>
  );
};

export default RegisterWizard;
