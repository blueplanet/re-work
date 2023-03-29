---
title: イーサリアムのスマートコントラクト、ビットコインのような複数署名できる？
date: 2017-12-21
tags: ["Blockchain", "Ethereum", "solidity", "SmartContract"]
---

ビットコインは複数の人によって署名することで、全員または 2/3 以上同意しないと送金できないような仕組みを作れる。
では、イーサリアムのスマートコントラクトは同じことを実現できるかをやってみる



<!--truncate-->

## コード

```javascript
pragma solidity ^0.4.17;

contract MultiVoteTransfer {
  address[] voterAddresses;
  mapping(address => bool) votes;
  bool public transfered;

  modifier onlyVoter() {
    bool isVoter = false;

    for (uint i = 0; i < voterAddresses.length; i++) {
      if (voterAddresses[i] == msg.sender) {
        isVoter = true;
      }
    }

    require(isVoter);
    _;
  }

  function MultiVoteTransfer(address[] _voterAddresses) public {
    voterAddresses = _voterAddresses;
    transfered = false;
  }
  
  function sign() public onlyVoter returns (bool) {
    votes[msg.sender] = true;

    bool allVoted = true;

    for (uint i = 0; i < voterAddresses.length; i++) {
      if (votes[voterAddresses[i]] == false) {
        allVoted = false;
      }
    }

    if (allVoted == true) {
        // 送金処理とか
        transfered = true;
    }
  }
}
```

## 実行してみる
- Ganache を起動して、`https://ethereum.github.io/browser-solidity` を `127.0.0.1:7454`接続しておく
- コントラクトの初期化関数に `["0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e", "0x2191ef87e392377ec08e7c08eb105ef5448eced5"], "0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5"` ２つの投票者のアドレスを渡して、`Create`クリックしてデプロイする
- デプロイできたコントラクトに対して、`transfered`を確認してみる　⇒　`false`でした
- 上記渡した２つの投票者アドレス選択して、`sign`を呼び出すと、正常に投票できる
- 上記渡した２つの投票者以外のアドレス選択して、`sign`を呼び出すと、`transact to MultiVoteTransfer.sign errored: VM Exception while processing transaction: revert `エラーになって、投票できない
- 投票者全員投票したら、`transfered`を再度確認してみると、`true`になった

## まとめ
- ビットコインの場合は、このようなスマートコントラクトが書けないので、システム上の仕組み（署名など）を使わないと行けない
- イーサリアムの場合は、スマートコントラクトでできることが大分増えたので、気軽にでできる
- セキュリティ面でも、画面上で`sign`をクリックし関数を呼び出す場合は、中身は、`選択されているアカウントでトランザクションを作成し署名してからネットワークに送信する`という流れなので、別にビットコインの複数投票者署名するのと比べても負けないと思います。
