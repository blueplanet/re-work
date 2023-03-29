---
title: Solidity 言語仕様　基本編
date: 2017-12-09
tags: ["Blockchain", "Ethereum", "SmartContract"]
---

論理知識ある程度まとめたので、実際にスマートコントラクトを作成したいです。
他の言語もありましたが、Solidityのほうが一番情報多いので、Solidityで進めます。

- [Serpent · ethereum/wiki Wiki](https://github.com/ethereum/wiki/wiki/Serpent)
    - python ライクの言語
    - Augur(REP)チームが使っていたが、重大な脆弱性問題があったので、現在オススメされない [Serpentに脆弱性　AugurはSolidityへ移行 | ビットコインの最新情報 BTCN｜ビットコインニュース](https://btcnews.jp/2t1j8z4l12080/)
- [LLL PoC 6 · ethereum/cpp-ethereum Wiki](https://github.com/ethereum/cpp-ethereum/wiki/LLL-PoC-6/7a575cf91c4572734a83f95e970e9e7ed64849ce)
    - LISP ライクの言語



<!--truncate-->

## Solidity
基本的には `JavaScript`ライク、静的な型付けプログラミング言語である

- 大文字小文字は区別する
- 文（Statement）最後にはセミコロン

## 基本記法
```javascript
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

特別の箇所だけ抜粋

- `contract`でコントラクトを定義
- `function`で関数定義
    - 戻り値ある場合、明示にデータ型を定義する必要がある
    - 戻り値ない場合、定義なし

## データ型
| カテゴリ | 定義     | 意味                          |
| -------- | -------- | ----------------------------- |
| 基本型   | bool     | ブーリアン                    |
|          | int      | 符号付き整数                  |
|          | uint     | 符合なし整数                  |
|          | address  | アドレス専用のデータ型 補足１ |
|          | enum     | 列挙                          |
|          | function | 関数                          |
| 参照型   | array    | 配列                          |
|          | structs  | ストラクト                    |
| その他   | mapping  | キーバリューのマップ          |

- 参照型（配列とストラクと）は、`データの保存場所(Data location)`という概念がある
    - `memory`または`storage`
        - `memory`の場合は、処理中だけ保持され、終わったら保持されない
        - `storage`の場合は、処理後、ブロックチェーンに保持される
    - 変数の定義コンテキストによって、デフォルト値をもっていて、強制的に変更も定義できる
        - 関数のパラメータはデフォルト `memory`
        - ローカル変数の場合はデフォルト `storage`
    - ステート変数の場合は強制的に `storage`
        - ステート変数と言うのは、上記基本記法のサンプルにある`storedData`です。
        - オブジェクト指向の考え方から例を上げると、たとえ ruby で言いますと、コントラクトはクラスであり、ステート変数と言うのは、インスタンスである
        - インスタンス変数を保持する必要があるので、強制的に `storage` になる
    - 実はまた3個目の場所 `calldata` がある。外部に公開する関数の場合、そのパラメータに渡される値はこれに該当する。ほとんど `memory` と同じ動作になる。違うのは、値の変更は不可なところです
- mapping も参照型だと理解していますが、公式ドキュメントはそう分類されてないので、`その他`カテゴリにしています
    - mapping は`JavaScript`の連想配列と同じ感じですが、特別なのは、**キーを保存せず、キーの`keccak256`値を保存する**ので、mapping の**サイズ、キー集合、値集合は取得できない**。取得したい場合は、右記のように自分で実装する必要がある [dapp-bin/iterable_mapping.sol at master · ethereum/dapp-bin](https://github.com/ethereum/dapp-bin/blob/master/library/iterable_mapping.sol)

## 単位とグローバル値
- 1 ether == 10^8 wei
- 時刻単位： 1 hour == 60 minutes
- ブロックチェーン周り（よく使うものを抜粋）
    - block.gaslimit (uint): 当該ブロックの gas limit
    - block.number (uint): 当該ブロックの番号
    - block.timestamp (uint): 当該ブロックのタイムスタンプ、秒数
    - msg.sender (address): 当該呼び出しの呼び出し元アドレス
    - now (uint): block.timestamp と同じ
    - tx.gasprice (uint): 当該トランザクションの gas price

## 関数とステート変数のアクセス範囲定義
- external
    - コントラクトのインタフェースであり、他のコントラクトやトランザクションから呼び出せる。内部で直接に呼び出せない。 `f()`はだめで `this.f()` はOK
- public:
    - コントラクトのインタフェースであり、内部か、メッセージ経由で呼び出せる。パブリックなステート変数の場合、自動的に`getter`関数が生成される
- internal:
    - 現在のコントラクトまたは派生コントラクトから呼び出せる
- private:
    - 現在のコントラクトのみ呼び出せ、派生コントラクトから呼び出せない

## 参考記事
- [基本的な記法 · Ethereum入門](https://book.ethereum-jp.net/solidity/basic.html)
- [Types — Solidity 0.4.20 documentation](http://solidity.readthedocs.io/en/latest/types.html)
- [Units and Globally Available Variables — Solidity 0.4.20 documentation](http://solidity.readthedocs.io/en/latest/units-and-global-variables.html)
