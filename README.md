# Twitter Clone

Современное веб-приложение - клон Twitter на стеке Node.js + React.

![Главный экран](screenshots/mainscreen.png)
![Страница профиля](screenshots/profile.png)

---

### База данных

Спроектирована с помощью Sequelize, развернута на PostgreSQL (PgAdmin 4).

![Схема БД](screenshots/db_diagram.pgerd.png)

---

### 🚀 Быстрый старт

**Требования:** Node.js (версия 16+)

```bash
# Клонирование и установка зависимостей
git clone https://github.com/Artem-Afanasev/twitter_clone.git
cd twitter-clone
npm i

# Запуск сервера (бэкенд)
npm run dev

# В новом терминале - запуск клиента (фронтенд)
cd client
npm start
