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
Watch video 13.

### Generated files
prisma.graphql is a generated file that regenerates every time we update or add models to the datamodel.prisma file.

### Importing models into Schema
GraphQL doesn't have imports, we get these via Prisma and the imports have to be added as comments (with the '#' as the comment field)
