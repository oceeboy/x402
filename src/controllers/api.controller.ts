import { Request, Response } from 'express';
import { ApiResponse } from '../models';
import logger from '../utils/logger';

/**
 * Protected API controller that returns mock e-commerce data
 */
export class ApiController {
  /**
   * GET /api/getUserData - Protected endpoint that costs 1 unit
   * Returns mock e-commerce user data
   */
  getUserData = (req: Request, res: Response): void => {
    const clientId = req.headers['x-client-id'] as string;

    // Mock e-commerce data
    const userData = {
      clientId: clientId,
      name: 'Chika Fashion',
      topCategory: 'Dresses',
      bestSeller: 'Black Midi Dress',
      totalOrders: 1247,
      averageOrderValue: 89.5,
      favoriteColors: ['Black', 'Navy', 'Burgundy'],
      lastPurchase: '2024-10-28T10:30:00Z',
      membershipLevel: 'Gold',
      recommendations: [
        'Elegant Evening Gown',
        'Casual Summer Dress',
        'Professional Blazer',
      ],
    };

    const response: ApiResponse = {
      success: true,
      data: userData,
      message: 'User data retrieved successfully',
    };

    logger.info(`Served user data for client: ${clientId}`);
    res.json(response);
  };

  /**
   * GET /api/products - Another protected endpoint
   */
  getProducts = (req: Request, res: Response): void => {
    const clientId = req.headers['x-client-id'] as string;

    const products = [
      {
        id: 'p001',
        name: 'Black Midi Dress',
        price: 79.99,
        category: 'Dresses',
        inStock: true,
        rating: 4.8,
      },
      {
        id: 'p002',
        name: 'Elegant Evening Gown',
        price: 149.99,
        category: 'Dresses',
        inStock: true,
        rating: 4.9,
      },
      {
        id: 'p003',
        name: 'Professional Blazer',
        price: 89.99,
        category: 'Outerwear',
        inStock: false,
        rating: 4.6,
      },
    ];

    const response: ApiResponse = {
      success: true,
      data: products,
      message: 'Products retrieved successfully',
    };

    logger.info(`Served products data for client: ${clientId}`);
    res.json(response);
  };

  /**
   * GET /api/orders - Protected endpoint for order history
   */
  getOrders = (req: Request, res: Response): void => {
    const clientId = req.headers['x-client-id'] as string;

    const orders = [
      {
        id: 'ord001',
        date: '2024-10-28T10:30:00Z',
        total: 79.99,
        status: 'delivered',
        items: ['Black Midi Dress'],
      },
      {
        id: 'ord002',
        date: '2024-10-15T14:22:00Z',
        total: 149.99,
        status: 'delivered',
        items: ['Elegant Evening Gown'],
      },
    ];

    const response: ApiResponse = {
      success: true,
      data: orders,
      message: 'Order history retrieved successfully',
    };

    logger.info(`Served order history for client: ${clientId}`);
    res.json(response);
  };
}
