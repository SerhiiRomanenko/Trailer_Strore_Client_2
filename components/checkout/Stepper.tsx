import React from 'react';

interface StepperProps {
    steps: string[];
    currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center w-full max-w-2xl mx-auto">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = currentStep > stepNumber;
                const isActive = currentStep === stepNumber;

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                transition-all duration-300 border-2
                                ${isCompleted ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white' : ''}
                                ${isActive ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : ''}
                                ${!isCompleted && !isActive ? 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-tertiary)]' : ''}
                            `}>
                                {isCompleted ? '✓' : stepNumber}
                            </div>
                            <p className={`mt-2 font-semibold text-sm sm:text-base transition-colors ${
                                isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-tertiary)]'
                            }`}>
                                {step}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`
                                flex-1 h-1 mx-2 sm:mx-4 rounded
                                transition-colors duration-300
                                ${isCompleted ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}
                            `}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Stepper;
