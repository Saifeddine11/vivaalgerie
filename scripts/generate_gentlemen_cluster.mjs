import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outRoot = path.join(root, 'src/content/articles');
const published = '2026-09-16';
const locales = ['fr', 'en', 'es', 'nl'];

const slugs = {
  fr: [
    'the-gentlemen-saison-3-maroc-rabat-erfoud',
    'the-gentlemen-saison-3-rabat-tournage',
    'the-gentlemen-saison-3-erfoud-desert-maroc',
    'ou-est-tournee-the-gentlemen-saison-3-maroc',
    'pourquoi-the-gentlemen-tourne-maroc-cinema',
    'the-gentlemen-accrocar-voitures-luxe-maroc',
    'coulisses-the-gentlemen-accrocar-voitures-tournage',
    'the-gentlemen-rolls-royce-bentley-voitures-luxe',
    'location-voiture-luxe-production-cinema-maroc',
    'the-gentlemen-production-maroc-coulisses-accrocar',
  ],
  en: [
    'the-gentlemen-season-3-morocco-rabat-erfoud',
    'the-gentlemen-season-3-rabat-filming',
    'the-gentlemen-season-3-erfoud-morocco-desert',
    'where-is-the-gentlemen-season-3-filmed-morocco',
    'why-the-gentlemen-films-in-morocco',
    'the-gentlemen-accrocar-luxury-cars-morocco',
    'behind-the-scenes-accrocar-production-cars-morocco',
    'the-gentlemen-rolls-royce-bentley-luxury-cars',
    'luxury-car-rental-film-production-morocco',
    'the-gentlemen-production-morocco-accrocar',
  ],
  es: [
    'the-gentlemen-temporada-3-marruecos-rabat-erfoud',
    'the-gentlemen-temporada-3-rabat-rodaje',
    'the-gentlemen-temporada-3-erfoud-desierto-marruecos',
    'donde-se-rueda-the-gentlemen-temporada-3-marruecos',
    'por-que-the-gentlemen-se-rueda-en-marruecos',
    'the-gentlemen-accrocar-coches-lujo-marruecos',
    'bastidores-the-gentlemen-accrocar-coches-rodaje',
    'the-gentlemen-rolls-royce-bentley-coches-lujo',
    'alquiler-coches-lujo-produccion-cine-marruecos',
    'the-gentlemen-produccion-marruecos-accrocar',
  ],
  nl: [
    'the-gentlemen-seizoen-3-marokko-rabat-erfoud',
    'the-gentlemen-seizoen-3-rabat-opnames',
    'the-gentlemen-seizoen-3-erfoud-woestijn-marokko',
    'waar-wordt-the-gentlemen-seizoen-3-opgenomen-marokko',
    'waarom-the-gentlemen-in-marokko-filmt',
    'the-gentlemen-accrocar-luxe-autos-marokko',
    'achter-de-schermen-accrocar-productieautos-marokko',
    'the-gentlemen-rolls-royce-bentley-luxe-autos',
    'luxe-auto-verhuur-filmproductie-marokko',
    'the-gentlemen-productie-marokko-accrocar',
  ],
};

const titles = {
  fr: [
    'The Gentlemen saison 3 au Maroc : tournage à Rabat, Erfoud au programme',
    'The Gentlemen saison 3 à Rabat : ce que l’on sait du tournage au Maroc',
    'The Gentlemen saison 3 à Erfoud : le désert marocain rejoint l’univers de Guy Ritchie',
    'Où est tournée The Gentlemen saison 3 au Maroc ? Les lieux confirmés',
    'Pourquoi The Gentlemen saison 3 tourne au Maroc : Rabat, Erfoud et le cinéma marocain',
    'The Gentlemen saison 3 : Accrocar fournit des voitures de luxe à la production au Maroc',
    'Dans les coulisses de The Gentlemen : comment Accrocar prépare des voitures de luxe',
    'Rolls-Royce, Bentley et prestige : pourquoi The Gentlemen mise sur l’automobile de luxe',
    'Comment les productions internationales louent leurs voitures de luxe au Maroc',
    'The Gentlemen au Maroc : des décors aux voitures de luxe, les coulisses de la production',
  ],
  en: [
    'The Gentlemen Season 3 in Morocco: filming in Rabat, Erfoud also reported',
    'The Gentlemen Season 3 in Rabat: what we know about the Morocco shoot',
    'The Gentlemen Season 3 in Erfoud: Morocco’s desert enters Guy Ritchie’s world',
    'Where is The Gentlemen Season 3 filmed in Morocco? Confirmed locations',
    'Why The Gentlemen Season 3 is filming in Morocco: Rabat, Erfoud and the film industry',
    'The Gentlemen Season 3: Accrocar supplies luxury cars to the Morocco production',
    'Behind The Gentlemen: how Accrocar prepares luxury cars for an international shoot',
    'Rolls-Royce, Bentley and prestige cars: The Gentlemen’s automotive language',
    'How international productions rent luxury cars in Morocco',
    'The Gentlemen in Morocco: behind an international production, from locations to luxury cars',
  ],
  es: [
    'The Gentlemen temporada 3 en Marruecos: rodaje en Rabat y Erfoud en el programa',
    'The Gentlemen temporada 3 en Rabat: lo que sabemos del rodaje en Marruecos',
    'The Gentlemen temporada 3 en Erfoud: el desierto marroquí entra en el universo de Guy Ritchie',
    '¿Dónde se rueda The Gentlemen temporada 3 en Marruecos? Lugares confirmados',
    'Por qué The Gentlemen temporada 3 se rueda en Marruecos: Rabat, Erfoud y la industria del cine',
    'The Gentlemen temporada 3: Accrocar suministra coches de lujo a la producción en Marruecos',
    'Entre bastidores de The Gentlemen: cómo Accrocar prepara coches de lujo para un rodaje',
    'Rolls-Royce, Bentley y prestigio: el lenguaje automóvil de The Gentlemen',
    'Cómo alquilan coches de lujo las producciones internacionales en Marruecos',
    'The Gentlemen en Marruecos: de los decorados a los coches de lujo',
  ],
  nl: [
    'The Gentlemen seizoen 3 in Marokko: opnames in Rabat, ook Erfoud gemeld',
    'The Gentlemen seizoen 3 in Rabat: wat we weten over de opnames in Marokko',
    'The Gentlemen seizoen 3 in Erfoud: de Marokkaanse woestijn in Guy Ritchies wereld',
    'Waar wordt The Gentlemen seizoen 3 in Marokko opgenomen? Bevestigde locaties',
    'Waarom The Gentlemen seizoen 3 in Marokko filmt: Rabat, Erfoud en de filmindustrie',
    'The Gentlemen seizoen 3: Accrocar levert luxe auto’s aan de productie in Marokko',
    'Achter The Gentlemen: hoe Accrocar luxe auto’s voorbereidt voor een internationale opname',
    'Rolls-Royce, Bentley en prestige: de autotaal van The Gentlemen',
    'Hoe internationale producties luxe auto’s huren in Marokko',
    'The Gentlemen in Marokko: van locaties tot luxe auto’s achter de productie',
  ],
};

const descriptions = {
  fr: [
    'Netflix a confirmé la saison 3. Le point vérifié sur le tournage signalé à Rabat depuis le 13 septembre 2026, Erfoud et les informations encore inconnues.',
    'Rabat accueille le tournage marocain rapporté de The Gentlemen saison 3. Faits établis, lecture des décors urbains et limites de ce qui est public.',
    'Erfoud est signalée parmi les lieux marocains de The Gentlemen saison 3. Paysages, lumière, accès et distinction essentielle avec Merzouga.',
    'Carte et suivi des lieux marocains de The Gentlemen saison 3 : Rabat et Erfoud confirmés par la presse, rumeurs séparées des faits.',
    'Diversité des décors, équipes, studios, logistique et cash rebate : les atouts vérifiables du Maroc pour les productions internationales.',
    'Accrocar indique avoir fourni des véhicules de luxe à la production de The Gentlemen au Maroc. Rôle, préparation et limites de cette information.',
    'Sourcing, préparation, continuité, livraison et confidentialité : les exigences d’une voiture de production, expliquées avec le cas Accrocar.',
    'Comment l’automobile construit l’univers visuel de The Gentlemen, sans attribuer à la saison 3 un modèle non confirmé par Accrocar.',
    'Picture cars, véhicules de production, assurance, continuité et livraisons multi-villes : guide B2B de la location automobile au Maroc.',
    'Lieux, permis, équipes, hébergement, transport et fournisseurs : comment s’organise une production internationale au Maroc.',
  ],
  en: [
    'Netflix has confirmed Season 3. A verified guide to the reported Rabat shoot from 13 September 2026, Erfoud and what remains unknown.',
    'Rabat is hosting the reported Morocco shoot for The Gentlemen Season 3. Established facts, the city’s visual range and the limits of public information.',
    'Erfoud is reported as a Morocco location for The Gentlemen Season 3. Landscape, light, access and the essential distinction from Merzouga.',
    'A sourced map and tracker for The Gentlemen Season 3 in Morocco: Rabat and Erfoud, with rumours kept separate from facts.',
    'Locations, crews, studios, logistics and the cash rebate: Morocco’s verifiable strengths for international screen production.',
    'Accrocar says it supplied luxury vehicles to The Gentlemen production in Morocco. Its role, preparation work and the limits of the claim.',
    'Sourcing, preparation, continuity, delivery and confidentiality: production-car requirements explained through the Accrocar case.',
    'How cars shape The Gentlemen’s visual world, without attributing any unconfirmed model to the third season.',
    'Picture cars, production vehicles, insurance, continuity and multi-city delivery: a B2B guide to vehicle rental in Morocco.',
    'Locations, permits, crews, accommodation, transport and suppliers: how an international production works in Morocco.',
  ],
  es: [
    'Netflix ha confirmado la temporada 3. Guía verificada del rodaje comunicado en Rabat desde el 13 de septiembre de 2026, Erfoud y lo que aún se desconoce.',
    'Rabat acoge el rodaje marroquí comunicado de The Gentlemen temporada 3. Hechos, variedad visual y límites de la información pública.',
    'Erfoud figura entre las localizaciones marroquíes comunicadas. Paisaje, luz, acceso y la diferencia esencial con Merzouga.',
    'Mapa documentado de The Gentlemen temporada 3 en Marruecos: Rabat y Erfoud, con rumores separados de los hechos.',
    'Localizaciones, equipos, estudios, logística y devolución: ventajas verificables de Marruecos para producciones internacionales.',
    'Accrocar afirma haber suministrado vehículos de lujo a la producción en Marruecos. Función, preparación y límites de la información.',
    'Selección, preparación, continuidad, entrega y confidencialidad: exigencias del automóvil de producción con el caso Accrocar.',
    'Cómo el automóvil construye el universo visual de The Gentlemen sin atribuir a la temporada 3 ningún modelo no confirmado.',
    'Picture cars, vehículos de producción, seguro, continuidad y entregas entre ciudades: guía B2B para Marruecos.',
    'Localizaciones, permisos, equipos, alojamiento, transporte y proveedores: así funciona una producción internacional en Marruecos.',
  ],
  nl: [
    'Netflix heeft seizoen 3 bevestigd. Een gecontroleerde gids over de gemelde opnames in Rabat vanaf 13 september 2026, Erfoud en wat onbekend blijft.',
    'Rabat huisvest de gemelde Marokkaanse opnames van The Gentlemen seizoen 3. Feiten, visueel bereik en grenzen van openbare informatie.',
    'Erfoud wordt genoemd als Marokkaanse locatie. Landschap, licht, bereikbaarheid en het essentiële verschil met Merzouga.',
    'Een onderbouwde kaart van The Gentlemen seizoen 3 in Marokko: Rabat en Erfoud, met geruchten strikt gescheiden van feiten.',
    'Locaties, crews, studio’s, logistiek en cash rebate: aantoonbare sterke punten van Marokko voor internationale producties.',
    'Accrocar zegt luxe voertuigen te hebben geleverd aan de productie in Marokko. Rol, voorbereiding en grenzen van die informatie.',
    'Sourcing, voorbereiding, continuïteit, levering en vertrouwelijkheid: productieauto’s uitgelegd via de Accrocar-casus.',
    'Hoe auto’s de beeldtaal van The Gentlemen vormen, zonder een onbevestigd model aan seizoen 3 toe te schrijven.',
    'Picture cars, productievoertuigen, verzekering, continuïteit en levering tussen steden: een B2B-gids voor Marokko.',
    'Locaties, vergunningen, crews, verblijf, transport en leveranciers: zo werkt een internationale productie in Marokko.',
  ],
};

