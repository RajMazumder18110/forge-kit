type Chain = {
  id: string;
  rpc: string;
  name: string;
  chainId: number;
};

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: "mainnet",
    name: "Mainnet",
    rpc: "https://eth.drpc.org",
    chainId: 1,
  },
  {
    id: "bsc",
    name: "Binance Smart Chain",
    rpc: "https://bsc-dataseed.binance.org/",
    chainId: 56,
  },
  {
    id: "manta",
    name: "Manta",
    rpc: "https://pacific-rpc.manta.network/http",
    chainId: 169,
  },
  {
    id: "sepolia",
    name: "Sepolia (Testnet)",
    rpc: "https://sepolia.drpc.org",
    chainId: 11155111,
  },
  {
    id: "bsc_test",
    name: "Binance Smart Chain (Testnet)",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545",
    chainId: 97,
  },
];
