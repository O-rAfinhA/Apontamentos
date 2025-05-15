# Sistema de Apontamento de Produção

Este sistema permite o registro e gerenciamento de apontamentos de produção para SMT, incluindo informações sobre clientes, códigos de placa, códigos de ocorrência, tipos de ocorrência, e controle de peças.

## Funcionalidades

- Interface dividida em duas telas: preenchimento de formulário e visualização de apontamentos
- Botão "Iniciar Apontamento" que abre a tela exclusiva para preenchimento de dados
- Botão "Ver Apontamentos" que retorna à tela de visualização dos registros
- Paginação da tabela de apontamentos (10 registros por página)
- Ordenação dos apontamentos por data/hora (mais recentes primeiro)
- Registro automático dos horários de início (ao iniciar) e término (ao salvar)
- Campos de horário ocultos no formulário, mas visíveis na tabela de resultados
- Autocompletar para campos Cliente, Operador e Conferente com valores já utilizados
- Vinculação automática entre código de ocorrência e tipo (PROGRAMADA/IMPREVISTA)
- Armazenamento automático da operação de acordo com o código escolhido
- Edição e exclusão de apontamentos existentes
- Exportação de dados para CSV compatível com Excel
- Armazenamento local dos dados (localStorage)

## Campos do Sistema

O sistema contempla os seguintes campos visíveis no formulário:
- Data (preenchida automaticamente com a data atual)
- Cliente (com autocompletar de valores anteriores)
- Cód (Código da Placa)
- Cód. Ocorrência (1-22, associado à operação)
- Tipo (preenchido automaticamente como PROGRAMADA ou IMPREVISTA)
- Posição Feeder
- ODF
- Quantidade de Peças
- Peças Danificadas
- Tempo/Placa
- Operador (com autocompletar de valores anteriores)
- Conferente (com autocompletar de valores anteriores)
- Observação (opcional)
- Ações (opcional)

Campos ocultos no formulário mas preenchidos automaticamente e visíveis na tabela de resultados:
- Início (preenchido automaticamente com a hora atual ao iniciar apontamento)
- Término (preenchido automaticamente ao salvar o apontamento)

## Códigos de Ocorrência

O sistema inclui os seguintes códigos conforme a planilha "Lista":
- 1: PRODUÇÃO (PROGRAMADA)
- 2: CONFERÊNCIA PRIMEIRA PLACA (PROGRAMADA)
- 3: DESABASTECIAMENTO DE SETUP (PROGRAMADA)
- 4: DIVERGENCIA ALMOX (IMPREVISTA)
- 5: ENGENHARIA (IMPREVISTA)
- 6: ESPERANDO CLIENTE (IMPREVISTA)
- 7: FALTA DE RECURSO OPERACIONAL (IMPREVISTA)
- 8: FALTA DE AR COMPRIMIDO (IMPREVISTA)
- 9: INSERÇÃO MANUAL COMPONENTE (IMPREVISTA)
- 10: LIMPEZA (PROGRAMADA)
- 11: MANUTENÇÃO PREVENTIVA (IMPREVISTA)
- 12: MANUTENÇÃO CORRETIVA (PROGRAMADA)
- 13: MATERIA PRIMA NÃO CONFORME (IMPREVISTA)
- 14: NÃO TRABALHADO (IMPREVISTA)
- 15: PARADA PARA TREINAMENTO (PROGRAMADA)
- 16: QUALIDADE (IMPREVISTA)
- 17: QUEDA DE TENSÃO (IMPREVISTA)
- 18: REFEIÇÃO (PROGRAMADA)
- 19: SEM DEMANDA (IMPREVISTA)
- 20: SETUP (PROGRAMADA)
- 21: TROCA DE FEEDER (PROGRAMADA)
- 22: OUTROS (IMPREVISTA)

## Como usar

1. Abra o arquivo `index.html` em um navegador moderno
2. A tela inicial mostra os apontamentos registrados, com paginação (10 por página)
3. Para registrar um novo apontamento, clique no botão "Iniciar Apontamento"
   - A interface mudará para mostrar apenas o formulário de apontamento
   - A data atual será preenchida automaticamente
   - A hora de início é registrada automaticamente em segundo plano
4. Preencha o formulário com os dados do apontamento:
   - Informe o cliente e código da placa
   - Para campos Cliente, Operador e Conferente, o sistema sugerirá valores previamente utilizados
   - Selecione um código de ocorrência da lista suspensa
   - O campo tipo será preenchido automaticamente como "PROGRAMADA" ou "IMPREVISTA"
   - Complete os demais campos de acordo com as informações da produção
5. Clique em "Salvar Apontamento" para registrar o apontamento
   - A hora atual será registrada automaticamente como horário de término
   - Os valores de Cliente, Operador e Conferente serão salvos para futuras sugestões
   - Após salvar, o sistema retornará à tela de visualização dos apontamentos
6. Na tela de apontamentos:
   - Utilize a paginação para navegar entre os registros
   - Os apontamentos são ordenados com os mais recentes primeiro
   - Você pode editar ou excluir apontamentos existentes usando os botões na coluna "Controles"
   - Para exportar os dados para CSV, clique no botão "Exportar CSV"
7. Para cancelar um apontamento em andamento, clique em "Cancelar"

## Formato do CSV Exportado

O arquivo CSV exportado inclui os seguintes campos, nesta ordem:
1. data
2. cliente
3. codigoPlaca
4. codOcorrencia
5. operacao
6. tipo (PROGRAMADA/IMPREVISTA)
7. posicaoFeeder
8. odf
9. inicio
10. termino
11. qtdPcs
12. pcasDanif
13. tempoPlaca
14. operador
15. conferente
16. observacao
17. acoes

## Tecnologias utilizadas

- HTML5
- CSS3 (com Bootstrap 5)
- JavaScript (Vanilla JS)
- LocalStorage para persistência de dados

## Estrutura de arquivos

- `index.html` - Estrutura HTML principal do sistema
- `styles.css` - Estilos CSS personalizados
- `script.js` - Lógica JavaScript para funcionalidades do sistema

## Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- JavaScript habilitado

## Observações

- Os dados são armazenados localmente no navegador (localStorage)
- A exportação CSV permite backup dos dados e integração com Excel
- Os códigos de ocorrência, operações e tipos são baseados exatamente na planilha "Lista"
- O campo "Operação" não é mais exibido na interface, mas continua sendo armazenado nos dados e exportado no CSV
- Os campos de início e término são ocultos no formulário mas visíveis na tabela de resultados
- Os valores utilizados nos campos Cliente, Operador e Conferente são salvos para facilitar o preenchimento futuro
- A interface é dividida em duas telas distintas para melhor experiência do usuário: formulário e visualização de apontamentos

---

Desenvolvido como parte do sistema de apontamento de produção SMT. 