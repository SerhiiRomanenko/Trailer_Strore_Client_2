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
                                ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                                ${isActive ? 'bg-orange-500 border-orange-500 text-white' : ''}
                                ${!isCompleted && !isActive ? 'bg-slate-200 border-slate-200 text-slate-500' : ''}
                            `}>
                                {isCompleted ? '✓' : stepNumber}
                            </div>
                            <p className={`mt-2 font-semibold text-sm sm:text-base transition-colors ${isActive ? 'text-orange-600' : 'text-slate-500'}`}>
                                {step}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`
                                flex-1 h-1 mx-2 sm:mx-4 rounded
                                transition-colors duration-300
                                ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}
                            `}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Stepper;