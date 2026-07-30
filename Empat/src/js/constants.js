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
    id: "motivacao",
    title: "Motivação",
    icon: Rocket,
    color: "#F97316",
    soft: "bg-orange-50 border-orange-200 text-orange-700",
    objective: "Desenvolver motivação intrínseca, sentido de competência e autonomia.",
    how_to_implement:
      'No início da semana (primeiro treino ou aula), cada atleta/aluno define uma meta pessoal. Ex.: "fazer 5 passes corretos", "comunicar mais com a equipa", "não desistir após o erro". Esta meta deve ser específica, alcançável (numa semana), observável e relevante para a aula/treino/modalidade. No final da semana, o atleta/aluno revê a sua meta.',
    what_to_observe: ["Envolvimento na atividade", "Persistência perante dificuldades", "Iniciativa própria e interesse em melhorar"],
    final_reflection:
      'O que fez bem, o que ajudou a continuar/melhorar, o que pode fazer diferente na próxima vez, se sentiu que esteve perto da meta, o que aprendeu sobre si. É importante estabelecer uma ponte com outros contextos: "Há alguma situação em casa, com amigos ou na escola onde possas usar as mesmas estratégias, ou a mesma determinação e persistência?"',
  },
  {
    id: "lideranca",
    title: "Liderança",
    icon: Crown,
    color: "#06B6D4",
    soft: "bg-cyan-50 border-cyan-200 text-cyan-700",
    objective: "Desenvolver responsabilidade, influência positiva e capacidade de orientar/liderar colegas.",
    how_to_implement:
      "Em cada treino/aula, ou em momentos específicos, um atleta/aluno assume o papel de líder. Deve ter responsabilidades como explicar os exercícios, organizar grupos/equipas, incentivar os colegas e ajudar na resolução de problemas.",
    what_to_observe: ["Iniciativa", "Clareza nas instruções", "Capacidade de escuta", "Gestão do grupo", "Exemplo comportamental"],
    final_reflection:
      'Ao "líder", questionar o que foi mais fácil, o que foi mais difícil, onde ajudou os colegas, onde precisou de ajuda, o que faria diferente. Ao grupo, se o líder conseguir receber feedback: o que fez bem e como os ajudou. Ponte com a vida: "Em que outras situações da tua vida precisas de assumir responsabilidades parecidas? Achas que podes usar o que aprendeste hoje nessas situações?"',
  },
  {
    id: "comunicacao",
    title: "Comunicação",
    icon: MessageCircle,
    color: "#F97316",
    soft: "bg-orange-50 border-orange-200 text-orange-700",
    objective: "Desenvolver comunicação clara e positiva, escuta ativa e feedback.",
    how_to_implement:
      "Em exercícios de pequenos grupos, um atleta/aluno recebe uma tarefa ou instrução e tem de a explicar ao grupo. Apenas pode utilizar comunicação verbal. O grupo executa a tarefa com base nas instruções recebidas. Após concluir, troca-se o atleta que dá as instruções, até todos terem essa tarefa.",
    what_to_observe: ["Clareza na mensagem", "Escuta ativa", "Capacidade de reformular", "Cooperação"],
    final_reflection:
      'Devem ser abordados temas como: o que tornou as instruções mais fáceis de compreender, o que dificultou a comunicação, o que foi feito quando os colegas não percebiam. Ponte com a vida: "Como podes comunicar melhor com colegas, professores, amigos e familiares?"',
  },
  {
    id: "tomada-decisao",
    title: "Tomada de Decisão",
    icon: GitBranch,
    color: "#84CC16",
    soft: "bg-lime-50 border-lime-200 text-lime-700",
    objective: "Desenvolver e melhorar adaptação, análise rápida e escolhas.",
    how_to_implement:
      'Explicar previamente que, durante um jogo/exercício, as regras podem ser alteradas a qualquer momento. Ex.: "agora só dois toques na bola", "pontos só contam após a linha X".',
    what_to_observe: ["Velocidade de adaptação às novas regras", "Flexibilidade", "Qualidade das decisões", "Busca por soluções alternativas"],
    final_reflection:
      'Questionar como foi tomada a decisão, o que mudou quando as regras mudaram, dificuldades sentidas, o que foi feito quando a primeira escolha não resultou. Ponte com a vida: "Em que outras situações, fora do desporto, tens de tomar decisões rápidas?"',
  },
  {
    id: "resiliencia",
    title: "Resiliência",
    icon: Shield,
    color: "#84CC16",
    soft: "bg-lime-50 border-lime-200 text-lime-700",
    objective: "Desenvolver persistência perante adversidades.",
    how_to_implement: "Criar uma tarefa difícil: objetivo muito exigente, tempo reduzido, equipa/grupo em desvantagem clara.",
    what_to_observe: ["Persistência", "Reação ao erro", "Procura de alternativas", "Apoio entre colegas"],
    final_reflection:
      'Esta reflexão tem melhores resultados quando todo o grupo colabora. Deve-se perceber quando os atletas pensaram em desistir, o que os ajudou a continuar, o que aprenderam com as dificuldades. Ponte com a vida: "Quando enfrentam situações parecidas fora do desporto? Podem utilizar o que aprenderam hoje no dia-a-dia?"',
  },
  {
    id: "tolerancia-frustracao",
    title: "Tolerância à Frustração",
    icon: Flame,
    color: "#EC4899",
    soft: "bg-pink-50 border-pink-200 text-pink-700",
    objective: "Desenvolver controlo emocional perante erros e injustiças.",
    how_to_implement:
      "Sem aviso prévio e sem explicação, introduzir obstáculos inesperados, difíceis e pouco justos: perder pontos, passar a estar em desvantagem, receber uma limitação adicional que mais ninguém recebeu, invalidar ações bem executadas.",
    what_to_observe: ["Reação emocional", "Linguagem utilizada", "Comportamento perante o erro", "Recuperação emocional", "Comportamento para com os colegas"],
    final_reflection:
      'Melhor em grupo. Compreender o que sentiram quando a situação mudou, como reagiram, o que ajudou a regular as emoções, com quem ficaram chateados, o que pode ser feito diferente. Ponte com a vida: "Quando algo não corre como esperam, fora do treino, o que costumam fazer? O que podem fazer diferente a partir de agora?"',
  },
  {
    id: "empatia-fair-play",
    title: "Empatia e Fair-Play",
    icon: Heart,
    color: "#EC4899",
    soft: "bg-pink-50 border-pink-200 text-pink-700",
    objective: "Desenvolver e promover compreensão emocional e comportamento pró-social.",
    how_to_implement: "Durante uma atividade específica, e sem explicação prévia, é atribuído um ponto extra por cada ação de fair-play.",
    what_to_observe: ["Quem demonstra respeito", "Apoio", "Inclusão", "Reconhecimento das emoções dos colegas"],
    final_reflection:
      'Questionar ao grupo se perceberam de onde vêm os pontos extra. Após a explicação, discutir: \"como saber se alguém está frustrado ou triste\", \"o que podes fazer para o ajudar\", \"como gostarias que os outros agissem contigo nesses momentos\". Ponte com a vida: \"Como podes mostrar empatia na escola, com amigos ou em casa?\"',
  },
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