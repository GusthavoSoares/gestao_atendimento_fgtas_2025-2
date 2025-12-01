class HttpService {
    constructor(baseUrl) {
        this.API_BASE_URL = baseUrl || 'http://localhost:8001'
    }
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        }
        if (includeAuth) {
            const token = localStorage.getItem('token')
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
        }
        return headers
    }
    async get(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(options.auth !== false),
                ...options
            })
            return await this.handleResponse(response)
        } catch (error) {
            throw new Error(error.message || 'Erro na requisição GET')
        }
    }
    async post(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(options.auth !== false),
                body: JSON.stringify(data),
                ...options
            })
            return await this.handleResponse(response)
        } catch (error) {
            throw new Error(error.message || 'Erro na requisição POST')
        }
    }
    async put(endpoint, data, options = {}) {
        try {
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(options.auth !== false),
                body: JSON.stringify(data),
                ...options
            })
            return await this.handleResponse(response)
        } catch (error) {
            throw new Error(error.message || 'Erro na requisição PUT')
        }
    }
    async delete(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(options.auth !== false),
                ...options
            })
            return await this.handleResponse(response)
        } catch (error) {
            throw new Error(error.message || 'Erro na requisição DELETE')
        }
    }
    async handleResponse(response) {
        const contentType = response.headers.get('content-type')
        const hasJson = contentType && contentType.includes('application/json')
        if (!response.ok) {
            if (hasJson) {
                const errorData = await response.json()
                throw new Error(errorData.erro || errorData.message || `Erro ${response.status}`)
            } else {
                throw new Error(`Erro ${response.status}: ${response.statusText}`)
            }
        }
        if (hasJson) {
            return await response.json()
        }
        return response
    }
}
window.HttpService = HttpService
