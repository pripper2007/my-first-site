# LinkedIn import — staging manifest

Working file for the task of republishing Pedro's LinkedIn posts as standalone
site articles (same mechanism as `/insights/openclaw-prip`: self-contained HTML
in `public/articles/<slug>.html` + iframe route + `insights.json` entry).

Raw images preserved (original LinkedIn numbering) in `./images/raw/`.
Order/date to be derived from each post's LinkedIn activity ID. "Mais recentes por cima."

Status legend: 🟡 text captured, not built · 🟢 built · ❓ open question

---

## P1 — 🟡 "O projeto de IA que mudou o meu jogo: da minha saúde ao futuro da Bemobi"
- type: post (short-form)
- image: raw/2.png (Obsidian vault — graph view + file tree)  ❓confirmar se é a capa
- slug (provisional): projeto-ia-que-mudou-meu-jogo

No post anterior, falei dos dois projetos que fiz aprendendo IA. Um virou distração, este é o outro, o que mudou meu jogo de como usar IA.

Apliquei o mesmo framework à minha saúde e ao futuro da Bemobi. Chama-se base de conhecimento, e é a forma mais concreta que encontrei de acumular contexto real às IAs.

Começo pela limitação que todos que usam IA já sentiram. Você passa horas numa análise com um modelo e, no dia seguinte, em uma nova sessão, é como se nada daquilo tivesse existido. O modelo é treinado uma vez e, a partir dali, não aprende mais nada com você.

Foi aí que esbarrei em um pattern que o Andrej Karpathy (co-fundador da OpenAI e, desde maio, na Anthropic) publicou em abril. Em vez de deixar o modelo redescobrir o assunto do zero a cada pergunta, você mantém uma base viva de arquivos onde ele mesmo escreve resumos, conecta conceitos e mantém tudo cruzado. A cada nova fonte, o conhecimento se acumula em vez de recomeçar. A base cresce com você.

Resolvi aplicar isso primeiro à minha saúde. Comecei pelo ground truth: painéis de sangue, exames de imagem, teste de DNA, medicamentos e suplementos, relatórios de consultas e os dados brutos dos meus wearables, incluindo exercício e sono (Apple Watch, que uso há mais de 10 anos, e Whoop). Inseri tudo aos poucos, e a cada novo dado a IA reavalia o todo e cria novas correlações.

O resultado foi impressionante. A capacidade do modelo virou um superpoder de correlação. Ele conecta assuntos que passam despercebidos e levanta hipóteses que escapam até de excelentes médicos, seja por falta de acesso a todos os dados, seja por não fazer o cruzamento.

Deixei de ir ao médico? Não; a base não substitui ninguém. Ela me faz chegar mais preparado e me dá mais agência sobre a minha saúde. Esse cruzamento já me deu base, no último mês, para questionar e confirmar um erro num parecer de um especialista de primeira linha, de um dos melhores hospitais do mundo. Sem ele, eu provavelmente teria seguido um caminho errado e de risco altíssimo.

E aqui a abordagem sai do pessoal e vira estratégia. O mesmo pattern constrói os cérebros estendidos da Bemobi: bases com dados explícitos (apresentações, planilhas, documentação) e tácitos (transcrições de reuniões, Slack, e-mail), sobre produtos, concorrentes, mercado de pagamentos e operação em tempo real. E, principalmente, cruzamos essas bases, usando IA de forma muito mais contextualizada do que um prompt solto permite.

Esse é um dos patterns mais poderosos para destravar a IA: muda dramaticamente como uma organização decide, mais rápido e melhor.

Montei um playbook com o passo a passo, partindo do gist público do Karpathy e complementado com o que aprendi na prática. Comenta BASE aqui que eu organizo e mando.

E você, já criou alguma base de conhecimento com esse padrão? Para qual domínio?

---