const images = [
  'rabat-hassan-tower.webp',
  'rabat-kasbah-oudayas.webp',
  'erfoud-oasis-architecture.webp',
  'rabat-hassan-tower.webp',
  'ouarzazate-atlas-film-studios.webp',
  'accrocar-luxury-vehicle-morocco.webp',
  'accrocar-bentley-bentayga.webp',
  'accrocar-rolls-royce-cullinan.webp',
  'accrocar-bentley-bentayga.webp',
  'accrocar-luxury-vehicle-morocco.webp',
];

const imageMeta = {
  'rabat-hassan-tower.webp': ['Tour Hassan et colonnade à Rabat', 'Bernard Gagnon, CC BY-SA 3.0 — recadrée', 'https://commons.wikimedia.org/wiki/File:Hassan_Tower.jpg'],
  'rabat-kasbah-oudayas.webp': ['Kasbah des Oudayas à Rabat', 'P. Hughes, CC BY 4.0 — recadrée', 'https://commons.wikimedia.org/wiki/File:Morocco_-_Kasbah_of_the_Udayas.jpg'],
  'erfoud-oasis-architecture.webp': ['Architecture en terre au sud d’Erfoud', 'Wikimedia Commons, licence indiquée sur la page source — recadrée', 'https://commons.wikimedia.org/wiki/File:Berber_architecture_south_of_the_town_of_Erfoud,_Morocco.jpg'],
  'erg-chebbi-desert-context.webp': ['Dunes de l’Erg Chebbi près de Merzouga, utilisées comme contexte régional', 'Nomadz, CC BY-SA 3.0 — recadrée', 'https://commons.wikimedia.org/wiki/File:Dunes-Merzouga-Erg_Chebi.JPG'],
  'ouarzazate-atlas-film-studios.webp': ['Décor des studios Atlas à Ouarzazate', 'Manuel Heinemann, domaine public — recadrée', 'https://commons.wikimedia.org/wiki/File:Atlas_Film_Studios_Ouarzazate_Morocco.JPG'],
  'accrocar-luxury-vehicle-morocco.webp': ['Véhicule de la flotte Accrocar au Maroc', 'Accrocar — image propriétaire fournie sur accrocar.com, recadrée', 'https://accrocar.com/'],
  'accrocar-bentley-bentayga.webp': ['Bentley Bentayga de la flotte Accrocar', 'Accrocar — image propriétaire fournie sur accrocar.com, recadrée', 'https://accrocar.com/'],
  'accrocar-rolls-royce-cullinan.webp': ['Rolls-Royce Cullinan de la flotte Accrocar', 'Accrocar — image propriétaire fournie sur accrocar.com, recadrée', 'https://accrocar.com/'],
};

const ui = {
  fr: {
    byline: 'Rédaction Viva Algérie', facts: 'Réponse immédiate', verified: 'Ce qui est établi au 16 septembre 2026', unknown: 'Ce qui n’est pas confirmé', context: 'Pourquoi le contexte marocain compte', method: 'Méthode et niveau de preuve', logistics: 'La logistique derrière l’image', latest: 'Dernières mises à jour et chronologie', faq: 'FAQ', sources: 'Sources principales', related: 'Dans ce dossier', cta: 'Contacter Accrocar', map: 'Carte de suivi des lieux',
  },
  en: {
    byline: 'Viva Algérie Editorial Team', facts: 'Immediate answer', verified: 'What is established as of 16 September 2026', unknown: 'What is not confirmed', context: 'Why the Morocco context matters', method: 'Method and evidence standard', logistics: 'The logistics behind the image', latest: 'Latest updates and timeline', faq: 'FAQ', sources: 'Primary sources', related: 'Explore the cluster', cta: 'Contact Accrocar', map: 'Location status map',
  },
  es: {
    byline: 'Redacción Viva Algérie', facts: 'Respuesta inmediata', verified: 'Lo establecido a 16 de septiembre de 2026', unknown: 'Lo que no está confirmado', context: 'Por qué importa el contexto marroquí', method: 'Método y nivel de prueba', logistics: 'La logística detrás de la imagen', latest: 'Últimas noticias y cronología', faq: 'FAQ', sources: 'Fuentes principales', related: 'En este dossier', cta: 'Contactar con Accrocar', map: 'Mapa del estado de las localizaciones',
  },
  nl: {
    byline: 'Redactie Viva Algérie', facts: 'Direct antwoord', verified: 'Wat op 16 september 2026 vaststaat', unknown: 'Wat niet is bevestigd', context: 'Waarom de Marokkaanse context telt', method: 'Methode en bewijsniveau', logistics: 'De logistiek achter het beeld', latest: 'Laatste updates en tijdlijn', faq: 'FAQ', sources: 'Belangrijkste bronnen', related: 'Meer uit dit dossier', cta: 'Contact opnemen met Accrocar', map: 'Kaart met locatiestatus',
  },
};

