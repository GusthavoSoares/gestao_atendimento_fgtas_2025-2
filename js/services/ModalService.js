class ModalService {
    constructor(rootId = 'modals-root') {
        this.root = document.getElementById(rootId) || document.body
        this._timeouts = new Map()
    }

    injectHTML(html) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = html.trim()
        // Injetar todos os elementos filhos, não apenas o primeiro
        while (wrapper.firstElementChild) {
            this.root.appendChild(wrapper.firstElementChild)
        }
    }

    ensureElement(id, htmlGenerator) {
        const existing = document.getElementById(id)
        if (existing) return existing
        if (typeof htmlGenerator === 'function') {
            this.injectHTML(htmlGenerator())
            return document.getElementById(id)
        }
        return null
    }

    ensureMultipleElements(ids, htmlGenerator) {
        // Verifica se TODOS os elementos existem
        const allExist = ids.every(id => document.getElementById(id))
        if (allExist) return true

        // Se algum não existe, injeta o HTML (que deve conter todos os elementos)
        if (typeof htmlGenerator === 'function') {
            this.injectHTML(htmlGenerator())
            // Verifica se todos foram criados com sucesso
            return ids.every(id => document.getElementById(id))
        }
        return false
    }

    static normalizeCallbacks(callbacks) {
        if (typeof callbacks === 'function') {
            return { onSuccess: callbacks, onError: null }
        }
        if (callbacks && typeof callbacks === 'object') {
            return {
                onSuccess: typeof callbacks.onSuccess === 'function' ? callbacks.onSuccess : null,
                onError: typeof callbacks.onError === 'function' ? callbacks.onError : null
            }
        }
        return { onSuccess: null, onError: null }
    }

    static mergeCallbacks(primary, fallback) {
        const current = ModalService.normalizeCallbacks(fallback)
        const incoming = ModalService.normalizeCallbacks(primary)
        return {
            onSuccess: incoming.onSuccess || current.onSuccess || null,
            onError: incoming.onError || current.onError || null
        }
    }

    createBootstrapModal(id) {
        const el = document.getElementById(id)
        if (!el) {
            console.error(`ModalService: Elemento com id '${id}' não encontrado`)
            return null
        }
        if (typeof bootstrap === 'undefined' || !bootstrap.Modal) {
            console.error('ModalService: Bootstrap Modal não está carregado')
            return null
        }
        try {
            const existingInstance = bootstrap.Modal.getInstance(el)
            if (existingInstance) {
                return existingInstance
            }

            return new bootstrap.Modal(el, {
                backdrop: true,
                keyboard: true,
                focus: true
            })
        } catch (error) {
            console.error(`ModalService: Erro ao criar modal '${id}':`, error)
            return null
        }
    } showMessage(messageElementId, texto, tipo = 'success', autoClearMs = 1500) {
        const el = document.getElementById(messageElementId)
        if (!el) return
        el.className = `alert alert-${tipo}`
        el.textContent = texto
        if (this._timeouts.has(messageElementId)) {
            clearTimeout(this._timeouts.get(messageElementId))
        }
        const t = setTimeout(() => {
            this.clearMessage(messageElementId)
        }, autoClearMs)
        this._timeouts.set(messageElementId, t)
    }

    clearMessage(messageElementId) {
        const el = document.getElementById(messageElementId)
        if (!el) return
        el.className = 'alert d-none'
        el.textContent = ''
        if (this._timeouts.has(messageElementId)) {
            clearTimeout(this._timeouts.get(messageElementId))
            this._timeouts.delete(messageElementId)
        }
    }
}

window.ModalService = ModalService

// Helpers para normalizar callbacks em modais
ModalService.normalizeCallbacks = function (cb) {
    if (!cb) return { onSuccess: null, onError: null }
    if (typeof cb === 'function') return { onSuccess: cb, onError: null }
    return {
        onSuccess: typeof cb.onSuccess === 'function' ? cb.onSuccess : null,
        onError: typeof cb.onError === 'function' ? cb.onError : null
    }
}

ModalService.mergeCallbacks = function (a, b) {
    const ca = ModalService.normalizeCallbacks(a)
    const cb = ModalService.normalizeCallbacks(b)
    return {
        onSuccess: ca.onSuccess || cb.onSuccess || null,
        onError: ca.onError || cb.onError || null
    }
}
