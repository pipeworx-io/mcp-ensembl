# mcp-ensembl

Ensembl REST — vertebrate genomes, sequences, comparative genomics, variation

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `lookup` | Lookup by stable id (gene/transcript/exon/translation). |
| `lookup_symbol` | Gene by symbol within a species. |
| `xrefs` | External cross-references for a gene symbol. |
| `sequence` | Sequence by stable id. |
| `homology` | Homology mappings for a gene. |
| `variation` | Variation record by name. |
| `vep` | Variant Effect Predictor — region in "chrom:start-end:strand" form. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "ensembl": {
      "url": "https://gateway.pipeworx.io/ensembl/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Ensembl data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
