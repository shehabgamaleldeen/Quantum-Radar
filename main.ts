import { Radar, SeatbeltRule, SpeedLimitRule, CarType, Observation } from './radar';

class Main {
  static run() {
    const radar = new Radar();

    // 1.defined rules
    radar.addRule(new SeatbeltRule(100));
    radar.addRule(new SpeedLimitRule(CarType.Private, 80, 300));
    radar.addRule(new SpeedLimitRule(CarType.Truck, 60, 400));
    

    // 2. observations from the physical radar
    const obs1: Observation = {
      plateNumber: 'ABC1234',
      date: new Date(),
      carType: CarType.Private,
      speed: 94,
      seatbeltFastened: false
    };

    const obs2: Observation = {
      plateNumber: 'XYZ9876',
      date: new Date(),
      carType: CarType.Truck,
      speed: 55, 
      seatbeltFastened: true
    };

    const obs3: Observation = {
      plateNumber: 'DEF5678',
      date: new Date(),
      carType: CarType.Truck,
      speed: 75,
      seatbeltFastened: false
    };

    console.log("=== Processing Radar Observations ===\n");
    radar.processObservation(obs1);
    radar.processObservation(obs2);
    radar.processObservation(obs3);

    console.log("\nSystem Reports\n");
    
    console.log("1. All Fines (Plate Number & Total Amount):");
    console.log(radar.getAllFines());

    console.log("\n2. Violated Rules with Counts:");
    console.log(radar.getViolatedRulesCount());
  }
}
Main.run();
