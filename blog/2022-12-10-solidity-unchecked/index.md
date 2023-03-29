---
title: Solidity 0.8.0 で導入された unchecked の調査
date: 2022-12-10
tags: ["Blockchain", "Ethereum"]
---

OpenZepplin の ERC721 スマートコントラクトのソースに、知らなかったキーワード `unchecked` があったので調べてみました。

https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol#L286-L308

```solidity
function _mint(address to, uint256 tokenId) internal virtual {
    require(to != address(0), "ERC721: mint to the zero address");
    require(!_exists(tokenId), "ERC721: token already minted");

    _beforeTokenTransfer(address(0), to, tokenId, 1);

    // Check that tokenId was not minted by `_beforeTokenTransfer` hook
    require(!_exists(tokenId), "ERC721: token already minted");

    unchecked {
        // Will not overflow unless all 2**256 token ids are minted to the same owner.
        // Given that tokens are minted one by one, it is impossible in practice that
        // this ever happens. Might change if we allow batch minting.
        // The ERC fails to describe this case.
        _balances[to] += 1;
    }

    _owners[tokenId] = to;

    emit Transfer(address(0), to, tokenId);

    _afterTokenTransfer(address(0), to, tokenId, 1);
}
```



<!--truncate-->

## 調査
`unchecked` は Solidity 0.8.0 から導入された算術計算のアンダーフロー・オーバーフローの対応のための一環でした。

> Arithmetic operations revert on underflow and overflow. You can use unchecked { ... } to use the previous wrapping behaviour.

つまり、
> 0.8.0 からは、`アンダフロー・オーバーフローが発生した場合 revert になる` という動きがデフォルトになります。
> その動きにしたくなければ、 `unchecked` を使ってください

ということです。

## やってみる
２つの整数を足すだけの `add` 関数を定義します

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Unchecked {
    function sub_new(uint x, uint y) external pure returns (uint) {
        return x - y;
    }

    function sub_old(uint x, uint y) external pure returns (uint) {
        unchecked {
            return x - y;
        }
    }
}
```

正常のパラメータ `2 - 1` で計算する際は、`unchecked` を使っている場合は、わずかではありますが、 204 gas ほど少ない。

```solidity
call to Unchecked.sub_new
...
execution cost	22307 gas (Cost only applies when called by a contract)
...

call to Unchecked.sub_old
...
execution cost	22103 gas (Cost only applies when called by a contract)
```

異常のパラメータ `1 -2` で計算する際は、sub_new の呼び出しは revert になりました

```solidity
call to Unchecked.sub_new
CALL
[call]from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4to: Unchecked.sub_new(uint256,uint256)data: 0xb30...00002
call to Unchecked.sub_new errored: VM error: revert.

revert
	The transaction has been reverted to the initial state.
Note: The called function should be payable if you send value and the value you send should be less than your current balance.
Debug the transaction to get more information.
```

sub_old（unchecked を使う）ほうは、今まで通りに、アンダーフローになりました。

```solidity
call to Unchecked.sub_old
CALL
[call]from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4to: Unchecked.sub_old(uint256,uint256)data: 0x2af...00002
from	0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
to	Unchecked.sub_old(uint256,uint256) 0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B
execution cost	22103 gas (Cost only applies when called by a contract)
input	0x2af...00002
decoded input	{
	"uint256 x": "1",
	"uint256 y": "2"
}
decoded output	{
	"0": "uint256: 115792089237316195423570985008687907853269984665640564039457584007913129639935"
}
logs	[]
```

## まとめ
Solidity 0.8.0 以前は、アンダフロー・オーバーフローに対応するために、OpenZepplin の SafeMath ライブラリをよく使われていました。
これ以降は、gas がわずかに多く使いますが、デフォルトで対応してくれるので、SafeMath を使う必要がなくなりました。
