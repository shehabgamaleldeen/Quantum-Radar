export enum CarType {
  Private = 'Private',
  Truck = 'Truck',
  Bus = 'Bus'
}

export interface Observation {
  plateNumber: string;
  date: Date;
  carType: CarType;
  speed: number;
  seatbeltFastened: boolean;
}

export interface Violation {
  description: string;
  fee: number;
  ruleName: string;
}

export interface Fine {
  plateNumber: string;
  totalAmount: number;
  violations: Violation[];
}

export interface Rule {
  name: string;
  evaluate(observation: Observation): Violation | null;
}

export class SeatbeltRule implements Rule {
  name = 'SeatbeltRule';
  
  constructor(private fee: number) {}

  evaluate(obs: Observation): Violation | null {
    if (!obs.seatbeltFastened) {
      return {
        description: 'Seatbelt not fastned',
        fee: this.fee,
        ruleName: this.name
      };
    }
    return null;
  }
}

export class SpeedLimitRule implements Rule {
  name = 'SpeedLimitRule';
  
  constructor(
    private carType: CarType, 
    private maxSpeed: number, 
    private fee: number
  ) {}

  evaluate(obs: Observation): Violation | null {
    if (obs.carType === this.carType && obs.speed > this.maxSpeed) {
      return {
        description: `speed of ${obs.speed} exceeded max allowed ${this.maxSpeed}`,
        fee: this.fee,
        ruleName: this.name
      };
    }
    return null;
  }
}

export class Radar {
  private rules: Rule[] = [];
  private fines: Fine[] = [];
  private ruleViolationsCount: Map<string, number> = new Map();

  addRule(rule: Rule) {
    this.rules.push(rule);
  }

  processObservation(obs: Observation) {
    const violations: Violation[] = [];
    let totalAmount = 0;

    for (const rule of this.rules) {
      const violation = rule.evaluate(obs);
      if (violation) {
        violations.push(violation);
        totalAmount += violation.fee;
        
        // track violated rule
        const currentCount = this.ruleViolationsCount.get(violation.ruleName) || 0;
        this.ruleViolationsCount.set(violation.ruleName, currentCount + 1);
      }
    }

    if (violations.length > 0) {
      const fine: Fine = {
        plateNumber: obs.plateNumber,
        totalAmount,
        violations
      };
      this.fines.push(fine);
      this.printFine(fine);
    }
  }

  private printFine(fine: Fine) {
    console.log(`Traffic fine for car ${fine.plateNumber}`);
    console.log(`Total amount: ${fine.totalAmount} EGP`);
    console.log('Violations:');
    for (const v of fine.violations) {
      console.log(` - ${v.description}  : ${v.fee} EGP`);
    }
    console.log('');
  }

  getAllFines() {
    return this.fines.map(f => ({
      plateNumber: f.plateNumber,
      totalAmount: f.totalAmount
    }));
  }

  getViolatedRulesCount() {
    const counts: Record<string, number> = {};
    for (const [ruleName, count] of this.ruleViolationsCount.entries()) {
      counts[ruleName] = count;
    }
    return counts;
  }
}
