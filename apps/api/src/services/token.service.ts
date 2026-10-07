import apiClient from '../lib/api-client';

export interface Token {
  id: string;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export const tokenService = {
  async getTokens(): Promise<Token[]> {
    const response = await apiClient.get('/tokens');
    return response.data;
  },

  async getTokenById(id: string): Promise<Token> {
    const response = await apiClient.get(`/tokens/${id}`);
    return response.data;
  },

  async getTokenByAddress(address: string): Promise<Token> {
    const response = await apiClient.get(`/tokens/address/${address}`);
    return response.data;
  },
};
