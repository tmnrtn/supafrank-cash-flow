I have an existing solution implemented to provide a simple cash flow predition utility for a small business. It allows a user to add upcoming Invoices and Bills along with some info relating to them then gives a rolling 13 week cash flow projection.

Currently the solution is implemented using a combination of:
Supabase - Backend
Budibase - Data CRUD
Metabase - Dashboard

Which is masdsive overkill for the simple problem and quite resource intensive

I'd like to build a lighter weight solution using, say postgres and React that provides the same functionality. I'm totally flexible on the technologies used though if there are better alternatives. I would like it to be delpoyable as docker containers.

The current supabase schema is in the file schema.sql in this folder.

The data currently in the tables is in the data subfolder of this  folder

Screenshots from the budibase app are in the bb_screenshots subfolder of this folder

The metabase dashboard uses 3 models to provide the data and I've included the sql in the metabase subfolder. I've also provided a screenshot of the dashboard