const common = {
  fr: {
    facts: `Netflix a officiellement renouvelé **The Gentlemen** pour une saison 3. Le communiqué Netflix du 23 août 2026 confirme aussi que Guy Ritchie revient à la réalisation. Tudum a consacré une annonce éditoriale à la nouvelle le 10 septembre. La plateforme ne donne toutefois ni calendrier de diffusion, ni liste exhaustive du casting de la troisième saison, ni liste de lieux marocains.

Le volet marocain repose à ce jour sur le reportage de **Le360**, publié le 14 septembre : le média indique que le tournage a commencé à Rabat le dimanche 13 septembre et cite une source selon laquelle Erfoud doit également accueillir des scènes. Cette précision est importante : Rabat et Erfoud sont des informations de presse concordantes avec le démarrage du tournage, pas des lieux annoncés par Netflix dans son communiqué mondial.`,
    unknown: `Aucune source publique robuste consultée ne confirme Marrakech, Ouarzazate, Merzouga, Aït-Ben-Haddou ou une autre ville comme décor de cette saison. Leur importance touristique ou cinématographique ne suffit pas à en faire des lieux de tournage. Merzouga est proche de l’écosystème touristique du Tafilalet, mais **Erfoud et Merzouga ne sont pas interchangeables**.

Netflix n’a pas publié de synopsis détaillé, de date de sortie, de feuille de service, d’adresses de plateau ou de chaîne contractuelle des fournisseurs au Maroc. Nous n’inférons pas non plus qu’un acteur de la saison 2 revient dans la saison 3 sans annonce spécifique. Theo James est le rôle principal rapporté au Maroc par Le360 ; les autres noms cités par le média décrivent la distribution connue de la série.`,
    context: `Le Maroc propose dans un même territoire des capitales administratives, des médinas, des architectures du XXe siècle, des côtes, des montagnes et des paysages présahariens. Cette densité réduit les changements de pays pour une production qui cherche plusieurs identités visuelles. À cela s’ajoutent des techniciens habitués aux tournages étrangers, des sociétés de production exécutive, des loueurs de matériel, des hôtels et des liaisons aériennes.

Le Centre cinématographique marocain est l’interlocuteur institutionnel pour les autorisations et le soutien aux productions étrangères. Son guide 2026 présente un remboursement pouvant atteindre **30 % des dépenses locales éligibles**, sous conditions. Le bilan 2024 du CCM recense 1,24 milliard de dirhams investis par des productions étrangères : un indicateur de volume, pas une preuve concernant The Gentlemen.`,
    method: `Nous classons une information comme « officielle » seulement lorsqu’elle provient de Netflix, du CCM ou d’une institution compétente. Une information attribuée à une source par un média reconnu est présentée comme « rapportée ». Une interprétation visuelle ou logistique est signalée comme telle. Les rumeurs, publications sociales non sourcées et photographies sans contexte sont exclues.

Cette page est datée et conçue pour être mise à jour. Une nouvelle ville ne passera dans la catégorie confirmée qu’après une annonce de la production, une autorité identifiable ou plusieurs reportages crédibles et indépendants.`,
    logistics: `Un tournage international ne déplace pas seulement une caméra et des comédiens. Il coordonne repérages, autorisations, régie, matériel, hébergement, restauration, figurants, chauffeurs, véhicules de jeu, véhicules techniques, sécurité et solutions de remplacement. Le passage d’une capitale atlantique à une ville présaharienne augmente le besoin d’anticipation : distances, poussière, température, disponibilité des pièces et fenêtres de livraison deviennent des sujets de production.

Les prestataires locaux interviennent à des niveaux différents. Une société peut fournir un véhicule sans être contractée directement par Netflix : la relation peut passer par la production, la production exécutive, la régie, le département transport ou un sous-traitant. C’est pourquoi nous évitons l’expression « fournisseur officiel de Netflix » en l’absence de document public.`,
  },
  en: {
    facts: `Netflix has officially renewed **The Gentlemen** for Season 3. Its 23 August 2026 press release also confirms that Guy Ritchie will direct again, while Tudum published a dedicated announcement on 10 September. Netflix has not announced a release window, a complete Season 3 cast or a list of Moroccan locations.

The Morocco information currently comes from **Le360**, published on 14 September. It says filming began in Rabat on Sunday 13 September and cites a source saying that Erfoud was also selected for scenes. The distinction matters: Rabat and Erfoud are locations reported by Moroccan media alongside the start of production, not locations listed in Netflix’s global announcement.`,
    unknown: `No robust public source reviewed for this update confirms Marrakech, Ouarzazate, Merzouga, Aït Ben Haddou or another city as a Season 3 location. A place’s tourism profile or film history is not evidence that this production is using it. Merzouga belongs to the wider Tafilalet travel circuit, but **Erfoud and Merzouga are not interchangeable**.

Netflix has not published a detailed synopsis, release date, call sheets, set addresses or the Morocco supplier chain. Nor do we assume that every Season 2 performer is returning without a specific announcement. Le360 reports Theo James as the lead present in the story; its other cast references describe the series’ known ensemble.`,
    context: `Morocco combines administrative capitals, medinas, twentieth-century architecture, coasts, mountains and pre-Saharan landscapes within one production territory. That density can reduce country moves when a story needs several visual identities. Experienced crews, executive-production companies, equipment houses, hotels and air links add an operating layer behind the scenery.

The Moroccan Cinema Centre is the institutional contact for permits and foreign-production support. Its 2026 guide describes a rebate of up to **30% of eligible local expenditure**, subject to rules. The CCM’s 2024 report records 1.24 billion dirhams of foreign-production investment. That indicates market scale; it is not evidence about The Gentlemen itself.`,
    method: `We call a claim “official” only when it comes from Netflix, the CCM or another competent institution. Information attributed to a source by an established news organisation is described as “reported”. Visual and logistical analysis is labelled as interpretation. Unsourced social posts and images without reliable context are excluded.

This dated tracker is designed to change. A new city will move into the confirmed category only after a production announcement, an identifiable authority or multiple credible independent reports.`,
    logistics: `An international shoot moves far more than cameras and cast. It coordinates scouting, permits, unit management, equipment, accommodation, catering, extras, drivers, picture cars, technical vehicles, security and replacements. Moving from an Atlantic capital to a pre-Saharan town makes distance, dust, heat, parts availability and delivery windows production questions.

Local suppliers can sit at different points in the chain. A company may provide a vehicle without contracting directly with Netflix; the counterparty may be the production company, local service producer, transport department or a subcontractor. That is why this cluster does not call any company an “official Netflix supplier” without public documentation.`,
  },
  es: {
    facts: `Netflix ha renovado oficialmente **The Gentlemen** para una tercera temporada. Su comunicado del 23 de agosto de 2026 también confirma que Guy Ritchie volverá a dirigir, y Tudum publicó un anuncio específico el 10 de septiembre. Netflix no ha comunicado una fecha de estreno, un reparto completo ni una lista de localizaciones marroquíes.

La información marroquí procede por ahora de **Le360**, en una publicación del 14 de septiembre: el medio afirma que el rodaje empezó en Rabat el domingo 13 y cita una fuente según la cual Erfoud también acogerá escenas. La distinción es importante: son lugares comunicados por prensa marroquí, no incluidos en el anuncio mundial de Netflix.`,
    unknown: `Ninguna fuente pública sólida consultada confirma Marrakech, Uarzazat, Merzouga, Aït Ben Haddou u otra ciudad para esta temporada. La fama turística o cinematográfica de un lugar no demuestra que esta producción lo utilice. Merzouga forma parte del circuito del Tafilalet, pero **Erfoud y Merzouga no son intercambiables**.

Netflix no ha publicado sinopsis detallada, fecha de estreno, órdenes de rodaje, direcciones de plató ni cadena contractual de proveedores. Tampoco damos por hecho el regreso de todo el reparto de la temporada 2. Le360 presenta a Theo James como protagonista; sus demás nombres describen el conjunto conocido de la serie.`,
    context: `Marruecos reúne capitales administrativas, medinas, arquitectura del siglo XX, costas, montañas y paisajes presaharianos en un mismo territorio de producción. Esa densidad reduce cambios de país. Se añaden técnicos habituados a rodajes extranjeros, empresas de producción ejecutiva, alquiler de material, hoteles y conexiones aéreas.

El Centro Cinematográfico Marroquí es el interlocutor institucional para permisos y apoyo. Su guía de 2026 describe un reembolso de hasta el **30 % del gasto local elegible**, sujeto a condiciones. El balance 2024 del CCM registra 1.240 millones de dírhams de inversión extranjera en producción: indica escala, no prueba nada sobre The Gentlemen.`,
    method: `Calificamos una información de “oficial” solo si procede de Netflix, el CCM u otra institución competente. Lo atribuido a una fuente por un medio reconocido se presenta como “comunicado”. El análisis visual o logístico se marca como interpretación. Se excluyen rumores, publicaciones sociales sin fuente y fotos sin contexto.

Esta página lleva fecha y está pensada para actualizarse. Una nueva ciudad solo pasará a confirmada tras un anuncio de producción, una autoridad identificable o varios reportajes independientes y creíbles.`,
    logistics: `Un rodaje internacional coordina mucho más que cámaras y actores: localizaciones, permisos, producción, material, alojamiento, catering, figurantes, conductores, coches de escena, vehículos técnicos, seguridad y sustituciones. Pasar de una capital atlántica a una ciudad presahariana convierte distancia, polvo, temperatura, repuestos y ventanas de entrega en asuntos de producción.

Los proveedores locales pueden ocupar distintos puntos de la cadena. Una empresa puede entregar un vehículo sin contratar directamente con Netflix: la relación puede pasar por la productora, la producción ejecutiva, transporte o un subcontratista. Por eso evitamos “proveedor oficial de Netflix” sin documentación pública.`,
  },
  nl: {
    facts: `Netflix heeft **The Gentlemen** officieel verlengd voor seizoen 3. Het persbericht van 23 augustus 2026 bevestigt ook dat Guy Ritchie opnieuw regisseert; Tudum publiceerde op 10 september een apart bericht. Netflix noemt nog geen releasedatum, volledige cast of lijst met Marokkaanse locaties.

De Marokkaanse informatie komt voorlopig van **Le360**, gepubliceerd op 14 september. Het medium meldt dat de opnames op zondag 13 september in Rabat begonnen en citeert een bron die zegt dat ook Erfoud voor scènes is gekozen. Dat onderscheid telt: Rabat en Erfoud zijn door Marokkaanse media gemelde locaties, niet locaties uit Netflix’ wereldwijde aankondiging.`,
    unknown: `Geen degelijke openbare bron in deze controle bevestigt Marrakech, Ouarzazate, Merzouga, Aït Ben Haddou of een andere stad als locatie voor seizoen 3. Toeristische bekendheid of filmgeschiedenis vormt geen bewijs. Merzouga hoort bij het ruimere reisgebied van Tafilalet, maar **Erfoud en Merzouga zijn niet uitwisselbaar**.

Netflix publiceerde geen gedetailleerde synopsis, releasedatum, callsheets, setadressen of contractketen van leveranciers. Ook nemen we niet aan dat elke acteur uit seizoen 2 terugkeert. Le360 noemt Theo James als hoofdrol; de overige namen beschrijven de bekende bezetting van de serie.`,
    context: `Marokko combineert bestuurlijke hoofdsteden, medina’s, twintigste-eeuwse architectuur, kusten, bergen en pre-Sahara-landschappen binnen één productiegebied. Die dichtheid kan landwissels beperken. Ervaren crews, uitvoerende producenten, materiaalverhuur, hotels en luchtverbindingen vormen de operationele laag achter het decor.

Het Centre Cinématographique Marocain is het institutionele aanspreekpunt voor vergunningen en steun. De gids van 2026 beschrijft een teruggave tot **30% van in aanmerking komende lokale uitgaven**, onder voorwaarden. Het CCM-jaarverslag 2024 noteert 1,24 miljard dirham aan buitenlandse productie-investeringen. Dat toont schaal, maar bewijst niets over The Gentlemen.`,
    method: `We noemen een bewering alleen “officieel” wanneer die van Netflix, het CCM of een bevoegde instelling komt. Informatie die een gevestigd medium aan een bron toeschrijft, heet “gemeld”. Visuele of logistieke duiding wordt als interpretatie aangeduid. Ongegronde sociale berichten en foto’s zonder betrouwbare context vallen af.

Deze gedateerde tracker is bedoeld om te worden bijgewerkt. Een nieuwe stad wordt pas bevestigd na een productieaankondiging, een identificeerbare autoriteit of meerdere geloofwaardige onafhankelijke berichten.`,
    logistics: `Een internationale opname verplaatst meer dan camera’s en acteurs. Ze coördineert locaties, vergunningen, unitmanagement, materiaal, verblijf, catering, figuranten, chauffeurs, picture cars, technische voertuigen, beveiliging en vervanging. De overgang van een Atlantische hoofdstad naar een pre-Sahara-stad maakt afstand, stof, hitte, onderdelen en levertijden tot productievraagstukken.

Lokale leveranciers kunnen op verschillende punten in de keten zitten. Een bedrijf kan een voertuig leveren zonder rechtstreeks door Netflix te zijn gecontracteerd; de opdrachtgever kan de producent, lokale serviceproducent, transportafdeling of onderaannemer zijn. Daarom gebruiken we zonder openbare documenten nooit “officiële Netflix-leverancier”.`,
  },
};

