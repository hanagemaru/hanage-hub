import type { Content } from "./types";

/**
 * 英語版の文章。
 *
 * 日本語からの逐語訳にしない。同じことを英語として自然な言い方で書く。
 * 法務ページだけは原文の意味を動かさないよう、構成と主張を保ったまま訳す。
 */
export const en: Content = {
  htmlLang: "en",
  ogLocale: "en_US",

  siteTagline: "Games and apps.",
  footerTagline: "Games and apps.",
  siteDescription:
    "Browser games and web apps made by one person. Free to play, nothing to install.",

  nav: {
    home: "Home",
    games: "Games",
    notes: "Dev notes",
    updates: "Updates",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    otherLocaleLabel: "日本語",
    mainNavLabel: "Main navigation",
    footerNavLabel: "Footer navigation",
    brandHomeLabel: "hanage.app home",
  },

  home: {
    gamesHeading: "Games",
    gamesMore: "See all",
    notesHeading: "Dev notes",
    notesMore: "See all",
    updatesHeading: "Updates",
    updatesMore: "See all",
  },

  gamesPage: {
    title: "Games",
    metaDescription: "Every browser game published on hanage.app.",
    listLabel: "Game list",
  },

  gameDetail: {
    specsLabel: "Game details",
    howToPlayLabel: "How to play",
    howToPlayTitle: "How to play",
    relatedNotesLabel: "Dev notes for this game",
  },

  notesPage: {
    title: "Dev notes",
    description: "Things I tried, dropped, measured, and kept while making the games.",
    metaDescription: "Development notes for the games published on hanage.app.",
  },

  updatesPage: {
    title: "Updates",
    description: "What changed on the site and in the games.",
    metaDescription: "Release notes and site updates for hanage.app.",
  },

  aboutPage: {
    title: "About",
    description: "A site for browser games and web apps built by one person.",
    metaDescription: "Who runs hanage.app.",
    siteHeading: "About hanage.app",
    siteParagraphs: [
      "hanage.app is a home for browser games and web apps made by one person. The focus is on games you can open and play without installing anything.",
      "Each game is played on the devices it supports, and the controls, rules, and presentation are adjusted from those tests.",
    ],
    processHeading: "How the games are made",
    processParagraphs: [
      "I handle the concept, rules, interface, implementation, device testing, and post-release tuning.",
      "For larger mechanics I usually build a small test page or automated check first, then move the result into the game. The useful parts of that process are kept here as dev notes.",
    ],
    ownerHeading: "Who runs this",
    ownerRole: "design, development, and operation",
    contactLabel: "Contact",
  },

  contactPage: {
    title: "Contact",
    description: "How to reach me about the games and the site.",
    metaDescription: "How to get in touch about hanage.app and its games.",
    reachHeading: "Get in touch",
    reachBody: "For anything about the games or the site, message the X account.",
    bugsHeading: "Report a bug",
    bugsBody:
      "If you can describe how to reproduce it, GitHub Issues is the surest route. Issues are public, so leave out anything you would not want published.",
    siteLabel: "Site",
  },

  privacyPage: {
    title: "Privacy Policy",
    description: "How information is handled on hanage.app and in the games published here.",
    revision: "Effective 13 August 2026. Last updated 20 September 2026.",
    translationNote:
      "This is a translation provided for convenience. The Japanese version is the authoritative text.",
    sections: [
      {
        heading: "Scope",
        paragraphs: [
          "This policy covers hanage.app and the games it links to that I operate. It applies to each game's subdomain, as well as temporary URLs such as workers.dev and GitHub Pages used before a full release. Where an external service shows its own policy, that service's policy applies instead.",
        ],
      },
      {
        heading: "What is collected",
        list: [
          "Server access logs (IP address, browser type, time of access, and similar)",
          "Data stored on your device, such as local storage holding settings and progress",
          "If you submit a ranking score: the display name, the score, and a per-device anonymous ID",
          "Play data used to verify scores (information needed to reconstruct the board, the opening position, the sequence of moves, in-game elapsed time, and the rule and application versions)",
          "A hashed signal derived from network information, used to limit abuse and excessive requests",
        ],
        paragraphs: [
          "Raw IP addresses are not stored in the ranking database. No account is required, and no name, address, email address, or social media account is collected.",
        ],
      },
      {
        heading: "How it is used",
        paragraphs: [
          "Collected information is used to run the service, keep your settings and progress, operate the rankings, verify scores, prevent abuse, investigate faults, and improve quality.",
        ],
      },
      {
        heading: "Rankings",
        paragraphs: [
          "Titles with rankings do not ask for a name when you start playing. You choose a display name only when you submit a score. Display names are shown to other players, so do not enter your real name or contact details.",
          "Players are identified by an anonymous ID with no login, together with a random credential stored on the device. The server stores a hash of that credential, never the credential itself.",
        ],
      },
      {
        heading: "Putt rankings",
        paragraphs: [
          "When you submit a score, we store a per-device anonymous ID, a hash of your credential, your display name, total and per-hole strokes, hole-out information, the speed and direction of each shot, and the submission time. Shot data is used to check for impossible scores. Data is stored in Cloudflare D1.",
          "Raw IP addresses are not stored in the ranking database. A hashed signal is used to limit excessive submissions. Rate-limit data older than 24 hours is removed when a subsequent score is submitted.",
          "Use Delete my records on the ranking screen to delete your display name, scores, and shots. Deletion cannot be undone. The credential for accessing your records stays on your device; transferring it to another device is not supported.",
        ],
      },
      {
        heading: "Service providers",
        paragraphs: [
          "The site, the games, the ranking API, and the database are served through hosting providers including Cloudflare, GitHub Pages, and Netlify, depending on the title. These providers may process access information for delivery, security, and fault investigation.",
        ],
      },
      {
        heading: "Cookies and advertising",
        paragraphs: [
          "As of this page's last update, no advertising is served on this site or in the games published here. Google AdSense and H5 Games Ads are planned. Once advertising is introduced, Google and other advertising providers may use cookies, web beacons, and IP addresses to serve ads, measure their performance, and show ads based on your interests.",
          "When that happens, this page will be updated to name the advertising services actually in use and describe how information is handled. In regions where consent is required by law or by the advertising provider, consent will be requested before any advertising-related processing, and the choice can be changed later.",
          {
            before: "For how Google uses information, see ",
            link: { label: "Google's explanation", url: "https://policies.google.com/technologies/partner-sites?hl=en" },
            after: ".",
          },
        ],
      },
      {
        heading: "Analytics",
        paragraphs: [
          "Cloudflare Web Analytics is used on the hub and on production game pages where measurement is enabled. It collects aggregate information such as the pages visited, the referring source, browser and device type, and approximate region.",
          "The service uses no cookies or local storage and creates no identifier that follows a person across devices. The information it collects does not identify individuals.",
        ],
      },
      {
        heading: "Retention and deletion",
        paragraphs: [
          "Ranking display names and scores are kept for as long as the ranking feature needs them. Access logs are retained according to each hosting provider's own settings and policies.",
          "In Multicolor Sweeper, delete your display name and records from Settings. In Putt, use \"Delete my records\" on the ranking screen. If you cannot reach that screen, or want to discuss deletion, get in touch through the contact page.",
        ],
      },
      {
        heading: "External sites",
        paragraphs: [
          "This site is not responsible for how third-party sites handle information once you leave. Please check each site's own policy.",
        ],
      },
      {
        heading: "Changes to this policy",
        paragraphs: [
          "This policy may be revised as the law or the service changes. Significant changes will be announced on the site.",
        ],
      },
      {
        heading: "Contact",
        paragraphs: [
          {
            before: "For anything about this policy, use the ",
            link: { label: "contact", route: "/contact/" },
            after: " page.",
          },
        ],
      },
    ],
  },

  termsPage: {
    title: "Terms of Use",
    description: "The conditions for using hanage.app and the works published here.",
    revision: "Effective 13 August 2026. Last updated 4 September 2026.",
    translationNote:
      "This is a translation provided for convenience. The Japanese version is the authoritative text.",
    sections: [
      {
        heading: "Using the service",
        paragraphs: [
          "This site and the works published here are for personal enjoyment. Do not use them in ways that break the law, interfere with the operation of the service, or infringe the rights of other users or third parties.",
        ],
      },
      {
        heading: "Rankings",
        paragraphs: [
          "In titles with rankings, submit only scores achieved through normal play. Scores obtained by modifying the program or automating input, and display names that other players would find offensive, may be removed without notice.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "Rights in the text, images, programs, and other content on this site belong to their respective owners. They may not be reproduced, copied, or redistributed without permission.",
        ],
      },
      {
        heading: "Disclaimer",
        paragraphs: [
          "This site makes no guarantee that its content is accurate or complete, or that it will remain available. To the extent permitted by law, no liability is accepted for damages arising from use of this site or the works published here.",
        ],
      },
      {
        heading: "Changes and suspension",
        paragraphs: [
          "The service may be changed, suspended, or discontinued without prior notice. These terms may also be revised as needed.",
        ],
      },
    ],
  },

  games: {
    multicolorSweeper: {
      subtitle: "Minesweeper where the bombs have colors",
      description:
        "A 9×9 minesweeper where every bomb has a color, and the clue numbers are split by color too.",
      detailsHeading: "How it works",
      details: [
        "Each open tile shows the number of bombs in its eight neighbors, split by color. You can play with three or four colors.",
        "After the first tile is chosen, the board is generated around that opening. Only boards that can be solved to the end by logic in both three- and four-color mode are accepted.",
        "The same bomb layout is also tested as ordinary one-color minesweeper. If that version is still solvable, the board is rejected. The colors have to matter, not just decorate the rules.",
      ],
      status: null,
      playLabel: "Open the game ↗",
      specs: { price: "Free", content: "9×9 time attack", devices: "Phone and desktop" },
      shotAlts: [
        "A 9×9 board with clue numbers split by color",
        "The moment a bomb is opened and the tiles blow apart",
        "The finished board with every bomb revealed",
      ],
      shotsLabel: "Multicolor Sweeper screenshots",
      metaDescription:
        "A 9×9 minesweeper where every bomb has a color, and the clue numbers are split by color too.",
    },
    putt: {
      subtitle: "Putting, read off the slope",
      description:
        "Read the slope, pick your line, and swing the putter with a swipe. How fast you swing is how hard the ball rolls.",
      detailsHeading: "How it works",
      details: [
        "Shot strength comes from the speed of the swing just before impact, not from how far your finger travelled. A short fast motion can hit harder than a long slow one.",
        "The visible slope is also used by the ball physics. Rough, second cut, and bunkers add different amounts of resistance.",
        "Each hole is generated from a seed and then selected for a tour. The same seed recreates the same shape, and candidate holes are checked for connectivity and for areas around the cup where the ball cannot reasonably stop.",
      ],
      status: null,
      playLabel: "Open the game ↗",
      specs: { price: "Free", content: "9-hole stroke play", devices: "Phone only" },
      shotAlts: [
        "The green and the cup, seen from behind the ball",
        "Reading the slope from a low viewpoint",
        "The map seen from directly above",
      ],
      shotsLabel: "Putt screenshots",
      metaDescription:
        "Read the slope, pick your line, and swing the putter with a swipe. How fast you swing is how hard the ball rolls.",
    },
  },

  howToPlay: {
    multicolorSweeper: {
      metaTitle: "How to play Multicolor Sweeper",
      metaDescription:
        "How to play Multicolor Sweeper: finding colored bombs from clue numbers split by color.",
      heroDescription:
        "Minesweeper at heart, except the bombs have colors and the clue numbers are split by color.",
      backLabel: "Back to the game",
      sections: [
        {
          heading: "The basics",
          kind: "steps",
          steps: [
            {
              title: "Pick a difficulty and a color count",
              body: "15, 20, or 25 bombs, in three or four colors.",
            },
            {
              title: "Open any tile to start",
              body: "Your first tile and the eight around it are always safe.",
            },
            {
              title: "Read the numbers by color",
              body: "Each number counts the bombs of that color among the eight neighboring tiles.",
            },
            { title: "Open every tile without a bomb", body: "That clears the board." },
          ],
        },
        {
          heading: "Flags",
          kind: "defs",
          intro: "Slide your finger across a tile. The direction you slide picks the flag color.",
          items: [
            { term: "Up-left:", body: "red" },
            { term: "Up-right:", body: "blue" },
            { term: "Down-left:", body: "green" },
            { term: "Down-right:", body: "yellow (four-color games only)" },
            { term: "Up:", body: "a flag with no color" },
          ],
          note: "Placing the same flag again removes it.",
        },
        {
          heading: "Opening several at once",
          kind: "prose",
          body: "Tap a tile you have already opened. If the flags around it match its numbers, every unflagged neighbor opens at once. If a flag is wrong, it blows up.",
        },
        {
          heading: "Rankings",
          kind: "prose",
          body: "Clear times are ranked in three brackets: 15, 20, and 25 bombs. You choose a name when you submit a personal best.",
        },
        {
          heading: "Add it to your home screen",
          kind: "defs",
          intro:
            "Open it from your home screen like any other app. You get more screen, and it works offline.",
          items: [
            { term: "iPhone:", body: "use the Share button, then Add to Home Screen." },
            { term: "Android:", body: "open the browser menu, then Install app." },
          ],
          note: "Submitting a time to the rankings needs a connection. On iPhone the app keeps records separately from the browser, so earlier ones do not carry over.",
        },
      ],
    },
    putt: {
      metaTitle: "How to play Putt",
      metaDescription:
        "How to play Putt: read the green, swing the putter, and sink it in as few strokes as you can.",
      heroDescription: "Hold your phone upright and sink the ball in as few strokes as you can.",
      backLabel: "Back to the game",
      sections: [
        {
          heading: "Modes",
          kind: "defs",
          items: [
            { term: "Tour:", body: "choose BEGINNER, STANDARD, ADVANCED, or EXPERT and play nine holes." },
            {
              term: "Practice:",
              body: "replay a single hole as many times as you like. NEW HOLE swaps in a different one.",
            },
          ],
        },
        {
          heading: "One stroke, step by step",
          kind: "steps",
          steps: [
            {
              title: "Look at the hole",
              body: "Use the view buttons and the map to see the slope and the shape of the line to the cup.",
            },
            {
              title: "Set your aim",
              body: "In the ball and low views, swipe left or right to adjust your aim.",
            },
            { title: "Address the ball", body: "Tap the screen to take your stance." },
            {
              title: "Swing",
              body: "Draw the putter to the right, then swing through to the left. Swing speed becomes ball speed.",
            },
          ],
        },
        {
          heading: "Your first hole",
          kind: "prose",
          body: "Start in Practice and compare how far the ball rolls with a short swing and a faster swing. Check the route on the map, then read the slope from the low view before aiming. Once the ball stops, compare its trail with the direction you intended.",
        },
        {
          heading: "Rankings",
          kind: "prose",
          body: "Each tour course has its own ranking. After nine holes, choose a display name and submit your personal best. Practice does not count toward the rankings. Submitting a score requires a connection.",
        },
        {
          heading: "Putters",
          kind: "prose",
          body: "CHOOSE PUTTER on the top menu offers a pin, a blade, a mallet, and a fang. The shape is cosmetic — all four play exactly the same.",
        },
        {
          heading: "Rules",
          kind: "list",
          items: [
            "You are scored on total strokes. The rough, second cut, and bunkers change how the ball rolls.",
            "Water and out of bounds cost one stroke. You replay from where you last hit.",
            "On tour, if you stop mid-round you resume from the start of that hole. Practice keeps nothing.",
          ],
        },
        {
          heading: "Add it to your home screen",
          kind: "defs",
          intro:
            "Open it from your home screen like any other app. You get more screen, and it works offline.",
          items: [
            { term: "iPhone:", body: "use the Share button, then Add to Home Screen." },
            { term: "Android:", body: "open the browser menu, then Install app." },
          ],
          note: "On iPhone the app keeps records separately from the browser, so earlier ones do not carry over.",
        },
      ],
    },
  },

  notes: {
    "putt-swipe": {
      title: "Turning a swipe into putting strength",
      summary: "Putt uses swing speed immediately before impact, rather than swipe distance, to set the ball's initial speed.",
      metaDescription: "How Putt measures a swipe and turns it into putting strength.",
      backLabel: "Back to Putt",
      sections: [
        {
          heading: "Speed, not distance",
          paragraphs: [
            "One early decision was not to map swipe distance directly to power. In a real putt, the length of the backswing matters less than what the club is doing when it meets the ball.",
            "So Putt looks at the speed of the motion immediately before impact instead of simply measuring how far the finger moved.",
          ],
        },
        {
          heading: "Measure it on a separate page",
          paragraphs: [
            "Before wiring this into the game, I made /swipe-test/, a page that only measures the gesture. It reads the finer pointer samples the browser keeps and estimates speed from the final 40 milliseconds before impact.",
            "Keeping that test away from the course and ball visuals made it much easier to repeat the same motion on an iPhone and tune only the input feel.",
          ],
        },
        {
          heading: "Movement from a stable origin",
          paragraphs: [
            "Touching the screen a little higher or lower should not make the putter jump. The game therefore uses movement from the starting point, not the absolute screen position of the finger.",
            "Input measurement and ball physics are still separate. That lets the swing feel change without quietly changing how the ball rolls.",
          ],
        },
      ],
    },
    "putt-course": {
      title: "Generating courses that are still playable",
      summary: "A hole has to be more than a different shape: the ball must be able to stop and the round must be finishable.",
      metaDescription: "How Putt generates courses and filters out holes that are not actually playable.",
      backLabel: "Back to Putt",
      sections: [
        {
          heading: "The same seed makes the same hole",
          paragraphs: [
            "Putt builds its courses from a seed. A route is generated first, then normal turf, rough, second cut, water, bunkers, and other features are placed around it.",
            "Randomness is deterministic: the same seed recreates the same hole. That matters for rankings and for reproducing a problem exactly when one appears.",
          ],
        },
        {
          heading: "A valid shape can still be a bad game",
          paragraphs: [
            "During testing I found holes where the area around the cup was so steep that a ball could reach it but would not stay there. The course looked fine, yet it was not really playable.",
            "The existing validator only knew whether playable ground was connected, so it could not catch that failure.",
          ],
        },
        {
          heading: "Turn failures into checks",
          paragraphs: [
            "I added another check for how much of the area around the cup is too steep for the ball to stop. That can be run across many generated holes before they are used.",
            "Course generation and course validation are separate on purpose. New shapes can stay experimental while the validator keeps a minimum floor under playability.",
          ],
        },
      ],
    },
    "sweeper-rebuild": {
      title: "From Gradient Sweeper to Multicolor Sweeper",
      summary: "The first version hid the numbers completely. The rebuild kept color, but made the logic explicit.",
      metaDescription: "Why Gradient Sweeper was rebuilt as Multicolor Sweeper.",
      backLabel: "Back to Multicolor Sweeper",
      sections: [
        {
          heading: "The first version removed the numbers",
          paragraphs: [
            "Gradient Sweeper did not show normal minesweeper numbers. Instead, the color of each open cell hinted at the mix of nearby bomb colors.",
            "The next experiment was to keep color meaningful while making the reasoning itself easier to read. That led to splitting the clue numbers by color.",
          ],
        },
        {
          heading: "Build a lab before rebuilding the game",
          paragraphs: [
            "Before making a new product version, I built Multicolor Sweeper Lab. It could compare three and four colors, bomb counts from 15 to 40, and the same bomb layout under different color rules.",
            "The lab measured more than feel. It also checked whether boards could be solved logically and how long browser-side generation took.",
          ],
        },
        {
          heading: "Keep the 9×9 skeleton",
          paragraphs: [
            "The released game was narrowed to a 9×9 board with 15, 20, or 25 bombs and clue numbers split by color.",
            "Parts that already worked — a safe opening area, zero-cell expansion, and the basic win condition — stayed. The clue system and board generator were rebuilt around them.",
          ],
        },
      ],
    },
    "sweeper-no-guess": {
      title: "Making boards that do not need guessing",
      summary: "A solver finishes each candidate board before the player sees it, and boards that require a guess are discarded.",
      metaDescription: "How Multicolor Sweeper generates No-Guess boards and checks that color is essential.",
      backLabel: "Back to Multicolor Sweeper",
      sections: [
        {
          heading: "Let the solver play first",
          paragraphs: [
            "After the player chooses the first tile, a candidate board is built with that tile and its eight neighbors guaranteed safe. A solver then tries to finish the board using only clues a player could see.",
            "The solver uses no probability and does not look at the hidden answer to make decisions. If logic cannot identify another safe tile before the board is finished, that candidate is discarded.",
          ],
        },
        {
          heading: "Check that color actually matters",
          paragraphs: [
            "A No-Guess board is not enough. The same bomb layout is also solved after all colors are merged into ordinary minesweeper numbers.",
            "If the one-color version can still be solved, the candidate is rejected. A board is kept only when the multicolor clues add information the ordinary rules do not provide.",
          ],
        },
        {
          heading: "Keep generation off the main screen",
          paragraphs: [
            "Board generation and solving run in a Web Worker so the interface stays responsive. The timer starts only after an accepted board exists and the first opening has finished.",
            "Generation time is benchmarked by difficulty, and the seed path is deterministic so the same inputs can reproduce the same accepted board.",
          ],
        },
      ],
    },
  },

  updates: {
    "putt-ranking": {
      title: "Online rankings added to Putt",
      body: "Each of the four tour courses now has a leaderboard for total strokes over nine holes. Submitted scores are also replay-checked on the server.",
    },
    "putt-visuals": {
      title: "The four Putt tours now look different",
      body: "BEGINNER, STANDARD, ADVANCED, and EXPERT now use different sky, light, turf, and tree setups. Course geometry and ball physics were left unchanged.",
    },
    "putt-course-v2": {
      title: "Putt course structure updated",
      body: "Holes now combine different route and hazard features instead of relying on one course-wide difficulty dial. Validation was expanded to reject holes with too much unstoppably steep ground near the cup.",
    },
    "mcs-bgm": {
      title: "BGM added to Multicolor Sweeper",
      body: "The game now has background music during play. It starts after the first permitted interaction to respect browser audio restrictions.",
    },
    "putt-release": {
      title: "Putt is out",
      body: "Released a putting game where you read the slope, choose a line, and hit the ball with the speed of your swipe.",
    },
    "mcs-release": {
      title: "Multicolor Sweeper is out",
      body: "Released a minesweeper where bomb colors split the clue numbers. Online rankings cover the 15, 20, and 25 bomb modes.",
    },
    "site-start": {
      title: "hanage.app was started",
      body: "Started as one place to publish the browser games and web apps I make.",
    },
  },
};
