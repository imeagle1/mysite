import courseAiImg from './images/course_ai_mastery_1794737810266.jpg';
import courseBotImg from './images/course_bot_builder_1794737811784.jpg';
import courseHesabyarImg from './images/course_hesabyar_finance_1794737813314.jpg';
import courseVideomiImg from './images/course_videomi_studio_1794737812472.jpg';
import heroDeskImg from './images/hero_iramo_desk_1794738858107.jpg';
import servicesNeuralImg from './images/services_ai_neural_1794738838874.jpg';

export {
  courseAiImg,
  courseBotImg,
  courseHesabyarImg,
  courseVideomiImg,
  heroDeskImg,
  servicesNeuralImg,
};

export function resolveBrandLogo(mode: 'light' | 'dark' | 'header'): string {
  const filename =
    mode === 'dark' ? 'logo_brand_19b8e3d7.png' : 'Group_179_659a031b.png';
  if (typeof document !== 'undefined') {
    const wpRoot = document.getElementById('iramo-lms-root');
    const pluginUrl = wpRoot?.dataset.pluginUrl;
    if (pluginUrl) {
      const normalized = pluginUrl.endsWith('/') ? pluginUrl : `${pluginUrl}/`;
      return `${normalized}assets/aistudio/${filename}`;
    }
  }
  return `/assets/aistudio/${filename}`;
}
