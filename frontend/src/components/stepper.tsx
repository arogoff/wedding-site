import React, { useState, Children, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type StepperProps = {
  children: React.ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  onCancel?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  cancelButtonText?: string;
  disableStepIndicators?: boolean;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (step: number) => void;
  }) => React.ReactNode;
  [key: string]: any;
};

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  onCancel = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  cancelButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  cancelButtonText = "Cancel",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    onCancel();
  };

  const handleCancelDismiss = () => {
    setShowCancelModal(false);
  };

  return (
    <div className="w-full" {...rest}>
      <div
        className={`w-full rounded-lg shadow-md border border-gray-200 ${stepCircleContainerClassName}`}
      >
        <div
          className={`${stepContainerClassName} flex w-full items-center px-6 pt-6`}
        >
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked: number) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`px-6 py-6 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>
        {!isCompleted && (
          <div className={`px-6 pb-6 ${footerClassName}`}>
            <div className="mt-6 flex justify-between">
              <div>
                {currentStep !== 1 ? (
                  <button
                    onClick={handleBack}
                    className={`duration-350 rounded-md px-4 py-2 transition text-gray-600 border border-gray-300 hover:bg-gray-50 ${
                      currentStep === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                    {...backButtonProps}
                  >
                    {backButtonText}
                  </button>
                ) : (
                  <button
                    onClick={handleCancelClick}
                    className="duration-350 rounded-md px-4 py-2 transition text-gray-600 border border-gray-300 hover:bg-gray-50"
                    {...cancelButtonProps}
                  >
                    {cancelButtonText}
                  </button>
                )}
              </div>
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="duration-350 flex items-center justify-center rounded-md bg-green-500 py-2 px-4 font-medium tracking-tight text-white transition hover:bg-green-600 active:bg-green-700"
                {...nextButtonProps}
              >
                {isLastStep ? "Complete" : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-medium mb-4">Cancel Changes?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel? Any changes you have made will
              not be saved.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDismiss}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Keep Editing
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type StepContentWrapperProps = {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: React.ReactNode;
  className?: string;
};

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h: number) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

type SlideTransitionProps = {
  children: React.ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
};

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-50%" : "50%",
    opacity: 0,
  }),
};

export function Step({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}: {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
  disableStepIndicators: boolean;
}) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
        ? "inactive"
        : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };

  const colors = {
    inactive: "bg-gray-200 text-gray-600",
    active: "bg-gray-500 text-white", // change color here for theme
    complete: "bg-gray-300 text-white", // change color here for theme
  };

  return (
    <div
      onClick={handleClick}
      className={`relative ${disableStepIndicators ? "" : "cursor-pointer"} outline-none focus:outline-none`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full font-medium transition-colors duration-300 ${colors[status]}`}
      >
        {status === "complete" ? (
          <CheckIcon className="h-4 w-4 text-white" />
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </div>
    </div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-gray-200">
      <div
        className={`absolute left-0 top-0 h-full bg-gray-400 transition-all duration-300 ease-in-out ${
          // change color here for theme
          isComplete ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
