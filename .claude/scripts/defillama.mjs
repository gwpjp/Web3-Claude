#!/usr/bin/env node

/**
 * DeFiLlama CLI utility for protocol research.
 *
 * Usage:
 *   node .claude/scripts/defillama.mjs protocol <slug>     # TVL, chains, raises, GitHub
 *   node .claude/scripts/defillama.mjs search <query>       # Search protocols
 *   node .claude/scripts/defillama.mjs yields <project>     # Yield pools
 *   node .claude/scripts/defillama.mjs fees <protocol>      # Fees & revenue
 *   node .claude/scripts/defillama.mjs raises <query>       # Funding rounds
 *   node .claude/scripts/defillama.mjs hacks <query>        # Exploit history
 *   node .claude/scripts/defillama.mjs treasury <protocol>  # Treasury holdings
 */

const BASE = "https://api.llama.fi";
const YIELDS_BASE = "https://yields.llama.fi";

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }
  return res.json();
}

function formatUSD(n) {
  if (n == null) return "N/A";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function formatDate(ts) {
  if (!ts) return "N/A";
  const d = typeof ts === "number" ? new Date(ts * 1000) : new Date(ts);
  return d.toISOString().split("T")[0];
}

// --- Subcommands ---

async function protocol(slug) {
  const data = await fetchJSON(`${BASE}/protocol/${slug}`);

  const tvl = data.tvl?.length
    ? data.tvl[data.tvl.length - 1]
    : null;

  console.log(`# ${data.name || slug}`);
  console.log(`\nCategory: ${data.category || "N/A"}`);
  console.log(`Chains: ${(data.chains || []).join(", ") || "N/A"}`);
  console.log(`Current TVL: ${tvl ? formatUSD(tvl.totalLiquidityUSD) : "N/A"}`);
  console.log(`URL: ${data.url || "N/A"}`);
  console.log(`Twitter: ${data.twitter ? `https://twitter.com/${data.twitter}` : "N/A"}`);
  console.log(`GitHub: ${(data.github || []).map((g) => `https://github.com/${g}`).join(", ") || "N/A"}`);
  console.log(`Audits: ${data.audits || "N/A"}`);
  console.log(`Audit Links: ${(data.audit_links || []).join(", ") || "N/A"}`);
  console.log(`Oracle: ${(data.oracles || []).join(", ") || "N/A"}`);
  console.log(`Forked From: ${(data.forkedFrom || []).join(", ") || "N/A"}`);
  console.log(`Listed At: ${formatDate(data.listedAt)}`);

  if (data.raises && data.raises.length > 0) {
    console.log(`\n## Funding Rounds`);
    for (const r of data.raises) {
      console.log(`- ${r.date || "?"}: ${formatUSD(r.amount)} (${r.round || "?"}) from ${(r.leadInvestors || []).join(", ") || "unknown"}`);
    }
  }

  if (data.chainTvls) {
    console.log(`\n## TVL by Chain`);
    for (const [chain, info] of Object.entries(data.chainTvls)) {
      if (chain.includes("-") || !info.tvl?.length) continue;
      const latest = info.tvl[info.tvl.length - 1];
      console.log(`- ${chain}: ${formatUSD(latest?.totalLiquidityUSD)}`);
    }
  }
}

async function search(query) {
  const data = await fetchJSON(`${BASE}/protocols`);
  const q = query.toLowerCase();
  const matches = data
    .filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.symbol?.toLowerCase().includes(q)
    )
    .slice(0, 15);

  if (matches.length === 0) {
    console.log(`No protocols found matching "${query}"`);
    return;
  }

  console.log(`# Search Results for "${query}" (${matches.length} matches)\n`);
  for (const p of matches) {
    console.log(`- **${p.name}** (slug: ${p.slug}) | TVL: ${formatUSD(p.tvl)} | Category: ${p.category || "N/A"} | Chains: ${(p.chains || []).slice(0, 5).join(", ")}`);
  }
}

async function yields(project) {
  const data = await fetchJSON(`${YIELDS_BASE}/pools`);
  const q = project.toLowerCase();
  const matches = data.data
    .filter((p) => p.project?.toLowerCase().includes(q))
    .sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
    .slice(0, 20);

  if (matches.length === 0) {
    console.log(`No yield pools found for "${project}"`);
    return;
  }

  console.log(`# Yield Pools for "${project}" (top ${matches.length})\n`);
  for (const p of matches) {
    console.log(
      `- **${p.symbol || "?"}** on ${p.chain || "?"} | APY: ${p.apy?.toFixed(2) ?? "?"}% | TVL: ${formatUSD(p.tvlUsd)} | IL Risk: ${p.ilRisk || "N/A"} | Reward Tokens: ${(p.rewardTokens || []).join(", ") || "none"}`
    );
  }
}

async function fees(protocolSlug) {
  try {
    const [summary, daily] = await Promise.all([
      fetchJSON(`${BASE}/summary/fees/${protocolSlug}`),
      fetchJSON(`${BASE}/overview/fees`).catch(() => null),
    ]);

    console.log(`# Fees & Revenue: ${summary.name || protocolSlug}\n`);
    console.log(`Total 24h Fees: ${formatUSD(summary.total24h)}`);
    console.log(`Total 24h Revenue: ${formatUSD(summary.totalRevenue24h ?? summary.revenue24h)}`);
    console.log(`Total 30d Fees: ${formatUSD(summary.total30d)}`);
    console.log(`Total All Time: ${formatUSD(summary.totalAllTime)}`);

    if (summary.totalDataChart?.length) {
      console.log(`\n## Recent Daily Fees (last 7)`);
      const recent = summary.totalDataChart.slice(-7);
      for (const [ts, val] of recent) {
        console.log(`- ${formatDate(ts)}: ${formatUSD(val)}`);
      }
    }
  } catch (e) {
    console.error(`Error fetching fees for "${protocolSlug}": ${e.message}`);
    console.log("Tip: Try the protocol slug (e.g., 'aave', 'uniswap', 'lido')");
  }
}

async function raises(query) {
  const data = await fetchJSON(`${BASE}/raises`);
  const q = query.toLowerCase();
  const matches = (data.raises || [])
    .filter((r) => r.name?.toLowerCase().includes(q))
    .slice(0, 15);

  if (matches.length === 0) {
    console.log(`No raises found matching "${query}"`);
    return;
  }

  console.log(`# Funding Rounds matching "${query}" (${matches.length})\n`);
  for (const r of matches) {
    const investors = [
      ...(r.leadInvestors || []),
      ...(r.otherInvestors || []),
    ]
      .slice(0, 5)
      .join(", ");
    console.log(
      `- **${r.name}** | ${formatDate(r.date)} | ${r.round || "?"} | ${formatUSD(r.amount)} | Investors: ${investors || "undisclosed"}`
    );
  }
}

async function hacks(query) {
  const data = await fetchJSON(`${BASE}/hacks`);
  const q = query.toLowerCase();
  const matches = data
    .filter((h) => h.name?.toLowerCase().includes(q) || h.target?.toLowerCase().includes(q))
    .slice(0, 15);

  if (matches.length === 0) {
    console.log(`No hacks found matching "${query}"`);
    return;
  }

  console.log(`# Hacks & Exploits matching "${query}" (${matches.length})\n`);
  for (const h of matches) {
    console.log(
      `- **${h.name || h.target || "?"}** | ${formatDate(h.date)} | ${formatUSD(h.amount)} lost | Technique: ${h.technique || "N/A"} | Chain: ${h.chain || "N/A"} | Returned: ${formatUSD(h.returnedFunds)}`
    );
  }
}

async function treasury(protocolSlug) {
  try {
    const data = await fetchJSON(`${BASE}/treasury/${protocolSlug}`);

    console.log(`# Treasury: ${data.name || protocolSlug}\n`);

    const chains = data.chainTvls || {};
    let totalOwn = 0;
    let totalTotal = 0;

    for (const [chain, info] of Object.entries(chains)) {
      if (!info.tvl?.length) continue;
      const latest = info.tvl[info.tvl.length - 1];
      const val = latest?.totalLiquidityUSD ?? 0;
      totalTotal += val;

      if (!chain.includes("own tokens")) {
        totalOwn += val;
      }
    }

    console.log(`Total Treasury: ${formatUSD(totalTotal)}`);
    console.log(`Excluding Own Tokens: ${formatUSD(totalOwn)}`);

    if (data.tokens) {
      console.log(`\n## Token Breakdown`);
      const sorted = Object.entries(data.tokens)
        .flatMap(([chain, tokens]) =>
          Object.entries(tokens || {}).map(([token, val]) => ({
            chain,
            token,
            value: val,
          }))
        )
        .sort((a, b) => (b.value || 0) - (a.value || 0))
        .slice(0, 15);

      for (const t of sorted) {
        console.log(`- ${t.token} (${t.chain}): ${formatUSD(t.value)}`);
      }
    }
  } catch (e) {
    console.error(`Error fetching treasury for "${protocolSlug}": ${e.message}`);
    console.log("Tip: Not all protocols have treasury data. Try major DAOs.");
  }
}

// --- CLI ---

const [, , command, ...args] = process.argv;

if (!command) {
  console.log(`Usage: node defillama.mjs <command> <args>

Commands:
  protocol <slug>     Protocol overview (TVL, chains, raises, GitHub)
  search <query>      Search protocols by name
  yields <project>    Yield pools for a project
  fees <protocol>     Fees & revenue data
  raises <query>      Funding round history
  hacks <query>       Exploit & hack history
  treasury <protocol> Treasury holdings`);
  process.exit(0);
}

const arg = args.join(" ");

const commands = { protocol, search, yields, fees, raises, hacks, treasury };

if (!commands[command]) {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

if (!arg) {
  console.error(`Missing argument for "${command}"`);
  process.exit(1);
}

commands[command](arg).catch((e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});
