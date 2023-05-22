import Markdown from 'markdown-it';
import hightlight from 'highlight.js';

const mdOptions: Markdown.Options = {
    linkify: true,
    typographer: true,
    breaks: true,
    langPrefix: 'language-',
    highlight(str, lang) {
        if (lang && hightlight.getLanguage(lang)) {
            try {
                return (
                    '<pre class="hljs"><code>' +
                    hightlight.highlight(str, { language: lang }).value +
                    '</code></pre>'
                );
            } catch (_) {}
        }
        return '';
    },
};

export const md = new Markdown(mdOptions);