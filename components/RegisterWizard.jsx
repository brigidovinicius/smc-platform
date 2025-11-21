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
      <header style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
          <h1>Cadastro guiado ({wizardSteps.length} passos)</h1>
          {lastSaved && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {isSaving ? 'Salvando...' : `Salvo ${lastSaved.toLocaleTimeString()} `}
            </div>
          )}
        </div>
        <p>Preencha o pitch padrão SMC: Problema → Validação → Produto → Mercado → Modelo → Métricas → Entrega → Preço.</p>
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 600 }}>Conclusão: {completion}%</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Passo {currentIndex + 1} de {wizardSteps.length}
          </div>
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

      <div>
        <label htmlFor={currentStep.id} style={{ fontWeight: 600 }}>
          {currentStep.title}
          {currentStep.optional && <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}> (opcional)</span>}
        </label>
        <textarea
          id={currentStep.id}
          placeholder={currentStep.description}
          value={currentValue}
          onChange={(event) => handleChange(currentStep, event.target.value)}
          onBlur={() => setTouchedSteps((prev) => ({ ...prev, [currentStep.id]: true }))}
          style={{
            width: '100%',
            minHeight: '140px',
            marginTop: '0.5rem',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            border: shouldShowError ? '1px solid #f87171' : '1px solid #cbd5f5'
          }}
        />
        {shouldShowError && <p className="input-error">{currentBlockingError}</p>}
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          {currentValue.trim().length} / {MIN_CHARACTERS} caracteres mínimos
        </div>
      </div>

      <footer className="wizard-footer">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="button secondary" onClick={() => goToStep('back')} disabled={currentIndex === 0}>
            Voltar
          </button>
          <button className="button ghost" onClick={handleSaveDraft}>
            💾 Salvar rascunho
          </button>
          {lastSaved && (
            <button className="button ghost" onClick={clearDraft} style={{ fontSize: '0.875rem' }}>
              Limpar
            </button>
          )}
        </div>
        <button className="button primary" onClick={handleNext} disabled={disableNext}>
          {currentIndex === wizardSteps.length - 1 ? 'Finalizar' : 'Próximo'}
        </button>
      </footer>
    </section>
  );
};

export default RegisterWizard;
