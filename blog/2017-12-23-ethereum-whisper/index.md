---
title: イーサリアムの Whisper を使ってみる
date: 2017-12-23
tags: ["Blockchain", "Ethereum"]
---

[Ethereum Whisperを利用したP2Pチャット機能 - Qiita](https://qiita.com/tomohata/items/433911567b0a202b7074)

いつか上記記事を読んで、「あ、確かに、`web3`のAPIには`.shh`があった」と気付いて、やってみました。
APIいろいろ変わったので、詳細内容を添付します。



<!--truncate-->

## 確認した結果
- 同じノードで試してみて、送信と受信はできた
- `symKeyID` + `topic`でメッセージ公開内容を限定できる
    - なので、誰でも見えるではなく、上記情報をしている人だけ見える

## 環境
- `geth`をインストールして、下記コマンドで起動しておく
    - ポイントは`--ws`周りのオプション。許可APIも`shh`を入れる必要がある

```
geth -dev --ws --wsport 8546 --wsaddr 0.0.0.0 --wsorigins "*" --wsapi "eth,web3,shh" console

// 上記コマンドで起動したconsoleで下記を実行して、symKeyの値をメモしておく
> web3.shh.newSymKey()
"6a255cd62f2f9989119a60ea0cac6aa71aba479e99a49cff8a6eade669f1e44e"
>
```
- **マイニング開始しなくてOKです**

## 確認手順
- 作業ディレクトリを作成し、そこに移動する
- `yarn add web3`実行し、`web3`をインストールする
- 次のセクションのコードで`send.js`と`watch.js`を作成する
- `node watch.js`を実行してから、別のターミナルで`node send.js`を実行すると、watchのほうに下記のような受信したデータが表示された！

```
receive data:
{ sig: '0x045811f4c1ac1c860c18d314159eeedb13dd194e40eb95851f5abd9b303731bfdb918e1b41a43a75875c5d9ea073011a985ec4bdf1a151d2ee27c25e4186b90919',
  ttl: 10,
  timestamp: 1514038334,
  topic: '0xffaadd11',
  payload: '0xffffffdddddd1122',
  padding: '0x6a6a321cadb2b17e45fe678e74c1fcb252fd2737bff136086666f85a436b8840d5d0752529b83e2608202f7a320325fb9518a8bd32e5a418a278279fdbac1bc49c9e704cd2b67cf3
b512f08c25f67c77ec28561f32d662abd13e89521bec7c34339ef5bbfdb2ee01ae11af1428781f786da980243891896a0408885a95744ba88a0896f4b00089ef4ba6ae2ec4865ed3fc463c83e7b99c
0ee108f43c249856e45aae3447aa75b256bd96500b369a0545f06c86cbe4',
  pow: 0.6714754098360656,
  hash: '0x962587c9de2d3f355dbaf098762a57288a12dba1edb00c35e1f5fbe63da9a38c' }
```

## コード

```javascript
// send.js
var Web3 = require("web3");
var web3 = new Web3();

web3.setProvider(new Web3.providers.WebsocketProvider('ws://0.0.0.0:8546'));

var symKey = '2996cfb046f29413e55796fc201a3f7146b19ce63644369fc0f415f7d83a4637';
var keyPair = null;

Promise.all([
  web3.shh.newKeyPair().then((id) => { keyPair = id; })
]).then(() => {
  web3.shh.post({
    symKeyID: symKey, // encrypts using the sym key ID
    sig: keyPair, // signs the message using the keyPair ID
    ttl: 300,
    topic: '0xffaadd11',
    payload: '0xffffffdddddd1122',
    powTime: 3,
    powTarget: 0.5
  });

  console.log('sent message');
});
```

```javascript
// watch.js
var Web3 = require("web3");
var web3 = new Web3();

web3.setProvider(new Web3.providers.WebsocketProvider('ws://0.0.0.0:8546'));

var symKey = '2996cfb046f29413e55796fc201a3f7146b19ce63644369fc0f415f7d83a4637';
var keyPair = null;

Promise.all([
  web3.shh.newKeyPair().then((id) => { keyPair = id; })
]).then(() => {
  subscription = web3.shh.subscribe("messages", {
      symKeyID: symKey,
      topics: ['0xffaadd11']
  }).on('data', (message) => {
    console.log('receive data: ')
    console.log(message);
  });

  console.log('started subscribe.');
})
```

## まとめ
- イーサリアム上では、P2Pのメッセージングもできる
- まだまだ把握できてないことが多い
    - メッセージは、P２Pネットワークに公開する時、暗号されている？
    - 先に送信し、そのあと watch する場合でも、メッセージを受信できると理解していたが、うまくできませんでした
    - やはり異なるノードで試してみたい

## 参考資料
- [web3.shh — web3.js 1.0.0 documentation](https://web3js.readthedocs.io/en/1.0/web3-shh.html#post)
