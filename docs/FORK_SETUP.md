# Configuração do Fork Personalizado - CwayAssistant

## 🎯 Objetivo
Este é um fork personalizado do repositório `googleworkspace/add-ons-samples` para uso customizado na sua empresa. A configuração permite que você controle manualmente quais updates do repositório original deseja integrar.

## 📡 Configuração de Remotes

### Remotes Configurados

```bash
origin   → https://github.com/hugo-borba/cwayassistant.git (seu fork)
upstream → https://github.com/googleworkspace/add-ons-samples.git (original)
```

**O que significa:**
- `origin`: Seu repositório pessoal - para fazer push de suas mudanças
- `upstream`: Repositório original - de onde você pode puxar updates com cuidado

## 🔄 Workflow de Sincronização Controlada

### 1️⃣ **Verificar Novos Commits no Original**

```bash
# Atualizar informações do upstream sem mergear
git fetch upstream

# Ver o que mudou no original
git log --oneline upstream/main..origin/main
# Mostra commits que você tem e não estão no upstream

git log --oneline origin/main..upstream/main
# Mostra commits novos no upstream que você não tem
```

### 2️⃣ **Avaliar se Commits Interessam**

Você pode ver em detalhes um commit específico:

```bash
# Ver detalhes de um commit
git show <commit-hash>

# Ver arquivo alterado em um commit
git show <commit-hash>:<caminho-do-arquivo>
```

### 3️⃣ **Integrar Commits Específicos (Recomendado)**

**Opção A: Cherry-pick (pegar commits específicos)**
```bash
# Pegar um commit específico do upstream
git cherry-pick <commit-hash>

# Pegar múltiplos commits
git cherry-pick <commit1-hash> <commit2-hash> <commit3-hash>
```

**Opção B: Merge seletivo (se vários commits relacionados)**
```bash
# Mergear uma branch específica do upstream
git merge upstream/<branch-name> --no-ff
```

### 4️⃣ **Resolver Conflitos (se houver)**

Se houver conflitos durante o cherry-pick/merge:

```bash
# Ver conflitos
git status

# Editar os arquivos com conflitos
# Depois:
git add <arquivo-resolvido>

# Continuar o cherry-pick
git cherry-pick --continue

# Ou abortar se decidir não integrar
git cherry-pick --abort
```

### 5️⃣ **Enviar para Seu Fork**

```bash
# Fazer push das mudanças
git push origin main

# Se houver conflitos com seu remote
git push origin main --force-with-lease
```

## 📋 Checklist para Integrar Updates

Antes de integrar um commit do upstream, pergunte-se:

- [ ] O commit é relevante para o projeto customizado?
- [ ] Não vai quebrar funcionalidades existentes?
- [ ] Não conflita com mudanças customizadas?
- [ ] Adiciona valor ao projeto?
- [ ] Está documentado o porquê da integração?

## 🚫 Commits NÃO Recomendados para Integrar

- ❌ Commits que removem/reorganizam estruturas core do ai-knowledge-assistant
- ❌ Commits que adicionam projetos novos não relevantes
- ❌ Commits de documentação do repo original
- ❌ Commits de CI/CD não compatíveis

## 🛡️ Dicas de Segurança

1. **Sempre faça em uma branch temporária primeiro:**
   ```bash
   git checkout -b test-upstream
   git cherry-pick <commit-hash>
   # Testar mudanças
   # Se OK:
   git checkout main
   git merge test-upstream
   ```

2. **Mantenha backup local:**
   ```bash
   git branch backup-main  # Antes de grandes merges
   ```

3. **Documente integrações:**
   ```bash
   git commit --allow-empty -m "chore: integrated upstream commit <hash> - <razão>"
   ```

## 📊 Exemplo Prático

```bash
# 1. Buscar novos commits
git fetch upstream

# 2. Ver o que há de novo
git log --oneline origin/main..upstream/main | head -10

# 3. Avaliar um commit específico
git show abc1234

# 4. Se interessante, integrar
git cherry-pick abc1234

# 5. Testar localmente
npm test

# 6. Se tudo OK, enviar
git push origin main

# 7. Se problema, reverter
git revert abc1234
git push origin main
```

## 🔗 Links Úteis

- [Git Cherry-pick Docs](https://git-scm.com/docs/git-cherry-pick)
- [Git Merge Docs](https://git-scm.com/docs/git-merge)
- [Forking Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow)

## ❓ Dúvidas Comuns

**P: Posso fazer merge automático do upstream?**  
R: Não é recomendado. Use cherry-pick para ter controle total.

**P: Como evitar conflitos?**  
R: Mantenha suas mudanças customizadas em arquivos/pastas separadas quando possível.

**P: E se não quiser um commit?**  
R: Simplesmente não faça o cherry-pick. Ele só é integrado se você escolher.

---

**Último update:** 2026-02-11  
**Criado para:** Projeto personalizado na sua empresa
