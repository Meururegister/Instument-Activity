
export enum InstrumentStatus {
  AVAILABLE = 'Available',
  BORROWED = 'Borrowed',
  MAINTENANCE = 'Maintenance'
}

export interface Instrument {
  id: string;
  name: string;
  type: string;
  barcode: string;
  status: InstrumentStatus;
  image: string;
  lastBorrowedBy?: string;
  lastBorrowedDate?: string;
}

export interface BorrowRecord {
  id: string;
  instrumentId: string;
  instrumentName: string;
  borrowerName: string;
  borrowDate: string;
  returnDate?: string;
  status: 'active' | 'returned';
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  name: string;
}

export interface DashboardStats {
  totalInstruments: number;
  currentlyBorrowed: number;
  availableNow: number;
  maintenanceCount: number;
}
