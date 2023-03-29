---
title: イーサリアムのノードをAPIとして提供してくれるinfura.ioを使ってみる
date: 2017-12-18
tags: ["Blockchain", "Ethereum"]
---



<!--truncate-->

## 課題
- 一般的に、イーサリアムのブロックチェーンと通信するためには、自分で何らかのサーバーにイーサリアムのクライアントを入れて、常に最新のブロックチェーンのデータを同期しておく必要がある。
- 本番で使う場合は、おそらく稼働率などを保証するため、ちゃんと複数ノードにする必要があったりする
- https://infura.io は、その課題を解決してくれるサービスである。

## 使ってみる
- 手順的には [Ropstenのテストネット上でERC20トークンを作成・送付してみる - ペパボテックブログ](https://tech.pepabo.com/2017/12/06/erc20-token-on-ropsten/) を参考しています。
- 確認したいことは、たとえ自分のサーバーからトランザクションを送信する時、普通は自分のサーバにある`JSON RPC`と通信し、`sendTransaction`メソッドを使っていました。ただ、毎回`unlock`しないと行けないので、infura.io 場合はどうなるかを確認したい

## コントラクトのデプロイ周り
- 参考記事のまんまですが、 `truffle` を使ってデプロイする場合、`truffle.js` で設定できる

```javascript
// ROPSTEN_MNEMONICとINFURA_ACCESS_TOKEN環境変数は事前時設定されている前提
// HDはどの言葉の略語だろう。。。
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.ROPSTEN_MNEMONIC;
var accessToken = process.env.INFURA_ACCESS_TOKEN;

module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/" + accessToken
        );
      },
      network_id: 3,
      gas: 500000
    }   
  }
};
```

## 自分のアカウントから送金する
- ユースケースで言うと
    - Slack上で動くボットを実装したい
    - `@bot send to 0xBA333d667eECA936b02B614fDD805028E5B2C38A 5`のように叩かれると送金したい
- 自分でノード運用する場合は、`unlockAccount`実行してから、`sendTransaction`すればよいが、**ノードが自分で運用してセキュリティ問題がないこと**が前提である
- https://infura.io の場合は、その前提がないので、上記で行けない
- 解決方法： [sendRawTransaction](https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendrawtransaction)リンク先のコードのまんまですが、下記の感じで、トランザクションデータをサインしてから、`sendRawTransaction`を使う

```javascript
var Tx = require('ethereumjs-tx');
var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')

var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000', 
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000', 
  value: '0x00', 
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}

var tx = new Tx(rawTx);
tx.sign(privateKey);

var serializedTx = tx.serialize();

//console.log(serializedTx.toString('hex'));
//f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
});
```

## まとめ
- トランザクションさえセキュアで送信できれば、他の処理はたぶん問題ないと思われるので、運用が面倒と思うなら、 infura.io を使うのは良いと思います。

## 参考記事
- [Ethereumホスティングサービス「Infura」の使い方とは？ - ワクワク仮想通貨(暗号通貨) 〜 ICOやらbitcoin(ビットコイン) Ethereum(イーサリアム) etc...](https://wakuwaku-currency.com/virtual-currency/ethereum/about-use-hosting-service-infura.html#InfuraJSON-RPC)
- [Ethereum上のトークンを送金するWebアプリを作ってDecentralizedな方法で公開してみる - lotz84の日記](http://lotz84.hatenablog.com/entry/2017/12/13/081920)
- [tiperc20: Slack上でERC20トークンを送りあってコミュニケーション - ペパボテックブログ](https://tech.pepabo.com/2017/12/09/tiperc20/)
- [Infura.io サポートするAPI Reference](https://infura.io/docs/#supported-json-rpc-methods)
