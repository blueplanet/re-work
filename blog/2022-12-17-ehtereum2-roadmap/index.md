---
title: イーサリアム 2.0：ロードマップ概観
date: 2022-12-17
tags: ["Blockchain", "Ethereum", "Ethereum2.0"]
---

イーサリアムは 2015 年から稼働してから既に 7 年間以上稼働しています。
全体的な完成度は、vitalik は 2022年9月15日実施された The Merge の後、ようやく 55% になっていると発言しています。
改めて、イーサリアム 2.0 のロードマップを確認してみたいです。

<!--truncate-->

![](https://pbs.twimg.com/media/FgwVhUjaAAEx_Bb?format=jpg&name=large)

引用元：https://twitter.com/VitalikButerin/status/1588669782471368704?s=20&t=ZtLG5cL_rLK0aUSAe1ypTA

イーサリアムのロードマップは方向性を示しているものであり、確定のものではなく今後も細かく調整されると思われます。

## 各ステージの内容
ロードマップの見方ですが、左側が過去で右側が未来であり、横軸が時系列になっています。

## The Surge
メインは、レイヤー 2 に対する最適化（[EIP 4844](https://www.eip4844.com/)）と、シャーディング。
シャーディングが実装されると、現状の設計は 64 シャードチェーンの予定なので、簡単に計算すると TPS が 64 倍になると期待できますね。

https://twitter.com/lambda_xy_x/status/1505344958513184770?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1505344958513184770%7Ctwgr%5E48d24ae2a661ab478f089b890bbabc9195af47f2%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fcoinpost.jp%2F%3Fp%3D332025

## The Scourge
今回 vitalik の発言で追加されたステージ。

> 信頼性が高く公正で中立的なトランザクションの包含を確保し、MEV の問題を解決する

PoS に移行したことで、より高度な中央集権になり、検閲耐性の懸念は現時点ではスケーリングより重要」の声もあるので、新たに追加した内容です。
詳細は明らかになっていないですが、ブロック提案者にブロック内容の一部のみ決定する提案や、Succinct Non-Interactive Argument of Knowledge（SNARK）技術の統合などが予定されています。

## The Verge
メインは、Verkle Tree の実装です。
マークルツリー（Merkle tree）のバージョンアップ版である Verkle Tree は、ブロックデータ構造をチューニングすることで、バリデーターが検証処理に必要なデータ量を大幅減らして、実行するサーバースペックがもっと低くても稼働できるようになります。
より多くのノードがバリデーターになることができる為、イーサリアムの分権化をアップできます。

![](https://vitalik.ca/images/verkle-files/verkle.png)
引用元：https://vitalik.ca/general/2021/06/18/verkle.html

## The Purge
同じくデータチューニング内容ですが、メインは、[EIP-4444](https://eips.ethereum.org/EIPS/eip-4444) 提案（一年以上のデータを保持しない）など、既存のブロック・ステートデータをチューニングする内容になります。
ただしそうなると過去のデータまで遡ることができなくなるため、可用性・データ完全性のリスクがあるとの指摘もあるので、過去データを保持するノードのインセンティブなどを検討中です。

## The Splurge
上記以外の重要なアップデート内容です。

- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)
- [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337)

など、最後の仕上げの内容になります。

## まとめ
これらのステージの内容が全部実装できると、イーサリアムが本当に「ワールドコンピュータ」になりそうですね。
