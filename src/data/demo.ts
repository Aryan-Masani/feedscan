import { TranslationKey } from '../i18n';

export type SampleType = 'compound' | 'dry_fodder' | 'green_fodder' | 'mineral_mix' | 'silage';
export type VerdictType = 'SAFE' | 'CAUTION' | 'REJECT';

export interface SampleTypeInfo {
  id: SampleType;
  name: string;
  hindiName: string;
  icon: string;
  color: string;
  desc: string;
  targetProtein: string;
  targetMoisture: string;
}

export interface NutritionMetric {
  key: string;
  nameKey: TranslationKey;
  value: number;
  unit: string;
  targetMin: number;
  targetMax: number;
  status: 'normal' | 'low' | 'high' | 'danger';
}

export interface ContaminantMetric {
  nameKey: TranslationKey;
  valueText: string;
  isSafe: boolean;
  severity: 'none' | 'low' | 'high' | 'critical';
}

export interface TestResultData {
  id: string;
  sampleType: SampleType;
  sampleName: string;
  brandName: string;
  batchNumber: string;
  testDate: string;
  verdict: VerdictType;
  score: number;
  confidence: number;
  advisoryKey: TranslationKey;
  metrics: {
    protein: NutritionMetric;
    moisture: NutritionMetric;
    fibre: NutritionMetric;
    energy: NutritionMetric;
  };
  contaminants: ContaminantMetric[];
  minerals: {
    calcium: string;
    phosphorus: string;
    magnesium: string;
  };
  sensorKitReadings?: {
    moisture: number;
    ph: number;
    temperature: number;
  };
  stripReadings?: {
    ureaColor: string;
    ureaReading: string;
    aflatoxinColor: string;
    aflatoxinReading: string;
  };
}

export interface SiloItem {
  id: string;
  name: string;
  type: string;
  capacityTonnes: number;
  daysPacked: number;
  fermentationStage: string;
  ph: number;
  moisture: number;
  temperature: number;
  gasPpm: number;
  riskStatus: VerdictType;
  riskScore: number;
  history7Days: { day: string; ph: number; temp: number }[];
}

export interface GodownItem {
  id: string;
  name: string;
  bagCount: number;
  temperature: number;
  humidity: number;
  mouldRisk: number; // 0-10
  status: VerdictType;
  recommendations: string[];
}

export interface BatchItem {
  id: string;
  batchNumber: string;
  feedType: string;
  supplier: string;
  receivedDate: string;
  bags: number;
  status: VerdictType;
  score: number;
  qrPayload: string;
  timeline: {
    stage: string;
    date: string;
    detail: string;
    done: boolean;
  }[];
}

export interface OfficerBlockRisk {
  name: string;
  adulterationRate: number; // percentage
  status: VerdictType;
  testsCount: number;
}

export interface SupplierRanking {
  name: string;
  location: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  status: VerdictType;
  batchesSupplied: number;
}

// ----------------------------------------------------
// DEMO DATASETS
// ----------------------------------------------------

export const FARMER_PROFILE = {
  name: 'Ramesh Patel',
  farmName: 'Kamdhenu Dairy Farm',
  village: 'Mogri, Anand, Gujarat',
  cowsCount: 24,
  buffaloCount: 12,
  dailyMilkYieldLiters: 340,
  cooperativeSociety: 'Amul Milk Producers Union #402',
};

export const SAMPLE_TYPES: SampleTypeInfo[] = [
  {
    id: 'compound',
    name: 'Compound Feed',
    hindiName: 'मिश्रित पशु आहार / दाना',
    icon: 'grain',
    color: '#8D6E63',
    desc: 'Pellets, mash, dairy cattle concentrates',
    targetProtein: '18 - 22%',
    targetMoisture: '< 11%',
  },
  {
    id: 'dry_fodder',
    name: 'Dry Fodder',
    hindiName: 'सूखा चारा / कडबा / तूड़ी',
    icon: 'grass',
    color: '#D4A373',
    desc: 'Wheat straw, paddy straw, sorghum stover',
    targetProtein: '6 - 9%',
    targetMoisture: '< 12%',
  },
  {
    id: 'green_fodder',
    name: 'Green Fodder',
    hindiName: 'हरा चारा (नेपियर / मक्का)',
    icon: 'eco',
    color: '#4CAF50',
    desc: 'Hybrid Napier, Maize, Lucerne, Sorghum',
    targetProtein: '14 - 18%',
    targetMoisture: '70 - 80%',
  },
  {
    id: 'mineral_mix',
    name: 'Mineral Mix',
    hindiName: 'खनिज मिश्रण / मिनरल मिक्स',
    icon: 'science',
    color: '#7E57C2',
    desc: 'Chelated mineral powders and salts',
    targetProtein: '0%',
    targetMoisture: '< 4%',
  },
  {
    id: 'silage',
    name: 'Corn Silage',
    hindiName: 'मक्का साइलेज (आचार)',
    icon: 'inventory',
    color: '#2E7D32',
    desc: 'Anaerobically fermented green forage',
    targetProtein: '8 - 11%',
    targetMoisture: '65 - 70%',
  },
];

