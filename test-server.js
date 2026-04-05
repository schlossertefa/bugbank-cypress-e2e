const http = require('http')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const HISTORICO_PATH = path.join(__dirname, 'docs', 'historico.csv')
const PORT = 3333

function salvarHistorico(result) {
  const cabecalho = 'data,hora,tags,status,passou,falhou\n'
  const agora = new Date()
  const data = agora.toLocaleDateString('pt-BR')
  const hora = agora.toLocaleTimeString('pt-BR')
  const linha = `${data},${hora},${result.tags},${result.status},${result.passing},${result.failing}\n`

  if (!fs.existsSync(HISTORICO_PATH)) {
    fs.writeFileSync(HISTORICO_PATH, cabecalho)
  }
  fs.appendFileSync(HISTORICO_PATH, linha)
  console.log(`Histórico salvo em docs/historico.csv`)
}

function extrairCenarios(stdout) {
  const cenarios = []
  const linhas = stdout.split('\n')

  for (const linha of linhas) {
    const passou = linha.match(/^\s+✓\s+(.+?)\s+\((\d+)ms\)/)
    const falhou = linha.match(/^\s+\d+\)\s+(.+)/)

    if (passou) {
      cenarios.push({ nome: passou[1].trim(), status: 'passou', duracao: parseInt(passou[2]) })
    } else if (falhou && !linha.includes('passing') && !linha.includes('failing') && !linha.includes('—') && !linha.includes('--')) {
      cenarios.push({ nome: falhou[1].trim(), status: 'falhou', duracao: 0 })
    }
  }

  return cenarios
}

function extrairDuracao(stdout) {
  const match = stdout.match(/Duration:\s+(.+)/)
  return match ? match[1].trim() : '-'
}

function mapearModulo(nome) {
  const n = nome.toLowerCase()
  if (n.includes('login') || n.includes('credencial') || n.includes('acesso') || n.includes('logout')) return 'Login & Auth'
  if (n.includes('cadastro') || n.includes('senha') || n.includes('email') || n.includes('conta criada') || n.includes('nome')) return 'Cadastro'
  if (n.includes('transferência') || n.includes('transferencia') || n.includes('saldo') || n.includes('valor')) return 'Transferência'
  if (n.includes('extrato') || n.includes('transação') || n.includes('transacao')) return 'Extrato'
  return 'Geral'
}

function agruparPorModulo(cenarios) {
  const modulos = {}
  const icones = {
    'Login & Auth': '🔐',
    'Cadastro': '📝',
    'Transferência': '💸',
    'Extrato': '📊',
    'Geral': '🧪'
  }

  for (const c of cenarios) {
    const modulo = mapearModulo(c.nome)
    if (!modulos[modulo]) modulos[modulo] = { passou: 0, falhou: 0, icone: icones[modulo] || '🧪' }
    if (c.status === 'passou') modulos[modulo].passou++
    else modulos[modulo].falhou++
  }

  return modulos
}

