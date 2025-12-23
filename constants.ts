
import { Instrument, InstrumentStatus } from './types';

export const INITIAL_INSTRUMENTS: Instrument[] = [
  {
    id: '1',
    name: 'Fender Stratocaster',
    type: 'Electric Guitar',
    barcode: 'GTR-001',
    status: InstrumentStatus.AVAILABLE,
    image: 'https://picsum.photos/seed/guitar1/400/300'
  },
  {
    id: '2',
    name: 'Yamaha U1 Piano',
    type: 'Piano',
    barcode: 'PNO-001',
    status: InstrumentStatus.BORROWED,
    image: 'https://picsum.photos/seed/piano1/400/300',
    lastBorrowedBy: 'สมชาย รักดี',
    lastBorrowedDate: '2023-10-25 10:30'
  },
  {
    id: '3',
    name: 'Stradivarius Replica',
    type: 'Violin',
    barcode: 'VLN-001',
    status: InstrumentStatus.AVAILABLE,
    image: 'https://picsum.photos/seed/violin1/400/300'
  },
  {
    id: '4',
    name: 'Pearl Export Drum Set',
    type: 'Drums',
    barcode: 'DRM-001',
    status: InstrumentStatus.MAINTENANCE,
    image: 'https://picsum.photos/seed/drums1/400/300'
  },
  {
    id: '5',
    name: 'Taylor 214ce',
    type: 'Acoustic Guitar',
    barcode: 'GTR-002',
    status: InstrumentStatus.AVAILABLE,
    image: 'https://picsum.photos/seed/guitar2/400/300'
  }
];

export const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