const depth = {
  fr: [
    ['Du repérage à la journée de tournage', `Avant la caméra, le repérage confronte l’intention artistique à la réalité : orientation du soleil, bruit, accès poids lourds, énergie, stationnement, circulation, autorisations et voisinage. Le directeur de production chiffre ensuite chaque option. Un lieu spectaculaire mais difficile à sécuriser peut perdre face à un décor plus simple, proche d’une base technique. À Rabat, la densité urbaine favorise les changements d’axe rapides ; elle impose aussi une coordination fine. À Erfoud, l’espace est plus ouvert, mais les distances et l’environnement demandent davantage d’autonomie.`, `Le plan de travail organise les scènes pour limiter les déplacements et préserver la continuité. Les départements image, décor, costumes, maquillage, son, transport et régie travaillent sur le même calendrier. Une météo stable aide, mais une production prévoit tout de même vent, poussière, chaleur, retard routier et indisponibilité. Cette discipline explique pourquoi l’expérience locale compte autant que la beauté d’un paysage.`],
    ['Équipes, matériel et services', `Le terme « production au Maroc » recouvre une chaîne de métiers : repéreurs, assistants, régisseurs, techniciens caméra, électriciens, machinistes, costumiers, constructeurs, interprètes, chauffeurs et comptables. Les partenaires marocains ne se limitent pas à exécuter une liste ; ils traduisent un besoin international dans un cadre administratif, géographique et commercial local.`, `L’équipement doit arriver au bon endroit, être assuré, entretenu et rendu compatible avec le plan de travail. Les hôtels doivent absorber des durées variables ; la restauration suit des horaires décalés ; les véhicules de service circulent entre base, plateau et stockage. Chaque poste paraît ordinaire pris séparément. Leur synchronisation produit la fiabilité recherchée par une série à grande échelle.`],
    ['Impact local et horizon 2030', `Les dépenses d’un tournage irriguent salaires, hébergement, restauration, transport, construction, location et services professionnels. L’impact durable dépend toutefois de la formation, de la récurrence des projets et de la capacité à conserver davantage de postproduction au Maroc. Les statistiques du CCM doivent être lues comme des agrégats annuels : elles ne permettent pas d’attribuer une dépense précise à une série sans publication dédiée.`, `À l’horizon 2030, la Cité internationale du cinéma de Ouarzazate peut compléter les studios privés et rapprocher tournage, formation, innovation et postproduction. Rabat apporte une image urbaine et institutionnelle ; le Sud-Est, des paysages et une culture technique forgée par des décennies de cinéma. L’enjeu est de transformer cette diversité en emplois continus et en fournisseurs capables de répondre aux standards internationaux.`],
  ],
  en: [
    ['From scouting to the shoot day', `Before a camera arrives, scouting tests the creative idea against sunlight, noise, truck access, power, parking, traffic, permits and neighbours. Production management then costs each option. A spectacular but fragile location may lose to a simpler one close to a technical base. Rabat enables rapid changes of urban axis but needs close coordination; Erfoud offers space while requiring more autonomy over distance and environment.`, `The schedule groups scenes to limit moves and protect continuity. Camera, art, costume, make-up, sound, transport and unit departments work from the same plan. Stable weather helps, yet wind, dust, heat, road delay and unavailability still require contingencies. That operating discipline is why local experience matters as much as landscape.`],
    ['Crews, equipment and services', `“Production in Morocco” describes a chain of location managers, assistants, unit staff, camera technicians, electricians, grips, costume teams, builders, interpreters, drivers and accountants. Moroccan partners do more than execute a list: they translate an international brief into a local administrative, geographic and commercial setting.`, `Equipment must reach the correct unit, remain insured and maintained, and fit the schedule. Hotels absorb changing stays; catering follows irregular hours; service vehicles connect base, set and storage. Each task looks ordinary in isolation. Synchronising them creates the reliability a large series needs.`],
    ['Local impact and the 2030 horizon', `A shoot spends across wages, accommodation, catering, transport, construction, rental and professional services. Durable impact depends on training, repeat business and keeping more post-production in Morocco. CCM figures are annual aggregates; they cannot assign a precise spend to one series without a dedicated disclosure.`, `Toward 2030, Ouarzazate’s International Cinema City may complement private studios and connect production, training, innovation and post. Rabat provides an urban and institutional image; the South-East brings landscape and technical culture built over decades of filmmaking. The opportunity is to turn variety into sustained employment and internationally capable suppliers.`],
  ],
  es: [
    ['De la localización a la jornada de rodaje', `Antes de la cámara, la localización confronta la idea con sol, ruido, acceso de camiones, energía, aparcamiento, tráfico, permisos y vecinos. Producción calcula cada opción. Un lugar espectacular pero difícil puede perder frente a otro próximo a una base técnica. Rabat facilita cambios urbanos rápidos pero exige coordinación; Erfoud ofrece espacio y requiere autonomía por distancias y entorno.`, `El plan agrupa escenas para reducir desplazamientos y proteger la continuidad. Cámara, arte, vestuario, maquillaje, sonido, transporte y producción comparten calendario. El clima estable ayuda, pero viento, polvo, calor, retrasos y disponibilidad necesitan alternativas. La experiencia local importa tanto como el paisaje.`],
    ['Equipos, material y servicios', `“Producción en Marruecos” significa localizadores, ayudantes, regidores, técnicos de cámara, eléctricos, maquinistas, vestuario, construcción, intérpretes, conductores y contables. Los socios marroquíes traducen un brief internacional al marco administrativo, geográfico y comercial local.`, `El material debe llegar, estar asegurado, mantenerse y encajar en el plan. Los hoteles absorben estancias variables; el catering sigue horarios irregulares; los vehículos conectan base, plató y almacén. Cada tarea parece ordinaria por separado. Su sincronización genera la fiabilidad que necesita una gran serie.`],
    ['Impacto local y horizonte 2030', `Un rodaje gasta en salarios, alojamiento, restauración, transporte, construcción, alquiler y servicios. El impacto duradero depende de formación, recurrencia y más posproducción en Marruecos. Las cifras del CCM son agregados anuales: no atribuyen un gasto concreto a una serie sin publicación específica.`, `Hacia 2030, la Ciudad Internacional del Cine de Uarzazat puede complementar estudios privados y conectar producción, formación, innovación y posproducción. Rabat aporta imagen urbana; el Sudeste, paisajes y cultura técnica. El reto es convertir diversidad en empleo continuo y proveedores con estándar internacional.`],
  ],
  nl: [
    ['Van locatiescout tot opnamedag', `Voor de camera komt, toetst scouting de creatieve wens aan zon, geluid, vrachttoegang, stroom, parkeren, verkeer, vergunningen en buren. Productieleiding begroot elke optie. Een spectaculair maar kwetsbaar terrein kan verliezen van een eenvoudiger locatie bij een technische basis. Rabat maakt snelle stedelijke wissels mogelijk maar vraagt coördinatie; Erfoud biedt ruimte en vraagt meer autonomie door afstand en omgeving.`, `Het draaischema groepeert scènes om verplaatsingen te beperken en continuïteit te beschermen. Camera, art, kostuum, make-up, geluid, transport en unitmanagement delen één plan. Stabiel weer helpt, maar wind, stof, hitte, vertraging en onbeschikbaarheid vragen alternatieven. Daarom telt lokale ervaring even zwaar als landschap.`],
    ['Crews, materiaal en diensten', `“Productie in Marokko” omvat locatiemanagers, assistenten, unitmedewerkers, cameratechnici, elektriciens, grips, kostuumteams, bouwers, tolken, chauffeurs en accountants. Marokkaanse partners voeren niet alleen een lijst uit; ze vertalen een internationale briefing naar de lokale bestuurlijke, geografische en commerciële context.`, `Materiaal moet juist aankomen, verzekerd en onderhouden blijven en bij het schema passen. Hotels vangen wisselende verblijven op; catering volgt ongewone uren; dienstvoertuigen verbinden basis, set en opslag. Los lijken die taken gewoon. Hun synchronisatie levert de betrouwbaarheid die een grote serie verlangt.`],
    ['Lokale impact en 2030', `Een opname besteedt aan lonen, verblijf, catering, vervoer, bouw, verhuur en professionele diensten. Duurzame impact vraagt opleiding, terugkerende projecten en meer postproductie in Marokko. CCM-cijfers zijn jaaraggregaten en wijzen zonder aparte publicatie geen exact bedrag aan één serie toe.`, `Richting 2030 kan de Internationale Filmstad van Ouarzazate private studio’s aanvullen en productie, opleiding, innovatie en postproductie verbinden. Rabat biedt stedelijk en institutioneel beeld; het Zuidoosten landschappen en decennialange filmkennis. De kans is die variatie om te zetten in duurzaam werk en leveranciers op internationaal niveau.`],
  ],
};

const readerGuide = {
  fr: ['Lire les prochaines annonces sans surinterpréter', `Les annonces de renouvellement, de mise en production et de tournage ne signifient pas la même chose. Un renouvellement autorise la suite ; une entrée en production peut couvrir préparation et tournage ; un clap annoncé dans une ville ne prouve pas que toute la saison y sera filmée. De même, la présence d’un comédien dans une saison précédente ne vaut pas confirmation contractuelle pour la suivante. La bonne lecture consiste à dater chaque information, identifier son émetteur et conserver la formulation originale : « confirmé par Netflix », « rapporté par un média » ou « déclaré par un fournisseur ».`, `Les images exigent la même prudence. Une photo promotionnelle de la saison 2 peut illustrer l’univers de la série, mais pas le plateau marocain de la saison 3. Une photographie de Rabat ou d’Erfoud documente le contexte géographique, sans révéler un décor précis. Une voiture de la flotte Accrocar illustre une catégorie disponible ; elle ne devient un véhicule de la série qu’après confirmation explicite. Ces distinctions réduisent le risque de transformer une image séduisante en fausse preuve.`, `Enfin, une absence d’information publique n’est pas une preuve d’absence. Les productions limitent volontairement les détails pour protéger le récit, les personnes, les lieux et la sécurité opérationnelle. Le rôle d’un dossier responsable est donc double : publier rapidement ce qui est solide et résister à la tentation de compléter les blancs. Les mises à jour futures indiqueront ce qui a changé, avec une date et une source, plutôt que de réécrire silencieusement l’historique.`],
  en: ['How to read the next announcements', `Renewal, production and filming announcements do not mean the same thing. A renewal authorises another season; “in production” may cover preparation as well as principal photography; a reported first day in one city does not prove the whole season will be shot there. Likewise, an actor’s presence in an earlier season is not contractual confirmation for the next one. The sound approach is to date each claim, identify its speaker and preserve the correct verb: “confirmed by Netflix”, “reported by a news organisation” or “stated by a supplier”.`, `Images need the same discipline. A Season 2 promotional still can illustrate the programme’s established style, but it cannot document the Season 3 Morocco set. A Rabat or Erfoud photograph describes geographic context without disclosing a specific set. A vehicle from Accrocar’s fleet illustrates a category the company carries; it only becomes a car used by the series after explicit confirmation. These distinctions prevent an attractive image from becoming false evidence.`, `An absence of public information is not proof of absence. Productions withhold detail to protect story, people, locations and operations. Responsible coverage therefore has two jobs: publish solid information quickly and refuse to fill gaps with confident guesses. Future updates to this cluster should show what changed, with a date and a source, rather than silently rewriting the record. That audit trail is especially important while filming is active and local observations can travel online faster than they can be verified.`],
  es: ['Cómo leer los próximos anuncios', `Renovación, producción y rodaje no significan lo mismo. Una renovación autoriza otra temporada; “en producción” puede incluir preparación; un primer día comunicado en una ciudad no demuestra que toda la temporada se filme allí. La presencia de un actor en una temporada anterior tampoco confirma su contrato para la siguiente. Conviene fechar cada dato, identificar a quien lo emite y conservar el verbo correcto: “confirmado por Netflix”, “comunicado por un medio” o “declarado por un proveedor”.`, `Las imágenes exigen igual disciplina. Una foto promocional de la temporada 2 puede ilustrar el estilo de la serie, pero no documenta el plató marroquí de la temporada 3. Una foto de Rabat o Erfoud aporta contexto sin revelar un decorado concreto. Un vehículo de la flota Accrocar ilustra una categoría disponible; solo puede llamarse coche de la serie tras confirmación expresa. Así se evita convertir una imagen atractiva en prueba falsa.`, `La falta de información pública no prueba que algo no exista. Las producciones reservan detalles para proteger relato, personas, lugares y operaciones. Una cobertura responsable publica rápido lo sólido y se niega a rellenar huecos con seguridad fingida. Las futuras actualizaciones deben indicar qué cambió, con fecha y fuente, en vez de reescribir el historial silenciosamente. Esa trazabilidad es esencial mientras el rodaje está activo y las observaciones locales circulan más rápido que su verificación. También conviene separar disponibilidad comercial de uso cinematográfico: que un proveedor ofrezca una marca no demuestra que esa marca forme parte del guion, del rodaje o del montaje final. La misma regla protege nombres, empresas y ciudades frente a asociaciones apresuradas.`],
  nl: ['Hoe volgende aankondigingen te lezen', `Verlenging, productie en opnames betekenen niet hetzelfde. Een verlenging geeft toestemming voor een nieuw seizoen; “in productie” kan ook voorbereiding omvatten; een gemelde eerste draaidag in één stad bewijst niet dat het hele seizoen daar wordt opgenomen. De aanwezigheid van een acteur in een vorig seizoen is evenmin contractbevestiging voor het volgende. Dateer elke bewering, benoem de afzender en behoud het juiste werkwoord: “bevestigd door Netflix”, “gemeld door een nieuwsmedium” of “verklaard door een leverancier”.`, `Ook beelden vragen discipline. Een promotiefoto van seizoen 2 kan de bekende stijl illustreren, maar documenteert niet de Marokkaanse set van seizoen 3. Een foto van Rabat of Erfoud geeft geografische context zonder een specifieke set te onthullen. Een auto uit de Accrocar-vloot toont een beschikbare categorie; hij wordt pas een auto uit de serie na expliciete bevestiging. Zo verandert een aantrekkelijk beeld niet in vals bewijs.`, `Gebrek aan openbare informatie is geen bewijs van afwezigheid. Producties houden details achter om verhaal, mensen, locaties en uitvoering te beschermen. Verantwoordelijke berichtgeving heeft daarom twee taken: solide informatie snel publiceren en weigeren gaten met stellige gissingen te vullen. Toekomstige updates horen met datum en bron te tonen wat veranderde, in plaats van het verleden stil te herschrijven. Dat controlespoor is extra belangrijk tijdens actieve opnames, wanneer lokale waarnemingen sneller online reizen dan ze kunnen worden geverifieerd.`, `Een tweede aandachtspunt is het verschil tussen commerciële beschikbaarheid en werkelijk filmgebruik. Dat een leverancier een bepaald merk of model toont, bewijst niet dat die auto in het scenario, op de set of in de uiteindelijke montage zit. Hetzelfde geldt voor nabijgelegen steden: een bekende toeristische plek wordt geen filmlocatie doordat een crew in dezelfde regio werkt. Pas een duidelijke bron mag die stap zetten. Tot die tijd blijft nauwkeurige, beperkte taal informatiever dan een spectaculaire maar onbewezen kop. Een redactie controleert bovendien of een bron zelf aanwezig was, een andere publicatie napraat of slechts een verwachting beschrijft. Publicatiedatum en datum van de gebeurtenis worden apart genoteerd. Zo blijven latere correcties begrijpelijk en kunnen lezers zelf zien waarom een locatie, castnaam of voertuig wel of niet in het bevestigde overzicht staat. Dit onderscheid beschermt ook betrokken bewoners, medewerkers en bedrijven tegen ongewenste aandacht op basis van een gerucht. Het houdt de verslaggeving bruikbaar nadat de eerste nieuwspiek voorbij is.`],
};

