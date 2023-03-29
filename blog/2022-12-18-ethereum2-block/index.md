---
title: イーサリアム 2.0：ビーコンチェーンのブロック構造
date: 2022-12-18
tags: ["Blockchain", "Ethereum", "Ethereum2.0"]
---

イーサリアム 2.0 にはコンセンサスレイヤーとしてビーコンチェーンがあります。このチェーンのブロック構造を調べてみました



<!--truncate-->

## ブロックデータ

キー | データ型 | 内容
-- | -- | --
slot | uint64 | Slot の番号
proposer_index | uint64 | バリデータに振られているインデックス
parent_root | Bytes32 | 親ブロックのルートハッシュ
state_root | Bytes32 | ステートデータのハッシュ
body | BeaconBlockBody | ボディーオブジェクト
body.randao_reveal | BLSSignature | RANDAO のランダム値更新データ
body.eth1_data | Eth1Data|  eth1 ブロックに対する投票データ（ eth1 ブロックのハッシュ、バリデーターの預金ツリーのルートハッシュ・既にに行われた預金の数を含んでいる）
body.graffiti | Bytes32| 任意のデータ
body.proposer_slashings | List | スラッシュするブロック提案者リスト
body.attester_slashings | List | スラッシュする検証者リスト
body.attestations | List[Attestation] | 現在ブロックに対する投票リスト
body.deposits | List[Deposit] | バリデーターになるための新しい入金リスト
body.voluntary_exits | List[SignedVoluntaryExit] | 退出したいバリデーターリスト

## randao_reveal
RANDAO 用のデータです。詳細はまた別途まとめます。

## state_root
イーサリアムの state と block の関係と似ています。
block にあるのは変更リストであり、それを一個前の block の state に適用することで、新しい state が計算できます。

詳細は下記に参照してください。

引用元：https://github.com/ethereum/consensus-specs/blob/dev/specs/phase0/beacon-chain.md#beaconstate

```python
class BeaconState(Container):
    # Versioning
    genesis_time: uint64
    genesis_validators_root: Root
    slot: Slot
    fork: Fork
    # History
    latest_block_header: BeaconBlockHeader
    block_roots: Vector[Root, SLOTS_PER_HISTORICAL_ROOT]
    state_roots: Vector[Root, SLOTS_PER_HISTORICAL_ROOT]
    historical_roots: List[Root, HISTORICAL_ROOTS_LIMIT]
    # Eth1
    eth1_data: Eth1Data
    eth1_data_votes: List[Eth1Data, EPOCHS_PER_ETH1_VOTING_PERIOD * SLOTS_PER_EPOCH]
    eth1_deposit_index: uint64
    # Registry
    validators: List[Validator, VALIDATOR_REGISTRY_LIMIT]
    balances: List[Gwei, VALIDATOR_REGISTRY_LIMIT]
    # Randomness
    randao_mixes: Vector[Bytes32, EPOCHS_PER_HISTORICAL_VECTOR]
    # Slashings
    slashings: Vector[Gwei, EPOCHS_PER_SLASHINGS_VECTOR]  # Per-epoch sums of slashed effective balances
    # Attestations
    previous_epoch_attestations: List[PendingAttestation, MAX_ATTESTATIONS * SLOTS_PER_EPOCH]
    current_epoch_attestations: List[PendingAttestation, MAX_ATTESTATIONS * SLOTS_PER_EPOCH]
    # Finality
    justification_bits: Bitvector[JUSTIFICATION_BITS_LENGTH]  # Bit set for every recent justified epoch
    previous_justified_checkpoint: Checkpoint  # Previous epoch snapshot
    current_justified_checkpoint: Checkpoint
    finalized_checkpoint: Checkpoint
```

## eth1_data
内容はバリデーターになる際の預金のルートハッシュと総数と、ブロックハッシュになります。
ブロックハッシュが１個しかないので、シャーディングの際にどうなるかは気になりますね。

```python
class Eth1Data(Container):
    deposit_root: Root
    deposit_count: uint64
    block_hash: Hash32
```

## proposer_slashings と proposer_slashings
バリデーターはブロック提案者と検証者として担当する処理があり、その処理が正しく実行できなかったり、または悪意の行為をした場合、罰則によって預かった預金を減らされてしまうことがあります。これが「スラッシュ」と呼ばれています。
この２つの項目はこれらの情報を記録するための項目です。

[イーサリアム 2.0のスラッシュとは？](https://coinchoice.net/what-is-ethereum20-slash/) で紹介した Epoch#208 の slot#6669 で proposer_slashings のデータがあります。
興味ある方はどうぞ。

https://beaconcha.in/slot/6669#overview

## まとめ
ビーコンチェーンはコンセンサスレイヤーとして、メインはバリデーター関連の情報を記録しているようなイメージですね。
