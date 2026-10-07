import axios from 'axios';

class BlockchainClient {
  private axiosInstance: ReturnType<typeof axios.create>;

  constructor(private readonly rpcUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: rpcUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async call(method: string, params: unknown[] = []): Promise<unknown> {
    const response = await this.axiosInstance.post('/', {
      jsonrpc: '2.0',
      method,
      params,
      id: Date.now(),
    });
    return response.data.result;
  }

  async getBalance(address: string): Promise<string> {
    return this.call('eth_getBalance', [address, 'latest']);
  }

  async getBlockNumber(): Promise<string> {
    return this.call('eth_blockNumber', []);
  }

  async sendTransaction(signedTx: string): Promise<string> {
    return this.call('eth_sendRawTransaction', [signedTx]);
  }
}

export default BlockchainClient;