## P2 — 🟡 "Gastei tempo demais no projeto de IA errado. E faria de novo."
- type: post (short-form)
- image: raw/4.png (expectativa vs realidade, ilustração)
- slug (provisional): projeto-ia-errado

Há uns dois meses comecei um projeto de IA que eu achava que levaria duas horas: só queria entender se estava usando bem o LinkedIn.

Terminei com um plugin de Chrome, um banco de dados e uma plataforma de analytics de posts com IA, ponta a ponta. Levou mais de uma dúzia de horas. Furou o escopo. Hoje, sei que foi tempo demais em um tema secundário.

E, ainda assim, faria de novo. Deixa eu explicar.

Tem duas narrativas sobre como um executivo ou colaborador deve incorporar IA no dia a dia.

A primeira: comece por casos de uso pequenos e laterais, de baixo risco, para ganhar repertório e separar o hype da realidade do que os modelos entregam hoje em cada domínio.

A segunda: ataque o estrutural desde o início, com um objetivo que mova o ponteiro, e suba a barra conforme ganha confiança. O resto é distração. Tem mérito, mas traz um desafio próprio: um tema desse tamanho parece inatingível, e isso trava o primeiro passo.

Eu fiquei no meio, e me encantei com os exemplos do primeiro caminho. Trouxeram insights que apliquei na Bemobi.
Mas o encanto tem um custo: a distração do que importa. A minha plataforma de LinkedIn foi exatamente isso.

Aqui vem a parte incômoda. Eu mesmo escrevi um post chamado "O caminho seguro, confortável e ERRADO". Mas aqui o confortável não é o erro. O erro de verdade é não começar, mesmo que você chegue ao que importa só na segunda etapa. Caminho 1, caminho 2 ou híbrido importa menos do que isso.

Já deve estar claro o que penso: a IA não vai substituir você. Quem entende de IA, sim. Ela vai separar quem se alavanca na tecnologia de quem ficou parado. No agregado, é isso que vai definir quais empresas vencem daqui pra frente, e vale para profissionais em qualquer nível.

Hoje, no retrovisor, meu projeto foi distração. Começar nunca foi o problema. Foi não saber a hora de parar. Faltou cortar as perdas mais cedo, em vez de ir fundo na tangente atrás de ganhos cada vez mais marginais.

A tese de experimentar para aprender continua de pé. Só que exige uma disciplina que me faltou: o stop-loss nos temas que não são centrais.

O tempo "perdido" comprou repertório de IA. E repertório, nesse momento, é o ativo que menos quero economizar.

Nos próximos posts vou abrir alguns desses projetos.

O do LinkedIn é o que fugiu do controle. Para mim já virou mais distração que aprendizado, mas o que é distração para uns é central para outros: para times de Marketing, ou quem vive da rede, pode ser muito útil. Passo a bola (e o Git) para quem quiser continuar.

O outro é uma base de conhecimento de saúde. Esse não foi distração nenhuma: é o projeto que me fez levar IA a sério, e rendeu aplicação direta na Bemobi, em dar melhor contexto às IAs.

Qual você quer primeiro: o que fugiu do controle ou o que mudou meu jogo? Me diz nos comentários (LinkedIn ou Saúde).

---

## P3 — 🟡 "Terceirizando o IRPF para um agente de AI: 10x de produtividade (mas só na segunda rodada 🙄)."
- type: post (short-form)
- image: raw/6.png (Rodada 1 vs Rodada 2 — comparativo Claude Code)
- slug (provisional): irpf-agente-ia-10x

No último post, contei que ia delegar 100% do meu IRPF a agentes de IA.

Adianto o spoiler: a primeira rodada deu muito trabalho e ganho marginal. A segunda fez o processo inteiro em 10% do tempo, com mais qualidade. E foi aí que o insight apareceu.

Meu IRPF não é simples. Mais de 50 arquivos de input, informes diversos, DCBE para bens no exterior, stock options, RSUs, JCP, dependentes e alimentandos. Declaração com mais de 25 páginas. Era ambicioso. Talvez ambicioso demais.

