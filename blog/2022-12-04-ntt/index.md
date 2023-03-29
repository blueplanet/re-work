---
title: NTT：譲渡不可の NFT の紹介
date: 2022-12-04
tags: ["Blockchain", "Ethereum", "ethere"]
---

NFT はもうよく聞いていると思いますが、今年からはおそらく「転送不可な NFT」というお話も聞いたことがあると思います。
この辺の試みの１つ NTT についてちょっと紹介したいと思います。



<!--truncate-->

## NTT：転送不可な NFT 
NTT は、もちろんあの企業のことではありません。「Non-Transferable Non-Fungible Token」もしくは「Non-tradable Token」の略語であり、「転送不可のNFT」のことです。
NFT または　ERC 20 などのトークン系は、取引をメインの目的としていますが、取引ではなく、バッジまたは卒業証書・オンライントレーニング修了証のようなものでしたら、そもそも取引というか、転送の必要もないので、このような提案が上がられました

## [ERC 1238 github issues](https://github.com/ethereum/EIPs/issues/1238)

> Non-transferable tokens
Simple Summary
A badge is a token that once assigned it cannot be transferred. Badges can be accumulated through time and put at stake. Simply speaking, badges are statements about a public key, they can be quantitative (e.g. reputation, experience) or qualitative (badges, titles).

- 2018 年 7 月提案され、バッチにフォーカスしている内容になります
- 正式な EIP プロセスにのってないので、実際どの段階まで議論できたかは分かりませんが、 Pull Request 自体は既にクローズされています

## [EIP-4671: Non-Tradable Tokens Standard](https://eips.ethereum.org/EIPS/eip-4671)
> A standard interface for non-tradable tokens, aka badges or souldbound NFTs.

- 2022 年 1 月に「取引不可トークン」として提案され、現時点ではステータスがまだ Draft です。
- 「大学の卒業証書、オンライントレーニングの修了証、政府発行の書類（国民ID、運転免許証、ビザ、結婚式など）、ラベルなど、本来は個人所有のもの（物質・非物質）を表します。」ように NTT を定義しています。
- 上記の目的であるため、設計としては
    - １つのコントラクトで単一の書類を管理することになります。
    - 削除・転送はできないが、管理ロールは、書類を発行・無効にすることができます

## 他の実装方法
できるだけ ERC721 / ERC1155 との互換性を守りたいため、既存の規約を拡張するやり方もあります。
`OpenZeppelin Contracts v3.0.0` から新しい機能として [openzeppelin hooks](https://docs.openzeppelin.com/contracts/3.x/extending-contracts#using-hooks) 仕組みを導入されています。
転送系の処理（_mint / _transfer / _burn) に全部処理の最初にこの hook を呼び出しているため、ここで拒否すれば「転送不可」の意図は実現できます。

```solidity
function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
) internal pure override {
    // mint の場合のみは許可する
    require(from == address(0));
    ...
}
```

- _mint：https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol#L286-L291
- _transfer：https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol#L355-L363
- _burn：https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol#L321-L324

## まとめ
バッチや政府発行の書類など、取引目的ではない場合、転送不可 NTT を使いたいが、どう実装すべきかは迷いますね。
似ている概念として SBT もあるので、また紹介します。
