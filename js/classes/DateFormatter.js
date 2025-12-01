class DateFormatter {
    static configurarInputsData() {
        document.querySelectorAll('input[type="date"]').forEach(input => {
            this.configurarInputDate(input);
        });
        document.querySelectorAll('input[type="datetime-local"]').forEach(input => {
            this.configurarInputDatetime(input);
        });
    }
    static configurarInputDate(input) {
        input.addEventListener('blur', function() {
            if (this.value) {
                const data = new Date(this.value + 'T00:00:00');
                if (!isNaN(data.getTime())) {
                    this.setAttribute('data-value', this.value);
                }
            }
        });
        input.addEventListener('focus', function() {
            if (this.getAttribute('data-value')) {
                this.value = this.getAttribute('data-value');
            }
        });
        if (input.value) {
            const data = new Date(input.value + 'T00:00:00');
            if (!isNaN(data.getTime())) {
                input.setAttribute('data-value', input.value);
            }
        }
    }
    static configurarInputDatetime(input) {
        input.addEventListener('blur', function() {
            if (this.value) {
                const data = new Date(this.value);
                if (!isNaN(data.getTime())) {
                    this.setAttribute('data-value', this.value);
                }
            }
        });
        input.addEventListener('focus', function() {
            if (this.getAttribute('data-value')) {
                this.value = this.getAttribute('data-value');
            }
        });
        if (input.value) {
            const data = new Date(input.value);
            if (!isNaN(data.getTime())) {
                input.setAttribute('data-value', input.value);
            }
        }
    }
    static paraFormatoBrasileiro(dataISO) {
        if (!dataISO) return '';
        const [ano, mes, dia] = dataISO.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    static paraFormatoISO(dataBR) {
        if (!dataBR) return '';
        const [dia, mes, ano] = dataBR.split('/');
        return `${ano}-${mes}-${dia}`;
    }
    static datetimeParaFormatoBrasileiro(datetimeISO) {
        if (!datetimeISO) return '';
        const data = new Date(datetimeISO);
        if (isNaN(data.getTime())) return '';
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    }
    static datetimeParaFormatoISO(datetimeBR) {
        if (!datetimeBR) return '';
        const [dataParte, horaParte] = datetimeBR.split(' ');
        const [dia, mes, ano] = dataParte.split('/');
        const [hora, minuto] = horaParte.split(':');
        return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
    }
    static formatarData(data) {
        if (!(data instanceof Date) || isNaN(data.getTime())) return '';
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }
    static formatarDataHora(data) {
        if (!(data instanceof Date) || isNaN(data.getTime())) return '';
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    }
}