const focus = {
  fr: [
    [`Netflix, Rabat et Erfoud : la situation`, `L’annonce de Netflix établit l’existence de la saison et le retour de Guy Ritchie à la réalisation. Le reportage marocain établit le démarrage signalé à Rabat et la sélection rapportée d’Erfoud. Ces deux niveaux de preuve se complètent sans être confondus.`, `La chronologie est resserrée : renouvellement officiel le 23 août, sortie de la saison 2 le 3 septembre, article Tudum le 10 septembre, début de tournage rapporté le 13 et publication de Le360 le 14. Aucune date de diffusion de la saison 3 n’est officielle.`],
    [`Pourquoi Rabat est cinématographique`, `Rabat peut offrir des registres très différents : monumentalité almohade, médina, façades administratives, boulevards du XXe siècle, quartiers contemporains et horizon atlantique. Ce potentiel ne permet pas d’identifier une rue ou la fonction narrative d’un bâtiment sans preuve.`, `Pour la régie, une capitale offre hôtels, prestataires, axes routiers et proximité de Casablanca. Les quartiers institutionnels imposent en revanche une coordination précise des autorisations, de la circulation et de la sécurité. Aucun de ces mécanismes ne révèle les scènes tournées.`],
    [`Erfoud, porte du Tafilalet`, `Erfoud est une ville-oasis du Drâa-Tafilalet, à l’est du pays. Ses plateaux minéraux, palmeraies, architecture en terre et routes ouvertes offrent une palette plus large que le seul cliché de la dune. La lumière dure, les horizons et les couleurs minérales créent un contraste net avec Rabat.`, `Erfoud peut servir de base logistique vers plusieurs paysages, mais cela n’autorise pas à déplacer automatiquement le tournage vers Merzouga. Une base d’équipe, un lieu d’hébergement et un plateau image sont trois choses différentes.`],
    [`Deux lieux confirmés, une carte prudente`, `Au 16 septembre, la carte éditoriale ne comporte que Rabat et Erfoud dans la catégorie confirmée par un reportage crédible. La formulation reste précise : Le360 rapporte un démarrage à Rabat et cite une source pour Erfoud.`, `Marrakech, Ouarzazate, Merzouga et Aït-Ben-Haddou restent dans la zone “spéculation / non confirmé”. Ouarzazate compte dans l’analyse de l’écosystème marocain, pas dans la liste des lieux de cette saison.`],
    [`Un écosystème, pas seulement des paysages`, `Le choix d’un pays de tournage additionne repérages, disponibilité des équipes, calendrier, coûts, incitations, sécurité juridique, équipement, capacité hôtelière et mobilité. Le Maroc bénéficie d’une longue pratique des productions étrangères et d’un réseau de production exécutive.`, `La Cité internationale du cinéma lancée à Ouarzazate en juillet 2026 prévoit notamment un studio de 3 000 m², de la postproduction, de la formation et des services intégrés. Il s’agit d’un projet structurant pour l’avenir, pas d’un studio attribué à The Gentlemen.`],
    [`Le rôle déclaré d’Accrocar`, `Dans le cadre du tournage marocain de la saison 3 de The Gentlemen, **Accrocar indique avoir fourni des véhicules de luxe destinés aux besoins de la production au Maroc**. Cette information vient directement de l’entreprise. Elle n’est pas présentée comme une confirmation de Netflix et ne permet pas de reconstituer la chaîne contractuelle.`, `Un fournisseur automobile spécialisé doit comprendre les contraintes de disponibilité, d’état cosmétique, de livraison, de discrétion, de continuité et de remplacement. La valeur tient autant à la coordination qu’au modèle livré.`],
    [`Préparer une voiture pour la caméra`, `Une location classique optimise la remise des clés au client. Une utilisation de production ajoute un brief visuel, une inspection de carrosserie, la préparation de l’habitacle, des pneus et jantes, la propreté répétable, des horaires mouvants, une personne de contact et un plan de secours.`, `Selon les informations communiquées par Accrocar, son intervention sur The Gentlemen est restée au niveau de la fourniture de véhicules de luxe. Aucun horaire, immatriculation, acteur transporté, tarif ou lieu non publié n’est divulgué.`],
    [`Luxe automobile et narration`, `Dans l’univers de The Gentlemen, l’automobile prolonge les costumes, les propriétés et les rapports de pouvoir. Une berline avec chauffeur n’exprime pas la même autorité qu’un SUV de prestige ou qu’une voiture dite “hero” cadrée comme un personnage.`, `Accrocar dispose notamment de Bentley, Rolls-Royce, Mercedes, Range Rover et Porsche. Cela décrit sa flotte publique. Cela ne signifie pas que chacun de ces modèles apparaît dans la saison 3 ni qu’un véhicule photographié ici a été utilisé à l’écran.`],
    [`Picture car, voiture de production, transport talent`, `Une **picture car** apparaît à l’image. Une voiture de production sert au travail hors champ. Un véhicule avec chauffeur peut déplacer des équipes ou répondre à un protocole d’accueil. Une hero car reçoit davantage de préparation et de continuité ; une voiture de fond doit surtout correspondre au décor.`, `Le contrat, l’assurance et les autorisations doivent refléter l’usage réel. La circulation, le transport sur plateau, les conducteurs autorisés, la durée d’immobilisation et une éventuelle modification esthétique se négocient avant la remise.`],
    [`La chaîne de production au Maroc`, `Permis, repérages, techniciens, matériel, hébergement, restauration, figurants, transport et sécurité forment une chaîne. Les fournisseurs spécialisés gagnent du temps lorsqu’ils répondent avec un inventaire réaliste, un interlocuteur unique et un plan de contingence.`, `Accrocar indique avoir fourni des véhicules de luxe à la production marocaine de The Gentlemen saison 3. Ce cas illustre la place croissante de prestataires marocains capables de servir des productions internationales, sans transformer leur contribution en partenariat officiel non documenté.`],
  ],
  en: [
    [`Netflix, Rabat and Erfoud: the position`, `Netflix establishes that Season 3 exists and Guy Ritchie returns to direct. Moroccan reporting establishes the reported start in Rabat and the reported selection of Erfoud. Those evidence levels complement each other without becoming the same claim.`, `The timeline is tight: official renewal on 23 August, Season 2 on 3 September, Tudum on 10 September, filming reportedly starting on the 13th and Le360 publishing on the 14th. No Season 3 release date is official.`],
    [`Why Rabat works on screen`, `Rabat offers distinct registers: Almohad monuments, a medina, administrative façades, twentieth-century boulevards, contemporary districts and an Atlantic horizon. That potential does not identify a street or a building’s story function without evidence.`, `For a unit, a capital brings hotels, suppliers, roads and proximity to Casablanca. Institutional areas also require careful permit, traffic and security coordination. None of this discloses the scenes being filmed.`],
    [`Erfoud, a Tafilalet gateway`, `Erfoud is an oasis town in Drâa-Tafilalet in eastern Morocco. Mineral plateaux, palms, earth architecture and open roads offer more than a generic dune image. Hard light, long horizons and mineral colour contrast strongly with Rabat.`, `Erfoud can be a logistical base for several landscapes, but that does not move the shoot automatically to Merzouga. A crew base, accommodation point and camera location are different things.`],
    [`Two locations, a cautious map`, `As of 16 September, the editorial map contains only Rabat and Erfoud in the credible-reporting category. The wording remains exact: Le360 reports a Rabat start and attributes Erfoud to a source.`, `Marrakech, Ouarzazate, Merzouga and Aït Ben Haddou remain “speculation / unconfirmed”. Ouarzazate belongs in analysis of Morocco’s industry, not in the Season 3 location list.`],
    [`An ecosystem, not scenery alone`, `A production-country decision combines locations, crew availability, schedule, cost, incentives, legal certainty, equipment, hotels and mobility. Morocco benefits from long experience with foreign shoots and a network of local service producers.`, `The International Cinema City launched in Ouarzazate in July 2026 is planned with a 3,000 m² stage, post-production, training and integrated services. It is forward-looking infrastructure, not a facility attributed to The Gentlemen.`],
    [`Accrocar’s stated role`, `For the Moroccan filming of The Gentlemen Season 3, **Accrocar says it supplied luxury vehicles for the production’s needs in Morocco**. This is first-party information from the company. It is not presented as Netflix confirmation and does not establish the contractual chain.`, `A specialist vehicle supplier must handle availability, cosmetic condition, delivery, discretion, continuity and replacement planning. Its value lies as much in coordination as in the badge on the bonnet.`],
    [`Preparing a car for camera`, `A normal rental optimises a handover to one customer. Production use adds a visual brief, bodywork inspection, interior, wheel and tyre preparation, repeatable cleanliness, moving call times, a named contact and a fallback.`, `According to Accrocar, its The Gentlemen work concerned luxury-vehicle supply. This article discloses no schedule, registration, private cast movement, rate or unpublished location.`],
    [`Luxury cars as storytelling`, `In The Gentlemen, cars extend costume, property and power. A chauffeur saloon communicates differently from a prestige SUV or a “hero” car framed almost as a character.`, `Accrocar publicly lists Bentley, Rolls-Royce, Mercedes, Range Rover and Porsche models. That describes its fleet. It does not mean every model appears in Season 3 or that a vehicle pictured here was used on screen.`],
    [`Picture car, production car, talent transport`, `A **picture car** appears on camera. A production vehicle works off screen. A chauffeured car may move personnel or meet an arrival protocol. A hero car demands closer preparation and continuity; background vehicles primarily need to fit the world.`, `Contracts, insurance and permits must match the actual use. Road work, transport to set, authorised drivers, hold time and any cosmetic change should be agreed before delivery.`],
    [`Morocco’s production chain`, `Permits, scouting, technicians, equipment, accommodation, catering, extras, transport and security form one chain. Specialist suppliers save time with honest inventory, one accountable contact and contingency planning.`, `Accrocar says it supplied luxury vehicles to the Moroccan production of The Gentlemen Season 3. The case illustrates how Moroccan specialist vendors serve international work without turning that contribution into an undocumented “official partnership”.`],
  ],
  es: [
    [`Netflix, Rabat y Erfoud: situación`, `Netflix confirma la existencia de la temporada y el regreso de Guy Ritchie a la dirección. La prensa marroquí establece el inicio comunicado en Rabat y la selección comunicada de Erfoud. Los niveles de prueba se complementan sin confundirse.`, `Cronología: renovación oficial el 23 de agosto, temporada 2 el 3 de septiembre, Tudum el día 10, inicio comunicado el 13 y artículo de Le360 el 14. No hay fecha oficial de estreno.`],
    [`Por qué Rabat funciona en pantalla`, `Rabat ofrece registros distintos: monumentos almohades, medina, fachadas administrativas, bulevares del siglo XX, barrios contemporáneos y horizonte atlántico. Ese potencial no identifica una calle ni su función narrativa sin pruebas.`, `Para producción, una capital suma hoteles, proveedores, carreteras y proximidad a Casablanca. Las zonas institucionales exigen coordinación de permisos, tráfico y seguridad. Nada de ello revela las escenas.`],
    [`Erfoud, puerta del Tafilalet`, `Erfoud es una ciudad oasis de Drâa-Tafilalet. Mesetas minerales, palmerales, tierra apisonada y carreteras abiertas ofrecen más que una imagen genérica de dunas. La luz y el color contrastan con Rabat.`, `Erfoud puede ser base logística para varios paisajes, pero eso no traslada el rodaje a Merzouga. Base de equipo, alojamiento y localización de cámara no son lo mismo.`],
    [`Dos lugares, un mapa prudente`, `A 16 de septiembre, el mapa solo incluye Rabat y Erfoud en la categoría de información creíble. La redacción es precisa: Le360 comunica un inicio en Rabat y atribuye Erfoud a una fuente.`, `Marrakech, Uarzazat, Merzouga y Aït Ben Haddou permanecen como “especulación / no confirmado”. Uarzazat pertenece al análisis industrial, no a la lista de la temporada.`],
    [`Un ecosistema, no solo paisajes`, `La decisión suma localizaciones, equipos, calendario, coste, incentivos, certeza jurídica, material, hoteles y movilidad. Marruecos dispone de experiencia con producciones extranjeras y una red de servicios locales.`, `La Ciudad Internacional del Cine iniciada en Uarzazat en julio de 2026 prevé un estudio de 3.000 m², posproducción, formación y servicios. Es infraestructura futura, no una instalación atribuida a The Gentlemen.`],
    [`La función declarada de Accrocar`, `En el rodaje marroquí de The Gentlemen temporada 3, **Accrocar afirma haber suministrado vehículos de lujo para las necesidades de la producción en Marruecos**. Es información directa de la empresa, no confirmación de Netflix ni prueba de la cadena contractual.`, `Un proveedor especializado gestiona disponibilidad, estado cosmético, entrega, discreción, continuidad y sustitución. El valor está tanto en coordinar como en el modelo entregado.`],
    [`Preparar un coche para cámara`, `Un alquiler normal optimiza la entrega a un cliente. La producción añade brief visual, revisión de carrocería, preparación interior, ruedas y neumáticos, limpieza repetible, horarios móviles, contacto único y alternativa.`, `Según Accrocar, su trabajo se limitó al suministro de vehículos de lujo. No se revelan horarios, matrículas, movimientos privados del reparto, tarifas o lugares inéditos.`],
    [`El lujo como narración`, `En The Gentlemen, el coche prolonga vestuario, propiedades y poder. Una berlina con chófer comunica algo distinto de un SUV de prestigio o un “hero car” encuadrado como personaje.`, `Accrocar publica Bentley, Rolls-Royce, Mercedes, Range Rover y Porsche en su flota. Eso no significa que cada modelo aparezca en la temporada 3 ni que el vehículo fotografiado se usara en pantalla.`],
    [`Picture car, coche de producción y transporte`, `Un **picture car** aparece en cámara. Un coche de producción trabaja fuera de plano. Un vehículo con chófer puede mover personal. Un hero car exige más continuidad; los coches de fondo deben encajar visualmente.`, `Contrato, seguro y permisos deben reflejar el uso. Circulación, traslado al plató, conductores autorizados, inmovilización y cambios estéticos se acuerdan antes.`],
    [`La cadena de producción marroquí`, `Permisos, localizaciones, técnicos, material, alojamiento, catering, figurantes, transporte y seguridad forman una cadena. Los especialistas ganan tiempo con inventario realista, contacto único y contingencias.`, `Accrocar afirma haber suministrado vehículos de lujo a la producción marroquí. El caso ilustra la capacidad de proveedores locales sin convertir su contribución en una asociación oficial no documentada.`],
  ],
  nl: [
    [`Netflix, Rabat en Erfoud: de stand`, `Netflix bevestigt het seizoen en Guy Ritchies terugkeer als regisseur. Marokkaanse berichtgeving stelt de gemelde start in Rabat en de gemelde keuze voor Erfoud vast. Die bewijsniveaus vullen elkaar aan zonder samen te vallen.`, `Tijdlijn: officiële verlenging op 23 augustus, seizoen 2 op 3 september, Tudum op 10 september, gemelde start op de 13de en Le360 op de 14de. Een releasedatum is niet officieel.`],
    [`Waarom Rabat op beeld werkt`, `Rabat biedt Almohad-monumenten, een medina, bestuurlijke gevels, twintigste-eeuwse boulevards, moderne wijken en de Atlantische horizon. Dat potentieel bewijst geen specifieke straat of verhaalfunctie.`, `Een hoofdstad biedt hotels, leveranciers, wegen en nabijheid tot Casablanca. Institutionele zones vragen precieze coördinatie van vergunningen, verkeer en beveiliging. Dat onthult geen scènes.`],
    [`Erfoud, poort tot Tafilalet`, `Erfoud is een oasestad in Drâa-Tafilalet. Minerale plateaus, palmen, leembouw en open wegen bieden meer dan het cliché van duinen. Licht, horizon en kleur contrasteren sterk met Rabat.`, `Erfoud kan logistieke basis zijn voor landschappen, maar dat verplaatst de opname niet automatisch naar Merzouga. Crewbasis, verblijf en cameralocatie zijn verschillende zaken.`],
    [`Twee locaties, een voorzichtige kaart`, `Op 16 september bevat de kaart alleen Rabat en Erfoud als geloofwaardig gemeld. De formulering blijft exact: Le360 meldt de start in Rabat en schrijft Erfoud toe aan een bron.`, `Marrakech, Ouarzazate, Merzouga en Aït Ben Haddou blijven “speculatie / onbevestigd”. Ouarzazate hoort bij industrieanalyse, niet bij de locaties van dit seizoen.`],
    [`Een ecosysteem, niet alleen decor`, `Een productieland wordt gekozen op locaties, crews, planning, kosten, incentives, rechtszekerheid, materiaal, hotels en mobiliteit. Marokko heeft ruime ervaring met buitenlandse opnames en lokale serviceproducenten.`, `De Internationale Filmstad die in juli 2026 in Ouarzazate startte, omvat plannen voor een studio van 3.000 m², postproductie, opleiding en diensten. Dat is toekomstinfrastructuur, geen aan The Gentlemen toegewezen faciliteit.`],
    [`Accrocars verklaarde rol`, `Voor de Marokkaanse opnames van The Gentlemen seizoen 3 **zegt Accrocar luxe voertuigen te hebben geleverd voor de behoeften van de productie in Marokko**. Dit is bedrijfsinformatie, geen Netflix-bevestiging en geen bewijs van de contractketen.`, `Een gespecialiseerde leverancier beheert beschikbaarheid, cosmetische staat, levering, discretie, continuïteit en vervanging. De waarde zit evenzeer in coördinatie als in het automerk.`],
    [`Een auto voorbereiden voor camera`, `Normale verhuur optimaliseert één sleuteloverdracht. Productiegebruik voegt een visuele briefing, carrosseriecontrole, interieur-, wiel- en bandvoorbereiding, herhaalbare reinheid, wijzigende tijden, een contactpersoon en back-up toe.`, `Volgens Accrocar ging de bijdrage om luxe voertuigen. Dit artikel onthult geen planning, kenteken, privévervoer van acteurs, tarief of ongepubliceerde locatie.`],
    [`Luxe auto’s als vertelmiddel`, `In The Gentlemen verlengt de auto kostuum, bezit en macht. Een limousine met chauffeur communiceert anders dan een prestige-SUV of een “hero car” die bijna als personage wordt gefilmd.`, `Accrocar toont publiek Bentley, Rolls-Royce, Mercedes, Range Rover en Porsche. Dat beschrijft de vloot, niet welke modellen in seizoen 3 verschijnen of op beeld zijn gebruikt.`],
    [`Picture car, productieauto en talenttransport`, `Een **picture car** verschijnt in beeld. Een productievoertuig werkt buiten beeld. Een auto met chauffeur kan personeel vervoeren. Een hero car vraagt strengere voorbereiding en continuïteit; achtergrondauto’s moeten vooral visueel passen.`, `Contract, verzekering en vergunningen moeten het werkelijke gebruik volgen. Weggebruik, settransport, bevoegde bestuurders, stilstand en uiterlijke aanpassingen worden vooraf afgesproken.`],
    [`De Marokkaanse productieketen`, `Vergunningen, scouting, technici, materiaal, verblijf, catering, figuranten, vervoer en beveiliging vormen één keten. Specialisten besparen tijd met eerlijke inventaris, één aanspreekpunt en noodplanning.`, `Accrocar zegt luxe voertuigen te hebben geleverd aan de Marokkaanse productie. De casus toont lokale capaciteit zonder de bijdrage tot een ongedocumenteerd officieel partnerschap te maken.`],
  ],
};

