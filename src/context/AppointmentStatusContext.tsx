import { createContext, useContext, useState, type ReactNode } from "react";

export type AppointmentStatusType =
  | "booking"
  | "rescheduling"
  | "cancelling"
  | "completed";

interface AppointmentStatus {
  status: AppointmentStatusType;
  progress?: number;
}

interface AppointmentStatusContextType {
  showStatus: (status: AppointmentStatusType, progress?: number) => void;
  hideStatus: () => void;
  currentStatus: AppointmentStatus | null;
}

const AppointmentStatusContext = createContext<AppointmentStatusContextType>({
  showStatus: () => {},
  hideStatus: () => {},
  currentStatus: null,
});

export const useAppointmentStatus = () =>
  useContext(AppointmentStatusContext);

export const AppointmentStatusProvider = ({ children }: { children: ReactNode }) => {
  const [currentStatus, setCurrentStatus] = useState<AppointmentStatus | null>(
    null
  );

  const showStatus = (status: AppointmentStatusType, progress?: number) => {
    setCurrentStatus({ status, progress });
  };

  const hideStatus = () => setCurrentStatus(null);

  return (
    <AppointmentStatusContext.Provider
      value={{ showStatus, hideStatus, currentStatus }}
    >
      {children}
    </AppointmentStatusContext.Provider>
  );
};
