import morgan from 'morgan';

// Custom morgan token for ISO timestamp
morgan.token('iso-date', () => new Date().toISOString());

export const requestLogger = morgan(
  ':iso-date :method :url :status :response-time ms - :res[content-length]'
);
