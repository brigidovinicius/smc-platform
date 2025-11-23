import { useMemo, useState, useEffect, useCallback } from 'react';
import { wizardSteps } from '@/lib/wizardSteps';
import CardWrapper from '@/components/ui/CardWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <CardWrapper
        title={`Cadastro guiado (${wizardSteps.length} passos)`}
        description="Preencha o pitch padrão SMC: Problema → Validação → Produto → Mercado → Modelo → Métricas → Entrega → Preço."
        actions={
          lastSaved && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              {isSaving ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <span className="text-emerald-500">✓</span>
                  <span>Salvo {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          )
        }
      >
        <div className="space-y-6">

          {/* Progress Bar Visual */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-foreground">
                Progresso: {completion}%
              </span>
              <span className="text-sm text-muted-foreground">
                Passo {currentIndex + 1} de {wizardSteps.length}
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full relative"
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
                      ? 'bg-primary ring-2 ring-primary/30 ring-offset-2'
                      : isPast
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                  title={`${index + 1}. ${step.title}${isCompleted ? ' ✓' : ''}`}
                />
              );
            })}
          </div>

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wizardSteps.map((step, index) => {
              const isCompleted = progress[step.id]?.trim() && !validateStep(step, progress[step.id] ?? '');
              const isActive = index === currentIndex;
              
              return (
                <Card
                  key={step.id}
                  className={`cursor-pointer transition-all ${
                    isActive
                      ? 'border-primary ring-2 ring-primary/20'
                      : isCompleted
                      ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-border'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <span className={`text-sm font-semibold ${
                        isCompleted ? 'text-emerald-600' : isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {index + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <strong className={`block text-sm ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </strong>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {step.description}
                        </p>
                        {step.optional && (
                          <span className="text-xs text-muted-foreground mt-1 block">Opcional</span>
                        )}
                      </div>
                      {isCompleted && (
                        <span className="text-emerald-500 text-sm">✓</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Current Step Input */}
          <div className="space-y-3">
            <label htmlFor={currentStep.id} className="block text-lg font-semibold text-foreground">
              {currentStep.title}
              {currentStep.optional && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">(opcional)</span>
              )}
            </label>
            <p className="text-sm text-muted-foreground mb-3">{currentStep.description}</p>
            <textarea
              id={currentStep.id}
              placeholder={currentStep.description}
              value={currentValue}
              onChange={(event) => handleChange(currentStep, event.target.value)}
              onBlur={() => setTouchedSteps((prev) => ({ ...prev, [currentStep.id]: true }))}
              className={`w-full min-h-[160px] p-4 rounded-lg border-2 transition-all duration-200 resize-y focus:outline-none focus:ring-2 ${
                shouldShowError
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20 bg-destructive/5'
                  : 'border-input focus:border-primary focus:ring-primary/20 bg-background'
              }`}
            />
            {shouldShowError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <span>⚠</span>
                {currentBlockingError}
              </p>
            )}
            <div className="flex justify-between items-center text-sm">
              <span
                className={`font-medium ${
                  currentValue.trim().length >= MIN_CHARACTERS
                    ? 'text-emerald-600'
                    : 'text-muted-foreground'
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

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => goToStep('back')}
                disabled={currentIndex === 0}
              >
                ← Voltar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
              >
                💾 Salvar rascunho
              </Button>
              {lastSaved && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDraft}
                >
                  Limpar
                </Button>
              )}
            </div>
            <Button
              onClick={handleNext}
              disabled={disableNext}
              className="w-full sm:w-auto"
            >
              {currentIndex === wizardSteps.length - 1 ? '✨ Finalizar' : 'Próximo →'}
            </Button>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

export default RegisterWizard;
