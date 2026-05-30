export type EventType = 'Выставка' | 'Курсинг' | 'Рейсинг';
export type EventStatus = 'Планируем' | 'Записаны' | 'Участвовали' | 'Результаты';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: EventType;
  status: EventStatus;
  url?: string;
}

export const events: Event[] = [
  {
    id: '1',
    title: 'Монопородная выставка салюки',
    date: '2025-06-15',
    location: 'Москва',
    type: 'Выставка',
    status: 'Записаны',
  },
  {
    id: '2',
    title: 'Курсинг — Кубок Москвы',
    date: '2025-07-20',
    location: 'Москва',
    type: 'Курсинг',
    status: 'Планируем',
  },
  {
    id: '3',
    title: 'Рейсинг — Чемпионат России',
    date: '2025-08-10',
    location: 'Санкт-Петербург',
    type: 'Рейсинг',
    status: 'Планируем',
  },
];
