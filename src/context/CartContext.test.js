import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthContext } from './AuthContext';
import { CartContext, CartProvider } from './CartContext';
import { getCartApi } from '../services/api';

jest.mock('../services/api', () => ({
  getCartApi: jest.fn(),
  addToCartApi: jest.fn(),
  updateCartItemApi: jest.fn(),
  removeCartItemApi: jest.fn(),
  clearCartApi: jest.fn(),
}));

test('CartProvider handles empty cart payloads safely', async () => {
  getCartApi.mockResolvedValue({ data: { items: [] } });

  render(
    <AuthContext.Provider value={{ user: { _id: 'user-1' } }}>
      <CartProvider>
        <CartContext.Consumer>
          {(value) => <div data-testid="cart-count">{value.cartCount}</div>}
        </CartContext.Consumer>
      </CartProvider>
    </AuthContext.Provider>
  );

  await waitFor(() => expect(screen.getByTestId('cart-count')).toHaveTextContent('0'));
});