O plano macro foi construído de uma vez, razoável, mas com ambiguidades e pontos cegos que custaram caro. A maior: a qualidade da declaração pré-preenchida da Receita é muito ruim, e deveria ter sido explícito desde o início que a fonte da verdade seriam os informes, nunca a pré-preenchida. Como o plano tinha lacunas, o modelo se perdeu e alucinou algumas vezes, em parte pela ambiguidade, em parte pela complexidade do meu caso.

Para piorar, o informe de um grande banco veio com dois erros que tomaram mais de 50% do tempo do projeto. Os cheques de consistência não batiam, e eu refazia o plano achando que o agente tinha calculado errado 😡. Quem descobriu o erro no fim não foi o Claude, foi um humano (obrigado, Rodolfo Sales Guimarães !!). Ainda não nos tornamos irrelevantes ;). Ele usou um contexto histórico que o agente não tinha. Lição: humanos com memória institucional ainda fazem falta.

Por outro lado, os cheques de sanidade que embuti no plano do agente de IA não permitiram que eu submetesse uma declaração errada. Pelo contrário, ficou robusta.

Ferramentas: Claude Code + Codex Computer Use no desktop, Git local para isolar dados sensíveis. Detalhes nos comentários.

A virada veio depois. Sessão longa de debriefing com o agente, lições aprendidas associadas a cada erro. Criamos um plano novo, bem mais robusto.

Teste de fogo: sessão nova do zero, mesmos arquivos, plano novo. Processo inteiro em 10% do tempo, com poucas idas e vindas.

IRPF é um caso ruim para esse tipo de automação. Faz-se uma vez ao ano, e até lá os modelos terão mudado bastante. Mas o que esse experimento mostra não é sobre IRPF. É sobre o que acontece quando você aplica esse conjunto de ferramentas em atividades realmente repetitivas, mesmo que complexas. Aí o potencial é evidente. Quem só usa AI para tarefas pontuais não viu o filme.

Parte da beleza dessas ferramentas é a capacidade de auto-research: o agente melhora com base nos próprios outputs. Foi o que rolou aqui.

Valeu a pena? Sim. Ganhei algum tempo (questionável), descobri erros antigos, e aprendi conceitos que já estou transpondo para outros domínios.

---

## P4 — 🟡 "Dá pra terceirizar o IRPF pra um agente de AI?"
- type: post (short-form)
- image: raw/8.png (Claude Code plan mode — IRPF 2026)
- slug (provisional): irpf-agente-ia-desafio

Não sei. Mas o desafio do fim de semana é descobrir.

A ideia é usar Claude Code (ou Codex com computer use) pra enfrentar a árdua e sofrida tarefa de fazer e revisar meu imposto de renda.

Ainda não tenho clareza da melhor abordagem. Mas algumas hipóteses já estão na mesa do workflow que quero testar:

• extração automática dos informes de rendimento em PDF
• reconciliação com a declaração pré-preenchida da Receita
• validação de evolução de patrimônio vs. entradas menos gastos
• checagem de inconsistências antes da transmissão
• preenchimento automático via Codex Computer Use

Na segunda eu volto e compartilho o que saiu da experiência. Dando certo ou não, divido o aprendizado. Se funcionar bem, compartilho também o caminho das pedras.

Se alguém já testou algo parecido para o IRPF 2026 e teve sucesso, me manda DM ou posta nos comentários. Imagino que não seja o único que pensou nisto.

P.S. Antes que perguntem se não tenho receio de vazamento de dados e privacidade: tenho, mas acho que o benefício aqui é maior que o risco. Os modelos de AI já sabem da minha saúde, do meu trabalho, e meu patrimônio não chega a ser o tema mais sensível.

---

