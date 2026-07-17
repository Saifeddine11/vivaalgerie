import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const articleDir = join(root, 'src/content/articles/fr');
const imageDir = join(root, 'public/images/articles');

mkdirSync(articleDir, { recursive: true });
mkdirSync(imageDir, { recursive: true });

const svgBase = ({ title, subtitle, motif = 'map' }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="800" viewBox="0 0 1400 800" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">${escapeXml(subtitle)}</desc>
  <rect width="1400" height="800" fill="#f7f8f6"/>
  <rect x="0" y="0" width="1400" height="800" fill="url(#grid)" opacity="0.55"/>
  <defs>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#d9dfd7" stroke-width="1"/>
    </pattern>
  </defs>
  <circle cx="1085" cy="160" r="92" fill="#006233" opacity="0.12"/>
  <circle cx="1160" cy="230" r="42" fill="#d21034" opacity="0.18"/>
  <path d="M160 600 C300 480 340 560 500 450 S770 315 930 405 1110 495 1240 345" fill="none" stroke="#006233" stroke-width="12" stroke-linecap="round" opacity="0.82"/>
  ${motifSvg(motif)}
  <rect x="96" y="96" width="560" height="232" rx="26" fill="#ffffff" stroke="rgba(0,0,0,.08)"/>
  <text x="132" y="170" font-family="Georgia, 'Times New Roman', serif" font-size="54" fill="#0a0a0a">${escapeXml(title)}</text>
  <text x="132" y="230" font-family="Arial, sans-serif" font-size="24" fill="#5f6660">${escapeXml(subtitle)}</text>
  <rect x="132" y="272" width="170" height="8" rx="4" fill="#006233"/>
  <rect x="314" y="272" width="70" height="8" rx="4" fill="#d21034"/>
</svg>`;

function motifSvg(motif) {
  if (motif === 'energy') {
    return `<g transform="translate(840 475)" fill="none" stroke="#0a0a0a" stroke-width="10" opacity=".72"><path d="M0 165h330M45 165V35h240v130M85 35v-70M245 35v-70M120 80h90M120 120h90"/><path d="M20 165c35-70 80-105 135-105s100 35 135 105" stroke="#006233"/></g>`;
  }
  if (motif === 'tourism') {
    return `<g transform="translate(825 445)" fill="none" stroke="#0a0a0a" stroke-width="10" opacity=".72"><path d="M0 120c80-70 160-70 240 0s160 70 240 0" stroke="#006233"/><path d="M120 70a70 70 0 1 0 140 0a70 70 0 1 0-140 0"/><path d="M190 0v140M120 70h140"/></g>`;
  }
  if (motif === 'culture') {
    return `<g transform="translate(865 420)" fill="none" stroke="#0a0a0a" stroke-width="10" opacity=".72"><path d="M0 230c80-125 150-190 245-220 95 30 165 95 245 220"/><path d="M105 230V105h280v125M165 105c20-42 46-64 80-64s60 22 80 64" stroke="#006233"/></g>`;
  }
  if (motif === 'un') {
    return `<g transform="translate(910 420)" fill="none" stroke="#0a0a0a" stroke-width="10" opacity=".72"><circle cx="160" cy="120" r="118"/><path d="M42 120h236M160 2c-44 52-66 91-66 118s22 66 66 118M160 2c44 52 66 91 66 118s-22 66-66 118" stroke="#006233"/><path d="M80 45c50 28 110 28 160 0M80 195c50-28 110-28 160 0"/></g>`;
  }
  return `<g transform="translate(845 390)" fill="none" stroke="#0a0a0a" stroke-width="10" opacity=".72"><path d="M85 25l-70 30v250l70-30 140 40 140-40 70 30V55l-70-30-140 40L85 25z"/><path d="M85 25v250M225 65v250M365 25v250" stroke="#006233"/></g>`;
}

function escapeXml(value) {
  return value.replace(/[<>&"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[char]));
}

function enrichmentSection(article) {
  const categoryLabel = {
    'sahara-occidental': 'le dossier du Sahara occidental',
    'algerie-maroc': 'les relations entre l’Algérie et le Maroc',
    analyses: 'les grandes analyses régionales',
    economie: 'l’économie algérienne',
    tourisme: 'le tourisme algérien et maghrébin',
    culture: 'la culture politique algérienne',
  }[article.category] ?? 'l’actualité algérienne';

  return `
## Repères éditoriaux pour aller plus loin

Ce sujet doit être lu à deux vitesses. La première est celle des faits vérifiables : dates, résolutions, institutions, déclarations officielles, données économiques ou décisions diplomatiques. La seconde est celle des récits nationaux, qui donnent à ces faits une signification différente selon que l’on se place à Alger, Rabat, New York, Paris, Washington ou dans les camps sahraouis. Un article sérieux sur ${categoryLabel} doit tenir ensemble ces deux niveaux, car l’un sans l’autre produit soit une fiche froide, soit un texte militant sans précision.

La perspective de Viva Algérie assume une sensibilité algérienne. Cela signifie que les notions de souveraineté, d’indépendance, de mémoire anticoloniale et d’autodétermination sont prises au sérieux. Mais cette sensibilité ne doit pas conduire à ignorer les arguments adverses, les évolutions diplomatiques défavorables ou les limites internes du modèle algérien. Au contraire, une ligne éditoriale forte gagne en crédibilité lorsqu’elle reconnaît les zones de complexité.

Pour le lecteur, le bon réflexe consiste donc à poser trois questions. Que dit l’ONU ou la source institutionnelle compétente ? Que disent les parties directement impliquées ? Que montrent les faits matériels sur le terrain, qu’il s’agisse de contrôle territorial, d’échanges économiques, de flux touristiques, de sécurité ou d’opinion publique ? Cette méthode limite les simplifications et permet de comprendre pourquoi le même événement peut être interprété de manière opposée.

Enfin, il faut distinguer critique politique et hostilité identitaire. Critiquer une décision d’État, une doctrine diplomatique ou une stratégie régionale ne revient pas à viser un peuple. Cette distinction est essentielle pour traiter ${categoryLabel} avec fermeté, mais sans glisser vers l’invective. L’Algérie peut défendre ses positions, son histoire et ses intérêts avec confiance ; elle n’a pas besoin de déshumaniser qui que ce soit pour rendre ses arguments audibles.

Cette prudence ne rend pas l’analyse tiède. Elle la rend plus solide. Un lecteur peut préférer la position algérienne, contester les choix marocains, critiquer une décision occidentale ou défendre une cause d’autodétermination tout en gardant une exigence de preuve. C’est cette exigence qui permet à un média pro-algérien d’être crédible au-delà de son public naturel.
`;
}

const images = {
  'western-sahara-editorial.svg': ['Sahara occidental', 'Histoire, ONU et autodétermination', 'map'],
  'algeria-morocco-editorial.svg': ['Algérie–Maroc', 'Rivalité, frontière et diplomatie', 'map'],
  'algeria-vs-morocco-editorial.svg': ['Algérie vs Maroc', 'Comparer sans caricaturer', 'map'],
  'minurso-editorial.svg': ['MINURSO', 'Le processus onusien expliqué', 'un'],
  'sand-war-editorial.svg': ['1963', 'La Guerre des Sables et ses traces', 'map'],
  'energy-sovereignty.svg': ['Énergie', 'Gaz, souveraineté et stratégie', 'energy'],
  'tourism-potential.svg': ['Tourisme', 'Deux modèles, deux potentiels', 'tourism'],
  'independence-culture.svg': ['Indépendance', 'Mémoire et identité algérienne', 'culture'],
  'algeria-palestine-editorial.svg': ['Autodétermination', 'Algérie, Palestine et diplomatie', 'un'],
};

for (const [filename, [title, subtitle, motif]] of Object.entries(images)) {
  writeFileSync(join(imageDir, filename), svgBase({ title, subtitle, motif }));
}

const disclaimer = 'Cet article propose une analyse éditoriale fondée sur des sources publiques. Les sujets géopolitiques peuvent faire l’objet d’interprétations différentes selon les acteurs et les positions diplomatiques.';

const commonMethod = `
## Méthode de lecture

Viva Algérie adopte ici une perspective attentive aux arguments algériens, mais cette perspective ne dispense pas de distinguer les niveaux d’analyse. Un fait établi n’est pas une opinion, une revendication diplomatique n’est pas un jugement définitif, et une position nationale ne suffit pas à régler un litige international. Cette discipline est indispensable sur les dossiers qui touchent au Sahara occidental, aux relations entre Alger et Rabat, à la mémoire coloniale ou aux comparaisons entre sociétés.

La ligne éditoriale retenue est simple : expliquer clairement ce que défend l’Algérie, ce que défend le Maroc, ce que revendique le Front Polisario lorsque le sujet le concerne, et ce que disent les cadres internationaux disponibles. L’objectif n’est pas d’effacer les désaccords, mais de les rendre lisibles sans insulte, sans déshumanisation et sans transformer les peuples en adversaires abstraits.
`;

const articles = [
  {
    slug: 'sahara-occidental-algerie-autodetermination',
    title: 'Sahara occidental : pourquoi l’Algérie défend le droit à l’autodétermination',
    description: 'Comprendre pourquoi l’Algérie soutient l’autodétermination sahraouie au Sahara occidental, entre mémoire anticoloniale, ONU et position diplomatique.',
    category: 'sahara-occidental',
    date: '2026-07-17',
    image: '/images/articles/western-sahara-editorial.svg',
    alt: 'Graphique éditorial neutre sur le Sahara occidental et le droit à l’autodétermination',
    featured: true,
    tags: ['Sahara occidental', 'Algérie', 'autodétermination', 'ONU', 'Front Polisario'],
    body: `
Le soutien de l’Algérie au droit à l’autodétermination au Sahara occidental s’explique d’abord par une doctrine. Depuis l’indépendance, la diplomatie algérienne se présente comme héritière d’une lutte anticoloniale et défend l’idée que les peuples concernés par un processus de décolonisation doivent pouvoir choisir leur avenir politique. Sur le Sahara occidental, cette doctrine rejoint le classement du territoire par les Nations unies parmi les territoires non autonomes, un statut qui maintient la question dans le registre international de la décolonisation.

Cette position ne signifie pas que le dossier serait simple. Le Maroc considère le Sahara occidental comme partie intégrante de son territoire et défend depuis 2007 un plan d’autonomie sous souveraineté marocaine. Le Front Polisario revendique, lui, le droit des Sahraouis à l’indépendance et se présente comme représentant du peuple sahraoui. L’ONU cherche depuis des décennies une solution politique, juste, durable et mutuellement acceptable. L’Algérie, sans être partie administrante du territoire, soutient le Polisario et accueille des réfugiés sahraouis dans la région de Tindouf.

## Une continuité avec la mémoire algérienne

Pour comprendre l’intensité de la position algérienne, il faut revenir à l’expérience coloniale. L’État algérien s’est construit sur une guerre de libération longue et coûteuse. Dans l’imaginaire politique algérien, l’autodétermination n’est pas un concept abstrait de juristes : c’est le principe qui a permis au peuple algérien de sortir de la domination coloniale. Cette mémoire donne à la cause sahraouie une résonance particulière.

La diplomatie algérienne présente donc le Sahara occidental comme une question de principe. Elle soutient que la stabilité régionale ne peut pas être durable si un peuple inscrit dans un processus onusien n’a pas pu exprimer librement son choix. Cette lecture est populaire en Algérie parce qu’elle rejoint un réflexe de souveraineté : refuser qu’un rapport de force ou une reconnaissance bilatérale remplace une procédure collective reconnue par les Nations unies.

## Le cadre onusien

La MINURSO a été créée en 1991 par le Conseil de sécurité pour surveiller le cessez-le-feu et organiser un référendum. Le nom même de la mission rappelle cette intention initiale : Mission des Nations Unies pour l’organisation d’un référendum au Sahara occidental. Le référendum n’a jamais eu lieu, principalement en raison de désaccords sur le corps électoral, les options politiques et les conditions de mise en œuvre.

Depuis, les résolutions du Conseil de sécurité ont évolué vers la recherche d’une solution politique négociée. Mais le fait que la MINURSO soit toujours renouvelée, jusqu’au 31 octobre 2026 par la résolution 2797 adoptée en 2025, montre que le dossier n’est pas fermé. Il demeure suivi par l’ONU, avec une mission qui observe la situation sécuritaire, appuie le travail de l’Envoyé personnel du Secrétaire général et contribue à limiter l’escalade.

## Ce que défend Alger

L’Algérie affirme que la solution doit respecter le droit des Sahraouis à disposer d’eux-mêmes. Elle critique les reconnaissances de souveraineté marocaine ou les soutiens au plan d’autonomie lorsqu’ils sont présentés comme seule base possible, car elle y voit une réduction du champ de l’autodétermination. Cette critique s’est exprimée après les positions américaine, française ou britannique favorables au plan marocain, avec des nuances selon les formulations de chaque pays.

Pour Alger, le plan d’autonomie peut être une proposition sur la table, mais il ne doit pas annuler la possibilité pour les Sahraouis de choisir une autre option. C’est la différence centrale entre la lecture algérienne et la lecture marocaine. La première insiste sur le choix préalable du peuple ; la seconde défend une autonomie négociée dans le cadre de la souveraineté marocaine.

## Pourquoi cette position reste stratégique

Le dossier est aussi stratégique. Il touche aux équilibres du Maghreb, à la frontière algéro-marocaine, à la place de l’Union africaine, aux alliances militaires et aux rapports avec les puissances occidentales. En défendant l’autodétermination, l’Algérie préserve une ligne diplomatique qui lui permet de se présenter comme puissance de principe, indépendante des pressions extérieures.

Cette posture comporte aussi un coût. Elle entretient une rivalité forte avec le Maroc et contribue à l’absence d’intégration maghrébine. Mais du point de vue algérien, céder sur ce dossier reviendrait à accepter qu’un conflit de décolonisation soit tranché par accumulation de soutiens diplomatiques plutôt que par consultation du peuple concerné.

${commonMethod}

## FAQ

### L’Algérie revendique-t-elle le Sahara occidental ?
Non. La position officielle algérienne ne consiste pas à revendiquer le territoire pour l’Algérie, mais à défendre le droit des Sahraouis à l’autodétermination.

### Le Maroc reconnaît-il cette lecture ?
Non. Le Maroc considère le Sahara occidental comme partie intégrante du royaume et propose une autonomie sous souveraineté marocaine.

### Le référendum est-il encore prévu ?
La MINURSO a été créée avec cet objectif initial, mais le référendum n’a jamais eu lieu. Les résolutions récentes parlent surtout d’une solution politique négociée, tout en conservant la référence au processus onusien.

### Pourquoi le sujet est-il si sensible en Algérie ?
Parce qu’il touche à la mémoire anticoloniale, à la souveraineté et à la rivalité stratégique avec le Maroc.

## Sources

- Nations unies, Décolonisation — Sahara occidental : https://www.un.org/dppa/decolonization/fr/nsgt/western-sahara
- MINURSO — mandat et historique : https://minurso.unmissions.org/en/mandate
- Conseil de sécurité, résolution 2797 (2025) : https://digitallibrary.un.org/record/4093660
- Ministère algérien des Affaires étrangères, communiqué du 9 avril 2025 : https://www.mfa.gov.dz/fr/announcements/statement-of-the-ministry-of-foreign-affairs-usa-09042025
- Ministère marocain des Affaires étrangères, initiative d’autonomie de 2007 : https://in.diplomatie.ma/index.php/en/moroccan-initiative-negotiating-autonomy-statute-sahara-region
`,
  },
  {
    slug: 'a-qui-appartient-sahara-occidental',
    title: 'À qui appartient le Sahara occidental ? Histoire, ONU et positions politiques',
    description: 'À qui appartient le Sahara occidental ? Réponse nuancée sur l’histoire, le statut onusien, la position marocaine, la position sahraouie et la position algérienne.',
    category: 'sahara-occidental',
    date: '2026-07-16',
    image: '/images/articles/western-sahara-editorial.svg',
    alt: 'Graphique éditorial neutre présentant le Sahara occidental comme dossier disputé',
    tags: ['Sahara occidental', 'ONU', 'Maroc', 'Algérie', 'Sahraouis'],
    body: `
La question “à qui appartient le Sahara occidental ?” attire beaucoup de recherches, mais elle peut devenir trompeuse si elle cherche une réponse simple à un conflit encore disputé. Le Maroc affirme sa souveraineté sur le territoire. Le Front Polisario revendique le droit du peuple sahraoui à un État indépendant. L’Algérie soutient cette revendication au nom de l’autodétermination. Les Nations unies, elles, maintiennent le Sahara occidental sur la liste des territoires non autonomes et poursuivent un processus politique qui n’a pas abouti.

Il faut donc répondre avec précision : le statut international du Sahara occidental n’est pas considéré comme définitivement réglé par l’ONU. Le territoire est en grande partie contrôlé par le Maroc, tandis que le Front Polisario administre des zones à l’est du berm et les camps de réfugiés autour de Tindouf avec le soutien algérien. La question politique reste ouverte dans les cadres onusiens, malgré les reconnaissances et soutiens bilatéraux accordés au Maroc par plusieurs États.

## Avant 1975 : colonisation espagnole et inscription à l’ONU

Le Sahara occidental a été administré par l’Espagne. En 1963, il a été inscrit par les Nations unies sur la liste des territoires non autonomes. Ce point est crucial, car il inscrit le dossier dans la logique de l’article 73 de la Charte des Nations unies et des processus de décolonisation. Lorsque l’Espagne se retire en 1976, elle informe l’ONU qu’elle met fin à sa présence et à ses responsabilités administratives.

Le départ espagnol ne règle pas la question. Le Maroc avance ses droits historiques et prend le contrôle d’une grande partie du territoire. Le Front Polisario, créé en 1973, mène une guerre pour l’indépendance. La Mauritanie, également impliquée au départ, se retire du conflit en 1979. Le conflit se concentre ensuite entre le Maroc et le Polisario, avec l’Algérie en soutien diplomatique et matériel au mouvement sahraoui.

## La position marocaine

Pour Rabat, le Sahara occidental est une partie intégrante du Maroc. La monarchie présente cette question comme un enjeu d’intégrité territoriale et de sécurité nationale. Le plan d’autonomie proposé en 2007 vise à accorder des compétences locales importantes à la région, mais dans le cadre de la souveraineté marocaine. Le Maroc estime que cette option est réaliste, stable et compatible avec l’autodétermination par référendum sur le statut d’autonomie négocié.

Cette position a gagné des soutiens importants. Les États-Unis ont reconnu en 2020 la souveraineté marocaine sur le Sahara occidental. La France a renforcé en 2024 son appui au plan d’autonomie en l’inscrivant dans le cadre de la souveraineté marocaine. Ces évolutions diplomatiques renforcent Rabat, mais elles ne remplacent pas formellement une décision collective de l’ONU sur le statut final du territoire.

## La position sahraouie et du Front Polisario

Le Front Polisario défend l’indépendance de la République arabe sahraouie démocratique, proclamée en 1976 et reconnue par certains États ainsi que membre de l’Union africaine. Le mouvement affirme que les Sahraouis ont droit à un référendum incluant l’option de l’indépendance. Il considère l’autonomie sous souveraineté marocaine comme insuffisante, car elle présuppose la souveraineté du Maroc avant même la consultation.

La question de la représentation sahraouie est au cœur du conflit. Le Maroc met en avant les populations vivant dans les provinces du Sud sous son administration et les élus locaux. Le Polisario met en avant les réfugiés, les zones qu’il administre et l’histoire de la lutte anticoloniale sahraouie. L’ONU continue d’interagir avec les parties et les États voisins dans la recherche d’une issue.

## La position algérienne

L’Algérie ne revendique pas le Sahara occidental pour elle-même. Elle soutient le droit des Sahraouis à l’autodétermination et accueille des réfugiés autour de Tindouf. Cette position est présentée par Alger comme une continuité de sa diplomatie anticoloniale. Elle s’oppose à toute solution qui ferait de l’autonomie sous souveraineté marocaine la seule issue possible sans consultation libre du peuple concerné.

Cette position est fortement enracinée dans l’opinion publique algérienne. Elle est liée à la mémoire de la guerre de libération, à la méfiance envers les héritages coloniaux non résolus et à la rivalité stratégique avec le Maroc. Elle explique pourquoi les changements de position de grandes puissances sur le plan marocain provoquent souvent des réactions algériennes fermes.

## Répondre sans simplifier

Dire que le Sahara occidental “appartient” simplement à l’un ou l’autre camp revient à transformer une dispute internationale en slogan. Une réponse sérieuse doit reconnaître la réalité du contrôle marocain, le statut onusien de territoire non autonome, la revendication sahraouie d’indépendance, le soutien algérien à l’autodétermination et l’absence d’un règlement accepté par toutes les parties.

${commonMethod}

## FAQ

### Le Sahara occidental est-il reconnu par l’ONU comme marocain ?
L’ONU ne présente pas le territoire comme définitivement réglé. Elle le maintient dans les dossiers de décolonisation et poursuit un processus politique.

### Pourquoi le Maroc contrôle-t-il une grande partie du territoire ?
Après le retrait espagnol et la guerre avec le Front Polisario, le Maroc a consolidé son contrôle sur la majeure partie du territoire, notamment à l’ouest du berm.

### Pourquoi l’Algérie est-elle impliquée ?
L’Algérie soutient le Front Polisario et la revendication d’autodétermination, tout en accueillant des réfugiés sahraouis près de Tindouf.

### Peut-on parler de territoire disputé ?
Oui. C’est la formulation la plus prudente et la plus conforme à l’état du dossier international.

## Sources

- Nations unies, Décolonisation — Sahara occidental : https://www.un.org/dppa/decolonization/fr/nsgt/western-sahara
- MINURSO, mandat : https://minurso.unmissions.org/en/mandate
- Initiative marocaine d’autonomie transmise à l’ONU : https://digitallibrary.un.org/record/607676
- Reuters, positions France/Algérie sur le Sahara occidental, 2024 : https://www.reuters.com
- White House archives, proclamation américaine de 2020 : https://trumpwhitehouse.archives.gov/presidential-actions/proclamation-recognizing-sovereignty-kingdom-morocco-western-sahara/
`,
  },
  {
    slug: 'pourquoi-algerie-maroc-conflit',
    title: 'Algérie–Maroc : pourquoi les deux pays sont en conflit depuis des décennies',
    description: 'Pourquoi l’Algérie et le Maroc sont en conflit : frontières, Guerre des Sables, Sahara occidental, rivalité régionale, sécurité et rupture diplomatique.',
    category: 'algerie-maroc',
    date: '2026-07-15',
    image: '/images/articles/algeria-morocco-editorial.svg',
    alt: 'Graphique éditorial neutre sur les relations entre l’Algérie et le Maroc',
    tags: ['Algérie Maroc conflit', 'frontière', 'Sahara occidental', 'Maghreb'],
    body: `
Le conflit entre l’Algérie et le Maroc n’est pas une querelle passagère. Il résulte d’une accumulation historique : frontières héritées de la colonisation, Guerre des Sables de 1963, visions opposées du Sahara occidental, fermeture de la frontière terrestre depuis 1994, compétition diplomatique en Afrique et rupture des relations en 2021. Les peuples partagent pourtant une proximité culturelle forte. La tension concerne d’abord les États, leurs doctrines et leurs intérêts stratégiques.

Réduire cette rivalité à une opposition entre Algériens et Marocains serait une erreur. Des familles existent des deux côtés, les dialectes se répondent, les musiques circulent, les mémoires populaires sont imbriquées. Mais les appareils d’État ont construit des récits divergents sur la souveraineté, la sécurité et le rôle régional.

## La frontière comme blessure originelle

Après l’indépendance de l’Algérie, les frontières héritées de la colonisation deviennent un sujet sensible. Alger défend le principe de l’intangibilité des frontières issues de l’indépendance, un principe central pour éviter que l’Afrique postcoloniale ne soit traversée par une multiplication de conflits territoriaux. Rabat, de son côté, nourrit des revendications historiques sur certaines zones frontalières, notamment dans le contexte des débats autour du “Grand Maroc”.

La Guerre des Sables de 1963 cristallise cette méfiance. Même brève, elle marque durablement l’imaginaire politique algérien : le jeune État, à peine sorti de la guerre de libération, se sent menacé à ses frontières. Au Maroc, le conflit s’inscrit dans une lecture différente des frontières et des équilibres régionaux. Ce premier choc laisse une empreinte que les crises ultérieures réactivent.

## Le Sahara occidental comme dossier central

Le Sahara occidental devient ensuite le cœur du désaccord. Le Maroc considère le territoire comme partie intégrante du royaume et défend depuis 2007 un plan d’autonomie sous souveraineté marocaine. L’Algérie soutient le Front Polisario et le droit des Sahraouis à l’autodétermination. L’ONU maintient une mission, la MINURSO, créée en 1991 après le cessez-le-feu, tandis que le référendum prévu n’a jamais eu lieu.

Ce désaccord n’est pas seulement juridique. Il touche à la vision que chaque pays a de lui-même. Pour Alger, soutenir les Sahraouis prolonge une tradition anticoloniale. Pour Rabat, défendre le Sahara est une question d’intégrité territoriale et de continuité nationale. Les deux lectures sont incompatibles tant que l’une exige un choix ouvert et que l’autre pose la souveraineté marocaine comme cadre de la solution.

## La fermeture de 1994

La frontière terrestre fermée depuis 1994 est l’un des symboles les plus visibles du blocage. Après l’attentat de Marrakech et l’instauration par le Maroc de visas pour les Algériens, Alger ferme la frontière. Depuis, chaque débat sur la réouverture renvoie aux mêmes questions : sécurité, confiance, Sahara occidental, accusations réciproques et absence de mécanisme diplomatique stable.

Cette fermeture a un coût humain réel. Elle coupe des familles, limite le commerce, bloque la circulation régionale et affaiblit l’idée d’un Maghreb intégré. Mais pour une partie de l’opinion algérienne, elle reste perçue comme une mesure de souveraineté face à un climat diplomatique jugé défavorable et menaçant par Alger.

## La rupture de 2021

En août 2021, l’Algérie rompt ses relations diplomatiques avec le Maroc, invoquant une série d’actes hostiles. Le contexte comprend les tensions autour du Sahara occidental, des accusations liées à la Kabylie, la normalisation du Maroc avec Israël et la méfiance sécuritaire. Le Maroc rejette les accusations algériennes et regrette officiellement la décision.

Depuis, la rivalité est plus frontale. Elle se déploie dans les médias, les forums diplomatiques, les alliances et les politiques d’armement. Le risque est de voir les sociétés absorber un conflit d’États comme s’il s’agissait d’une hostilité naturelle entre peuples. C’est précisément ce glissement qu’un média sérieux doit éviter.

## Deux visions du Maghreb

L’Algérie valorise une posture de souveraineté, de non-alignement relatif et de soutien aux causes d’autodétermination. Le Maroc privilégie une diplomatie d’accords, de reconnaissance de son plan d’autonomie et d’intégration économique. Ces deux visions ne sont pas forcément incompatibles sur tous les sujets, mais elles se heurtent fortement dès qu’il est question du Sahara occidental et de la sécurité régionale.

${commonMethod}

## FAQ

### Le conflit est-il religieux ou culturel ?
Non. Il s’agit principalement d’un conflit politique, territorial, diplomatique et sécuritaire entre États.

### Pourquoi la frontière est-elle fermée ?
Elle est fermée depuis 1994 à la suite d’une crise sécuritaire et diplomatique. Le blocage s’est ensuite élargi à d’autres dossiers.

### Le Sahara occidental est-il la seule cause ?
Non, mais c’est le dossier central qui structure la rivalité actuelle.

### Les peuples sont-ils ennemis ?
Non. Les tensions concernent les États et leurs récits politiques. Il faut éviter toute hostilité contre les populations.

## Sources

- Associated Press, Algeria breaks off diplomatic ties with Morocco, 24 août 2021 : https://apnews.com
- Reuters, Algeria cuts diplomatic ties with Morocco, 24 août 2021 : https://www.reuters.com
- MINURSO — mandat : https://minurso.unmissions.org/en/mandate
- Encyclopaedia Britannica, contexte historique du Maghreb et du Sahara occidental : https://www.britannica.com
- Viva Algérie — Frontière Algérie–Maroc : /frontiere-algerie-maroc
`,
  },
  {
    slug: 'guerre-des-sables-1963',
    title: 'Guerre des Sables 1963 : comprendre l’origine d’une méfiance durable',
    description: 'La Guerre des Sables de 1963 entre l’Algérie et le Maroc a marqué durablement la relation bilatérale. Contexte, causes et conséquences.',
    category: 'algerie-maroc',
    date: '2026-07-14',
    image: '/images/articles/sand-war-editorial.svg',
    alt: 'Graphique éditorial neutre sur la Guerre des Sables de 1963',
    tags: ['Guerre des Sables', '1963', 'Algérie', 'Maroc', 'frontières'],
    body: `
La Guerre des Sables de 1963 est un épisode bref, mais fondateur dans la méfiance entre l’Algérie et le Maroc. Elle éclate quelques mois seulement après l’indépendance algérienne, dans un contexte où l’État algérien sort d’une guerre de libération épuisante et où la question des frontières héritées de la colonisation n’est pas seulement technique : elle touche à la souveraineté, à la légitimité et à la sécurité.

Le conflit se déroule autour de zones frontalières comme Tindouf et Béchar, dans une région où les frontières coloniales avaient laissé des ambiguïtés et des frustrations. Pour Alger, le principe central est l’intangibilité des frontières héritées de l’indépendance. Pour Rabat, des revendications historiques et politiques nourrissent l’idée que certains espaces auraient dû revenir au Maroc. Le choc militaire installe une défiance profonde.

## Un jeune État algérien sous pression

En 1963, l’Algérie est indépendante depuis à peine un an. Les institutions sont encore fragiles, l’armée se restructure, l’économie est abîmée par la guerre, et la priorité du pouvoir est de consolider l’État. Dans ce contexte, une confrontation frontalière est perçue comme une menace directe contre une souveraineté tout juste conquise.

Cette dimension explique pourquoi la Guerre des Sables occupe une place importante dans la mémoire politique algérienne. Elle n’est pas vue seulement comme un désaccord frontalier, mais comme une épreuve imposée à un pays encore vulnérable. Le souvenir nourrit ensuite une culture stratégique méfiante envers les intentions marocaines.

## Les revendications territoriales et le principe africain

Après les indépendances africaines, l’un des grands défis est d’éviter que chaque frontière coloniale ne devienne un casus belli. L’Organisation de l’unité africaine défend donc le respect des frontières héritées. L’Algérie adhère fortement à ce principe, car il protège la stabilité continentale et la souveraineté des nouveaux États.

Le Maroc, lui, s’appuie alors sur des lectures historiques différentes et sur des revendications territoriales plus larges. La confrontation de 1963 oppose donc deux visions : une vision algérienne de consolidation des frontières postcoloniales et une vision marocaine qui conteste certaines lignes héritées.

## Une guerre courte, une trace longue

Militairement, la Guerre des Sables reste limitée dans le temps. Des médiations africaines contribuent à mettre fin aux combats. Mais politiquement, elle laisse une trace durable. Elle nourrit la conviction algérienne que la prudence stratégique est nécessaire avec Rabat. Elle installe aussi un récit marocain où les frontières restent liées à des frustrations historiques.

Cette trace se retrouve dans les crises ultérieures. Lorsque le Sahara occidental devient le dossier central, les mémoires de 1963 reviennent en arrière-plan. Lorsque la frontière est fermée en 1994, puis lorsque les relations diplomatiques sont rompues en 2021, l’histoire de la Guerre des Sables continue d’alimenter les interprétations.

## Pourquoi l’épisode reste actuel

Comprendre 1963 permet d’éviter une erreur fréquente : croire que les tensions Algérie–Maroc commencent avec le Sahara occidental. Le Sahara est central aujourd’hui, mais la méfiance bilatérale lui est antérieure. Elle plonge dans la question frontalière, dans la sortie de colonisation et dans deux manières de raconter la souveraineté.

Pour les lecteurs algériens, cette histoire rappelle que l’indépendance n’a pas seulement été proclamée ; elle a dû être défendue. Pour les lecteurs marocains, elle renvoie à un récit national différent. Le rôle d’un média sérieux est de poser ces récits côte à côte sans transformer l’histoire en accusation contre un peuple.

${commonMethod}

## FAQ

### Quand a eu lieu la Guerre des Sables ?
Elle éclate en 1963, peu après l’indépendance de l’Algérie, et reste limitée dans le temps.

### Quelles zones étaient concernées ?
Les tensions portent notamment sur des zones frontalières autour de Tindouf, Béchar et Figuig.

### Pourquoi est-elle importante aujourd’hui ?
Parce qu’elle a installé une méfiance durable entre les appareils d’État algérien et marocain.

### Le conflit a-t-il réglé les frontières ?
Les combats ont cessé grâce à des médiations, mais la mémoire politique du conflit est restée très forte.

## Sources

- Encyclopaedia Britannica — contexte historique Algérie/Maroc : https://www.britannica.com
- Associated Press — rappel des tensions historiques Algérie–Maroc, 2021 : https://apnews.com
- Organisation de l’unité africaine / Union africaine — principe des frontières héritées : https://au.int
- Viva Algérie — Algérie–Maroc : /algerie-maroc
`,
  },
  {
    slug: 'front-polisario-sahraouis-revendications',
    title: 'Front Polisario : qui sont les Sahraouis et que revendiquent-ils ?',
    description: 'Front Polisario, Sahraouis, camps de réfugiés, autodétermination et revendication d’indépendance au Sahara occidental.',
    category: 'sahara-occidental',
    date: '2026-07-13',
    image: '/images/articles/western-sahara-editorial.svg',
    alt: 'Graphique éditorial neutre sur les revendications sahraouies',
    tags: ['Front Polisario', 'Sahraouis', 'Sahara occidental', 'autodétermination'],
    body: `
Le Front Polisario est au centre du conflit du Sahara occidental. Fondé en 1973, il revendique le droit du peuple sahraoui à l’autodétermination et à l’indépendance. Pour ses partisans, il incarne une lutte de libération nationale contre une situation coloniale non résolue. Pour le Maroc, il est un mouvement séparatiste soutenu par l’Algérie et ne représente pas à lui seul les populations du Sahara.

Les Sahraouis forment une population aux appartenances tribales, linguistiques et culturelles liées au Sahara atlantique. Leur histoire moderne est marquée par la colonisation espagnole, la guerre après le retrait de l’Espagne, l’exil d’une partie de la population dans les camps près de Tindouf, et la division du territoire par un berm militarisé. Cette histoire explique pourquoi la question sahraouie ne peut pas être réduite à une rivalité entre Alger et Rabat.

## La naissance du Polisario

Le Front Polisario apparaît dans un contexte de contestation anticoloniale contre la présence espagnole. Son nom complet, Front populaire de libération de la Saguia el-Hamra et du Rio de Oro, renvoie aux deux régions historiques du territoire. Après le retrait espagnol, le mouvement entre en guerre contre le Maroc et la Mauritanie. La Mauritanie se retire du conflit en 1979, tandis que le Maroc consolide son contrôle sur la majeure partie du territoire.

En 1976, le Polisario proclame la République arabe sahraouie démocratique. Celle-ci est reconnue par certains États et siège à l’Union africaine. Mais elle n’est pas reconnue par l’ONU comme État membre. Le conflit reste donc pris entre reconnaissance partielle, contrôle territorial marocain et processus onusien inachevé.

## Ce que revendiquent les Sahraouis indépendantistes

La revendication centrale est le droit à l’autodétermination, avec l’indépendance comme option. Le Polisario estime que toute solution qui impose l’autonomie sous souveraineté marocaine avant consultation limite le choix du peuple sahraoui. Il demande un référendum libre et équitable, dans l’esprit du plan de règlement qui a conduit à la création de la MINURSO en 1991.

Cette revendication est soutenue par l’Algérie, qui la présente comme une question de décolonisation. Alger accueille les camps de réfugiés sahraouis autour de Tindouf et défend le dossier dans les forums internationaux. Cette proximité nourrit l’accusation marocaine selon laquelle le Polisario dépend politiquement et matériellement de l’Algérie. Le Polisario répond qu’il est le représentant d’un peuple et non l’instrument d’un État voisin.

## La position du Maroc

Le Maroc conteste la lecture indépendantiste. Rabat affirme que le Sahara occidental fait partie de son territoire et que le plan d’autonomie de 2007 représente une solution réaliste. Le Maroc met en avant les investissements réalisés dans les régions sous son contrôle, la participation d’élus locaux et le soutien croissant de plusieurs puissances à son initiative.

Cette position gagne en poids diplomatique, notamment depuis la reconnaissance américaine de 2020 et l’évolution française de 2024. Mais elle reste contestée par le Polisario, l’Algérie et les États qui maintiennent une lecture centrée sur le droit à l’autodétermination.

## Les réfugiés et la dimension humaine

Le dossier n’est pas seulement diplomatique. Des réfugiés sahraouis vivent depuis des décennies dans des camps autour de Tindouf. Les conditions de vie, l’aide humanitaire, la transmission de l’identité sahraouie et l’absence de perspective politique pèsent sur plusieurs générations. Ce fait donne au conflit une dimension humaine que les débats géopolitiques oublient souvent.

Parler des Sahraouis exige donc de reconnaître la diversité des situations : ceux qui vivent sous administration marocaine, ceux qui vivent dans les camps, ceux qui vivent dans la diaspora et ceux qui se reconnaissent dans d’autres positions politiques. Aucun peuple ne se réduit entièrement à une organisation, mais aucune analyse du conflit ne peut ignorer le rôle central du Polisario.

${commonMethod}

## FAQ

### Le Front Polisario représente-t-il tous les Sahraouis ?
Il se présente comme représentant du peuple sahraoui, mais le Maroc conteste cette représentation exclusive et met en avant d’autres voix sahraouies.

### Pourquoi les camps sont-ils en Algérie ?
Une partie des Sahraouis a fui la guerre et vit depuis des décennies près de Tindouf, avec le soutien de l’Algérie et de l’aide internationale.

### Que revendique le Polisario ?
Le droit à l’autodétermination, avec l’indépendance comme option.

### Le Maroc accepte-t-il un référendum d’indépendance ?
Le Maroc privilégie son plan d’autonomie sous souveraineté marocaine et ne soutient pas un référendum incluant l’indépendance comme option.

## Sources

- MINURSO — historique et mandat : https://minurso.unmissions.org/en/mandate
- Nations unies — Sahara occidental et décolonisation : https://www.un.org/dppa/decolonization/fr/nsgt/western-sahara
- UNHCR — contexte réfugiés sahraouis : https://www.unhcr.org
- Union africaine — République arabe sahraouie démocratique : https://au.int
`,
  },
  {
    slug: 'minurso-onu-sahara-occidental',
    title: 'MINURSO : pourquoi l’ONU est toujours présente au Sahara occidental',
    description: 'MINURSO : mandat, origine, cessez-le-feu, référendum jamais organisé et rôle de l’ONU dans le conflit du Sahara occidental.',
    category: 'sahara-occidental',
    date: '2026-07-12',
    image: '/images/articles/minurso-editorial.svg',
    alt: 'Graphique éditorial neutre inspiré des Nations unies pour expliquer la MINURSO',
    tags: ['MINURSO', 'ONU', 'Sahara occidental', 'cessez-le-feu'],
    body: `
La MINURSO, Mission des Nations Unies pour l’organisation d’un référendum au Sahara occidental, est l’un des signes les plus visibles du caractère non réglé du conflit. Créée en 1991 par la résolution 690 du Conseil de sécurité, elle devait surveiller le cessez-le-feu entre le Maroc et le Front Polisario et préparer un référendum permettant au peuple du territoire de choisir entre l’indépendance et l’intégration au Maroc.

Plus de trois décennies plus tard, le référendum n’a pas eu lieu. Pourtant, la mission est toujours renouvelée, notamment jusqu’au 31 octobre 2026 par la résolution 2797 adoptée en 2025. Cette continuité montre que le dossier reste dans l’agenda international, même si le mandat pratique de la mission a évolué.

## Pourquoi le référendum n’a pas eu lieu

La difficulté centrale a porté sur l’identification du corps électoral, les critères de participation et les options politiques. Dans un territoire marqué par les déplacements, les affiliations tribales, les revendications concurrentes et les transformations démographiques, déterminer qui devait voter est devenu un point de blocage majeur.

À cela s’ajoutent des divergences sur le contenu même de l’autodétermination. Le Polisario et l’Algérie défendent un choix incluant l’indépendance. Le Maroc défend désormais l’autonomie sous souveraineté marocaine comme issue réaliste. L’ONU a donc progressivement mis l’accent sur une solution politique négociée, sans faire disparaître l’héritage du plan initial.

## Le rôle actuel de la mission

Selon l’ONU, la MINURSO surveille la situation sécuritaire, observe les développements militaires, appuie le travail de l’Envoyé personnel du Secrétaire général et contribue à éviter l’escalade. Après la rupture du cessez-le-feu en 2020, son rôle d’observation et de prévention est devenu encore plus sensible.

La mission travaille aussi avec le service de lutte antimines des Nations unies. Le territoire reste affecté par des mines et munitions explosives, notamment près du berm. Cet aspect humanitaire est souvent absent des débats politiques, mais il touche directement les populations locales, les nomades, les personnels de l’ONU et les organisations humanitaires.

## Ce que dit la présence de l’ONU

La présence continue de la MINURSO ne signifie pas que l’ONU impose une solution. Elle signifie que le Conseil de sécurité considère toujours le dossier comme nécessitant un suivi international. Pour l’Algérie et le Polisario, c’est la preuve que la question reste ouverte et liée à l’autodétermination. Pour le Maroc, la mission doit accompagner une solution politique réaliste, que Rabat identifie au plan d’autonomie.

Cette différence d’interprétation explique pourquoi chaque renouvellement de mandat est scruté. Les mots employés dans les résolutions comptent : “réaliste”, “pragmatique”, “mutuellement acceptable”, “autodétermination”, “parties”, “États voisins”. Chaque terme peut être lu comme un signal diplomatique.

## Pourquoi cela concerne l’Algérie

L’Algérie n’est pas la puissance administrante du territoire, mais elle est directement concernée par le conflit : accueil des réfugiés, soutien au Polisario, frontière avec le Maroc fermée, sécurité régionale et rivalité diplomatique. Alger estime que la MINURSO rappelle le caractère international du dossier et empêche sa réduction à un simple différend bilatéral.

Pour les lecteurs algériens, comprendre la MINURSO permet donc de mieux saisir pourquoi le Sahara occidental reste un sujet de politique étrangère majeur. Tant que l’ONU maintient une mission et un envoyé personnel, le dossier n’est pas juridiquement absorbé par une seule lecture nationale.

${commonMethod}

## FAQ

### Que signifie MINURSO ?
Mission des Nations Unies pour l’organisation d’un référendum au Sahara occidental.

### La MINURSO organise-t-elle encore un référendum ?
Le référendum prévu n’a jamais eu lieu. Aujourd’hui, la mission surveille surtout la situation et appuie le processus politique.

### Le cessez-le-feu tient-il toujours ?
L’ONU indique que le cessez-le-feu de 1991 s’est rompu en 2020, ce qui rend la présence de la mission plus importante pour limiter l’escalade.

### Jusqu’à quand le mandat est-il renouvelé ?
La résolution 2797 (2025) renouvelle le mandat jusqu’au 31 octobre 2026.

## Sources

- MINURSO — mandat : https://minurso.unmissions.org/en/mandate
- Conseil de sécurité, résolution 690 (1991) : https://digitallibrary.un.org
- Conseil de sécurité, résolution 2797 (2025) : https://digitallibrary.un.org/record/4093660
- UNMAS Western Sahara — mines et munitions explosives : https://unsoh.unmissions.org/en/unmas/where-we-work/territory-of-western-sahara
`,
  },
  {
    slug: 'algerie-vs-maroc-visions-maghreb',
    title: 'Algérie vs Maroc : deux visions opposées du Maghreb',
    description: 'Algérie vs Maroc : souveraineté, diplomatie, économie, Sahara occidental et deux visions concurrentes du Maghreb.',
    category: 'analyses',
    date: '2026-07-11',
    image: '/images/articles/algeria-vs-morocco-editorial.svg',
    alt: 'Graphique éditorial neutre comparant les visions algérienne et marocaine du Maghreb',
    tags: ['Algérie vs Maroc', 'Maghreb', 'diplomatie', 'souveraineté'],
    body: `
L’expression “Algérie vs Maroc” est souvent utilisée pour produire des classements rapides : qui a la meilleure économie, la plus belle destination touristique, la diplomatie la plus efficace, l’armée la plus puissante. Ces comparaisons attirent les lecteurs, mais elles deviennent vite pauvres si elles oublient l’essentiel : l’Algérie et le Maroc portent deux visions différentes du Maghreb, de la souveraineté et de l’influence régionale.

L’Algérie se présente comme une puissance de souveraineté, héritière d’une révolution anticoloniale et attachée au principe d’autodétermination. Le Maroc se présente comme une monarchie stable, tournée vers les accords économiques, le tourisme, les réseaux africains et la reconnaissance de son plan d’autonomie au Sahara occidental. Ces deux modèles ne s’opposent pas sur tout, mais leur rivalité structure l’espace maghrébin.

## La vision algérienne : souveraineté et profondeur stratégique

La force de l’Algérie repose sur sa profondeur géographique, ses ressources énergétiques, son armée, son histoire révolutionnaire et son refus de dépendre entièrement d’alliances extérieures. Dans l’opinion publique algérienne, cette posture est souvent perçue comme un héritage précieux : l’indépendance ne se négocie pas, la souveraineté ne se délègue pas, et les causes de décolonisation ne doivent pas être abandonnées sous pression.

Cette vision explique le soutien au Sahara occidental, la prudence envers les normalisations stratégiques de voisins, et l’importance accordée à la sécurité. Elle donne à l’Algérie un profil parfois moins souple diplomatiquement, mais plus lisible idéologiquement.

## La vision marocaine : diplomatie d’accords et projection économique

Le Maroc a misé sur une diplomatie très active, une image internationale forte et une stratégie d’intégration économique. Tourisme, automobile, ports, phosphates, finance africaine et alliances occidentales composent une image de pays connecté et offensif sur le plan commercial. Sur le Sahara occidental, Rabat cherche à accumuler les soutiens à son plan d’autonomie jusqu’à le rendre incontournable.

Cette stratégie donne des résultats visibles. Elle expose aussi le Maroc à des dépendances : énergie importée, vulnérabilité hydrique, importance du tourisme et besoin continu d’investissements. Là où l’Algérie valorise la marge de souveraineté, le Maroc valorise la densité des partenariats.

## Sahara occidental : le point de collision

Le Sahara occidental est le point où les deux visions deviennent incompatibles. Pour Alger, le dossier reste une question de décolonisation et d’autodétermination. Pour Rabat, c’est une question d’intégrité territoriale et de souveraineté. Tant que cette divergence n’est pas dépassée, le Maghreb reste paralysé.

Les soutiens internationaux au plan marocain renforcent Rabat, mais ils renforcent aussi la conviction algérienne que le droit international est parfois contourné par des rapports de force. À l’inverse, le maintien du soutien algérien au Polisario conforte Rabat dans l’idée que son voisin bloque son intégrité territoriale. Chaque camp voit donc l’autre comme l’obstacle principal.

## Le coût pour le Maghreb

La rivalité prive la région d’un marché intégré, d’une mobilité fluide, d’infrastructures transfrontalières et d’un poids collectif plus important face à l’Europe, au Sahel et à l’Afrique subsaharienne. Les jeunesses algérienne et marocaine héritent d’une frontière fermée alors qu’elles partagent des références culturelles proches.

Une lecture pro-algérienne sérieuse peut souligner les atouts algériens : énergie, souveraineté, mémoire révolutionnaire, ressources, profondeur stratégique, culture nationale. Elle doit aussi reconnaître que le Maroc a développé des avantages réels dans la promotion touristique, l’exportation industrielle et le lobbying diplomatique. C’est cette lucidité qui rend la comparaison utile.

${commonMethod}

## FAQ

### L’Algérie et le Maroc sont-ils condamnés à la rivalité ?
Non, mais la rivalité restera forte tant que les dossiers du Sahara occidental, de la frontière et de la sécurité ne trouveront pas de cadre de discussion crédible.

### Quel pays est le plus puissant ?
Cela dépend du critère. L’Algérie a des ressources énergétiques et une profondeur stratégique. Le Maroc a une forte projection touristique, industrielle et diplomatique.

### Pourquoi parler de deux visions ?
Parce que la rivalité dépasse les chiffres : elle oppose des manières différentes de concevoir la souveraineté, les alliances et le Maghreb.

### Peut-on comparer sans insulter ?
Oui. La comparaison sérieuse porte sur les politiques publiques et les stratégies d’État, pas sur les peuples.

## Sources

- Banque mondiale — données économiques Algérie/Maroc : https://data.worldbank.org
- U.S. EIA — profil énergétique de l’Algérie : https://www.eia.gov/international/overview/country/dza
- MINURSO — Sahara occidental : https://minurso.unmissions.org/en/mandate
- Reuters / AP — rupture diplomatique de 2021 : https://www.reuters.com ; https://apnews.com
`,
  },
  {
    slug: 'algerie-sahara-occidental-decolonisation',
    title: 'Pourquoi l’Algérie considère le Sahara occidental comme une question de décolonisation',
    description: 'Pourquoi l’Algérie parle de décolonisation au Sahara occidental : ONU, territoire non autonome, mémoire anticoloniale et droit à l’autodétermination.',
    category: 'sahara-occidental',
    date: '2026-07-10',
    image: '/images/articles/western-sahara-editorial.svg',
    alt: 'Graphique éditorial neutre sur le Sahara occidental et la décolonisation',
    tags: ['décolonisation', 'Sahara occidental', 'Algérie', 'ONU'],
    body: `
L’Algérie qualifie le Sahara occidental de question de décolonisation parce que le territoire figure toujours sur la liste des territoires non autonomes des Nations unies. Ce point est la base de la lecture algérienne. Pour Alger, tant qu’un peuple inscrit dans un tel processus n’a pas exercé son droit à l’autodétermination, la décolonisation demeure inachevée.

Cette position est renforcée par l’histoire algérienne. La guerre d’indépendance contre la France a fait de l’autodétermination un principe fondateur de l’État. Dans le langage diplomatique algérien, soutenir les Sahraouis revient à appliquer aux autres peuples un principe dont les Algériens ont eux-mêmes revendiqué le bénéfice.

## Le statut de territoire non autonome

Les Nations unies inscrivent le Sahara occidental sur la liste des territoires non autonomes en 1963. Lorsque l’Espagne met fin à sa présence en 1976, elle se dégage de ses responsabilités, mais le statut final du territoire n’est pas réglé par une consultation acceptée par toutes les parties. C’est ce vide politique et juridique qui nourrit la lecture de décolonisation.

Pour l’Algérie, ce statut empêche de considérer le dossier comme une question purement interne marocaine. Il impose une procédure internationale et un droit du peuple concerné à choisir son avenir. Le Maroc conteste cette conclusion en défendant ses droits historiques et son plan d’autonomie, mais l’ONU continue de traiter le dossier comme une question internationale.

## La résolution 1514 et l’idée d’autodétermination

La diplomatie algérienne se réfère souvent à la résolution 1514 de l’Assemblée générale, texte central sur l’octroi de l’indépendance aux pays et aux peuples coloniaux. Ce texte fait partie de l’architecture politique de la décolonisation au XXe siècle. Il donne à la position algérienne une cohérence historique : les peuples colonisés doivent pouvoir disposer d’eux-mêmes.

Dans le cas du Sahara occidental, la difficulté vient de la traduction concrète de ce principe. Le référendum prévu par le plan de règlement n’a pas été organisé. Les résolutions récentes parlent davantage d’une solution politique négociée, mais Alger estime que cette solution ne doit pas effacer l’autodétermination.

## La réponse marocaine

Le Maroc rejette la lecture selon laquelle sa présence relèverait d’une colonisation. Rabat affirme que le Sahara fait partie de son intégrité territoriale et que l’autonomie proposée permettrait aux populations locales de gérer leurs affaires dans le cadre de la souveraineté marocaine. Cette proposition a reçu des soutiens croissants, notamment de la part des États-Unis et de la France.

Pour Alger, ces soutiens bilatéraux ne modifient pas la nature du dossier. Ils peuvent peser diplomatiquement, mais ils ne remplacent pas une solution acceptée par le peuple concerné et encadrée par l’ONU. C’est pourquoi l’Algérie réagit fortement lorsque des puissances parlent du plan marocain comme de la seule base possible.

## Un principe et une stratégie

La lecture algérienne est à la fois principielle et stratégique. Principielle, car elle repose sur l’autodétermination et la mémoire anticoloniale. Stratégique, car le Sahara occidental est au cœur de la rivalité avec le Maroc et de l’équilibre régional. Les deux dimensions se renforcent : l’argument de droit nourrit la posture de puissance, et la posture de puissance maintient l’argument dans l’agenda diplomatique.

${commonMethod}

## FAQ

### Pourquoi l’Algérie parle-t-elle de colonisation ?
Parce qu’elle se réfère au statut onusien de territoire non autonome et au droit des peuples à disposer d’eux-mêmes.

### Le Maroc accepte-t-il cette qualification ?
Non. Le Maroc considère le territoire comme partie intégrante du royaume et défend une autonomie sous souveraineté marocaine.

### Le droit international tranche-t-il définitivement ?
Le dossier reste suivi par l’ONU et n’est pas présenté comme définitivement réglé par une solution acceptée par toutes les parties.

### La position algérienne est-elle uniquement morale ?
Elle est morale et stratégique : elle relève d’un principe diplomatique, mais aussi d’un équilibre régional avec le Maroc.

## Sources

- Nations unies, Décolonisation — Sahara occidental : https://www.un.org/dppa/decolonization/fr/nsgt/western-sahara
- Assemblée générale des Nations unies, résolution 1514 (XV) : https://www.un.org
- Ministère algérien des Affaires étrangères, position sur le Sahara occidental : https://www.mfa.gov.dz
- MINURSO — mandat : https://minurso.unmissions.org/en/mandate
`,
  },
  {
    slug: 'algerie-palestine-diplomatie-autodetermination',
    title: 'Algérie et Palestine : une diplomatie construite autour des causes d’autodétermination',
    description: 'Algérie et Palestine : comment la diplomatie algérienne relie mémoire anticoloniale, souveraineté et soutien aux causes d’autodétermination.',
    category: 'analyses',
    date: '2026-07-09',
    image: '/images/articles/algeria-palestine-editorial.svg',
    alt: 'Graphique éditorial neutre sur la diplomatie algérienne et les causes d’autodétermination',
    tags: ['Algérie', 'Palestine', 'autodétermination', 'diplomatie'],
    body: `
Le soutien algérien à la Palestine s’inscrit dans une ligne diplomatique plus large : défendre les causes d’autodétermination et les peuples considérés comme privés d’un État pleinement souverain. Cette ligne relie la mémoire de la guerre de libération algérienne, le soutien au Sahara occidental, la solidarité avec la Palestine et une méfiance envers les solutions imposées par les rapports de force.

Dans l’opinion publique algérienne, la cause palestinienne occupe une place très forte. Elle est perçue à travers le prisme de l’injustice historique, de l’occupation, du droit international et de la solidarité anticoloniale. L’État algérien reprend cette sensibilité dans sa diplomatie, même si la conduite concrète des relations internationales implique toujours des arbitrages.

## Une mémoire de libération

L’Algérie indépendante se raconte comme le produit d’une lutte contre la colonisation. Cette mémoire n’est pas seulement commémorative ; elle structure une partie de la politique étrangère. Soutenir la Palestine, comme soutenir le droit des Sahraouis à l’autodétermination, permet à Alger d’affirmer une continuité entre son histoire nationale et son positionnement international.

Cette continuité est importante pour comprendre la popularité de ces causes. Dans un pays où l’indépendance reste un pilier identitaire, les peuples perçus comme privés de souveraineté suscitent une solidarité immédiate. La diplomatie rejoint ici un imaginaire collectif.

## Autodétermination et droit international

Le principe d’autodétermination est central dans la Charte des Nations unies et dans les textes de décolonisation. L’Algérie l’utilise comme langage diplomatique pour défendre la Palestine, le Sahara occidental et plus largement une vision du monde où la légitimité ne se réduit pas à la puissance militaire ou économique.

Cette position n’est pas neutre politiquement. Elle place souvent Alger en opposition avec des États qui privilégient des accords bilatéraux, des normalisations ou des solutions sécuritaires. Mais elle donne à l’Algérie une identité diplomatique reconnaissable : celle d’un pays qui veut parler au nom d’un Sud global attaché à la souveraineté.

## La Palestine dans l’opinion algérienne

La solidarité avec la Palestine dépasse largement les institutions. Elle traverse les stades, les réseaux sociaux, les associations, les mosquées, les partis et les conversations familiales. Elle est parfois formulée avec émotion, parfois avec colère, mais elle renvoie à une conviction partagée : la question palestinienne n’est pas un dossier lointain, elle est un miroir de la justice internationale.

Un média sérieux doit toutefois maintenir une distinction : soutenir les droits des Palestiniens ne justifie jamais la haine d’un peuple, d’une religion ou d’une origine. La critique doit viser les politiques, les occupations, les violations du droit et les choix d’États, pas des personnes réduites à leur identité.

## Un lien avec le Sahara occidental

L’Algérie relie souvent les causes palestinienne et sahraouie dans un même vocabulaire : autodétermination, décolonisation, refus du fait accompli. Les situations ne sont pas identiques, mais elles sont rapprochées par la diplomatie algérienne parce qu’elles posent toutes deux la question du droit d’un peuple à déterminer son avenir.

Cette mise en parallèle renforce la cohérence du discours algérien. Elle expose aussi Alger à des critiques de sélectivité ou d’instrumentalisation. La réponse éditoriale la plus solide consiste à reconnaître cette dimension stratégique tout en analysant le fond : la mémoire algérienne rend ces causes politiquement centrales.

${commonMethod}

## FAQ

### Pourquoi la Palestine est-elle si populaire en Algérie ?
Parce qu’elle est lue à travers la mémoire anticoloniale, la souveraineté et la solidarité avec un peuple privé d’État.

### Le soutien à la Palestine est-il seulement officiel ?
Non. Il est aussi social, culturel et populaire.

### Peut-on comparer Palestine et Sahara occidental ?
Les situations sont différentes, mais l’Algérie les rapproche par le principe d’autodétermination.

### Comment éviter les discours haineux ?
En critiquant les politiques et les violations du droit sans viser des peuples, des religions ou des origines.

## Sources

- Nations unies — Charte et principe d’autodétermination : https://www.un.org
- Ministère algérien des Affaires étrangères — déclarations diplomatiques : https://www.mfa.gov.dz
- Nations unies, Décolonisation — Sahara occidental : https://www.un.org/dppa/decolonization/fr/nsgt/western-sahara
- Assemblée générale des Nations unies — résolutions sur la Palestine : https://www.un.org
`,
  },
  {
    slug: 'algerie-energie-souverainete-gaz',
    title: 'Algérie, énergie et souveraineté : pourquoi le gaz reste un levier stratégique',
    description: 'Le gaz algérien reste un levier stratégique : sécurité énergétique, Europe, souveraineté, recettes publiques et diversification économique.',
    category: 'economie',
    date: '2026-07-08',
    image: '/images/articles/energy-sovereignty.svg',
    alt: 'Graphique éditorial neutre sur l’énergie et la souveraineté algérienne',
    tags: ['gaz', 'énergie', 'Algérie', 'souveraineté', 'économie'],
    body: `
Le gaz reste l’un des leviers stratégiques majeurs de l’Algérie. Dans une économie encore dépendante des hydrocarbures, il représente à la fois une force et une vulnérabilité : force parce qu’il donne à l’État des recettes, une influence énergétique et une marge de souveraineté ; vulnérabilité parce qu’il expose le pays aux cycles de prix, à la demande européenne et au défi de diversification.

Selon l’U.S. Energy Information Administration, l’Algérie est le plus grand producteur de gaz naturel d’Afrique selon les estimations 2024, et l’un des principaux producteurs africains de liquides pétroliers. Cette position donne à Alger un rôle particulier dans la sécurité énergétique méditerranéenne, surtout depuis que l’Europe cherche à réduire sa dépendance au gaz russe.

## Un levier de souveraineté

Pour l’Algérie, l’énergie n’est pas seulement un secteur économique. C’est une composante de la souveraineté nationale. Les hydrocarbures financent une partie importante du budget, soutiennent les équilibres sociaux et donnent au pays une capacité de négociation avec ses partenaires. Dans une région instable, disposer de ressources énergétiques exportables est un avantage stratégique.

Cette souveraineté s’exprime aussi dans la propriété publique des ressources et dans le rôle central de Sonatrach. L’État algérien veut garder la maîtrise de ses choix énergétiques, même lorsqu’il cherche des partenariats technologiques ou financiers.

## Le lien avec l’Europe

La proximité géographique de l’Algérie avec l’Europe renforce son importance. Gazoducs, GNL, contrats long terme et relations avec l’Italie, l’Espagne ou d’autres pays méditerranéens donnent au gaz algérien une valeur géopolitique. Lorsque les marchés sont tendus, les fournisseurs fiables gagnent en influence.

Mais ce lien est ambivalent. L’Europe est un marché important, mais elle avance aussi vers la décarbonation, l’efficacité énergétique et les mécanismes carbone. À moyen terme, l’Algérie doit donc transformer sa rente en investissements productifs, en industrie, en infrastructures et en compétences.

## Diversifier sans nier la rente

Le débat algérien oppose parfois hydrocarbures et diversification. En réalité, la question est de savoir comment utiliser la rente pour préparer l’après-rente. La Banque mondiale souligne la dynamique des secteurs hors hydrocarbures, mais aussi la nécessité d’améliorer la productivité, le climat des affaires et la création d’emplois de qualité.

Une lecture pro-algérienne sérieuse ne doit pas nier la dépendance aux hydrocarbures. Elle doit montrer que cette dépendance peut être transformée en tremplin si les recettes financent une économie plus productive. L’énergie donne du temps, mais elle ne remplace pas la réforme.

## Gaz, influence et Maghreb

Le gaz pèse aussi dans la rivalité régionale. L’Algérie dispose d’un atout que le Maroc ne possède pas à la même échelle : une capacité énergétique domestique et exportatrice. Cela renforce la profondeur stratégique d’Alger. Le Maroc compense autrement, par les ports, l’industrie exportatrice, le tourisme et les alliances économiques.

Comparer les deux modèles permet de mieux comprendre les forces algériennes. L’Algérie n’a pas seulement des ressources ; elle a une tradition de souveraineté énergétique. Le défi est de faire de cette tradition un moteur de modernisation plutôt qu’un confort qui retarde la diversification.

${commonMethod}

## FAQ

### Pourquoi le gaz est-il stratégique pour l’Algérie ?
Parce qu’il finance l’État, soutient les exportations et donne une influence dans la sécurité énergétique régionale.

### L’Algérie dépend-elle trop des hydrocarbures ?
Oui, la dépendance reste importante. Le défi est de transformer la rente en diversification productive.

### L’Europe restera-t-elle un marché important ?
Oui à court et moyen terme, mais la transition énergétique européenne oblige l’Algérie à anticiper.

### Le gaz donne-t-il un avantage face au Maroc ?
Il donne à l’Algérie un levier stratégique énergétique que le Maroc n’a pas à la même échelle.

## Sources

- U.S. Energy Information Administration — Algeria energy profile, 2025 : https://www.eia.gov/international/overview/country/dza
- Banque mondiale — Algeria Economic Update 2025 : https://www.worldbank.org/en/country/algeria
- International Energy Agency — Natural Gas Information 2026 : https://www.iea.org/data-and-statistics/data-product/natural-gas-information
- Banque mondiale — données Algérie : https://donnees.banquemondiale.org/pays/algeria
`,
  },
  {
    slug: 'algerie-maroc-potentiel-touristique',
    title: 'Algérie ou Maroc : qui a le plus grand potentiel touristique ?',
    description: 'Algérie ou Maroc : comparer le potentiel touristique, les infrastructures, le littoral, le Sahara, le patrimoine et les modèles de développement.',
    category: 'tourisme',
    date: '2026-07-07',
    image: '/images/articles/tourism-potential.svg',
    alt: 'Graphique éditorial neutre sur le potentiel touristique de l’Algérie et du Maroc',
    tags: ['tourisme Algérie', 'tourisme Maroc', 'Algérie vs Maroc', 'Sahara'],
    body: `
Comparer le potentiel touristique de l’Algérie et du Maroc exige de distinguer deux choses : la performance actuelle et le potentiel latent. Le Maroc est aujourd’hui nettement plus avancé dans l’accueil international, la promotion, l’hôtellerie, les circuits, les vols et la lisibilité de son offre. L’Algérie, elle, possède un potentiel immense mais encore sous-exploité : littoral méditerranéen, Sahara, villes historiques, sites antiques, montagnes, gastronomie, musique et hospitalité.

Pour un lecteur algérien, la bonne question n’est pas de nier l’avance marocaine. Elle existe. La vraie question est de savoir quel modèle touristique l’Algérie veut construire. Copier le Maroc serait une erreur. L’Algérie peut développer une voie plus patrimoniale, plus territoriale, plus durable et plus attachée à son identité.

## L’avance marocaine

Le Maroc a construit une marque touristique internationale forte. Marrakech, Agadir, Fès, Chefchaouen, Essaouira ou le désert sont identifiables pour les voyageurs européens, américains et africains. L’offre est lisible, les infrastructures sont nombreuses, les professionnels sont habitués aux marchés internationaux et la promotion est continue.

Cette avance donne au Maroc des recettes, de l’emploi et une visibilité culturelle. Elle comporte aussi des défis : pression sur certaines villes, dépendance à des marchés extérieurs, saturation de sites, hausse des prix et tension sur l’eau. Le modèle marocain est efficace, mais il n’est pas sans coûts.

## Le potentiel algérien

L’Algérie possède un patrimoine qui peut soutenir une offre touristique puissante : la Casbah d’Alger, Tipaza, Djemila, Timgad, Constantine, Oran, Béjaïa, le Mzab, le Hoggar, le Tassili, le littoral, les oasis et les cultures locales. Peu de pays méditerranéens combinent une telle diversité de paysages et de mémoires.

Le ministère algérien du Tourisme a annoncé plus de 3,5 millions d’arrivées en 2024, dont une part importante d’étrangers et de membres de la diaspora. Ces chiffres montrent une dynamique, mais ils restent loin de ce que le pays pourrait atteindre avec une meilleure qualité d’hébergement, des services plus réguliers, une promotion ciblée et une simplification du parcours voyageur.

## Pourquoi l’Algérie peut séduire autrement

L’avantage algérien est l’authenticité. Beaucoup de voyageurs cherchent désormais des destinations moins standardisées, moins saturées et plus profondes culturellement. L’Algérie peut attirer par la rareté de son Sahara, par la puissance de ses villes, par son histoire romaine, ottomane, amazighe, arabe, africaine et méditerranéenne.

Mais l’authenticité ne suffit pas. Un touriste a besoin de sécurité, d’informations, de transports, de propreté, de paiement, de réservation, de guides fiables et d’hébergements cohérents. Le potentiel devient réel seulement lorsqu’il est organisé.

## Quel modèle choisir ?

Le choix algérien devrait éviter deux pièges : le tourisme de masse sans préparation, et le repli qui empêche toute montée en gamme. Le pays peut viser un tourisme culturel, saharien, familial, diasporique, patrimonial et écologique, avec des standards élevés mais une identité forte.

Dans cette comparaison, le Maroc gagne aujourd’hui en performance. L’Algérie peut gagner demain en profondeur si elle transforme ses atouts en expérience lisible. C’est là que se trouve le potentiel le plus excitant pour la prochaine décennie.

${commonMethod}

## FAQ

### Le Maroc est-il aujourd’hui plus touristique que l’Algérie ?
Oui. Le Maroc a une avance nette en infrastructures, promotion et fréquentation internationale.

### L’Algérie a-t-elle plus de potentiel naturel ?
Elle possède un potentiel exceptionnel par la diversité de ses paysages, de son Sahara et de son patrimoine.

### Que manque-t-il à l’Algérie ?
Une meilleure qualité de service, plus d’hébergements, une promotion internationale et une simplification du parcours voyageur.

### Faut-il copier le Maroc ?
Non. L’Algérie peut construire un modèle différent, plus patrimonial et plus sélectif.

## Sources

- Ministère algérien du Tourisme — statistiques 2024 : https://www.mta.gov.dz
- Banque mondiale — données tourisme et économie : https://data.worldbank.org
- UNESCO — sites du patrimoine mondial en Algérie et au Maroc : https://whc.unesco.org
- Viva Algérie — Tourisme : /tourisme
`,
  },
  {
    slug: 'algeriens-attaches-independance',
    title: 'Pourquoi les Algériens sont si attachés à leur indépendance',
    description: 'Pourquoi l’indépendance occupe une place centrale dans l’identité algérienne : mémoire coloniale, souveraineté, dignité et culture politique.',
    category: 'culture',
    date: '2026-07-06',
    image: '/images/articles/independence-culture.svg',
    alt: 'Graphique éditorial neutre sur l’indépendance et l’identité algérienne',
    tags: ['indépendance algérienne', 'culture algérienne', 'souveraineté', 'mémoire'],
    body: `
L’attachement des Algériens à l’indépendance est l’une des clés pour comprendre le pays. Il ne s’agit pas seulement d’une date dans les manuels scolaires ni d’une cérémonie annuelle. L’indépendance est un langage politique, familial, culturel et émotionnel. Elle signifie la dignité retrouvée, la fin d’une domination coloniale longue et violente, et la possibilité de décider soi-même.

Cet attachement explique beaucoup de réactions algériennes contemporaines : sensibilité aux ingérences, méfiance envers les pressions extérieures, soutien aux causes d’autodétermination, valorisation de la souveraineté énergétique, importance de l’armée dans l’imaginaire national, et fierté devant les symboles de l’État.

## Une mémoire coloniale très présente

La colonisation française en Algérie a duré 132 ans. Elle a transformé la terre, le droit, la langue, l’économie, la citoyenneté et les hiérarchies sociales. La guerre de libération a ensuite été extrêmement coûteuse. Dans de nombreuses familles, la mémoire de la violence coloniale, des déplacements, de la prison, de la torture, de l’exil ou du sacrifice reste transmise par récits, silences et commémorations.

Cette mémoire rend l’indépendance concrète. Elle n’est pas une abstraction nationale. Elle se rattache à des noms, des villages, des quartiers, des martyrs, des anciens combattants et des familles marquées. Même les jeunes générations qui n’ont pas connu la colonisation héritent de cette histoire comme d’un socle identitaire.

## La souveraineté comme réflexe

En Algérie, la souveraineté est souvent perçue comme une protection. Elle signifie que les décisions du pays ne doivent pas être dictées de l’extérieur. Ce réflexe peut parfois produire une politique prudente, lente ou méfiante, mais il s’explique par une histoire où la dépossession a été vécue comme une réalité totale.

Cette culture politique aide à comprendre la position algérienne sur le Sahara occidental, la Palestine, l’énergie ou les alliances militaires. L’Algérie préfère apparaître comme un pays difficile à aligner plutôt que comme un pays facile à influencer. Pour beaucoup d’Algériens, cette posture est un motif de fierté.

## Une fierté populaire

L’indépendance se vit aussi dans la culture populaire : chants de stades, drapeaux aux balcons, mémoire du 1er Novembre, récits de moudjahidine, références à la Révolution, films, chansons chaâbi, raï patriotique, poésie et débats familiaux. Le drapeau algérien est souvent porté comme signe d’unité au-delà des divisions politiques.

Cette fierté ne signifie pas que les Algériens sont satisfaits de tout. On peut critiquer l’administration, l’économie, la corruption, le chômage ou les lenteurs publiques tout en restant profondément attaché à l’État national. C’est même une tension fréquente : aimer l’indépendance et exiger que le pays soit à la hauteur de ce qu’elle promet.

## Diaspora et transmission

Dans la diaspora, l’indépendance prend une autre forme. Elle devient une mémoire transmise à distance, parfois plus symbolique, parfois plus intense. Les enfants d’Algériens nés en France, au Canada, en Belgique ou ailleurs héritent d’un récit où l’Algérie est à la fois origine familiale, fierté, blessure coloniale et horizon culturel.

Cette transmission explique pourquoi les débats sur l’histoire franco-algérienne restent sensibles. Pour beaucoup, minimiser la colonisation revient à nier une part de l’identité familiale. À l’inverse, parler de l’indépendance avec respect ouvre un espace de reconnaissance.

## Un attachement qui doit rester ouvert

La fierté nationale peut être noble lorsqu’elle défend la dignité, la souveraineté et la mémoire. Elle devient dangereuse si elle se transforme en mépris des autres peuples. Être fier de l’Algérie ne suppose pas d’insulter les Marocains, les Français ou quiconque. La meilleure forme de patriotisme est celle qui rend plus exigeant, plus cultivé et plus responsable.

${commonMethod}

## FAQ

### Pourquoi l’indépendance est-elle si centrale en Algérie ?
Parce qu’elle met fin à une colonisation longue et violente, et qu’elle fonde la souveraineté de l’État moderne.

### Les jeunes générations y sont-elles encore attachées ?
Oui, même si elles expriment cet attachement autrement, à travers la culture, le sport, la diaspora et les débats publics.

### Peut-on critiquer l’Algérie tout en étant patriotique ?
Oui. La critique peut être une manière d’exiger que le pays soit à la hauteur de son histoire.

### La fierté nationale doit-elle opposer les peuples ?
Non. Elle doit défendre la dignité sans produire de haine envers d’autres nationalités.

## Sources

- Encyclopaedia Britannica — histoire de l’Algérie : https://www.britannica.com/place/Algeria
- Nations unies — décolonisation et autodétermination : https://www.un.org
- Archives nationales algériennes / mémoire nationale : https://www.archives-dgan.gov.dz
- Viva Algérie — Culture : /culture
`,
  },
];

for (const article of articles) {
  const frontmatter = `---
title: "${article.title.replaceAll('"', '\\"')}"
description: "${article.description.replaceAll('"', '\\"')}"
slug: "${article.slug}"
category: "${article.category}"
lang: "fr"
pubDate: ${article.date}
updatedDate: 2026-07-17
author: "Rédaction Viva Algérie"
image: "${article.image}"
imageAlt: "${article.alt.replaceAll('"', '\\"')}"
featured: ${article.featured ? 'true' : 'false'}
draft: false
translationKey: "${article.slug}"
tags: ${JSON.stringify(article.tags)}
---

> ${disclaimer}

`;

  const body = article.body.replace('\n## FAQ\n', `${enrichmentSection(article)}\n## FAQ\n`);
  writeFileSync(join(articleDir, `${article.slug}.md`), frontmatter + body.trim() + '\n');
}

console.log(`Generated ${articles.length} articles and ${Object.keys(images).length} SVG assets.`);
