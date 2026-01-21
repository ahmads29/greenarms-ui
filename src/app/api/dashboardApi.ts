// Placeholder API functions for Dashboard data
// Replace the BASE_URL and endpoints with your actual API

const BASE_URL = "https://api.greenarms.com"; // Replace with your actual API URL
const USE_MOCK_DATA = true; // Set to false when connecting to real API

export interface ProductionMetrics {
  totalProductionPower: number;
  installedCapacity: number;
  capacityUtilization: number;
  dailySolarProduction: number;
  monthlySolarProduction: number;
  yearlySolarProduction: number;
  totalProduction: number;
  updatedAt: string;
}

export interface PlantStatusMetrics {
  totalPlants: number;
  incompletePlants: number;
  offlinePlants: number;
  partiallyOfflinePlants: number;
  plantsWithAlerts: number;
}

export interface HistoricalProductionData {
  day: string;
  production: number;
}

export interface PeakHourRanking {
  id: string;
  name: string;
  address: string;
  kwh: number;
}

export interface PowerNormalizationRanking {
  id: string;
  name: string;
  percentage: number;
}

// Fetch Production Overview Metrics
export async function fetchProductionMetrics(): Promise<ProductionMetrics> {
  // Return mock data immediately if using mock mode
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalProductionPower: 470.8,
          installedCapacity: 600,
          capacityUtilization: 78.47,
          dailySolarProduction: 180.7,
          monthlySolarProduction: 3.43,
          yearlySolarProduction: 41.16,
          totalProduction: 254.65,
          updatedAt: new Date().toISOString(),
        });
      }, 500); // Simulate network delay
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/api/dashboard/production-metrics`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY_HERE',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch production metrics');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching production metrics:', error);
    // Return mock data as fallback
    return {
      totalProductionPower: 470.8,
      installedCapacity: 600,
      capacityUtilization: 78.47,
      dailySolarProduction: 180.7,
      monthlySolarProduction: 3.43,
      yearlySolarProduction: 41.16,
      totalProduction: 254.65,
      updatedAt: new Date().toISOString(),
    };
  }
}

// Fetch Plant Status Metrics
export async function fetchPlantStatusMetrics(): Promise<PlantStatusMetrics> {
  // Return mock data immediately if using mock mode
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalPlants: 3,
          incompletePlants: 1,
          offlinePlants: 1,
          partiallyOfflinePlants: 0,
          plantsWithAlerts: 3,
        });
      }, 500);
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/api/dashboard/plant-status`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY_HERE',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plant status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching plant status:', error);
    // Return mock data as fallback
    return {
      totalPlants: 3,
      incompletePlants: 1,
      offlinePlants: 1,
      partiallyOfflinePlants: 0,
      plantsWithAlerts: 3,
    };
  }
}

// Fetch Historical Production Data
export async function fetchHistoricalProduction(
  month: string,
  viewMode: 'Month' | 'Year'
): Promise<HistoricalProductionData[]> {
  // Return mock data immediately if using mock mode
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          const baseProduction = 110 + Math.random() * 60;
          const weekendFactor = day % 7 === 0 || day % 7 === 6 ? 0.85 : 1;
          const production = baseProduction * weekendFactor;
          
          return {
            day: day.toString(),
            production: Math.round(production * 10) / 10,
          };
        }));
      }, 500);
    });
  }

  try {
    const response = await fetch(
      `${BASE_URL}/api/dashboard/historical-production?month=${month}&viewMode=${viewMode}`,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY_HERE',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch historical production');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical production:', error);
    // Return mock data as fallback
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const baseProduction = 110 + Math.random() * 60;
      const weekendFactor = day % 7 === 0 || day % 7 === 6 ? 0.85 : 1;
      const production = baseProduction * weekendFactor;
      
      return {
        day: day.toString(),
        production: Math.round(production * 10) / 10,
      };
    });
  }
}

// Fetch Peak Hour Rankings
export async function fetchPeakHourRankings(): Promise<PeakHourRanking[]> {
  // Return mock data immediately if using mock mode
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "1", name: "DSS Holding", address: "Royal Tower, Mar Mikhayel", kwh: 0.72 },
          { id: "2", name: "Affif Alhalum", address: "Aynab", kwh: 2.1 },
          { id: "3", name: "Vahahn Iskaalian", address: "Sin el fil municipality", kwh: 2.33 },
          { id: "4", name: "Sodeeo Amraoun", address: "Beirut, Sodeeo", kwh: 2.64 },
        ]);
      }, 500);
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/api/dashboard/peak-hour-rankings`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY_HERE',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch peak hour rankings');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching peak hour rankings:', error);
    // Return mock data as fallback
    return [
      { id: "1", name: "DSS Holding", address: "Royal Tower, Mar Mikhayel", kwh: 0.72 },
      { id: "2", name: "Affif Alhalum", address: "Aynab", kwh: 2.1 },
      { id: "3", name: "Vahahn Iskaalian", address: "Sin el fil municipality", kwh: 2.33 },
      { id: "4", name: "Sodeeo Amraoun", address: "Beirut, Sodeeo", kwh: 2.64 },
    ];
  }
}

// Fetch Power Normalization Rankings
export async function fetchPowerNormalizationRankings(): Promise<PowerNormalizationRanking[]> {
  // Return mock data immediately if using mock mode
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "1", name: "VMP Hadded Studio", percentage: 0 },
          { id: "2", name: "Omar Fakhoury", percentage: 0 },
          { id: "3", name: "مؤسسة طريق الحضارات", percentage: 0 },
          { id: "4", name: "I-Smile dental clinic", percentage: 0 },
          { id: "5", name: "Majdel community service", percentage: 0 },
          { id: "6", name: "French Avenue", percentage: 0 },
          { id: "7", name: "Agrohub", percentage: 1.19 },
          { id: "8", name: "مدرسة بنت جبيل الرسمية للبنات", percentage: 1.45 },
        ]);
      }, 500);
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/api/dashboard/power-normalization-rankings`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY_HERE',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch power normalization rankings');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching power normalization rankings:', error);
    // Return mock data as fallback
    return [
      { id: "1", name: "VMP Hadded Studio", percentage: 0 },
      { id: "2", name: "Omar Fakhoury", percentage: 0 },
      { id: "3", name: "مؤسسة طريق الحضارات", percentage: 0 },
      { id: "4", name: "I-Smile dental clinic", percentage: 0 },
      { id: "5", name: "Majdel community service", percentage: 0 },
      { id: "6", name: "French Avenue", percentage: 0 },
      { id: "7", name: "Agrohub", percentage: 1.19 },
      { id: "8", name: "مدرسة بنت جبيل الرسمية للبنات", percentage: 1.45 },
    ];
  }
}