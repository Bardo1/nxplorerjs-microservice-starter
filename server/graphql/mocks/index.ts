import * as casual from 'casual';
import RandExp from 'randexp';
import { MockList } from 'graphql-tools';
import { startCase } from 'lodash';
const num_format = '########';

export default {
  Int: () => casual.integer(0),
  PeopleType: () => ({
    name: casual.first_name + ' ' + casual.last_name,
    mass: casual.numerify(num_format),
    hair_color: casual.safe_color_name,
    skin_color: casual.safe_color_name,
    eye_color: casual.safe_color_name,
    birth_year: casual.year,
    gender: casual.random_element(['male', 'female']),
    homeworld: casual.url,
    films: casual.array_of_words(10),
    species: casual.array_of_words(10),
    vehicles: casual.array_of_words(10),
    starships: casual.array_of_words(10),
    created: casual.date('YYYY-MM-DD'),
    edited: casual.date('YYYY-MM-DD'),
    url: casual.url
  }),
  ExampleType: () => ({
    id: casual.integer(0),
    name: casual.title
  }),
  RootQueryType: () => ({
    examplesMock: () => new MockList(4),
  })
};
