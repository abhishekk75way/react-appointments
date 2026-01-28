export interface TimeSlot {
  startTime: string; 
  endTime: string;   
  available: boolean;
}

export interface DailyAvailability {
  date: string; 
  slots: TimeSlot[];
}
