export const STATUS = {
  SCHEDULED: 'SCHEDULED',
  DELAYED: 'DELAYED',
};

export const STATUS_LABELS = {
  [STATUS.SCHEDULED]: 'По расписанию',
  [STATUS.DELAYED]: 'Задержан',
};

export const STATUS_CLASS = {
  [STATUS.SCHEDULED]: 'status--ok',
  [STATUS.DELAYED]: 'status--warn',
};

export const COMMANDS = {
  DELAY:            { path: 'delay',            label: 'Задержать рейс' },
  DELAY_FOUR_HOURS: { path: 'delay-four-hours', label: 'Задержать на 4 часа' },
  CANCEL_DELAY:     { path: 'cancel-delay',     label: 'Отменить задержку' },
};