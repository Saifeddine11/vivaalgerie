import { promises as fs } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';

const root = process.cwd();
const articleDir = path.join(root, 'src/content/articles/fr');
const imageDir = path.join(root, 'public/images/articles');
const cacheDir = path.join(root, '.cache/editorial-images');
const execFileAsync = promisify(execFile);

const sourceDefs = {
  'ws-desert-1': commons('Western Sahara desert 1.jpg', 'Wikimedia Commons — Western Sahara desert 1', 'https://commons.wikimedia.org/wiki/File:Western_Sahara_desert_1.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'ws-desert-2': commons('Western Sahara desert 2.jpg', 'Wikimedia Commons — Western Sahara desert 2', 'https://commons.wikimedia.org/wiki/File:Western_Sahara_desert_2.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'ws-desert-3': commons('Western Sahara desert 3.jpg', 'Wikimedia Commons — Western Sahara desert 3', 'https://commons.wikimedia.org/wiki/File:Western_Sahara_desert_3.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'ws-desert-4': commons('Western Sahara desert 4.jpg', 'Wikimedia Commons — Western Sahara desert 4', 'https://commons.wikimedia.org/wiki/File:Western_Sahara_desert_4.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'dakhla-bay': commons('Dakhla bay.jpg', 'Wikimedia Commons — Dakhla bay', 'https://commons.wikimedia.org/wiki/File:Dakhla_bay.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'tindouf-map': commons('Camps de réfugiés Tindouf.svg', 'Wikimedia Commons — Camps de réfugiés Tindouf', 'https://commons.wikimedia.org/wiki/File:Camps_de_r%C3%A9fugi%C3%A9s_Tindouf.svg', 'CC BY-SA 4.0', 'OpenStreetMap contributors, GrandEscogriffe'),
  'smara-camp': commons('Wilaya de Smara, en los campamentos de refugiados saharauis de Tinduf.jpg', 'Wikimedia Commons — Wilaya de Smara', 'https://commons.wikimedia.org/wiki/File:Wilaya_de_Smara,_en_los_campamentos_de_refugiados_saharauis_de_Tinduf.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'dajla-camp': commons('Awserdcamp.jpg', 'Wikimedia Commons — Awserd camp', 'https://commons.wikimedia.org/wiki/File:Awserdcamp.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'sahrawi-flag': commons('Flag of Western Sahara.svg', 'Wikimedia Commons — Flag of Western Sahara', 'https://commons.wikimedia.org/wiki/File:Flag_of_Western_Sahara.svg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'un-flag': commons('Flag of the United Nations.svg', 'Wikimedia Commons — Flag of the United Nations', 'https://commons.wikimedia.org/wiki/File:Flag_of_the_United_Nations.svg', 'Public domain / UN official document policy', 'United Nations / Wikimedia Commons'),
  'un-ga': commons('United Nations General Assembly 2024.jpg', 'Wikimedia Commons — United Nations General Assembly 2024', 'https://commons.wikimedia.org/wiki/File:United_Nations_General_Assembly_2024.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'un-hall': commons('UnitedNations GeneralAssemblyChamber.jpg', 'Wikimedia Commons — UN General Assembly chamber', 'https://commons.wikimedia.org/wiki/File:UnitedNations_GeneralAssemblyChamber.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'algeria-morocco-locator': commons('Algeria Morocco Locator.svg', 'Wikimedia Commons — Algeria Morocco Locator', 'https://commons.wikimedia.org/wiki/File:Algeria_Morocco_Locator.svg', 'Wikimedia Commons license page', 'M.Bitton'),
  'frontier-1963': commons('Frontière Maroc-Algérie 1963.svg', 'Wikimedia Commons — Frontière Maroc-Algérie 1963', 'https://commons.wikimedia.org/wiki/File:Fronti%C3%A8re_Maroc-Alg%C3%A9rie_1963.svg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'alg-mor-frontier': commons('Algerian-Moroccan Frontier.svg', 'Wikimedia Commons — Algerian-Moroccan Frontier', 'https://commons.wikimedia.org/wiki/File:Algerian-Moroccan_Frontier.svg', 'CC BY-SA 3.0', 'Wikimedia Commons contributors'),
  'marsa-border': commons("Marsa Ben M'Hidi - 20240222 110124.jpg", "Wikimedia Commons — Marsa Ben M'Hidi", 'https://commons.wikimedia.org/wiki/File:Marsa_Ben_M%27Hidi_-_20240222_110124.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'algeria-spanish-boundary': commons('Algeria-Spanish Sahara boundary. LOC 84692346.jpg', 'Library of Congress map via Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Algeria-Spanish_Sahara_boundary._LOC_84692346.jpg', 'Public domain / Library of Congress', 'U.S. Department of State / Library of Congress'),
  'algeria-flag': commons('Flag of Algeria.svg', 'Wikimedia Commons — Flag of Algeria', 'https://commons.wikimedia.org/wiki/File:Flag_of_Algeria.svg', 'Public domain / official flag', 'National Liberation Front of Algeria; vector SKopp'),
  'morocco-flag': commons('Flag of Morocco.svg', 'Wikimedia Commons — Flag of Morocco', 'https://commons.wikimedia.org/wiki/File:Flag_of_Morocco.svg', 'Public domain / official flag', 'Wikimedia Commons contributors'),
  'palestine-flag': commons('Flag of Palestine.svg', 'Wikimedia Commons — Flag of Palestine', 'https://commons.wikimedia.org/wiki/File:Flag_of_Palestine.svg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'martyrs': commons('Martyrs Memorial. Algiers, Algeria.jpg', 'Wikimedia Commons — Martyrs Memorial, Algiers', 'https://commons.wikimedia.org/wiki/File:Martyrs_Memorial._Algiers,_Algeria.jpg', 'CC BY-SA 3.0', 'Boumediene15'),
  'hassi-rmel': commons('Hassi Rmel حاسي الرمل.jpg', "Wikimedia Commons — Hassi R'Mel", 'https://commons.wikimedia.org/wiki/File:Hassi_Rmel_%D8%AD%D8%A7%D8%B3%D9%8A_%D8%A7%D9%84%D8%B1%D9%85%D9%84.jpg', 'CC BY-SA 4.0', 'Habib Kaki'),
  'hybrid-power': commons('Hybrid Power Plant in Laghouat Province, Algeria.jpg', 'Wikimedia Commons — Hybrid Power Plant in Laghouat Province', 'https://commons.wikimedia.org/wiki/File:Hybrid_Power_Plant_in_Laghouat_Province,_Algeria.jpg', 'Wikimedia Commons license page', 'Mohand Ouali / Wikimedia Commons'),
  'arzew': commons('Arzew.jpg', 'Wikimedia Commons — Arzew', 'https://commons.wikimedia.org/wiki/File:Arzew.jpg', 'CC BY 2.0', 'Maya-Anais Yataghene'),
  'arzew-port': commons('LE NAVIRE LPG BERGA 2 A ARZEW.jpg', 'Wikimedia Commons — Port of Arzew', 'https://commons.wikimedia.org/wiki/File:LE_NAVIRE_LPG_BERGA_2_A_ARZEW.jpg', 'Wikimedia Commons license page', 'OULAHCENE SOFIANE'),
  'hassan2': commons('Hassan II Mosque - general framing, Casablanca, Morocco.jpg', 'Wikimedia Commons — Hassan II Mosque, Casablanca', 'https://commons.wikimedia.org/wiki/File:Hassan_II_Mosque_-_general_framing,_Casablanca,_Morocco.jpg', 'CC BY 4.0', 'Tinuzzo'),
  'marrakesh': commons('Marrakesh Jemaa El Fna.jpg', 'Wikimedia Commons — Marrakesh Jemaa El Fna', 'https://commons.wikimedia.org/wiki/File:Marrakesh_Jemaa_El_Fna.jpg', 'Public domain', 'Henrique Matos'),
  'rabat': commons('Rabat Morocco.jpg', 'Wikimedia Commons — Rabat Morocco', 'https://commons.wikimedia.org/wiki/File:Rabat_Morocco.jpg', 'CC0', 'Taha ahh'),
  'local-algiers': local('hero-alger-front-de-mer.webp', 'Front de mer d’Alger — Ludovic Courtès / Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Alger-Belcourt-front-de-mer.jpg', 'Wikimedia Commons license page', 'Ludovic Courtès'),
  'local-grande-poste': local('pourquoi-investir-immobilier-alger.webp', 'Grande Poste d’Alger — Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Grande_Poste_d%27Alger.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'local-constantine': local('alger-oran-constantine-investir.webp', 'Constantine — Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Constantine,_Algeria.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'local-oran': local('algerie-2030-infrastructures-opportunites.webp', 'Oran et son littoral — Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:ORAN_City_%26_Coast.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'local-tipaza': local('tourisme-villes-cotieres-algerie.webp', 'Littoral de Tipaza — Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Tipaza_Corne_d%27or.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
  'local-bejaia': local('tipaza-bejaia-oran-zones-a-suivre.webp', 'Baie de Béjaïa — Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:B%C3%A9ja%C3%AFa.jpg', 'Wikimedia Commons license page', 'Wikimedia Commons contributors'),
};

const articles = {
  'sahara-occidental-algerie-autodetermination': cfg('ws-desert-1', 'Paysage désertique du Sahara occidental', [
    img('tindouf-map', 'Carte des camps de réfugiés sahraouis près de Tindouf', 'La géographie du dossier commence aussi dans les camps de réfugiés sahraouis autour de Tindouf.'),
    img('smara-camp', 'Camp de réfugiés sahraouis de Smara près de Tindouf', 'La dimension humaine du conflit explique pourquoi Alger parle d’autodétermination et pas seulement de diplomatie.'),
    img('un-flag', 'Drapeau des Nations unies', 'Le processus onusien reste central pour comprendre la position algérienne sur l’autodétermination.'),
  ], {
    facts: ['L’Algérie ne revendique pas le territoire pour elle-même.', 'Le Sahara occidental reste inscrit par l’ONU parmi les territoires non autonomes.', 'Le Maroc défend l’autonomie sous souveraineté marocaine ; le Polisario revendique l’indépendance.'],
    timeline: ['1963 : le territoire est inscrit dans les dossiers onusiens de décolonisation.', '1991 : création de la MINURSO après le cessez-le-feu.', '2025 : le Conseil de sécurité renouvelle encore le mandat de la mission.'],
    positions: 'La position algérienne insiste sur un choix libre du peuple sahraoui. La position marocaine affirme la souveraineté du royaume et propose l’autonomie. La position du Polisario demande l’indépendance comme option réelle. Le cadre de l’ONU, lui, maintient la recherche d’une solution politique négociée.',
    importance: 'Pour Alger, ce dossier parle directement de mémoire anticoloniale. Il rappelle que l’indépendance algérienne s’est construite autour du droit des peuples à disposer d’eux-mêmes. C’est pourquoi la question dépasse le calcul diplomatique immédiat.',
    takeaway: 'La clé de lecture n’est pas de choisir une formule rapide, mais de comprendre pourquoi l’autodétermination reste le mot central du vocabulaire algérien.',
  }),
  'a-qui-appartient-sahara-occidental': cfg('ws-desert-2', 'Paysage du Sahara occidental illustrant un territoire disputé', [
    img('algeria-spanish-boundary', 'Carte historique de la frontière Algérie-Sahara espagnol', 'Les cartes historiques rappellent que le dossier est né dans le contexte de la décolonisation espagnole.'),
    img('un-ga', 'Assemblée générale des Nations unies', 'La réponse juridique ne se construit pas sur un slogan, mais dans un processus international toujours ouvert.'),
    img('dakhla-bay', 'Baie de Dakhla au Sahara occidental', 'Le territoire est aussi un espace vécu, côtier et saharien, pas seulement une surface sur une carte.'),
  ], {
    facts: ['L’ONU ne présente pas le statut final comme définitivement réglé.', 'Le Maroc contrôle la majeure partie du territoire.', 'Le Polisario revendique un État sahraoui ; l’Algérie soutient l’autodétermination.'],
    timeline: ['1884 : début de la présence coloniale espagnole dans la région.', '1975-1976 : retrait espagnol et entrée dans une nouvelle phase du conflit.', 'Depuis 1991 : processus onusien sans référendum organisé.'],
    positions: 'Rabat parle d’intégrité territoriale. Le Polisario parle de libération nationale. Alger parle de décolonisation et de consultation du peuple concerné. Les Nations unies continuent de traiter le dossier comme une question politique internationale.',
    importance: 'La question “à qui appartient ?” attire parce qu’elle semble simple. Elle est pourtant trompeuse : le conflit oppose contrôle territorial, reconnaissance diplomatique, droit à l’autodétermination et récits nationaux.',
    takeaway: 'La formulation la plus précise reste celle d’un territoire disputé dont le statut final demeure contesté au niveau international.',
  }),
  'pourquoi-algerie-maroc-conflit': cfg('marsa-border', 'Marsa Ben M’Hidi, localité algérienne proche de la frontière marocaine', [
    img('algeria-morocco-locator', 'Carte localisant l’Algérie et le Maroc au Maghreb', 'Avant les crises diplomatiques, il y a une géographie : deux États voisins, liés et rivaux.'),
    img('alg-mor-frontier', 'Carte schématique de la frontière algéro-marocaine', 'La frontière fermée depuis 1994 reste le symbole concret du blocage.'),
    img('algeria-flag', 'Drapeau de l’Algérie', 'Le débat algérien est structuré par la souveraineté, la mémoire de l’indépendance et la sécurité.'),
  ], {
    facts: ['La rivalité précède le dossier du Sahara occidental.', 'La frontière terrestre est fermée depuis 1994.', 'La rupture diplomatique de 2021 a officialisé une crise déjà profonde.'],
    timeline: ['1963 : Guerre des Sables.', '1994 : fermeture de la frontière terrestre.', '2021 : rupture des relations diplomatiques par Alger.'],
    positions: 'L’Algérie met en avant la souveraineté, la sécurité et l’autodétermination sahraouie. Le Maroc met en avant l’intégrité territoriale, la réouverture de la frontière et son plan d’autonomie. Les sociétés, elles, restent liées par la culture, les familles et la proximité linguistique.',
    importance: 'Ce conflit bloque une partie de l’avenir maghrébin. Commerce, mobilité, coopération sécuritaire et projets régionaux restent prisonniers d’une défiance d’État à État.',
    takeaway: 'Il faut critiquer les politiques sans transformer les peuples en adversaires. C’est la condition d’une lecture sérieuse.',
  }),
  'guerre-des-sables-1963': cfg('frontier-1963', 'Carte de la frontière Maroc-Algérie en 1963', [
    img('algeria-spanish-boundary', 'Carte historique de la région frontalière au temps du Sahara espagnol', 'Le conflit de 1963 se comprend dans une géographie postcoloniale encore instable.'),
    img('marsa-border', 'Vue de Marsa Ben M’Hidi près de la frontière algéro-marocaine', 'La frontière n’est pas une abstraction : elle traverse des localités, des familles et des imaginaires politiques.'),
    img('algeria-morocco-locator', 'Carte de localisation de l’Algérie et du Maroc', 'La Guerre des Sables est courte, mais elle installe une méfiance durable entre deux voisins.'),
  ], {
    facts: ['La guerre éclate peu après l’indépendance algérienne.', 'Elle porte sur des zones frontalières sensibles comme Béchar et Tindouf.', 'Sa durée militaire est limitée, mais son héritage politique est considérable.'],
    timeline: ['1962 : indépendance de l’Algérie.', '1963 : affrontements frontaliers entre l’Algérie et le Maroc.', 'Après 1963 : la méfiance devient un élément durable de la relation bilatérale.'],
    positions: 'Alger défend l’intangibilité des frontières héritées de l’indépendance. Rabat s’appuie alors sur des revendications historiques. L’épisode nourrit deux mémoires nationales qui ne racontent pas la même blessure.',
    importance: 'Pour les Algériens, 1963 est souvent lu comme une épreuve imposée à un État à peine né. Cette mémoire pèse encore dans la manière dont Alger interprète les crises ultérieures.',
    takeaway: 'Comprendre 1963, c’est comprendre que la rivalité Algérie–Maroc ne commence pas avec les réseaux sociaux ni même avec la rupture de 2021.',
  }),
  'front-polisario-sahraouis-revendications': cfg('smara-camp', 'Camp de réfugiés sahraouis de Smara près de Tindouf', [
    img('sahrawi-flag', 'Drapeau sahraoui', 'Le symbole national sahraoui renvoie à une revendication politique : l’autodétermination.'),
    img('ws-desert-2', 'Paysage désertique du Sahara occidental', 'Le territoire et l’exil sahraoui s’inscrivent dans une géographie saharienne vaste et difficile.'),
    img('tindouf-map', 'Carte des camps sahraouis autour de Tindouf', 'La question sahraouie est aussi une question de réfugiés, d’espace et de durée.'),
  ], {
    facts: ['Le Front Polisario est fondé en 1973.', 'Il revendique l’autodétermination avec l’indépendance comme option.', 'Le Maroc conteste sa représentation exclusive des Sahraouis.'],
    timeline: ['1973 : création du Front Polisario.', '1976 : proclamation de la République arabe sahraouie démocratique.', '1991 : cessez-le-feu et création de la MINURSO.'],
    positions: 'Le Polisario se présente comme mouvement de libération. Le Maroc le décrit comme un mouvement séparatiste soutenu par Alger. L’Algérie soutient sa revendication d’autodétermination sans revendiquer le territoire.',
    importance: 'Le sujet compte pour l’Algérie parce qu’il relie diplomatie, mémoire anticoloniale et accueil de réfugiés sahraouis. Il ne peut pas être réduit à une rivalité abstraite avec Rabat.',
    takeaway: 'Parler des Sahraouis oblige à tenir ensemble représentation politique, diversité sociale et réalité des camps.',
  }),
  'minurso-onu-sahara-occidental': cfg('un-ga', 'Assemblée générale des Nations unies', [
    img('un-flag', 'Drapeau des Nations unies', 'La MINURSO est d’abord un instrument du Conseil de sécurité, pas une initiative bilatérale.'),
    img('tindouf-map', 'Carte des camps de réfugiés sahraouis autour de Tindouf', 'Le mandat onusien se déploie dans un conflit qui a aussi une profondeur humanitaire.'),
    img('ws-desert-1', 'Route et paysage désertique au Sahara occidental', 'Sur le terrain, la mission évolue dans un environnement vaste, fragmenté et sensible.'),
  ], {
    facts: ['La MINURSO est créée en 1991.', 'Le référendum prévu n’a pas été organisé.', 'Le mandat reste renouvelé par le Conseil de sécurité.'],
    timeline: ['1991 : résolution 690 et naissance de la mission.', '2020 : rupture du cessez-le-feu selon les rapports onusiens.', '2025 : renouvellement du mandat jusqu’en 2026.'],
    positions: 'Le Polisario et l’Algérie voient la mission comme rappel du caractère international du dossier. Le Maroc insiste sur une solution politique réaliste autour de l’autonomie. L’ONU cherche à maintenir un cadre de discussion et de surveillance.',
    importance: 'Pour Alger, la MINURSO empêche que le conflit soit présenté comme un dossier strictement interne marocain. Elle maintient une scène internationale, même imparfaite.',
    takeaway: 'La présence de l’ONU ne règle pas le conflit, mais elle prouve que le dossier n’est pas sorti du champ international.',
  }),
  'algerie-vs-maroc-visions-maghreb': cfg('algeria-morocco-locator', 'Carte localisant l’Algérie et le Maroc', [
    img('local-algiers', 'Front de mer d’Alger', 'L’Algérie pèse par sa profondeur territoriale, son énergie et sa mémoire politique.'),
    img('frontier-1963', 'Carte de la frontière Maroc-Algérie en 1963', 'La rivalité contemporaine garde des traces frontalières et historiques profondes.'),
    img('local-constantine', 'Vue de Constantine en Algérie', 'Comparer les deux pays suppose de regarder les territoires, pas seulement les indicateurs.'),
  ], {
    facts: ['L’Algérie dispose d’un levier énergétique majeur.', 'Le Maroc a construit une marque touristique et diplomatique très visible.', 'La rivalité coûte cher à l’intégration maghrébine.'],
    timeline: ['1963 : première rupture de confiance frontalière.', '1994 : fermeture de la frontière.', 'Depuis 2020 : intensification de la bataille diplomatique autour du Sahara occidental.'],
    positions: 'L’Algérie privilégie souveraineté, non-alignement relatif et autodétermination. Le Maroc privilégie diplomatie d’accords, projection économique et reconnaissance de son plan d’autonomie. Ces deux visions peuvent coexister sur certains sujets, mais s’opposent frontalement sur d’autres.',
    importance: 'Pour les lecteurs algériens, la comparaison doit éviter le complexe comme l’arrogance. L’Algérie a des forces réelles ; elle a aussi des défis de diversification, de services et d’attractivité.',
    takeaway: 'Le vrai enjeu n’est pas le score émotionnel d’un “match”, mais le modèle que chaque pays construit pour les décennies à venir.',
  }),
  'algerie-sahara-occidental-decolonisation': cfg('local-grande-poste', 'Grande Poste d’Alger, symbole civique de la capitale algérienne', [
    img('un-flag', 'Drapeau des Nations unies', 'La notion de décolonisation renvoie aux textes et aux procédures de l’ONU.'),
    img('ws-desert-2', 'Paysage désertique du Sahara occidental', 'Le territoire reste au cœur d’un débat entre contrôle, reconnaissance et autodétermination.'),
    img('local-grande-poste', 'Grande Poste d’Alger', 'La position algérienne se lit aussi à travers une culture politique façonnée par l’indépendance.'),
  ], {
    facts: ['Le Sahara occidental figure sur la liste onusienne des territoires non autonomes.', 'L’Algérie parle de décolonisation inachevée.', 'Le Maroc refuse cette qualification et défend l’intégrité territoriale.'],
    timeline: ['1963 : inscription du territoire par l’ONU.', '1976 : fin de la présence espagnole.', 'Depuis 1991 : mission de l’ONU sans référendum abouti.'],
    positions: 'Alger insiste sur la résolution de la décolonisation par le choix du peuple. Rabat conteste l’idée de colonisation et défend l’autonomie. Le Polisario demande l’indépendance comme option. L’ONU maintient un processus politique.',
    importance: 'Pour l’Algérie, la décolonisation n’est pas un mot décoratif. C’est le cœur de sa légitimité historique et de sa doctrine extérieure.',
    takeaway: 'Le désaccord principal porte sur la question suivante : une autonomie sous souveraineté marocaine suffit-elle à l’autodétermination ? Alger répond non.',
  }),
  'algerie-palestine-diplomatie-autodetermination': cfg('algeria-flag', 'Drapeau national de l’Algérie', [
    img('un-flag', 'Drapeau des Nations unies', 'La cause palestinienne est l’une des causes d’autodétermination les plus présentes dans l’opinion algérienne.'),
    img('un-ga', 'Assemblée générale des Nations unies', 'La diplomatie algérienne inscrit souvent ces dossiers dans le vocabulaire du droit international.'),
    img('local-algiers', 'Front de mer d’Alger', 'La mémoire de l’indépendance donne une résonance particulière aux causes de libération.'),
  ], {
    facts: ['La Palestine occupe une place forte dans la culture politique algérienne.', 'L’Algérie relie souvent Palestine et Sahara occidental par le principe d’autodétermination.', 'Cette solidarité doit rester politique, jamais identitaire ou haineuse.'],
    timeline: ['1962 : l’Algérie indépendante fait de l’anticolonialisme un axe diplomatique.', '1974-1988 : montée de la reconnaissance internationale de la représentation palestinienne puis proclamation palestinienne à Alger.', 'Aujourd’hui : la cause reste très présente dans l’opinion.'],
    positions: 'Alger défend les droits nationaux palestiniens. Les Nations unies traitent la question dans de multiples résolutions. Les débats internationaux opposent sécurité, souveraineté, occupation, reconnaissance et droit des peuples.',
    importance: 'Ce sujet explique la cohérence d’une partie de la diplomatie algérienne : parler au nom de peuples considérés comme privés d’un État ou d’un choix politique libre.',
    takeaway: 'La solidarité est plus forte lorsqu’elle reste précise : défendre des droits, critiquer des politiques, refuser la haine.',
  }),
  'algerie-energie-souverainete-gaz': cfg('local-oran', 'Oran et son littoral industriel et portuaire', [
    img('local-oran', 'Vue d’Oran et de son littoral', 'L’énergie algérienne s’inscrit dans une géographie méditerranéenne, portuaire et industrielle.'),
    img('local-algiers', 'Front de mer d’Alger', 'La souveraineté énergétique se lit aussi à travers l’organisation de l’État et des infrastructures nationales.'),
    img('local-grande-poste', 'Grande Poste d’Alger', 'Le gaz est un levier géopolitique, mais aussi une question de financement public et de choix économiques.'),
  ], {
    facts: ['L’Algérie est l’un des grands producteurs africains de gaz naturel.', 'Le gaz soutient les recettes publiques et l’influence énergétique.', 'La diversification reste le défi central.'],
    timeline: ['1963 : création de Sonatrach.', 'Années 1970-2000 : construction d’un rôle gazier méditerranéen.', 'Depuis 2022 : regain d’attention européenne pour les fournisseurs fiables.'],
    positions: 'Alger présente l’énergie comme une souveraineté. Les partenaires européens la regardent comme une sécurité d’approvisionnement. Les économistes rappellent que la rente doit financer la diversification.',
    importance: 'Pour l’Algérie, le gaz donne du temps, des recettes et une capacité de négociation. Mais il ne remplace pas l’industrie, l’innovation et l’emploi productif.',
    takeaway: 'Le gaz est un levier, pas un projet complet. La question décisive est ce que l’Algérie construit avec cette rente.',
  }),
  'algerie-maroc-potentiel-touristique': cfg('local-tipaza', 'Littoral et patrimoine de Tipaza en Algérie', [
    img('local-bejaia', 'Baie de Béjaïa en Algérie', 'Le potentiel algérien tient à la diversité du littoral, des villes et des paysages.'),
    img('algeria-morocco-locator', 'Carte localisant l’Algérie et le Maroc', 'La comparaison touristique oppose deux modèles nationaux plus qu’une simple liste de destinations.'),
    img('local-oran', 'Oran et son littoral', 'L’Algérie peut développer un modèle plus patrimonial, saharien et méditerranéen.'),
  ], {
    facts: ['Le Maroc est aujourd’hui plus performant en accueil touristique international.', 'L’Algérie possède un potentiel naturel et patrimonial considérable.', 'La qualité de service et la lisibilité de l’offre feront la différence.'],
    timeline: ['Années 2000-2020 : montée en puissance du marketing touristique marocain.', '2024 : l’Algérie annonce plus de 3,5 millions de visiteurs.', 'Prochaine décennie : enjeu de structuration de l’offre algérienne.'],
    positions: 'Le Maroc mise sur l’expérience touristique déjà packagée. L’Algérie peut miser sur la rareté, l’authenticité, le Sahara, les villes historiques et le littoral. Les deux modèles ne répondent pas exactement au même imaginaire.',
    importance: 'Pour l’Algérie, le tourisme n’est pas seulement une question d’image. Il peut soutenir les territoires, l’emploi local, les services et la diaspora.',
    takeaway: 'L’Algérie n’a pas besoin de copier le Maroc. Elle doit transformer son potentiel en parcours fiable pour le voyageur.',
  }),
  'algeriens-attaches-independance': cfg('local-algiers', 'Front de mer d’Alger et baie de la capitale algérienne', [
    img('algeria-flag', 'Drapeau de l’Algérie', 'Le drapeau condense l’attachement populaire à la souveraineté et à la mémoire nationale.'),
    img('local-grande-poste', 'Grande Poste d’Alger', 'L’identité algérienne se vit aussi dans les lieux urbains, les symboles et la mémoire quotidienne.'),
    img('local-oran', 'Oran et son littoral', 'L’indépendance est une histoire politique, mais aussi une manière d’habiter le pays et de le raconter.'),
  ], {
    facts: ['L’indépendance est un socle identitaire, pas seulement une date historique.', 'La mémoire coloniale structure encore beaucoup de débats publics.', 'La fierté nationale peut rester ouverte et respectueuse des autres peuples.'],
    timeline: ['1830-1962 : colonisation française.', '1954-1962 : guerre de libération.', '5 juillet 1962 : indépendance nationale.'],
    positions: 'Pour beaucoup d’Algériens, la souveraineté est une protection contre la dépossession. Pour la diaspora, elle devient une mémoire transmise à distance. Pour les historiens, elle reste un champ de débat, de documents et de récits familiaux.',
    importance: 'Comprendre cet attachement aide à lire la diplomatie, le rapport à l’énergie, la sensibilité aux ingérences et le soutien aux causes d’autodétermination.',
    takeaway: 'La meilleure fierté nationale n’a pas besoin de mépris. Elle donne envie d’être plus exigeant avec son propre pays.',
  }),
};

function commons(fileName, label, sourceUrl, license, credit) {
  return {
    fileName,
    label,
    sourceUrl,
    license,
    credit,
    url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`,
  };
}

function local(fileName, label, sourceUrl, license, credit) {
  return {
    fileName,
    label,
    sourceUrl,
    license,
    credit,
    localPath: path.join(imageDir, fileName),
  };
}

function img(source, alt, caption) {
  return { source, alt, caption };
}

function cfg(coverSource, coverAlt, inline, text) {
  return { coverSource, coverAlt, inline, text };
}

await fs.mkdir(imageDir, { recursive: true });
await fs.mkdir(cacheDir, { recursive: true });

const docs = [];

for (const [slug, config] of Object.entries(articles)) {
  const coverName = `${slug}-cover.webp`;
  await makeImage(config.coverSource, coverName, 1600);

  const coverDef = sourceDefs[config.coverSource];
  const articlePath = path.join(articleDir, `${slug}.md`);
  const raw = await fs.readFile(articlePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`No frontmatter in ${slug}`);

  let fm = match[1];
  let body = match[2];

  fm = setYamlString(fm, 'image', `/images/articles/${coverName}`);
  fm = setYamlString(fm, 'heroImage', `/images/articles/${coverName}`);
  fm = setYamlString(fm, 'imageAlt', config.coverAlt);
  fm = setYamlString(fm, 'imageCredit', coverDef.credit);
  fm = setYamlString(fm, 'imageSource', coverDef.sourceUrl);

  body = body.replace(/<!-- visual-upgrade:start -->[\s\S]*?<!-- visual-upgrade:end -->\n?/g, '');
  body = body.replace(/\n## Repères éditoriaux pour aller plus loin[\s\S]*?(?=\n## FAQ\n)/, '\n');

  const imageFiles = [];
  for (const [idx, image] of config.inline.entries()) {
    const fileName = `${slug}-${String(idx + 1).padStart(2, '0')}.webp`;
    await makeImage(image.source, fileName, 1200);
    imageFiles.push({ ...image, fileName });
  }

  const visualBlock = buildVisualBlock(config, imageFiles);
  if (body.includes('\n## FAQ\n')) {
    body = body.replace('\n## FAQ\n', `\n${visualBlock}\n## FAQ\n`);
  } else if (body.includes('\n## Sources\n')) {
    body = body.replace('\n## Sources\n', `\n${visualBlock}\n## Sources\n`);
  } else {
    body += `\n${visualBlock}\n`;
  }

  await fs.writeFile(articlePath, `---\n${fm}\n---\n${body.trim()}\n`);

  docs.push({
    slug,
    coverName,
    cover: coverDef,
    inline: imageFiles.map((image) => ({
      fileName: image.fileName,
      alt: image.alt,
      source: sourceDefs[image.source],
    })),
  });
}

await updateImagesDoc(docs);
console.log(`Upgraded ${Object.keys(articles).length} geopolitical articles with covers and inline images.`);

async function makeImage(sourceKey, outputName, width) {
  const source = sourceDefs[sourceKey];
  if (!source) throw new Error(`Unknown source ${sourceKey}`);
  const out = path.join(imageDir, outputName);
  let input;
  if (source.localPath) {
    input = source.localPath;
  } else {
    input = path.join(cacheDir, source.fileName.replace(/[^\p{L}\p{N}._-]+/gu, '_'));
    if (!existsSync(input)) {
      await execFileAsync('curl', [
        '-L',
        '-A',
        'VivaAlgerieEditorialQA/1.0',
        source.url,
        '-o',
        input,
      ]);
    }
  }

  await sharp(input, { limitInputPixels: false })
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(out);
}

function setYamlString(fm, key, value) {
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const line = `${key}: "${escaped}"`;
  const pattern = new RegExp(`^${key}:.*$`, 'm');
  return pattern.test(fm) ? fm.replace(pattern, line) : `${fm}\n${line}`;
}

function buildVisualBlock(config, images) {
  const { facts, timeline, positions, importance, takeaway } = config.text;
  return `<!-- visual-upgrade:start -->
## Ce qu’il faut savoir en 30 secondes

<div class="key-facts">
  <ul>
${facts.map((fact) => `    <li>${escapeHtml(fact)}</li>`).join('\n')}
  </ul>
</div>

${figure(images[0])}

## Les dates clés à garder en tête

${timeline.map(formatTimelineItem).join('\n')}

Ces repères ne suffisent pas à eux seuls, mais ils évitent une lecture hors sol. Ils montrent que le sujet s’est construit par couches successives : contexte colonial, décisions d’État, positions diplomatiques, blocages institutionnels et perception populaire.

${figure(images[1])}

## Ce que disent les différentes positions

${positions}

## Les angles à ne pas confondre

Le premier angle est juridique. Il demande de partir des statuts, des résolutions, des mandats et des textes publics, même lorsque le débat médiatique préfère les formules rapides. Dans ce dossier, un raccourci peut donner l’impression de clarifier alors qu’il efface souvent la question centrale : qui parle, au nom de quel droit, et avec quelle reconnaissance ?

Le deuxième angle est diplomatique. Les États ne parlent pas seulement pour décrire le réel ; ils parlent aussi pour défendre une stratégie, rassurer leur opinion, envoyer des signaux à leurs partenaires et inscrire leur position dans un rapport de force. C’est pourquoi une déclaration officielle doit être lue comme une source utile, mais aussi comme un acte politique.

Le troisième angle est humain. Derrière les mots de souveraineté, de frontière, d’autonomie, de décolonisation ou de sécurité, il existe des familles, des territoires, des attentes sociales et des mémoires blessées. Une analyse sérieuse doit donc éviter deux erreurs symétriques : réduire le sujet à une pure procédure, ou le transformer en passion sans preuves.

> La force d’une lecture pro-algérienne n’est pas de simplifier le dossier. Elle est de montrer pourquoi l’argument algérien existe, sur quelles sources il s’appuie, et où il rencontre les positions adverses ou les limites du terrain.

## Pourquoi ce sujet compte pour l’Algérie

${importance}

Dans l’espace public algérien, ces dossiers ne sont jamais seulement techniques. Ils parlent de mémoire, de souveraineté, de dignité, de sécurité et d’influence régionale. C’est pourquoi ils suscitent autant de réactions : ils touchent à la manière dont l’Algérie se voit elle-même et dont elle veut être reconnue.

## Ce que la perspective algérienne ajoute

La perspective algérienne ajoute d’abord une mémoire. Elle rappelle qu’un pays sorti d’une colonisation longue et violente lit rarement les questions de territoire, de statut et de représentation comme de simples disputes administratives. Ce réflexe peut être discuté, mais il ne peut pas être ignoré : il organise une partie de la sensibilité nationale.

Elle ajoute ensuite une exigence de souveraineté. Dans les dossiers régionaux, Alger cherche à éviter la dépendance stratégique, la tutelle diplomatique et les solutions perçues comme imposées de l’extérieur. Cette exigence explique une partie de la prudence algérienne, mais aussi certaines rigidités qui frustrent les partisans d’un compromis rapide.

Elle ajoute enfin une question de crédibilité. Défendre un principe dans la durée oblige à rester précis, à vérifier les sources et à ne pas confondre solidarité avec slogan. C’est sur ce terrain que l’analyse peut être utile : elle permet de soutenir une ligne sans perdre l’exigence intellectuelle qui la rend crédible.

${figure(images[2])}

## Les questions à poser avant de conclure

Avant de conclure, le lecteur peut poser quatre questions simples. Le statut évoqué est-il reconnu par une institution, revendiqué par un acteur, ou seulement répété dans le débat public ? La chronologie permet-elle de comprendre l’origine du désaccord, ou bien commence-t-elle au moment le plus favorable à une seule partie ? Les sources citées décrivent-elles un fait vérifiable, une position diplomatique ou une interprétation éditoriale ? Enfin, la comparaison régionale aide-t-elle vraiment à comprendre le dossier, ou sert-elle seulement à produire une victoire symbolique ?

Ces questions ralentissent la lecture, mais elles l’améliorent. Elles évitent de confondre rapidité et lucidité, surtout quand un sujet touche à la fierté nationale. Elles permettent aussi de construire un contenu plus utile pour les lecteurs venus de Google : quelqu’un qui cherche une réponse claire doit trouver des repères, des images, des définitions, des nuances et des liens vers les sources, pas seulement une opinion.

## Comment éviter les lectures de propagande

Une lecture propagandiste commence souvent par une conclusion et sélectionne ensuite les faits qui l’arrangent. Une lecture éditoriale solide fait l’inverse : elle part des documents disponibles, nomme les acteurs, distingue les faits des revendications et accepte que certaines zones restent disputées. Cette différence change tout, surtout sur les sujets où l’émotion nationale est forte.

Il faut aussi surveiller le vocabulaire. Certains mots éclairent ; d’autres enferment. Employer systématiquement des termes insultants ou absolus peut donner une impression de fermeté, mais cela affaiblit l’analyse, car le lecteur ne sait plus ce qui relève du fait, du jugement ou de la mobilisation. Viva Algérie privilégie donc un vocabulaire ferme quand il le faut, mais vérifiable et lisible.

Enfin, il faut résister à la comparaison paresseuse. L’Algérie, le Maroc, le Sahara occidental, la Palestine, l’ONU, les marchés de l’énergie ou le tourisme ne se résument pas à des classements de réseaux sociaux. Chaque dossier a son histoire, ses institutions, ses acteurs et ses temporalités. Les relier peut être pertinent ; les mélanger sans méthode produit surtout du bruit.

## Ce qu’il faut retenir

${takeaway}

Une bonne lecture doit donc garder deux exigences en même temps : une perspective claire, assumée, attentive aux arguments algériens ; et une discipline de preuve qui distingue les faits, les revendications, les soutiens diplomatiques et les interprétations. C’est cette combinaison qui rend l’article utile pour le référencement naturel comme pour le lecteur réel : des mots-clés précis, une structure claire, mais surtout une analyse qui donne envie de comprendre plutôt que de seulement réagir.
<!-- visual-upgrade:end -->`;
}

function figure(image) {
  const source = sourceDefs[image.source];
  return `<figure class="article-figure">
  <img src="/images/articles/${image.fileName}" alt="${escapeHtml(image.alt)}" loading="lazy" />
  <figcaption>${escapeHtml(image.caption)} <span>Source : <a href="${source.sourceUrl}">${escapeHtml(source.credit)}</a>.</span></figcaption>
</figure>`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTimelineItem(value) {
  const [lead, ...rest] = value.split(' : ');
  if (!rest.length) return `- ${value}`;
  return `- **${lead} :** ${rest.join(' : ')}`;
}

async function updateImagesDoc(docs) {
  const docPath = path.join(root, 'IMAGES.md');
  let content = await fs.readFile(docPath, 'utf8');
  const start = '<!-- geopolitical-image-upgrade:start -->';
  const end = '<!-- geopolitical-image-upgrade:end -->';
  const rows = [];

  for (const item of docs) {
    rows.push(row(item.slug, item.coverName, 'Cover', item.cover));
    for (const inline of item.inline) {
      rows.push(row(item.slug, inline.fileName, 'Inline', inline.source, inline.alt));
    }
  }

  const section = `${start}

## Geopolitical Article Image Upgrade

| Article | Image file | Usage | Source | License / Permission | Credit required | Alt text | Status |
|---|---|---|---|---|---|---|---|
${rows.join('\n')}

${end}`;

  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  content = re.test(content) ? content.replace(re, section) : `${content.trim()}\n\n${section}\n`;
  await fs.writeFile(docPath, content);
}

function row(slug, fileName, usage, source, alt = '') {
  const safeAlt = alt || source.label;
  return `| ${slug} | \`${fileName}\` | ${usage} | [${source.label}](${source.sourceUrl}) | ${source.license} | ${source.credit} | ${safeAlt.replace(/\|/g, '/')} | Done |`;
}