export const SCRIPTED_RESULTS: Record<SampleType, TestResultData> = {
  compound: {
    id: 'RES-COMP-01',
    sampleType: 'compound',
    sampleName: 'Shree Ganesh Super 22 Pellets',
    brandName: 'Ganesh Agro Industries',
    batchNumber: 'GN-4029-X',
    testDate: 'Today, 10:45 AM',
    verdict: 'REJECT',
    score: 38,
    confidence: 98.4,
    advisoryKey: 'advisoryCompoundReject',
    sensorKitReadings: {
      moisture: 11.8,
      ph: 6.4,
      temperature: 31.2,
    },
    stripReadings: {
      ureaColor: '#880E4F', // intense magenta
      ureaReading: '3.8% (Dangerously High)',
      aflatoxinColor: '#C0CA33', // faint yellow
      aflatoxinReading: '12 ppb (Acceptable)',
    },
    metrics: {
      protein: {
        key: 'protein',
        nameKey: 'proteinLabel',
        value: 14.2,
        unit: '%',
        targetMin: 20.0,
        targetMax: 24.0,
        status: 'danger',
      },
      moisture: {
        key: 'moisture',
        nameKey: 'moistureLabel',
        value: 11.8,
        unit: '%',
        targetMin: 9.0,
        targetMax: 11.0,
        status: 'low',
      },
      fibre: {
        key: 'fibre',
        nameKey: 'fibreLabel',
        value: 15.6,
        unit: '%',
        targetMin: 8.0,
        targetMax: 12.0,
        status: 'high',
      },
      energy: {
        key: 'energy',
        nameKey: 'energyLabel',
        value: 58.0,
        unit: '% TDN',
        targetMin: 70.0,
        targetMax: 75.0,
        status: 'danger',
      },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '3.8% (Adulterated Synthetic)', isSafe: false, severity: 'critical' },
      { nameKey: 'sandParam', valueText: '7.4% (Sand/Silica Specks)', isSafe: false, severity: 'critical' },
      { nameKey: 'aflatoxinParam', valueText: '12 ppb (Within 20 ppb limit)', isSafe: true, severity: 'low' },
      { nameKey: 'mycotoxinsParam', valueText: 'Undetected', isSafe: true, severity: 'none' },
      { nameKey: 'fungusParam', valueText: 'Trace Surface Dust', isSafe: true, severity: 'low' },
    ],
    minerals: {
      calcium: '0.8% (Target: 1.2%)',
      phosphorus: '0.4% (Target: 0.8%)',
      magnesium: '0.15% (Target: 0.25%)',
    },
  },

  dry_fodder: {
    id: 'RES-DRY-02',
    sampleType: 'dry_fodder',
    sampleName: 'Chopped Sorghum Stover (Kadbi)',
    brandName: 'Local Mandi Lot',
    batchNumber: 'DRY-8812',
    testDate: 'Yesterday, 04:15 PM',
    verdict: 'CAUTION',
    score: 64,
    confidence: 96.1,
    advisoryKey: 'advisoryDryCaution',
    sensorKitReadings: {
      moisture: 16.0,
      ph: 6.8,
      temperature: 34.5,
    },
    stripReadings: {
      ureaColor: '#E0E0E0',
      ureaReading: '0.0% (Clean)',
      aflatoxinColor: '#FDD835',
      aflatoxinReading: '18 ppb (Borderline)',
    },
    metrics: {
      protein: {
        key: 'protein',
        nameKey: 'proteinLabel',
        value: 6.8,
        unit: '%',
        targetMin: 6.5,
        targetMax: 8.5,
        status: 'normal',
      },
      moisture: {
        key: 'moisture',
        nameKey: 'moistureLabel',
        value: 16.0,
        unit: '%',
        targetMin: 9.0,
        targetMax: 12.0,
        status: 'high',
      },
      fibre: {
        key: 'fibre',
        nameKey: 'fibreLabel',
        value: 38.4,
        unit: '%',
        targetMin: 30.0,
        targetMax: 36.0,
        status: 'high',
      },
      energy: {
        key: 'energy',
        nameKey: 'energyLabel',
        value: 48.2,
        unit: '% TDN',
        targetMin: 50.0,
        targetMax: 55.0,
        status: 'normal',
      },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0% (Clean)', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '2.1% (Acceptable)', isSafe: true, severity: 'low' },
      { nameKey: 'aflatoxinParam', valueText: '18 ppb (Near upper limit)', isSafe: false, severity: 'high' },
      { nameKey: 'mycotoxinsParam', valueText: 'Low Risk', isSafe: true, severity: 'low' },
      { nameKey: 'fungusParam', valueText: 'Initial Fungal Growth (16% H2O)', isSafe: false, severity: 'high' },
    ],
    minerals: {
      calcium: '0.35%',
      phosphorus: '0.12%',
      magnesium: '0.18%',
    },
  },

  green_fodder: {
    id: 'RES-GREEN-03',
    sampleType: 'green_fodder',
    sampleName: 'Super Napier CO-4 Fresh Cut',
    brandName: 'Kamdhenu Field Plot #2',
    batchNumber: 'GN-FLD-09',
    testDate: '28 Sep, 08:30 AM',
    verdict: 'SAFE',
    score: 91,
    confidence: 99.2,
    advisoryKey: 'advisoryGreenSafe',
    sensorKitReadings: {
      moisture: 78.5,
      ph: 6.9,
      temperature: 26.0,
    },
    stripReadings: {
      ureaColor: '#E0E0E0',
      ureaReading: '0.0% (Clean)',
      aflatoxinColor: '#DCEDC8',
      aflatoxinReading: '< 2 ppb (Clean)',
    },
    metrics: {
      protein: {
        key: 'protein',
        nameKey: 'proteinLabel',
        value: 17.0,
        unit: '%',
        targetMin: 14.0,
        targetMax: 18.0,
        status: 'normal',
      },
      moisture: {
        key: 'moisture',
        nameKey: 'moistureLabel',
        value: 78.5,
        unit: '%',
        targetMin: 72.0,
        targetMax: 82.0,
        status: 'normal',
      },
      fibre: {
        key: 'fibre',
        nameKey: 'fibreLabel',
        value: 24.2,
        unit: '%',
        targetMin: 22.0,
        targetMax: 28.0,
        status: 'normal',
      },
      energy: {
        key: 'energy',
        nameKey: 'energyLabel',
        value: 64.5,
        unit: '% TDN',
        targetMin: 60.0,
        targetMax: 68.0,
        status: 'normal',
      },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0% (Clean Natural)', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '0.4% (Clean)', isSafe: true, severity: 'none' },
      { nameKey: 'aflatoxinParam', valueText: '0.0 ppb (Pure)', isSafe: true, severity: 'none' },
      { nameKey: 'mycotoxinsParam', valueText: 'Negative', isSafe: true, severity: 'none' },
      { nameKey: 'fungusParam', valueText: 'Zero Mould', isSafe: true, severity: 'none' },
    ],
    minerals: {
      calcium: '0.52%',
      phosphorus: '0.34%',
      magnesium: '0.24%',
    },
  },

  mineral_mix: {
    id: 'RES-MIN-04',
    sampleType: 'mineral_mix',
    sampleName: 'Chelated Type-II Mineral Mixture',
    brandName: 'Pashu Poshan Ltd',
    batchNumber: 'MIN-9104',
    testDate: '26 Sep, 11:20 AM',
    verdict: 'CAUTION',
    score: 58,
    confidence: 97.5,
    advisoryKey: 'advisoryMineralCaution',
    sensorKitReadings: {
      moisture: 3.8,
      ph: 7.2,
      temperature: 28.0,
    },
    stripReadings: {
      ureaColor: '#E0E0E0',
      ureaReading: '0.0%',
      aflatoxinColor: '#E0E0E0',
      aflatoxinReading: '0 ppb',
    },
    metrics: {
      protein: {
        key: 'protein',
        nameKey: 'proteinLabel',
        value: 0.0,
        unit: '%',
        targetMin: 0.0,
        targetMax: 0.0,
        status: 'normal',
      },
      moisture: {
        key: 'moisture',
        nameKey: 'moistureLabel',
        value: 3.8,
        unit: '%',
        targetMin: 1.5,
        targetMax: 4.0,
        status: 'normal',
      },
      fibre: {
        key: 'fibre',
        nameKey: 'fibreLabel',
        value: 0.2,
        unit: '%',
        targetMin: 0.0,
        targetMax: 0.5,
        status: 'normal',
      },
      energy: {
        key: 'energy',
        nameKey: 'energyLabel',
        value: 0.0,
        unit: '% TDN',
        targetMin: 0.0,
        targetMax: 0.0,
        status: 'normal',
      },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0% (Clean)', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '4.0% (Insoluble Silica)', isSafe: false, severity: 'high' },
      { nameKey: 'aflatoxinParam', valueText: '0 ppb', isSafe: true, severity: 'none' },
      { nameKey: 'mycotoxinsParam', valueText: 'Undetected', isSafe: true, severity: 'none' },
      { nameKey: 'fungusParam', valueText: 'Dry powder safe', isSafe: true, severity: 'none' },
    ],
    minerals: {
      calcium: '18.0% (Low, Target: 24%)',
      phosphorus: '9.2% (Target: 12%)',
      magnesium: '4.8% (Target: 5.0%)',
    },
  },

  silage: {
    id: 'RES-SIL-05',
    sampleType: 'silage',
    sampleName: 'Whole Crop Corn Silage',
    brandName: 'Bunker Pit Silo A',
    batchNumber: 'SIL-BNK-A',
    testDate: 'Today, 07:15 AM',
    verdict: 'CAUTION',
    score: 66,
    confidence: 98.1,
    advisoryKey: 'advisorySilageCaution',
    sensorKitReadings: {
      moisture: 67.2,
      ph: 4.9,
      temperature: 36.8,
    },
    stripReadings: {
      ureaColor: '#E0E0E0',
      ureaReading: '0.0%',
      aflatoxinColor: '#FFF59D',
      aflatoxinReading: '14 ppb (Moderate)',
    },
    metrics: {
      protein: {
        key: 'protein',
        nameKey: 'proteinLabel',
        value: 8.4,
        unit: '%',
        targetMin: 8.5,
        targetMax: 10.5,
        status: 'normal',
      },
      moisture: {
        key: 'moisture',
        nameKey: 'moistureLabel',
        value: 67.2,
        unit: '%',
        targetMin: 65.0,
        targetMax: 70.0,
        status: 'normal',
      },
      fibre: {
        key: 'fibre',
        nameKey: 'fibreLabel',
        value: 22.8,
        unit: '%',
        targetMin: 20.0,
        targetMax: 26.0,
        status: 'normal',
      },
      energy: {
        key: 'energy',
        nameKey: 'energyLabel',
        value: 62.0,
        unit: '% TDN',
        targetMin: 64.0,
        targetMax: 70.0,
        status: 'low',
      },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0% (Clean)', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '1.2% (Normal soil trace)', isSafe: true, severity: 'none' },
      { nameKey: 'aflatoxinParam', valueText: '14 ppb (Moderate)', isSafe: true, severity: 'low' },
      { nameKey: 'mycotoxinsParam', valueText: 'Butyric acid traces', isSafe: false, severity: 'high' },
      { nameKey: 'fungusParam', valueText: 'Edge Aerobic Spores', isSafe: false, severity: 'high' },
    ],
    minerals: {
      calcium: '0.38%',
      phosphorus: '0.24%',
      magnesium: '0.19%',
    },
  },
};

