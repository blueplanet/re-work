---
title: イーサリアム 2.0：RANDAO とは
date: 2022-12-20
tags: ["Blockchain", "Ethereum", "Ethereum2.0"]
---

イーサリアム 2.0 の PoS の処理の中、いくつの `ランダム値` が必要な場面があります。イーサリアム 2.0 の場合は、この処理を担当しているのが `RANDAO` になります。

https://qiita.com/blueplanet/items/58839a15e721df7e6175



<!--truncate-->

## ランダム値に対する要件
ブロックチェーンの分散化の性質上で、すべての計算は他の検証者によって検証されます。そのため、ランダム値と言っても、完全なランダム値になると検証できなくなってしまうので、ブロックチェーンにはそのまま使えません。イーサリアムの RANDAO は、その代わり、ブロックチェーンの一部として計算・更新されるシードから擬似的なランダム性を生成しています。

詳細要件を整理してみますと

1. 検証する際に同じ結果になる必要があるため、同じシードから生成した値は必ず同じになること
2. シードは予測不可能であること
    - １番目の要件から、シードも予測可能になると、計算結果を狙って、いつ入金・出金するか、公開鍵を何にするかを戦略的に決めることができしまい攻撃されやすいため、シード自体は予測不可能である必要がある

## ランダム処理の流れ
`シードから擬似ランダム値を生成する` ことで、要件 1 を対応します。
要件 2 については、下記の複数のルールで保証します。

- シードは、誰か１人ではなく、スロットのブロック提案者がシードに混ぜられる（つまり XOR される）ハッシュを提供することでどんどん更新する
- エポック毎に、シードを計算する
- エポック N でエポック N+5 のバリデーターセットを固定する
    - エポック N+5 で自分が委員会またはブロック提案者になることを分かったとしても、エポック N から エポック N+4 までの間、別のブロック提案者によって予測できない更新が入っているため、結果的にエポック N+5 のシードは予測できない
- エポック N の開始時にエポック N+1 のシードを計算して、既に決められたバリデーターセットから提案者と委員会の役割を決める
    - ブロック提案者は、エポックごとに 32 回の更新の中の 1 回しか制御できないため、結果的に最終的なシードに影響できず、計算結果を制御できない

## RANDAO の実装
https://github.com/randao/randao

RANDAO は独立して実装されています。イーサリアム上にはベース部分として他のスマートコントラクトに呼び出されます。
RANDAO のランダム値生成流れは、３つのフェーズから構成されています。

- フェーズ１：参加者を募集する
    - 参加希望者は指定の時間ウィンドウ期間内に、スマートコントラクトに保証金と各自選択した任意数字のハッシュ値を送信する
- フェーズ２：有効なハッシュ値を収集する
    - フェーズ１が終了した後、フェーズ２の時間ウィンドウ期間内に、参加者がスマートコントラクトにフェーズ１で選択した数字を送信する。スマートコントラクトは数字が正しいかどうかを検証し、正しいならランダム生成関数のシードに保存する
- フェーズ３：ランダム値計算し、報酬を送金する
    - フェーズ２で有効な数字を収集した後、全ての有効な数字から最終的なランダム値を生成し、スマートコントラクトに保存して、ランダム値をリクエストした他のスマートコントラクトに結果を返す
    - フェーズ１で預かった保証金を返し、他のスマートコントラクトが支払った手数料を報酬としてすべての参加者に送金する

また、ランダム値の結果がコントロールされない為、スマートコントラクトに下記のルールが追加されています
- フェーズ１で、同じハッシュ値が収集された場合、１番目だけを受け取る
- フェーズ１では、最小参加者数の設定があります。時間ウィンドウの期間中その数にならなかった場合、その回のランダム値計算は失敗とする
- フェーズ１でハッシュ値が受け取れた場合、フェーズ２では必ず数字を提出しなければならない
    - フェーズ２で数字を提出しなかった場合は、フェーズ１で預かった保証金は没収されてしまう
    - フェーズ２で、全ての数字が収集できなかった場合、その回のランダム計算は失敗とする。他のスマートコントラクトが支払った手数料を返金し、預かった保証金を収集できた参加者に送金する

## まとめ
`ランダム値がほしいが、検証する際に必ず同じ結果を得られなければならない` という一目で見ると矛盾そうな要件を実装した RANDAO の紹介でした。

## 参考資料
https://www.youtube.com/watch?v=uKDCXj8ViGg&t=2s

https://github.com/randao/randao
