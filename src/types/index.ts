export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED',
  RETURNED = 'RETURNED',
}

export enum ShipmentPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ShipmentType {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  OVERNIGHT = 'OVERNIGHT',
  FREIGHT = 'FREIGHT',
  HAZMAT = 'HAZMAT',
  REFRIGERATED = 'REFRIGERATED',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  department: string;
  avatar?: string;
  isActive: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  type: ShipmentType;
  origin: Address;
  destination: Address;
  weight: number;
  dimensions: Dimensions;
  description: string;
  specialInstructions?: string;
  carrier: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  cost: number;
  insurance: number;
  isFlagged: boolean;
  flagReason?: string;
  assignedDriver?: string;
  vehicleId?: string;
  createdBy?: { id: string; fullName: string };
  lastUpdatedBy?: { id: string; fullName: string };
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentStats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
  delayed: number;
  cancelled: number;
  flagged: number;
  avgCost: number;
  totalCost: number;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  currentPage: number;
}

export interface ShipmentEdge {
  node: Shipment;
  cursor: string;
}

export interface ShipmentConnection {
  edges: ShipmentEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface ShipmentFilter {
  status?: ShipmentStatus[];
  priority?: ShipmentPriority[];
  type?: ShipmentType[];
  carrier?: string;
  isFlagged?: boolean;
  search?: string;
}

export type ViewMode = 'grid' | 'tile';

