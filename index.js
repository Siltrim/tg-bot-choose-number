const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options.js');

const token = '6353679964:AAGMFjojPtP98KUUUKp3JUaZ_xSTLeeuoCU';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Угадай цифру от 1 до 9`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай число', gameOptions);
};

bot.setMyCommands([
  { command: '/start', description: 'Начальное приветствие' },
  { command: '/info', description: 'Получить информацию о пользователе' },
  { command: '/game', description: 'Угадай цифру' },
]);

const start = () => {
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      return bot.sendMessage(chatId, `Добро пожаловать в чат бот`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз');
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `Не отгадал цифру ${chats[chatId]}`, againOptions);
    }
  });
};

start();
