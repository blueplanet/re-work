---
title: イーサリアム 2.0：LMD-GHOST について
date: 2022-12-22
tags: ["Blockchain", "Ethereum", "Ethereum2.0"]
---

イーサリアム 2.0 のコンセンサス処理の中、エポック単位の分岐がある場合は、Casper FFG のルールで決められています。エポック内の分岐については、LMD-GHOST を使って対応してます。



<!--truncate-->

## LMD-GHOST とは
LMD-GHOST(latest message driven GHOST) とは、GHOST の変更版であり、ブロックチェーンの分岐がある場合の選択ルールです。ブロックチェーンの分岐は、ネットワークの遅延や悪意の行為などによるものであり、よく起きることです。

- PoW の場合は、GHOST(Greedy Heaviest Observed Subtree) というアプローチを使って、ブロックの数を合計し各分岐チェーンの重みとして、一番重いチェーンを正しいとみなすようになっています
- LMD-GHOSTは、分岐チェーンの重みを計算する際は、サブツリーを含めて、そのチェーンにあるバリデーターの数を合計して重みとしています

LMD-GHOST が、GHOST と異なるのは下記２箇所になります
- １個前の「正当化」のブロック以降の投票、つまり、バリデーターごとの最新の投票のみ合計するところ
- ブロック数ではなく、ブロックに投票するバリデーターの数を合計するところ

## 詳細流れ
チェーンの分岐がある場合、バリデーターは、

1. 最新の正当化のブロックから計算をスタートする
2. 各分岐チェーンに対して
    2.1. ブロック毎にそのブロックに投票したバリデーターの数を合計する
    2.2 そのブロックの子ブロックがある場合、子ブロックのバリデーター数も合計する
    2.3 子ブロックがなくなるまで繰り返す
    2.4 バリデーターの合計値が一番多いチェーンを選択する

## 投票データ
投票データは LMD-GHOST が使うのは、下記の `beacon_block_root` になります。
これはバリデーターが、正しいと思っているチェーンの先頭におくべきブロックのハッシュ値になります。

```python
class AttestationData(Container):
    slot: Slot
    index: CommitteeIndex
    # LMD GHOST vote
    beacon_block_root: Root
    # FFG vote
    source: Checkpoint
    target: Checkpoint
```

## まとめ
エポック内でチェーンの分岐が起きる場合の選択ルールは、LMD-GHOST でした。
