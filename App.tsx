import { useState } from "react";
import { WelcomeStep } from "./components/WelcomeStep";
import { WiringStep } from "./components/WiringStep";
import { ServerSetupStep } from "./components/ServerSetupStep";
import { PortSetupStep } from "./components/PortSetupStep";
import { OnlineTestStep } from "./components/OnlineTestStep";
import { TroubleshootingStep } from "./components/TroubleshootingStep";
import { FinishStep } from "./components/FinishStep";
import { Progress } from "./components/ui/progress";

export type StepType = 
  | "welcome"
  | "wiring"
  | "server"
  | "port"
  | "test"
  | "troubleshooting"
  | "finish";

export interface SetupData {
  serverType: "ip" | "url";
  serverValue: string;
  password: string;
  port: string;
  simInstalled: boolean;
  deviceOutside: boolean;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepType>("welcome");
  const [setupData, setSetupData] = useState<SetupData>({
    serverType: "ip",
    serverValue: "",
    password: "123456",
    port: "7015",
    simInstalled: false,
    deviceOutside: false,
  });

  const steps: StepType[] = ["welcome", "wiring", "server", "port", "test", "troubleshooting", "finish"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const goToStep = (step: StepType) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeStep onNext={nextStep} />;
      case "wiring":
        return (
          <WiringStep
            setupData={setupData}
            setSetupData={setSetupData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case "server":
        return (
          <ServerSetupStep
            setupData={setupData}
            setSetupData={setSetupData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case "port":
        return (
          <PortSetupStep
            setupData={setupData}
            setSetupData={setSetupData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case "test":
        return (
          <OnlineTestStep
            setupData={setupData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case "troubleshooting":
        return (
          <TroubleshootingStep
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case "finish":
        return <FinishStep onRestart={() => setCurrentStep("welcome")} />;
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {currentStep !== "welcome" && currentStep !== "finish" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">راه‌اندازی دستگاه RG110</h1>
              <span className="text-sm text-gray-600">
                مرحله {currentStepIndex + 1} از {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <div className="transition-all duration-300 ease-in-out">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}