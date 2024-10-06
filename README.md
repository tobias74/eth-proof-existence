# Proof of Existence Dapp

This project is a decentralized application (Dapp) that allows users to notarize files on the Ethereum blockchain by interacting with a smart contract. The application is built with React and integrates wallet connection and blockchain interaction features using `wagmi` and `RainbowKit`.

## Features

- **File Notarization:** Users can select files, and the app will compute a hash of the file in the browser and notarize it on the blockchain.
- **Wallet Connection:** The app provides wallet connection features with different configurations (with or without WalletConnect).
- **Multilingual Support:** The app supports multiple languages, including English and French, using `i18next`.
- **Test Network Support:** The app is designed to work with both testnets and mainnets based on the provided configuration.

## Technologies Used

- **React**: A JavaScript library for building the user interface.
- **React Router**: To manage navigation between pages.
- **Wagmi**: A library for working with Ethereum wallets and contracts.
- **RainbowKit**: For connecting Ethereum wallets, with localization support.
- **Tanstack Query**: For managing and caching data.
- **i18next**: For handling translations and localization.

## Smart Contract

The smart contract allows users to notarize document hashes on the Ethereum blockchain. Each hash is stored along with its timestamp and block number.

### Contract Functions

- `notarize(bytes32 hash)`: Stores a hash with the current block number and timestamp.
- `getByHash(bytes32 hash)`: Retrieves the timestamp and block number associated with a hash.

### Example Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract ProofOfExistence {

    struct Record {
        uint mineTime;
        uint blockNumber;
    }

    mapping (bytes32 => Record) private proofs;

    event DocumentNotarized(
        address from,
        bytes32 hash,
        uint mineTime,
        uint blockNumber
    );

    function notarize(bytes32 hash) public {
        require(proofs[hash].mineTime == 0);
        Record memory newRecord = Record(now, block.number);
        proofs[hash] = newRecord;
        emit DocumentNotarized(msg.sender, hash, newRecord.mineTime, newRecord.blockNumber);
    }

    function getByHash(bytes32 hash) public view returns (uint, uint) {
        return (proofs[hash].mineTime, proofs[hash].blockNumber);
    }
}
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/proof-of-existence.git
   cd proof-of-existence
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

## Configuration

The application uses two configurations for wallet connection: one with WalletConnect (`configWithWalletConnect`) and another with injected wallets only (`configOnlyInjected`). These configurations can be found in the `config.ts` and `config-alt.ts` files, respectively. You can adjust these configurations based on your requirements, such as supporting testnets or mainnets.

## Usage

### Gateway Management

The app supports a gateway acceptance flow:

- **Pending Gateway:** Users are presented with information about the gateway and must accept or decline.
- **Accepted Gateway:** If the gateway is accepted, users can interact with the application and notarize files on the blockchain.
- **Declined Gateway:** If the gateway is declined, the user is informed that access is denied.

### Notarizing a File

1. **Connect your wallet.**
2. **Select a file.** The app will compute the hash of the file in the browser.
3. **Notarize the file.** The hash is sent to the smart contract, which stores the file's hash on the blockchain.

## License

This project is licensed under the MIT License.
