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

  siteTagline: "Browser games and web apps, made solo. Free, nothing to install.",
  footerTagline: "Games and web apps, made solo.",
  siteDescription:
    "Browser games and web apps made by one person. Free to play, nothing to install.",

  nav: {
    home: "Home",
    games: "Games",
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
    revision: "Effective 13 August 2026. Last updated 6 September 2026.",
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
          "Cloudflare Web Analytics is used to understand which pages are viewed. It collects aggregate information such as the pages visited, the referring source, browser and device type, and approximate region.",
          "The service uses no cookies or local storage and creates no identifier that follows a person across devices. The information it collects does not identify individuals.",
        ],
      },
      {
        heading: "Retention and deletion",
        paragraphs: [
          "Ranking display names and scores are kept for as long as the ranking feature needs them. Access logs are retained according to each hosting provider's own settings and policies.",
          "In titles with rankings, you can delete your submitted display name and scores from the in-game settings screen. If you cannot reach that screen, or want to discuss deletion, get in touch through the contact page.",
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
            { term: "Tour:", body: "pick one of three courses and play nine holes." },
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
          heading: "Putters",
          kind: "prose",
          body: "CHOOSE PUTTER on the top menu offers a pin, a blade, a mallet, and a fang. The shape is cosmetic — all four play exactly the same.",
        },
        {
          heading: "Rules",
          kind: "list",
          items: [
            "You are scored on total strokes. The ball rolls heavily once it is in the rough or the second cut.",
            "Water and out of bounds cost one stroke. You replay from where you last hit.",
            "On tour, if you stop mid-round you resume from the start of that hole. Practice keeps nothing.",
          ],
        },
      ],
    },
  },

  updates: {
    "putt-release": {
      title: "Putt is out",
      body: "A putting game about reading the slope and picking your line. Three courses, nine holes each.",
    },
    "mcs-release": {
      title: "Multicolor Sweeper is out",
      body: "A minesweeper about hunting colored bombs, with online rankings.",
    },
    "site-start": {
      title: "hanage.app was started",
      body: "Started as a single place for the games and web apps I build.",
    },
  },
};