function gerarHTML(result) {
  const agora = new Date()
  const dataHora = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR')
  const total = result.passing + result.failing
  const taxa = total > 0 ? ((result.passing / total) * 100).toFixed(1) : '0'
  const statusClass = result.status === 'PASSOU' ? 'status-passed' : 'status-failed'
  const statusText = result.status === 'PASSOU' ? 'PASSOU' : 'FALHOU'
  const statusColor = result.status === 'PASSOU' ? '#22c55e' : '#ef4444'

  const modulos = agruparPorModulo(result.cenarios)
  const modulosHTML = Object.entries(modulos).map(([nome, m]) => {
    const iconClass = m.falhou > 0 ? 'fail' : 'ok'
    return `
      <div class="module-card">
        <div class="module-icon ${iconClass}">${m.icone}</div>
        <div class="module-info">
          <div class="module-name">${nome}</div>
          <div class="module-count"><span class="c-pass">${m.passou} ✓</span> &nbsp;|&nbsp; <span class="c-fail">${m.falhou} ✗</span></div>
        </div>
      </div>`
  }).join('')

  const falhasHTML = result.cenarios.filter(c => c.status === 'falhou').map(c => `
    <div class="test-item failed">
      <div class="test-icon">❌</div>
      <div class="test-info">
        <div class="test-name">${c.nome}</div>
        <div class="test-meta">${mapearModulo(c.nome)}</div>
      </div>
    </div>`).join('') || '<p style="color:#94a3b8;font-size:13px;padding:12px 0">Nenhuma falha 🎉</p>'

  const passouHTML = result.cenarios.filter(c => c.status === 'passou').slice(0, 5).map(c => `
    <div class="test-item passed">
      <div class="test-icon">✅</div>
      <div class="test-info">
        <div class="test-name">${c.nome}</div>
        <div class="test-meta">${mapearModulo(c.nome)}</div>
      </div>
      <div class="test-duration">${c.duracao > 0 ? (c.duracao / 1000).toFixed(1) + 's' : ''}</div>
    </div>`).join('')

  const extras = result.passing > 5
    ? `<div style="text-align:center;padding:10px;color:#94a3b8;font-size:12px">+ ${result.passing - 5} testes passaram com sucesso</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter','Segoe UI',Arial,sans-serif;background:#f1f5f9;color:#1e293b;padding:32px 16px}
    .wrapper{max-width:680px;margin:0 auto}
    .header{border-radius:16px 16px 0 0;padding:36px 40px;background:linear-gradient(135deg,#ffffff 0%,#f8fafc 100%);border-bottom:3px solid ${statusColor};position:relative;overflow:hidden;box-shadow:0 1px 0 #e2e8f0}
    .header-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
    .brand{font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#94a3b8}
    .status-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:999px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:${result.status === 'PASSOU' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'};color:${statusColor};border:1px solid ${statusColor}}
    .status-dot{width:8px;height:8px;border-radius:50%;background:${statusColor}}
    .header-title{font-size:26px;font-weight:800;color:#0f172a;margin-bottom:6px}
    .header-subtitle{font-size:13px;color:#94a3b8}
    .body{background:#f8fafc;padding:32px 40px}
    .stats-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:32px}
    .stat-card{background:#ffffff;border-radius:12px;padding:20px;text-align:center;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,0.05)}
    .stat-card.highlight-pass{border-color:rgba(34,197,94,0.4);background:rgba(34,197,94,0.04)}
    .stat-card.highlight-fail{border-color:rgba(239,68,68,0.4);background:rgba(239,68,68,0.04)}
    .stat-number{font-size:36px;font-weight:800;line-height:1;margin-bottom:6px}
    .stat-number.total{color:#64748b}.stat-number.pass{color:#22c55e}.stat-number.fail{color:#ef4444}
    .stat-label{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8}
    .progress-section{margin-bottom:32px}
    .progress-header{display:flex;justify-content:space-between;font-size:12px;color:#94a3b8;margin-bottom:8px}
    .progress-bar{height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden}
    .progress-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#22c55e 0%,#16a34a 100%);width:${taxa}%}
    .section-title{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;margin-bottom:12px;display:flex;align-items:center;gap:8px}
    .section-title::after{content:'';flex:1;height:1px;background:#e2e8f0}
    .modules-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:32px}
    .module-card{background:#ffffff;border-radius:10px;padding:14px 16px;border:1px solid #e2e8f0;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
    .module-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
    .module-icon.ok{background:rgba(34,197,94,0.12)}.module-icon.fail{background:rgba(239,68,68,0.12)}
    .module-name{font-size:13px;font-weight:600;color:#1e293b;margin-bottom:2px}
    .module-count{font-size:11px;color:#94a3b8}.c-pass{color:#22c55e;font-weight:600}.c-fail{color:#ef4444;font-weight:600}
    .test-list{margin-bottom:28px}
    .test-item{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:8px;margin-bottom:6px;background:#ffffff;border:1px solid #e2e8f0;box-shadow:0 1px 2px rgba(0,0,0,0.04)}
    .test-item.passed{border-left:3px solid #22c55e}.test-item.failed{border-left:3px solid #ef4444;background:#fff8f8}
    .test-icon{font-size:14px;margin-top:1px;flex-shrink:0}
    .test-info{flex:1;min-width:0}
    .test-name{font-size:13px;font-weight:500;color:#334155;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .test-meta{font-size:11px;color:#94a3b8}
    .test-duration{font-size:11px;color:#94a3b8;flex-shrink:0;align-self:center}
    .meta-section{background:#ffffff;border-radius:12px;padding:20px;border:1px solid #e2e8f0;margin-bottom:28px;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
    .meta-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9}
    .meta-row:last-child{border-bottom:none}
    .meta-key{font-size:12px;color:#94a3b8;display:flex;align-items:center;gap:8px}
    .meta-val{font-size:12px;font-weight:600;color:#475569}
    .tag-pill{display:inline-block;background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.3);border-radius:99px;padding:2px 10px;font-size:11px;font-weight:600}
    .footer{background:#f1f5f9;border-radius:0 0 16px 16px;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center}
    .footer p{font-size:11px;color:#cbd5e1}
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <div class="header-top">
      <span class="brand">🧪 BugBank · QA Automatizado</span>
      <span class="status-badge"><span class="status-dot"></span>${statusText}</span>
    </div>
    <div class="header-title">Relatório de Testes Cypress</div>
    <div class="header-subtitle">Execução automática via pipeline · ${dataHora}</div>
  </div>
  <div class="body">
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-number total">${total}</div><div class="stat-label">Total</div></div>
      <div class="stat-card highlight-pass"><div class="stat-number pass">${result.passing}</div><div class="stat-label">Passaram</div></div>
      <div class="stat-card highlight-fail"><div class="stat-number fail">${result.failing}</div><div class="stat-label">Falharam</div></div>
    </div>
    <div class="progress-section">
      <div class="progress-header"><span>Taxa de sucesso</span><span>${taxa}%</span></div>
      <div class="progress-bar"><div class="progress-fill"></div></div>
    </div>
    <div class="section-title">Módulos Testados</div>
    <div class="modules-grid">${modulosHTML}</div>
    <div class="section-title">❌ Testes que Falharam</div>
    <div class="test-list">${falhasHTML}</div>
    <div class="section-title">✅ Testes que Passaram</div>
    <div class="test-list">${passouHTML}${extras}</div>
    <div class="section-title">Detalhes da Execução</div>
    <div class="meta-section">
      <div class="meta-row"><span class="meta-key">🏷️ Tag</span><span class="tag-pill">${result.tags}</span></div>
      <div class="meta-row"><span class="meta-key">📅 Data e Hora</span><span class="meta-val">${dataHora}</span></div>
      <div class="meta-row"><span class="meta-key">⏱️ Duração Total</span><span class="meta-val">${result.duracao}</span></div>
      <div class="meta-row"><span class="meta-key">🔢 Código de Saída</span><span class="meta-val" style="color:${statusColor}">${result.exitCode} (${result.status.toLowerCase()})</span></div>
    </div>
  </div>
  <div class="footer"><p>Gerado automaticamente pelo Bugbank QA Pipeline · Este é um email automático, não responda.</p></div>
</div>
</body>
</html>`
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/run-tests') {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', () => {
    let tags = '@smoke'
    try {
      const parsed = JSON.parse(body)
      if (parsed.tags) tags = parsed.tags
    } catch (_) {}

    console.log(`Rodando testes com tag: ${tags}`)

    exec(`npx cypress run --env tags=${tags}`, { cwd: __dirname, maxBuffer: 1024 * 1024 * 10 }, (error, stdout) => {
      const passing = parseInt((stdout.match(/(\d+) passing/) || [])[1] || '0')
      const failing = parseInt((stdout.match(/(\d+) failing/) || [])[1] || '0')
      const cenarios = extrairCenarios(stdout)
      const duracao = extrairDuracao(stdout)

      const result = {
        status: error ? 'FALHOU' : 'PASSOU',
        exitCode: error ? (error.code || 1) : 0,
        passing,
        failing,
        tags,
        duracao,
        cenarios,
        html: ''
      }

      result.html = gerarHTML(result)

      console.log(`Resultado: ${result.status} | ${passing} passou | ${failing} falhou`)
      salvarHistorico(result)

      const response = {
        status: result.status,
        exitCode: result.exitCode,
        passing: result.passing,
        failing: result.failing,
        tags: result.tags,
        duracao: result.duracao,
        html: result.html
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(response))
    })
  })
})

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
  console.log('Aguardando requisições do n8n...')
})