## P5 — 🟡 "O caminho seguro, confortável e ERRADO"
- type: PULSE article (long-form, has byline + date)
- byline: Pedro Ripper — CEO and co-founder of Bemobi, Entrepreneur, Tech Investor, and Board Member
- date: May 19, 2026
- image: raw/10.png (Comfortable/Familiar vs Reinvent/Adapt&Lead — dois executivos)
- source: https://www.linkedin.com/pulse/o-caminho-seguro-confort%C3%A1vel-e-errado-pedro-ripper-awjxe/
- slug (provisional): caminho-seguro-confortavel-errado

Reflexões de uma semana entre o LATAM Tech Forum em Miami e a Brazil Week em Nova York, sobre o ruído, as distorções e as perguntas sobre IA que todo CEO deveria estar se fazendo em 2026.

Há um ano, apesar de IA já estar no centro das minhas atenções, o tema quase não apareceu nas minhas reuniões com investidores em Nova York. Foi tangenciado, no máximo, em uma ou outra pergunta pontual de investidores com maior foco em tecnologia.

Esta semana, ocupou quase metade do tempo de discussão com analistas e gestores que avaliam e investem na Bemobi.

É a observação mais nítida de que o diálogo está mudando entre Wall Street, Faria Lima e o mundo das techs. Mas é também um ambiente com muito ruído a ser filtrado para navegar uma mudança acelerada.

### O mapa de 2025
Há cerca de um ano, eu voltava do Brazil Week em NY depois de ter passado, duas semanas antes, alguns dias em Miami no LATAM Tech Forum. Voltei na época com a impressão de que existiam dois mundos paralelos quando o assunto era IA.

No LTF, mesmo então, IA já era o tema central de quase todas as pautas.

Já na Brazil Week, fora dos painéis dedicados a tech, o tom era outro. A agenda era ancorada em macroeconomia, juros, fiscal, fluxos de capital e leitura de eleição. A IA aparecia, sim, mas como tema secundário, pano de fundo de uma conversa muito mais focada no curto e médio prazo do Brasil.

Esse era o mapa de 2025.

### O mapa de 2026
Volto hoje, em 2026, novamente da Brazil Week em NY, somada à passagem pelo LATAM Tech Forum em Miami duas semanas antes. O mapa mudou.

No LTF, o tema central continua o mesmo, mas as conversas estão mais maduras e profundas. As maiores empresas de tech da LatAm estão tentando transformar de fato seus negócios com IA, inovar e evitar virar o próximo incumbent disruptado pela nova onda de start-ups que se forma agora.

Já na Brazil Week, a IA migrou pela primeira vez da última para a primeira fileira das conversas. E não apenas nos painéis dedicados a tech. Entrou no pitch de empresas que não se descrevem como "tech". Entrou na leitura de gestores macro. Entrou nas reflexões, ainda incipientes, que CEOs de setores tradicionais começam a se fazer.

Em uma das reuniões desta semana, depois de uma apresentação detalhada dos resultados, o primeiro bloco de perguntas não foi sobre números ou projeções. Foi sobre como estávamos pensando IA, que riscos enxergávamos, como estamos nos posicionando e que oportunidades vemos pela frente. Um diálogo dramaticamente diferente do que tínhamos há doze meses.

Ainda há muita dúvida sobre como precificar esse novo mundo. Quem ganha, quem perde, como alocar capital, como identificar moats e diferenciais reais em um ambiente que muda rápido e ainda carrega muita incerteza.

Também foi interessante ver gestores institucionais e individuais avaliando aumentar alocação defensiva em ativos físicos, como real estate e commodities, justamente em um momento de menor clareza sobre como o valor será transferido entre indústrias e players.

### Ruídos e distorções que tiram a atenção do que importa
A comunidade financeira tradicional está começando a precificar, ou ao menos tentar precificar, uma mudança estrutural que a comunidade tech vinha sinalizando há anos. Mas a falta de clareza sobre o tema cria distorções: prêmios potencialmente excessivos de um lado e, do outro, narrativas convenientes que merecem mais ceticismo.

