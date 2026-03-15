import { type Step } from '../types/index';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="flex flex-col gap-0.5 p-2">
      {steps.map((step, index) => (
        <div
          key={`${index}-${step.title}`}
          onClick={() => onStepClick(step.id)}
          className={`flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${currentStep === step.id
            ? 'bg-purple-50 dark:bg-purple-900/20'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
        >
          {/* Status icon */}
          <div className="mt-0.5 shrink-0">
            {step.status === 'completed' ? (
              <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            ) : step.status === 'in-progress' ? (
              <div className="w-4 h-4 rounded-full border-2 border-amber-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" />
            )}
          </div>

          {/* Text */}
          <div className="min-w-0">
            <p className={`text-xs font-medium leading-tight ${step.status === 'completed'
              ? 'text-purple-700 dark:text-purple-400'
              : step.status === 'in-progress'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
              }`}>
              {step.title}
            </p>
            {step.description && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}