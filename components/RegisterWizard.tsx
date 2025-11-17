import { useMemo, useState } from 'react';
import { wizardSteps, WizardStep } from '@/lib/wizardSteps';

const MIN_CHARACTERS = 40;

const validateStep = (step: WizardStep, value: string) => {
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
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedSteps, setTouchedSteps] = useState<Record<string, boolean>>({});

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

  const goToStep = (direction: 'next' | 'back') => {
    setCurrentIndex((index) => {
      if (direction === 'next') {
        return Math.min(wizardSteps.length - 1, index + 1);
      }
      return Math.max(0, index - 1);
    });
  };

  const handleChange = (step: WizardStep, value: string) => {
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

  return (
    <section className="card">
      <header style={{ marginBottom: '1rem' }}>
        <h1>Cadastro guiado (9 passos)</h1>
        <p>Preencha o pitch padrão SMC: Problema → Validação → Produto → Mercado → Modelo → Métricas → Entrega → Preço.</p>
        <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>Conclusão: {completion}%</div>
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
      </div>

      <footer className="wizard-footer">
        <button className="button secondary" onClick={() => goToStep('back')} disabled={currentIndex === 0}>
          Voltar
        </button>
        <button className="button primary" onClick={handleNext} disabled={disableNext}>
          Próximo
        </button>
      </footer>
    </section>
  );
};

export default RegisterWizard;