const questions = {
  fr: [
    ['La saison 3 de The Gentlemen est-elle confirmée ?', 'Oui. Netflix l’a confirmée le 23 août 2026 et Tudum a publié une annonce le 10 septembre.'],
    ['Où se déroule le tournage marocain ?', 'Rabat et Erfoud sont les deux lieux rapportés publiquement par Le360 au 16 septembre 2026.'],
    ['Merzouga est-elle confirmée ?', 'Non. Erfoud est rapportée ; Merzouga ne doit pas être présentée comme lieu de cette saison sans nouvelle preuve.'],
    ['Accrocar est-il un fournisseur officiel de Netflix ?', 'Cette formulation n’est pas établie. Accrocar indique avoir fourni des véhicules à la production au Maroc, sans rendre publique la chaîne contractuelle.'],
  ],
  en: [
    ['Is The Gentlemen Season 3 confirmed?', 'Yes. Netflix confirmed it on 23 August 2026 and Tudum published a dedicated announcement on 10 September.'],
    ['Where is the Morocco filming taking place?', 'Rabat and Erfoud are the two locations publicly reported by Le360 as of 16 September 2026.'],
    ['Is Merzouga confirmed?', 'No. Erfoud is reported; Merzouga must not be presented as a Season 3 location without new evidence.'],
    ['Is Accrocar an official Netflix supplier?', 'That wording is not established. Accrocar says it supplied vehicles to the production in Morocco, without publishing the contractual chain.'],
  ],
  es: [
    ['¿Está confirmada la temporada 3?', 'Sí. Netflix la confirmó el 23 de agosto de 2026 y Tudum publicó un anuncio el 10 de septiembre.'],
    ['¿Dónde se rueda en Marruecos?', 'Rabat y Erfoud son los dos lugares comunicados públicamente por Le360 a 16 de septiembre de 2026.'],
    ['¿Está confirmada Merzouga?', 'No. Erfoud está comunicada; Merzouga no debe presentarse como localización sin nuevas pruebas.'],
    ['¿Accrocar es proveedor oficial de Netflix?', 'Esa formulación no está demostrada. Accrocar afirma haber suministrado vehículos a la producción, sin publicar la cadena contractual.'],
  ],
  nl: [
    ['Is The Gentlemen seizoen 3 bevestigd?', 'Ja. Netflix bevestigde het op 23 augustus 2026 en Tudum publiceerde op 10 september een apart bericht.'],
    ['Waar vinden de Marokkaanse opnames plaats?', 'Rabat en Erfoud zijn op 16 september de twee publiek door Le360 gemelde locaties.'],
    ['Is Merzouga bevestigd?', 'Nee. Erfoud is gemeld; Merzouga mag zonder nieuw bewijs niet als locatie worden gepresenteerd.'],
    ['Is Accrocar een officiële Netflix-leverancier?', 'Die formulering is niet vastgesteld. Accrocar zegt voertuigen te hebben geleverd zonder de contractketen openbaar te maken.'],
  ],
};

