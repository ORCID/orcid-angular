#!/usr/bin/env node
/*
  Optional helper to interact with Transifex REST API.
  Currently unused by the workflow, but ready for future use:
  - Fetch open issues (resource string comments of type=issue, status=open)
  - Scope by ORG/PROJECT/RESOURCE via slugs
*/

const fs = require('fs');

const TX_TOKEN = process.env.TX_TOKEN || process.env.TRANSIFEX_TOKEN;
const ORG = process.env.TX_ORG_SLUG || '';
const PROJECT = process.env.TX_PROJECT_SLUG || '';
const RESOURCE = process.env.TX_RESOURCE_SLUG || '';

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TX_TOKEN}`,
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }
  return res.json();
}

function buildIssuesUrl() {
  const base = new URL('https://rest.api.transifex.com/resource_string_comments');
  base.searchParams.set('filter[type]', 'issue');
  base.searchParams.set('filter[status]', 'open');
  base.searchParams.set('page[limit]', '100');
  if (ORG && PROJECT && RESOURCE) {
    base.searchParams.set('filter[resource]', `o:${ORG}:p:${PROJECT}:r:${RESOURCE}`);
  } else if (ORG && PROJECT) {
    base.searchParams.set('filter[project]', `o:${ORG}:p:${PROJECT}`);
  } else if (ORG) {
    base.searchParams.set('filter[organization]', `o:${ORG}`);
  }
  return base.toString();
}

async function fetchAllIssues() {
  if (!TX_TOKEN) throw new Error('TX_TOKEN not set');
  const outFile = '.github/transifex_issues_report.md';
  let url = buildIssuesUrl();
  let total = 0;
  let page = 0;
  const out = [];
  out.push('### Transifex open issues');
  if (ORG && PROJECT && RESOURCE) out.push(`- scope: org=${ORG}, project=${PROJECT}, resource=${RESOURCE}`);
  else if (ORG && PROJECT) out.push(`- scope: org=${ORG}, project=${PROJECT}`);
  else if (ORG) out.push(`- scope: org=${ORG}`);
  out.push('');

  while (url) {
    page += 1;
    const json = await fetchJson(url);
    const items = json.data || [];
    for (const it of items) {
      total += 1;
      const id = it.id;
      const attrs = it.attributes || {};
      const rel = it.relationships || {};
      const message = (attrs.message || '').replaceAll('\n', ' ');
      const status = attrs.status || 'unknown';
      const priority = attrs.priority || attrs.severity || 'n/a';
      const created = attrs.datetime_created || attrs.created_at || 'n/a';
      const updated = attrs.datetime_modified || attrs.updated_at || 'n/a';
      const resource = rel.resource?.data?.id || '';
      const language = rel.language?.data?.id || '';
      out.push(`- ${id} status=${status}, priority=${priority}`);
      out.push(`  resource=${resource} language=${language}`);
      out.push(`  created=${created} updated=${updated}`);
      out.push(`  message: ${message}`);
    }
    url = json.links?.next || '';
  }

  out.push('');
  out.push(`- total open issues: ${total}`);
  out.push(`- pages fetched: ${page}`);
  await fs.promises.writeFile(outFile, out.join('\n'), 'utf8');
  process.stdout.write(`Wrote ${outFile} (total=${total}, pages=${page})\n`);
}

if (require.main === module) {
  fetchAllIssues().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}


