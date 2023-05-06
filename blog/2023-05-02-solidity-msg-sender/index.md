---
title: Solidity の msg.sender を誤解しないように
date: 2023-05-06 19:17
tags: ["Blockchain", "Ethereum", "Solidity"]
---

私は誤解していたので、皆さん気をつけましょう。

スマートコントラクトを実装する際によく `msg.sender` を使っていますが、漠然として `トランザクションの送信者アドレス` と思っていました。とあるソースを読んだら、誤解していたことを気づきました。Solidity のドキュメントを振返て確認してみたら、見事に書かれてありました。

[ドキュメント　solidity.org v0.8.19 Block and Transaction Properties](https://docs.soliditylang.org/en/v0.8.19/units-and-global-variables.html#block-and-transaction-properties) に下記の説明とノートがあります。

> msg.sender (address): sender of the message (current call)

> Note:
> The values of all members of msg, including msg.sender and msg.value can change for every external function call. This includes calls to library functions.

<!--truncate-->

日本語に翻訳すると、

- `msg.sender` は、メッセージの送信者（ **現在の呼び出し** ）
- `tx.origin` は、トランザクションの送信者（ **呼び出しチェーン全体** ）

:::caution note
msg のすべてのメンバーの値は、msg.sender および msg.value を含め、すべての外部関数呼び出しに対して変更することができます。これは、ライブラリ関数への呼び出しも含まれます。
:::

つまり、

- `tx.origin` はシンプルでトランザクションの送信者です。私は `msg.sender` がこの位置づけだと誤解していました。
- `msg.sender` は、 `現在の関数呼び出し` に対して、`その呼び出しの送信者` です。上記ドキュメントのノートメッセージどおりに、 `外部関数` を呼び出す度に、`msg.sender` の値が変わることがありえます。具体的な変わる条件が書かれていません。
    - 後で確認ソースを載せますが、個人的な結論としては、`その関数呼び出しのスマートコントラクトコンテキストが変わっていれば、msg.sender の値が呼び出し元のアドレスに変わる` だと思います。
    - たとえば、スマートコントラクトA からスマートコントラクトBの関数 test() を呼び出す際は、スマートコントラクトコンテキストが変わったので、test() 関数内で `msg.sender` の値を確認すると、トランザクションの送信者アドレスではなく、 `スマートコントラクトA のアドレス` になります。
    - ややこしいのは、 `外部関数の呼び出しであれば必ず変わる` ということではないです。スマートコントラクトA が自分自身の public 関数を呼び出す場合は、`スマートコントラクト名(アドレス).関数名` の形ではなく、`関数名` そのまま呼び出す場合は、スマートコントラクトコンテキストが変わってないので、`msg.sender` の値も変わらないです。

コードを見ましょう。

## 実例で確認してみる
### 自分自身の関数の場合

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import "hardhat/console.sol";

contract Example1 {
    function a() public view {
        console.log("function a: ", msg.sender);

        b(); // ①
        Example1(this).b(); // ②

        Example1(this).c(); // ③
    }

    function b() public view {
        console.log("functiono b: ", msg.sender);
    }

    function c() external view {
        console.log("functiono c: ", msg.sender);
    }
}
```

Remix IDE で上記スマートコントラクトをビルドしてデプロイすると、
- 関数 b と c は、直接に呼び出すと当たり前ですが、トランザクションの送信者のアドレスが出力されます
- 関数 a を呼び出すと、`function a:` のところは、上記と同じく、トランザクションの送信者アドレスになります
    - ①は、`public` の外部関数の呼び出しになりますが、スマートコントラクトコンテキストが変わってないので、`msg.sender` の値も変わらず、トランザクションの送信者アドレスになります
    - ②は、同一外部関数ですが、明示的に `外部呼び出し` 形にすると、スマートコントラクトコンテキストが変わったとみなされるため、`msg.sender` の値は、 **`Exampl1` スマートコントラクトのアドレス** に変わります
    - ③は、`external` なので明示的に `外部呼び出し` 形でしか呼び出せないため、②と同じく、`msg.sender` の値は、 **`Exampl1` スマートコントラクトのアドレス** に変わります

### 別スマートコントラクトの関数の場合

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import "hardhat/console.sol";

contract Example1 {
    Example2 example2;

    constructor(address example2Address) {
        example2 = Example2(example2Address);
    }

    function a() public view {
        console.log("function a: ", msg.sender);

        example2.b();
        Example2(example2).b();
        example2.c();
    }
}

contract Example2 {
    function b() public view {
        console.log("functiono b: ", msg.sender);
    }

    function c() external view {
        console.log("functiono c: ", msg.sender);
    }
}
```

EOA から Exampl1 の関数を呼び出して、その中で、Example2 の関数を呼び出す内容ですが、事前にインスタンス取得しておいた形でも、明示的に `外部呼び出し` 形の形でも、スマートコントラクトコンテキストが変わったため、３つの呼び出しとも、`msg.sender` の値は、 **`Exampl1` スマートコントラクトのアドレス** に変わりました。

### 継承の場合

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import "hardhat/console.sol";

contract Example1 {
    function b() public view {
        console.log("functiono b: ", msg.sender);
    }

    function c() external view {
        console.log("functiono c: ", msg.sender);
    }
}

contract Example2 is Example1 {
    function a() public view {
        console.log("function a: ", msg.sender);

        b();
        Example1(this).b();

        Example1(this).c();
    }
}
```

`自分自身の関数の場合` の結果と同じでした。

## まとめ
`msg.sender` は、`トランザクションの送信者アドレス` ではなく、`現在のスマートコントラクトコンテキストに対して呼び出し元のアドレレス` の意味であることを気づきました。

下記の場合も検証したいですが、また別記事で。

- call での呼び出し
- delegatecall での呼び出し
- ライブラリ関数の呼び出し
