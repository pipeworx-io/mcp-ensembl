interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Ensembl REST MCP.
 *
 * Auth: none. Docs: https://rest.ensembl.org
 */


const BASE = 'https://rest.ensembl.org';
const UA = 'pipeworx-mcp-ensembl/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'lookup',
    description: 'Lookup by stable id (gene/transcript/exon/translation).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'e.g. "ENSG00000157764" (BRAF)' },
        expand: { type: 'boolean', description: 'Include child features.' },
      },
      required: ['id'],
    },
  },
  {
    name: 'lookup_symbol',
    description: 'Gene by symbol within a species.',
    inputSchema: {
      type: 'object',
      properties: {
        species: { type: 'string', description: 'e.g. "human", "mus_musculus"' },
        symbol: { type: 'string' },
        expand: { type: 'boolean' },
      },
      required: ['species', 'symbol'],
    },
  },
  {
    name: 'xrefs',
    description: 'External cross-references for a gene symbol.',
    inputSchema: {
      type: 'object',
      properties: {
        species: { type: 'string' },
        symbol: { type: 'string' },
      },
      required: ['species', 'symbol'],
    },
  },
  {
    name: 'sequence',
    description: 'Sequence by stable id.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string', description: 'genomic (default) | cdna | cds | protein' },
      },
      required: ['id'],
    },
  },
  {
    name: 'homology',
    description: 'Homology mappings for a gene.',
    inputSchema: {
      type: 'object',
      properties: {
        species: { type: 'string' },
        symbol_or_id: { type: 'string' },
        target_species: { type: 'string' },
      },
      required: ['species', 'symbol_or_id'],
    },
  },
  {
    name: 'variation',
    description: 'Variation record by name.',
    inputSchema: {
      type: 'object',
      properties: {
        species: { type: 'string' },
        variant_id: { type: 'string', description: 'e.g. "rs56116432"' },
      },
      required: ['species', 'variant_id'],
    },
  },
  {
    name: 'vep',
    description: 'Variant Effect Predictor — region in "chrom:start-end:strand" form.',
    inputSchema: {
      type: 'object',
      properties: {
        species: { type: 'string' },
        region: { type: 'string', description: 'e.g. "9:22125504-22125504:1"' },
        allele: { type: 'string', description: 'e.g. "C"' },
      },
      required: ['species', 'region', 'allele'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'lookup': {
      const id = encodeURIComponent(reqStr(args, 'id', '"ENSG00000157764"'));
      const expand = args.expand === true ? '?expand=1' : '';
      return ensGet(`/lookup/id/${id}${expand}`);
    }
    case 'lookup_symbol': {
      const species = encodeURIComponent(reqStr(args, 'species', '"human"'));
      const symbol = encodeURIComponent(reqStr(args, 'symbol', '"BRAF"'));
      const expand = args.expand === true ? '?expand=1' : '';
      return ensGet(`/lookup/symbol/${species}/${symbol}${expand}`);
    }
    case 'xrefs':
      return ensGet(
        `/xrefs/symbol/${encodeURIComponent(reqStr(args, 'species', '"human"'))}/${encodeURIComponent(reqStr(args, 'symbol', '"BRAF"'))}`,
      );
    case 'sequence': {
      const type = String(args.type ?? 'genomic');
      return ensGet(`/sequence/id/${encodeURIComponent(reqStr(args, 'id', '"ENSG00000157764"'))}?type=${type}`);
    }
    case 'homology': {
      const species = encodeURIComponent(reqStr(args, 'species', '"human"'));
      const id = encodeURIComponent(reqStr(args, 'symbol_or_id', '"BRCA2"'));
      const ts = args.target_species ? `?target_species=${encodeURIComponent(String(args.target_species))}` : '';
      return ensGet(`/homology/symbol/${species}/${id}${ts}`);
    }
    case 'variation':
      return ensGet(
        `/variation/${encodeURIComponent(reqStr(args, 'species', '"human"'))}/${encodeURIComponent(reqStr(args, 'variant_id', '"rs56116432"'))}`,
      );
    case 'vep':
      return ensGet(
        `/vep/${encodeURIComponent(reqStr(args, 'species', '"human"'))}/region/${encodeURIComponent(reqStr(args, 'region', '"9:22125504-22125504:1"'))}/${encodeURIComponent(reqStr(args, 'allele', '"C"'))}`,
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function ensGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('Ensembl: not found');
  if (!res.ok) throw new Error(`Ensembl: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
