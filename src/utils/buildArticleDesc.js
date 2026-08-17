const DESC_MAX_LENGTH = 150;

/**
 * Формує короткий опис статті з її тексту.
 *
 * Потрібно тому, що форма створення статті за макетом збирає лише заголовок,
 * текст і зображення — окремого поля під опис там немає. Але картка статті
 * (ArticlesItem) опис показує, тож він має звідкись братися.
 *
 * Обрізаємо по межі слова, щоб не було "…аб". Сідові статті мають власні,
 * написані вручну описи — їх не чіпаємо, бо desc приходить у тілі запиту.
 */
export const buildArticleDesc = (article) => {
  const text = article.trim().replace(/\s+/g, " ");

  if (text.length <= DESC_MAX_LENGTH) {
    return text;
  }

  const cut = text.slice(0, DESC_MAX_LENGTH);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:!?—–-]$/, "")}…`;
};
