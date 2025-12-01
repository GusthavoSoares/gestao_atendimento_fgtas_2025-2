class FiltroRender {
    renderizarSelectTipoSolicitante(idSelect, tipos, valorAtual = 'todos') {
        const select = document.getElementById(idSelect)
        if (!select) return
        select.innerHTML = '<option value="todos">Todos</option>'
        tipos.forEach(tipo => {
            const option = document.createElement('option')
            option.value = tipo.tipo
            option.textContent = tipo.tipo
            if (tipo.tipo === valorAtual) {
                option.selected = true
            }
            select.appendChild(option)
        })
    }
    renderizarSelectTipo(idSelect, tipos, valorAtual = 'todos') {
        const select = document.getElementById(idSelect)
        if (!select) return
        select.innerHTML = '<option value="todos">Todos</option>'
        tipos.forEach(tipo => {
            const option = document.createElement('option')
            option.value = tipo.id
            option.textContent = tipo.tipo
            if (tipo.id == valorAtual) {
                option.selected = true
            }
            select.appendChild(option)
        })
    }
    renderizarSelectStatus(idSelect, statuses, valorAtual = 'todos') {
        const select = document.getElementById(idSelect)
        if (!select) return
        const unicos = Array.from(new Set((statuses || [])
            .map(s => (s || '').toString().trim())
            .filter(s => s)))
        select.innerHTML = '<option value="todos">Todos</option>'
        unicos.forEach(st => {
            const option = document.createElement('option')
            option.value = st
            option.textContent = st
            if (st === valorAtual) option.selected = true
            select.appendChild(option)
        })
    }
}
