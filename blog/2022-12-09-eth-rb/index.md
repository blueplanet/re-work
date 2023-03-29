---
title: eth.rb を使ってスマートコントラクトの関数を呼び出す
date: 2022-12-09
tags: ["Ruby", "Blockchain", "Ethereum"]
---

web 3.0 業界は js が多い印象ですが、ruby からも使いたいですね。ここ数年間は、ruby の gem も増えているように見えます。
イーサリアム公式サイトのページに載せている eth.rb を使ってみました。

https://github.com/q9f/eth.rb



<!--truncate-->

## mint するコード

```rb
@key = Eth::Key.new(priv: 'プライベートキー')
@client = Eth::Client.create('イーサリアムの RPC ノードの URL')
@contact = Eth::Contract.from_abi(abi: 'abi の情報', address: 'スマートコントラクトのアドレス', name: 'RBT')
@client.transact_and_wait(@client, 'mint', 'mint 先のアドレス', sender_key: @key)
```

以前 [ethereum.rb](https://github.com/EthWorks/ethereum.rb) を使ったことがありましたが、それほど差が感じられませんでした。

## 改修した箇所
トランザクションの結果を待つ必要があるため、gem に `transact_and_wait` メソッドが用意されています。
ただ、タイムアウトの値が固定になっているため、設定できるようにしています。

https://github.com/q9f/eth.rb/blob/main/lib/eth/client.rb#L389-L403

```rb
module Eth
  class Client
    attr_accessor :wait_timeout

    def wait_for_tx(hash)
      # もとの実装の timtout は 300（５分）、かつ、設定できない
      start_time = Time.now
      timeout = wait_timeout || 300
      retry_rate = 0.1
      loop do
        raise Timeout::Error if ((Time.now - start_time) > timeout)
        return hash if is_mined_tx? hash
        sleep retry_rate
      end
    end
  end
end
```

## まとめ
eth.rb だけではなく、Rails 用の gem もいくつあるので、また使ってみていたいです。
