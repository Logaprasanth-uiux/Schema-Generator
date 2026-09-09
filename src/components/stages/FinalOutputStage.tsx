'use client';

import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  Boxes, 
  Calculator, 
  ShieldCheck, 
  FileCheck2 
} from 'lucide-react';

export const FinalOutputStage: React.FC = () => {
  const { workflow, setStage, downloadSchemaJson, copySchemaJson } = useWorkflow();
  const [copied, setCopied] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('TXN-2023-11001');

  if (!workflow.schema || !workflow.requirements) {
    return (
      <div className="p-12 text-center text-neutral-600 dark:text-neutral-400">
        <p>No final schema generated yet. Please return to Schema Studio.</p>
        <button
          onClick={() => setStage('schema')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-xs font-semibold"
        >
          Go to Schema Studio
        </button>
      </div>
    );
  }

  const handleCopy = async () => {
    const ok = await copySchemaJson();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sampleRecords = workflow.requirements.expectedOutput?.sampleRecords || [];
  const activeRecord = sampleRecords.find((r) => r.recordId === selectedRecordId) || sampleRecords[0];

  return (
    <div className="p-5 lg:p-6 max-w-7xl mx-auto space-y-5 pb-20">
      {/* Completion Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>Production Schema Verified</span>
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">SCDP Specification v1.0</span>
            </div>

            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
              DataTwin Schema Generation Complete
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              The business requirement for <span className="font-semibold text-neutral-900 dark:text-white">{workflow.domain}</span> has been compiled into a validated SCDP schema with {workflow.classes?.length || 11} domain classes, math transformations, and variance reconciliation gating.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              {copied ? <Check className="h-4 w-4 text-neutral-800 dark:text-neutral-200" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>

            <button
              onClick={downloadSchemaJson}
              className="flex items-center space-x-2 px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold rounded-xl text-xs transition-all shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Download Schema JSON</span>
            </button>
          </div>
        </div>

        {/* Scorecard Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold">Domain Classes</span>
              <Boxes className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">{workflow.classes?.length || 11}</p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">AD, CA, AP, PWBill...</p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold">SCDP Components</span>
              <Calculator className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">{workflow.schema.stats.componentCount}</p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Math & Schema Fetches</p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold">Traceable Rules</span>
              <ShieldCheck className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">27 Specs</p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">PS, BO, BR, FR, TR</p>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold">Gating Validation</span>
              <CheckCircle2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            <p className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">Zero-Variance</p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Hard-gated posting</p>
          </div>
        </div>
      </div>

      {/* Expected Output Simulation & Reconciliation Verification */}
      {sampleRecords.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <FileCheck2 className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                <span>Expected Ledger Output & Reconciliation Validation</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Simulated transaction run showing dynamic LOB allocation, tax calculation, and ledger reconciliation checks.
              </p>
            </div>

            {/* Record Selector Tabs */}
            <div className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
              {sampleRecords.map((rec) => (
                <button
                  key={rec.recordId}
                  onClick={() => setSelectedRecordId(rec.recordId)}
                  className={`px-3 py-1 rounded-md font-mono transition-all ${
                    selectedRecordId === rec.recordId
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {rec.recordId}
                </button>
              ))}
            </div>
          </div>

          {activeRecord && (
            <div className="space-y-3.5">
              {/* Record Summary Header */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">Source Bill ID</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm mt-0.5 block">{activeRecord.sourceBillId}</span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate block mt-0.5">{activeRecord.vendorName}</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">Prepaid GL Account</span>
                  <span className="font-mono text-xs text-neutral-800 dark:text-neutral-200 mt-0.5 block">{activeRecord.prepaidGlAccount}</span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block mt-0.5">Mapped via Master AD</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">Original Bill Total</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm mt-0.5 block">
                    ${activeRecord.originalBillTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block mt-0.5">Raw Ingestion Total</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">Reconciliation Status</span>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span
                      className={`font-bold font-mono text-xs px-2 py-0.5 rounded ${
                        activeRecord.status === 'PROCESSED'
                          ? 'bg-neutral-200 text-neutral-800 border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700'
                          : 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800'
                      }`}
                    >
                      {activeRecord.status}
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                      Var: ${activeRecord.reconciliationSummary.reconciliationVariance}
                    </span>
                  </div>
                </div>
              </div>

              {/* LOB Allocation Split Table */}
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden text-xs">
                <div className="bg-neutral-100/70 dark:bg-neutral-950 px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 font-bold text-neutral-800 dark:text-neutral-300">
                  Lines of Business (LOB) Cost Allocation & Tax Computation
                </div>
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-950/60 text-neutral-600 dark:text-neutral-400 font-mono text-[11px] border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="py-2 px-4">Target LOB</th>
                      <th className="py-2 px-4">Alloc %</th>
                      <th className="py-2 px-4">Base Amount</th>
                      <th className="py-2 px-4">Tax Profile</th>
                      <th className="py-2 px-4">Tax Rate</th>
                      <th className="py-2 px-4">Tax Amount</th>
                      <th className="py-2 px-4 text-right">Total With Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-neutral-800 dark:text-neutral-200 font-mono text-[11px]">
                    {activeRecord.allocationDetails.map((alloc, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                        <td className="py-2.5 px-4 font-bold text-neutral-900 dark:text-neutral-100">{alloc.targetLob}</td>
                        <td className="py-2.5 px-4">{alloc.allocationPercentage}%</td>
                        <td className="py-2.5 px-4">${alloc.baseAllocatedAmount.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-neutral-500 dark:text-neutral-400">{alloc.destinationTaxProfile}</td>
                        <td className="py-2.5 px-4">{alloc.appliedTaxRate}%</td>
                        <td className="py-2.5 px-4">${alloc.calculatedTaxAmount.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-neutral-900 dark:text-white">${alloc.allocatedTotalWithTax.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sticky Stage Action Bar */}
      <div className="sticky bottom-0 z-10 -mx-6 lg:-mx-8 -mb-6 lg:-mb-8 px-6 lg:px-8 py-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between shadow-lg transition-colors">
        <button
          onClick={() => setStage('schema')}
          className="flex items-center space-x-2 px-3 py-1.5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Schema Studio</span>
        </button>

        <button
          onClick={downloadSchemaJson}
          className="flex items-center space-x-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold rounded-xl text-xs transition-all shadow-md"
        >
          <Download className="h-4 w-4" />
          <span>Export Schema JSON</span>
        </button>
      </div>
    </div>
  );
};
