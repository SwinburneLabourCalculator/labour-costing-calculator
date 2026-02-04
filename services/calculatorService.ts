
import { CalculatorState, CalculationResults } from '../types';

export const performCalculations = (state: CalculatorState): CalculationResults => {
  const { wage, time, overheads, markupPercent } = state;

  // STEP A: Calculate Total Labour Cost (Per Person)
  const annualBaseWage = wage.weeklyGross * 52;
  const leaveWeeks = time.annualLeaveDays / 5;
  
  const holidayPayAmount = (wage.weeklyGross * (wage.holidayLoad / 100)) * leaveWeeks;
  const workCoverAmount = annualBaseWage * (wage.workCover / 100);
  const superAmount = annualBaseWage * (wage.superannuation / 100);
  const lslAmount = annualBaseWage * (wage.lsl / 100);

  const totalLeaveWeeks = (time.annualLeaveDays + time.sickDays + time.publicHolidays) / 5;
  const workingWeeks = Math.max(0, 52 - totalLeaveWeeks);
  
  const hourlyRateBase = time.standardHoursPerDay > 0 ? wage.weeklyGross / (time.standardHoursPerDay * 5) : 0;
  const travelAllowAmount = hourlyRateBase * wage.travelDays * wage.travelHours * workingWeeks;
  const faresAnnual = wage.faresAllowance * workingWeeks;

  const totalLabourCost = annualBaseWage + holidayPayAmount + workCoverAmount + superAmount + lslAmount + travelAllowAmount + faresAnnual;

  // STEP B: Calculate Annual Billable Hours
  const billableHoursPerWeek = Math.max(0, (time.standardHoursPerDay - time.lostHoursPerDay) * 5);
  const annualBillableHours = workingWeeks * billableHoursPerWeek;

  // STEP C: Calculate Hourly Overheads
  const totalAnnualExpenses = overheads.reduce((sum, section) => 
    sum + section.items.reduce((secSum, item) => secSum + (item.qty * item.unitCost), 0), 0
  );

  const overheadCostPerHour = annualBillableHours > 0 ? totalAnnualExpenses / annualBillableHours : 0;
  const labourCostPerHour = annualBillableHours > 0 ? totalLabourCost / annualBillableHours : 0;

  // STEP D: Final Sell Rate
  const costBasePerHour = labourCostPerHour + overheadCostPerHour;
  const markupAmount = costBasePerHour * (markupPercent / 100);
  const finalHourlyRate = costBasePerHour + markupAmount;

  return {
    annualBaseWage,
    holidayPayAmount,
    workCoverAmount,
    superAmount,
    lslAmount,
    travelAllowAmount,
    faresAnnual,
    totalLabourCost,
    totalLeaveWeeks,
    billableHoursPerWeek,
    annualBillableHours,
    totalAnnualExpenses,
    labourCostPerHour,
    overheadCostPerHour,
    markupAmount,
    finalHourlyRate
  };
};
