## Backend Stack
Javascript
GraphQL Yoga
Prisma DB

### GraphQL Yoga
An Express GraphQL Server for:
- Implementing Query and Mutation Resolvers
- Custom Server Side Logic
- Sending Email
- Performing JWT Authentication
- Checking Permisssions

### Prisma
A GraphQL Database Interface
- Provides a set of GraphQL CRUD API's for MySQL or Postgres database
- Schema definition
- Data Relationships
- Queried Directl from the Yoga Server
- Self-hosted or as-a-service

### Steps to add items to the db
Watch video 14.
When we want to add a new Type, we add that to the datamodel.prisma file
Run deploy to push that up to the Prisma service
That brings down a new copy of our prisma.graphql containing all queries, filters, mutations
Then we go into our schema.graphql (the public facing API that the React front end will interface with) and add the ability to create new stuff (Mutations) and get the stuff (Query)
THen go into the Mutations and Queries and write the resolvers to handle all the data manipulations.

### Generated files
prisma.graphql is a generated file that regenerates every time we update or add models to the datamodel.prisma file.

### Importing models into Schema
GraphQL doesn't have imports, we get these via Prisma and the imports have to be added as comments (with the '#' as the comment field)
