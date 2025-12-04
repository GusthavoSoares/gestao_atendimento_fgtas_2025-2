class UsuarioRender {
    constructor(dateService) {
        this.dateService = dateService
        this.usuarios = []
    }
    getModalTemplates() {
        return `
                <div class="modal fade modal-blur" id="modalCriarUsuario" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title"><i class="fas fa-user-plus"></i> Novo Usuário</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div id="modalCriarUsuarioMensagem" class="alert d-none" role="alert"></div>
                                <form id="formCriarUsuario">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label">Nome</label>
                                            <input type="text" id="nomeCriar" class="form-control" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Email</label>
                                            <input type="email" id="emailCriar" class="form-control" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Tipo de Usuário</label>
                                            <select id="tipoUsuarioCriar" class="form-select" required>
                                                <option value="">Selecione...</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Status</label>
                                            <select id="statusCriar" class="form-select" required disabled>
                                                <option value="Ativo" selected>Ativo</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">CPF</label>
                                            <input type="text" id="cpfCriar" class="form-control" maxlength="14" placeholder="000.000.000-00">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Data de Nascimento</label>
                                            <input type="text" id="dataNascimentoCriar" class="form-control" maxlength="10" placeholder="dd/mm/aaaa">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Telefone</label>
                                            <input type="text" id="telefoneCriar" class="form-control" maxlength="15" placeholder="(00) 00000-0000">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">CEP</label>
                                            <input type="text" id="cepCriar" class="form-control" maxlength="9" placeholder="00000-000">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label">Endereço</label>
                                            <input type="text" id="enderecoCriar" class="form-control" required>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label">Senha</label>
                                            <div class="input-group">
                                                <input type="password" id="senhaCriar" class="form-control" required placeholder="Digite a senha do usuário">
                                                <button type="button" class="btn btn-outline-secondary" tabindex="-1" aria-label="Mostrar/ocultar senha" onclick="togglePasswordVisibility('senhaCriar', this)">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" id="btnCriarUsuario" class="btn btn-primary"><i class="fas fa-save"></i> Criar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="modalEditarUsuario" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title"><i class="fas fa-user-edit"></i> Editar Usuário</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div id="modalEditarUsuarioMensagem" class="alert d-none" role="alert"></div>
                                <form id="formEditarUsuario">
                                    <input type="hidden" id="usuarioIdEdit">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label">Nome</label>
                                            <input type="text" id="nomeEdit" class="form-control" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Email</label>
                                            <input type="email" id="emailEdit" class="form-control" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Tipo de Usuário</label>
                                            <select id="tipoUsuarioEdit" class="form-select" required>
                                                <option value="">Selecione...</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Status</label>
                                            <select id="statusEdit" class="form-select" required>
                                                <option value="Ativo">Ativo</option>
                                                <option value="Inativo">Inativo</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">CPF</label>
                                            <input type="text" id="cpfEdit" class="form-control" maxlength="14" placeholder="000.000.000-00">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Data de Nascimento</label>
                                            <input type="text" id="dataNascimentoEdit" class="form-control" maxlength="10" placeholder="dd/mm/aaaa">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">Telefone</label>
                                            <input type="text" id="telefoneEdit" class="form-control" maxlength="15" placeholder="(00) 00000-0000">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label">CEP</label>
                                            <input type="text" id="cepEdit" class="form-control" maxlength="9" placeholder="00000-000">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label">Endereço</label>
                                            <input type="text" id="enderecoEdit" class="form-control" required>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label">Nova Senha (opcional)</label>
                                            <div class="input-group">
                                                <input type="password" id="senhaEdit" class="form-control" placeholder="Deixe em branco para manter a atual">
                                                <button type="button" class="btn btn-outline-secondary" tabindex="-1" aria-label="Mostrar/ocultar senha" onclick="togglePasswordVisibility('senhaEdit', this)">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" id="btnSalvarUsuario" class="btn btn-primary"><i class="fas fa-save"></i> Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>`
    }
    renderizarTabela(usuarios, onEditar, onDeletar, onDeletarPermanente) {
        this.usuarios = usuarios
        const tbody = document.querySelector('#tabelaUsuarios tbody')
        tbody.innerHTML = ''
        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Nenhum usuário encontrado</td></tr>'
            return
        }
        usuarios.forEach(usuario => {
            const linha = document.createElement('tr')
            const ehAdmin = PermissaoAdmin.ehAdmin()
            const botaoDelete = ehAdmin ? `
                    <button class="btn btn-sm btn-danger" data-id="${usuario.id}" data-action="deletarpermanente" title="Excluir permanentemente" aria-label="Excluir permanentemente">
                        <i class="fas fa-trash"></i>
                    </button>` : ''
            linha.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.tipo_usuario || '-'}</td>
                <td>
                    <span class="badge ${this.getCorStatus(usuario.status)}">
                        ${usuario.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" data-id="${usuario.id}" data-action="editar" title="Editar" aria-label="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-${usuario.status === 'Ativo' ? 'danger' : 'success'} me-2" data-id="${usuario.id}" data-action="status" data-status="${usuario.status}" title="${usuario.status === 'Ativo' ? 'Desativar' : 'Ativar'}" aria-label="${usuario.status === 'Ativo' ? 'Desativar' : 'Ativar'}">
                        <i class="fas fa-${usuario.status === 'Ativo' ? 'ban' : 'check'}"></i>
                    </button>
                    ${botaoDelete}
                </td>
            `
            tbody.appendChild(linha)
        })
        tbody.querySelectorAll('[data-action="editar"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id')
                if (onEditar) onEditar(parseInt(id))
            })
        })
        tbody.querySelectorAll('[data-action="status"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id')
                const status = e.currentTarget.getAttribute('data-status')
                if (onDeletar) onDeletar(parseInt(id), status)
            })
        })
        tbody.querySelectorAll('[data-action="deletarpermanente"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id')
                if (onDeletarPermanente) onDeletarPermanente(parseInt(id))
            })
        })
    }
    getCorStatus(status) {
        return status === 'Ativo' ? 'bg-success' : 'bg-secondary'
    }
}
window.UsuarioRender = UsuarioRender
