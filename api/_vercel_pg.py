# from http.server import BaseHTTPRequestHandler
# from urllib import parse
# import json
# import os
# import psycopg2
# import sys

# class PG:

#     def __init__(self):
#         host = os.environ.get('POSTGRES_HOST')
#         dbname = os.environ.get('POSTGRES_DATABASE')
#         user = os.environ.get('POSTGRES_USER')
#         password = os.environ.get('POSTGRES_PASSWORD')
#         port = os.environ.get('POSTGRES_PORT')
#         if None in [host, dbname, port]:
#             raise Exception("_vercel_pg class missing required env variables.")

#         self.connection = psycopg2.connect(
#             host = host,
#             dbname = dbname,
#             user = user,
#             password = password,
#             port = port,
#         )
#         self.connection.autocommit = True
#         self.database_url = f'postgresql://{user}:{password}@{host}:{port}/{dbname}'


#     def write_df_to_table(self, table_name, df):
#         df.to_sql(table_name, self.database_url, if_exists='replace')


#     def get_table_schema(self, table_name):
#         cur = self.connection.cursor()
#         cur.execute(f'select * from information_schema.columns where table_schema = \'public\' and table_name = \'{table_name}\';')
#         res = cur.fetchall()
#         cur.close()
#         return res
