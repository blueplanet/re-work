---
title: Truffle の Migration は何をやっている？
date: 2017-12-19
tags: ["Blockchain", "Ethereum", "solidity", "SmartContract"]
---

Truffleを使ってみて、チュートリアルのままマイグレーション実行しましたが、中に何をやっているかはわからなかったので、すこし調べてみました。



<!--truncate-->

## migrateコマンド
- `migrations`ディレクトリ配下のスクリプトを実行する
- 前回の実行が成功だった場合は、それ以降の新しいマイグレーションだけ実行する
- 新しいマイグレーションがなければ、何もしない
- `--reset` オプションで実行し直すことができる

## 各マイグレーションファイル
- ファイル名は数値で始まる必要があり、それ以降は説明内容で構わない。
- ファイル名の数値で実行順番決められるようです。
- マイグレーションの中で`deployer`を使って、デプロイなどを実行できる
- １つのマイグレーションファイルの中、複数コントラクトをデプロイできる

```javascript
deployer.deploy(A);
deployer.deploy(B);
```

- `Aがデプロイ成功したらBをデプロイする` のようなこともできる

```javascript
deployer.deploy(A).then(function() {
  return deployer.deploy(B, A.address);
});
```

- マイグレーション処理の２番目の関数はネットワークであり、正式ネットワークなのか、テストネットワークなのかの情報を取得できる

```javascript
module.exports = function(deployer, network) {
  // 正式ネットワーク以外の場合、デモデータ導入する
  if (network != "live") {
    deployer.exec("add_demo_data.js");
  }
}
```

- コントラクトにパラメータを渡すことももちろんできる

```javascript
deployer.deploy(A, arg1, arg2, ...);
```

- 複数コントラクト一気にデプロイするのもできる

```javascript
deployer.deploy([
  [A, arg1, arg2, ...],
  B,
  [C, arg1]
]);
```

- `deployer.link`と`deployer.autolink`関数もありますが、意味まだ理解できてない。

## デフォルトcontracts/Migration.solの処理

```javascript
pragma solidity ^0.4.17;

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function Migrations() public {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public restricted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
```

- `truffle init`したら、自動で生成されたマイグレーションファイルであり、マイグレーションの情報をスマートコントラクト上で管理している
- `setCompleted`関数は最後実行したマイグレーションのファイル名の数値部分（かな？）を記
- `upgrade`関数の意図は ~~まだ理解できてない~~ @nakajo2015 さんにコメントして頂いて、理解しました。
    - 新しいマイグレーションコントラクトをデプロイした後、古いコントラクトが持っている`last_completed_migration`を新しいマイグレーションコントラクトに設定するように見える
    - ~~だが、`Migrations(new_address)`は初期化関数であるはずなのに、上記ソースの初期化関数はパラメータがないよね？~~
    - ~~`Migrations`だけで、新しいコントラクトであることを勝手に認識できる？なぜ？~~
    - `Migrations(new_address)`は初期化関数を呼び出すのではなく、指定されたアドレス`new_address`からコントラクトを取得し、`マイグレーション`コントラクトとして使うこと
    - 推測になりますが、アップグレードする流れは下記になるじゃないかと
        - 最初デプロイした後のアドレスは**address1**とする
        - 新しくデプロイした後のアドレスは **address2** とする
        
```javascript
var old_contract = eth.contract(abi).at(address1)
old_contract.upgrade.sendTransaction(address2)
```

## 参考記事
- [Running migrations | Truffle Suite](http://truffleframework.com/docs/getting_started/migrations)