const introLabels = {
  fr: ['À retenir', 'Vérification éditoriale'], en: ['Key point', 'Editorial verification'], es: ['Lo esencial', 'Verificación editorial'], nl: ['Kernpunt', 'Redactionele controle'],
};

function articlePath(locale, slug) {
  return locale === 'fr' ? `/articles/${slug}` : locale === 'es' ? `/es/articulos/${slug}` : locale === 'nl' ? `/nl/artikelen/${slug}` : `/en/articles/${slug}`;
}

function imageAltFor(locale, filename) {
  return {
    fr: imageMeta[filename][0], en: imageMeta[filename][0].replace('Tour Hassan et colonnade à Rabat', 'Hassan Tower and columns in Rabat').replace('Kasbah des Oudayas à Rabat', 'Kasbah of the Udayas in Rabat').replace('Architecture en terre au sud d’Erfoud', 'Earth architecture south of Erfoud').replace('Dunes de l’Erg Chebbi près de Merzouga, utilisées comme contexte régional', 'Erg Chebbi dunes near Merzouga, shown as regional context').replace('Décor des studios Atlas à Ouarzazate', 'Atlas Studios set in Ouarzazate').replace('Véhicule de la flotte Accrocar au Maroc', 'Vehicle from the Accrocar fleet in Morocco').replace('Bentley Bentayga de la flotte Accrocar', 'Bentley Bentayga from the Accrocar fleet').replace('Rolls-Royce Cullinan de la flotte Accrocar', 'Rolls-Royce Cullinan from the Accrocar fleet'),
    es: imageMeta[filename][0].replace('Tour Hassan et colonnade à Rabat', 'Torre Hassan y columnas en Rabat').replace('Kasbah des Oudayas à Rabat', 'Kasbah de los Udayas en Rabat').replace('Architecture en terre au sud d’Erfoud', 'Arquitectura de tierra al sur de Erfoud').replace('Dunes de l’Erg Chebbi près de Merzouga, utilisées comme contexte régional', 'Dunas del Erg Chebbi cerca de Merzouga como contexto regional').replace('Décor des studios Atlas à Ouarzazate', 'Decorado de Atlas Studios en Uarzazat').replace('Véhicule de la flotte Accrocar au Maroc', 'Vehículo de la flota Accrocar en Marruecos').replace('Bentley Bentayga de la flotte Accrocar', 'Bentley Bentayga de la flota Accrocar').replace('Rolls-Royce Cullinan de la flotte Accrocar', 'Rolls-Royce Cullinan de la flota Accrocar'),
    nl: imageMeta[filename][0].replace('Tour Hassan et colonnade à Rabat', 'Hassantoren en zuilen in Rabat').replace('Kasbah des Oudayas à Rabat', 'Kasba van de Oedaja’s in Rabat').replace('Architecture en terre au sud d’Erfoud', 'Leembouw ten zuiden van Erfoud').replace('Dunes de l’Erg Chebbi près de Merzouga, utilisées comme contexte régional', 'Duinen van Erg Chebbi bij Merzouga als regionale context').replace('Décor des studios Atlas à Ouarzazate', 'Decor van Atlas Studios in Ouarzazate').replace('Véhicule de la flotte Accrocar au Maroc', 'Voertuig uit de Accrocar-vloot in Marokko').replace('Bentley Bentayga de la flotte Accrocar', 'Bentley Bentayga uit de Accrocar-vloot').replace('Rolls-Royce Cullinan de la flotte Accrocar', 'Rolls-Royce Cullinan uit de Accrocar-vloot'),
  }[locale];
}

function figure(locale, filename, caption) {
  const alt = imageAltFor(locale, filename);
  const imageWord = { fr: 'Photo', en: 'Image', es: 'Imagen', nl: 'Beeld' }[locale];
  return `<figure class="article-figure"><img src="/images/articles/gentlemen/${filename}" alt="${alt}" width="1600" height="900" loading="lazy" sizes="(max-width: 768px) 100vw, 768px" /><figcaption>${caption} ${imageWord} : <a href="${imageMeta[filename][2]}">${imageMeta[filename][1]}</a>.</figcaption></figure>`;
}

function mapBlock(locale) {
  const labels = {
    fr: ['CONFIRMÉ PAR LA PRESSE', 'Rabat', 'Début rapporté le 13 septembre 2026', 'Erfoud', 'Lieu rapporté par une source de Le360', 'NON CONFIRMÉ', 'Marrakech · Ouarzazate · Merzouga · Aït-Ben-Haddou', 'Aucune preuve publique pour cette saison'],
    en: ['REPORTED BY CREDIBLE PRESS', 'Rabat', 'Reported start on 13 September 2026', 'Erfoud', 'Location attributed to a Le360 source', 'UNCONFIRMED', 'Marrakech · Ouarzazate · Merzouga · Aït Ben Haddou', 'No public evidence for this season'],
    es: ['COMUNICADO POR PRENSA CREÍBLE', 'Rabat', 'Inicio comunicado el 13 de septiembre de 2026', 'Erfoud', 'Lugar atribuido a una fuente de Le360', 'NO CONFIRMADO', 'Marrakech · Uarzazat · Merzouga · Aït Ben Haddou', 'Sin prueba pública para esta temporada'],
    nl: ['GEMELD DOOR GELOOFWAARDIGE PERS', 'Rabat', 'Gemelde start op 13 september 2026', 'Erfoud', 'Locatie toegeschreven aan een Le360-bron', 'ONBEVESTIGD', 'Marrakech · Ouarzazate · Merzouga · Aït Ben Haddou', 'Geen openbaar bewijs voor dit seizoen'],
  }[locale];
  return `<div class="location-map" role="img" aria-label="${labels[0]}: ${labels[1]} and ${labels[3]}; ${labels[5]}: ${labels[6]}"><div class="location-map__route"><div class="location-map__point location-map__point--rabat"><span>${labels[1]}</span><small>${labels[2]}</small></div><div class="location-map__line"></div><div class="location-map__point location-map__point--erfoud"><span>${labels[3]}</span><small>${labels[4]}</small></div></div><div class="location-map__legend"><strong>${labels[0]}</strong><p>${labels[1]} · ${labels[3]}</p><strong>${labels[5]}</strong><p>${labels[6]} — ${labels[7]}</p></div></div>`;
}