// ----------------------------------------------------
// 12 PAST TESTS HISTORY
// ----------------------------------------------------
export const PAST_TESTS_HISTORY: TestResultData[] = [
  SCRIPTED_RESULTS.compound,
  SCRIPTED_RESULTS.silage,
  SCRIPTED_RESULTS.dry_fodder,
  SCRIPTED_RESULTS.green_fodder,
  SCRIPTED_RESULTS.mineral_mix,
  {
    id: 'HIST-06',
    sampleType: 'compound',
    sampleName: 'Amul Dan Cattle Feed 20',
    brandName: 'Kaira Milk Union Ltd',
    batchNumber: 'AML-0922-A',
    testDate: '25 Sep, 02:45 PM',
    verdict: 'SAFE',
    score: 94,
    confidence: 99.4,
    advisoryKey: 'advisoryGreenSafe',
    metrics: {
      protein: { key: 'protein', nameKey: 'proteinLabel', value: 21.4, unit: '%', targetMin: 20, targetMax: 24, status: 'normal' },
      moisture: { key: 'moisture', nameKey: 'moistureLabel', value: 9.8, unit: '%', targetMin: 9, targetMax: 11, status: 'normal' },
      fibre: { key: 'fibre', nameKey: 'fibreLabel', value: 10.2, unit: '%', targetMin: 8, targetMax: 12, status: 'normal' },
      energy: { key: 'energy', nameKey: 'energyLabel', value: 72.8, unit: '% TDN', targetMin: 70, targetMax: 75, status: 'normal' },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0%', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '1.2%', isSafe: true, severity: 'none' },
      { nameKey: 'aflatoxinParam', valueText: '4 ppb', isSafe: true, severity: 'none' },
      { nameKey: 'mycotoxinsParam', valueText: 'None', isSafe: true, severity: 'none' },
      { nameKey: 'fungusParam', valueText: 'Clean', isSafe: true, severity: 'none' },
    ],
    minerals: { calcium: '1.4%', phosphorus: '0.8%', magnesium: '0.3%' },
  },
  {
    id: 'HIST-07',
    sampleType: 'compound',
    sampleName: 'Godrej Agrovet Milk More',
    brandName: 'Godrej Agrovet',
    batchNumber: 'GD-8911',
    testDate: '23 Sep, 10:15 AM',
    verdict: 'SAFE',
    score: 88,
    confidence: 98.7,
    advisoryKey: 'advisoryGreenSafe',
    metrics: {
      protein: { key: 'protein', nameKey: 'proteinLabel', value: 19.8, unit: '%', targetMin: 20, targetMax: 24, status: 'normal' },
      moisture: { key: 'moisture', nameKey: 'moistureLabel', value: 10.4, unit: '%', targetMin: 9, targetMax: 11, status: 'normal' },
      fibre: { key: 'fibre', nameKey: 'fibreLabel', value: 11.0, unit: '%', targetMin: 8, targetMax: 12, status: 'normal' },
      energy: { key: 'energy', nameKey: 'energyLabel', value: 71.2, unit: '% TDN', targetMin: 70, targetMax: 75, status: 'normal' },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0%', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '1.8%', isSafe: true, severity: 'none' },
      { nameKey: 'aflatoxinParam', valueText: '8 ppb', isSafe: true, severity: 'none' },
      { nameKey: 'mycotoxinsParam', valueText: 'None', isSafe: true, severity: 'none' },
      { nameKey: 'fungusParam', valueText: 'Clean', isSafe: true, severity: 'none' },
    ],
    minerals: { calcium: '1.2%', phosphorus: '0.7%', magnesium: '0.25%' },
  },
  {
    id: 'HIST-08',
    sampleType: 'compound',
    sampleName: 'Saurashtra Cottonseed Cake',
    brandName: 'Saurashtra Oil Mills',
    batchNumber: 'SC-4401',
    testDate: '21 Sep, 03:30 PM',
    verdict: 'CAUTION',
    score: 62,
    confidence: 96.8,
    advisoryKey: 'advisoryDryCaution',
    metrics: {
      protein: { key: 'protein', nameKey: 'proteinLabel', value: 22.1, unit: '%', targetMin: 22, targetMax: 26, status: 'normal' },
      moisture: { key: 'moisture', nameKey: 'moistureLabel', value: 12.8, unit: '%', targetMin: 8, targetMax: 10, status: 'high' },
      fibre: { key: 'fibre', nameKey: 'fibreLabel', value: 24.0, unit: '%', targetMin: 18, targetMax: 22, status: 'high' },
      energy: { key: 'energy', nameKey: 'energyLabel', value: 65.0, unit: '% TDN', targetMin: 68, targetMax: 74, status: 'normal' },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0%', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '3.4%', isSafe: true, severity: 'low' },
      { nameKey: 'aflatoxinParam', valueText: '16 ppb', isSafe: false, severity: 'high' },
      { nameKey: 'mycotoxinsParam', valueText: 'Gossypol residual', isSafe: true, severity: 'low' },
      { nameKey: 'fungusParam', valueText: 'Mild odor', isSafe: false, severity: 'low' },
    ],
    minerals: { calcium: '0.6%', phosphorus: '0.9%', magnesium: '0.4%' },
  },
  {
    id: 'HIST-09',
    sampleType: 'dry_fodder',
    sampleName: 'Wheat Straw Fine Bhusa',
    brandName: 'Punjab Agro Mandi Lot',
    batchNumber: 'WS-719',
    testDate: '19 Sep, 09:40 AM',
    verdict: 'SAFE',
    score: 86,
    confidence: 98.9,
    advisoryKey: 'advisoryGreenSafe',
    metrics: {
      protein: { key: 'protein', nameKey: 'proteinLabel', value: 3.8, unit: '%', targetMin: 3.5, targetMax: 4.5, status: 'normal' },
      moisture: { key: 'moisture', nameKey: 'moistureLabel', value: 9.4, unit: '%', targetMin: 8, targetMax: 11, status: 'normal' },
      fibre: { key: 'fibre', nameKey: 'fibreLabel', value: 36.5, unit: '%', targetMin: 34, targetMax: 40, status: 'normal' },
      energy: { key: 'energy', nameKey: 'energyLabel', value: 46.0, unit: '% TDN', targetMin: 42, targetMax: 48, status: 'normal' },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0%', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '1.4%', isSafe: true, severity: 'none' },
      { nameKey: 'aflatoxinParam', valueText: '2 ppb', isSafe: true, severity: 'none' },
      { nameKey: 'mycotoxinsParam', valueText: 'Clean', isSafe: true, severity: 'none' },
      { nameKey: 'fungusParam', valueText: 'Clean golden', isSafe: true, severity: 'none' },
    ],
    minerals: { calcium: '0.28%', phosphorus: '0.09%', magnesium: '0.12%' },
  },
  {
    id: 'HIST-10',
    sampleType: 'compound',
    sampleName: 'Kisan Golden Mash',
    brandName: 'Balaji Agro Mart',
    batchNumber: 'KG-1049',
    testDate: '18 Sep, 05:10 PM',
    verdict: 'REJECT',
    score: 32,
    confidence: 97.9,
    advisoryKey: 'advisoryCompoundReject',
    metrics: {
      protein: { key: 'protein', nameKey: 'proteinLabel', value: 12.8, unit: '%', targetMin: 20, targetMax: 24, status: 'danger' },
      moisture: { key: 'moisture', nameKey: 'moistureLabel', value: 13.4, unit: '%', targetMin: 9, targetMax: 11, status: 'danger' },
      fibre: { key: 'fibre', nameKey: 'fibreLabel', value: 16.4, unit: '%', targetMin: 8, targetMax: 12, status: 'high' },
      energy: { key: 'energy', nameKey: 'energyLabel', value: 54.0, unit: '% TDN', targetMin: 70, targetMax: 75, status: 'danger' },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '4.2% (Deadly Level)', isSafe: false, severity: 'critical' },
      { nameKey: 'sandParam', valueText: '8.9% (Heavy Grit)', isSafe: false, severity: 'critical' },
      { nameKey: 'aflatoxinParam', valueText: '34 ppb (Exceeds 20 ppb)', isSafe: false, severity: 'critical' },
      { nameKey: 'mycotoxinsParam', valueText: 'Ochratoxin A detected', isSafe: false, severity: 'critical' },
      { nameKey: 'fungusParam', valueText: 'Black mold spots', isSafe: false, severity: 'critical' },
    ],
    minerals: { calcium: '0.5%', phosphorus: '0.3%', magnesium: '0.1%' },
  },
  {
    id: 'HIST-11',
    sampleType: 'silage',
    sampleName: 'Tower Silo B Sorghum',
    brandName: 'Tower Silo B',
    batchNumber: 'SIL-TWR-B',
    testDate: '16 Sep, 11:00 AM',
    verdict: 'SAFE',
    score: 89,
    confidence: 98.4,
    advisoryKey: 'advisoryGreenSafe',
    metrics: {
      protein: { key: 'protein', nameKey: 'proteinLabel', value: 9.4, unit: '%', targetMin: 8.5, targetMax: 11, status: 'normal' },
      moisture: { key: 'moisture', nameKey: 'moistureLabel', value: 66.8, unit: '%', targetMin: 65, targetMax: 70, status: 'normal' },
      fibre: { key: 'fibre', nameKey: 'fibreLabel', value: 23.5, unit: '%', targetMin: 20, targetMax: 26, status: 'normal' },
      energy: { key: 'energy', nameKey: 'energyLabel', value: 66.2, unit: '% TDN', targetMin: 64, targetMax: 70, status: 'normal' },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0%', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '0.8%', isSafe: true, severity: 'none' },
      { nameKey: 'aflatoxinParam', valueText: '2 ppb', isSafe: true, severity: 'none' },
      { nameKey: 'mycotoxinsParam', valueText: 'Lactic acid 6.2%', isSafe: true, severity: 'none' },
      { nameKey: 'fungusParam', valueText: 'Sweet fermented aroma', isSafe: true, severity: 'none' },
    ],
    minerals: { calcium: '0.45%', phosphorus: '0.26%', magnesium: '0.22%' },
  },
  {
    id: 'HIST-12',
    sampleType: 'green_fodder',
    sampleName: 'African Tall Green Maize',
    brandName: 'Kamdhenu Field Plot #1',
    batchNumber: 'MZ-FLD-01',
    testDate: '15 Sep, 08:00 AM',
    verdict: 'SAFE',
    score: 93,
    confidence: 99.1,
    advisoryKey: 'advisoryGreenSafe',
    metrics: {
      protein: { key: 'protein', nameKey: 'proteinLabel', value: 10.2, unit: '%', targetMin: 9, targetMax: 12, status: 'normal' },
      moisture: { key: 'moisture', nameKey: 'moistureLabel', value: 74.0, unit: '%', targetMin: 70, targetMax: 78, status: 'normal' },
      fibre: { key: 'fibre', nameKey: 'fibreLabel', value: 21.0, unit: '%', targetMin: 20, targetMax: 25, status: 'normal' },
      energy: { key: 'energy', nameKey: 'energyLabel', value: 68.0, unit: '% TDN', targetMin: 65, targetMax: 72, status: 'normal' },
    },
    contaminants: [
      { nameKey: 'ureaParam', valueText: '0.0%', isSafe: true, severity: 'none' },
      { nameKey: 'sandParam', valueText: '0.5%', isSafe: true, severity: 'none' },
      { nameKey: 'aflatoxinParam', valueText: '0 ppb', isSafe: true, severity: 'none' },
      { nameKey: 'mycotoxinsParam', valueText: 'None', isSafe: true, severity: 'none' },
      { nameKey: 'fungusParam', valueText: 'Fresh green', isSafe: true, severity: 'none' },
    ],
    minerals: { calcium: '0.48%', phosphorus: '0.31%', magnesium: '0.20%' },
  },
];

