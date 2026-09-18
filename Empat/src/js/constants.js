import { BookOpen, Target, ListChecks, MessageCircleQuestion, ChevronDown, Sparkles, Rocket, Crown, MessageCircle, GitBranch, Shield, Flame, Heart } from "lucide-react";

export const LOGO_URL = "https://customer-assets.emergentagent.com/job_07d0ccfc-afbc-45ef-ad0f-10656101df76/artifacts/31zvse95_657930506_1237028835289024_8774546618506940185_n.jpg";

export const SOFT_SKILLS = [
  { id: "motivacao" , name: "Motivação", color: "#3B82F6", bg: "bg-blue-500", text: "text-blue-600", soft: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "comunicacao", name: "Comunicação", color: "#F97316", bg: "bg-orange-500", text: "text-orange-600", soft: "bg-orange-50 text-orange-700 border-orange-200" },
  { id: "lideranca", name: "Liderança", color: "#06B6D4", bg: "bg-cyan-500", text: "text-cyan-600", soft: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { id: "resiliencia", name: "Resiliência", color: "#84CC16", bg: "bg-lime-500", text: "text-lime-600", soft: "bg-lime-50 text-lime-700 border-lime-200" },
  { id: "empatia", name: "Empatia", color: "#EC4899", bg: "bg-pink-500", text: "text-pink-600", soft: "bg-pink-50 text-pink-700 border-pink-200" },
  { id: "tomadecisao", name: "Tomada de Decisão", color: "#A855F7", bg: "bg-purple-50₀", text: "text-purple-6₀₀", soft: "bg-purple-5₀ text-purple-7₀₀ border-purple-2₀₀" },
  { id: "gestaostress", name: "Gestão de Stress", color: "#10B981", bg: "bg-green-500", text: "text-green-600", soft: "bg-green-50 text-green-700 border-green-200" },
];

export const SKILL_MAP = Object.fromEntries(SOFT_SKILLS.map(s => [s.id, s]));

export const SPORTS = ["futebol", "basquetebol", "voleibol", "andebol", "atletismo", "natação", "ténis", "todos"];
export const FUNCTIONS = ["Treinador", "Encarregado de Educação"];

export const HERO_IMG = "https://images.pexels.com/photos/8941650/pexels-photo-8941650.jpeg";
export const FEATURE_AI = "https://images.pexels.com/photos/10347865/pexels-photo-10347865.jpeg";
export const FEATURE_EX = "https://images.pexels.com/photos/974502/pexels-photo-974502.jpeg";

export const RESOURCES = [
  {
    id: "comunicacao",
    title: "Comunicação",
    icon: MessageCircle,
    color: "#F97316",
    soft: "bg-orange-50 border-orange-200 text-orange-700",
    isPilot: true,
    initial_evaluation: {
      objective: "Observar a capacidade de comunicar de forma clara e adequada, ouvir e compreender os outros e cooperar através da comunicação.",
      how_to_implement: "Em pequenos grupos, um atleta recebe uma tarefa ou instrução que deve explicar aos restantes elementos. A instrução deve ser transmitida apenas através de comunicação verbal, sem demonstrações físicas ou gestos. O grupo deve executar a tarefa apenas com base na informação que recebeu. Após a conclusão, deve ser alterado o atleta responsável por transmitir as instruções, permitindo que todos tenham a oportunidade de desempenhar esse papel.",
      what_to_observe: [
        "Clareza e organização da mensagem",
        "Capacidade de transmitir informação relevante",
        "Utilização de linguagem adequada ao contexto",
        "Capacidade de ouvir os colegas",
        "Capacidade de verificar se a mensagem foi compreendida",
        "Capacidade de reformular ou esclarecer uma instrução quando necessária",
        "Cooperação com todos os elementos do grupo"
      ]
    },
    exercises: [
      {
        step: "1º Exercício de Aquisição/Treino",
        title: "Comunicar para Resolver",
        objective: "Desenvolver uma comunicação clara e positiva, a escuta ativa, a capacidade de esclarecer e reformular mensagens e a cooperação entre os atletas/alunos.",
        how_to_implement: "Em pequenos grupos, é realizada uma tarefa que exige que os participantes comuniquem entre si para alcançar um objetivo. Antes do início da atividade, é estabelecida uma uma palavra-chave ou expressão, que deverá ser utilizada antes de serem executadas determinadas ações (Ex.: Um passe só é válido quando a palavra-chave é utilizada adequadamente).",
        what_to_observe: [
          "Clareza na mensagem passada aos colegas",
          "Capacidade de ouvir antes de responder",
          "Capacidade de reformular a mensagem",
          "Utilização de feedback positivo e/ou construtivo",
          "Capacidade de utilizar a comunicação para resolver problemas",
          "Cooperação e respeito entre os atletas/alunos"
        ],
        final_reflection: "Devem ser abordados temas como o que tornou as instruções mais fáceis de compreender, o que dificultou a comunicação, o que foi feito quando os colegas não percebiam as instruções, se foi mais importante ouvir ou falar e o porquê, o que pode ser feito de uma outra forma, numa próxima vez. ",
        life_bridge: "Como podemos utilizar estas estratégias para comunicar melhor com colegas, professores, amigos e familiares?"
      },
      {
        step: "2º Exercício de Progressão",
        title: "Comunicação sob pressão",
        objective: "Desenvolver a capacidade de manter uma comunicação clara, adequada e cooperativa perante situações de maior exigência, pressão temporal ou complexidade.",
        how_to_implement: "Mantendo a estrutura de tarefas realizadas em pequenos grupos, devem agora ser introduzidas constrangimentos progressivos que aumentam a dificuldade da comunicação (Ex.:  Menos tempo para realizar a tarefa, informação incompleta, mais elementos no grupo, aumento da oposição, alteração das regras (ou da palavra-chave) a meio do exercício, tomar decisões rapidamente.)",
        what_to_observe: [
          "Clareza na mensagem passada aos colegas quando aumenta a dificuldade",
          "Capacidade de ouvir e selecionar informação relevante",
          "Capacidade de manter a comunicação eficaz e respeituosa sob pressão",
          "Capacidade de reformular e utilizar feedback",
          "Cooperação entre os atletas/alunos"
        ],
        final_reflection: "Devem ser abordados temas como as diferenças ao nível da comunicação sempre que aumentava a dificuldade da tarefa, o que tornou a comunicação mais útil, se começaram a comunicar mais ou menos com o aumento da dificuldadem, como resolveram os problemas/dificuldades que foram surgindo, que estratégias funcionaram melhor. ",
        life_bridge: "Quando estamos sob pressão ou quando existe um conflito, como podemos continuar a comunicar de forma clara e respeituosa com colegas, professores, amigos e familiares?",
        nota: "O objetivo dos exercícios não é avaliar quem comunica mais, mas quem comunica de forma eficaz. Uma criança que fala muito não apresenta necessariamente melhores competências de comunicação do que uma criança que fala menos. Devem ser valorizadas a clareza, adequação da mensagem, capacidade de ouvir, reformular e cooperar."
      }
    ]
  },
  {
    id: "resiliencia",
    title: "Resiliência",
    icon: Shield,
    color: "#84CC16",
    soft: "bg-lime-50 border-lime-200 text-lime-700",
    isPilot: true,
    initial_evaluation: {
      objective: "Observar persistência, adaptação perante dificuldades, procura de soluções e capacidade de recuperar após falhar.",
      how_to_implement: " É apresentada uma tarefa desportiva com dificuldade progressiva. A tarefa deve ser suficientemente desafiante para que seja provável ocorrerem erros, mas não tão difícil que seja impossível de realizar (Ex.: completar determinado número de passes com oposição, realizar um circuito motor com dificuldade progressiva, alcançar um objetivo coletivo dentro de determinado período de tempo, jogo em que a equipa/turma tem de recuperar de uma desvantagem).",
      what_to_observe: [
        "Persistência dos atletas/alunos",
        "Reação e recuperação ao erro",
        "Tentativa de utilizar novas estratégias",
        "Capacidade de pedir ajuda",
        "Capacidade de se adaptar a novos objetivos"
      ]
    },
    exercises: [
      {
        step: "1º Exercício de Aquisição/Treino",
        title: "Ainda Não",
        objective: "Desenvolver persistência, flexibilidade na procura de soluções e capacidade de encarar o erro como informação para ajustar a estratégia.",
        how_to_implement: 'É apresentado um desafio que exige várias tentativas. Quando uma tentativa falha, o treinador/professor não apresenta imediatamente a solução e utiliza perguntas como: "O que aconteceu?", "O que podemos experimentar agora?", "O que poderíamos mudar?", "Quem tem outra ideia?". A equipa/turma volta a tentar utilizando uma estratégia diferente.',
        what_to_observe: [
          "Reação ao erro",
          "Persistência",
          "Capacidade de gerar alternativas",
          "Aceitação de sugestões",
          "Procura de ajuda",
          "Capacidade de se adaptar a novas estratégias"
        ],
        final_reflection: "Devem ser abordados temas como o que aconteceu (e o que sentiram) quando a primeira tentativa não resultou, o que fizeram nesse momento, o que ajudou a continuar, o que mudou quando experimentaram novas estratégias. ",
        life_bridge: "Quando alguma coisa não resulta na escola, em casa ou com os amigos, como podemos aplicar a mesma ideia de experimentar outra estratégia?"
      },
      {
        step: "2º Exercício de Progressão",
        title: "Desafio + Adversidade",
        objective: "Desenvolver a capacidade de manter o foco no objetivo e adaptar estratégias perante alterações inesperadas.",
        how_to_implement: "Os atletas/alunos iniciam uma tarefa frequente e conhecida e, a meio, o treinador/professor introduz dificuldades adicionais de forma progressiva (Ex.: redução do tempo disponível, alteração das regras, inferioridade numérica, alteração do espaço disponível, introdução de uma nova limitação).",
        what_to_observe: [
          "Reação à mudança",
          "Capacidade de reorganização",
          "Persistência e flexibilidade",
          "Comunicação e procura de apoio",
          "Capacidade de manter o objetivo apesar da dificuldade"
        ],
        final_reflection: " Devem ser abordados temas como o que sentiram quando a dificuldade aumentou, o que mudou na forma de agir, o que ajudou a continuar, que estratégias funcionaram melhor, o que se pode fazer de forma diferente numa próxima situação. ",
        life_bridge: "Quando aparece um problema inesperado na escola, em casa ou com os amigos, o que podemos fazer para não desistir imediatamente?",
        nota: 'Resiliência não significa simplesmente "não desistir". Deve ser observada a capacidade de lidar com dificuldades, recuperar após erros ou insucessos, adaptar estratégias, procurar ajuda quando necessário e continuar orientado para o objetivo.'
      }
    ]
  },
  {
    id: "tolerancia-frustracao",
    title: "Tolerância à Frustração",
    icon: Flame,
    color: "#EC4899",
    soft: "bg-pink-50 border-pink-200 text-pink-700",
    isPilot: true,
    initial_evaluation: {
      objective: "Observar a reação emocional e comportamental perante erro, falha, espera, perda ou resultado indesejado.",
      how_to_implement: "Deve ser utilizada uma atividade desportiva normal na qual seja provável ocorrerem erros ou resultados indesejados. Neste momento não é necessário provocar deliberadamente frustração (Ex.:  circuito com tentativas, competição amigável, tarefa com pontuação, desafio individual ou de equipa).",
      what_to_observe: [
        "Expressões/Situações espontâneas de frustração",
        "Abandono da tarefa",
        "Culpabilização dos colegas",
        "Agressividade",
        "Capacidade de voltar à tarefa e procura de ajuda"
      ]
    },
    exercises: [
      {
        step: "1º Exercício de Aquisição/Treino",
        title: "Erro → Reset → Próxima Ação",
        objective: "Desenvolver reconhecimento da frustração, autorregulação e capacidade de voltar à tarefa após um erro.",
        how_to_implement: 'O treinador/professor ensina uma rotina simples que será utilizada sempre que ocorre um erro: 1. PARAR - Reconhecer que aconteceu um erro;  2. RECONHECER -  "Estou frustrado"; 3. RESET - Uma respiração lenta, uma palavra-chave ou self-talk positivo; 4. PRÓXIMA AÇÃO - Identificar o que fazer a seguir (Ex.: Errei o passe, respiro, olho novamente, penso no próximo passo).',
        what_to_observe: [
          "Reconhecimento da emoção",
          "Capacidade e autonomia no uso do reset",
          "Tempo necessário para recuperar",
          "Capacidade de voltar à tarefa",
          "Redução de comportamentos desadaptativos após o erro"
        ],
        final_reflection: " Devem ser abordados temas como o que sentiram quando cometeram erros, como perceberam que estavam frustrados, o que fizeram para recuperar, o que não funcionou, se a estratégia ajudou. ",
        life_bridge: "Quando alguma coisa não corre como querem na escola, em casa ou com os amigos, que estratégia podem adotar para recuperar?"
      },
      {
        step: "2º Exercício de Progressão",
        title: "Frustração Controlada",
        objective: "Desenvolver a capacidade de aplicar estratégias de regulação emocional perante situações de frustração progressivamente mais exigentes.",
        how_to_implement: "Depois de a rotina anterior estar  aprendida, introduzem-se obstáculos controlados, mas inesperados, durante o decorrer das atividades (Ex.: alteração de uma regra, redução do tempo, perda de uma vantagem, início em desvantagem, repetição de uma tarefa após erro, necessidade de alterar a estratégia).",
        what_to_observe: [
          "Intensidade da reação",
          "Utilização autónoma da estratégia",
          "Rapidez de recuperação",
          "Capacidade de regressar à tarefa",
          "Redução da culpabilização/agressividade",
          "Capacidade de continuar apesar da frustração"
        ],
        final_reflection: "Devem ser abordados temas como qual foi a situação que mais os deixou frustrados, como reagiram, se usaram a estratégia de reset, o que poderiam ter feito diferente, o que acontece quando deixamos a frustração controlar aquilo que fazemos. ",
        life_bridge: "Quando alguma coisa não corre como querem na escola, em casa ou com os amigos, como podemos aplicar esta estratégia?",
        nota: "O objetivo não é impedir que o atleta/aluno sinta frustração, mas ajudá-lo a reconhecer e gerir essa emoção de forma adequada. Devem ser observadas a reação perante o erro ou resultado indesejado, a capacidade de regular a resposta emocional, recuperar e retomar a tarefa sem comportamentos agressivos, de desistência ou de culpabilização dos outros."
      }
    ]
  },
  {
    id: "empatia-fair-play",
    title: "Empatia e Fair-Play",
    icon: Heart,
    color: "#EC4899",
    soft: "bg-pink-50 border-pink-200 text-pink-700",
    isPilot: true,
    initial_evaluation: {
      objective: "Observar a capacidade de reconhecer e considerar a perspetiva dos outros, comportamento cooperativo, respeito pelas regras e colegas/adversários e resposta perante conflito ou desvantagem.",
      how_to_implement: " Durante quaquer exercício em equipa, devem ser introduzidas situações em que exista oportunidade natural para observar comportamentos de empatia e fair play (Ex.: Uma situação de disputa de bola, um erro de um colega, uma decisão do treinador/professor ou uma situação em que um atleta/aluno fica temporariamente em desvantagem).",
      what_to_observe: [
        "Respeito pelos colegas, adversários, regras e decisões",
        "Capacidade de reconhecer emoções dos outros",
        "Disponibilidade para ajudar e incluir colegas",
        "Reação perante o erro de outro colega",
        "Capacidade de evitar comportamentos provocatórios ou hostis",
        "Capacidade de considerar uma perspetiva diferente da sua"
      ]
    },
    exercises: [
      {
        step: "1º Exercício de Aquisição/Treino",
        title: "Nos Sapatos do Outro",
        objective: "Desenvolver tomada de perspetiva, reconhecimento das emoções dos outros, empatia e comportamentos de fair play.",
        how_to_implement: 'São criadas algumas situações específica para o exercício. Após o final do jogo ou exercício, o treinador/professor apresenta uma situação que tenha ocorrido, e promove um pequeno debate (Ex.:  "O João perdeu a bola e a equipa sofreu um golo”, "A Maria não foi escolhida para a equipa que queria", "Um colega recebeu uma falta e ficou frustrado porque o treinador/professor não marcou"). Os atletas/alunos deve tentar responder, a partir da perspetiva da outra pessoa, o que achas que esta pessoa sentiu, pensou, o que essa pessoa precisaria dos colegas naquele momento e como podem ajudar.',
        what_to_observe: [
          "Capacidade de identificar emoções",
          "Capacidade de justificar a perspetiva atribuída ao outro",
          "Respeito por diferentes perspetivas",
          "Propostas de comportamento pró-social",
          "Capacidade de distinguir intenção de consequência",
          "Capacidade de pensar para além da própria perspetiva"
        ],
        final_reflection: "Devem ser abordados temas como como acham que a outra pessoa se sentiu e o que os fez pensar que se sentiu assim, o que poderiam ter feito para ajudar, o que é que gostariam que um colega fizesse se estivessem nessa situação e se é possível alguém ter uma perspetiva diferente da nossa e, mesmo assim, estar a ser respeitado. ",
        life_bridge: "Onde podemos usar esta capacidade de tentar perceber o que outra pessoa está a sentir, mesmo fora do desporto?"
      },
      {
        step: "2º Exercício de Progressão",
        title: "Fair Play em Situação de Conflito",
        objective: "Desenvolver empatia e comportamento pró-social perante situações de conflito, injustiça percebida, erro ou desacordo.",
        how_to_implement: "Durante um jogo ou exercício, o treinador/professor introduz situações que possam gerar conflito ligeiro e controlado, sem procurar provocar emocionalmente os participantes (Ex.: dois atletas/alunos querem ocupar a mesma posição, dois atletas/alunos discordam sobre quem deve executar uma tarefa, alguém acredita que sofreu uma falta que não foi assinalada, um atleta/colega culpa outro por um erro). Os atletas/alunos devem ser encorajados a resolver essas situações, dando a sua própria perspetiva de forma autónoma, dando a perspetiva da outra pessoa e soluções que considerem justas.",
        what_to_observe: [
          "Capacidade de ouvir a perspetiva do outro",
          "Respeito durante o desacordo",
          "Capacidade de controlar comportamentos agressivos",
          "Procura de soluções",
          "Capacidade de chegar a um compromisso ou acordo",
          "Preocupação com o impacto da decisão nos outros",
          "Manutenção do fair play perante conflito"
        ],
        final_reflection: " Devem ser abordados temas como o que que aconteceu quando surgiu o conflito, se cada um viu a situação da mesma forma, o que mudou quando tentáram perceber a perspetiva do outro, se foi possível encontrar uma solução que fosse aceitável para todos, o que tornou a situação mais difícil, o que poderíam fazer de forma diferente numa próxima situação. ",
        life_bridge: "Quando temos um conflito com um colega, amigo ou familiar, como podemos tentar perceber a perspetiva dessa pessoa antes de reagir?",
        nota: "A empatia não deve ser avaliada apenas pela capacidade de identificar emoções, mas também pela forma como o atleta/aluno considera a perspetiva e as necessidades dos outros. Devem ser valorizados o respeito pelos colegas e adversários, a inclusão, a cooperação e a capacidade de responder de forma adequada perante erros, conflitos ou situações de injustiça."
      }
    ]
  },
  {
    id: "motivacao",
    title: "Motivação",
    icon: Rocket,
    color: "#F97316",
    soft: "bg-orange-50 border-orange-200 text-orange-700",
    isPilot: false,
    objective: "Desenvolver motivação intrínseca, sentido de competência e autonomia.",
    how_to_implement: 'No início da semana (primeiro treino ou aula), cada atleta/aluno define uma meta pessoal. Ex.: "fazer 5 passes corretos", "comunicar mais com a equipa", "não desistir após o erro". Esta meta deve ser específica, alcançável (numa semana), observável e relevante para a aula/treino/modalidade. No final da semana, o atleta revê a sua meta.',
    what_to_observe: ["Envolvimento na atividade", "Persistência perante dificuldades", "Iniciativa própria e interesse em melhorar"],
    final_reflection: "O que fez bem, o que ajudou a continuar/melhorar, o que pode fazer diferente na próxima vez, sentiu que esteve perto da meta, o que aprendeu sobre si. ",
    life_bridge: "“Há alguma situação em casa com amigos, na escola onde possas usar as estratégias que usaste aqui, ou a mesma determinação e persistência?"
  },
  {
    id: "lideranca",
    title: "Liderança",
    icon: Crown,
    color: "#06B6D4",
    soft: "bg-cyan-50 border-cyan-200 text-cyan-700",
    isPilot: false,
    objective: "Desenvolver responsabilidade, influência positiva e capacidade de orientar/liderar colegas.",
    how_to_implement: "Em cada treino/aula, ou em momentos específicos, um atleta/aluno assume o papel de líder. Deve ter responsabilidades como explicar os exercícios, organizar grupos/equipas, incentivar os colegas e ajudar na resolução de problemas.",
    what_to_observe: ["Iniciativa", "Clareza nas instruções", "Capacidade de escuta", "Gestão do grupo", "Exemplo comportamental"],
    final_reflection: 'Ao “líder”, questionar o que foi mais fácil, o que foi mais difícil, onde ajudou os colegas, onde precisou de ajuda, o que faria diferente numa próxima vez. Ao grupo, apenas se o “líder” conseguir receber feedback dos colegas questionar o que o líder fez bem e como os ajudou durante o treino/aula. ',
    life_bridge: "Em que outras situações da tua vida precisas de assumir responsabilidades parecidas? Achas que podes usar o que aprendeste hoje nessas situações numa próxima vez?"
  },
  {
    id: "tomada-decisao",
    title: "Tomada de Decisão",
    icon: GitBranch,
    color: "#84CC16",
    soft: "bg-lime-50 border-lime-200 text-lime-700",
    isPilot: false,
    objective: "Desenvolver e melhorar adaptação, análise rápida e escolhas.",
    how_to_implement: "Explicar previamente que, durante um jogo/exercício, as regras podem ser alteradas a qualquer momento. Ex.: 'agora só dois toques na bola', 'pontos só contam após a linha X'.",
    what_to_observe: ["Velocidade de adaptação às novas regras", "Flexibilidade", "Qualidade das decisões", "Busca por soluções alternativas"],
    final_reflection: "Questionar como foi tomada a decisão, o que mudo quando as regras mudaram, quais as dificuldades sentidas, o que foi feito quando a primeira escolha/estratégia não resultou. ",
    life_bridge: "Em que outras situações, fora do desporto, tens de tomar decisões rápidas? É possível usar o que foi aprendido hoje no dia-a-dia?"

  }
];

export const INDIVIDUAL_SKILLS = [
  {
    id: "motivacao",
    name: "Motivação",
    behavior: "Demonstra energia, empenho e iniciativa própria.",
  },
  {
    id: "comunicacao",
    name: "Comunicação",
    behavior: "Dá indicações claras, ouve e usa linguagem corporal positiva.",
  },
  {
    id: "lideranca",
    name: "Liderança",
    behavior: "Orienta os outros, assume responsabilidade e puxa pelo grupo.",
  },
  {
    id: "resiliencia",
    name: "Resiliência",
    behavior: "Mantém o esforço após o erro e a desvantagem.",
  },
  {
    id: "empatia",
    name: "Empatia",
    behavior: "Apoia colegas e respeita adversários/árbitros.",
  },
  {
    id: "tomadecisao",
    name: "Tomada de Decisão",
    behavior: "Escolhe a melhor opção sob pressão de forma rápida e segura.",
  },
  {
    id: "gestaostress",
    name: "Gestão de Stress",
    behavior: "Mantém a calma e não bloqueia sob pressão.",
  },
];

export const GROUP_SKILLS = [
  {
    id: "motivacao",
    name: "Motivação",
    behavior: "O grupo exibe niveis altos  de ativação, entusiasmo e foco.",
  },
  {
    id: "comunicacao",
    name: "Comunicação",
    behavior: "Há dialogo constante, interajuda verbal e feedback construtivo.",
  },
  {
    id: "lideranca",
    name: "Liderança",
    behavior: "Surgem lideres (formais/informais) que organizam e guiam a equipa.",
  },
  {
    id: "resiliencia",
    name: "Resiliência",
    behavior: "A equipa reage unida à adversidade sem se desorganizar.",
  },
  {
    id: "empatia",
    name: "Empatia",
    behavior: "Existe entreajuda, espírito de equipa e respeito mútuo na turma.",
  },
  {
    id: "tomadecisao",
    name: "Tomada de Decisão",
    behavior: "O coletivo executa a estratégia planeada com critério e eficácia.",
  },
  {
    id: "gestaostress",
    name: "Gestão de Stress",
    behavior: "o ambiente geral permanece focado e calmo em momentos críticos.",
  },
];

export const LIKERT_SCALE = [
  {
    id: "motivacao",
    name: "Motivação",
    levels: [
      { value: 1, label: "Nunca", text: "Apático, arrasta os pés, evita participar nos exercícios ou desiste ao primeiro sinal de cansaço." },
      { value: 3, label: "Às vezes", text: "Empenhado apenas nas tarefas que mais gosta (ex: jogo final) ou quando a equipa está a ganhar." },
      { value: 5, label: "Sempre", text: "Energia contagiante, chega e mantém-se focado, propõe-se a ajudar o professor/treinador e dá 100% em todas as tarefas." },
    ],
  },
  {
    id: "comunicacao",
    name: "Comunicação",
    levels: [
      { value: 1, label: "Nunca", text: "Totalmente isolado (silencioso) ou usa linguagem corporal destrutiva (cruzar braços, revirar os olhos)." },
      { value: 3, label: "Às vezes", text: "Comunica apenas em momentos de calma ou para pedir a bola, mas falha na transmissão de indicações táticas." },
      { value: 5, label: "Sempre", text: "Voz ativa e positiva, dá indicações curtas e claras, escuta ativamente o feedback da equipa técnica/professores e dos colegas." },
    ],
  },
  {
    id: "lideranca",
    name: "Liderança",
    levels: [
      { value: 1, label: "Nunca", text: "Omite-se, esconde-se do jogo ou assume uma postura autoritária/crítica que desmotive os colegas." },
      { value: 3, label: "Às vezes", text: "Lidera pelo exemplo técnico (joga bem), mas não consegue organizar nem puxar pelos colegas." },
      { value: 5, label: "Sempre", text: "Organiza o posicionamento do grupo, apoia quem erra, assume a responsabilidade nos momentos difíceis." },
    ],
  },
  {
    id: "resiliencia",
    name: "Resiliência",
    levels: [
      { value: 1, label: "Nunca", text: "Baixa a cabeça após um erro; adota postura derrotista e desiste de disputar a jogada seguinte." },
      { value: 3, label: "Às vezes", text: "Recupera bem de erros técnicos simples, mas vai \"abaixo\" psicologicamente se sofrer um golo ou ponto contra, ou com o acumular de erros." },
      { value: 5, label: "Sempre", text: "Reage instantaneamente ao erro, aumenta o esforço, mantém o foco na tarefa apesar do resultado desfavorável." },
    ],
  },
  {
    id: "empatia",
    name: "Empatia",
    levels: [
      { value: 1, label: "Nunca", text: "Culpa os colegas pelos erros, insulta ou ignora os adversários e contesta agressivamente a arbitragem." },
      { value: 3, label: "Às vezes", text: "Cumprimenta os adversários no fim por obrigação, critica os colegas menos dotados tecnicamente durante o exercício." },
      { value: 5, label: "Sempre", text: "Ajuda ativamente os colegas com mais dificuldades, motiva os colegas após falhas, demonstra respeito absoluto pelas regras, adversários e árbitros." },
    ],
  },
  {
    id: "tomadedecisao",
    name: "Tomada de Decisão",
    levels: [
      { value: 1, label: "Nunca", text: "Executa sem critério, joga à pressa ou inventa ações individuais sem nexo tático." },
      { value: 3, label: "Às vezes", text: "Decide bem nas fases iniciais ou sem oposição direta, mas precipita-se assim que o espaço e o tempo reduzem." },
      { value: 5, label: "Sempre", text: "Lê o jogo perfeitamente; escolhe a melhor linha de passe ou ação individual no momento exato, mesmo sob pressão." },
    ],
  },
  {
    id: "gestaostress",
    name: "Gestão do Stress",
    levels: [
      { value: 1, label: "Nunca", text: "Fica paralisado pela ansiedade, hiperventila, comete erros básicos por precipitação ou demonstra descontrolo emocional." },
      { value: 3, label: "Às vezes", text: "Controla a ansiedade no aquecimento, mas demonstra picos de descontrolo emocional em momentos decisivos do jogo/aula." },
      { value: 5, label: "Sempre", text: "Expressão facial serena sob pressão, usa pausas ou respiração para desacelerar o ritmo, mantém a eficácia técnica." },
    ],
  },
];