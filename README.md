# Pokédex 2025 - Pokémon Card Collection & Trading Platform

**Описание:**  
Pokédex 2025 – это мобильное и веб-приложение в стиле Pokédex, где пользователи могут коллекционировать карточки Pokémon (как реальные, так и цифровые), искать и фильтровать их по редкости, типу, поколению, безопасно обмениваться картами, участвовать в аукционах, собирать достижения, зарабатывать рейтинг и награды. Первая версия поддерживает нативно Android (через PWA или Expo/EAS Build, iOS планируется позже).

## Функционал:
- **Коллекция:** Добавление карточек в свою коллекцию, отметки «у меня есть» и «ищу», фильтрация по поколению, типу, редкости. Карточки можно добавлять вручную или из базы (интеграция с PokeAPI/Pokémon TCG API). Данные карточек кешируются для быстрых повторных запросов.
- **Поиск:** Полнотекстовый поиск карт по имени, типу или ID. Быстрый интерактивный поиск с автоподгрузкой результатов, возможность фильтрации по поколению, эволюции, редкости.
- **Обмен (Trade):** Пользователи могут предлагать обмен: выбрать карту из своей коллекции и карту, которую хотят получить. Обмен происходит через интерфейс с подтверждением обеих сторон. Предусмотрены уведомления о новых предложениях и ответах (принятие/отклонение). Система рейтингов по успешным обменам.
- **Аукционы:** Возможность выставлять карты на аукцион с таймером. Пользователи делают ставки в реальном времени. Платформа взимает комиссию с финальной цены (монетизация). По окончании аукциона владелец карты передает её победителю, рейтинг продавца повышается.
- **Профиль:** Пользовательский профиль с аватаром и ником, отображением рейтинга трейдера. Статистика (сколько карт собрано, сколько обменов/аукционов завершено), а также достижения (бэджи) за различные активности, например, первый успешный обмен, определенное количество собранных карт и т.д.
- **Дополнительно:** Планируется магазин (покупка VIP-подписок, бустеров, тем оформления), ежедневные награды за вход, обмен внутренней валюты на предметы – эти функции будут реализованы в будущих версиях.

## Технологии:
- **Frontend:** React + Tailwind CSS (адаптивный дизайн). Веб-приложение настроено как PWA для мобильной поддержки. *(Опционально Expo/EAS Build для сборки под Android в будущем.)*
- **Backend:** Node.js + Express + Sequelize + PostgreSQL. 
- **API внешние:** PokeAPI / Pokémon TCG API для получения данных о карточках (название, изображение, тип, редкость и т.п.).
- **Docker:** Docker и docker-compose для контейнеризации приложения (отдельно frontend, backend, база данных). 
- **Безопасность:** JWT-токены для авторизации (JSON Web Token), пароли хранятся в хэшированном виде (bcrypt). 
- **Монетизация:** Реализована через комиссии с аукционов; планируются платные премиум-функции и подписки в будущем.

## Установка и запуск (Windows 7/10):
1. Установите **Docker Desktop** для Windows и запустите его. Убедитесь, что Docker работает (Docker Engine запущен).
2. Скачайте проект (репозиторий с файлами приложения) на свой компьютер. Убедитесь, что структура файлов соответствует описанной (директории `backend`, `frontend`, файл `docker-compose.yml` и др.).
3. Откройте командную строку Windows (CMD) или PowerShell в папке проекта (где лежит `docker-compose.yml`).
4. Выполните команду:  
   ```bash
   docker-compose up --build
