import { merge } from 'lodash';
import { GraphQLSchema } from 'graphql/type/schema';
import {
  StarwarsTypes,
  ExampleTypes,
  UserTypes,
  MovieTypes,
  BlogTypes
} from './models';
import {
  ExampleResolver,
  StarwarsResolver,
  UserResolver,
  MovieResolver,
  BlogResolver
} from './resolvers';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import FormattableDateDirective from './directives/formattableDate';
import AuthDirective from './directives/authDirective';
import mocks from './mocks';
import SubscriptionTypes from './subscriptions';
import QueryTypes from './queries';
import MutationTypes from './mutations';

// GraphQL Schema Definitions
const SchemaDefinition = `
schema {
    query: RootQueryType 
    mutation: RootMutationType
    subscription: SubscriptionType
}
  `;

// Merge all the resolvers
const resolvers = merge(
  ExampleResolver,
  StarwarsResolver,
  UserResolver,
  MovieResolver,
  BlogResolver
);

// Create GraphQL Schema with all the pieces in place
export const setupSchema = (): GraphQLSchema => {
  const schema = makeExecutableSchema({
    typeDefs: [
      SchemaDefinition,
      ...QueryTypes,
      ...MutationTypes,
      ...SubscriptionTypes,
      ...StarwarsTypes,
      ...ExampleTypes,
      ...UserTypes,
      ...MovieTypes,
      ...BlogTypes
    ],
    resolvers: resolvers,
    schemaDirectives: {
      date: FormattableDateDirective,
      auth: AuthDirective
    }
  });

  if (
    process.env.GRAPHQL_MOCK !== undefined &&
    process.env.GRAPHQL_MOCK === 'true'
  ) {
    // Add mocks, modifies schema in place
    // Preserve resolvers that are implemented
    addMockFunctionsToSchema({
      schema,
      mocks: mocks,
      preserveResolvers: true
    });
  }
  return schema;
};
