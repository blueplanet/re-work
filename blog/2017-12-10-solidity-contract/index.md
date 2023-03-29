---
title: Solidity 言語仕様　コントラクト篇
date: 2017-12-10
tags: ["Blockchain", "Ethereum", "SmartContract"]
---

Solidityのコントラクト周りまとめてみます。



<!--truncate-->

## コントラクトの基本
- `pragma solidity ^0.4.0;`のようにバージョンを定義する
- コントラクトは、オブジェクト指向のプログラミング言語のクラスと似ている
- コントラクトは、多重継承できる
- コントラクト名と同名の関数は、初期化関数であり、コントラクトがデプロイされた時実行される
- ステート変数(State Variables)
    - オブジェクト指向のプログラミング言語のインスタンス変数と似ている
    - ステート変数は、ブロックチェーンに書き込まれ、保持される
- 関数以外は、`イベント(event)`も定義できる
    - イベントは、イーサリアム上のログの基礎であり、イベントを発生させると、関連情報をログに記録され、後で参照・検索できる
    - **イベントとログは、コントラクトからアクセスできない、コントラクトのオーナーでもアクセスできない！！！**

## 関数修飾子(Function Modifiers)
- 関数修飾子とは、関数に付けられ、関数の動作を変更できる仕組み
    - たとえば、オーナーしか実行できない関数なら、`onlyOnwer`修飾子を使う。下記サンプルの場合は、オーナーだけ変更関数`set`を呼び出せる、オーナー以外の場合は、異常になる

```javascript
pragma solidity ^0.4.0;

contract SingleNumRegister {
    uint storedData;
    address owner;

    function SingleNumRegister() {
        // デプロイするアカウントのアドレスをオーナーとして保持する
        owner = msg.sender;
    }

    modifier onlyOwner {
        // 呼び出す元のアドレスがオーナー以外の場合、revert()処理走って状態変更を巻き戻して実行を止める
        require(msg.sender == owner)

        // _ は、関数修飾子が付けられている関数本体を実行する意味
        _;
    }

    function set(uint x) onlyOwner {
        storedData = x;
    }

    function get() constant returns (uint retVal) {
        return storedData;
    }
}
```

- 修飾子にもパラメータを持てる

```javascript
contract Register{
    modifier costs(uint price) {
        if (msg.value >= price) {
            _;
        }
    }

    function register() costs(price) {
        // 実際の処理
    }
}
```

## 定数（Constant State Variables）
- ステート変数と関数に対して、`constant`の定義を付けられている
- ステート変数の場合
    - そのステート変数はストレージを使わずに、コンパイル終わった時点で、固定値になる
    - 変数のデータ型は、基本型と文字列しかできない
- 関数の場合
    - `この関数はブロックチェーンのデータを変更しない`ことを表明するだけ
    - 言語仕様上は特に制限・チェックしていない

```javascript
pragma solidity ^0.4.0;

contract C {
    uint constant x = 32**22 + 8;
    string constant text = "abc";

    function f(uint a, uint b) constant returns (uint) {
        return a * (b + 42);
    }
}
```

## 後退関数(fallback function)
- コントラクトに、１つだけ定義できる、名前なし、パラメータなし、戻り値なしの関数
- 呼び出されるタイミングは下記２つ
    - コントラクトが呼び出された時、どの関数にもマッチできなかった場合
    - コントラクト宛にイーサ（Ether）が送金された場合
- 注意点
    - コントラクトがイーサを受け取る必要があるなら、必ず定義する
    - 定義してない場合、送金されると異常になり、イーサが送金者に返される

## 特別のオペレーター delete
- 基本型に対して、変数に初期値を設定する
- 整数値の場合 `0` にする
- 固定サイズ配列の場合、各要素に初期値を設定する
- 可変サイズ配列の場合、配列のサイズを `0` にする
- ストラクトの場合、各要素に初期値を設定する

## 参考
- [Contracts — Solidity 0.4.20 documentation](http://solidity.readthedocs.io/en/latest/contracts.html#function-modifiers)
- [智能合约源文件的基本要素概览（Structure of a Contract） - 区块链技术-智能合约Solidity编程语言](http://www.tryblockchain.org/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6%E6%BA%90%E6%96%87%E4%BB%B6%E7%9A%84%E4%B8%BB%E8%A6%81%E8%A6%81%E7%B4%A0.html)
- [solidity勉強 — 続・無能日記](http://blog.potix.jp/2017/08/04/solidity.html)
