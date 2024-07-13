import Handlebars from 'handlebars';

// Import the Handlebars templates as raw strings
import moviesList from '../templates/movies-list.hbs?raw';
import movie from '../templates/partials/movie.hbs?raw';

// Register Handlebars custom helper
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

// Register the movie partial
Handlebars.registerPartial('movie', movie);

// Compile the main template
const template = Handlebars.compile(moviesList);

export default function getMoviesTemplate(data, context) {
  return template({ movies: data, context: context });
}