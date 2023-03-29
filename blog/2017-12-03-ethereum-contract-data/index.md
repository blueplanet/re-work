---
title: イーサリアム・コントラクトのデータ周り
date: 2017-12-03
tags: ["Blockchain", "Ethereum"]
---

## 基本のデータサイズ
- イーサリアムのブロック生成時間は、平均 15 秒
- イーサリアムのブロックサイズは、固定ではない
    - 含めいているトランザクションの GAS Limit 値の合計値が規定されているブロック単位の GAS Limit を超えてなければ良い
    - ブロック単位の GAS Limit はマイナーが、`+/-  1/2024（0.0976%）` 範囲で調整できる
    - ブロック単位の GAS Limit は現在は `6,706,546` GAS（https://ethstats.net/）

<!--truncate-->

## トランザクションが持つデータ
- コントラクトのメソッドを呼び出す際に、定義されているメソッドのパラメータ毎に値を渡す必要がある
- パラメータ毎の値は、32バイトで
- これらの値はエンコードされ、トランザクションの`data`フィールドに保持される

## ブロックが持つデータ
- stateRoot:stateのマークル木ルートのハッシュ値
- transactionsRoot:トランザクションのマークル木ルートのハッシュ値
- receiptsRoot:レシートのマークル木ルートのハッシュ値

## 疑問
- ハッシュ値だけ？データの本体はどこにあるの？

## スマートコントラクトが持てるデータ
- コントラクトアカウント毎にストレージ領域がある
    - 持っている全データのマークル木のルートハッシュを持っている
- スマートコントラクトを定義する際、`mapping (address => uint256)`のような、`どのアドレスがどの残高を持っているか`の情報を保持する場合は、特に制限がない。

## 参考記事
- [[Japanese] Ethereum Development Tutorial · ethereum/wiki Wiki](https://github.com/ethereum/wiki/wiki/%5BJapanese%5D--Ethereum-Development-Tutorial)
- [トランザクションレベルで理解する。イーサリアムの具体的な仕組みを解説](https://zoom-blc.com/what-is-ethereum)
