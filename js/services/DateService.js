class DateService {
    formatarDataBRParaInput(dataStr) {
        if (!dataStr) return ''
        try {
            const d = new Date(dataStr.replace('Z',''))
            if (isNaN(d.getTime())) return ''
            const dd = String(d.getDate()).padStart(2,'0')
            const mm = String(d.getMonth()+1).padStart(2,'0')
            const yyyy = d.getFullYear()
            return `${dd}/${mm}/${yyyy}`
        } catch {
            return ''
        }
    }
    formatarDataHoraBRParaInput(dataStr) {
        if (!dataStr) return ''
        try {
            const d = new Date(dataStr.replace('Z',''))
            if (isNaN(d.getTime())) return ''
            const dd = String(d.getDate()).padStart(2,'0')
            const mm = String(d.getMonth()+1).padStart(2,'0')
            const yyyy = d.getFullYear()
            const HH = String(d.getHours()).padStart(2,'0')
            const MM = String(d.getMinutes()).padStart(2,'0')
            return `${dd}/${mm}/${yyyy} ${HH}:${MM}`
        } catch {
            return ''
        }
    }
    parseDataBRParaISO(dataBR) {
        if (!dataBR) return null
        const m = dataBR.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
        if (!m) return null
        const [_, dd, mm, yyyy] = m
        return `${yyyy}-${mm}-${dd}`
    }
    parseDataHoraBRParaISO(dataHoraBR) {
        if (!dataHoraBR) return null
        const m = dataHoraBR.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/)
        if (!m) return null
        const [_, dd, mm, yyyy, HH, MM] = m
        return `${yyyy}-${mm}-${dd}T${HH}:${MM}`
    }
    formatarData(dataStr) {
        if (!dataStr) return '-'
        try {
            const data = new Date(dataStr.replace('Z', ''))
            if (isNaN(data.getTime())) return '-'
            return data.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        } catch (e) {
            console.error('Erro ao formatar data:', e)
            return '-'
        }
    }
    formatarDataHora(dataStr) {
        if (!dataStr) return '-'
        try {
            const data = new Date(dataStr.replace('Z', ''))
            if (isNaN(data.getTime())) return '-'
            return data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch (e) {
            console.error('Erro ao formatar data:', e)
            return '-'
        }
    }
    formatarDataLocal(dataStr) {
        if (!dataStr) return ''
        try {
            const data = new Date(dataStr.replace('Z', ''))
            if (isNaN(data.getTime())) return ''
            const year = data.getFullYear()
            const month = String(data.getMonth() + 1).padStart(2, '0')
            const day = String(data.getDate()).padStart(2, '0')
            const hours = String(data.getHours()).padStart(2, '0')
            const minutes = String(data.getMinutes()).padStart(2, '0')
            return `${year}-${month}-${day}T${hours}:${minutes}`
        } catch (e) {
            console.error('Erro ao formatar data:', e)
            return ''
        }
    }
    formatarDataParaInput(dataStr) {
        if (!dataStr) return ''
        try {
            const data = new Date(dataStr.replace('Z', ''))
            if (isNaN(data.getTime())) return ''
            const year = data.getFullYear()
            const month = String(data.getMonth() + 1).padStart(2, '0')
            const day = String(data.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        } catch (e) {
            console.error('Erro ao formatar data:', e)
            return ''
        }
    }
    // Retorna o horário atual em Brasília (America/Sao_Paulo) no formato ISO com offset -03:00
    agoraISOBrasilia() {
        const fmt = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        })
        const parts = fmt.formatToParts(new Date())
        const get = (type) => parts.find(p => p.type === type)?.value || '00'
        const yyyy = get('year')
        const mm = get('month')
        const dd = get('day')
        const HH = get('hour')
        const MM = get('minute')
        const SS = get('second')
        // Brasil não utiliza horário de verão atualmente; offset padrão -03:00
        const offset = '-03:00'
        return `${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}${offset}`
    }
}
window.DateService = DateService
