// A deliberately tiny SQL engine over in-memory JS arrays — enough grammar to
// make the Warehouse feel real without shipping a 1MB WASM database:
//   SELECT * | col[, col…] | COUNT(*)
//   FROM schema.table
//   [WHERE col (=|!=|>|<|>=|<=|LIKE) value [AND …]]
//   [ORDER BY col [ASC|DESC]]
//   [LIMIT n]
// Anything it can't parse throws { hint } — the console falls through to the
// LLM agent for natural language.

export class SqlError extends Error {
  constructor(message, hint) { super(message); this.hint = hint }
}

function parseValue(raw) {
  const s = raw.trim()
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) return s.slice(1, -1)
  const n = Number(s)
  if (!Number.isNaN(n)) return n
  return s
}

function cmp(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  // numeric compare whenever both sides coerce cleanly — keeps the comparator
  // total (mixed columns) and makes WHERE t_ms > '900' behave numerically
  const na = typeof a === 'number' ? a : (a !== '' && !Number.isNaN(Number(a)) ? Number(a) : null)
  const nb = typeof b === 'number' ? b : (b !== '' && !Number.isNaN(Number(b)) ? Number(b) : null)
  if (na !== null && nb !== null) return na - nb
  return String(a).localeCompare(String(b))
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// SQL LIKE → RegExp: % = any run, _ = single char, everything else literal
function likeToRegExp(pat) {
  const src = String(pat).split('%').map((seg) => seg.split('_').map(escapeRe).join('.')).join('.*')
  return new RegExp(`^${src}$`, 'i')
}

// split a WHERE clause on AND at quote-depth 0 only
function splitAnd(s) {
  const parts = []
  let cur = '', quote = null, i = 0
  while (i < s.length) {
    const ch = s[i]
    if (quote) { cur += ch; if (ch === quote) quote = null; i++; continue }
    if (ch === "'" || ch === '"') { quote = ch; cur += ch; i++; continue }
    const m = s.slice(i).match(/^\s+AND\s+/i)
    if (m) { parts.push(cur); cur = ''; i += m[0].length; continue }
    cur += ch; i++
  }
  parts.push(cur)
  return parts.filter((p) => p.trim())
}

export function runQuery(sql, tables) {
  const q = sql.trim().replace(/;+\s*$/, '')
  const m = q.match(
    /^SELECT\s+(.+?)\s+FROM\s+([\w.]+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+([\w]+)(?:\s+(ASC|DESC))?)?(?:\s+LIMIT\s+(\d+))?$/is
  )
  if (!m) {
    throw new SqlError('parse error', "Try: SELECT * FROM visit.events LIMIT 20 — or just ask in plain English and the agent answers.")
  }
  const [, colsRaw, tableName, whereRaw, orderCol, orderDir, limitRaw] = m

  const table = tables[tableName.toLowerCase()]
  if (!table) {
    throw new SqlError(`table not found: ${tableName}`, `Available: ${Object.keys(tables).join(', ')}`)
  }
  let rows = table.rows.slice()

  // WHERE — chain of AND conditions (split respects quoted strings)
  if (whereRaw) {
    const conds = splitAnd(whereRaw).map((c) => {
      const cm = c.match(/^\s*([\w]+)\s*(=|!=|<>|>=|<=|>|<|LIKE)\s*(.+?)\s*$/i)
      if (!cm) throw new SqlError(`bad condition: ${c.trim()}`, "Conditions look like: event = 'section_enter' or t_ms > 5000")
      return { col: cm[1].toLowerCase(), op: cm[2].toUpperCase(), val: parseValue(cm[3]) }
    })
    for (const { col } of conds) {
      if (!table.columns.includes(col)) throw new SqlError(`unknown column: ${col}`, `Columns: ${table.columns.join(', ')}`)
    }
    rows = rows.filter((r) => conds.every(({ col, op, val }) => {
      const v = r[col]
      switch (op) {
        case '=': return String(v) === String(val) || v === val
        case '!=': case '<>': return String(v) !== String(val) && v !== val
        case '>': return cmp(v, val) > 0
        case '<': return cmp(v, val) < 0
        case '>=': return cmp(v, val) >= 0
        case '<=': return cmp(v, val) <= 0
        case 'LIKE': return likeToRegExp(val).test(String(v ?? ''))
        default: return false
      }
    }))
  }

  // ORDER BY
  if (orderCol) {
    const col = orderCol.toLowerCase()
    if (!table.columns.includes(col)) throw new SqlError(`unknown column: ${col}`, `Columns: ${table.columns.join(', ')}`)
    rows.sort((a, b) => cmp(a[col], b[col]))
    if ((orderDir || '').toUpperCase() === 'DESC') rows.reverse()
  }

  // SELECT list — aggregates count PRE-LIMIT rows (standard SQL semantics)
  const colsSpec = colsRaw.trim()
  if (/^COUNT\(\s*\*\s*\)$/i.test(colsSpec)) {
    return { columns: ['count'], rows: [{ count: rows.length }] }
  }

  // LIMIT
  if (limitRaw) rows = rows.slice(0, parseInt(limitRaw, 10))
  if (colsSpec === '*') {
    return { columns: table.columns, rows }
  }
  const cols = colsSpec.split(',').map((c) => c.trim().toLowerCase())
  for (const c of cols) {
    if (!table.columns.includes(c)) throw new SqlError(`unknown column: ${c}`, `Columns: ${table.columns.join(', ')}`)
  }
  return { columns: cols, rows: rows.map((r) => Object.fromEntries(cols.map((c) => [c, r[c]]))) }
}

/** true if the input looks like SQL (vs natural language for the agent) —
 *  requires FROM so English like "Select his best project" goes to the agent */
export function looksLikeSql(input) {
  return /^\s*SELECT\s[\s\S]*\bFROM\b/i.test(input)
}
