// TODO: need fix texts

import { appConfig } from '../../utils/appConfig';
import { getChainName } from './getChainName';

export const texts = {
  proposals: {
    proposalListTitle: 'Proposals',
    voted: 'You voted',
    votingPower: 'Voting power',
    detailsModalTitle: 'Proposal life cycle details',
    vote: 'Vote',
    notEnoughPower: 'You don’t have enough voting power to vote',
    notEnough: 'Not enough',
    toVote: 'to vote',
    viewAll: 'View all',
    searchPlaceholder: 'Search proposals',
    yourVotingPower: 'Your voting power:',
    votingNotStarted: (chainId: number) =>
      `Voting on ${getChainName(
        chainId || appConfig.govCoreChainId,
      )} has not started yet`,
    walletNotConnected: 'Wallet is not connected',
    notVoted: 'You didn’t voted on this proposal',
    author: 'Author',
    canBeClosedByPropositionPower:
      'Proposal can be closed because of creator proposition power not enough',
    detailsLinkForumDiscussion: 'Forum discussion',
    detailsLinkSnapshotVoting: 'Snapshot voting',
    detailsLinkBGDReport: 'BGD Report',
    detailsLinkSeatbeltReport: 'Seatbelt report',
    detailsShareTwitter: 'Share on twitter',
    detailsRawIpfs: 'Raw-Ipfs',
    timelinePointCreated: 'Created',
    timelinePointOpenVote: 'Open to vote',
    timelinePointVotingClosed: 'Voting closed',
    timelinePointPayloadsExecuted: 'Payloads executed',
    timelinePointFinished: 'Finished',
    timelinePointCanceled: 'Canceled',
    voters: 'Voters',
    action: 'Action',
    votersListFinishedNoDataTitle: 'No one has voted for this proposal',
    votersListNoDataTitle: 'So far, no one has voted for this proposal',
    votersListShowAll: 'Show all',
    votersListTopVoters: 'Top voters',
    votersListVotingPower: 'Voting power',
    votersListSupport: 'Support',
  },
  proposalActions: {
    proposalCreated: 'Proposal created',
    activateVoting: 'Activate voting',
    activateVotingTimer: 'for activate voting',
    proposalActivated: 'Proposal activated',
    proofsSent: 'Proofs sent',
    waitForBridging: 'Waiting for bridging',
    votingPassed: 'Voting passed',
    closeVoting: 'Close voting',
    votingClosedResultsSent: 'Voting closed and results sent',
    proposalTimeLocked: 'Proposal is time-locked',
    executeProposal: 'Execute proposal',
    executeProposalTimer: 'for proposal execution',
    proposalExecuted: 'Proposal executed',
    payloadsTimeLocked: 'Payloads are time-locked',
    executePayload: 'Execute payload',
    expiredPayload: 'Payload expired',
    executePayloadsTimer: 'for payloads execution',
    noWalletTitle: 'Connect wallet to do actions',
    noWalletButtonTitle: 'Connect wallet',
    activateVotingError:
      'Error during the activate voting, check console for more details',
    activateVotingDescription: 'Voting will be activate',
    cancelPayload: 'Cancel payload',
    cancelPayloadError:
      'Error during the cancel payload, check console for more details',
    canselPayloadDescription: (id: number) => `Payload #${id} will be canceled`,
    cancelProposal: 'Cancel proposal',
    cancelProposalError:
      'Error during the cancel proposal, check console for more details',
    cancelProposalDescription: (id: number) =>
      `Proposal #${id} will be canceled`,
    closeVotingError:
      'Error during the close voting, check console for more details',
    closeVotingDescription: 'Voting will be closed and result sent',
    createPayload: 'Create payload',
    createPayloadDescription: (id: number) => `Payload #${id} will be created`,
    createPayloadSuccess: (id: number) => `Payload #${id} created`,
    createProposal: 'Create proposal',
    createProposalDescription: (id: number) =>
      `Proposal #${id} will be created`,
    createProposalSuccess: (id: number) => `Proposal #${id} created`,
    executePayloadError:
      'Error during the execute payload, check console for more details',
    executePayloadDescription: 'Payload will be executed',
    executeProposalError:
      'Error during the execute proposal, check console for more details',
    executeProposalDescription: 'Proposal will be executed',
    sendProofsError:
      'Error during the sending proof, check console for more details',
    confirmBridgedVote: 'Confirm bridged vote',
    confirmBridgedVoteError:
      'Error during the confirm bridged vote, check console for more details',
    confirmBridgedVoteDescription: (voter: string) =>
      `You confirm portal vote balances for ${voter}`,
    voteError: 'Error during the vote, check console for more details',
    voteSmallButtonTitle: 'Normal vote',
  },
  proposalHistory: {
    payloadCreated: (count: number, length: number, chainId: number) =>
      `Payload ${length > 1 ? count : ''}${
        length > 1 ? `/${length}` : ''
      } was created (${getChainName(chainId)})`,
    proposalCreated: (id: number) =>
      `Proposal #${id} was created (${getChainName(appConfig.govCoreChainId)})`,
    proposalActivated: (id: number) =>
      `Proposal #${id} was activated for voting (${getChainName(
        appConfig.govCoreChainId,
      )})`,
    proposalOpenForVoting: (id: number, chainId: number) =>
      `Voting started for proposal #${id} (${getChainName(chainId)})`,
    votingOver: 'Voting is over',
    votingFailed: 'Proposal failed because there were not enough votes for it',
    proposalVotingClosed: (id: number, chainId: number) =>
      `Proposal #${id} voting was closed (${getChainName(chainId)})`,
    votingResultsSent: `Voting results were sent to Core (${getChainName(
      appConfig.govCoreChainId,
    )})`,
    proposalTimeLocked: (id: number) =>
      `Proposal #${id} was time-locked (${getChainName(
        appConfig.govCoreChainId,
      )})`,
    proposalExecuted: (id: number) =>
      `Proposal #${id} was executed (${getChainName(
        appConfig.govCoreChainId,
      )})`,
    payloadTimeLocked: (count: number, length: number, chainId: number) =>
      `Payload ${length > 1 ? count : ''}${
        length > 1 ? `/${length}` : ''
      } was time-locked (${getChainName(chainId)})`,
    payloadExecuted: (count: number, length: number, chainId: number) =>
      `Payload ${length > 1 ? count : ''}${
        length > 1 ? `/${length}` : ''
      } was executed (${getChainName(chainId)})`,
    payloadExpired: (count: number, length: number, chainId: number) =>
      `Payload ${length > 1 ? count : ''}${
        length > 1 ? `/${length}` : ''
      } was expired (${getChainName(chainId)})`,
    proposalCanceled: (id: number) => `Proposal #${id} was canceled`,
    proposalExpired: (id: number) =>
      `Proposal #${id} expired, because no one performed the action to execute the proposal or payloads`,
  },
  createPage: {
    walletNotConnectedTitle:
      'Create payload and proposal not available if wallet not connected',
    walletNotConnectedDescription:
      'We suggest you to connect wallet if you want create payload or proposal.',
    walletNotConnectedButtonTitle: 'Connect',
    appModeTitle: 'Create payload and proposal not available in this app mode',
    appModeDescriptionFirst: `You can't create payload or proposal in this app mode.`,
    appModeDescriptionSecond: `We suggest you to change app mode or back to the proposal list.`,
    appModeButtonTitle: `Back to list`,
    createProposalTitle: 'Create proposal',
    createProposalError:
      'Error during the create proposal, check console for more details',
    createPayloadTitle: 'Create payload',
    createPayloadError:
      'Error during the create payload, check console for more details',
    payloadChainIdPlaceholder: 'Payload network',
    payloadsControllerPlaceholder: 'Payloads controller',
    ipfsHashPlaceholder: 'Ipfs hash',
    addActionButtonTitle: 'Add action',
    payloadActions: 'Payload actions',
    actionTitle: (index: number) => `Action ${index}`,
    payloadActionAddress: 'Address',
    payloadActionDelegateCall: 'With delegate call?',
    payloadActionAccessLevel: 'Access level',
    payloadActionValue: 'Value',
    payloadActionSignature: 'Signature',
    payloadActionCallData: 'Call data',
    votingChainIdPlaceholder: 'Voting network',
    addPayloadButtonTitle: 'Add payload',
    payloadsTitle: 'Payloads',
    payloadTitle: (index: number) => `Payload ${index}`,
    payloadIdPlaceholder: 'Payload id',
  },
  delegatePage: {
    delegateTxError:
      'Error during the delegation, check console for more details',
    viewChanges: 'View changes',
    notConnectedWallet: 'Wallet is not connected',
    notConnectedWalletDescription:
      'Please connect wallet first, to see delegation info',
    notConnectedWalletButtonTitle: 'Connect wallet',
    willDelegate: 'You will delegate',
    delegated: 'You delegated',
    receiveBack: 'You will receive back',
    receivedBack: 'You received back',
    votingAndPropositionPowers: 'voting and proposition powers',
    votingPower: 'voting power',
    propositionPower: 'proposition power',
    delegateTxSuccess: 'Delegated',
    delegateTxTitle: 'Delegation',
    tableHeaderVoting: 'Voting',
    tableHeaderProposition: 'Proposition',
    tableItemDelegated: 'Delegated',
    tableItemNotDelegated: 'Not Delegated',
  },
  representationsPage: {
    txError: 'Error during the representations, check console for more details',
    notConnectedWallet: 'Wallet is not connected',
    notConnectedWalletDescription:
      'Please connect wallet first, to see representations info',
    notConnectedWalletButtonTitle: 'Connect wallet',
    tableHeaderRepresented: 'Represented by',
    tableHeaderRepresenting: 'Representing',
    myself: 'Myself',
    represented: 'Represented',
    txSuccess: 'Represented',
    txTitle: 'Representations',
    yourWillRepresent: 'You will be represented',
    yourRepresented: 'You represented',
    yourCancelRepresented: 'You cancel represented',
    yourCanceledRepresented: 'You canceled represented',
  },
  notFoundPage: {
    title: 'Page not found',
    descriptionFirst: `Sorry, we couldn't find the page you were looking for.`,
    descriptionSecond: `We suggest you go back to the proposals list.`,
    buttonTitle: 'Back to list',
  },
  transactions: {
    allTransactions: 'All Transactions',
    pending: 'Pending...',
    pendingDescription: 'Waiting while transaction executing',
    success: 'Success',
    error: 'Error',
    executed: 'Transaction executed',
    notExecuted: `Transaction didn’t execute`,
    tryAgain: 'Try again',
    testTransaction: 'You made test transaction',
    createPayloadTx: 'You create payload',
    createProposalTx: 'You create proposal',
    activateVotingTx: 'You activated voting for the proposal',
    sendProofsTx: 'You settled the voting balances of',
    activateVotingOnVotingMachineTx:
      'You activate voting on voting machine for the proposal',
    voteTx: 'You voted',
    closeVoteTx: 'You closed voting for the proposal',
    sendVoteResultsTx: 'and sent voting results to',
    executeProposalTx: 'You executed the proposal',
    executePayloadTx: 'You executed the payload',
    cancelProposalTx: 'You cancel the proposal',
    cancelPayloadTx: 'You cancel the payload',
  },
  walletConnect: {
    delegations: 'Manage delegations',
    representations: 'Manage representations',
    disconnect: 'Disconnect',
    transactions: 'Transactions',
    lastTransaction: (count: number) =>
      count > 1 ? 'Last transactions' : 'Last transaction',
    transactionsEmpty: 'The list of your transactions is currently empty',
    transactionsNoWallet: 'Connect your wallet to see the list of transactions',
    connectButtonConnecting: 'Connecting',
    connectButtonConnect: 'Connect wallet',
    connectWallet: 'Connect a wallet',
    connecting: 'Connecting...',
    walletConfirmation: 'Waiting confirmation from your wallet',
    needHelpTitle: 'Need help connecting a wallet?',
    needHelpFAQ: 'Read FAQ',
    needHelpDescription:
      'By selecting a wallet from an External Provider, you agree to their Terms and Conditions. Your ability to access the wallet may depend on the External Provider being operational.',
    impersonatedInputPlaceholder: 'Account address',
    impersonatedButtonTitle: 'Connect',
  },
  header: {
    navSnapshots: 'Snapshots',
    navForum: 'Visit forum',
    navTutorial: 'Tutorial',
    navCreate: 'Create',
    appMode: 'App mode',
    theme: 'Theme',
    appModeDefault: 'Default',
    appModeDev: 'Dev',
    appModeExpert: 'Expert',
  },
  meta: {
    main: 'Aave Governance - ',
    keywords:
      'governance, voting, decentralized Finance, defi, aave, ethereum, polygon, avalanche, optimism, arbitrum, base, metis, assets, erc-20, smart contracts, open finance, trustless',
    proposalListMetaTitle: 'Proposals',
    proposalListMetaDescription: 'List of governance proposals',
    createPageMetaTitle: 'Create',
    createPageMetaDescription: 'Create a new proposal (dev)',
    notFoundPageMetaTitle: 'Page not found',
    notFoundPageMetaDescription: '404, page not found',
    delegatePageMetaTitle: 'Delegation',
    delegatePageMetaDescription:
      'Management of voting/proposition power delegations',
    representationsPageMetaTitle: 'Representations',
    representationsPageMetaDescription:
      'Management of representations and representatives',
  },
  other: {
    backButtonTitle: 'Back',
    paginationNext: 'Next',
    paginationPrevious: 'Previous',
    day: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    toggleFor: 'For',
    toggleAgainst: 'Against',
    copied: 'Copied',
    copy: 'Copy',
    viewOnExplorer: 'View on explorer',
    cancel: 'Cancel',
    close: 'Close',
    required: 'Required',
    edit: 'Edit',
    votingInfo: 'Voting info',
    all: 'All',
    create: 'Create',
    confirm: 'Confirm',
    requiredValidation: 'Required field',
    addressValidation: 'Wrong address, please enter correct',
    appLoading:
      'The application is loading the required data, please wait a moment',
    fetchFromIpfsError:
      'An error occurred while fetching proposal metadata from IPFS. Try again later or try using a VPN.',
    fetchFromIpfsIncorrectHash: `An error occurred while fetching proposal metadata from IPFS. It seems that the ipfs hash is incorrect or the content by this hash does not match the desired one.`,
    explorer: 'Explorer link',
    votingNotAvailableForGnosis:
      'Voting on this network is not available for Gnosis safe',
  },
  faq: {
    welcome: {
      title: 'Hey!',
      description:
        'Let me show you how to use the new Aave governance interface.',
      closeButtonTitle: 'Later',
      nextButtonTitle: 'Start',
    },
    navigation: {
      title: 'How can I help you?',
      wallet: 'How to connect and manage my wallet?',
      vote: 'How to vote?',
      delegate: 'How to delegate?',
      lifeCycle: 'Proposal life cycle description',
    },
    wallet: {
      title: 'Wallet',
      description:
        'This window allows you to connect your wallet. Browse the list and pick the one you want to use.',
      realWalletInfo:
        "Don't worry, this is just a practice run! The real wallet won't be connected.",
      transactionsViewDescription:
        'Welcome to your wallet window! Here you can view all transactions made within the interface. The status of transactions can be pending, successful, or failed. Give it a try and make a test transaction now!',
      makeTransaction: 'Make a transaction',
    },
    voting: {
      title: 'Let’s try to vote',
      firstDescriptionFirstPart:
        'On the homepage you can browse all the available proposals. To vote on or read more about a proposal, simply',
      connectWallet: 'connect your wallet',
      firstDescriptionSecondPart: 'and select from the Active proposals.',
      secondDescription:
        'You can vote directly from the list or click on a proposal to learn more before making your choice.',
      firstTooltip:
        'Here you can check the current stage of the proposal and its expected stage',
      secondTooltipFirstPart: 'Here you can see your',
      votingPower: 'voting power',
      secondTooltipSecondPart: 'and vote directly on the proposal',
      thirdTooltipFirstPart: 'Here you can see the',
      votingProgress: 'voting progress',
      thirdTooltipSecondPart:
        'and the required number of votes for the proposal stage change',
      proposalBar: 'Proposal bar',
      pressVoteButton: 'Press vote button to continue',
      txSuccess: 'All done!',
      txPending: 'Almost there!',
      txStart: 'Voting',
      txStartFirstDescription:
        'After clicking the ‘Vote’ button you will see a confirmation screen, where you can choose if you support or oppose the proposal.',
      txStartSecondDescription:
        "You can see the proposal's progress in real-time as it is influenced by your vote.",
      txStartThirdDescription:
        'Check how the interface works and then click ‘Vote’ button.',
      txPendingDescription: 'Your vote is being processed',
      txSuccessFirstDescription:
        'You can view your transaction details in the wallet information modal.',
      txSuccessSecondDescription:
        'Voting is only a step in the proposal process. Learn more about',
      proposalLifeCycle: 'proposal life cycle',
    },
    votingPower: {
      title: 'Voting power',
      description: (assets: string) =>
        `Voting power is determined by the balance in ${assets} a user has, plus received voting power, and minus sent voting power, at the time the voting starts.`,
    },
    votingBars: {
      title: 'Voting bars',
      description:
        'The voting bars show the number of votes a proposal currently has, as well as the minimum number of votes required for a proposal to pass or fail.',
      secondDescription: (quorum: number, differential: number) =>
        `For a proposal to pass, it must receive a minimum of <b>${quorum} ‘For’</b> votes, with a majority of 'For' votes over 'Against' votes plus a minimum of <b>${differential}</b>. Otherwise, the proposal will fail.`,
    },
    delegate: {
      delegated: 'Delegated',
      delegation: 'Delegation',
      editMode: 'Edit mode',
      confirmation: 'Confirmation',
      delegationBar: 'Delegation bar',
      startFirstDescription:
        'This is the delegation screen. Here you can delegate voting and proposition powers.',
      startSecondDescription:
        'Delegating voting power means giving someone else the power to vote on proposals on your behalf. Delegating proposition power means giving someone else the power to create proposals on your behalf.',
      editFirstDescription:
        "Proposition and voting powers are tied to individual assets, meaning each asset carries its own proposition and voting power. The extent of a user's proposition and voting power per asset is determined by the number of that specific asset they hold.",
      editSecondDescription:
        'Here you can delegate your power to someone else or receive it back. You can delegate proposition, voting power or both.',
      editThirdDescription:
        "To do so, enter the recipient's wallet number to the input you need.",
      confirmFirstDescription:
        'You can now view information about what you are going to delegate and to whom.',
      confirmSecondDescription:
        'If you are sure of your choice, click the confirmation button.',
      delegatedFirstDescription:
        "You can now view information about the delegations you've made. Don’t forget to change it later.",
      delegatedSecondDescription:
        "If you want to try again, just click the 'Edit' button.",
      tooltipFirstPart: 'Delegation of',
      votingPower: 'Voting power',
      propositionPower: 'Proposition power',
      txPendingTitle: 'Almost there!',
      txPendingDescription: 'Your delegation is being processed',
      warning: 'WARNING!',
      entireBalance: (assets: string) =>
        `This is the entire balance of ${assets} at the moment.`,
      votingPowerWarning:
        'Please note that after delegation, you will lose all your voting power until you receive it back. If a proposal opens for voting during this time, you will not be able to vote on it, even if you receive your voting power back later.',
      propositionPowerFirstWarning:
        'Please keep in mind that after delegation, you will lose all your proposition power until you receive it back.',
      propositionPowerSecondWarning:
        'Please note that you need to keep the proposition power, when you create a proposal. If you delegate your proposition power before your proposal is executed, it may be subject to cancellation.',
    },
    lifeCycles: {
      initial: {
        title: 'Proposal life cycle',
        description:
          'A proposal can have different life cycle stages, not just determined by voting. You can check the current stage and the timeline of the proposal by going to the proposal details.',
        nextButtonTitle: 'Create proposal',
        prevButtonTitle: 'Back',
      },
      created: {
        title: 'Proposal life cycle',
        description:
          "Let’s start from scratch. The first stage is when the proposal is created. You can't vote on it yet, but you can already look at the details and decide if you want to vote for or against it.",
        nextButtonTitle: 'Activate voting',
        prevButtonTitle: 'Back',
      },
      openToVote: {
        title: 'Open for voting',
        description:
          'After a period of time, the voting will be activated. This will make the proposal open for voting, allowing everyone to cast their votes.',
        additionDescription:
          "It's important to note that this is when the evaluation of the voting power will take place. Your voting power will be determined at this time.",
        nextButtonTitle: 'Close voting',
        prevButtonTitle: 'Created',
      },
      votingClosed: {
        title: 'Voting closed',
        description:
          'At the end of the voting period, the results of the vote become live, and the proposal is either passed or rejected.',
        nextButtonTitle: 'Cool-down period',
        prevButtonTitle: 'Open for vote',
      },
      coolDownPeriod: {
        title: 'Cool-down period',
        description:
          'Next, the cool-down period begins, during which the proposal is locked for a specified amount of time. This time is used to validate the legitimacy of the proposal.',
        nextButtonTitle: 'Execute proposal',
        prevButtonTitle: 'Voting closed',
      },
      proposalExecuted: {
        title: 'Proposal executed',
        description:
          'Once the cool-down period has passed, the proposal can be executed.',
        additionDescription:
          'After the proposal is executed, the time-lock for the associated payloads begins. Once the payloads have passed the time-lock, they can be executed.',
        nextButtonTitle: 'Execute payloads',
        prevButtonTitle: 'Cool-down period',
      },
      finishedExecuted: {
        title: 'Proposal finished',
        description:
          'After all the payloads of the proposal have been executed, the proposal is considered to be fully executed or finished.',
        nextButtonTitle: 'Voting failed',
        prevButtonTitle: 'Execute proposal',
      },
      finishedFailed: {
        title: 'Proposal failed',
        description:
          'If the proposal does not receive enough votes or the majority of votes are for rejection, the proposal will immediately fail.',
        nextButtonTitle: 'Proposal canceled',
        prevButtonTitle: 'Finished',
      },
      finishedCanceled: {
        title: 'Proposal canceled',
        description:
          'If at any stage the proposal or all of the associated payloads were canceled by the proposer, then the proposal will have the status ‘canceled’.',
        prevButtonTitle: 'Defeated',
      },
    },
    other: {
      gotIt: 'Got it!',
      next: 'Next',
      mainMenu: 'Main menu',
    },
    tx: {
      tryAgain: 'Try again',
    },
  },
};
