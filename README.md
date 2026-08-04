# @pipeworx/ensembl

[Ensembl](https://www.ensembl.org) REST API MCP — vertebrate genomes, gene annotations, sequences, comparative genomics, variation. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `lookup(id, expand?)` — by stable id (gene/transcript/exon/translation)
- `lookup_symbol(species, symbol)` — gene by symbol within a species
- `xrefs(species, symbol)` — external cross-references for a gene symbol
- `sequence(id, type?)` — DNA / cDNA / CDS / protein sequence
- `homology(species, symbol_or_id, target_species?)` — homology mappings
- `variation(species, variant_id)` — variation by name (e.g. "rs56116432")
- `vep(species, region, allele)` — Variant Effect Predictor (region: "9:22125504-22125504:1")
- `xref_symbol(species, symbol)` — symbol lookup (alias for /xrefs/symbol)

## Data source

`https://rest.ensembl.org`

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
