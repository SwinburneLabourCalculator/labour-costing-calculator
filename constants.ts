
import { CalculatorState } from './types';

export const INITIAL_STATE: CalculatorState = {
  wage: {
    weeklyGross: 0,
    holidayLoad: 0,
    travelDays: 0,
    travelHours: 0,
    faresAllowance: 0,
    workCover: 0,
    superannuation: 0,
    lsl: 0,
  },
  time: {
    annualLeaveDays: 0,
    sickDays: 0,
    publicHolidays: 0,
    lostHoursPerDay: 0,
    standardHoursPerDay: 0,
  },
  overheads: [
    {
      title: "Insurance Costs",
      items: [
        { id: 'i1', name: 'Plumbers Insurance', qty: 0, unitCost: 0 },
        { id: 'i2', name: 'Property Insurance', qty: 0, unitCost: 0 },
        { id: 'i3', name: 'Vehicle Insurance', qty: 0, unitCost: 0 },
        { id: 'i4', name: 'Equipment Insurance', qty: 0, unitCost: 0 },
      ]
    },
    {
      title: "Vehicle Costs",
      items: [
        { id: 'v1', name: 'Vehicle Repayments/Lease', qty: 0, unitCost: 0 },
        { id: 'v2', name: 'Vehicle Registration', qty: 0, unitCost: 0 },
        { id: 'v3', name: 'Fuel', qty: 0, unitCost: 0 },
        { id: 'v4', name: 'Vehicle Servicing', qty: 0, unitCost: 0 },
        { id: 'v5', name: 'Equipment Rental/Lease', qty: 0, unitCost: 0 },
      ]
    },
    {
      title: "Office/Workshop Costs",
      items: [
        { id: 'o1', name: 'Premises Rent', qty: 0, unitCost: 0 },
        { id: 'o2', name: 'Electricity', qty: 0, unitCost: 0 },
        { id: 'o3', name: 'Gas', qty: 0, unitCost: 0 },
        { id: 'o4', name: 'Mobile Telecommunications', qty: 0, unitCost: 0 },
        { id: 'o5', name: 'Office Supplies', qty: 0, unitCost: 0 },
        { id: 'o6', name: 'Administrative Staff', qty: 0, unitCost: 0 },
      ]
    }
  ],
  markupPercent: 0,
};

export const STEPS = [
  "Wage Information",
  "Working Time",
  "Annual Overheads",
  "Final Breakdown"
];
