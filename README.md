[![CI](https://img.shields.io/github/actions/workflow/status/Tox1469/batch-processor/ci.yml?style=flat-square&label=ci)](https://github.com/Tox1469/batch-processor/actions)
[![License](https://img.shields.io/github/license/Tox1469/batch-processor?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/github/v/release/Tox1469/batch-processor?style=flat-square)](https://github.com/Tox1469/batch-processor/releases)
[![Stars](https://img.shields.io/github/stars/Tox1469/batch-processor?style=flat-square)](https://github.com/Tox1469/batch-processor/stargazers)

---

# batch-processor

Agrupa itens em lotes e executa flush quando atinge tamanho máximo ou tempo limite.

## Instalação

```bash
npm install batch-processor
```

## Uso

```ts
import { BatchProcessor } from "batch-processor";

const bp = new BatchProcessor<string>({
  maxSize: 100,
  maxWaitMs: 500,
  handler: async (batch) => await insertMany(batch),
});

bp.push("a");
bp.push("b");
await bp.close();
```

## API

- `new BatchProcessor({ maxSize, maxWaitMs?, handler, onError? })`
- `push(item)`, `pushAll(items)`
- `flush(): Promise<void>`
- `close(): Promise<void>`

## Licença

MIT