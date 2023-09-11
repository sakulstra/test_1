# UI repository for aave governance version 3

Enabling users to:

- Participate in the Aave Governance V3

## Build on

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- Web3: [BGD web3 UI helpers](https://github.com/bgd-labs/fe-shared), [ether.js (v5.7.2)](https://docs.ethers.org/v5/), [web3-react](https://github.com/Uniswap/web3-react)
- UI: [MUI system](https://mui.com/system/getting-started/), [headlessui](https://headlessui.com/)

## How to run localy

First you can change or use already set governance core network name in appConfig file (coreName variable), [appConfig](./src/utils/appConfig.ts).

Currently [available networks](https://github.com/bgd-labs/aave-governance-ui-helpers/blob/main/src/helpers/appConfig.ts#L7).

Then install submodules & packages:

before first run:
```sh
git submodule init
git submodule update --remote --init
yarn

yarn dev
// or
yarn build && yarn start
```

after first run:
```sh
yarn dev
// or
yarn build && yarn start
```

for submodules update:
```sh
git submodule update --remote --init
```

## Gasless voting

The project supports voting with zero gas cost, for this we use the [Gelato](https://docs.gelato.network/introduction/what-is-gelato).

## Deployments
### Vercel
You can deploy your version of the application using Vercel by clicking on this button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Argeare5/test_1)

### IPFS
We use [Pinata](https://docs.pinata.cloud/docs) to deploy a project on ipfs.

| Latest ipfs link | [https://bafybeiapzaopopm6moi4pwiz7md75uwzbgy6bagbaktfcompiovf4zf5k4.ipfs.cf-ipfs.com/](https://bafybeiapzaopopm6moi4pwiz7md75uwzbgy6bagbaktfcompiovf4zf5k4.ipfs.cf-ipfs.com/) |
|------------------|-------------------------------------------------------------------------------------|

## License

Copyright © 2023, [BGD Labs](https://bgdlabs.com/). Released under the [MIT License](./LICENSE).
