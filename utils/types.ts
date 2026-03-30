/**
 * Centralized type definitions for the Playwright test suite
 */

export interface SauceDemoUser {
  username: string;
  password: string;
}

export interface InventoryItem {
  name: string;
  price: string;
  description: string;
}

export interface CartItem {
  name: string;
  price: string;
  quantity: number;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ChatResponse {
  response: string;
  usage: TokenUsage;
}

export interface TodoItem {
  title: string;
  completed: boolean;
}
