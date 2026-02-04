
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculatorState, CalculationResults } from './types';
import { INITIAL_STATE, STEPS } from './constants';
import { performCalculations } from './services/calculatorService';
import { InputField } from './components/InputField';
import { SummaryCard } from './components/SummaryCard';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [studentName, setStudentName] = useState("");

  const results = useMemo(() => performCalculations(state), [state]);

  const updateWage = (key: keyof typeof state.wage, value: number) => {
    setState(prev => ({ ...prev, wage: { ...prev.wage, [key]: value } }));
  };

  const updateTime = (key: keyof typeof state.time, value: number) => {
    setState(prev => ({ ...prev, time: { ...prev.time, [key]: value } }));
  };

  const updateOverhead = (sectionIdx: number, itemIdx: number, field: 'qty' | 'unitCost', value: number) => {
    setState(prev => {
      const newOverheads = [...prev.overheads];
      const newSection = { ...newOverheads[sectionIdx] };
      const newItems = [...newSection.items];
      newItems[itemIdx] = { ...newItems[itemIdx], [field]: value };
      newSection.items = newItems;
      newOverheads[sectionIdx] = newSection;
      return { ...prev, overheads: newOverheads };
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset everything?")) {
      setState(INITIAL_STATE);
      setCurrentStep(0);
    }
  };

  // Main Chart Data
  const mainChartData = [
    { name: 'Labour', value: results.labourCostPerHour },
    { name: 'Overheads', value: results.overheadCostPerHour },
    { name: 'Profit Markup', value: results.markupAmount },
  ].filter(d => d.value > 0);

  // Labour Breakdown Chart Data
  const labourChartData = [
    { name: 'Base Wage', value: results.annualBaseWage },
    { name: 'Leave Load', value: results.holidayPayAmount },
    { name: 'Allowances', value: results.travelAllowAmount + results.faresAnnual },
    { name: 'Insurance', value: results.workCoverAmount },
    { name: 'Super & LSL', value: results.superAmount + results.lslAmount },
  ].filter(d => d.value > 0);

  // Overheads Breakdown Chart Data
  const overheadsChartData = state.overheads.map(section => ({
    name: section.title.replace(' Costs', ''),
    value: section.items.reduce((sum, item) => sum + (item.qty * item.unitCost), 0)
  })).filter(d => d.value > 0);

  const MAIN_COLORS = ['#6366f1', '#10b981', '#f59e0b'];
  const LABOUR_COLORS = ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];
  const OVERHEAD_COLORS = ['#06b6d4', '#10b981', '#f59e0b'];

  const getOverheadColors = (index: number) => {
    switch (index) {
      case 0: return { bg: 'bg-cyan-50/50', header: 'bg-cyan-100', border: 'border-cyan-200', text: 'text-cyan-800', accent: 'cyan' };
      case 1: return { bg: 'bg-emerald-50/50', header: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'emerald' };
      case 2: return { bg: 'bg-amber-50/50', header: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-800', accent: 'amber' };
      default: return { bg: 'bg-slate-50/50', header: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-800', accent: 'indigo' };
    }
  };

  const financialDisclaimer = "This calculation is for educational purposes only and should not be relied upon as a definitive financial breakdown. Professional financial advice from a qualified advisor or accountant must be sought before making business decisions.";

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      <header className="bg-indigo-600 text-white py-10 px-4 shadow-lg no-print text-center">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Labour Costing Calculator</h1>
        <p className="text-indigo-100 opacity-90 text-lg font-medium tracking-wide">CPCPCM4012 Estimate and cost work</p>
        
        <div className="mt-8 w-full max-w-2xl mx-auto px-4 relative">
          <div className="absolute top-[1.125rem] left-[2.125rem] right-[2.125rem] h-0.5 bg-indigo-500/50 z-0"></div>
          
          <div className="flex justify-between items-start relative z-10">
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${idx === currentStep ? 'bg-white text-indigo-600 border-white scale-125 shadow-lg shadow-indigo-900/20' : idx < currentStep ? 'bg-indigo-400 text-indigo-700 border-indigo-400' : 'bg-indigo-700 text-indigo-300 border-indigo-700'}`}>
                  {idx + 1}
                </div>
                <span className={`text-[10px] uppercase font-bold hidden sm:block tracking-widest ${idx === currentStep ? 'text-white font-black' : 'text-indigo-300'}`}>{step.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-8 px-4 no-print flex-grow w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
            {currentStep === 0 && <h2 className="text-3xl font-black text-indigo-600/65 tracking-tight">Wage Information</h2>}
            {currentStep === 1 && <h2 className="text-3xl font-black text-emerald-600/65 tracking-tight">Working Time Parameters</h2>}
            {currentStep === 2 && <h2 className="text-3xl font-black text-orange-600/65 tracking-tight">Annual Overheads</h2>}
            {currentStep === 3 && <h2 className="text-3xl font-black text-indigo-600/65 tracking-tight">Final Rate Breakdown</h2>}
          </div>

          <div className="p-8">
            {currentStep === 0 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Weekly Gross Wage" prefix="$" suffix="/ wk" value={state.wage.weeklyGross} onChange={(v) => updateWage('weeklyGross', v)} />
                  <InputField label="Holiday Pay Loading" suffix="%" value={state.wage.holidayLoad} onChange={(v) => updateWage('holidayLoad', v)} />
                  <InputField label="Travel Days Per Week" suffix="days" value={state.wage.travelDays} onChange={(v) => updateWage('travelDays', v)} />
                  <InputField label="Travel Hours Per Day" suffix="hrs" value={state.wage.travelHours} onChange={(v) => updateWage('travelHours', v)} />
                  <InputField label="Weekly Fares Allowance" prefix="$" suffix="/ wk" value={state.wage.faresAllowance} onChange={(v) => updateWage('faresAllowance', v)} />
                  <InputField label="Work Cover Premium" suffix="%" value={state.wage.workCover} onChange={(v) => updateWage('workCover', v)} />
                  <InputField label="Superannuation" suffix="%" value={state.wage.superannuation} onChange={(v) => updateWage('superannuation', v)} />
                  <InputField label="Long Service Leave" suffix="%" value={state.wage.lsl} onChange={(v) => updateWage('lsl', v)} />
                </div>
                <SummaryCard title="Total Labour Cost Breakdown" accentColor="indigo" rows={[
                  { label: "Annual Base Wage", value: results.annualBaseWage, isCurrency: true },
                  { label: "Leave Loading", value: results.holidayPayAmount, isCurrency: true },
                  { label: "Allowances", value: results.travelAllowAmount + results.faresAnnual, isCurrency: true },
                  { label: "Insurance (WorkCover)", value: results.workCoverAmount, isCurrency: true },
                  { label: "Super & LSL", value: results.superAmount + results.lslAmount, isCurrency: true },
                  { label: "TOTAL LABOUR COST", value: results.totalLabourCost, isCurrency: true, isBold: true },
                ]} />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Annual Leave" suffix="days" value={state.time.annualLeaveDays} onChange={(v) => updateTime('annualLeaveDays', v)} />
                  <InputField label="Sick Days Per Year" suffix="days" value={state.time.sickDays} onChange={(v) => updateTime('sickDays', v)} />
                  <InputField label="Public Holidays" suffix="days" value={state.time.publicHolidays} onChange={(v) => updateTime('publicHolidays', v)} />
                  <InputField label="Standard Hours Per Day" suffix="hrs" value={state.time.standardHoursPerDay} onChange={(v) => updateTime('standardHoursPerDay', v)} />
                  <InputField label="Lost Hours Per Day" suffix="hrs" value={state.time.lostHoursPerDay} onChange={(v) => updateTime('lostHoursPerDay', v)} />
                </div>
                <SummaryCard title="Annual Billable Hours" accentColor="emerald" rows={[
                  { label: "Total Leave Weeks", value: results.totalLeaveWeeks.toFixed(2) },
                  { label: "Billable Hours Per Week", value: results.billableHoursPerWeek.toFixed(2) },
                  { label: "ANNUAL BILLABLE HOURS", value: results.annualBillableHours.toFixed(2), isBold: true, hint: "(52 - Total Leave Weeks) * Billable Hours Per Week" },
                ]} />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {state.overheads.map((section, sIdx) => {
                  const colors = getOverheadColors(sIdx);
                  return (
                    <div key={sIdx} className={`border ${colors.border} rounded-xl overflow-hidden ${colors.bg} mb-6`}>
                      <div className={`${colors.header} px-6 py-3 border-b ${colors.border}`}>
                        <h4 className={`font-bold ${colors.text}`}>{section.title}</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="text-slate-500 uppercase text-[10px] font-bold">
                            <tr className="border-b border-slate-100">
                              <th className="px-6 py-3">Expense Item</th>
                              <th className="px-6 py-3 w-24">Qty</th>
                              <th className="px-6 py-3 w-36">Unit Cost ($)</th>
                              <th className="px-6 py-3 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/50">
                            {section.items.map((item, iIdx) => (
                              <tr key={item.id} className="hover:bg-white/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-700">{item.name}</td>
                                <td className="px-6 py-4">
                                  <input type="number" value={item.qty === 0 ? "" : item.qty} placeholder="0" onChange={(e) => updateOverhead(sIdx, iIdx, 'qty', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:border-indigo-500 outline-none" />
                                </td>
                                <td className="px-6 py-4">
                                  <input type="number" step="0.01" value={item.unitCost === 0 ? "" : item.unitCost} placeholder="0.00" onChange={(e) => updateOverhead(sIdx, iIdx, 'unitCost', parseFloat(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 focus:border-indigo-500 outline-none" />
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">${(item.qty * item.unitCost).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className={`${colors.header} font-bold`}>
                            <tr>
                              <td colSpan={3} className="px-6 py-3 text-slate-600">Section Subtotal</td>
                              <td className={`px-6 py-3 text-right ${colors.text}`}>${section.items.reduce((sum, i) => sum + (i.qty * i.unitCost), 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  );
                })}
                <SummaryCard title="Hourly Overheads Summary" accentColor="orange" rows={[
                  { label: "Total Annual Expenses", value: results.totalAnnualExpenses, isCurrency: true },
                  { label: "Annual Billable Hours", value: results.annualBillableHours.toFixed(2) },
                  { label: "HOURLY OVERHEADS", value: results.overheadCostPerHour, isCurrency: true, isBold: true },
                ]} />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                      <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Internal Cost Basis</p>
                      <p className="text-5xl font-extrabold text-indigo-600">${(results.labourCostPerHour + results.overheadCostPerHour).toFixed(2)}<span className="text-lg text-slate-400 font-normal"> / hr</span></p>
                    </div>
                    <SummaryCard title="Components" accentColor="indigo" rows={[
                      { label: "Hourly Labour Cost", value: results.labourCostPerHour, isCurrency: true },
                      { label: "Hourly Overhead Cost", value: results.overheadCostPerHour, isCurrency: true },
                      { label: "Subtotal", value: results.labourCostPerHour + results.overheadCostPerHour, isCurrency: true, isBold: true },
                    ]} />
                  </div>
                  <div className="space-y-6">
                    <InputField label="Profit Margin (%)" suffix="%" value={state.markupPercent} onChange={(v) => setState(p => ({ ...p, markupPercent: v }))} />
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-2xl text-white shadow-xl text-center">
                      <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Final Commercial Sell Rate</p>
                      <p className="text-6xl font-black mb-1">${results.finalHourlyRate.toFixed(2)}</p>
                      <p className="text-indigo-200/60 text-[10px] italic font-bold uppercase tracking-tighter">Exclusive of GST</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-100">
                  <div className="flex flex-col items-center">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Labour Cost Breakdown</h4>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={labourChartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                            {labourChartData.map((_, index) => <Cell key={`cell-${index}`} fill={LABOUR_COLORS[index % LABOUR_COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                          <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{fontSize: '8px', textTransform: 'uppercase'}} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Overheads Breakdown</h4>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={overheadsChartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                            {overheadsChartData.map((_, index) => <Cell key={`cell-${index}`} fill={OVERHEAD_COLORS[index % OVERHEAD_COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                          <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{fontSize: '8px', textTransform: 'uppercase'}} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Final Rate Detail</h4>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={mainChartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                            {mainChartData.map((_, index) => <Cell key={`cell-${index}`} fill={MAIN_COLORS[index % MAIN_COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(v: number) => `$${v.toFixed(2)} / hr`} />
                          <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{fontSize: '8px', textTransform: 'uppercase'}} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-sm font-semibold text-slate-700">Enter student name for report:</label>
                  <input type="text" placeholder="Full name..." value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none shadow-sm" />
                  <button onClick={() => window.print()} disabled={!studentName} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">Generate Report / Print</button>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center no-print">
            <button onClick={() => setCurrentStep(p => Math.max(0, p - 1))} disabled={currentStep === 0} className="px-6 py-2.5 rounded-lg border border-slate-300 font-bold text-slate-600 hover:bg-white hover:border-indigo-500 transition-all">Previous</button>
            <div className="flex gap-4">
              <button onClick={handleReset} className="px-6 py-2.5 rounded-lg font-bold text-rose-600 hover:bg-rose-50 transition-all">Reset</button>
              {currentStep < STEPS.length - 1 && <button onClick={() => setCurrentStep(p => p + 1)} className="px-8 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md transition-all">Next Step</button>}
            </div>
          </div>
        </div>
      </main>

      <div className="no-print max-w-4xl mx-auto px-4 mt-6">
        <p className="text-[11px] text-slate-400 italic bg-white/50 p-3 rounded border border-slate-100">
          <strong>Disclaimer:</strong> {financialDisclaimer}
        </p>
      </div>

      <div className="print-only p-12 bg-white text-slate-900 min-h-screen">
        <div className="flex justify-between items-end border-b-4 border-indigo-600 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-indigo-800 uppercase tracking-tighter">Labour Costing Report</h1>
            <p className="text-slate-500 font-bold">CPCPCM4012 Estimate and cost work</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold uppercase tracking-widest">Student: <span className="text-indigo-700">{studentName}</span></p>
            <p className="text-xs text-slate-400">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold border-b mb-3 pb-1 tracking-tight uppercase">Total Labour Cost Breakdown</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-1 text-sm">
              <div className="flex justify-between"><span>Base Wage:</span><span>${results.annualBaseWage.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Superannuation & LSL:</span><span>${(results.superAmount + results.lslAmount).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Leave Loading:</span><span>${results.holidayPayAmount.toLocaleString()}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-1 font-bold"><span>TOTAL ANNUAL LABOUR:</span><span>${results.totalLabourCost.toLocaleString()}</span></div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-b mb-3 pb-1 tracking-tight uppercase">Annual Billable Hours</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-1 text-sm">
              <div className="flex justify-between"><span>Total Leave Weeks:</span><span>{results.totalLeaveWeeks.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Billable Hours Per Week:</span><span>{results.billableHoursPerWeek.toFixed(2)} hrs</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-1 font-bold"><span>ANNUAL BILLABLE HOURS:</span><span>{results.annualBillableHours.toFixed(2)} hrs</span></div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-b mb-3 pb-1 tracking-tight uppercase">Hourly Overheads Summary</h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-1 text-sm">
              <div className="flex justify-between"><span>Total Annual Expenses:</span><span>${results.totalAnnualExpenses.toLocaleString()}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-1 font-bold"><span>HOURLY OVERHEADS:</span><span>${results.overheadCostPerHour.toFixed(2)} / hr</span></div>
            </div>
          </section>

          <section className="bg-indigo-50 p-10 rounded-3xl border-2 border-indigo-200 page-break-inside-avoid">
            <h2 className="text-2xl font-black text-indigo-800 mb-6 text-center uppercase tracking-widest">FINAL SELL RATE</h2>
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Labour / hr</p>
                <p className="text-2xl font-bold">${results.labourCostPerHour.toFixed(2)}</p>
              </div>
              <div className="text-2xl text-indigo-300 font-thin">+</div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Overheads / hr</p>
                <p className="text-2xl font-bold">${results.overheadCostPerHour.toFixed(2)}</p>
              </div>
              <div className="text-2xl text-indigo-300 font-thin">x</div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Markup ({state.markupPercent}%)</p>
                <p className="text-2xl font-bold">{(1 + state.markupPercent/100).toFixed(2)}</p>
              </div>
              <div className="text-2xl text-indigo-300 font-thin">=</div>
              <div className="text-center px-10 py-6 bg-indigo-600 rounded-2xl text-white shadow-lg">
                <p className="text-xs font-bold text-indigo-200 uppercase mb-1 tracking-widest">Sell Rate</p>
                <p className="text-5xl font-black">${results.finalHourlyRate.toFixed(2)}</p>
                <p className="text-[10px] text-indigo-300 italic tracking-widest">Excl. GST</p>
              </div>
            </div>
          </section>

          <footer className="mt-12 pt-8 border-t border-slate-200 text-center">
            <p className="text-[9px] text-slate-400 leading-relaxed italic uppercase font-bold tracking-widest mb-4">
              CPCPCM4012 Estimate and cost work - Theoretical Exercise
            </p>
            <p className="text-[10px] text-slate-500 px-12 leading-tight">
              <strong>Disclaimer:</strong> {financialDisclaimer}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
