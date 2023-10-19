# AI Builder Embed


## Como Começar

- Antes de tudo, adicionar o repositório original como upstream (Este comando deve ser utilizado somente na primeira vez por quem for fazer a atualização)

```bash
git remote add upstream https://github.com/FlowiseAI/FlowiseChatEmbed
```


- A partir daqui, as branchs do AI Buildar já são privadas

## Depois de configurado o ambiente anterior, certifique-se de estar na branch principal
```bash
git checkout main
```

## Atualize o fork
```bash
git pull upstream main
```

## Envie as alterações para o AI Builder
```bash
git push private main
```

- O termo upstream é utilizado para referenciar o repositório original do qual você forkou o projeto. Se você forkou outro projeto no futuro, você precisará adicionar um novo controle remoto chamado upstream para esse novo projeto.
