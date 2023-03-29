---
title: 仮想仔猫ゲーム CryptoKitties のコントラクト解読その２
date: 2017-12-15
tags: ["Blockchain", "Ethereum", "SmartContract"]
---

仮想仔猫ゲーム CryptoKitties のコントラクトを読んで気になった箇所を共有したい



<!--truncate-->

## Solidity でのインタフェース定義方法
- Solidity の言語仕様の一部ではありますが、ドキュメントを全部モラできてないので気づかなかった
- 仕様としては簡単で、関数のパラメータと戻り値などのメタ情報だけ定義して、実行する本体を入れてなければ、それがインタフェースになる
- たとえ下記の単にインタフェースがあるコントラクトの場合、browser-solidity　でデプロイしようとしたら、できませんでした。

```javascript

pragma solidity ^0.4.0;

contract Cat {
    function color() public constant returns (string);
}

// エラー内容
This contract does not implement all functions and thus cannot be created.
```

- インタフェース定義しているクラスを継承し、実際の関数本体を定義しておけば、正常にデプロイできる

```javascript
pragma solidity ^0.4.0;

contract Cat {
    function color() public constant returns (string);
}

contract BlackCat is Cat {
    function color() public constant returns (string) {
        return "Black";
    }
}
```

## 実装を隠す方法
- ブロックチエーンなので、全てのデータが全世界に公開される。その場合、仮想仔猫ゲームで言うと、仔猫の遺伝子を生成するロジック、要するに、どのような外観の親がどのような外観の仔猫を生まれられるかの部分公開したくないので、それの実現方法です。

1. 仔猫を生成するロジックは、`geneScience`という外部コントラクトに任せる
2. 権限を持っている人だけ、`geneScience`に外部コントラクトのアドレスを設定できる

- こうして仔猫の生成ロジックを隠しています。賢い！
- 厳密に言いますと、完全に隠しているわけではなく、その設定されている値を見えれば、遡って指しているコントラクトを見つけるのは、できるじゃないかと思います。

```javascript

...
GeneScienceInterface public geneScience;
function setGeneScienceAddress(address _address) external onlyCEO {
    GeneScienceInterface candidateContract = GeneScienceInterface(_address);

    require(candidateContract.isGeneScience());

    // Set the new contract address
    geneScience = candidateContract;
}

// 仔猫の生成処理の中で、`geneScience.mixGenes(...)`を呼び出している
...
```
