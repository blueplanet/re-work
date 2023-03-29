---
title: AWS でサブドメインを別アカウントに移行する際ハマったこと
date: 2021-12-10
tags: ["AWS"]
---

セキュリティの考慮があって、もともと構築できていた STG 環境を別の AWS アカウントを作成しそちらに移行した際、いくつハマったことがあったので共有します。



<!--truncate-->

## そもそもサブドメインを別の AWS アカウントに移譲する方法
こちらの記事を参考して移行できました。

[[Route 53] 別のAWSアカウントでサブドメインを使えるように権限移譲する](https://dev.classmethod.jp/articles/route53-transfer-hostedzones-2021/)

## 複数ドメインがある場合の命名方法
たとえ下記の３つのドメインがあるとします。

- stg.test.com：エンドユーザ用のドメイン
- stg-admin.test.com：管理者用のドメイン
- stg-api.test.com：APIのエンドポイント

今回移行するまで、上記でも困ってなかったが、今回の移行で下記の不便に気づきました。

- このやり方ですと３つのサブドメインを上記記事のように移譲する必要があります。
- ACM で証明書を管理する場合は、３つのドメインを全部明記して作成しないといけません。

よって、上記のやり方をやめて、更にぶら下げて全部１つのサブドメインにしました。

- stg.test.com：エンドユーザ用のドメイン
- admin.stg.test.com：管理者用のドメイン
- api.stg.test.com：APIのエンドポイント

こうしておけば、アカウント間の移行も１つのドメインで済みますし、ACM での証明書もワイルドドメインで１つで管理できるので、管理しやすいです。

## グローバルでユニーク値を持っているリソース
ほとんどのリソースはアカウント配下に属していますが、いくつの種類のリソースはグローバルでユニークの値である必要があります。

1. S3 のバケット名：全世界でユニークの名前でなければならないので、もとの環境から削除する必要がある
1. CloudFront に設定されている cname もドメイン関連しているので、もとの環境 CloudFront を削除しておく必要がある

## その他
移行とは関係ないが、AWS Secrets Manager に作成したものは、削除しても 7 日間の復旧期間が設けられているため、削除直後に同じ名前を再度作成できません。

ただしに削除したい場合、公式ドキュメント通りに、`aws secretsmanager delete-secret --force-delete-without-recovery` で削除できます。

[同じ名前の新しいシークレットを作成するために、Secrets Manager のシークレットを直ちに削除する方法を教えてください。](https://aws.amazon.com/jp/premiumsupport/knowledge-center/delete-secrets-manager-secret/)

```shell
aws secretsmanager delete-secret --secret-id your-secret --force-delete-without-recovery --region your-region
```

以上
