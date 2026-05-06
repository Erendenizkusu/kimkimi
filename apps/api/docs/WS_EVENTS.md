# WebSocket olay sözleşmesi (Socket.io)

Namespace: `/` (varsayılan)

## İstemci → sunucu

### `join_room`

Payload:

```json
{ "secretId": "<oda secret UUID>", "playerToken": "<REST join/create ile dönen token>" }
```

Sunucu, socket’i `secretId` odasına alır (`socket.join(secretId)`).

## Sunucu → istemci

### `state_sync`

Yalnızca bağlanan socket’e: `join_room` sonrası güncel oda özeti (HTTP `GET /rooms/:secretId/state` ile aynı yapı).

### `room_state`

Oda içindeki tüm socket’lere yayınlanır: profil/oyun ilerlemesi, `status`, `currentQuestionId` vb. güncellendiğinde.

### `error`

Geçersiz token veya eksik alan durumunda: `{ "message": "..." }`

## REST ile ilişki

Cevap gönderimi **REST** üzerinden yapılır (`POST .../profile-answers`, `POST .../game-answers`). Kalıcı durum PostgreSQL’de commit edildikten sonra `room_state` yayınlanır.