// ----------------------------------------------------
// SILOS DATA
// ----------------------------------------------------
export const INITIAL_SILOS: SiloItem[] = [
  {
    id: 'silo-1',
    name: 'Bunker Silo A',
    type: 'Concrete Bunker (Corn Silage)',
    capacityTonnes: 120,
    daysPacked: 42,
    fermentationStage: 'Phase 4: Aerobic Risk Exposure',
    ph: 4.9,
    moisture: 67.2,
    temperature: 36.8,
    gasPpm: 18,
    riskStatus: 'CAUTION',
    riskScore: 68,
    history7Days: [
      { day: 'D-6', ph: 4.2, temp: 30.5 },
      { day: 'D-5', ph: 4.3, temp: 31.2 },
      { day: 'D-4', ph: 4.4, temp: 32.8 },
      { day: 'D-3', ph: 4.6, temp: 34.0 },
      { day: 'D-2', ph: 4.7, temp: 35.1 },
      { day: 'D-1', ph: 4.8, temp: 36.2 },
      { day: 'Today', ph: 4.9, temp: 36.8 },
    ],
  },
  {
    id: 'silo-2',
    name: 'Tower Silo B',
    type: 'Steel Tower (Sorghum Fodder)',
    capacityTonnes: 85,
    daysPacked: 75,
    fermentationStage: 'Phase 5: Stable Anaerobic Storage',
    ph: 4.1,
    moisture: 65.4,
    temperature: 28.2,
    gasPpm: 4,
    riskStatus: 'SAFE',
    riskScore: 92,
    history7Days: [
      { day: 'D-6', ph: 4.1, temp: 28.0 },
      { day: 'D-5', ph: 4.1, temp: 28.2 },
      { day: 'D-4', ph: 4.1, temp: 28.1 },
      { day: 'D-3', ph: 4.2, temp: 28.3 },
      { day: 'D-2', ph: 4.1, temp: 28.1 },
      { day: 'D-1', ph: 4.1, temp: 28.2 },
      { day: 'Today', ph: 4.1, temp: 28.2 },
    ],
  },
  {
    id: 'silo-3',
    name: 'Pit Silo C',
    type: 'Earthen Trench (Maize + Inoculant)',
    capacityTonnes: 60,
    daysPacked: 18,
    fermentationStage: 'Phase 3: Active Lactic Fermentation',
    ph: 4.3,
    moisture: 68.0,
    temperature: 31.4,
    gasPpm: 22,
    riskStatus: 'SAFE',
    riskScore: 85,
    history7Days: [
      { day: 'D-6', ph: 5.6, temp: 38.0 },
      { day: 'D-5', ph: 5.2, temp: 36.2 },
      { day: 'D-4', ph: 4.9, temp: 34.5 },
      { day: 'D-3', ph: 4.6, temp: 33.1 },
      { day: 'D-2', ph: 4.5, temp: 32.2 },
      { day: 'D-1', ph: 4.4, temp: 31.8 },
      { day: 'Today', ph: 4.3, temp: 31.4 },
    ],
  },
];

