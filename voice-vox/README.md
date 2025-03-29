# VOICE VOX 環境

- VOICE VOX を使って、音声合成、音声出力を実施する

## 環境

1. Docker Container を立ち上げる

```bash
docker compose up --build
```

2. `http://localhost:50021/docs#/` で OpenAPI Doc が確認できる

## まずは curl で叩いてみる

1. まずは VOICEVOX を起動しておく。（GUI でも Docker でもお好きな方で）

2. 読み上げたい文字列を準備する。

```bash
$ echo -n "こんにちは、音声合成の世界へようこそ" > text.txt
```

3. 音声合成用のクエリ作成のエンドポイント(/audio_query) に話者と読み上げたい文章をパラメタで渡します。
   すると音声合成で利用するクエリが返ってきます。

```bash
$ curl -s \
    -X POST \
    "localhost:50021/audio_query?speaker=1"\
    --get --data-urlencode text@text.txt \
    > query.json
```

4. 音声合成のエンドポイント(/synthesis) に話者とクエリをパラメタで渡すとオーディオファイルが返ってきます。

```bash
$ curl -s \
    -H "Content-Type: application/json" \
    -X POST \
    -d @query.json \
    "localhost:50021/synthesis?speaker=1" \
    > audio.wav
```

5. audio.wav を再生してみると「ずんだもん」の声が聞こえてきます。

## 参考・引用

1. [VOICEVOX GitHub](https://github.com/VOICEVOX)

2. [VoiceVox で高クオリティな音声合成をかんたんに行う](https://zenn.dev/ddpn08/articles/fb390caa781e54)

3. [VOICEVOX(音声合成)を REST-API で利用する](https://qiita.com/A_T_B/items/1531d78944d8b796b9fa)
