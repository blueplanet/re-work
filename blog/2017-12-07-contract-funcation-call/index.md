---
title: コントラクトの関数を呼び出す際起こったこと
date: 2017-12-07
tags: ["Blockchain", "Ethereum"]
---



<!--truncate-->

## 前提
- geth とかのイーサリアムのクライアントを実行しているマシンを**ノード**と呼ぶ
- web3 とかのクライアントライブラリを経由しノードにアクセスするマシンを**クライアント**と呼ぶ

## 書き込みの場合
- 流れとしては、
    - クライアントがコントラクト宛のトランザクションが作成し、ノードに送信する（eth_sendTransaction）
    - ノードがトランザクションをイーサリアムのネットワークに送信する
    - 各マイニングするノードのブロック生成処理（マイニング）で、そのトランザクションが実行され、コントラクトアカウントのステータス（ストレージに格納しているデータとか）が変更され、ブロックチェーンに書き込まれる
    - 最新のブロックがイーサリアムのネットワークに送信される
    - 接続接続しているノードが最新のブロックにある変更結果をライブラリによってクライアントに通知される
- なので、書き込みがある場合は、マイニングが必要

## 読み取りの場合
一方で、書き込みがない場合は、ブロックチェーンのデータを変更しないので、**即時返される ＋ gas かからない** ようになっています。

流れとしては

- クライアントがノードに対して、`eth_call`でコントラクトの関数が呼び出す
- ノードの geth で、ブロックチェーンのデータを読み取って結果をクライアントに返す

一番シンプルなコントラクトで例を上げます。

```js
contract SingleNumRegister {
    uint storedData;
    function set(uint x) {
        storedData = x;
    }
    function get() constant returns (uint retVal) {
        return storedData;
    }
}
```

このコントラクトをコンパイルすると、下記のABIになる

```js
[{
  constant: false,
  inputs: [{name: 'x', type: 'uint256'}],
  name: 'set',
  outputs: [ ],
  type: 'function'
}, {
  constant: true,
  inputs: [ ],
  name: 'get',
  outputs: [{name: 'retVal', type: 'uint256'} ],
  type: 'function'
} ]
```

上記前提で、 `web3.js` を使う場合は下記のコードになります。

```js
// ABI_DEF：上記どおり、コントラクトをコンパイルした時できたコントラクトの定義情報
// ADDRESS：コントラクトアカウトのアドレス
var cnt = eth.contract(ABI_DEF).at(ADDRESS);

// 書き込み
cnt.set.sendTransaction(6,{from:eth.accounts[0]})

// トランザクションIDが返される '0x979c4e413a647673632d74a6c8b7f5b25a3260f3fefa4abea2dc265d61215939'
// マイニングし、上記トランザクションがブロックチェーンに書き込まれるまで待つ必要がある

cnt.get()
// '6'
```

## 参考記事
- [Contractを作成する · Ethereum入門](https://book.ethereum-jp.net/first_use/contract.html)
