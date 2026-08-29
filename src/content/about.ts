import { LIVE_SOCIALS } from "./site";
import type { Section } from "./types";

/** TODO(content): a few short paragraphs. Each string is one paragraph. */
const body: string[] = [
  "Hi,  I am Berkay Emre Keskin. I am a computer engineer recently graduated (class 2026) from Istanbul Technical University with high honors (GPA of 3.54). I did my internships at Aselsan and Yapi Kredi Teknoloji. I am currently a software engineering intern @Yapi Kredi Teknoloji. I enjoy playing football, watching movies and designing 2D and 3D characters. I also want to play guitar one day. My favourite song is PPP from Beach House for a while. You can check my favourite playlist by clicking the record player. My favourite movie as you can guess is Mulholland Drive from David Lynch. You can also check my movie reviews from letterboxd. If you want to connect, mail me or dm me from linkedin. :)"
];

export const about: Extract<Section, { id: "about" }> = {
  id: "about",
  kind: "about",
  title: "About",
  intro: "",
  body,
  socials: LIVE_SOCIALS,
};
