export interface PulseItem {
  id: string;
  label: string;
  category: string;
  state?: string;
  trend: "up" | "down" | "stable";
  change: string;
}

export const PULSE_ITEMS: PulseItem[] = [
  { id: "1", label: "Cost of Living", category: "COST_OF_LIVING", trend: "up", change: "+18%" },
  { id: "2", label: "Housing Crisis", category: "HOUSING", trend: "up", change: "+24%" },
  { id: "3", label: "Healthcare Demand", category: "HEALTHCARE", trend: "up", change: "+31%" },
  { id: "4", label: "Rent Stress", category: "HOUSING", state: "VIC", trend: "up", change: "+42%" },
  { id: "5", label: "Grocery Inflation", category: "COST_OF_LIVING", trend: "up", change: "+19%" },
  { id: "6", label: "Mental Health Wait", category: "HEALTHCARE", trend: "up", change: "+56%" },
  { id: "7", label: "Teacher Shortage", category: "EDUCATION", trend: "up", change: "+28%" },
  { id: "8", label: "Train Delays", category: "TRANSPORT", state: "NSW", trend: "up", change: "+33%" },
  { id: "9", label: "Homelessness", category: "HOUSING", trend: "up", change: "+21%" },
  { id: "10", label: "Flood Recovery", category: "CLIMATE", state: "QLD", trend: "stable", change: "ongoing" },
  { id: "11", label: "Fuel Prices", category: "COST_OF_LIVING", trend: "up", change: "+12%" },
  { id: "12", label: "Visa Backlogs", category: "IMMIGRATION", trend: "up", change: "+15%" },
  { id: "13", label: "Youth Unemployment", category: "SAFETY", trend: "up", change: "+8%" },
  { id: "14", label: "Water Security", category: "CLIMATE", state: "SA", trend: "stable", change: "critical" },
  { id: "15", label: "HECS Burden", category: "EDUCATION", trend: "up", change: "+22%" },
  { id: "16", label: "GP Access", category: "HEALTHCARE", state: "Rural", trend: "down", change: "-14%" },
  { id: "17", label: "Social Housing", category: "HOUSING", trend: "down", change: "-5%" },
  { id: "18", label: "Energy Bills", category: "COST_OF_LIVING", trend: "up", change: "+34%" },
  { id: "19", label: "Road Congestion", category: "TRANSPORT", state: "VIC", trend: "up", change: "+11%" },
  { id: "20", label: "Bushfire Prep", category: "CLIMATE", trend: "stable", change: "seasonal" },
];