Quatro delas se repetiram com frequência nesta semana:

AI washing. Muitas empresas se reposicionando como "AI-native" sem nada estrutural por trás. Uma variação do "greenwashing" da era ESG, agora com timing de mercado mais agressivo e capital esperando ser convencido.
A demissão atribuída à IA. Tem sido comum que qualquer redução de quadro seja agora justificada como ganho de produtividade via IA. Em muitos casos, o que está sendo corrigido é overhiring de ciclos anteriores, ajuste que seria necessário independentemente da nova tecnologia. A narrativa de produtividade soa melhor para o mercado e para a comunicação interna, mas obscurece o que realmente aconteceu.
A corrida pelo uso indiscriminado de tokens. Não há dúvida de que o uso de IA tem potencial de transformar e reinventar negócios. Mas o volume de tokens consumidos tem sido tratado como proxy grosseiro da maturidade de IA das empresas. É uma métrica útil para acompanhar, mas sozinha diz muito pouco. E pior, gera incentivos perversos com pouca correlação com o valor gerado.
A disrupção universal, "one size fits all". A leitura de que indústrias inteiras estão sendo desmontadas em bloco, como aconteceu no episódio do SaaSpocalipse, em que todo o setor de software sofreu corte brusco de precificação de forma pouco seletiva e pouco profunda, sem avaliação de moats, dados proprietários, efeitos de rede e outras dimensões que serão decisivas neste novo mundo. A disrupção real existe, mas raramente vem em ondas uniformes que possam ser previstas em análises tão simplistas.

Reconhecer essas distorções não diminui a relevância da transformação. Pelo contrário, ajuda a separar sinal de ruído em um momento em que ambos estão se intensificando.

### As perguntas que importam
Para quem opera negócios com elementos digitais, e em breve físicos também, a pergunta deixou de ser "IA é importante?". Essa resposta é óbvia há algum tempo para quase qualquer empresa.

No meu ponto de vista, as perguntas mais úteis, e também mais incômodas, hoje são outras. E variam por indústria.

Se eu fosse começar meu negócio do zero em um mundo com IA forte e disseminada, como faria? O que delegaria para agentes de IA, o que manteria com pessoas e como me organizaria? Algo como um orçamento base zero, mas pensando no redesenho da empresa inteira.

Para a Bemobi, essa pergunta tem sido bem concreta. Se estivéssemos começando hoje, qual seria a participação de agentes autônomos na arquitetura do produto desde o primeiro dia? Como mudaria a composição dos times de engenharia, operações e customer success? Quanto da nossa estrutura atual existe por inércia organizacional e quanto por necessidade real, dado o que a IA hoje nos permite alcançar? E como adaptar uma empresa com mais de mil colaboradores e R$ 1 bilhão de faturamento para esse novo desenho, em especial quando o negócio está indo bem e crescendo rápido?

Como será o meu negócio, e minha indústria, em 2 ou 3 anos em um mundo pós-AGI? E, uma vez tendo uma visão direcional, que papel quero ocupar na nova cadeia de valor e qual passa a ser a nova definição de sucesso?

Para o nosso setor especificamente, isso significa pensar em um mundo no qual agentes de IA passam a transacionar em nome de consumidores e empresas. Em que o moat de integração com biller, telco ou utility, forte hoje, pode valer mais ou menos dependendo de quem se torna a contraparte da transação. Se o agente do consumidor passa a negociar diretamente com o agente do merchant, onde se cria valor e onde se captura? Além disso, se o checkout vira "headless" e passa a ser operado por agentes, que efeitos de rede continuam relevantes no nosso negócio? Quais dados proprietários podem ser usados para nos diferenciar?

Em ambos os grupos de perguntas acima, o conveniente seria continuar fazendo mais do mesmo. Afinal, "em time que está ganhando não se mexe". Tenho convicção de que, dado o novo mundo em que estamos entrando, esse seria o caminho seguro, confortável e errado.

