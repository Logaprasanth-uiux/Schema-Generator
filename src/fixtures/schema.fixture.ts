import { SchemaModel, SchemaTreeNode } from '../types';

export const rawSchemaJsonTree: SchemaTreeNode[] = [
  {
    title: "Root",
    technicalName: "Root",
    expanded: true,
    children: [
      {
        title: "SchemaGroupName",
        technicalName: "SchemaGroupName",
        val: "SCDP Generated Schema"
      },
      {
        title: "SchemaClass",
        technicalName: "SchemaClass",
        expanded: true,
        children: [
          {
            title: "#SchemaClass#1 (AD)",
            technicalName: "#SchemaClass#1",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "AD" },
              { title: "DataSource", technicalName: "DataSource", val: "AD" },
              { title: "DateAggregationOn", technicalName: "DateAggregationOn", val: "forprdfrom" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per accountclass Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              { title: "accountclass", technicalName: "accountclass", val: "*", equality: "EQ" },
              { title: "accountgroup", technicalName: "accountgroup", val: "*", equality: "EQ" },
              { title: "itemtype", technicalName: "itemtype", val: "*", equality: "EQ" },
              { title: "accountcode", technicalName: "accountcode", val: "*", equality: "EQ" },
              { title: "ledgername", technicalName: "ledgername", val: "*", equality: "EQ" },
              { title: "transactionstatus", technicalName: "transactionstatus", val: "*", equality: "EQ" },
              { title: "forprdfrom", technicalName: "forprdfrom", val: "*", equality: "EQ" },
              { title: "forprdto", technicalName: "forprdto", val: "*", equality: "EQ" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (parameter1)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "parameter1" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "parameter1" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#2 (CA)",
            technicalName: "#SchemaClass#2",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "CA" },
              { title: "DataSource", technicalName: "DataSource", val: "CA" },
              { title: "DateAggregationOn", technicalName: "DateAggregationOn", val: "forprdfrom" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per costallocationmethod Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              { title: "costallocationmethod", technicalName: "costallocationmethod", val: "*", equality: "EQ" },
              { title: "lob", technicalName: "lob", val: "*", equality: "EQ" },
              { title: "forprdfrom", technicalName: "forprdfrom", val: "*", equality: "EQ" },
              { title: "forprdto", technicalName: "forprdto", val: "*", equality: "EQ" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (costallocationvalue)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "costallocationvalue" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "costallocationvalue" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#3 (AP)",
            technicalName: "#SchemaClass#3",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "AP" },
              { title: "DataSource", technicalName: "DataSource", val: "AP" },
              { title: "DateAggregationOn", technicalName: "DateAggregationOn", val: "forprdfrom" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per activitycode Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              { title: "activitycode", technicalName: "activitycode", val: "*", equality: "EQ" },
              { title: "strategyname", technicalName: "strategyname", val: "*", equality: "EQ" },
              { title: "lob", technicalName: "lob", val: "*", equality: "EQ" },
              { title: "activityname", technicalName: "activityname", val: "*", equality: "EQ" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (timeinmins)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "timeinmins" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "timeinmins" }
                    ]
                  },
                  {
                    title: "#Components#2 (timeindays)",
                    technicalName: "#Components#2",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "timeindays" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "timeindays" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#4 (PWBill)",
            technicalName: "#SchemaClass#4",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "PWBill" },
              { title: "DataSource", technicalName: "DataSource", val: "PWBill" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per lob Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              { title: "lob", technicalName: "lob", val: "*", equality: "EQ" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (budgetedamount)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "budgetedamount" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "budgetedamount" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#5 (PrePaidReport_I)",
            technicalName: "#SchemaClass#5",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "PrePaidReport_I" },
              { title: "DataSource", technicalName: "DataSource", val: "PrePaidReport" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per itemid Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              { title: "documentnumber", technicalName: "documentnumber", val: "*", equality: "EQ" },
              { title: "itemid", technicalName: "itemid", val: "*", equality: "EQ" },
              { title: "itemname", technicalName: "itemname", val: "*", equality: "EQ" },
              { title: "taxcode", technicalName: "taxcode", val: "*", equality: "EQ" },
              { title: "orgid", technicalName: "orgid", val: "*", equality: "EQ" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (basevalue)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "basevalue" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "basevalue" }
                    ]
                  },
                  {
                    title: "#Components#2 (taxpercentage)",
                    technicalName: "#Components#2",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "taxpercentage" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "taxpercentage" }
                    ]
                  },
                  {
                    title: "#Components#3 (exchangerate)",
                    technicalName: "#Components#3",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "exchangerate" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "exchangerate" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#6 (PrePaidReport_ItemCalculation)",
            technicalName: "#SchemaClass#6",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "PrePaidReport_ItemCalculation" },
              { title: "DataSource", technicalName: "DataSource", val: "PrePaidReport" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per itemid Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              { title: "documentnumber", technicalName: "documentnumber", val: "*", equality: "EQ" },
              { title: "itemid", technicalName: "itemid", val: "*", equality: "EQ" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (BaseValue)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "BaseValue" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "FETCHFROMSCHEMA" },
                      { title: "FetchSchemaName", technicalName: "FetchSchemaName", val: "Class 5 PrePaidReport_I" },
                      { title: "FetchColumnName", technicalName: "FetchColumnName", val: "basevalue" }
                    ]
                  },
                  {
                    title: "#Components#2 (TaxPercentage)",
                    technicalName: "#Components#2",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "TaxPercentage" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "FETCHFROMSCHEMA" },
                      { title: "FetchSchemaName", technicalName: "FetchSchemaName", val: "Class 5 PrePaidReport_I" },
                      { title: "FetchColumnName", technicalName: "FetchColumnName", val: "taxpercentage" }
                    ]
                  },
                  {
                    title: "#Components#3 (TaxValue)",
                    technicalName: "#Components#3",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "TaxValue" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "BaseValue * (TaxPercentage / 100)" }
                    ]
                  },
                  {
                    title: "#Components#4 (DocumentValue)",
                    technicalName: "#Components#4",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "DocumentValue" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "BaseValue + TaxValue" }
                    ]
                  },
                  {
                    title: "#Components#5 (AmountInLocalCurrency)",
                    technicalName: "#Components#5",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "AmountInLocalCurrency" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "DocumentValue * ExchangeRate" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#7 (PrePaidReportCostAllocation1)",
            technicalName: "#SchemaClass#7",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "PrePaidReportCostAllocation1" },
              { title: "DataSource", technicalName: "DataSource", val: "PrePaidReport" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per itemid Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              { title: "documentnumber", technicalName: "documentnumber", val: "*", equality: "EQ" },
              { title: "itemid", technicalName: "itemid", val: "*", equality: "EQ" },
              {
                title: "lob",
                technicalName: "lob",
                val: "GETGROUPFROMSCHEMA2(Class 2 CA; lob; {\"costallocationmethod\":\"costallocationmethod\",\"ForPrdFrom\":{\"equality\":\"LE\",\"value\":\"ForPrdTo\"},\"ForPrdTo\":{\"equality\":\"GE\",\"value\":\"ForPrdFrom\"}})"
              },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (BaseValue)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "BaseValue" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "FETCHFROMSCHEMA" },
                      { title: "FetchSchemaName", technicalName: "FetchSchemaName", val: "Class 6 PrePaidReport_ItemCalculation" }
                    ]
                  },
                  {
                    title: "#Components#2 (CostAllocationValue)",
                    technicalName: "#Components#2",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "CostAllocationValue" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "FETCHFROMSCHEMA" },
                      { title: "FetchSchemaName", technicalName: "FetchSchemaName", val: "Class 2 CA" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#8 (TCostAllocationValue)",
            technicalName: "#SchemaClass#8",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "TCostAllocationValue" },
              { title: "DataSource", technicalName: "DataSource", val: "PrePaidReport" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per itemid Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (TCostAllocationValue)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "TCostAllocationValue" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "SUMFROMSCHEMA" },
                      { title: "FetchSchemaName", technicalName: "FetchSchemaName", val: "Class 7 PrePaidReportCostAllocation1" },
                      { title: "FetchColumnName", technicalName: "FetchColumnName", val: "CostAllocationValue" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#9 (PrePaidReportCostAllocation)",
            technicalName: "#SchemaClass#9",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "PrePaidReportCostAllocation" },
              { title: "DataSource", technicalName: "DataSource", val: "PrePaidReport" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per itemid Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (CostAllocationParameter)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "CostAllocationParameter" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "CostAllocationValue / TCostAllocationValue" }
                    ]
                  },
                  {
                    title: "#Components#2 (AllocatedAmount)",
                    technicalName: "#Components#2",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "AllocatedAmount" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "BaseValue * CostAllocationParameter" }
                    ]
                  },
                  {
                    title: "#Components#3 (BudgetedAmount)",
                    technicalName: "#Components#3",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "BudgetedAmount" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "SUMFROMSCHEMA" },
                      { title: "FetchSchemaName", technicalName: "FetchSchemaName", val: "Class 4 PWBill" },
                      { title: "FetchColumnName", technicalName: "FetchColumnName", val: "budgetedamount" }
                    ]
                  },
                  {
                    title: "#Components#4 (BudgetOverrunInd)",
                    technicalName: "#Components#4",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "BudgetOverrunInd" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "(AllocatedAmount > BudgetedAmount)" }
                    ]
                  }
                ]
              },
              {
                title: "Conditions",
                technicalName: "Conditions",
                children: [
                  {
                    title: "#Conditions#1 (BudgetOverrunInd == 0)",
                    technicalName: "#Conditions#1",
                    val: "BudgetOverrunInd EQ 0"
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#10 (AdjustmentAc)",
            technicalName: "#SchemaClass#10",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "AdjustmentAc" },
              { title: "DataSource", technicalName: "DataSource", val: "PrePaidReport" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per itemid Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (AmountInLocalCurrency)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "AmountInLocalCurrency" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "AllocatedAmount" }
                    ]
                  },
                  {
                    title: "#Components#2 (ValidGLInd)",
                    technicalName: "#Components#2",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "ValidGLInd" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "(transactionstatus == 'Active')" }
                    ]
                  }
                ]
              },
              {
                title: "Conditions",
                technicalName: "Conditions",
                children: [
                  {
                    title: "#Conditions#1 (ValidGLInd == 1)",
                    technicalName: "#Conditions#1",
                    val: "ValidGLInd EQ 1"
                  }
                ]
              }
            ]
          },
          {
            title: "#SchemaClass#11 (PrePaidReportWF)",
            technicalName: "#SchemaClass#11",
            children: [
              { title: "SchemaName", technicalName: "SchemaName", val: "PrePaidReportWF" },
              { title: "DataSource", technicalName: "DataSource", val: "PrePaidReport" },
              { title: "SettlementType", technicalName: "SettlementType", val: "Per documentnumber Monthly" },
              { title: "OutputProcessCode", technicalName: "OutputProcessCode", val: "TT" },
              {
                title: "Components",
                technicalName: "Components",
                children: [
                  {
                    title: "#Components#1 (WorkflowTrigger)",
                    technicalName: "#Components#1",
                    children: [
                      { title: "ComponentName", technicalName: "ComponentName", val: "WorkflowTrigger" },
                      { title: "ComponentProcessType", technicalName: "ComponentProcessType", val: "MATH" },
                      { title: "ComponentExpression", technicalName: "ComponentExpression", val: "1" }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export const sampleSchemaModel: SchemaModel = {
  schemaGroupName: "SCDP Generated Schema",
  root: rawSchemaJsonTree,
  rawJson: JSON.stringify(rawSchemaJsonTree, null, 2),
  generatedAt: new Date().toISOString(),
  version: "1.0.0-scdp",
  stats: {
    classCount: 11,
    componentCount: 26,
    fieldCount: 68,
    formulaCount: 18,
  },
  validationResult: {
    isValid: true,
    errors: [],
    warnings: [
      "Ensure lookup tables for CA (Cost Allocation) have matching active period dates before live ingestion."
    ],
    stats: {
      totalClasses: 11,
      totalComponents: 26,
      totalFields: 68,
      totalLookupRules: 9,
    },
  },
};
