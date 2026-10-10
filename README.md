# Molécula — Gamificação de Palestras de Química

Front-end para incentivar e acompanhar a presença de alunos no ciclo de palestras de Química. A aplicação transforma frequência em um leaderboard e oferece uma área executiva para atualização dos dados e da programação.

## Páginas

- **Home** — destaca a próxima palestra, o Top 5 de presença e o briefing da apresentação.
- **Leaderboard** — mostra a classificação completa, quantidade de presenças e percentual de participação de cada aluno.
- **Agenda** — apresenta as palestras já publicadas para o ciclo.
- **Executivo** — central para importar bases de presença, cadastrar novas palestras e acompanhar indicadores da turma.

## Como executar

O projeto é estático e não requer instalação de dependências.

1. Abra o arquivo `index.html` no navegador.
2. Navegue pelas abas no cabeçalho.
3. Use a aba **Executivo** para atualizar os dados e cadastrar palestras.

## Importação de presença

Na aba **Executivo**, envie os dois arquivos abaixo para consolidar o leaderboard:

| Arquivo | Colunas esperadas |
| --- | --- |
| Base acumulada | `Aluno`, `Presenças`, `Total de palestras` |
| Última palestra | `Aluno`, `Presente` (`Sim` ou `Não`) |

Também é possível usar uma coluna de e-mail para identificar os alunos. A importação aceita arquivos `.xlsx`, `.xls` e `.csv`; após o processamento, a classificação, os percentuais e os indicadores são recalculados no navegador.

## Cadastro de palestra

Em **Executivo → Nova palestra**, informe tema, palestrante, data, horário e local. Ao publicar, o encontro aparece na aba **Agenda** durante a sessão atual do navegador.

## Estrutura

```text
.
├── index.html   # Estrutura e conteúdo das páginas
├── style.css    # Identidade visual e responsividade
└── app.js       # Dados de exemplo, importação e interações
```

## Tecnologias

- HTML, CSS e JavaScript puro
- [SheetJS](https://sheetjs.com/) para leitura de arquivos Excel no navegador
