export const config = {
	matic: {
		contractAddressMarketplace: '0xd1c891713c345e2F2e15A79Ca20C79fF8A6f4881', // new marketplace
		contractAddressNFT: '0xadbA123c3e6d829eA83aC9165f193Efe2591c85a', // COOL
		addressOwner: '0x23Bc35E4936782efE9f44FDd1239204Ab44c296a',
		chainId: '137',
		fetchBase: 'https://adventure-marketplace.herokuapp.com',
		marketplaceSocketURL: 'https://adventure-marketplace.herokuapp.com',
		contractAddressNFT2: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' // also local
	},
	local: {
		contractAddressMarketplace: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
		contractAddressNFT: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
		addressOwner: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
		contractAddressNFT2: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
		chainId: '31337',
		fetchBase: 'http://localhost:8001',
		marketplaceSocketURL: 'http://localhost:8001'
	},
	userAddresses: {
		leo: '0x28FA71AC9207780345831548FA47f34CBd00181f',
		matic: '0x48E8479b4906D45fBE702A18ac2454F800238b37',
		adventureNetworks: '0x45ea1e3411cb6ae18c2280eef33ac125fed2838d'
	}
};

export type Networks = 'local' | 'matic';

// export const network: Networks = 'local';
export const network: Networks = 'matic';