Não tenho todas as respostas. Mas as perguntas em si já reorganizam a forma como temos olhado o nosso negócio. E algumas das respostas já começam a ganhar forma e a nortear nossos investimentos e apostas.

### O papel do CEO
Tenho refletido muito sobre essas perguntas, em especial nos últimos dois anos, tentando fazer as melhores escolhas para navegar uma transformação que ainda vejo poucas empresas preparadas para enfrentar, e muitas das quais sequer estão se fazendo as perguntas certas.

O papel de um CEO, entre outros, é tentar ver as coisas como elas são, não como gostaríamos que fossem. E, a partir daí, tomar as decisões, por mais difíceis que sejam, para que capital e talentos estejam alocados em torno do que será sucesso neste novo mundo.

Em 2026, talvez a pergunta mais perigosa para um CEO não seja "o que a IA pode fazer pelo meu negócio?", mas quanto do meu negócio atual só existe porque ainda não fomos obrigados a redesenhá-lo?

Qual pergunta sobre IA tem ocupado mais espaço nas suas conversas em 2026? E o que ela mudou, na prática, na sua estratégia?

---

## P6 — 🟡 "Para falar do Brasil, precisamos ir para Nova Iorque?"
- type: post (short-form)
- images: GALLERY — raw/12.jpeg, raw/13.png, raw/14.jpeg, raw/15.png, raw/16.png, raw/17.png, raw/18.png  ❓escolher capa
- slug (provisional): brazil-week-nova-iorque

Pela quarta vez participo da Brazil Week. E novamente volto com a mesma constatação irônica: atravessei 13 horas de voo para encontrar, primordialmente, brasileiros.

Não sei dizer qual é o evento âncora oficial da semana. Mas sei qual é o meu: a CEO Conference do Itaú, agora na sua 19ª edição. Talvez o único encontro fora do país capaz da façanha de concentrar, em um único auditório, os CEOs das 100 maiores empresas do Brasil.

Em torno dela, a semana se multiplica. Itau BBA Next 100 Years, Brasil em Pauta do ESTADÃO, Nasdaq Reception, Esfera Brasil, LIDE Brasil, BTG Pactual Tech Day, BTG Brazil & the Economy, Financial Times Brazil Summit, XP Inc. Real Estate Breakfast, Person of the Year, encontro do Bank of America. Some a isso happy hours, jantares e palestras nos mais variados temas, e tem-se a dimensão da agenda.

Para a Bemobi, é uma janela rara de exposição direta a investidores brasileiros e internacionais. Para mim, pessoalmente, é uma das melhores oportunidades no ano de reencontrar colegas e CEOs de outras indústrias que respeito e admiro.

Mas a pergunta que volto a me fazer é outra: por que precisamos de Nova York como ponto de encontro?

Estar fora de casa, sem reuniões internas, sem agenda corporativa local, libera as pessoas para conversas que simplesmente não acontecem em São Paulo ou no Rio. Há algo no deslocamento que muda a qualidade da troca.

A semana é uma maratona. Double booking de almoço, double booking de jantar, reuniões em ritmo industrial. Foram mais de 50 reuniões em 5 dias. Volto exausto, sempre. Mas volto também com novos contatos, visões e reflexões que muitas vezes não conseguiria em casa, e a convicção de que esse formato de "Brasil deslocado" gera um tipo de troca que o Brasil em casa não consegue produzir.

Talvez seja isso que a Brazil Week realmente entrega. Menos sobre Nova York. Mais sobre o que o Brasil é quando sai de si mesmo.

---

## P7 — 🟡 "Conselhos de administração: distração ou oxigenação para um CEO empreendedor?"
- type: post (short-form)
- image: raw/20.png (balança Time/Focus vs Learning/Inspiration)
- slug (provisional): conselhos-administracao-ceo

