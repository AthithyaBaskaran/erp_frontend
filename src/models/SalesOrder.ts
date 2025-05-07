// SalesOrder.ts - Type definitions for Sales Order related functionality

// Status options for sales orders
export enum SalesOrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

// Base interface for a sales order
export interface SalesOrder {
    id?: number;
    orderId?: number;
    customer: string;
    categoryId: number;
    productName: string;
    price_per_unit: number;
    quantity: number;
    amount: number;
    status?: SalesOrderStatus;
    createdAt?: string;
    updatedAt?: string;
    remarks?: string;
    deliveryDate?: string;
    processingRemarks?: string;
}

// Request type for creating a new sales order
export interface CreateSalesOrderRequest {
    customer: string;
    categoryId: number;
    productName: string;
    price_per_unit: number;
    quantity: number;
    amount: number;
}

// Response type for sales order creation
export interface CreateSalesOrderResponse {
    statusCode: number;
    statusMessage: string;
    data?: SalesOrder;
}

// Response type for fetching sales orders
export interface SalesOrderResponse {
    statusCode: number;
    statusMessage: string;
    data: SalesOrder[];
}