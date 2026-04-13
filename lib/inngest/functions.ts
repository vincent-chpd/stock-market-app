import { getWatchlistSymbolsByEmail } from '../actions/watchlist.actions';
import { getNews } from '../actions/finnhub.actions';
import { getAllUsersForNewsEmail } from '../actions/user.actions';
import { sendNewsSummaryEmail, sendWelcomeEmail } from '../nodemailer';
import { inngest } from './client';
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from './prompt';
import { formatDateToday } from '../utils';

export const sendSignUpEmail = inngest.createFunction(
  {
    id: 'sign-up-email',
    triggers: [{ event: 'app/user.created' }],
  },
  async ({ event, step }) => {
    const userProfile = `
      - Country: ${event.data.country}
      - Investment goals: ${event.data.investmentGoals}
      - Risk tolerance: ${event.data.riskTolerance}
      - Preferred industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

    const response = await step.ai.infer('generate-welcome-intro', {
      model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
      body: {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run('send-welcome-email', async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0];
      const introText =
        (part && 'text' in part ? part.text : null) ||
        'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.';

      const {
        data: { email, name },
      } = event;

      return await sendWelcomeEmail({ email, name, intro: introText });
    });

    return {
      success: true,
      message: 'Welcome email sent successfully',
    };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: 'daily-news-summary',
    triggers: [{ event: 'app/send.daily.news' }, { cron: '0 12 * * *' }],
  },

  //Get all users for news delivery
  async ({ step }) => {
    const users = await step.run('get-all-users', getAllUsersForNewsEmail);

    if (!users || users.length === 0) return { success: false, message: 'No users found for news email' };

    // For each user, get watchlist symbols -> fetch news
    const newsPerUser = await step.run('fetch-news-per-user', async () => {
      const results: { user: User; news: MarketNewsArticle[] }[] = [];

      for (const user of users) {
        const symbols = await getWatchlistSymbolsByEmail(user.email);
        const news = await getNews(symbols.length > 0 ? symbols : undefined).catch(() => [] as MarketNewsArticle[]);
        results.push({ user, news });
      }

      return results;
    });

    // Summarize each user's news via AI
    const userNewsSummaries: { user: User; newsContent: string | null }[] = [];

    for (const { user, news } of newsPerUser) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(news, null, 2));

        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
          body: {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.';

        userNewsSummaries.push({ user, newsContent });
      } catch (e) {
        console.log('Failed to summarize news for: ', user.email, e);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }
    // Send the emails
    await step.run('send-news-emails', async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;

          return await sendNewsSummaryEmail({ email: user.email, date: formatDateToday(), newsContent });
        })
      );
    });

    return { success: true, message: 'Daily news summary sent successfully' };
  }
);