// ----------------------------------------------------
// STORAGE GODOWNS
// ----------------------------------------------------
export const STORAGE_GODOWNS: GodownItem[] = [
  {
    id: 'godown-1',
    name: 'Godown 1 (North Shed)',
    bagCount: 180,
    temperature: 32.4,
    humidity: 84.0,
    mouldRisk: 8.4,
    status: 'CAUTION',
    recommendations: [
      'Turn on exhaust fans for 6 continuous hours during afternoon heat.',
      'Place wooden pallets under bottom sacks; current floor contact causes condensation.',
      'Space sack stacks 2 feet apart to enable natural cross-ventilation.',
    ],
  },
  {
    id: 'godown-2',
    name: 'Godown 2 (South Yard Store)',
    bagCount: 320,
    temperature: 28.1,
    humidity: 58.0,
    mouldRisk: 2.1,
    status: 'SAFE',
    recommendations: [
      'Atmospheric condition is optimal for long-term dry concentrate storage.',
      'Maintain weekly perimeter inspection for rodent holes and sack tears.',
      'Apply FIFO (First-In, First-Out) dispatch rule for oldest batch LOT-701.',
    ],
  },
];

// ----------------------------------------------------
// TRACEABILITY BATCHES
// ----------------------------------------------------
export const BATCHES_LIST: BatchItem[] = [
  {
    id: 'batch-01',
    batchNumber: 'GN-4029-X',
    feedType: 'Shree Ganesh Super 22 Pellets',
    supplier: 'Ganesh Agro Industries, Anand',
    receivedDate: '30 Sep 2026',
    bags: 80,
    status: 'REJECT',
    score: 38,
    qrPayload: 'FEEDSCAN:BATCH:GN-4029-X:SUPPLIER:GANESH_AGRO:VERDICT:REJECT:UREA:3.8:DATE:2026-09-30',
    timeline: [
      { stage: 'Dispatched from Mill', date: '28 Sep 09:00 AM', detail: 'Loaded at GIDC Vitthal Udyognagar', done: true },
      { stage: 'Received at Farm Godown', date: '29 Sep 02:30 PM', detail: 'Unloaded 80 gunny bags in Shed 1', done: true },
      { stage: 'FeedScan Field Tested', date: '30 Sep 10:45 AM', detail: 'Failed adulteration: Urea 3.8%, Sand 7.4%', done: true },
      { stage: 'Quarantine & Return Order', date: '30 Sep 11:30 AM', detail: 'Formal rejection sent to supplier', done: false },
    ],
  },
  {
    id: 'batch-02',
    batchNumber: 'AML-0922-A',
    feedType: 'Amul Dan Balanced Cattle Feed',
    supplier: 'Kaira District Co-op Milk Producers',
    receivedDate: '25 Sep 2026',
    bags: 150,
    status: 'SAFE',
    score: 94,
    qrPayload: 'FEEDSCAN:BATCH:AML-0922-A:SUPPLIER:AMUL_KAIRA:VERDICT:SAFE:PROTEIN:21.4:DATE:2026-09-25',
    timeline: [
      { stage: 'Certified Lab Clearance', date: '24 Sep 08:00 AM', detail: 'Amul Central Testing Lab clearance #4491', done: true },
      { stage: 'Dispatched from Anand Plant', date: '24 Sep 03:00 PM', detail: 'Transported in moisture-proof tarp truck', done: true },
      { stage: 'Received at Kamdhenu Farm', date: '25 Sep 11:00 AM', detail: 'Inspected and stored on raised pallets', done: true },
      { stage: 'FeedScan Verification Scan', date: '25 Sep 02:45 PM', detail: 'Passed 94/100 score; Safe for lactating herd', done: true },
    ],
  },
  {
    id: 'batch-03',
    batchNumber: 'GD-8911',
    feedType: 'Godrej Agrovet Milk More 20',
    supplier: 'Godrej Agrovet Regional Depot',
    receivedDate: '23 Sep 2026',
    bags: 100,
    status: 'SAFE',
    score: 88,
    qrPayload: 'FEEDSCAN:BATCH:GD-8911:SUPPLIER:GODREJ:VERDICT:SAFE:PROTEIN:19.8:DATE:2026-09-23',
    timeline: [
      { stage: 'Plant Batch Clearance', date: '21 Sep 10:00 AM', detail: 'Batch quality certification QMS-90', done: true },
      { stage: 'Depot Transfer', date: '22 Sep 04:00 PM', detail: 'Vadodara distribution hub', done: true },
      { stage: 'Delivered to Farm', date: '23 Sep 09:30 AM', detail: 'Stacked in South Yard Godown 2', done: true },
      { stage: 'FeedScan Rapid Test', date: '23 Sep 10:15 AM', detail: 'Protein 19.8%, clean from all toxins', done: true },
    ],
  },
];

