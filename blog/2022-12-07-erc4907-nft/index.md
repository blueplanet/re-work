---
title: ERC-4907：NFT レンタルの紹介
date: 2022-12-07
tags: ["Blockchain", "Ethereum"]
---

ERC721 NFT がよく知られていますが、2022/06/28、NFT レンタルの規格として、ERC4907 が容認され、EIP が final ステータスになりました。

現時点（2022/12）では、OpenZeppelin にはまだ実装されていない模様です。



<!--truncate-->

## 規格のインタフェース

https://eips.ethereum.org/EIPS/eip-4907

> 本規格は、EIP-721を拡張したものである。アドレスに付与できる追加的な役割（ユーザー）と、その役割が自動的に取り消される（期限切れになる）時間を提案している。ユーザーの役割は、NFTの「使用」許可を意味し、譲渡やユーザー設定の能力はない。

ERC721 には、`オーナー` というロールしかありません。ERC4907 は、ERC721 を拡張して、`ユーザー` というロールを新たに設けた上に、そのロールの有効期限も設けています。


```solidity
interface IERC4907 {

    // Logged when the user of an NFT is changed or expires is changed
    /// @notice Emitted when the `user` of an NFT or the `expires` of the `user` is changed
    /// The zero address for user indicates that there is no user address
    event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);

    /// @notice set the user and expires of an NFT
    /// @dev The zero address indicates there is no user
    /// Throws if `tokenId` is not valid NFT
    /// @param user  The new user of the NFT
    /// @param expires  UNIX timestamp, The new user could use the NFT before expires
    function setUser(uint256 tokenId, address user, uint64 expires) external;

    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(uint256 tokenId) external view returns(address);

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(uint256 tokenId) external view returns(uint256);
}
```

## ユースケース
ユーザーというロールを新しく設けることによって、今まで `所有権` しかなかった NFT に `利用権` を導入しました。これによって、NFT をもっと実用的に活用されるように見えます。
NFT 発行側のポリシー次第になりますが、たとえば会員制の NFT オーナーしか入れないバーなどの場合、一時的に友達に貸してあげて入って体験してあげるとかはできますね。

また、NFT をレンタルして利益をもらうようなサービスもあります。レンタル方法の１つとして、ERC4907 をサポートされています

https://myforex.com/ja/news/myf22101202.html

https://twitter.com/ishicorodayo/status/1544426507879141377

## まとめ
この２年間 NFT がどんどん注目されてきたんですが、実用についてはまだまだ模索中な状況になっています。レンタルの実装規格ができたおかげで、今後レンタルに関するサービスを期待できますね。
