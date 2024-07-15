import Handlebars from 'handlebars';

// Import the Handlebars templates as raw strings
import moviesList from '../templates/movies-list.hbs?raw';
import movie from '../templates/partials/movie.hbs?raw';
import placeholder from '../templates/partials/placeholder.hbs?raw';

// Register Handlebars custom helper
Handlebars.registerHelper('eq', (a, b) => a === b);

// Register partials
Handlebars.registerPartial('movie', movie);

// Compile templates
const moviesTemplate = Handlebars.compile(moviesList);
const placeholderTemplate = Handlebars.compile(placeholder);

export function getMoviesTemplate(data, context) {
  return moviesTemplate({ movies: data, context });
}

export function getPlaceholderTemplate(data, context) {
  return placeholderTemplate({ message: data, context });
}