Já me perguntaram muitas vezes por que, sendo CEO e co-fundador de uma empresa listada, invisto tempo em conselhos de administração de outras empresas. As provocações vêm de dois ângulos.

A primeira é o foco. Toda hora dedicada a um conselho compete com a operação principal. É verdade.

A segunda é a assimetria entre risco e retorno. Como conselheiro independente em companhia aberta, você assume responsabilidade fiduciária relevante, com dever reforçado de representar o minoritário. Se o critério for puramente remuneração, raramente compensa.

Não discordo dos dois pontos. Por isso, dosimetria e escolha da empresa correta são chave. Não mais que um ou dois conselhos fora do meu papel na Bemobi, e só em empresas que tragam algo novo e justifiquem o tempo e a responsabilidade

Os critérios que aplico:
▸ Indústrias novas, onde possa maximizar o aprendizado, mas com senso crítico sobre onde também consigo agregar. Trago bagagem em estratégia, tecnologia, pagamentos e IA. E ter sido CEO de grandes empresas, inclusive multinacionais, e empreendedor, me dá sensibilidade sobre o balanço entre o papel do conselheiro e o do executivo.

▸ Empresas em que sou fã, e onde possa conviver com pessoas que admiro. Quando há um empreendedor à frente, melhor ainda

Tive a sorte de entrar em conselhos relativamente "jovem", há uns 12 anos. Alguns que ilustram bem:

▸ Na Positivo Tecnologia, mergulhei em fabricação, supply chain e P&D, e virei amigo de Hélio Rotenberg, um dos maiores empreendedores que conheci.

▸ Na Vibra Energia, acompanhei a transição de uma estatal para uma true corporation após o follow-on de privatização. Uma aula sobre operar em controle pulverizado, ao lado de pessoas incríveis.

▸ No Iguatemi S.A., vivi um caso exemplar de profissionalização de uma empresa familiar de muito sucesso. A família Jereissati, com Carlinhos, Pedro e Erika, construiu uma governança e um conselho de debates muito ricos

Mas talvez o aprendizado mais subestimado seja outro: estar em conselhos diversos te forma também como empreendedor. Vivi conselhos disfuncionais e outros que funcionam muito bem. Essa exposição me deu clareza sobre que tipo de governança queria construir na Bemobi

---

## P8 — 🟡 "Waymo vs Tesla: duas filosofias para chegar ao mesmo destino"
- type: post (short-form)
- images: raw/22.png (interior Jaguar/Waymo), raw/23.png (família ao lado do Waymo), raw/24.png (família dentro do Waymo), raw/25.png (infográfico Waymo vs Tesla)  ❓capa: provável raw/25.png ou raw/23.png
- order note: vem DEPOIS de P9 (este post diz "no post anterior contei sobre o Tesla Cybertruck")
- slug (provisional): waymo-vs-tesla

No post anterior, contei sobre a experiência de rodar com um Tesla Cybertruck usando FSD (Full Self-Driving) em Miami. Na mesma viagem, fiz questão de testar outra abordagem concorrente: andei com a família em um Waymo, sem motorista humano, 100% autônomo.

Duas experiências impressionantes. E duas filosofias radicalmente diferentes para resolver o mesmo problema

O Waymo aposta em redundância e controle:
• LiDAR + radar + câmeras trabalhando em conjunto
• Cidades pré-mapeadas com precisão centimétrica
• Operação restrita a áreas geocercadas e aprovadas previamente

A Tesla aposta em generalização e escala:
• Apenas câmeras (Tesla Vision) + redes neurais
• Sem mapas de alta definição: o carro aprende em tempo real
• Disponível em qualquer Tesla, em qualquer lugar, mas ainda com supervisão humana

