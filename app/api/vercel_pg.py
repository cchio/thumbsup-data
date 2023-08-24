from http.server import BaseHTTPRequestHandler
from urllib import parse
import psycopg2
import json
import os

class PG:

    def __init__(self):
        self.connection = psycopg2.connect(
            host = os.environ.get('POSTGRES_HOST'),
            dbname = os.environ.get('POSTGRES_DATABASE'),
            user = os.environ.get('POSTGRES_USER'),
            password = os.environ.get('POSTGRES_PASSWORD'),
            port = os.environ.get('POSTGRES_PORT'),
        )
        self.connection.autocommit = True


    def dtypes_to_sql_types(dtypes):
        sql_types = []
        for x in dtypes:
            if(x == 'int64'):
                sql_types.append('int')
            elif (x == 'float64'):
                sql_types.append('float')
            elif (x == 'bool'):
                sql_types.append('boolean')
            else:
                sql_types.append('varchar')
        return sql_types


    def write_df_to_table(self, table_name, df):
        cur = self.connection.cursor()

        # Drop table if it already exists
        cur.execute(f'drop table if exists {table_name}')

        # Create SQL table to store df data
        column_names = list(df.columns.values)
        sql_types = dtypes_to_sql_types(df.dtypes)
        create_table_sql = f'create table if not exists {table_name} ('
        for i in range(len(sql_types)):
            create_table_sql = create_table_sql + '\n' + column_names[i] + 
            ' ' + sql_types[i] + ','
        create_table_sql = create_table_sql[:-1] + ' );'
        cur.execute(create_table_sql)

        self.connection.commit()
        cur.close()

    def get_table_schema(self, table_name):
        cur = self.connection.cursor()
        cur.execute(f'select * from {table_name}.columns;')
        res = cur.fetchall()
        cur.close()
        return res


	# def do_GET(self):
	# 	connection = psycopg2.connect (
	# 		host = os.environ.get('HOST'),
	# 		dbname = os.environ.get('DATABASE'),
	# 		user = os.environ.get('USER'),
	# 		password = os.environ.get('PASSWORD'),
	# 		port = os.environ.get('PORT'),
	# 	)

	# 	cursor = connection.cursor()

	# 	dic = dict(parse.parse_qsl(parse.urlsplit(self.path).query))
	# 	self.send_response(200)
	# 	self.send_header('Content-type','application/json; charset=utf-8')
	# 	self.end_headers()

	# 	if "student_id" in dic:
	# 		cursor.execute("SELECT * FROM students WHERE id = %(student_id)s",{'student_id': dic["student_id"]})
	# 		values_array = list(cursor.fetchone())
	# 		col_names = [desc[0] for desc in cursor.description]
	# 		message	= dict(zip(col_names, values_array))
	# 	else:
	# 		message = {"error": "Please provide student_id"}

	# 	self.wfile.write(json.dumps(message, default=str).encode())
	# 	return