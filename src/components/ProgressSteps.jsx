import React from 'react';

const steps = [
  { number: 1, label: 'Delivery' },
  { number: 2, label: 'Configure' },
  { number: 3, label: 'Login' },
  { number: 4, label: 'Billing' },
  { number: 5, label: 'Payment' },
  { number: 6, label: 'Review' },
  { number: 7, label: 'Thank You' },
];

function ProgressSteps({ currentStep }) {
  return (
    <div className="progress-steps">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div
            className={`progress-step ${
              currentStep === step.number
                ? 'active'
                : currentStep > step.number
                ? 'completed'
                : ''
            }`}
          >
            <div className="progress-step-number">
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <span className="progress-step-label">{step.label}</span>
          </div>
          {index < steps.length - 1 && <div className="progress-step-line" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default ProgressSteps;