Do ponto de vista do usuário, a experiência do Waymo é mais impactante no primeiro momento: o assento do motorista vazio e o volante girando sozinho param o coração. Mas é também uma experiência mais "comportada" com pontos de embarque e desembarque predefinidos, corridas restritas a perímetros aprovados da cidade. A Tesla, mesmo ainda exigindo motorista atento ao volante, é totalmente livre, vai onde você quiser, do jeito que você quiser e o carro vai aprendendo. Duas experiências impressionantes, cada uma à sua maneira.

Hoje, o Waymo está à frente em um ponto crítico: já opera sem motorista em várias cidades americanas, com aprovação regulatória consolidada. A Tesla precisa de menos hardware, custa menos por carro e tem uma frota gigantesca gerando dados, mas ainda exige mãos no volante.

Ficam as perguntas:
• Vence a abordagem mais controlada e comprovada (Waymo) ou a mais ambiciosa e escalável (Tesla)?
• Redundância de sensores é pré-requisito de segurança ou um custo que a IA vai tornar obsoleto?
• Pré-mapear cidades é um ativo estratégico ou um gargalo de escalabilidade?

Talvez o futuro da mobilidade autônoma não tenha um único vencedor. O Waymo pode dominar a operação de robotáxis em grandes centros urbanos, enquanto a Tesla democratiza a autonomia em cada carro vendido.

Duas estratégias opostas empurrando a mesma fronteira.

---

## P9 — 🟡 "Dirigi Teslas por 12 anos. Essa semana, o carro finalmente dirigiu por mim."
- type: post (short-form)
- images: raw/27.png (tela Tesla dia), raw/28.png (tela Tesla noite), raw/29.png (selfie família + Cybertruck), raw/30.png (família dentro do Cybertruck), raw/31.png (2018 Model S), raw/32.png (2023 Model X), raw/33.png (2026 Cybertruck)  ❓capa: provável raw/29.png ou a sequência 31/32/33
- order note: vem ANTES de P8
- slug (provisional): tesla-fsd-12-anos

No final de semana aluguei um Cybertruck com FSD v14.3 e Grok mode para rodar com a família.

Passei o destino por voz para o Grok. O Cybertruck saiu sozinho do estacionamento do shopping, manobrou entre as vagas, seguiu as placas de saída, desceu a rampa, rodou 20 minutos no trânsito até o destino, encontrou uma vaga livre e estacionou. Pela primeira vez em mais de uma década dirigindo Teslas, não toquei no volante uma única vez. Incrivel 😮!

Testei os diversos modos de direção que variam do Sloth (bicho-preguiça) até o Mad Max, e o carro dirigiu melhor do que eu (o que, convenhamos, não é grande vantagem).

Sou fã da marca desde 2012. Sempre foi menos pela eletrificação e mais pela promessa do carro autônomo.

Por muito tempo, foi só promessa. Há uns 6 anos, em uma road trip pela Califórnia, percorremos 1.600 km em 10 dias com Autopilot. Impressionante para a época, mas longe do que Elon prometia.

A virada começa a partir de 2020, sob a liderança de Andrej Karpathy (diretor de IA da Tesla entre 2017 e 2022): a empresa abandona o sistema especialista baseado em regras e faz um giro de 180 graus rumo a redes neurais end-to-end.

Em 2023, com o FSD v12, 300 mil linhas de código em C++ foram substituídas por ~3 mil que apenas ativam o modelo. O carro aprende a dirigir assistindo humanos. Software 2.0 na prática.

É um dos melhores exemplos de IA indo muito além dos LLMs e entrando nos "world models", sistemas que entendem e reagem ao mundo físico em tempo real. Peça fundamental para os robôs autônomos, uma das próximas grandes ondas da IA.

Tecnicamente, finalmente chegamos lá. Agora falta a regulação correr atrás:
• Quando teremos FSD sem precisar manter o olhar na estrada?
• Quantas cidades fora dos EUA vão ter isso nos próximos 2 anos?
• Esses sistemas vão conseguir lidar com o trânsito brasileiro?