// ----------------------------------------------------
// COOPERATIVE OFFICER DASHBOARD DATA
// ----------------------------------------------------
export const OFFICER_KPIS = {
  totalBatchesTested: 1420,
  adulterationRate: 8.4, // %
  highRiskFarmsCount: 14,
  avgDistrictQuality: 82.6,
  ureaFlagsThisWeek: 19,
  aflatoxinFlagsThisWeek: 8,
};

export const REGIONAL_HEATMAP: OfficerBlockRisk[] = [
  { name: 'Anand Taluka', adulterationRate: 5.2, status: 'SAFE', testsCount: 420 },
  { name: 'Borsad Taluka', adulterationRate: 14.8, status: 'REJECT', testsCount: 310 },
  { name: 'Petlad Taluka', adulterationRate: 4.1, status: 'SAFE', testsCount: 260 },
  { name: 'Khambhat Taluka', adulterationRate: 11.2, status: 'CAUTION', testsCount: 240 },
  { name: 'Umreth Taluka', adulterationRate: 3.4, status: 'SAFE', testsCount: 190 },
];

export const SUPPLIER_LEADERBOARD: SupplierRanking[] = [
  { name: 'Amul Cooperative Feed Plants', location: 'Kanjari & Mogar', score: 94, grade: 'A', status: 'SAFE', batchesSupplied: 540 },
  { name: 'Godrej Agrovet Cattle Nutrition', location: 'Vadodara Hub', score: 88, grade: 'A', status: 'SAFE', batchesSupplied: 320 },
  { name: 'Saurashtra Feed & Oil Mills', location: 'Bhavnagar Rd', score: 72, grade: 'B', status: 'CAUTION', batchesSupplied: 180 },
  { name: 'Narmada Agro Feed Corp', location: 'Bharuch Unit', score: 68, grade: 'B', status: 'CAUTION', batchesSupplied: 140 },
  { name: 'Shree Ganesh Agro Industries', location: 'Anand GIDC', score: 41, grade: 'D', status: 'REJECT', batchesSupplied: 95 },
  { name: 'Balaji Agro Pellets & Mash', location: 'Khambhat Bypass', score: 36, grade: 'D', status: 'REJECT', batchesSupplied: 62 },
];

export const OFFICER_ALERTS = [
  {
    id: 'AL-01',
    severity: 'critical',
    title: 'Adulteration Cluster Detected in Borsad Block',
    desc: '3 dairy societies reported high urea (3.5%+) in "Ganesh Super 22" batch #GN-4029. Commercial ban recommended.',
    time: '2 hours ago',
  },
  {
    id: 'AL-02',
    severity: 'high',
    title: 'Humid Weather Silage Spoilage Warning',
    desc: '48-hour continuous monsoon rain has elevated bunker mould risks across 22 cooperative member silos.',
    time: '5 hours ago',
  },
  {
    id: 'AL-03',
    severity: 'medium',
    title: 'Aflatoxin Surge in Groundnut Cake Consignments',
    desc: 'Average B1 contamination reached 18 ppb in Saurashtra supply routes. Pre-grinding inspection required.',
    time: 'Yesterday',
  },
];
