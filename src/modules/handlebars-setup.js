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
const templates = {
  moviesList,
  placeholder
};

export default function getTemplate(templateName, data) {
  const templateString = templates[templateName];
  if (!templateString) {
    throw new Error(`Template "${templateName}" not found.`);
  }
  const template = Handlebars.compile(templateString);
  return template(data);
}