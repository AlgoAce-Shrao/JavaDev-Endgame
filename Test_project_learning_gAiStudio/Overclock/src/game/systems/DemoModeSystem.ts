import { DEMO_SCENARIO_STEPS, DemoStepDef } from '../data/demoScenario';

export class DemoModeSystem {
  public isActive: boolean = false;
  public currentStepIndex: number = 0;
  public stepProgress: number = 0;
  public stepTimerSec: number = 0;
  public isComplete: boolean = false;
  public demoTotalKills: number = 0;
  public demoMaxHeat: number = 0;

  constructor() {}

  public startDemo() {
    this.isActive = true;
    this.currentStepIndex = 0;
    this.stepProgress = 0;
    this.stepTimerSec = 0;
    this.isComplete = false;
    this.demoTotalKills = 0;
    this.demoMaxHeat = 0;
  }

  public stopDemo() {
    this.isActive = false;
  }

  public getCurrentStep(): DemoStepDef | null {
    if (!this.isActive || this.currentStepIndex >= DEMO_SCENARIO_STEPS.length) {
      return null;
    }
    return DEMO_SCENARIO_STEPS[this.currentStepIndex];
  }

  public onEnemyKilled(): boolean {
    if (!this.isActive) return false;
    this.demoTotalKills++;
    this.stepProgress++;

    const currentStep = this.getCurrentStep();
    if (currentStep && this.stepProgress >= currentStep.targetCount) {
      return this.advanceStep();
    }
    return false;
  }

  public onHeatReached(heat: number): boolean {
    if (!this.isActive) return false;
    if (heat > this.demoMaxHeat) {
      this.demoMaxHeat = heat;
    }

    const currentStep = this.getCurrentStep();
    if (currentStep && currentStep.id === 3 && heat >= 50 && this.stepProgress === 0) {
      this.stepProgress = 1;
      return this.advanceStep();
    }
    return false;
  }

  public onPlayerMoved(dt: number): boolean {
    if (!this.isActive) return false;
    const currentStep = this.getCurrentStep();
    if (currentStep && currentStep.id === 1) {
      this.stepTimerSec += dt;
      if (this.stepTimerSec >= 2.5) {
        return this.advanceStep();
      }
    }
    return false;
  }

  public advanceStep(): boolean {
    this.currentStepIndex++;
    this.stepProgress = 0;
    this.stepTimerSec = 0;

    if (this.currentStepIndex >= DEMO_SCENARIO_STEPS.length) {
      this.isComplete = true;
      return true; // Finished all steps
    }
    return false;
  }
}
