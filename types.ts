
export interface WageData {
  weeklyGross: number;
  holidayLoad: number;
  travelDays: number;
  travelHours: number;
  faresAllowance: number;
  workCover: number;
  superannuation: number;
  lsl: number;
}

export interface TimeData {
  annualLeaveDays: number;
  sickDays: number;
  publicHolidays: number;
  lostHoursPerDay: number;
  standardHoursPerDay: number;
}

export interface OverheadItem {
  id: string;
  name: string;
  qty: number;
  unitCost: number;
}

export interface OverheadSection {
  title: string;
  items: OverheadItem[];
}

export interface CalculatorState {
  wage: WageData;
  time: TimeData;
  overheads: OverheadSection[];
  markupPercent: number;
}

export interface CalculationResults {
  annualBaseWage: number;
  holidayPayAmount: number;
  workCoverAmount: number;
  superAmount: number;
  lslAmount: number;
  travelAllowAmount: number;
  faresAnnual: number;
  totalLabourCost: number; // Step A Result
  
  totalLeaveWeeks: number;
  billableHoursPerWeek: number;
  annualBillableHours: number; // Step B Result
  
  totalAnnualExpenses: number;
  labourCostPerHour: number;
  overheadCostPerHour: number; // Step C Result
  
  markupAmount: number;
  finalHourlyRate: number; // Step D Result
}