function timeline(locale) {
  const rows = {
    fr: [['23 août 2026', 'Netflix confirme la saison 3 et le retour de Guy Ritchie à la réalisation.'], ['3 septembre', 'La saison 2 est mise en ligne.'], ['10 septembre', 'Tudum publie son annonce éditoriale sur la saison 3.'], ['13 septembre', 'Début du tournage à Rabat rapporté par Le360.'], ['14 septembre', 'Le360 publie et signale également Erfoud.'], ['16 septembre', 'Dernière vérification de ce dossier.']],
    en: [['23 August 2026', 'Netflix confirms Season 3 and Guy Ritchie’s return as director.'], ['3 September', 'Season 2 launches.'], ['10 September', 'Tudum publishes its Season 3 editorial announcement.'], ['13 September', 'Reported start of filming in Rabat.'], ['14 September', 'Le360 publishes and also reports Erfoud.'], ['16 September', 'This cluster was last verified.']],
    es: [['23 de agosto de 2026', 'Netflix confirma la temporada 3 y el regreso de Guy Ritchie como director.'], ['3 de septiembre', 'Se estrena la temporada 2.'], ['10 de septiembre', 'Tudum publica su anuncio editorial.'], ['13 de septiembre', 'Inicio del rodaje en Rabat comunicado por Le360.'], ['14 de septiembre', 'Le360 publica y también señala Erfoud.'], ['16 de septiembre', 'Última verificación del dossier.']],
    nl: [['23 augustus 2026', 'Netflix bevestigt seizoen 3 en Guy Ritchies terugkeer als regisseur.'], ['3 september', 'Seizoen 2 verschijnt.'], ['10 september', 'Tudum publiceert het redactionele bericht.'], ['13 september', 'Gemelde start van de opnames in Rabat.'], ['14 september', 'Le360 publiceert en noemt ook Erfoud.'], ['16 september', 'Laatste controle van dit dossier.']],
  }[locale];
  return `<div class="timeline-list">${rows.map(([d, t]) => `<div><time>${d}</time><p>${t}</p></div>`).join('')}</div>`;
}

function internalLinks(locale, index) {
  const matrices = [[1,2,3,4,5],[0,3,4,9],[0,3,4,9],[0,1,2,4],[0,3,8,9],[0,6,7,8,9],[5,7,8,9],[5,6,8],[4,5,6,9],[0,4,5,6,8]];
  return matrices[index].map((i) => `[${titles[locale][i]}](${articlePath(locale, slugs[locale][i])})`).join(' · ');
}

function faq(locale, index) {
  let qs = questions[locale];
  if (index < 5) qs = qs.slice(0, 3);
  return qs.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n');
}

function sources(locale, includeAccrocar) {
  const items = [
    `[Netflix Newsroom — renewal announcement, 23 August 2026](https://about.netflix.com/en/news/netflix-confirms-renewals-for-uk-fan-favourites-and-debuts-trailer-for-the-gentlemen-season-2)`,
    `[Netflix Tudum — Season 3 announcement, 10 September 2026](https://www.netflix.com/tudum/articles/the-gentlemen-season-3-release-date-cast-news)`,
    `[Le360 — Morocco filming report, 14 September 2026](https://fr.le360.ma/culture/le-tournage-de-la-troisieme-saison-de-the-gentlemen-demarre-au-maroc_IXADD4LCGVCEDE3M5HT6IG5HHQ/)`,
    `[Centre cinématographique marocain — official shooting and cash-rebate guide](https://www.ccm.ma/foreign_production/pe/index.html)`,
    `[Moroccan Ministry of Culture — International Cinema City, 2 July 2026](https://mjcc.gov.ma/fr/ouarzazate-lancement-des-travaux-de-construction-de-la-cite-internationale-du-cinema/)`,
  ];
  if (includeAccrocar) items.push(`Accrocar — first-party company information supplied directly to the publisher`);
  return items.map((x) => `- ${x}`).join('\n');
}

function body(locale, index) {
  const u = ui[locale];
  const c = common[locale];
  const [heading, p1, p2] = focus[locale][index];
  const isAccrocar = index >= 5;
  const secondaryImage = index === 2 ? 'erg-chebbi-desert-context.webp' : index <= 4 ? 'rabat-kasbah-oudayas.webp' : index === 7 ? 'accrocar-bentley-bentayga.webp' : 'accrocar-rolls-royce-cullinan.webp';
  const captions = {
    fr: index === 2 ? 'Paysage de dunes utilisé ici comme contexte régional : Merzouga n’est pas un lieu confirmé du tournage.' : isAccrocar ? 'Véhicule de la flotte publique Accrocar ; cette image n’affirme pas que ce modèle apparaît dans la série.' : 'Rabat réunit patrimoine historique et ville contemporaine, sans que ce visuel identifie un plateau de la série.',
    en: index === 2 ? 'Dune landscape shown as regional context: Merzouga is not a confirmed filming location.' : isAccrocar ? 'Vehicle from Accrocar’s public fleet; this image does not claim the model appears in the series.' : 'Rabat combines historic fabric and a modern city; this image does not identify a series set.',
    es: index === 2 ? 'Paisaje de dunas como contexto regional: Merzouga no es una localización confirmada.' : isAccrocar ? 'Vehículo de la flota pública de Accrocar; la imagen no afirma que el modelo aparezca en la serie.' : 'Rabat combina patrimonio y ciudad contemporánea; la imagen no identifica un plató de la serie.',
    nl: index === 2 ? 'Duinlandschap als regionale context: Merzouga is geen bevestigde opnamelocatie.' : isAccrocar ? 'Voertuig uit de openbare Accrocar-vloot; de foto beweert niet dat dit model in de serie verschijnt.' : 'Rabat verenigt erfgoed en moderne stad; deze foto identificeert geen set van de serie.',
  }[locale];
  const trust = index === 3 ? `\n## ${u.map}\n\n${mapBlock(locale)}\n` : '';
  const extra = index === 4 ? `\n## ${locale === 'fr' ? 'Pourquoi le Maroc plutôt qu’un autre pays du Maghreb ?' : locale === 'en' ? 'Why Morocco rather than another Maghreb country?' : locale === 'es' ? '¿Por qué Marruecos y no otro país del Magreb?' : 'Waarom Marokko en niet een ander Maghrebland?'}\n\n${locale === 'fr' ? 'Aucune information publique n’indique que l’Algérie était candidate pour accueillir The Gentlemen saison 3. La comparaison concerne donc les écosystèmes cinématographiques des deux pays, et non une compétition directe documentée. Le Maroc est aujourd’hui plus visible dans les tournages étrangers grâce au cash rebate, aux studios, aux équipes et aux services accumulés. L’Algérie possède pourtant une géographie remarquable, de grandes villes, le Sahara et des professionnels ; la différence observable tient surtout au volume récent d’accueil, aux incitations publiées et à la densité du réseau de services.' : locale === 'en' ? 'There is no public evidence that Algeria was competing to host The Gentlemen Season 3. The comparison concerns production ecosystems, not a documented head-to-head selection. Morocco is currently more visible in foreign production through its rebate, stages, crews and accumulated services. Algeria has remarkable geography, major cities, the Sahara and film professionals; the observable difference is the recent volume of hosted work, published incentives and service density.' : locale === 'es' ? 'No existe prueba pública de que Argelia compitiera por acoger The Gentlemen temporada 3. La comparación se refiere a ecosistemas, no a una selección directa documentada. Marruecos tiene hoy más visibilidad por su devolución, estudios, equipos y servicios acumulados. Argelia posee geografía, grandes ciudades, Sáhara y profesionales; la diferencia observable está en el volumen reciente, los incentivos publicados y la densidad de servicios.' : 'Er is geen openbaar bewijs dat Algerije meedong naar The Gentlemen seizoen 3. De vergelijking gaat over productie-ecosystemen, niet over een gedocumenteerde directe selectie. Marokko is zichtbaarder door de rebate, studio’s, crews en opgebouwde diensten. Algerije heeft uitzonderlijke geografie, grote steden, de Sahara en professionals; het waarneembare verschil zit in recent volume, gepubliceerde incentives en dienstendichtheid.'}\n` : '';
  const cta = isAccrocar ? `\n<div class="newsletter-cta"><h2>${u.cta}</h2><p>${locale === 'fr' ? 'Pour une production internationale qui recherche des véhicules haut de gamme au Maroc, Accrocar propose sourcing et livraison dans le pays, sous réserve de disponibilité et d’un brief contractuel précis.' : locale === 'en' ? 'For international productions requiring high-end vehicles in Morocco, Accrocar provides luxury-car sourcing and delivery across the country, subject to availability and an agreed production brief.' : locale === 'es' ? 'Para producciones internacionales que necesiten vehículos de alta gama en Marruecos, Accrocar ofrece selección y entrega en el país, según disponibilidad y brief contractual.' : 'Voor internationale producties die hoogwaardige voertuigen in Marokko nodig hebben, biedt Accrocar sourcing en levering in het hele land, afhankelijk van beschikbaarheid en een overeengekomen briefing.'}</p><a href="https://accrocar.com/">${locale === 'fr' ? 'Découvrir Accrocar' : locale === 'en' ? 'Explore Accrocar' : locale === 'es' ? 'Descubrir Accrocar' : 'Bekijk Accrocar'}</a></div>\n` : '';
  const depthSections = depth[locale].map(([h, a, b]) => `## ${h}\n\n${a}\n\n${b}`).join('\n\n');
  const [guideHeading, ...guideParagraphs] = readerGuide[locale];
  const guideSection = `## ${guideHeading}\n\n${guideParagraphs.join('\n\n')}`;
  return `<div class="key-facts"><strong>${introLabels[locale][0]}</strong><p>${descriptions[locale][index]}</p></div>

## ${u.facts}

${c.facts}

## ${heading}

${p1}

${p2}
${trust}
## ${u.verified}

${c.context}

## ${u.unknown}

${c.unknown}

${figure(locale, secondaryImage, captions)}

## ${u.logistics}

${index >= 5 ? c.logistics : c.context}

${index >= 5 ? focus[locale][5][1] + '\n\n' + focus[locale][6][1] : c.logistics}
${extra}
${depthSections}

${guideSection}

## ${u.method}

${c.method}

## ${u.latest}

${timeline(locale)}

## ${u.related}

${internalLinks(locale, index)}
${cta}
## ${u.faq}

${faq(locale, index)}

## ${u.sources}

${sources(locale, isAccrocar)}
`;
}

for (const locale of locales) {
  fs.mkdirSync(path.join(outRoot, locale), { recursive: true });
  for (let i = 0; i < 10; i++) {
    const filename = images[i];
    const meta = imageMeta[filename];
    const frontmatter = `---\ntitle: ${JSON.stringify(titles[locale][i])}\nh1: ${JSON.stringify(titles[locale][i])}\ndescription: ${JSON.stringify(descriptions[locale][i])}\nslug: ${JSON.stringify(slugs[locale][i])}\ncategory: "culture"\nlang: ${JSON.stringify(locale)}\npubDate: ${published}\nupdatedDate: ${published}\nauthor: ${JSON.stringify(ui[locale].byline)}\nimage: "/images/articles/gentlemen/${filename}"\nheroImage: "/images/articles/gentlemen/${filename}"\nimageAlt: ${JSON.stringify(imageAltFor(locale, filename))}\nimageCredit: ${JSON.stringify(meta[1])}\nimageSource: ${JSON.stringify(meta[2])}\nfeatured: ${i === 0}\ndraft: false\ntags: ["The Gentlemen Season 3", "Morocco", "Rabat", "Erfoud", "Guy Ritchie"${i >= 5 ? ', "Accrocar", "production vehicles"' : ''}]\ntranslationKey: "the-gentlemen-morocco-${i + 1}"\n---\n\n`;
    fs.writeFileSync(path.join(outRoot, locale, `${slugs[locale][i]}.md`), frontmatter + body(locale, i));
  }
}

console.log('Generated 40 localized The Gentlemen articles.');
